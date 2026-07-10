"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getTrainingGate } from "@/lib/training/gate";
import type { DocumentationFormState } from "@/lib/simulator/types";

// -----------------------------------------------------------------------------
// startOrResumeCase
// Creates a case_instance for the given template if the current user has no
// active (non-submitted) instance for it, otherwise resumes the most recent
// one. Redirects into the case workspace either way.
// -----------------------------------------------------------------------------
export async function startOrResumeCase(templateId: string): Promise<never> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Training & Orientation gates the simulator (PRD §5.0) — server-side.
  const gate = await getTrainingGate(supabase, user.id);
  if (!gate.complete) {
    redirect("/training?locked=1");
  }

  const { data: existing } = await supabase
    .from("case_instances")
    .select("id, status")
    .eq("user_id", user.id)
    .eq("template_id", templateId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle<{ id: string; status: string }>();

  if (existing && existing.status !== "submitted" && existing.status !== "evaluated" && existing.status !== "closed") {
    redirect(`/simulator/case/${existing.id}`);
  }

  const { data: userRow } = await supabase
    .from("users")
    .select("org_id")
    .eq("id", user.id)
    .maybeSingle<{ org_id: string | null }>();

  const { data: created, error } = await supabase
    .from("case_instances")
    .insert({
      template_id: templateId,
      user_id: user.id,
      org_id: userRow?.org_id ?? null,
      channel: "chat",
      status: "in_progress",
      started_at: new Date().toISOString(),
    })
    .select("id")
    .single<{ id: string }>();

  if (error || !created) {
    throw new Error(`Could not start case: ${error?.message ?? "unknown error"}`);
  }

  revalidatePath("/simulator");
  redirect(`/simulator/case/${created.id}`);
}

// -----------------------------------------------------------------------------
// Ownership check shared by save/submit actions.
// RLS also enforces this at the database level; this check exists purely to
// produce a clean, actionable error instead of an opaque RLS rejection.
// -----------------------------------------------------------------------------
async function assertOwnsInstance(
  supabase: Awaited<ReturnType<typeof createClient>>,
  instanceId: string,
  userId: string
): Promise<void> {
  const { data, error } = await supabase
    .from("case_instances")
    .select("id")
    .eq("id", instanceId)
    .eq("user_id", userId)
    .maybeSingle<{ id: string }>();

  if (error || !data) {
    throw new Error("This case instance does not belong to you or could not be found.");
  }
}

export type SaveDraftResult = { ok: true } | { ok: false; error: string };

// -----------------------------------------------------------------------------
// saveDraft — upserts the working form state into documentation_records.
// Called on tab switch (autosave) and via an explicit "Save draft" button.
// -----------------------------------------------------------------------------
export async function saveDraft(
  instanceId: string,
  formState: DocumentationFormState
): Promise<SaveDraftResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, error: "Not authenticated." };
  }

  try {
    await assertOwnsInstance(supabase, instanceId, user.id);
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Not authorized." };
  }

  const { data: existing } = await supabase
    .from("documentation_records")
    .select("id")
    .eq("case_instance_id", instanceId)
    .maybeSingle<{ id: string }>();

  const payload = {
    case_instance_id: instanceId,
    intake_json: formState.intake,
    inquiry_json: formState.inquiry,
    safety_json: formState.safety,
    response_json: formState.response,
    closure_json: formState.closure,
  };

  const { error } = existing
    ? await supabase.from("documentation_records").update(payload).eq("id", existing.id)
    : await supabase.from("documentation_records").insert(payload);

  if (error) {
    return { ok: false, error: error.message };
  }

  return { ok: true };
}

export type SubmitCaseResult = { ok: true } | { ok: false; error: string };

