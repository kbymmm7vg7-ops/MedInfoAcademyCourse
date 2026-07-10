import type { SupabaseClient } from "@supabase/supabase-js";
import { parseTranscript } from "@/lib/simulator/case-brief";
import { createAdminClient } from "@/lib/supabase/admin";

// Client-safe row shapes for the case queue. These deliberately select only
// the columns needed to render the queue — never ground_truth_json. See
// src/lib/simulator/case-brief.ts for the full-brief projection used once a
// case is opened.

export type QueueCaseStatus = "not_started" | "in_progress" | "submitted";

export type QueueRow = {
  templateId: string;
  caseCode: string | null;
  title: string;
  difficulty: number;
  productRef: string | null;
  hasScriptedTranscript: boolean;
  /** true when the case has a live persona; queue shows a "Live persona" chip */
  hasLivePersona: boolean;
  sopTimeframeBusinessDays: number | null;
  status: QueueCaseStatus;
  instanceId: string | null;
};

type CaseTemplateQueueRow = {
  id: string;
  case_code: string | null;
  title: string;
  difficulty: number;
  product_ref: string | null;
};

type QueueAnswerKeyRow = {
  template_id: string;
  ground_truth_json: { sop_timeframe_business_days?: number } | null;
  persona_brief_json: unknown;
  scripted_transcript_json: unknown;
};

type CaseInstanceQueueRow = {
  id: string;
  template_id: string;
  status: string;
  created_at: string;
};

function mapInstanceStatus(status: string): QueueCaseStatus {
  if (status === "submitted" || status === "evaluated" || status === "closed") {
    return "submitted";
  }
  if (status === "not_started") return "not_started";
  return "in_progress";
}

/**
 * Loads the shared case bank (org_id is null) joined with the current
 * user's most recent case_instances, for rendering /simulator.
 *
 * NOTE: the answer key (case_answer_keys, service-role-only since SEC-1) is
 * read here ONLY to pluck sop_timeframe_business_days (an SLA hint safe to
 * show in the queue) and derive the has-transcript / has-persona chips. The
 * template list itself comes through the RLS-scoped client, so a user only
 * ever gets flags for cases they can already see. No other answer-key field
 * is read or returned.
 */
export async function loadQueueRows(
  supabase: SupabaseClient,
  userId: string
): Promise<QueueRow[]> {
  const { data: templates, error: templatesError } = await supabase
    .from("case_templates")
    .select("id, case_code, title, difficulty, product_ref")
    .is("org_id", null)
    .eq("rubric_approved", true) // drafts/edited cases stay out of trainee queues (spec §4.3)
    .order("case_code", { ascending: true });

  if (templatesError || !templates) return [];

  const rows = templates as CaseTemplateQueueRow[];

  const keyByTemplate = new Map<string, QueueAnswerKeyRow>();
  if (rows.length > 0) {
    const admin = createAdminClient();
    const { data: keys } = await admin
      .from("case_answer_keys")
      .select("template_id, ground_truth_json, persona_brief_json, scripted_transcript_json")
      .in("template_id", rows.map((r) => r.id));
    for (const key of (keys ?? []) as QueueAnswerKeyRow[]) {
      keyByTemplate.set(key.template_id, key);
    }
  }

  const { data: instances } = await supabase
    .from("case_instances")
    .select("id, template_id, status, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  const instanceByTemplate = new Map<string, CaseInstanceQueueRow>();
  for (const inst of (instances ?? []) as CaseInstanceQueueRow[]) {
    // Most recent instance per template wins (already ordered desc).
    if (!instanceByTemplate.has(inst.template_id)) {
      instanceByTemplate.set(inst.template_id, inst);
    }
  }

  return rows.map((row) => {
    const instance = instanceByTemplate.get(row.id) ?? null;
    const key = keyByTemplate.get(row.id) ?? null;
    return {
      templateId: row.id,
      caseCode: row.case_code,
      title: row.title,
      difficulty: row.difficulty,
      productRef: row.product_ref,
      hasScriptedTranscript: parseTranscript(key?.scripted_transcript_json).length > 0,
      hasLivePersona: key?.persona_brief_json != null,
      sopTimeframeBusinessDays: key?.ground_truth_json?.sop_timeframe_business_days ?? null,
      status: instance ? mapInstanceStatus(instance.status) : "not_started",
      instanceId: instance ? instance.id : null,
    };
  });
}
