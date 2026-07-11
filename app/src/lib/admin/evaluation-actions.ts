"use server";

// =============================================================================
// PENDING EVALUATIONS + RETRY (spec_admin-dashboard.md §4.6 — SEC-4)
//
// submitCase deliberately swallows evaluation failures (a submission must
// never be lost to an LLM outage), so outages leave case_instances silently
// 'submitted' with no evaluation_scores rows. This module lists those
// instances and re-runs the evaluation pipeline on demand.
//
// The LIST is a cross-org read: an org admin's RLS view of case_instances
// already covers their org, but the anti-join against evaluation_scores and
// the requester's email are simplest and consistent through the service
// client — so BOTH functions verify the caller via getUserRole() FIRST, and
// org admins are hard-filtered to their own org_id before any row leaves
// this module.
//
// RETRY mirrors submitCase's inline evaluation exactly:
//   loadEvaluationCaseData (the sanctioned ground-truth reader) +
//   conversation_turns transcript + documentation_records form state →
//   evaluateCase → persistEvaluation. Costs one Anthropic API call —
//   acceptable, it is admin-triggered. Every retry writes audit_log.
// =============================================================================

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getUserRole } from "@/lib/auth/get-user-role";
import { writeAuditLog } from "@/lib/audit/log";
import { loadEvaluationCaseData } from "@/lib/simulator/case-brief";
import { evaluateCase, persistEvaluation } from "@/lib/evaluator/evaluate";
import {
  emptyFormState,
  mergeFormState,
  type DocumentationFormState,
  type TranscriptTurn,
} from "@/lib/simulator/types";

type AdminContext = {
  userId: string;
  role: "admin" | "platform_admin";
  orgId: string | null;
};

async function requireAdminContext(): Promise<
  { ok: true; ctx: AdminContext } | { ok: false; error: string }
> {
  const role = await getUserRole();
  if (role !== "admin" && role !== "platform_admin") {
    return { ok: false, error: "Not authorized." };
  }
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { ok: false, error: "Not authenticated." };
  }
  const { data } = await supabase
    .from("users")
    .select("org_id")
    .eq("id", user.id)
    .maybeSingle<{ org_id: string | null }>();
  return { ok: true, ctx: { userId: user.id, role, orgId: data?.org_id ?? null } };
}

export type PendingEvaluation = {
  instanceId: string;
  caseCode: string | null;
  caseTitle: string;
  userEmail: string | null;
  submittedAt: string | null;
  closedAt: string | null;
};

export type ListPendingResult =
  | { ok: true; viewerRole: "admin" | "platform_admin"; pending: PendingEvaluation[] }
  | { ok: false; error: string };

type PendingRow = {
  id: string;
  org_id: string | null;
  closed_at: string | null;
  evaluation_scores: { id: string }[];
  case_templates: { title: string; case_code: string | null } | null;
  users: { email: string | null } | null;
  documentation_records: { submitted_at: string | null }[];
};

/** Submitted instances with no evaluation_scores row — SEC-4 outage backlog. */
export async function listPendingEvaluations(): Promise<ListPendingResult> {
  const auth = await requireAdminContext();
  if (!auth.ok) return auth;
  const { ctx } = auth;

  // Org admin with no org has no roster to oversee — nothing to show.
  if (ctx.role === "admin" && !ctx.orgId) {
    return { ok: true, viewerRole: ctx.role, pending: [] };
  }

  // Service-role read AFTER the role check above; org admins hard-filtered.
  const admin = createAdminClient();
  let query = admin
    .from("case_instances")
    .select(
      "id, org_id, closed_at, evaluation_scores(id), case_templates(title, case_code), users(email), documentation_records(submitted_at)"
    )
    .eq("status", "submitted")
    .order("closed_at", { ascending: false });
  if (ctx.role === "admin") {
    query = query.eq("org_id", ctx.orgId);
  }

  const { data, error } = await query.returns<PendingRow[]>();
  if (error) {
    return { ok: false, error: error.message };
  }

  const pending: PendingEvaluation[] = (data ?? [])
    .filter((row) => row.evaluation_scores.length === 0)
    .map((row) => ({
      instanceId: row.id,
      caseCode: row.case_templates?.case_code ?? null,
      caseTitle: row.case_templates?.title ?? "Untitled case",
      userEmail: row.users?.email ?? null,
      submittedAt: row.documentation_records[0]?.submitted_at ?? null,
      closedAt: row.closed_at,
    }));

  return { ok: true, viewerRole: ctx.role, pending };
}

export type RetryEvaluationResult = { ok: true } | { ok: false; error: string };

