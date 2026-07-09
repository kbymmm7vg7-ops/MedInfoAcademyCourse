// =============================================================================
// EVALUATION ORCHESTRATOR (PRD §9.5, scoring-contract.md)
// =============================================================================
// validator (deterministic) → applicability → LLM verdicts (Sonnet, forced
// tool) → pin validator-owned criteria → scoring math → ajv-validate against
// rubric.schema.json → persist (service role) → cert pass_bool + lock hook.
// SERVER-ONLY.
// =============================================================================

import Anthropic from "@anthropic-ai/sdk";
import { Ajv } from "ajv";
import addFormats from "ajv-formats";
// Vendored from 02-rubric-schema/rubric.schema.json (Turbopack cannot import
// outside the app root); that file remains the source of truth.
import rubricSchema from "./rubric.schema.json";
import { MODEL_POLICY } from "@/lib/config/models";
import { createAdminClient } from "@/lib/supabase/admin";
import { runValidator, type ValidatorFinding } from "@/lib/validator/validator";
import { getSpellChecker } from "@/lib/validator/spelling";
import type { SpellCheckFn } from "@/lib/validator/validator";
import { computeApplicability } from "./applicability";
import { scoreAll, type CriterionVerdict } from "./scoring";
import { RUBRIC_VERSION, MVP_FORCED_NA } from "./criteria";
import {
  buildEvaluatorSystemPrompt,
  buildEvaluatorUserPrompt,
  EVALUATOR_TOOL_SCHEMA,
  EVALUATOR_VERSION,
} from "./prompt";
import { certProgress, buildEvidencePacket, type AttemptRow } from "@/lib/cert/logic";
import type { DocumentationFormState, TranscriptTurn } from "@/lib/simulator/types";

// Validator-owned criteria: the LLM's verdicts for these are replaced by the
// deterministic findings (contract §7 — "fixed findings it must not
// contradict" — enforced in code, not just in the prompt).
const VALIDATOR_PINNED: Record<string, string[]> = {
  "S4.13": ["S4.13"],
  "S4.3": ["S4.3"],
  "S4.14": ["S4.14"],
  "S4.8": ["S4.8", "S2.10", "S3.12"],
  "S2.2/S3.2": ["S2.2", "S3.2"],
  "S3.6": ["S3.6"],
};

export function pinValidatorVerdicts(
  llmVerdicts: CriterionVerdict[],
  findings: ValidatorFinding[],
  applicability: { s2: boolean; s3: boolean }
): CriterionVerdict[] {
  const out = new Map(llmVerdicts.map((v) => [v.id, v]));
  for (const f of findings) {
    const targets = VALIDATOR_PINNED[f.criterion];
    if (!targets) {
      // S2.4 special case: the validator only proves the FAIL direction
      // ("AE surfaced in call, absent from documentation"); quality judgments
      // on documented AEs stay with the LLM.
      if (f.criterion === "S2.4" && f.status === "fail") {
        out.set("S2.4", { id: "S2.4", result: "fail", evidence: f.evidence, rationale: f.check });
      }
      continue;
    }
    for (const id of targets) {
      if (id.startsWith("S2.") && !applicability.s2) continue;
      if (id.startsWith("S3.") && !applicability.s3) continue;
      if (f.status === "na") {
        out.set(id, { id, result: "na", rationale: f.evidence });
      } else {
        out.set(id, {
          id,
          result: f.status,
          evidence: f.evidence,
          rationale: `deterministic validator: ${f.check}`,
        });
      }
    }
  }
  return [...out.values()];
}

export type EvaluationInputs = {
  caseInstanceId: string;
  caseTemplateId: string;
  variantRef: string | null;
  channel: "voice" | "text";
  groundTruthJson: Record<string, unknown>;
  transcript: TranscriptTurn[];
  doc: DocumentationFormState;
  receivedAt: string;
  sopTimeframeBusinessDays: number | null;
  /** Injectable for tooling (calibration harness) that cannot load the default
   *  dictionary loader; production omits it and uses getSpellChecker(). */
  spellCheck?: SpellCheckFn;
};

type LlmOutput = {
  verdicts: CriterionVerdict[];
  constructive_feedback?: string;
  coaching_summary: string;
};

