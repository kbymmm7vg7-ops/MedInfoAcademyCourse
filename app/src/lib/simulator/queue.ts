import type { SupabaseClient } from "@supabase/supabase-js";
import { parseTranscript } from "@/lib/simulator/case-brief";

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
  scripted_transcript_json: unknown;
  ground_truth_json: { sop_timeframe_business_days?: number } | null;
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
 * NOTE: ground_truth_json is read here ONLY to pluck
 * sop_timeframe_business_days (an SLA hint safe to show in the queue). No
 * other field of ground_truth_json is read or returned.
 */
export async function loadQueueRows(
  supabase: SupabaseClient,
  userId: string
): Promise<QueueRow[]> {
  const { data: templates, error: templatesError } = await supabase
    .from("case_templates")
    .select(
      "id, case_code, title, difficulty, product_ref, scripted_transcript_json, ground_truth_json"
    )
    .is("org_id", null)
    .order("case_code", { ascending: true });

  if (templatesError || !templates) return [];

  const rows = templates as CaseTemplateQueueRow[];

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
    return {
      templateId: row.id,
      caseCode: row.case_code,
      title: row.title,
      difficulty: row.difficulty,
      productRef: row.product_ref,
      hasScriptedTranscript: parseTranscript(row.scripted_transcript_json).length > 0,
      sopTimeframeBusinessDays: row.ground_truth_json?.sop_timeframe_business_days ?? null,
      status: instance ? mapInstanceStatus(instance.status) : "not_started",
      instanceId: instance ? instance.id : null,
    };
  });
}