/**
 * Re-runs the evaluation pipeline for one submitted-but-unevaluated
 * instance. On success the instance moves to 'evaluated' (persistEvaluation
 * does that) and drops off the pending list.
 */
export async function retryEvaluation(instanceId: string): Promise<RetryEvaluationResult> {
  const auth = await requireAdminContext();
  if (!auth.ok) return auth;
  const { ctx } = auth;

  const admin = createAdminClient();
  const { data: instance, error: instanceError } = await admin
    .from("case_instances")
    .select("id, template_id, user_id, org_id, status, started_at, closed_at")
    .eq("id", instanceId)
    .maybeSingle<{
      id: string;
      template_id: string;
      user_id: string;
      org_id: string | null;
      status: string;
      started_at: string | null;
      closed_at: string | null;
    }>();

  if (instanceError || !instance) {
    return { ok: false, error: "Case instance not found." };
  }
  // Org admin may only retry instances in their own org.
  if (ctx.role === "admin" && (!ctx.orgId || instance.org_id !== ctx.orgId)) {
    return { ok: false, error: "Not authorized for this case instance." };
  }
  if (instance.status !== "submitted") {
    return { ok: false, error: `Instance is '${instance.status}', not 'submitted' — nothing to retry.` };
  }

  // Guard against double-scoring if two admins race the same row.
  const { count } = await admin
    .from("evaluation_scores")
    .select("id", { count: "exact", head: true })
    .eq("case_instance_id", instanceId);
  if ((count ?? 0) > 0) {
    return { ok: false, error: "This instance already has evaluation scores." };
  }

  try {
    // Same pipeline as submitCase's inline evaluation. Ground truth is read
    // by loadEvaluationCaseData (the SEC-9 sanctioned reader) — the caller's
    // RLS-scoped client is passed so instance visibility stays tenant-scoped.
    const supabase = await createClient();
    const caseData = await loadEvaluationCaseData(supabase, instanceId);
    if (!caseData) {
      return { ok: false, error: "Could not load evaluation case data (answer key missing?)." };
    }

    const { data: turnRows } = await supabase
      .from("conversation_turns")
      .select("speaker, content")
      .eq("case_instance_id", instanceId)
      .order("ts", { ascending: true });
    const transcript = (turnRows ?? []) as TranscriptTurn[];

    const { data: docRecord } = await supabase
      .from("documentation_records")
      .select("intake_json, inquiry_json, safety_json, response_json, closure_json, submitted_at")
      .eq("case_instance_id", instanceId)
      .maybeSingle<{
        intake_json: Partial<DocumentationFormState["intake"]> | null;
        inquiry_json: Partial<DocumentationFormState["inquiry"]> | null;
        safety_json: Partial<DocumentationFormState["safety"]> | null;
        response_json: Partial<DocumentationFormState["response"]> | null;
        closure_json: Partial<DocumentationFormState["closure"]> | null;
        submitted_at: string | null;
      }>();
    if (!docRecord) {
      return { ok: false, error: "No documentation record found for this instance." };
    }

    // Hydrate the submitted form the same way lib/simulator/instance.ts does.
    const base = emptyFormState({});
    const doc = mergeFormState(base, {
      intake: { ...base.intake, ...(docRecord.intake_json ?? {}) },
      inquiry: { ...base.inquiry, ...(docRecord.inquiry_json ?? {}) },
      safety: { ...base.safety, ...(docRecord.safety_json ?? {}) },
      response: { ...base.response, ...(docRecord.response_json ?? {}) },
      closure: { ...base.closure, ...(docRecord.closure_json ?? {}) },
    });

    const { record } = await evaluateCase({
      caseInstanceId: instanceId,
      caseTemplateId: caseData.caseTemplateId,
      variantRef: caseData.variantRef,
      channel: "text",
      groundTruthJson: caseData.groundTruthJson,
      transcript,
      doc,
      receivedAt: instance.started_at ?? docRecord.submitted_at ?? new Date().toISOString(),
      sopTimeframeBusinessDays: caseData.sopTimeframeBusinessDays,
    });

    await persistEvaluation({
      record: record as Parameters<typeof persistEvaluation>[0]["record"],
      userId: instance.user_id,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[evaluation] admin retry failed", { instanceId, err: message });
    return { ok: false, error: `Evaluation retry failed: ${message}` };
  }

  await writeAuditLog({
    actorId: ctx.userId,
    orgId: instance.org_id,
    action: "evaluation.retry",
    targetType: "case_instances",
    targetId: instanceId,
  });

  revalidatePath("/admin/evaluations");
  revalidatePath("/history");
  return { ok: true };
}
