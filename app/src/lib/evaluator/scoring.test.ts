import { describe, it, expect } from "vitest";
import { scoreAll, scoreWeightedSection, scoreS1, type CriterionVerdict } from "./scoring";
import { computeApplicability } from "./applicability";
import { S2_CRITERIA, S4_CRITERIA } from "./criteria";
import { emptyFormState } from "@/lib/simulator/types";

const passAll = (ids: string[]): CriterionVerdict[] => ids.map((id) => ({ id, result: "pass" }));
const S2_IDS = S2_CRITERIA.map((c) => c.id);
const S4_IDS = S4_CRITERIA.map((c) => c.id);

describe("weighted section math (contract §Scoring rules)", () => {
  it("full pass: subtotal = max, min_passing = ceil(ratio × available)", () => {
    const { section } = scoreWeightedSection("s2", true, passAll(S2_IDS));
    expect(section.subtotal).toBe(74);
    expect(section.available_points).toBe(74);
    expect(section.min_passing).toBe(65); // ceil(65/74 × 74)
    expect(section.result).toBe("pass");
    expect(section.critical_failure).toBe(false);
  });

  it("critical auto-fail regardless of points (fail only S2.1: 64/64 non-failed points)", () => {
    const verdicts: CriterionVerdict[] = S2_IDS.map((id) =>
      id === "S2.1"
        ? { id, result: "fail", evidence: "trainee let the cue pass", rationale: "missed AE" }
        : { id, result: "pass" }
    );
    const { section, missed } = scoreWeightedSection("s2", true, verdicts);
    expect(section.subtotal).toBe(64);
    expect(section.critical_failure).toBe(true);
    expect(section.result).toBe("fail");
    expect(missed.critical).toBe(1);
  });

  it("N/A criteria prorate the minimum (contract rule 1)", () => {
    // S2 with S2.5, S2.8 N/A: available = 74-16 = 58; min = ceil(65/74×58) = 51
    const verdicts: CriterionVerdict[] = S2_IDS.map((id) =>
      id === "S2.5" || id === "S2.8" ? { id, result: "na" } : { id, result: "pass" }
    );
    const { section } = scoreWeightedSection("s2", true, verdicts);
    expect(section.available_points).toBe(58);
    expect(section.min_passing).toBe(51);
    expect(section.result).toBe("pass");
  });

  it("major fails below the minimum fail the section without a critical", () => {
    // S4: fail two majors (S4.3, S4.5): subtotal 43-8=35 < 39
    const verdicts: CriterionVerdict[] = S4_IDS.map((id) =>
      id === "S4.3" || id === "S4.5"
        ? { id, result: "fail", evidence: "e", rationale: "r" }
        : { id, result: "pass" }
    );
    const { section, missed } = scoreWeightedSection("s4", true, verdicts);
    expect(section.subtotal).toBe(35);
    expect(section.min_passing).toBe(39);
    expect(section.critical_failure).toBe(false);
    expect(section.result).toBe("fail");
    expect(missed.major).toBe(2);
  });

  it("a single minor fail can survive (S4: 42 ≥ 39)", () => {
    const verdicts: CriterionVerdict[] = S4_IDS.map((id) =>
      id === "S4.14" ? { id, result: "fail", evidence: "3 misspellings", rationale: "r" } : { id, result: "pass" }
    );
    const { section } = scoreWeightedSection("s4", true, verdicts);
    expect(section.subtotal).toBe(42);
    expect(section.result).toBe("pass");
  });

  it("criteria omitted by the LLM are N/A, never fails", () => {
    const { section } = scoreWeightedSection("s2", true, passAll(["S2.1", "S2.2", "S2.3"]));
    const na = section.criteria.filter((c) => c.result === "na");
    expect(na.length).toBe(7);
    expect(section.critical_failure).toBe(false);
  });

  it("inapplicable section reports na and zeroes", () => {
    const { section } = scoreWeightedSection("s3", false, []);
    expect(section.result).toBe("na");
    expect(section.applicable).toBe(false);
  });
});

