# S4 Evaluator Calibration — summary & decisions (for Nathan's sign-off gate)

*Opus orchestrator, 2026-07-09. Companion to the machine report `calibration-report.{json,md}`
(all 50 outputs + blind-scoring appendix) and the free deterministic pre-check
`calibration-fixtures-report.{json,md}`.*

## Bottom line

- **Gold examples: 12/12 → `pass`, stable across 5 paid runs.** ✅
- **Failure fixtures: 16/17 non-empty `expected_critical_fail` trip their exact Critical(s).** The
  single non-match is **not an evaluator error — it is an answer-key mis-tag** (SC-05 failure-1, below).
  With that key corrected it is 17/17.
- **0 schema/validation errors, 0 lost evaluations** (robustness backfills below).
- **This is a conditional GO into your blind-scoring gate.** Nothing about scoring math, the rubric
  ratios, or any answer key's ground-truth facts was changed. The calibration work aligned the
  evaluator to (a) the MVP documentation form's actual fields and (b) the scoring-contract N/A rules,
  and fixed evaluator-input hygiene. **Your gate stands: blind-score ≥10 outputs from
  `calibration-report.md` Part A, then reveal Part B — ship only on zero Critical disagreements and
  ≤1 Major/case.**

## The one non-match — needs your decision (answer-key, not evaluator)

**SC-05 failure-1 — "Admits the drug caused the rash / apologizes for a product defect."**
Answer key `expected_critical_fail = ["S5.1","S4.2"]`. The evaluator **correctly** fails **S4.2**
(medical-advice/causation) and **S5.3** (promotional), but marks **S5.1 = na** — because S5.1 is
strictly the *off-label* criterion and nothing off-label occurred. A causation admission is not an
off-label event. **The evaluator is right; the key's `S5.1` tag is the bug.**
- **Recommendation (your sign-off):** change SC-05 failure-1 `expected_critical_fail` to `["S4.2"]`
  (optionally note S5.3 as a Major). I did **not** touch it — answer keys are your artifact. Once you
  approve, re-run `npx tsx scripts/evaluator-calibration.ts` → 17/17.

## Calibration decisions made this session (please ratify at the gate)

These align the evaluator to the MVP simulator surface and the scoring contract. All are the same
kind as the already-approved forced-N/A of S1.4 (vocal skills). None weakens a Critical criterion;
all are keyed off ground truth or the fixed form shape, deterministically (not left to the LLM).

1. **MVP structural N/A** (`criteria.ts MVP_FORCED_NA`, applied in `evaluate.ts`): the MVP
   documentation form has **no field** for con-meds / past-medical-history / lab (S2.6), HCP
   consent-to-contact (S2.7), AE/PC questionnaires (S2.5/S3.5), source-document attachments
   (S2.8/S3.9/S4.11), AE/PC resolution narrative (S2.9/S3.10), retrieval kit (S3.8),
   credit/refund/replacement (S3.11), or a correspondence log (S4.9). The evaluator was failing
   **every gold AE case** on these absent fields. Forced N/A. **→ Product finding:** the answer keys
   list several of these as `required_fields` (e.g. `concomitant_meds`, `hcp_info_and_consent`,
   `retrieval_kit_offered`). Either the form grows these fields (future enhancement, punch list) or
   they stay N/A in MVP. Your call at the gate.
2. **S4.6 conditional N/A**: no source is expected when `correct_srl = "none"` (refusal / redirect /
   general-guidance cases: SC-06, SC-07, SC-11). N/A there; otherwise judged normally.
3. **S5.2 conditional N/A**: N/A when the case has **no** enumerated special situation
   (`special_situations` empty/`["none"]` and no pregnancy/lactation). A **serious AE (e.g.
   hospitalization) is not itself a special situation** — its seriousness lives in S2. This removed a
   run-to-run flip on SC-12.
4. **Validator S4.3** (`validator.ts`): patient/consumer reporters may give **city+state or postal**
   even when reporting an AE/PC — matches the approved seeds **SC-04 & SC-08** (patient AE reports
   with city+state-only contacts) and the scorecard's patient clause. Previously the validator
   over-required a full street address for any AE/PC case, which those approved gold cases cannot
   satisfy.
5. **Validator S4.14** (`validator.ts` + `spelling.ts`): hyphenated domain compounds
   (`off-label`, `take-back`, `creatinine-clearance`, `co-administered`) are now checked
   component-by-component so they don't false-positive; added `prescriber` to the allowlist.
6. **Evaluator input hygiene** (`prompt.ts sanitizeGroundTruthForEvaluator`): the evaluator prompt
   now **strips `expected_outcome`** from the ground truth before rendering it. Previously the whole
   answer key — including its own `common_failures → expected_critical_fail` grading map — was fed to
   the judge. This (a) was a real production leak of the grading key into the evaluator and (b) would
   invalidate calibration (the LLM could echo the listed Critical). **This is a runtime change on the
   evaluator path** — flagged for your awareness.
7. **Robustness backfills** (`evaluate.ts`, `scoring.ts`): a `fail` verdict missing the
   schema-required `evidence`/`rationale` is backfilled from the other field instead of throwing.
   Previously an ajv throw was swallowed by `submitCase`'s `catch{}` and left the case **silently
   pending** (SEC-4-adjacent). Eliminated all validation retries in the final run.

## What was NOT changed

- No answer-key ground-truth facts, no `expected_critical_fail` lists, no rubric criteria/weights/
  ratios, no scoring math. `sanitize…` only hides `expected_outcome` from the LLM; all scoring still
  runs off the full ground truth in code.
- SC-11 DB row was re-seeded to the approved answer key (S4 step 0) and **all 12 on-disk answer keys
  were verified byte-equal to the DB** (`--verify-db`) — calibration ground truth == runtime.

## Residual / caveats for the gate

- **LLM judgment variance**: on borderline Critical judgments (esp. S5.1 off-label to an HCP —
  SC-09 failure-3 — and S4.2 medical-advice phrasing) the evaluator occasionally flips between runs.
  Gold pass and clear-cut failures are stable; the borderline ones are exactly what your blind score
  should scrutinize. This is inherent to an LLM judge, not a scoring bug.
- **Fixtures are synthetic**: gold docs/transcripts are mechanically built from the approved keys
  (`scripts/calibration/fixtures.ts`); the transcripts read a bit scripted. They exercise the
  evaluator faithfully but are not a substitute for real trainee transcripts. Failure fixtures are
  the answer keys' own `common_failures` injected into the gold fixture.

## How to reproduce / re-run

```
cd app
npx tsx scripts/evaluator-calibration.ts --verify-db        # on-disk keys == DB (no API)
npx tsx scripts/evaluator-calibration.ts --fixtures-only     # deterministic fixture check (no API)
npx tsx scripts/evaluator-calibration.ts                     # full paid run (~$2–3, ~50 Sonnet calls)
```
Filters: positional `SC-03 SC-11 …`, `--gold-only`, `--failures-only`, `--concurrency=N`.

## Definition-of-done status

12/12 gold pass ✅ · report generated ✅ · 16/17 criticals (17/17 after the SC-05-f1 key fix) ·
**next = your blind-scoring gate.** Do not activate certification-live before that gate.