async function callEvaluatorLlm(system: string, user: string): Promise<LlmOutput> {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error("ANTHROPIC_API_KEY is not set — the evaluator requires it (see BLOCKERS.md).");
  }
  const client = new Anthropic();
  const response = await client.messages.create({
    model: MODEL_POLICY.evaluator,
    max_tokens: 8000,
    system,
    messages: [{ role: "user", content: user }],
    tools: [EVALUATOR_TOOL_SCHEMA as Anthropic.Tool],
    tool_choice: { type: "tool", name: "submit_evaluation" },
  });
  const block = response.content.find(
    (b): b is Anthropic.ToolUseBlock => b.type === "tool_use" && b.name === "submit_evaluation"
  );
  if (!block) throw new Error("Evaluator returned no structured verdicts");
  const raw = block.input as {
    verdicts: (CriterionVerdict & { rating?: number })[];
    constructive_feedback?: string;
    coaching_summary?: string;
  };
  return {
    verdicts: raw.verdicts ?? [],
    constructive_feedback: raw.constructive_feedback,
    coaching_summary: raw.coaching_summary ?? "",
  };
}

/**
 * Evaluates one case's transcript + documentation. Pure with respect to the
 * database — callers provide inputs and persist the result (persistEvaluation
 * below does that for app flows; the calibration harness skips persistence).
 */
export async function evaluateCase(inputs: EvaluationInputs) {
  const spellCheck = inputs.spellCheck ?? (await getSpellChecker());
  const validatorFindings = runValidator({
    doc: inputs.doc,
    transcript: inputs.transcript,
    groundTruth: inputs.groundTruthJson as Parameters<typeof runValidator>[0]["groundTruth"],
    receivedAt: inputs.receivedAt,
    sopTimeframeBusinessDays: inputs.sopTimeframeBusinessDays,
    spellCheck,
  });

  const applicability = computeApplicability({
    groundTruth: inputs.groundTruthJson as { safety?: { ae_present?: boolean; pc_present?: boolean } },
    doc: inputs.doc,
    liveConversation: true, // all MVP cases are live phone/chat conversations
  });

  const llm = await callEvaluatorLlm(
    buildEvaluatorSystemPrompt(),
    buildEvaluatorUserPrompt({
      applicability,
      groundTruthJson: inputs.groundTruthJson,
      transcript: inputs.transcript,
      doc: inputs.doc,
      validatorFindings,
      channel: inputs.channel,
    })
  );

  const pinned = pinValidatorVerdicts(llm.verdicts, validatorFindings, applicability);

  // Force MVP-structural-N/A criteria (no field exists in the simulator form)
  // and two conditional N/As, deterministic like S1.4 — never left to the LLM:
  //   S4.6 — no source document when the correct response cites no SRL.
  //   S5.2 — no special situation exists in the case (ground-truth
  //          special_situations empty/["none"] and no pregnancy/lactation).
  //          The LLM otherwise non-deterministically fails S5.2 on serious AEs,
  //          which are NOT one of the enumerated special-situation categories.
  const gt = inputs.groundTruthJson as {
    correct_srl?: string;
    safety?: { special_situations?: string[]; pregnancy_or_lactation?: boolean };
  };
  const noSourceExpected = !gt.correct_srl || gt.correct_srl === "none";
  const specials = (gt.safety?.special_situations ?? []).filter((s) => s && s !== "none");
  const noSpecialSituation = specials.length === 0 && gt.safety?.pregnancy_or_lactation !== true;
  const scoped = pinned.map((v) =>
    MVP_FORCED_NA.has(v.id) ||
    (v.id === "S4.6" && noSourceExpected) ||
    (v.id === "S5.2" && noSpecialSituation)
      ? {
          id: v.id,
          result: "na" as const,
          rationale: "MVP documentation form has no field for this criterion (S4 calibration).",
        }
      : v
  );

  // Robustness: rubric.schema.json requires BOTH evidence and rationale on a
  // fail, but the LLM sometimes returns only one. Backfill from the other so a
  // valid judgment is never rejected by ajv — an unhandled throw here is
  // swallowed by submitCase's catch{} and leaves the case silently pending
  // (SEC-4). A fail with neither field is left as-is (binding rule 2 forbids it).
  const verdicts = scoped.map((v) =>
    v.result === "fail" && (v.evidence == null || v.rationale == null) && (v.evidence ?? v.rationale) != null
      ? { ...v, evidence: v.evidence ?? v.rationale, rationale: v.rationale ?? v.evidence }
      : v
  );
  const scored = scoreAll({ applicability, verdicts });

  const record = {
    rubric_version: RUBRIC_VERSION,
    case_instance_id: inputs.caseInstanceId,
    case_template_id: inputs.caseTemplateId,
    ...(inputs.variantRef ? { variant_ref: inputs.variantRef } : {}),
    evaluator: { kind: "ai", version: EVALUATOR_VERSION, model: MODEL_POLICY.evaluator },
    channel: inputs.channel,
    reviewed_at: new Date().toISOString(),
    sections: { s1: scored.s1, s2: scored.s2, s3: scored.s3, s4: scored.s4, s5: scored.s5 },
    missed_counts: scored.missed_counts,
    overall: {
      result: scored.overallResult,
      ...(scored.feedbackRequired && llm.constructive_feedback
        ? { constructive_feedback: llm.constructive_feedback }
        : {}),
      coaching_summary: llm.coaching_summary,
    },
  };

  const ajv = new Ajv({ allErrors: true, strict: false });
  addFormats(ajv);
  const valid = ajv.validate(rubricSchema, record);
  if (!valid) {
    throw new Error(`Evaluation record failed schema validation: ${ajv.errorsText(ajv.errors)}`);
  }

  return { record, scored, validatorFindings, feedbackRequired: scored.feedbackRequired };
}