describe("S1 scaled math", () => {
  it("averages scored items, S1.4 forced N/A, pass ≥ 2.5", () => {
    const s1 = scoreS1(true, [
      { id: "S1.1", result: "pass", rating: 4 },
      { id: "S1.2", result: "pass", rating: 3 },
      { id: "S1.3", result: "pass", rating: 2 },
      { id: "S1.4", result: "pass", rating: 4 }, // must be ignored (MVP N/A)
      { id: "S1.5", result: "pass", rating: 3 },
    ]);
    expect(s1.average).toBe(3); // (4+3+2+3)/4
    expect(s1.result).toBe("pass");
    expect(s1.criteria.find((c) => c.id === "S1.4")!.result).toBe("na");
  });

  it("fails below 2.5 and clamps ratings into 1–4", () => {
    const s1 = scoreS1(true, [
      { id: "S1.1", result: "fail", rating: 0 }, // clamped to 1
      { id: "S1.2", result: "fail", rating: 2 },
      { id: "S1.3", result: "fail", rating: 2 },
      { id: "S1.5", result: "pass", rating: 4 },
    ]);
    expect(s1.average).toBe(2.25);
    expect(s1.result).toBe("fail");
  });
});

describe("overall + applicability", () => {
  const doc = emptyFormState({});

  it("applicability: trainee-flagged AE makes S2 applicable even when ground truth has none (over-flagging scored in-section)", () => {
    const flagged = emptyFormState({});
    flagged.safety.ae_present = "yes";
    const app = computeApplicability({
      groundTruth: { safety: { ae_present: false, pc_present: false } },
      doc: flagged,
      liveConversation: true,
    });
    expect(app.s2).toBe(true);
    expect(app.s3).toBe(false);
    expect(app.s4 && app.s5).toBe(true);
  });

  it("overall pass requires every applicable section to pass; N/A sections don't block", () => {
    const verdicts: CriterionVerdict[] = [
      { id: "S1.1", result: "pass", rating: 3 },
      { id: "S1.2", result: "pass", rating: 3 },
      { id: "S1.3", result: "pass", rating: 3 },
      { id: "S1.5", result: "pass", rating: 3 },
      ...passAll(S4_IDS),
      { id: "S5.1", result: "na" },
      { id: "S5.2", result: "na" },
      { id: "S5.3", result: "pass" },
      { id: "S5.4", result: "na" },
      { id: "S5.5", result: "pass" },
    ];
    const scored = scoreAll({
      applicability: { s1: true, s2: false, s3: false, s4: true, s5: true },
      verdicts,
    });
    expect(scored.s2.result).toBe("na");
    expect(scored.overallResult).toBe("pass");
    expect(scored.feedbackRequired).toBe(false);
  });

  it("S5 all-N/A reports section N/A (clean case, no triggers)", () => {
    const scored = scoreAll({
      applicability: { s1: false, s2: false, s3: false, s4: true, s5: true },
      verdicts: [
        ...passAll(S4_IDS),
        { id: "S5.1", result: "na" },
        { id: "S5.2", result: "na" },
        { id: "S5.3", result: "na" },
        { id: "S5.4", result: "na" },
        { id: "S5.5", result: "na" },
      ],
    });
    expect(scored.s5.result).toBe("na");
    expect(scored.overallResult).toBe("pass");
  });

  it("any critical fail anywhere fails overall and requires feedback", () => {
    const verdicts: CriterionVerdict[] = [
      ...passAll(S4_IDS.filter((id) => id !== "S4.2")),
      { id: "S4.2", result: "fail", evidence: "told patient to double the dose", rationale: "medical advice" },
      { id: "S5.3", result: "pass" },
      { id: "S5.5", result: "pass" },
    ];
    const scored = scoreAll({
      applicability: { s1: false, s2: false, s3: false, s4: true, s5: true },
      verdicts,
    });
    expect(scored.s4.critical_failure).toBe(true);
    expect(scored.overallResult).toBe("fail");
    expect(scored.feedbackRequired).toBe(true);
    expect(scored.missed_counts.s4.critical).toBe(1);
  });

  void doc;
});