// -----------------------------------------------------------------------------
// submitCase — final upsert + status transition. Redirects to the submitted
// stub on success. Blocked (defense in depth) unless qc_self_check is true;
// the Closure tab UI already enforces this, this is the server-side backstop.
// -----------------------------------------------------------------------------
export async function submitCase(
  instanceId: string,
  formState: DocumentationFormState
): Promise<SubmitCaseResult | never> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, error: "Not authenticated." };
  }

  if (!formState.closure.qc_self_check) {
    return { ok: false, error: "Complete the QC self-check before submitting." };
  }

  try {
    await assertOwnsInstance(supabase, instanceId, user.id);
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Not authorized." };
  }

  const nowIso = new Date().toISOString();

  const { data: existing } = await supabase
    .from("documentation_records")
    .select("id")
    .eq("case_instance_id", instanceId)
    .maybeSingle<{ id: string }>();

  const payload = {
    case_instance_id: instanceId,
    intake_json: formState.intake,
    inquiry_json: formState.inquiry,
    safety_json: formState.safety,
    response_json: formState.response,
    closure_json: formState.closure,
    submitted_at: nowIso,
  };

  const { error: docError } = existing
    ? await supabase.from("documentation_records").update(payload).eq("id", existing.id)
    : await supabase.from("documentation_records").insert(payload);

  if (docError) {
    return { ok: false, error: docError.message };
  }

  const { error: instanceError } = await supabase
    .from("case_instances")
    .update({ status: "submitted", closed_at: nowIso })
    .eq("id", instanceId);

  if (instanceError) {
    return { ok: false, error: instanceError.message };
  }

  // Evaluate inline when configured; otherwise the case stays 'submitted'
  // (pending) until keys exist. Evaluation failure must never lose a submit.
  try {
    const { loadEvaluationCaseData } = await import("@/lib/simulator/case-brief");
    const { evaluateCase, persistEvaluation } = await import("@/lib/evaluator/evaluate");
    const caseData = await loadEvaluationCaseData(supabase, instanceId);
    const { data: instRow } = await supabase
      .from("case_instances")
      .select("started_at")
      .eq("id", instanceId)
      .maybeSingle<{ started_at: string | null }>();
    const { data: turnRows } = await supabase
      .from("conversation_turns")
      .select("speaker, content")
      .eq("case_instance_id", instanceId)
      .order("ts", { ascending: true });
    if (caseData) {
      const { record } = await evaluateCase({
        caseInstanceId: instanceId,
        caseTemplateId: caseData.caseTemplateId,
        variantRef: caseData.variantRef,
        channel: "text",
        groundTruthJson: caseData.groundTruthJson,
        transcript: (turnRows ?? []) as { speaker: "persona" | "trainee"; content: string }[],
        doc: formState,
        receivedAt: instRow?.started_at ?? nowIso,
        sopTimeframeBusinessDays: caseData.sopTimeframeBusinessDays,
      });
      await persistEvaluation({
        record: record as Parameters<typeof persistEvaluation>[0]["record"],
        userId: user.id,
      });
    }
  } catch (err) {
    // missing ANTHROPIC_API_KEY / SUPABASE_SERVICE_ROLE_KEY or transient LLM
    // failure: submission stands, evaluation stays pending. SEC-4: log it
    // structured so outages are visible; the admin pending-evaluations view
    // lists these instances and offers retry.
    console.error("[evaluation] inline evaluation failed; case stays pending", {
      instanceId,
      err: err instanceof Error ? err.message : String(err),
    });
  }

  // Sittings (practice/certification) link to their attempt row via
  // variant_ref = variant seed; stamp completion. pass_bool stays null until
  // the evaluator (S4) scores it — burn/lock derive from that later.
  const { data: inst } = await supabase
    .from("case_instances")
    .select("variant_snapshot_json")
    .eq("id", instanceId)
    .maybeSingle<{ variant_snapshot_json: { seed?: string } | null }>();
  const seed = inst?.variant_snapshot_json?.seed;
  if (seed) {
    // SEC-7: a certification sitting submitted past the 24h window is voided
    // (not completed) — it never counts as the first attempt and never burns.
    const { data: attemptRow } = await supabase
      .from("accreditation_attempts")
      .select("id, case_template_id, attempt_type, is_first_attempt_on_case, pass_bool, variant_ref, completed_at, created_at, voided_at")
      .eq("user_id", user.id)
      .eq("variant_ref", seed)
      .is("completed_at", null)
      .maybeSingle<{ id: string } & import("@/lib/cert/logic").AttemptRow>();
    if (attemptRow) {
      const { isExpiredPendingSitting } = await import("@/lib/cert/logic");
      if (isExpiredPendingSitting(attemptRow, nowIso)) {
        const { createAdminClient } = await import("@/lib/supabase/admin");
        const { writeAuditLog } = await import("@/lib/audit/log");
        await createAdminClient()
          .from("accreditation_attempts")
          .update({ voided_at: nowIso })
          .eq("id", attemptRow.id)
          .is("voided_at", null);
        await writeAuditLog({
          actorId: user.id,
          action: "cert.sitting.void",
          targetType: "accreditation_attempts",
          targetId: attemptRow.id,
        });
      } else {
        await supabase
          .from("accreditation_attempts")
          .update({ completed_at: nowIso })
          .eq("id", attemptRow.id)
          .is("completed_at", null);
      }
    }
  }

  revalidatePath("/simulator");
  revalidatePath("/history");
  redirect(`/simulator/case/${instanceId}/submitted`);
}
