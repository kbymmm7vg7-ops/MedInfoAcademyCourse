// =============================================================================
// LIVE END-TO-END SPEC — READS/WRITES A REAL DATABASE AND SPENDS REAL CREDIT.
// =============================================================================
// This spec signs in as a real seeded trainee, starts a real case instance,
// sends real persona chat turns (which call the configured LLM provider —
// this DOES spend real LLM credit unless the target deployment is running
// with LLM_PROVIDER=fake), fills and submits real documentation, and then
// reads back a real `evaluation_scores` row. It is NOT a mock.
//
// Point E2E_SUPABASE_URL / E2E_SUPABASE_ANON_KEY at a THROWAWAY or LOCAL
// Supabase project only — never production — and seed it with a trainee
// account (E2E_TRAINEE_EMAIL / E2E_TRAINEE_PASSWORD) that:
//   - has completed Training & Orientation (the simulator gate in
//     src/lib/training/gate.ts redirects anyone who hasn't), and
//   - can see case SC-09 in its org's case bank.
//
// Case instances are never deleted by this spec (trainees have no delete
// path). Once SC-09 reaches "submitted"/"evaluated" for a given trainee, the
// queue's action button becomes "View" and — per
// src/components/simulator/start-case-button.tsx — clicking it navigates
// straight to the existing instance instead of starting a new one, so this
// spec's chat/documentation flow can only be exercised once per
// trainee+case. Re-run against a fresh throwaway project (or a fresh trainee)
// each time, or accept that a repeat run against the same project will fail
// at the "did not land on a fresh case" assertion below.
// =============================================================================

import { test, expect, type Page } from "@playwright/test";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

const E2E_SUPABASE_URL = process.env.E2E_SUPABASE_URL;
const E2E_SUPABASE_ANON_KEY = process.env.E2E_SUPABASE_ANON_KEY;
const E2E_TRAINEE_EMAIL = process.env.E2E_TRAINEE_EMAIL;
const E2E_TRAINEE_PASSWORD = process.env.E2E_TRAINEE_PASSWORD;

const HAS_E2E_ENV = Boolean(
  E2E_SUPABASE_URL && E2E_SUPABASE_ANON_KEY && E2E_TRAINEE_EMAIL && E2E_TRAINEE_PASSWORD
);

const CASE_CODE = "SC-09";

// Radio groups reuse "Yes"/"No" option labels across several sections on the
// same mounted tab (e.g. Safety's "ae_present" and "pc_present"), so a plain
// page.getByRole('radio', { name }) would be ambiguous. Each group sits
// inside its own Field (rendered as a <label> whose visible text is the
// section question — see src/components/simulator/field.tsx), so scope the
// radio lookup to that enclosing label.
function radioInSection(page: Page, sectionQuestion: string, optionLabel: string) {
  return page
    .locator("label", { hasText: sectionQuestion })
    .getByRole("radio", { name: optionLabel, exact: true });
}

async function sendPersonaTurn(page: Page, message: string): Promise<void> {
  const chatMessages = page.locator("div.flex-1.space-y-3.overflow-y-auto.px-4.py-4");
  const personaRepliesBefore = await chatMessages.locator("div.bg-slate-100.text-slate-800").count();

  const textarea = page.getByPlaceholder(/Type your response/);
  await textarea.fill(message);

  const [response] = await Promise.all([
    page.waitForResponse(
      (r) => r.url().includes("/api/persona/turn") && r.request().method() === "POST"
    ),
    page.getByRole("button", { name: "Send", exact: true }).click(),
  ]);
  expect(response.ok(), "POST /api/persona/turn should succeed").toBeTruthy();

  // One persona-styled bubble is appended per successful turn.
  await expect(chatMessages.locator("div.bg-slate-100.text-slate-800")).toHaveCount(
    personaRepliesBefore + 1
  );
}

