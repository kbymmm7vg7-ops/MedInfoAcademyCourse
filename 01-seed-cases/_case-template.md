# Seed Case Template — v1.0

Every seed case is authored to this shape. The machine form lives in `case.answer-key.json`
(one per case, matching `answer-key.schema.json`). The `ground_truth_json` column on
`case_templates` stores the answer key; the persona engine reads `persona` + `reveal_rules`;
the evaluator reads `answer_key`; the case generator produces variants preserving `answer_key`.

## Sections per case
1. **Meta**: id, title, difficulty tier (1–6), channel, therapeutic area, fictional product(s).
2. **Scenario premise**: 2–3 sentences of the situation (what the trainee will face).
3. **Persona profile**: who the caller is, demeanor, communication style, what they know/don't.
4. **Beat sheet**: ordered conversational beats the persona drives (opening → complication → close).
5. **Reveal rules**: cues the persona *volunteers* in natural conversation and what the trainee must do to fully surface each. Per the listen-and-clarify model (scoring-contract.md), the persona does NOT hide an AE behind a required interrogation — it mentions a cue offhand, and the trainee must catch it and clarify the specifics. Ignoring a volunteered cue = missed AE. `surfaces_when` describes the clarifying follow-up on something the caller already raised, never a cold canvass for unmentioned symptoms.
6. **Answer key (ground truth)**: requester type, solicited flag, AE present + four-element status, PC present, pregnancy/special-situation flags, correct product, correct SRL id + decoy SRL ids, correct escalation route, SOP timeframe, required documentation fields.
7. **Gold documentation example**: a fully-correct completed case record (doubles as the evaluator calibration fixture).
8. **Expected scorecard outcome**: which sections apply, the pass/fail the gold example must produce, and 1–2 "common failure" variants with their expected Critical fails (for evaluator regression tests).

## Difficulty ladder (PRD §1.5)
- **T1** clean inquiry, unambiguous requester, no safety signal.
- **T2** ambiguous requester type (is this an HCP or a patient?).
- **T3** embedded AE (volunteered cue the trainee must catch and clarify).
- **T4** dual PC + AE (dual routing).
- **T5** hostile / escalation-prone caller.
- **T6** attorney / journalist / internal-sales edge case.

Seed bank (10) covers the ladder twice with different therapeutic areas so certification variants
have room. Cases 1–10 below; 11–20 are post-48h, authored by Sonnet against this template.
