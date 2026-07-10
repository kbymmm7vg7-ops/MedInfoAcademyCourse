import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  CaseBrief,
  ContactPrefill,
  SrlCandidate,
  TranscriptTurn,
} from "@/lib/simulator/types";
import {
  buildPersonaSystemPrompt,
  type PersonaBrief,
  type PersonaGroundTruth,
} from "@/lib/persona/prompt";
import { seededShuffle, type VariantSnapshot } from "@/lib/cert/variant-engine";
import { createAdminClient } from "@/lib/supabase/admin";

// =============================================================================
// GROUND-TRUTH FIREWALL
// =============================================================================
// case_answer_keys.ground_truth_json is the answer key for a case: it contains
// requester.type, safety.* (ae_present, seriousness, etc.), reveal_rules,
// correct_srl, inquiry_category, expected_outcome, and any other "what the
// trainee is supposed to arrive at" data.
//
// Since migration 0007 (SEC-1/SEC-2) the answer key lives in the
// service-role-only `case_answer_keys` table (and SRL bodies in
// `srd_document_bodies`) — RLS with no authenticated policies, so the DB
// itself now enforces what used to be app-layer convention. Reads go through
// the service client; every function here FIRST verifies the caller can see
// the case via an RLS-scoped read of case_templates surface columns, so
// tenant scoping is preserved.
//
// THIS FILE IS THE ONLY PLACE ALLOWED TO READ ground_truth_json (plus the
// admin ground-truth editor, migrations, and seeds). Every other server
// component / server action that needs case data MUST go through
// buildCaseBrief() below and pass the resulting CaseBrief (or a subset of it)
// to client components. Never select answer-key columns elsewhere, and never
// forward the raw row to a client component or client-invoked server action
// response.
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
};

type AnswerKeyRow = {
  template_id: string;
  ground_truth_json: GroundTruth | null;
  persona_brief_json: unknown;
  scripted_transcript_json: unknown;
};

type SrdDocumentRow = {
  id: string;
  srl_code: string | null;
  title: string;
};

/**
 * Service-role read of one case's answer key. Callers in this file MUST have
 * already confirmed the current user can see the template via an RLS-scoped
 * case_templates read — this helper deliberately bypasses RLS.
 */
async function loadAnswerKey(templateId: string): Promise<AnswerKeyRow | null> {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("case_answer_keys")
    .select("template_id, ground_truth_json, persona_brief_json, scripted_transcript_json")
    .eq("template_id", templateId)
    .maybeSingle<AnswerKeyRow>();
  if (error || !data) return null;
  return data;
}

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
  options: { openBook: boolean; variant?: VariantSnapshot | null }
): Promise<CaseBrief | null> {
  // Certification/practice sittings play a deterministic surface variant:
  // fresh caller identity, seeded decoy arrangement, closed-book enforced.
  const variant = options.variant ?? null;
  const openBook = variant?.closed_book ? false : options.openBook;
  // RLS-scoped surface read — this is the access check: if the current user
  // can't see the template (org scoping / org_case_access), we return null
  // before any service-role read happens.
  const { data: template, error } = await supabase
    .from("case_templates")
    .select("id, case_code, title, difficulty, product_ref, therapeutic_area")
    .eq("id", templateId)
    .maybeSingle<CaseTemplateRow>();

  if (error || !template) return null;

  const key = await loadAnswerKey(templateId);
  if (!key) return null;
  const gt = key.ground_truth_json ?? {};

  const correctId = extractCorrectSrlId(gt.correct_srl);
  const decoyIds = Array.isArray(gt.decoy_srl_ids) ? gt.decoy_srl_ids : [];
  const allSrlIds = [...new Set([...(correctId ? [correctId] : []), ...decoyIds])];

  let srlCandidates: SrlCandidate[] = [];
  if (allSrlIds.length > 0) {
    // ground truth references SRLs by srl_code (e.g. "SRL-PUL-CANDID"), not uuid.
    // Titles come through the RLS-scoped client (preserves org scoping of
    // decoys); bodies live in service-role-only srd_document_bodies (SEC-2)
    // and are fetched only for open-book briefs.
    const { data: srdRows } = await supabase
      .from("srd_documents")
      .select("id, srl_code, title")
      .in("srl_code", allSrlIds);

    const rows = (srdRows ?? []) as SrdDocumentRow[];
    const byCode = new Map(rows.map((r) => [r.srl_code, r]));

    let bodyById = new Map<string, string>();
    if (openBook && rows.length > 0) {
      const admin = createAdminClient();
      const { data: bodyRows } = await admin
        .from("srd_document_bodies")
        .select("document_id, body")
        .in("document_id", rows.map((r) => r.id));
      bodyById = new Map(
        ((bodyRows ?? []) as { document_id: string; body: string }[]).map((b) => [b.document_id, b.body])
      );
    }

    const hydrated: SrlCandidate[] = [];
    for (const code of allSrlIds) {
      const row = byCode.get(code);
      if (!row) continue; // skip codes that don't resolve; never leak the code alone
      const body = bodyById.get(row.id);
      hydrated.push({
        id: row.id,
        srl_code: row.srl_code,
        title: row.title,
        ...(openBook && body !== undefined ? { body } : {}),
      });
    }
    // Shuffle server-side; no field anywhere indicates which one is correct.
    // Variant sittings use the seeded arrangement for audit reproducibility.
    srlCandidates = variant
      ? seededShuffle(hydrated, variant.decoy_order_seed)
      : shuffle(hydrated);
  }

  const contactPrefill: ContactPrefill = variant
    ? {
        name: variant.contact.name,
        background: gt.inquirer_contact?.background, // case-semantic, never swapped
        phone: variant.contact.phone,
        street_address: variant.contact.street_address || undefined,
        city: variant.contact.city,
        state: variant.contact.state,
        zip: variant.contact.zip || undefined,
      }
    : gt.inquirer_contact ?? {};

  return {
    id: template.id,
    case_code: template.case_code,
    title: template.title,
    difficulty: template.difficulty,
    product_ref: template.product_ref,
    therapeutic_area: template.therapeutic_area,
    channel: gt.channel === "voice" ? "voice" : "chat",
    hasScriptedTranscript: parseTranscript(key.scripted_transcript_json).length > 0,
    hasLivePersona: key.persona_brief_json != null,
    transcript: parseTranscript(key.scripted_transcript_json),
    srl_candidates: srlCandidates,
    contact_prefill: contactPrefill,
    sop_timeframe_business_days: gt.sop_timeframe_business_days ?? null,
  };
}

