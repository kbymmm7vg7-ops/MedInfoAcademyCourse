import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  CaseBrief,
  ContactPrefill,
  SrlCandidate,
  TranscriptTurn,
} from "@/lib/simulator/types";

// =============================================================================
// GROUND-TRUTH FIREWALL
// =============================================================================
// case_templates.ground_truth_json is the answer key for a case: it contains
// requester.type, safety.* (ae_present, seriousness, etc.), reveal_rules,
// correct_srl, inquiry_category, expected_outcome, and any other "what the
// trainee is supposed to arrive at" data.
//
// THIS FILE IS THE ONLY PLACE ALLOWED TO READ ground_truth_json. Every other
// server component / server action that needs case data MUST go through
// buildCaseBrief() below and pass the resulting CaseBrief (or a subset of it)
// to client components. Never `select("*")` or `select("ground_truth_json")`
// on case_templates outside this file, and never forward the raw row to a
// client component or client-invoked server action response.
//
// What crosses to the client from this projection:
//   id, case_code, title, difficulty, product_ref, therapeutic_area, channel,
//   scripted transcript turns, srl_candidates (correct_srl + decoy_srl_ids
//   MERGED AND SHUFFLED HERE, with no "correct" flag, hydrated to
//   {srl_code, title[, body]} from srd_documents — body only if open-book),
//   contact_prefill (from ground_truth_json.inquirer_contact — this is seed
//   persona flavor text, not an answer-key field), sop_timeframe_business_days.
//
// Explicitly NEVER forwarded: requester.type, safety.*, reveal_rules,
// correct_srl (the id itself, unflagged, is fine — but which shuffled entry
// IS correct is never indicated), inquiry_category, expected_outcome.
// =============================================================================

type GroundTruth = {
  requester?: { type?: string };
  safety?: Record<string, unknown>;
  reveal_rules?: unknown;
  correct_srl?: string | { id?: string; srl_id?: string };
  decoy_srl_ids?: string[];
  inquiry_category?: string;
  expected_outcome?: unknown;
  inquirer_contact?: ContactPrefill;
  sop_timeframe_business_days?: number;
  channel?: "chat" | "voice";
};

type CaseTemplateRow = {
  id: string;
  case_code: string | null;
  title: string;
  difficulty: number;
  product_ref: string | null;
  therapeutic_area: string | null;
  scripted_transcript_json: unknown;
  ground_truth_json: GroundTruth | null;
};

type SrdDocumentRow = {
  id: string;
  srl_code: string | null;
  title: string;
  body: string;
};

/** Fisher-Yates, server-side only, seeded from Math.random per request. */
function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// Canonical seed shape: {"mode":"scripted","turns":[{"speaker":"persona"|"trainee","text":"..."}]}
// A bare array of turns is accepted too. Turn text may be keyed `text` or `content`.
export function parseTranscript(raw: unknown): TranscriptTurn[] {
  const list = Array.isArray(raw)
    ? raw
    : raw && typeof raw === "object" && Array.isArray((raw as { turns?: unknown }).turns)
      ? ((raw as { turns: unknown[] }).turns)
      : [];
  const turns: TranscriptTurn[] = [];
  for (const entry of list) {
    if (!entry || typeof entry !== "object") continue;
    const e = entry as { speaker?: unknown; text?: unknown; content?: unknown };
    const text = typeof e.text === "string" ? e.text : typeof e.content === "string" ? e.content : null;
    if ((e.speaker === "persona" || e.speaker === "trainee") && text !== null) {
      turns.push({ speaker: e.speaker, content: text });
    }
  }
  return turns;
}

function extractCorrectSrlId(correctSrl: GroundTruth["correct_srl"]): string | null {
  if (!correctSrl) return null;
  if (typeof correctSrl === "string") return correctSrl;
  return correctSrl.id ?? correctSrl.srl_id ?? null;
}

/**
 * Builds the client-safe CaseBrief for one case template.
 *
 * @param supabase server-side Supabase client (RLS-scoped to the current user)
 * @param templateId case_templates.id to project
 * @param options.openBook whether to include SRL body text in srl_candidates
 */
export async function buildCaseBrief(
  supabase: SupabaseClient,
  templateId: string,
  options: { openBook: boolean }
): Promise<CaseBrief | null> {
  const { data: template, error } = await supabase
    .from("case_templates")
    .select(
      "id, case_code, title, difficulty, product_ref, therapeutic_area, scripted_transcript_json, ground_truth_json"
    )
    .eq("id", templateId)
    .maybeSingle<CaseTemplateRow>();

  if (error || !template) return null;

  const gt = template.ground_truth_json ?? {};

  const correctId = extractCorrectSrlId(gt.correct_srl);
  const decoyIds = Array.isArray(gt.decoy_srl_ids) ? gt.decoy_srl_ids : [];
  const allSrlIds = [...new Set([...(correctId ? [correctId] : []), ...decoyIds])];

  let srlCandidates: SrlCandidate[] = [];
  if (allSrlIds.length > 0) {
    // ground truth references SRLs by srl_code (e.g. "SRL-PUL-CANDID"), not uuid
    const { data: srdRows } = await supabase
      .from("srd_documents")
      .select("id, srl_code, title, body")
      .in("srl_code", allSrlIds);

    const rows = (srdRows ?? []) as SrdDocumentRow[];
    const byCode = new Map(rows.map((r) => [r.srl_code, r]));

    const hydrated: SrlCandidate[] = [];
    for (const code of allSrlIds) {
      const row = byCode.get(code);
      if (!row) continue; // skip codes that don't resolve; never leak the code alone
      hydrated.push({
        id: row.id,
        srl_code: row.srl_code,
        title: row.title,
        ...(options.openBook ? { body: row.body } : {}),
      });
    }
    // Shuffle server-side; no field anywhere indicates which one is correct.
    srlCandidates = shuffle(hydrated);
  }

  const contactPrefill: ContactPrefill = gt.inquirer_contact ?? {};

  return {
    id: template.id,
    case_code: template.case_code,
    title: template.title,
    difficulty: template.difficulty,
    product_ref: template.product_ref,
    therapeutic_area: template.therapeutic_area,
    channel: gt.channel === "voice" ? "voice" : "chat",
    hasScriptedTranscript: parseTranscript(template.scripted_transcript_json).length > 0,
    transcript: parseTranscript(template.scripted_transcript_json),
    srl_candidates: srlCandidates,
    contact_prefill: contactPrefill,
    sop_timeframe_business_days: gt.sop_timeframe_business_days ?? null,
  };
}
