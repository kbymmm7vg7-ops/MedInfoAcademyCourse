import { describe, it, expect } from "vitest";
import {
  sanitizeGroundTruthForEvaluator,
  buildEvaluatorUserPrompt,
} from "./prompt";
import { emptyFormState } from "@/lib/simulator/types";

describe("sanitizeGroundTruthForEvaluator", () => {
  const gt = {
    case_id: "SC-11",
    safety: { ae_present: false, special_situations: ["lack_of_effect"] },
    correct_srl: "none",
    reveal_rules: [{ cue: "…", detail_withheld: "LOE" }],
    expected_outcome: {
      gold_result: "pass",
      common_failures: [{ description: "…", expected_critical_fail: ["S5.2"] }],
      applicable_sections: ["s1", "s4", "s5"],
    },
  };

  it("removes expected_outcome (the grading key) but keeps case facts", () => {
    const out = sanitizeGroundTruthForEvaluator(gt) as Record<string, unknown>;
    expect(out).not.toHaveProperty("expected_outcome");
    expect(out.case_id).toBe("SC-11");
    expect(out.safety).toEqual(gt.safety);
    expect(out.correct_srl).toBe("none");
    expect(out.reveal_rules).toEqual(gt.reveal_rules);
  });

  it("does not mutate the input object", () => {
    sanitizeGroundTruthForEvaluator(gt);
    expect(gt).toHaveProperty("expected_outcome");
  });

  it("is a no-op for non-objects", () => {
    expect(sanitizeGroundTruthForEvaluator(null)).toBeNull();
    expect(sanitizeGroundTruthForEvaluator("x")).toBe("x");
  });

  it("the rendered evaluator prompt never contains the grading key", () => {
    const prompt = buildEvaluatorUserPrompt({
      applicability: { s1: true, s2: false, s3: false, s4: true, s5: true },
      groundTruthJson: gt,
      transcript: [{ speaker: "trainee", content: "Hello" }],
      doc: emptyFormState({}),
      validatorFindings: [],
      channel: "voice",
    });
    expect(prompt).not.toContain("expected_critical_fail");
    expect(prompt).not.toContain("gold_result");
    expect(prompt).not.toContain("common_failures");
    // …but the case facts the evaluator needs are still present.
    expect(prompt).toContain("lack_of_effect");
    expect(prompt).toContain("detail_withheld");
  });
});