test.describe("simulator: live case run (SC-09)", () => {
  test.skip(
    !HAS_E2E_ENV,
    "Set E2E_SUPABASE_URL, E2E_SUPABASE_ANON_KEY, E2E_TRAINEE_EMAIL and E2E_TRAINEE_PASSWORD to run this live spec."
  );

  test("trainee signs in, works case SC-09 through a live persona chat, documents and submits it, and is scored", async ({
    page,
  }) => {
    // ---------------------------------------------------------------------
    // 1. Sign in through the real login form (src/app/login/login-form.tsx).
    // ---------------------------------------------------------------------
    await page.goto("/login?redirectTo=%2Fsimulator");
    await page.locator("#email").fill(E2E_TRAINEE_EMAIL!);
    await page.locator("#password").fill(E2E_TRAINEE_PASSWORD!);
    await page.getByRole("button", { name: "Sign in" }).click();
    await page.waitForURL(/\/simulator$/);

    // ---------------------------------------------------------------------
    // 2. Start case SC-09 from the queue
    //    (src/app/(app)/simulator/page.tsx + start-case-button.tsx).
    // ---------------------------------------------------------------------
    const caseRow = page.locator("table tbody tr", { hasText: CASE_CODE });
    await expect(caseRow, `exactly one queue row for ${CASE_CODE}`).toHaveCount(1);

    await Promise.all([
      page.waitForURL(/\/simulator\/case\/[^/]+/),
      caseRow.getByRole("button").click(),
    ]);

    const caseMatch = page.url().match(/\/simulator\/case\/([^/]+)/);
    const instanceId = caseMatch?.[1];
    expect(instanceId, "case instance id parsed from the URL").toBeTruthy();
    expect(
      page.url().endsWith("/submitted"),
      `${CASE_CODE} already has a submitted/evaluated instance for this trainee — ` +
        "the queue's View action reopens it read-only-adjacent instead of starting a " +
        "fresh attempt. Re-run against a throwaway project (or trainee) that has not " +
        "already completed this case."
    ).toBe(false);

    // ---------------------------------------------------------------------
    // 3. Two live persona chat turns, each asserted to get a reply.
    // ---------------------------------------------------------------------
    await expect(page.getByPlaceholder(/Type your response/)).toBeVisible();
    await sendPersonaTurn(
      page,
      "Hi, thanks for calling — this is a synthetic E2E test turn, not a real inquiry. Can you tell me what's going on?"
    );
    await sendPersonaTurn(
      page,
      "Understood — synthetic E2E test turn two. Is there anything else you'd like to add?"
    );

    // ---------------------------------------------------------------------
    // 4. Fill the minimum documentation the form and actions.ts require.
    //    Only fields marked required (Field's `required` prop — see
    //    src/components/simulator/{intake,inquiry,safety,closure}-tab.tsx)
    //    are filled, plus the qc_self_check the server action in
    //    src/lib/simulator/actions.ts (submitCase) hard-blocks submission on.
    //    Requester type is set to "patient" and both Safety yes/no
    //    questions to "no" so Intake only needs the lighter contact set
    //    (see needsFullContactSet in intake-tab.tsx).
    // ---------------------------------------------------------------------

    // --- Intake tab ---
    await page.getByRole("tab", { name: "Intake" }).click();
    await page.getByLabel("Requester type").selectOption("patient");
    await page.getByLabel("Contact channel").selectOption({ index: 1 });
    const todayIso = new Date().toISOString().slice(0, 10);
    await page.getByLabel("Received date").fill(todayIso);
    await page.getByRole("radio", { name: "Solicited", exact: true }).check();
    await page.getByLabel("Product").selectOption({ index: 1 });
    await page.getByLabel("Inquiry category").selectOption({ index: 1 });
    // Required fields render their label as "<Label> *" (see Field in
    // src/components/simulator/field.tsx), so these are intentionally
    // substring matches, not exact — each is still unique on this mounted tab.
    await page.getByLabel("Name").fill("E2E Test Contact");
    await page.getByLabel("Background / credential").fill("Synthetic E2E placeholder background");
    await page.getByLabel("Phone").fill("555-010-0100");
    await page.getByLabel("City").fill("Springfield");
    await page.getByLabel("State").fill("00000");

    // --- Inquiry tab ---
    await page.getByRole("tab", { name: "Inquiry" }).click();
    await page
      .getByLabel("Inquiry summary")
      .fill("Synthetic E2E placeholder — inquiry summary text only.");
    await page
      .getByLabel("Verbatim question")
      .fill("Synthetic E2E placeholder — verbatim question text only.");

    // --- Safety tab ---
    await page.getByRole("tab", { name: "Safety" }).click();
    await radioInSection(page, "Any adverse event mentioned?", "No").check();
    await radioInSection(page, "Product complaint?", "No").check();

    // --- Closure tab ---
    await page.getByRole("tab", { name: "Closure" }).click();
    await radioInSection(page, "Follow-up needed?", "No").check();
    await page
      .getByLabel(/QC self-check confirmation/)
      .check();

    // ---------------------------------------------------------------------
    // 5. Submit.
    // ---------------------------------------------------------------------
    const submitButton = page.getByRole("button", { name: "Submit for Review" });
    await expect(submitButton).toBeEnabled();
    await Promise.all([
      page.waitForURL(/\/simulator\/case\/[^/]+\/submitted$/),
      submitButton.click(),
    ]);

    // ---------------------------------------------------------------------
    // 6. The submitted page.
    //    NOTE: as of this writing, src/app/(app)/simulator/case/[instanceId]/
    //    submitted/page.tsx is a static confirmation page carried over from
    //    before the evaluator existed ("The AI Evaluator arrives in S4") — it
    //    does not render a score anywhere in its markup, and nothing else in
    //    the submit flow surfaces one to the browser (src/app/(app)/history
    //    likewise only ever shows an "Awaiting evaluation" badge). We assert
    //    what the page actually shows — a successful submission — and treat
    //    the evaluation_scores row queried in step 7 as the authoritative
    //    "a score exists" check, since that is genuinely where the score
    //    lands today.
    // ---------------------------------------------------------------------
    await expect(page.getByRole("heading", { name: "Submitted for review" })).toBeVisible();

    // ---------------------------------------------------------------------
    // 7. Confirm a real evaluation_scores row exists, read back as the
    //    signed-in trainee (RLS policy `scores_select` on evaluation_scores
    //    — supabase/migrations/0002_rls_policies.sql — lets a trainee read
    //    scores for a case instance it owns; no service-role key is used
    //    here). submitCase awaits evaluation inline before redirecting, but
    //    poll briefly in case of read-replica lag.
    // ---------------------------------------------------------------------
    const supabase = createSupabaseClient(E2E_SUPABASE_URL!, E2E_SUPABASE_ANON_KEY!);
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: E2E_TRAINEE_EMAIL!,
      password: E2E_TRAINEE_PASSWORD!,
    });
    expect(signInError, "trainee sign-in to Supabase for the scores read").toBeNull();

    type ScoreRow = { dimension: string; score: number | null };
    let overallRow: ScoreRow | undefined;
    for (let attempt = 0; attempt < 10 && !overallRow; attempt++) {
      const { data, error } = await supabase
        .from("evaluation_scores")
        .select("dimension, score")
        .eq("case_instance_id", instanceId!);
      expect(error, "evaluation_scores read").toBeNull();
      overallRow = (data as ScoreRow[] | null)?.find((row) => row.dimension === "overall");
      if (!overallRow) await page.waitForTimeout(1000);
    }

    expect(
      overallRow,
      "an 'overall' evaluation_scores row for this case instance"
    ).toBeTruthy();
    expect(typeof overallRow?.score).toBe("number");
  });
});
