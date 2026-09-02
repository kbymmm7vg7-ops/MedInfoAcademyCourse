// =============================================================================
// FAKE LLM ADAPTER — deterministic, offline, zero-cost
// =============================================================================
// Selected with LLM_PROVIDER=fake (or a per-role LLM_PROVIDER_* override). It
// exists so the whole pipeline — persona route, evaluate.ts, ajv validation,
// persistEvaluation, the E2E smoke — can be exercised end to end without an
// API key and without spending money on a metered tier.
//
// It is NOT a model and never judges anything: persona replies are fixed
// neutral lines carrying no clinical content, and evaluator verdicts are a
// blanket "pass" with a clearly-labelled placeholder evidence string. Nothing
// it returns is a real assessment, and no calibration or certification gate
// may ever be run through it.
// =============================================================================

import {
  S1_CRITERIA,
  S2_CRITERIA,
  S3_CRITERIA,
  S4_CRITERIA,
  S5_CRITERIA,
} from "@/lib/evaluator/criteria";
import type { LlmAdapter, LlmChatArgs, LlmStructuredArgs } from "@/lib/llm/types";

/** Marker embedded in every fake verdict so a fake-scored record is obvious in
 *  the database, in a report, or in a screenshot. */
export const FAKE_EVIDENCE_PLACEHOLDER =
  "[fake-adapter placeholder — no model judged this criterion]";

/** Neutral caller lines: phone-register, in character, deliberately free of any
 *  clinical detail so the fake adapter can never introduce medical content. */
export const FAKE_PERSONA_LINES: readonly string[] = [
  "Hello? Yes, I can hear you — thanks for picking up.",
  "Sorry, could you say that again? The line is not great.",
  "Right, I understand. Is there anything else you need from me?",
  "Okay, let me think about that for a second.",
  "That answers it, I think. Thank you for checking.",
  "Sure, take your time — I am not in a rush.",
];

/** Deterministic reply for the Nth persona turn (0-based, cycles). */
export function fakePersonaReply(turnIndex: number): string {
  const i = ((turnIndex % FAKE_PERSONA_LINES.length) + FAKE_PERSONA_LINES.length) %
    FAKE_PERSONA_LINES.length;
  return FAKE_PERSONA_LINES[i];
}

export type FakeApplicability = { s1: boolean; s2: boolean; s3: boolean; s4: boolean; s5: boolean };

/**
 * Reads the section-applicability line the evaluator user prompt already
 * carries ("S1: true · S2: false · ..."). Sections the prompt marks
 * inapplicable get no verdicts, mirroring what a real evaluator returns.
 * Anything unparseable defaults to applicable.
 */
export function parseApplicabilityFromPrompt(userPrompt: string): FakeApplicability {
  const read = (key: string): boolean => {
    const m = new RegExp(`${key}:\\s*(true|false)`, "i").exec(userPrompt);
    return m ? m[1].toLowerCase() === "true" : true;
  };
  return { s1: read("S1"), s2: read("S2"), s3: read("S3"), s4: read("S4"), s5: read("S5") };
}

type FakeVerdict = {
  id: string;
  result: "pass" | "na";
  rating?: number;
  evidence: string;
  rationale: string;
};

/**
 * Every applicable criterion marked "pass" with the placeholder evidence.
 * S1.4 is returned "na" because it is structurally N/A in this version
 * (scoring.ts forces it regardless); the MVP forced-N/A set is likewise
 * re-forced downstream in evaluate.ts, so returning "pass" here is harmless
 * and keeps this function free of scoring policy.
 */
export function buildFakeEvaluatorOutput(userPrompt: string): {
  verdicts: FakeVerdict[];
  constructive_feedback: string;
  coaching_summary: string;
} {
  const applicable = parseApplicabilityFromPrompt(userPrompt);
  const verdicts: FakeVerdict[] = [];

  if (applicable.s1) {
    for (const c of S1_CRITERIA) {
      verdicts.push(
        c.mvpNa
          ? {
              id: c.id,
              result: "na",
              evidence: FAKE_EVIDENCE_PLACEHOLDER,
              rationale: "structurally N/A in this version",
            }
          : {
              id: c.id,
              result: "pass",
              rating: 3,
              evidence: FAKE_EVIDENCE_PLACEHOLDER,
              rationale: FAKE_EVIDENCE_PLACEHOLDER,
            }
      );
    }
  }

  const weighted: [boolean, { id: string }[]][] = [
    [applicable.s2, S2_CRITERIA],
    [applicable.s3, S3_CRITERIA],
    [applicable.s4, S4_CRITERIA],
    [applicable.s5, S5_CRITERIA],
  ];
  for (const [isApplicable, catalog] of weighted) {
    if (!isApplicable) continue;
    for (const c of catalog) {
      verdicts.push({
        id: c.id,
        result: "pass",
        evidence: FAKE_EVIDENCE_PLACEHOLDER,
        rationale: FAKE_EVIDENCE_PLACEHOLDER,
      });
    }
  }

  return {
    verdicts,
    constructive_feedback: FAKE_EVIDENCE_PLACEHOLDER,
    coaching_summary: FAKE_EVIDENCE_PLACEHOLDER,
  };
}

/** Tool name the evaluator uses (see lib/evaluator/prompt.ts). */
const EVALUATOR_TOOL_NAME = "submit_evaluation";

export function createFakeLlm(): LlmAdapter {
  return {
    vendor: "fake",

    async chat({ messages }: LlmChatArgs): Promise<{ text: string }> {
      // Turn index = how many persona replies already exist in the history.
      const priorReplies = messages.filter((m) => m.role === "assistant").length;
      return { text: fakePersonaReply(priorReplies) };
    },

    async structured({ messages, tool }: LlmStructuredArgs): Promise<{ json: unknown }> {
      if (tool.name !== EVALUATOR_TOOL_NAME) {
        throw new Error(
          `fake LLM adapter has no canned response for tool "${tool.name}" — add one in lib/llm/fake.ts`
        );
      }
      const userPrompt = messages.map((m) => m.content).join("\n");
      return { json: buildFakeEvaluatorOutput(userPrompt) };
    },
  };
}
