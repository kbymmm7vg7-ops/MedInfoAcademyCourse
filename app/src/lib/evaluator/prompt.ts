// =============================================================================
// EVALUATOR PROMPT — scoring-contract.md made operational
// =============================================================================
// SERVER-ONLY (embeds the answer key). The LLM returns per-criterion verdicts
// with evidence; ALL math happens afterward in scoring.ts. Validator findings
// are injected as fixed facts the model must not contradict.
// =============================================================================

import {
  S1_CRITERIA,
  S2_CRITERIA,
  S3_CRITERIA,
  S4_CRITERIA,
  S5_CRITERIA,
} from "./criteria";
import type { SectionApplicability } from "./applicability";
import type { ValidatorFinding } from "@/lib/validator/validator";
import type { DocumentationFormState, TranscriptTurn } from "@/lib/simulator/types";

function criteriaBlock(
  title: string,
  items: { id: string; text: string; cat?: string; val?: number }[]
): string {
  return `### ${title}\n${items
    .map((c) => `- ${c.id}${c.cat ? ` [${c.cat}]` : ""}: ${c.text}`)
    .join("\n")}`;
}

export const EVALUATOR_VERSION = "eval-prompt-v1";

export function buildEvaluatorSystemPrompt(): string {
  return `You are the Evaluation Agent for a Medical Information (MI) training platform. You score ONE completed training case — the call transcript and the submitted documentation record, judged JOINTLY — against the Quality Monitoring Scorecard v1.0, using the case's ground-truth answer key as the sole factual authority.

## Binding rules (deviations are bugs)
1. GROUND TRUTH IS AUTHORITY. Score against the provided answer key, never your own medical opinion. If the key says an AE is present and the trainee never surfaced/documented it, S2.1 fails — with the transcript evidence of the missed signal.
2. EVIDENCE OBLIGATION. Every "fail" MUST cite verbatim evidence — an exact quote from the transcript or the exact documentation field content (or its absence, named precisely, e.g. "Safety tab ae_present = 'no'"). If you cannot produce evidence, you MAY NOT fail the criterion.
3. FIXED FINDINGS. The deterministic validator has pre-computed some criteria; its verdicts are given below as fixed facts. Return those criteria exactly as given — do not re-judge or contradict them.
4. LISTEN-AND-CLARIFY, NOT PROBING. MI specialists do not fish for or solicit AEs. Credit identification (S2.1/S3.1/S5.2) when the trainee catches a cue the caller volunteered and clarifies it. Do NOT reward manufacturing an AE the caller never raised — a fabricated/over-flagged AE fails S2.1 (identification wrong). S1.3 is scored as "listened and clarified", not "probed"; cold-canvassing for unraised symptoms is not the skill and is penalized when it produces a fabricated report.
5. JUDGMENTS ONLY, NO ARITHMETIC. Return per-criterion verdicts; the platform computes all subtotals, minimums, and pass/fail math. Never compute or mention point totals.
6. N/A DISCIPLINE. Mark a criterion "na" when the case contains no trigger for it (e.g. S5.1 when nothing off-label was asked or volunteered; S2.5 when no questionnaire applies in this simulation; S2.8/S3.9/S4.11 where the simulation has no source-document mechanism). When in doubt between na and pass for an untriggered criterion, choose na.
7. TRANSCRIPT + DOCUMENTATION JOINTLY. A trainee can say the right things and still fail by not documenting them (the most common real failure). Check both sides for every criterion that has both.
8. S1 uses ratings 1–4 (1 = does not meet, 2 = needs improvement, 3 = meets, 4 = exceeds). S1.4 is always "na" in this version. For S1.5 in text mode, ignore vocal fillers; judge slang/jargon/acronyms only.

## Scorecard criteria
${criteriaBlock("Section 1 — Phone Call / Customer Service (rate 1–4 or na)", S1_CRITERIA)}
${criteriaBlock("Section 2 — Adverse Event (pass/fail/na)", S2_CRITERIA)}
${criteriaBlock("Section 3 — Product Complaint (pass/fail/na)", S3_CRITERIA)}
${criteriaBlock("Section 4 — General Case (pass/fail/na)", S4_CRITERIA)}
${criteriaBlock("Section 5 — Compliance & Special Situations (pass/fail/na)", S5_CRITERIA)}

## Coaching language
Phrase constructive_feedback and coaching_summary in these dimension names: AE/PC Detection (S2.1/S3.1/S5.2) • Questioning Technique (S1.3) • Compliance (S5.1/S5.3) • Documentation (S2.4–S2.10, S3.4–S3.12, S4) • Empathy (S1.2) • Regulatory risk (S5 criticals). Be specific and constructive: what was done, what should change, what would happen in a live QA environment.`;
}

export function buildEvaluatorUserPrompt(args: {
  applicability: SectionApplicability;
  groundTruthJson: unknown;
  transcript: TranscriptTurn[];
  doc: DocumentationFormState;
  validatorFindings: ValidatorFinding[];
  channel: "voice" | "text";
}): string {
  const { applicability, groundTruthJson, transcript, doc, validatorFindings, channel } = args;

  const transcriptText =
    transcript.length > 0
      ? transcript.map((t, i) => `[${i + 1}] ${t.speaker.toUpperCase()}: ${t.content}`).join("\n")
      : "(no conversation occurred)";

  const fixed = validatorFindings
    .filter((f) => f.status !== "na")
    .map((f) => `- ${f.criterion} (${f.check}): ${f.status.toUpperCase()} — ${f.evidence}`)
    .join("\n");

  const skipNote = (["s1", "s2", "s3"] as const)
    .filter((s) => !applicability[s])
    .map((s) => s.toUpperCase())
    .join(", ");

  return `## Case channel
${channel} (a live conversation${channel === "text" ? "; vocal-delivery criteria are na" : ""})

## Section applicability (pre-computed — return NO criteria for inapplicable sections)
S1: ${applicability.s1} · S2: ${applicability.s2} · S3: ${applicability.s3} · S4: ${applicability.s4} · S5: ${applicability.s5}
${skipNote ? `Do not return any ${skipNote} criteria.\n` : ""}
## Ground-truth answer key (authoritative)
\`\`\`json
${JSON.stringify(groundTruthJson, null, 2)}
\`\`\`

## Fixed validator findings (return these criteria EXACTLY as stated)
${fixed || "(none)"}

## Call transcript
${transcriptText}

## Submitted documentation record
\`\`\`json
${JSON.stringify(doc, null, 2)}
\`\`\`

Evaluate now. Return every applicable criterion exactly once.`;
}

/** Tool schema forcing structured verdicts (validated again with ajv afterward). */
export const EVALUATOR_TOOL_SCHEMA = {
  name: "submit_evaluation",
  description: "Submit per-criterion verdicts for this case evaluation.",
  input_schema: {
    type: "object" as const,
    required: ["verdicts", "coaching_summary"],
    properties: {
      verdicts: {
        type: "array",
        items: {
          type: "object",
          required: ["id", "result"],
          properties: {
            id: { type: "string", pattern: "^S[1-5]\\.[0-9]{1,2}$" },
            result: { enum: ["pass", "fail", "na"] },
            rating: { type: "number", minimum: 1, maximum: 4, description: "S1 criteria only" },
            evidence: { type: "string", description: "verbatim quote/field content; REQUIRED on fail" },
            rationale: { type: "string" },
          },
        },
      },
      constructive_feedback: { type: "string" },
      coaching_summary: { type: "string" },
    },
  },
};