/** Persists a validated evaluation and runs the certification hooks. */
export async function persistEvaluation(args: {
  record: Record<string, unknown> & {
    case_instance_id: string;
    overall: { result: "pass" | "fail" };
  };
  userId: string;
}) {
  const admin = createAdminClient();
  const { record, userId } = args;
  const instanceId = record.case_instance_id;
  const pass = record.overall.result === "pass";

  const sections = record.sections as Record<
    string,
    { criteria: { id: string; result: string; score?: number; rationale?: string }[] }
  >;
  const rows = Object.values(sections).flatMap((s) =>
    s.criteria.map((c) => ({
      case_instance_id: instanceId,
      dimension: c.id,
      score: c.score ?? null,
      rationale: c.rationale ?? null,
      evaluator_version: EVALUATOR_VERSION,
      rubric_version: RUBRIC_VERSION,
    }))
  );
  rows.push({
    case_instance_id: instanceId,
    dimension: "overall",
    score: pass ? 1 : 0,
    rationale: null,
    evaluator_version: EVALUATOR_VERSION,
    rubric_version: RUBRIC_VERSION,
  });

  const { error: scoreError } = await admin.from("evaluation_scores").insert(
    rows.map((r, i) => (i === rows.length - 1 ? { ...r, record_json: record } : r))
  );
  if (scoreError) throw new Error(`Failed to persist scores: ${scoreError.message}`);

  await admin.from("case_instances").update({ status: "evaluated" }).eq("id", instanceId);

  // Certification hook: stamp pass_bool on the linked attempt, then lock if
  // this was the 3rd first-try pass.
  const variantRef = record.variant_ref as string | undefined;
  if (variantRef) {
    await admin
      .from("accreditation_attempts")
      .update({ pass_bool: pass, score: pass ? 1 : 0 })
      .eq("user_id", userId)
      .eq("variant_ref", variantRef);

    const { data: attemptRows } = await admin
      .from("accreditation_attempts")
      .select("case_template_id, attempt_type, is_first_attempt_on_case, pass_bool, variant_ref, completed_at")
      .eq("user_id", userId);
    const attempts = (attemptRows ?? []) as AttemptRow[];

    if (certProgress(attempts).locked) {
      const packet = buildEvidencePacket(attempts, RUBRIC_VERSION, new Date().toISOString());
      if (packet) {
        // insert-only: the PK + absence of an update path keep the lock immutable
        await admin
          .from("certification_locks")
          .insert({ user_id: userId, evidence_packet_json: packet, rubric_version: RUBRIC_VERSION })
          .select()
          .maybeSingle();
      }
    }
  }
}
