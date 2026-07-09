// =============================================================================
// SCORING MATH — deterministic (scoring-contract.md §Scoring rules)
// =============================================================================
// The LLM judges individual criteria (pass/fail/na + evidence); this module
// does ALL arithmetic: subtotals, prorated minimums, critical auto-fail, S1
// averaging, overall result, missed counts, feedback requirement. The LLM's
// numbers are never trusted for math.
// =============================================================================

import {
  S1_CRITERIA,
  S1_PASS_THRESHOLD,
  SECTION_RATIOS,
  WEIGHTED_SECTIONS,
  type WeightedSectionKey,
} from "./criteria";

export type CriterionVerdict = {
  id: string;
  result: "pass" | "fail" | "na";
  /** S1 only: the 1–4 rating (present when result !== "na") */
  rating?: number;
  evidence?: string;
  rationale?: string;
};

export type WeightedSectionResult = {
  applicable: boolean;
  criteria: {
    id: string;
    result: "pass" | "fail" | "na";
    score?: number;
    evidence?: string;
    rationale?: string;
  }[];
  subtotal: number;
  available_points: number;
  min_passing: number;
  critical_failure: boolean;
  result: "pass" | "fail" | "na";
};

export type ScaledSectionResult = {
  applicable: boolean;
  criteria: {
    id: string;
    result: "pass" | "fail" | "na";
    score?: number;
    evidence?: string;
    rationale?: string;
  }[];
  average: number | null;
  result: "pass" | "fail" | "na";
};

export type MissedCounts = Record<string, { critical: number; major: number; minor: number }>;

export function scoreWeightedSection(
  key: WeightedSectionKey,
  applicable: boolean,
  verdicts: CriterionVerdict[]
): { section: WeightedSectionResult; missed: { critical: number; major: number; minor: number } } {
  const catalog = WEIGHTED_SECTIONS[key];
  const missed = { critical: 0, major: 0, minor: 0 };

  if (!applicable) {
    return {
      section: {
        applicable: false,
        criteria: [],
        subtotal: 0,
        available_points: 0,
        min_passing: 0,
        critical_failure: false,
        result: "na",
      },
      missed,
    };
  }

  const byId = new Map(verdicts.map((v) => [v.id, v]));
  let subtotal = 0;
  let available = 0;
  let criticalFailure = false;
  const criteria: WeightedSectionResult["criteria"] = [];

  for (const c of catalog) {
    // A criterion the LLM omitted is treated as N/A — never silently failed.
    const v = byId.get(c.id) ?? { id: c.id, result: "na" as const };
    if (v.result === "na") {
      criteria.push({ id: c.id, result: "na", rationale: v.rationale });
      continue;
    }
    available += c.val;
    if (v.result === "pass") {
      subtotal += c.val;
      criteria.push({ id: c.id, result: "pass", score: c.val, rationale: v.rationale });
    } else {
      missed[c.cat] += 1;
      if (c.cat === "critical") criticalFailure = true;
      criteria.push({
        id: c.id,
        result: "fail",
        score: 0,
        evidence: v.evidence,
        rationale: v.rationale,
      });
    }
  }

  const minPassing = Math.ceil(SECTION_RATIOS[key] * available);
  const result: "pass" | "fail" =
    !criticalFailure && subtotal >= minPassing ? "pass" : "fail";

  return {
    section: {
      applicable: true,
      criteria,
      subtotal,
      available_points: available,
      min_passing: minPassing,
      critical_failure: criticalFailure,
      result,
    },
    missed,
  };
}

