# STATE — current build state

This is the single current-state document for MedInfo Academy. It reflects what is actually
in the repo as of this writing (2026-09-02). For the decision/blocker history that produced
this state, see `00-build/DECISIONS.md` (the merged, newest-first decision/blocker log). Do
not treat anything below as a substitute for reading the code — where they disagree, the
code wins.

## 1. Session status table (S1–S7, plus post-S7 work)

| Session | What shipped | Commit(s) |
|---|---|---|
| S1 | Next.js scaffold (App Router, TS, Tailwind); Supabase email auth + session proxy; nav shell; initial migration (PRD §8 schema + tenant-isolation deltas: `variant_snapshot_json`, `variant_ref`, `rubric_version`, `org_case_access`, `audit_log.org_id`); signup→users mirror trigger; RLS with `current_org_id()`, two-org isolation test 9/9; SC-01..SC-12 answer keys converted to schema-valid JSON | `0e712b1` |
| S2 | Documentation Simulator: case queue (status/SLA, start/resume); 5-tab record (Intake / Inquiry / Safety / Response / Closure); SC-03 wired as the static 20-turn scripted case; ground-truth firewall (`ground_truth_json` read only server-side); seed data (18 SRL bodies, 12 case templates) | `63d0456` |
| S3 | Persona engine (listen-and-clarify cue discipline); model policy config; `/api/persona/turn` (auth + ownership + turn cap); ground-truth firewall extended into `case-brief.ts`; deterministic Documentation Validator (13/13 vitest); live chat pane (12 cases) | `52b9caa` |
| S4 | Evaluator: criteria catalog, deterministic applicability/scoring math, evaluator prompt, orchestrator with validator-pinned verdicts, ajv validation, service-role persistence, cert pass_bool + lock hook; calibration harness (`scripts/evaluator-calibration.ts`); SC-05 answer-key fix (Nathan-approved) + S3.4 forced-NA; final calibration 12/12 gold, 17/17 Criticals, vitest 44/44 | `084edcb`, `f5b1dd7`, `9800a8f` |
| S5 | Voice pipeline: mic → adaptive VAD → Groq Whisper v3 Turbo (STT) → persona → Groq Orpheus (TTS, `canopylabs/orpheus-v1-english`) → WebAudio playback; caption-strip-over-doc-panel layout; two live-E2E bugs fixed (HTMLAudio activation loss; Groq WAV header normalization); ElevenLabs kept as a thin adapter (A/B skipped) | `794acde` |
| S6 | Training & Orientation (6 self-study modules, markdown reader, completion gate); certification workflow (deterministic surface-variant engine, first-attempt burn, 3-pass lock + evidence packet, `certification_locks` table); Accreditation Center UI | `8788ef4` |
| S7 | SEC-1/SEC-2 closed (migration 0007: `case_answer_keys` + `srd_document_bodies` service-role-only, RLS-no-policy + REVOKE); audit helper wired to cert lock + eval-failure logging; `/admin` server-side 404 gate; SEC-7 cert sitting expiry (migration 0008, void-don't-burn, 24h, lazy); admin case bank + gated ground-truth editor + custom scenario intake; training module management with org shadowing (migration 0009); users/roster, orgs, pending-evaluations retry, Cohort Lite under `/manager`; `dictionary-en`/Turbopack production bug fixed (`serverExternalPackages`) | `ec48d73`, `c79b668` |
| Post-S7: S2.7 safety-tab redesign | Safety tab redesign (four-element test removed; AE block gains patient initials/DOB/gender, concomitant meds, HCP-follow-up consent; pregnancy/lactation boolean dropped in favor of SSE entry; Legal/Media removed as special situations); routing moved to Closure tab with PV/Quality/Legal/Media roster; S2.7 (HCP consent) goes live; new S5.4 conditional-NA; SC-05/06/07 keys regraded (Nathan-ratified) | `04825d2` |
| Post-S7: Groq LLM migration + SEC-10 | LLM adapter layer (`src/lib/llm/`), Groq as default provider with Anthropic fallback via `LLM_PROVIDER=anthropic`; per-provider `MODEL_POLICY`; evaluator structured output via `json_schema`; SEC-10 persona anti-leak hardening (deflect-in-character + ADVERSARIAL harness strategy, all 12 cases); vitest 114/114 (Nathan-ratified) | `fcf9da0` |

**Checkpoint A** (persona engine go/no-go): **GO** (12/12 green, `05-persona-engine/persona-transcript-test-results.{json,md}`; see `00-build/DECISIONS.md` 2026-07-07 entries for the fixture-fix history).

**Checkpoint B** (cert variant/burn/lock + evaluator calibration review, final Fable act per `RUNBOOK.md`): **pending**.

**Certification**: **OFFLINE**, pending Nathan's blind-score of the calibration report (`07-evaluator/calibration-report.md` Part A) under the post-safety-tab-redesign + Groq-model-swap outputs — see the Groq-migration and 2026-07-12 entries in `00-build/DECISIONS.md`. Cert does not go live until that gate clears.

**Runtime LLM**: Groq is the default provider (`src/lib/llm/`). Evaluator + graded persona run on `openai/gpt-oss-120b`; practice persona + coaching run on `openai/gpt-oss-20b`; `moonshotai/kimi-k2-instruct-0905` is a documented escalation slot if the evaluator gate fails on gpt-oss-120b. Anthropic is available as a one-env-var fallback (`LLM_PROVIDER=anthropic`), with per-role overrides in `app/src/lib/llm/config.ts`. The Groq org is on the free `on_demand` tier (8K TPM / 200K TPD for the gpt-oss models) — evaluator calls (~12K tokens) currently 413 on this tier; the Dev Tier upgrade is a Nathan-owned, money-spending decision (see §4 below).

**Tests**: see the S8 close-out entry in `00-build/DECISIONS.md` for the current count. At commit
`fcf9da0` it was 114 tests / 16 files; S8 adds the fake-adapter, turn-budget, and evaluator-fence
tests on top. Re-run `cd app && npx vitest run` for the authoritative number.

**Migrations** (`app/supabase/migrations/`), in order:
1. `0001_init_schema.sql`
2. `0002_rls_policies.sql`
3. `0003_scripted_transcript.sql`
4. `0004_persona_brief.sql`
5. `0005_training_content_and_cert.sql`
6. `0006_evaluation_record_json.sql`
7. `0007_answer_key_isolation.sql`
8. `0008_cert_sitting_expiry.sql`
9. `0009_training_module_slug_scope.sql`
10. `0010_user_deactivation.sql`

**Seed files** (`app/supabase/seed/`):
- `seed_s2.sql`
- `seed_s3_persona_briefs.sql`
- `seed_s5_product_labels.sql`
- `seed_s6_training_modules.sql`

## 2. Environment keys (matches `app/.env.example`)

`app/.env.local` does **not** currently exist in this working copy — it must be created locally
(gitignored) before running anything that needs live services.

| Variable | Required? | Server-only or public | Purpose |
|---|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Required | Public | Supabase project URL for the client SDK |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Required | Public | Supabase anon key for the client SDK |
| `SUPABASE_SERVICE_ROLE_KEY` | Required | Server-only (never `NEXT_PUBLIC`) | Evaluator persistence + admin flows; writes `evaluation_scores`/`certification_locks` that RLS intentionally blocks trainees from writing themselves |
| `GROQ_API_KEY` | Required (default provider) | Server-only | Serves the chat LLMs (default provider), Whisper STT, and Orpheus TTS |
| `ANTHROPIC_API_KEY` | Optional | Server-only | Only needed when rolling back with `LLM_PROVIDER=anthropic` (per-role overrides in `src/lib/llm/config.ts`) |
| `LLM_PROVIDER` | Optional (commented out by default: `# LLM_PROVIDER=anthropic`) | Server-only | Set to `anthropic` to force the Anthropic fallback path instead of Groq |
| `LLM_PROVIDER=fake` | Optional | Server-only | Offline deterministic adapter: no key, no network, no cost. Local plumbing + E2E only — never a scoring, calibration, or certification run |
| `ELEVENLABS_API_KEY` | Optional (commented out by default) | Server-only | TTS A/B comparison only; not the production TTS path |
| `PERSONA_DAILY_TURN_BUDGET` | Optional (unset = 150) | Server-only | Per-user daily persona-turn budget (SEC-3) |
| `E2E_SUPABASE_URL`, `E2E_SUPABASE_ANON_KEY`, `E2E_TRAINEE_EMAIL`, `E2E_TRAINEE_PASSWORD` | Optional — the Playwright spec (`app/e2e`) is skipped unless all four are set | Server-only (test config) | Signs in as a seeded trainee and writes real rows; point at a throwaway/local Supabase project, never production |
| `E2E_BASE_URL` | Optional (defaults to a dev server Playwright starts) | Server-only (test config) | Base URL for the Playwright E2E harness |

## 3. Current run order

Taken from the "After the upgrade, run in order" list in `00-build/DECISIONS.md` (the Groq-migration entry, 2026-07-18). All commands run from `app/`:

1. `npx tsx scripts/groq-structured-probe.ts` → confirms/pins `GROQ_STRUCTURED_MODE` in `src/lib/llm/groq.ts` (currently `json_schema`).
2. `npx tsx scripts/persona-transcript-test.ts` — gate: 12/12 behavior + 12/12 adversarial.
3. `npx tsx scripts/evaluator-calibration.ts` — gate: 12/12 gold + 18/18 Criticals. If it fails, swap `evaluator.groq` to `kimi-k2` in `src/lib/config/models.ts` and re-run; if that also fails, set `LLM_PROVIDER_EVALUATOR=anthropic`.

The regenerated calibration report from step 3 becomes the artifact for Nathan's pending full 12-output blind-score (covering both the safety-tab redesign and the Groq model swap in one review). Cert stays offline until that gate clears.

Interim (current, free-tier) operating mode while the Dev Tier upgrade is pending:
- Persona turns (text + voice) fit the free tier — run single cases at a time: `npx tsx scripts/persona-transcript-test.ts SC-09` (results merge across runs).
- Evaluator calls cannot run on the free tier at all (413) — in-app submissions land as "pending" (the `submitCase` silent fallback); recover them via the admin pending-evaluations retry view after the Dev Tier upgrade. Calibration's paid mode is deferred likewise.
- Voice STT/TTS is unaffected by the tier limit.

Standard local dev/test commands (from `app/`): `npm run dev`, `npx vitest run`, `npx eslint .`, `npx tsc --noEmit`, `npm run build`.

## 4. Open gates, by owner

| Gate | Owner | Status |
|---|---|---|
| Groq Dev Tier upgrade (Groq console → Settings → Billing) | Nathan | Deferred by Nathan (2026-07-18); blocks paid evaluator/calibration runs on Groq |
| Full 12-output blind-score of `07-evaluator/calibration-report.md` Part A (post safety-tab redesign + Groq model swap) | Nathan | Pending — required before cert can go live |
| cert-live flip (per `08-accreditation-cert` spec, no code expected) | Nathan | Blocked on the blind-score above |
| Rubric schema sign-off, all 12 seed-case answer keys, evaluator-calibration sign-off | Nathan | Standing sign-off authority per `RUNBOOK.md`; individual key edits already ratified are recorded in `00-build/DECISIONS.md` |
| Checkpoint B (cert variant/burn/lock + calibration review, final Fable act) | Nathan / Fable session | Pending |
| Anything that spends money (API tier upgrades, paid production TTS vendor, Supabase Pro upgrade) | Nathan | Case-by-case; see `00-build/DECISIONS.md` for individual decisions of record |
| Production TTS vendor decision (Orpheus vs. ElevenLabs paid vs. Deepgram Aura-2) + commercial license | Nathan | Launch-time decision, not yet made |

## 5. Security items closed so far (from commit history)

These are the SEC-numbered items referenced in the S7 and post-S7 commits; treat this as a pointer
into the commit history and `00-build/DECISIONS.md`, not a full security register (the fuller
register, as of 2026-07-07, is `00-build/SURVIVOR-HANDBOOK.md` §5 — historical, may be stale).

- **SEC-1 / SEC-2** — answer keys (`case_answer_keys`) and SRL bodies (`srd_document_bodies`) moved
  to service-role-only tables (migration `0007`), RLS-no-policy + `REVOKE`; verified with direct
  PostgREST probes under a trainee JWT (all denied) and an RLS test. Closed in `ec48d73`.
- **SEC-4** — evaluator failures no longer strand a submission silently; the admin pending-
  evaluations view retries them. Closed in `c79b668`.
- **SEC-5** — audit trail (`lib/audit/log.ts`) wired to cert-lock writes and role changes.
- **SEC-7** — certification sitting expiry: void-don't-burn, 24h, lazy enforcement at the
  eligibility check (migration `0008`).
- **SEC-9** — the answer-key/SRL-body firewall check is a vitest test (grep-based), not just a
  manual review step.
- **SEC-10** — persona anti-leak hardening shipped with the Groq migration: a deflect-in-character
  prompt section plus an ADVERSARIAL harness strategy (leak / invention / character-break
  detection) run across all 12 cases. Closed in `fcf9da0`.

## 6. Where things live (quick index)

- Persona engine: `app/src/lib/persona/`; transcript test: `app/scripts/persona-transcript-test.ts`
  → `05-persona-engine/persona-transcript-test-results.{json,md}`.
- Evaluator: criteria catalog, scoring math, prompt, and orchestrator under `app/src/lib/evaluator/`
  (path may vary — read the code); calibration harness: `app/scripts/evaluator-calibration.ts` →
  `07-evaluator/calibration-report.{json,md}` and `07-evaluator/calibration-summary.md`.
- LLM adapters: `app/src/lib/llm/` (Groq default, Anthropic fallback); model policy:
  `app/src/lib/config/models.ts`.
- Voice pipeline: `06-voice-layer/spec_voice-pipeline.md` (spec); adapters + WAV normalization under
  `app/src/lib/voice/`.
- Certification logic: `08-accreditation-cert/spec_certification-logic.md` (spec) + the
  variant/burn/lock implementation it drove in S6.
- Tenant isolation / RLS: `09-enterprise-lite/spec_tenant-isolation-rls.md` (spec) +
  `app/supabase/migrations/0002_rls_policies.sql`.
- Admin dashboard: `10-dashboard/spec_admin-dashboard.md` (spec), built in S7.
- Seed cases + answer keys: `01-seed-cases/` (on-disk source of truth; the DB copy lives in the
  service-role-only tables from SEC-1/SEC-2).
- Rubric: `02-rubric-schema/` (`rubric-scorecard-v1.md`, `rubric.schema.json`,
  `scoring-contract.md`).

## 7. Not covered here

Full historical narrative (session-by-session findings, ratified decisions, superseded plans) lives in `00-build/DECISIONS.md`. Product requirements are in `miacademycourse_prd_v1.md`. Operational session-start instructions are in `RUNBOOK.md`.
