import type { SupabaseClient } from "@supabase/supabase-js";
import { buildCaseBrief } from "@/lib/simulator/case-brief";
import type { VariantSnapshot } from "@/lib/cert/variant-engine";
import {
  emptyFormState,
  mergeFormState,
  type CaseBrief,
  type DocumentationFormState,
  type TranscriptTurn,
} from "@/lib/simulator/types";

type CaseInstanceRow = {
  id: string;
  template_id: string;
  user_id: string;
  status: string;
  variant_snapshot_json: unknown;
};

type ConversationTurnRow = {
  speaker: "persona" | "trainee";
  content: string;
};

type DocumentationRecordRow = {
  intake_json: Partial<DocumentationFormState["intake"]> | null;
  inquiry_json: Partial<DocumentationFormState["inquiry"]> | null;
  safety_json: Partial<DocumentationFormState["safety"]> | null;
  response_json: Partial<DocumentationFormState["response"]> | null;
  closure_json: Partial<DocumentationFormState["closure"]> | null;
  submitted_at: string | null;
};

export type LoadedCaseInstance = {
  instanceId: string;
  status: string;
  isOwner: boolean;
  brief: CaseBrief;
  formState: DocumentationFormState;
  submittedAt: string | null;
  /** Saved live-persona chat history for this instance, oldest first. */
  conversationTurns: TranscriptTurn[];
};

/**
 * Loads a case_instance for the workspace/history views, verifying it
 * belongs to the current user (RLS also enforces this; this produces a
 * clean null instead of relying solely on an opaque RLS rejection), then
 * builds the client-safe CaseBrief and hydrates any saved documentation
 * record into form state.
 */
export async function loadCaseInstance(
  supabase: SupabaseClient,
  instanceId: string,
  userId: string,
  options: { openBook: boolean }
): Promise<LoadedCaseInstance | null> {
  const { data: instance, error } = await supabase
    .from("case_instances")
    .select("id, template_id, user_id, status, variant_snapshot_json")
    .eq("id", instanceId)
    .maybeSingle<CaseInstanceRow>();

  if (error || !instance || instance.user_id !== userId) {
    return null;
  }

  const brief = await buildCaseBrief(supabase, instance.template_id, {
    openBook: options.openBook,
    variant: (instance.variant_snapshot_json as VariantSnapshot | null) ?? null,
  });

  if (!brief) return null;

  const { data: docRecord } = await supabase
    .from("documentation_records")
    .select("intake_json, inquiry_json, safety_json, response_json, closure_json, submitted_at")
    .eq("case_instance_id", instanceId)
    .maybeSingle<DocumentationRecordRow>();

  let conversationTurns: TranscriptTurn[] = [];
  if (brief.hasLivePersona) {
    const { data: turnRows } = await supabase
      .from("conversation_turns")
      .select("speaker, content")
      .eq("case_instance_id", instanceId)
      .order("ts", { ascending: true });
    conversationTurns = ((turnRows ?? []) as ConversationTurnRow[]).map((r) => ({
      speaker: r.speaker,
      content: r.content,
    }));
  }

  const base = emptyFormState(brief.contact_prefill);
  const formState = docRecord
    ? mergeFormState(base, {
        intake: { ...base.intake, ...(docRecord.intake_json ?? {}) },
        inquiry: { ...base.inquiry, ...(docRecord.inquiry_json ?? {}) },
        safety: { ...base.safety, ...(docRecord.safety_json ?? {}) },
        response: { ...base.response, ...(docRecord.response_json ?? {}) },
        closure: { ...base.closure, ...(docRecord.closure_json ?? {}) },
      })
    : base;

  return {
    instanceId: instance.id,
    status: instance.status,
    isOwner: true,
    brief,
    formState,
    submittedAt: docRecord?.submitted_at ?? null,
    conversationTurns,
  };
}