export function scoreS1(applicable: boolean, verdicts: CriterionVerdict[]): ScaledSectionResult {
  if (!applicable) {
    return { applicable: false, criteria: [], average: null, result: "na" };
  }
  const byId = new Map(verdicts.map((v) => [v.id, v]));
  const criteria: ScaledSectionResult["criteria"] = [];
  const ratings: number[] = [];

  for (const c of S1_CRITERIA) {
    const v = byId.get(c.id);
    // S1.4 is always N/A in MVP regardless of what the LLM returned.
    if (c.mvpNa || !v || v.result === "na" || v.rating == null) {
      criteria.push({ id: c.id, result: "na" });
      continue;
    }
    const rating = Math.min(4, Math.max(1, v.rating));
    ratings.push(rating);
    const result = rating >= S1_PASS_THRESHOLD ? "pass" : "fail";
    // A failed S1 criterion must carry evidence+rationale (rubric.schema.json);
    // the LLM sometimes omits them for low ratings. Backfill so the record
    // never fails ajv (an unhandled throw leaves a real case silently pending).
    const evidence =
      result === "fail" ? v.evidence ?? v.rationale ?? `S1 rating ${rating}/4 (below the 2.5 pass threshold)` : v.evidence;
    const rationale =
      result === "fail" ? v.rationale ?? v.evidence ?? `Rated ${rating}/4, below the 2.5 pass threshold` : v.rationale;
    criteria.push({ id: c.id, result, score: rating, evidence, rationale });
  }

  if (ratings.length === 0) {
    return { applicable: true, criteria, average: null, result: "na" };
  }
  const average = ratings.reduce((a, b) => a + b, 0) / ratings.length;
  return {
    applicable: true,
    criteria,
    average: Math.round(average * 100) / 100,
    result: average >= S1_PASS_THRESHOLD ? "pass" : "fail",
  };
}

export type OverallScoring = {
  s1: ScaledSectionResult;
  s2: WeightedSectionResult;
  s3: WeightedSectionResult;
  s4: WeightedSectionResult;
  s5: WeightedSectionResult;
  missed_counts: MissedCounts;
  overallResult: "pass" | "fail";
  feedbackRequired: boolean;
};

export function scoreAll(args: {
  applicability: { s1: boolean; s2: boolean; s3: boolean; s4: boolean; s5: boolean };
  verdicts: CriterionVerdict[];
}): OverallScoring {
  const { applicability, verdicts } = args;
  const bySection = (prefix: string) => verdicts.filter((v) => v.id.startsWith(prefix));

  const s1 = scoreS1(applicability.s1, bySection("S1."));
  const s2r = scoreWeightedSection("s2", applicability.s2, bySection("S2."));
  const s3r = scoreWeightedSection("s3", applicability.s3, bySection("S3."));
  const s4r = scoreWeightedSection("s4", applicability.s4, bySection("S4."));
  const s5r = scoreWeightedSection("s5", applicability.s5, bySection("S5."));

  // S5 special rule: applicable, but all criteria N/A → section reports N/A.
  const s5 = s5r.section;
  if (s5.applicable && s5.criteria.every((c) => c.result === "na")) {
    s5.result = "na";
  }

  const sections = [s1.result, s2r.section.result, s3r.section.result, s4r.section.result, s5.result];
  const overallResult: "pass" | "fail" = sections.every((r) => r !== "fail") ? "pass" : "fail";

  const missed_counts: MissedCounts = {
    s2: s2r.missed,
    s3: s3r.missed,
    s4: s4r.missed,
    s5: s5r.missed,
  };

  const anyCritical =
    s2r.section.critical_failure ||
    s3r.section.critical_failure ||
    s4r.section.critical_failure ||
    s5.critical_failure;
  const anyBelowMin = [s2r.section, s3r.section, s4r.section, s5].some(
    (s) => s.applicable && s.result === "fail" && !s.critical_failure
  );
  const s1Low = s1.average != null && Math.round(s1.average) <= 2;

  return {
    s1,
    s2: s2r.section,
    s3: s3r.section,
    s4: s4r.section,
    s5,
    missed_counts,
    overallResult,
    feedbackRequired: anyCritical || anyBelowMin || s1Low,
  };
}
