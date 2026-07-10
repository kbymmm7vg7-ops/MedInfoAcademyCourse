/* eslint-disable no-console */
// =============================================================================
// READER-REFACTOR SMOKE (S7 step 0) — exercises every sanctioned reader that
// migration 0007 (SEC-1/SEC-2) rewired to the service-role answer-key store:
//
//   1. loadQueueRows           — queue flags + SLA hint from case_answer_keys
//   2. buildCaseBrief          — open-book brief incl. SRL bodies from
//                                srd_document_bodies (and closed-book without)
//   3. buildPersonaSystemPromptForTemplate → runPersonaTurn (ONE short paid
//                                Sonnet call) — persona prompt assembly
//   4. loadEvaluationCaseData  — evaluator ground-truth assembly
//
// Uses the service client as the "RLS" client stand-in (the RLS denial side
// is proven separately by supabase/tests/rls-two-org-test.sql probes 7a/7b).
//
// Usage: cd app && npx tsx scripts/smoke-readers.ts [--no-api]
// =============================================================================

import { readFileSync, existsSync } from "fs";
import { join } from "path";

const envPath = join(__dirname, "../.env.local");
if (existsSync(envPath)) {
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim();
  }
}

const NO_API = process.argv.includes("--no-api");

async function main(): Promise<number> {
  const { createAdminClient } = await import("../src/lib/supabase/admin");
  const { buildCaseBrief, buildPersonaSystemPromptForTemplate, loadEvaluationCaseData } = await import(
    "../src/lib/simulator/case-brief"
  );
  const { loadQueueRows } = await import("../src/lib/simulator/queue");

  const supabase = createAdminClient();
  let failures = 0;
  const check = (name: string, ok: boolean, detail = "") => {
    console.log(`${ok ? "✓" : "✗"} ${name}${detail ? ` — ${detail}` : ""}`);
    if (!ok) failures++;
  };

  // --- 1. queue ---------------------------------------------------------------
  const rows = await loadQueueRows(supabase, "00000000-0000-4000-8000-000000000000");
  check("queue: 12 shared cases", rows.length === 12, `${rows.length} rows`);
  check("queue: persona flags populated", rows.every((r) => r.hasLivePersona), "all hasLivePersona");
  // SC-01 and SC-09's approved keys have no sop_timeframe field — expect 10/12.
  const withSla = rows.filter((r) => r.sopTimeframeBusinessDays != null).length;
  check("queue: SLA hints populated (10/12 have the field)", withSla === 10, `${withSla} populated`);

  // --- 2. case brief (open + closed book) --------------------------------------
  const sc03 = rows.find((r) => r.caseCode === "SC-03");
  if (!sc03) {
    check("SC-03 present in queue", false);
    return 1;
  }
  const open = await buildCaseBrief(supabase, sc03.templateId, { openBook: true });
  check("brief(open): built", open != null);
  check("brief(open): SRL candidates", (open?.srl_candidates.length ?? 0) > 1, `${open?.srl_candidates.length} candidates`);
  check(
    "brief(open): SRL bodies present",
    (open?.srl_candidates ?? []).every((c) => typeof c.body === "string" && c.body.length > 100)
  );
  const closed = await buildCaseBrief(supabase, sc03.templateId, { openBook: false });
  check(
    "brief(closed): NO SRL bodies",
    (closed?.srl_candidates ?? []).every((c) => c.body === undefined)
  );
  check("brief: contact prefill", Boolean(open?.contact_prefill?.name));

  // --- 3. persona prompt + one short turn --------------------------------------
  const personaPrompt = await buildPersonaSystemPromptForTemplate(supabase, sc03.templateId);
  check("persona prompt: assembled", (personaPrompt?.length ?? 0) > 500, `${personaPrompt?.length} chars`);
  if (!NO_API && personaPrompt) {
    const { runPersonaTurn } = await import("../src/lib/persona/engine");
    const reply = await runPersonaTurn({
      systemPrompt: personaPrompt,
      history: [],
      traineeMessage: "Medical Information, thank you for calling. How can I help you today?",
      graded: false,
    });
    check("persona turn: non-empty reply", Boolean(reply && reply.length > 10), `"${reply.slice(0, 80)}..."`);
  } else {
    console.log("· persona turn skipped (--no-api)");
  }

  // --- 4. evaluator case data ---------------------------------------------------
  const { data: anyInstance } = await supabase
    .from("case_instances")
    .select("id")
    .limit(1)
    .maybeSingle<{ id: string }>();
  if (anyInstance) {
    const evalData = await loadEvaluationCaseData(supabase, anyInstance.id);
    check(
      "evaluator: ground truth loads",
      evalData != null && Object.keys(evalData.groundTruthJson).length > 3,
      evalData ? `${Object.keys(evalData.groundTruthJson).length} gt keys` : "null"
    );
  } else {
    console.log("· evaluator case data skipped (no case_instances in DB)");
  }

  console.log(failures === 0 ? "\n✅ reader smoke green" : `\n❌ ${failures} smoke failure(s)`);
  return failures === 0 ? 0 : 1;
}

main().then(
  (code) => process.exit(code),
  (err) => {
    console.error(err);
    process.exit(1);
  }
);