// -----------------------------------------------------------------------------
// Persona context — SERVER-ONLY, part of the ground-truth firewall.
// The persona engine legitimately needs ground truth (reveal rules, safety
// facts) to direct the caller. That read stays inside this file to preserve
// the single-reader invariant; only the finished system prompt leaves, and it
// goes to the model API, never to the browser.
// -----------------------------------------------------------------------------
export async function buildPersonaSystemPromptForTemplate(
  supabase: SupabaseClient,
  templateId: string,
  variant?: VariantSnapshot | null
): Promise<string | null> {
  // RLS-scoped access check before the service-role answer-key read.
  const { data: row, error } = await supabase
    .from("case_templates")
    .select("id, product_ref")
    .eq("id", templateId)
    .maybeSingle<{ id: string; product_ref: string | null }>();

  if (error || !row) return null;

  const key = await loadAnswerKey(templateId);
  if (!key?.persona_brief_json || !key.ground_truth_json) return null;

  const basePrompt = buildPersonaSystemPrompt({
    brief: key.persona_brief_json as PersonaBrief,
    groundTruth: key.ground_truth_json as PersonaGroundTruth,
    productRef: row.product_ref,
  });

  if (!variant) return basePrompt;
  return withVariantOverlay(basePrompt, variant);
}

function withVariantOverlay(basePrompt: string, variant: VariantSnapshot): string {

  const addr = [variant.contact.street_address, variant.contact.city, variant.contact.state, variant.contact.zip]
    .filter(Boolean)
    .join(", ");
  return `${basePrompt}

## Surface variant — OVERRIDES the identity above (certification sitting)
You are the same caller with the same situation, facts, asides, and disclosure
rules, but your identity and delivery differ this time:
- Your name: ${variant.contact.name}
- Your phone: ${variant.contact.phone}
- Your address: ${addr}
- Delivery style: ${variant.style_directive}
Everything else — the reason for calling, every case fact, every aside and its
disclosure rule — is unchanged. Never mention having called before.`;
}

// -----------------------------------------------------------------------------
// Evaluation inputs — SERVER-ONLY, same single-reader firewall rationale as the
// persona context: the evaluator legitimately needs the answer key; the read
// stays in this file and the assembled inputs go to the evaluator, never to
// the browser.
// -----------------------------------------------------------------------------
export type EvaluationCaseData = {
  caseTemplateId: string;
  variantRef: string | null;
  groundTruthJson: Record<string, unknown>;
  sopTimeframeBusinessDays: number | null;
};

export async function loadEvaluationCaseData(
  supabase: SupabaseClient,
  instanceId: string
): Promise<EvaluationCaseData | null> {
  // Instance ownership/visibility stays on the caller's RLS-scoped client.
  const { data: instance } = await supabase
    .from("case_instances")
    .select("template_id, variant_snapshot_json")
    .eq("id", instanceId)
    .maybeSingle<{ template_id: string; variant_snapshot_json: { seed?: string } | null }>();
  if (!instance) return null;

  const key = await loadAnswerKey(instance.template_id);
  if (!key?.ground_truth_json) return null;

  const gt = key.ground_truth_json as { sop_timeframe_business_days?: number };
  return {
    caseTemplateId: instance.template_id,
    variantRef: instance.variant_snapshot_json?.seed ?? null,
    groundTruthJson: key.ground_truth_json as unknown as Record<string, unknown>,
    sopTimeframeBusinessDays: gt.sop_timeframe_business_days ?? null,
  };
}
