# NEXT SESSION — S4 Evaluator + calibration (Opus)

*Written 2026-07-07 at the S3/Checkpoint-A boundary. Checkpoint A is GO (persona transcript test 12/12 green, committed `023c3f9`). SC-11 answer-key edit is Nathan-approved. This is the literal startup for the next session.*

## How to start the session
1. Open a **fresh Opus 4.8** session in the repo root (`/Users/Nathan/Documents/MedInfoAcademyCourse`).
2. **Attach:** `RUNBOOK.md`, `00-build/HANDOFF-OPUS.md`, `00-build/BLOCKERS.md`, `00-build/NEXT-SESSION-S4.md` (this file), `02-rubric-schema/`, `01-seed-cases/`, `07-evaluator/`, and `app/scripts/calibration/`.
3. **Paste the prompt below.**

## Prompt to paste
> You are the Opus orchestrator for the MedInfo Academy build, session **S4 (Evaluation Agent + calibration)**. Dispatch routine, well-specified work to Sonnet 5 subagents; do the evaluator/calibration judgment work yourself. Standing rules: **no vendor/employer names anywhere; never invent medical content or answer keys — stop and write `00-build/BLOCKERS.md` instead; Nathan personally signs off the evaluator calibration before cert goes live.**
>
> Checkpoint A is already **GO** (persona transcript test 12/12 green, committed) — **do NOT re-run the persona transcript test; it spends budget and is done.** Vitest (37/37) and build were green at last handoff.
>
> **Step 0 — re-seed the approved SC-11 answer key into the DB.** Last session Nathan approved a lay-wording addition to `01-seed-cases/SC-11.answer-key.json` `reveal_rules[0].detail_withheld` (ground truth unchanged). The DB `case_templates` row for SC-11 still holds the pre-edit copy. Re-apply the relevant idempotent seed in `app/supabase/seed/` (or a targeted update) so `case_templates.ground_truth_json` for SC-11 matches the approved file, and verify the `detail_withheld` string in the DB equals the file. Dispatch this to Sonnet; you verify the DB matches.
>
> **Main objective — finish the calibration harness, then run S4 calibration (HANDOFF §6.4 + RUNBOOK S4):**
> 1. **Finish/rewrite `app/scripts/calibration/fixtures.ts`** — it is INCOMPLETE and UNREVIEWED (a Sonnet agent died mid-task; it parses but exposes only a default export, not the specced named exports `buildGoldDoc` / `buildGoldTranscript` / `buildFailureFixtures`). Implement per its own header-comment spec, verifying the output against 2–3 answer keys by hand. You own this.
> 2. **Write `app/scripts/evaluator-calibration.ts`** (spec in the fixtures header + RUNBOOK S4): run all 12 gold documentation examples → each must produce `pass`; run each case's `common_failures` → every non-empty `expected_critical_fail` must produce those exact criterion fails (recall: `expected_critical_fail` lists ONLY source-marked Criticals; `[]` = plain fail — the harness relies on this). Write a report to `07-evaluator/calibration-report.{json,md}` including a **blind-scoring appendix** for Nathan.
> 3. **Add a `--fixtures-only` deterministic mode** (validator-clean gold docs, no API calls) and run THAT first to shake out fixture/determinism bugs **before** spending any Anthropic budget. Then do one paid run. Budget: calibration ≈ $5–15/run, expect 1–3 loops; keep ≥$10 headroom for the S5 voice demo.
>
> **Evaluator invariants to preserve (HANDOFF §3):** all scoring arithmetic in code (`lib/evaluator/scoring.ts`), the LLM returns per-criterion verdicts only and never does math; validator verdicts are pinned over the LLM (`pinValidatorVerdicts`); output is ajv-validated against the vendored `lib/evaluator/rubric.schema.json`; every fail cites verbatim evidence and no criterion fails without evidence. Fix failures by looping `lib/evaluator/prompt.ts`, not by weakening checks.
>
> **Sanity-check SC-11 in calibration:** its lay `detail_withheld` terms now also feed the validator's "AE/LOE-surfaced-in-transcript" ≥2-marker check (HANDOFF §4) — confirm SC-11's gold example passes and its LOE common-failure trips the right Critical.
>
> **Definition of done:** 12/12 gold examples produce `pass`; each `common_failures` entry trips its listed Critical criterion; calibration report generated. **Then STOP** — Nathan blind-scores ≥10 outputs (ship only if zero Critical-criterion disagreements, ≤1 Major/case). Do not activate certification-live before that gate.

## Not part of S4 (separate tracks — don't fold in unless Nathan says)
- **SEC-1 / SEC-2 (P0)** — answer keys (`ground_truth_json`, `persona_brief_json`, `scripted_transcript_json`) and SRL `body` are readable by any authenticated user via direct PostgREST; the firewall is app-layer only. Fix **before any real trainee** (HANDOFF §4/§6.6, S7-priority-0). Independent of calibration.
- **S5 voice**, **S7 admin**, Checkpoint B, punch list — per RUNBOOK, after S4.

## Recurring traps (HANDOFF §2)
- Run vitest/tsx from `app/`, never repo root (breaks the `@/` alias).
- Next 16: middleware is `src/proxy.ts`; Turbopack can't import files outside `app/`.
- The tsx scripts self-load `app/.env.local`; don't rely on unsetting shell env to prevent API spend — use the `--fixtures-only` mode instead.
- Ground-truth firewall: `ground_truth_json` may be read only in `lib/simulator/case-brief.ts` (+ migrations/seeds/admin editor). Don't widen it.
