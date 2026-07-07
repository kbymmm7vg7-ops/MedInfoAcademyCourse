# Evaluator Scoring Contract — v1.0

Binding rules for how the AI evaluator (and the rules-based Documentation Validator beneath it)
applies `rubric-scorecard-v1.md` to a case. Opus implements these exactly; deviations are bugs.

## Inputs
1. Conversation transcript (all turns, with timestamps).
2. Submitted documentation record (all tabs).
3. The case's **ground-truth answer key** (from the seed case / generated variant snapshot).
4. Channel (voice/text) and case source.

The evaluator scores against ground truth, never against its own medical opinion. If ground truth
says AE present and the trainee never flagged it → S2.1 fail with transcript evidence of the missed signal.

## Section applicability (deterministic, computed before the LLM runs)
- **S1**: applicable when case source is a live conversation (phone/voice or live chat). Email/portal → N/A.
- **S2**: applicable if `ground_truth.ae_present` OR trainee documented an AE. (A false AE flag is scored inside S2 — identification wrong → S2.1 fail.)
- **S3**: same rule for PC.
- **S4**: always applicable.
- **S5**: always applicable; individual criteria N/A when the case contains no trigger (e.g., no off-label probe → S5.1 N/A). All-N/A → section N/A.

## Scoring rules
1. **Weighted sections (S2–S5)**: each criterion Pass (full Val) / Fail (0) / N/A (excluded).
   `available_points` = Σ Val over non-N/A criteria.
   `min_passing` = ceil(section_base_ratio × available_points), where base ratios are 65/74 (S2), 75/84 (S3), 39/43 (S4), 30/38 (S5).
2. **Critical auto-fail**: any failed Critical criterion fails the section regardless of points.
3. **S1**: 1–4 per criterion, N/A excluded; average of scored items; pass ≥ 2.5. In MVP, S1.4 is always N/A; vocal-filler half of S1.5 is ignored in text mode.
4. **Overall pass** = every applicable section passes.
5. **Evidence obligation**: every Fail must cite verbatim evidence (transcript excerpt or documentation field). No evidence → the evaluator may not fail the criterion.
6. **Constructive feedback required** when: any Critical fail; any section under min_passing; S1 rounded average ≤ 2.
7. **Determinism aids**: the rules-based Documentation Validator pre-computes objective criteria and passes them to the LLM as fixed findings it must not contradict: required-field presence (S4.13, S4.3), spelling count (S4.14), Received Date/Time match (S2.10/S3.12/S4.8), report-timeframe arithmetic (S2.2/S3.2), lot/NDC captured (S3.6). The LLM judges only the judgment-laden criteria.
8. **Timeframes**: simulation SOP defines AE/PC submission within 1 business day of receipt (`01-seed-cases/simulation-sop.md`). In-simulation, "submission" = trainee completing the Safety tab + routing before case closure; the SLA clock is simulated case time, not wall time.
9. **Versioning**: every score record stores `rubric_version` and evaluator version. Rubric changes bump the version; old records are never rescored silently.

## Listen-and-clarify model (NOT probing) — domain rule
MI specialists do **not** interrogate or fish for AEs/PCs — soliciting adverse events is not how the role
works and can look like leading the caller. The gradeable skill is **active listening + clarification**:
the caller *volunteers* a cue in the natural course of the conversation (an offhand mention of a symptom,
a hospitalization, a dose change), and the specialist must (a) catch that cue rather than let it pass, and
(b) clarify the specifics of what the caller already raised — without prompting for new symptoms the caller
never mentioned.

Consequences for scoring:
- Personas **volunteer** the cue; they do not hide the fact behind a required interrogation. A trainee who
  answers only the surface question and ignores a volunteered cue **misses** the AE/PC/special situation.
- Credit "identification" (S2.1/S3.1/S5.2) when the trainee catches a volunteered cue and clarifies it.
  Do **not** reward manufacturing an AE the caller never raised (over-flagging fails S2.1/S3.1 — e.g. SC-01).
- S1.3 is scored as *listened and clarified*, not *probed*. Asking the caller to expand on something they
  themselves mentioned = clarification (good). Cold-canvassing for unrelated symptoms = not the skill and,
  if it leads to a fabricated report, is penalized.

## Coaching mapping (PRD §10 survives as language, not as the score)
AE/PC Detection → S2.1/S3.1/S5.2 • Questioning Technique → S1.3 • Compliance → S5.1/S5.3 • Documentation → S2.4–S2.10, S3.4–S3.12, S4 • Empathy → S1.2 • Regulatory risk → S5 Critical fails.
The Coaching Agent phrases feedback in these dimension names; the pass/fail math above is the only scoring authority.

## Calibration gate (before certification mode activates)
Nathan blind-scores ≥10 evaluator outputs using the scorecard. Ship gate: **zero Critical-criterion
disagreements**, ≤1 Major disagreement per case. Failures loop into evaluator prompt fixes, then re-test.
