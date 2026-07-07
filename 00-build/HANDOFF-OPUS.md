# HANDOFF — Project Overview & Opus Orchestration Guide
*Written by Fable, 2026-07-07. This is the post-Fable operating document. Attach it (plus RUNBOOK.md) to every Opus session. Where this document and the code disagree, read the code; where it and RUNBOOK.md disagree, this is newer.*

> ⟨2026-07-07, later⟩ **See also `00-build/SURVIVOR-HANDBOOK.md`** — Fable's final artifact: end-to-end
> overview, expanded security register (SEC-1…SEC-14, incl. new persona/evaluator prompt-injection
> items), symptom→fix job aid, session ritual, and the future-improvements roadmap. It sits above
> this doc in precedence for anything both cover.

Opus: you are the orchestrator now. Dispatch routine, well-specified work (screens, forms, seed scripts, content tailoring) to Sonnet subagents; do complex judgment work (evaluator calibration loops, security fixes, cert logic, voice pipeline) yourself. Standing rules from RUNBOOK.md all still apply — especially: **no vendor/employer names anywhere**, **never invent medical content or answer keys** (stop and write BLOCKERS.md), and **Nathan personally signs off rubric changes, answer keys, and evaluator calibration**.

---

## 1. Where the project stands (2026-07-07)

| Session | Status | Verified how |
|---|---|---|
| S1 scaffold/DB/auth/RLS | ✅ done | RLS two-org test 9/9 (`app/supabase/tests/rls-two-org-test.sql`); live login E2E |
| S2 Documentation Simulator | ✅ done | Full trainee flow in browser; data verified in DB |
| S3 persona engine + validator | ✅ built; **live 12-case test NOT yet run** | Validator: 13 vitest. Persona: browser-verified to the model call; transcript test ready (`app/scripts/persona-transcript-test.ts`) |
| Checkpoint A | ⏳ pending S3 test run | — |
| S4 evaluator | ✅ built; **calibration NOT yet run** | Scoring math: 13 vitest. Harness incomplete (see §6.3) |
| S5 voice | ⛔ not started | RUNBOOK S5 unchanged |
| S6 training + certification | ✅ done | Cert logic: 11 vitest; full browser E2E (gate, variant swap, closed-book) |
| S7 admin area | 📋 spec'd in RUNBOOK (added 2026-07-07) | — |
| Checkpoint B | ⏳ | — |

Repo: `kbymmm7vg7-ops/MedInfoAcademyCourse`, branch `main`. Supabase project: `MedInfoAcademy` (`jigiaueqxbnxtbuvuwkr`, us-east-1, free tier; ScanMons untouched). Test user: `nite414+s1test@gmail.com` (email-confirmed; role trainee, no org; all 6 training modules completed).

**Vitest: 37/37** — run from `app/` (`npx vitest run`); running from repo root breaks the `@/` alias, a recurring trap. Migrations 0001–0006 applied and mirrored in `app/supabase/migrations/`. Seeds in `app/supabase/seed/` (all idempotent; applied).

## 2. Architecture map (all paths under `app/src/`)

- **Ground-truth firewall**: `lib/simulator/case-brief.ts` is the ONLY file allowed to read `case_templates.ground_truth_json` (grep-check this in review). It projects the client-safe `CaseBrief` (shuffled SRL candidates, no correct flag), builds the persona system prompt, and assembles evaluator inputs. `lib/simulator/queue.ts` has a narrow sanctioned read (sop timeframe + brief-existence only).
- **Persona**: `lib/persona/prompt.ts` (listen-and-clarify cue discipline — the core domain rule), `lib/persona/engine.ts` (Anthropic call), `app/api/persona/turn/route.ts` (auth, ownership, 60-turn cap, persistence). Runtime models: `lib/config/models.ts` (Sonnet 5 graded personas + evaluator; Haiku 4.5 practice/coaching — config, keep it there).
- **Validator** (deterministic, contract §7): `lib/validator/validator.ts` + `spelling.ts` (nspell + domain allowlist).
- **Evaluator**: `lib/evaluator/{criteria,applicability,scoring,prompt,evaluate}.ts`. LLM returns per-criterion verdicts only; ALL math is code (`scoring.ts`). Validator verdicts are pinned in code (`pinValidatorVerdicts`), not just prompted. Output ajv-validated against the vendored `lib/evaluator/rubric.schema.json` (source of truth: `02-rubric-schema/`). Persistence via service-role client (`lib/supabase/admin.ts`).
- **Certification**: `lib/cert/variant-engine.ts` (deterministic seeded surface variants — deliberately NOT an LLM; do not "upgrade" it without preserving byte-identical regeneration), `lib/cert/logic.ts` (pure burn/lock/eligibility), `lib/cert/actions.ts` (sittings). Evaluation → `pass_bool` → lock happens in `evaluate.ts#persistEvaluation`.
- **Training**: `lib/training/{gate,modules,markdown,actions}.ts` — gate is enforced server-side in `startOrResumeCase` and `startSitting`. The markdown renderer escapes all HTML; never bypass it.
- Next 16 quirks: middleware is `src/proxy.ts` (not middleware.ts); Turbopack can't import files outside `app/`.

## 3. Core invariants — do not break

1. Answer keys never reach the browser (but see **SEC-1** — the DB layer doesn't enforce this yet).
2. All scoring arithmetic in code; the LLM never does math or is trusted for totals.
3. Validator findings override LLM verdicts (enforced in `pinValidatorVerdicts`).
4. Personas volunteer cues, disclose only on cue-specific clarification, never reward fishing, never invent symptoms. Any persona-prompt edit must re-run the transcript test.
5. Variants are deterministic from `(user_id, template_id, ordinal)`; the answer key is never mutated by a variant.
6. `certification_locks` is insert-only, service-role-only.
7. Nathan's sign-off gates (rubric, answer keys, calibration) precede any cert-live change.

## 4. SECURITY AUDIT (Fable, 2026-07-07) — ordered by severity

**SEC-1 (P0) — Answer keys readable via direct API.** RLS on `case_templates` is row-level: any authenticated trainee can run `supabase.from('case_templates').select('ground_truth_json, persona_brief_json, scripted_transcript_json')` with the public anon key + their JWT and read every shared case's answer key, reveal rules, and persona script. The app-layer firewall does not protect the REST endpoint. **Fix (S7-priority-0, before any real trainee)**: move the three columns to a new `case_answer_keys(template_id pk/fk, ground_truth_json, persona_brief_json, scripted_transcript_json)` table with RLS enabled and NO authenticated policies (service/postgres only) — or, minimally, column-level `REVOKE SELECT` from `authenticated`/`anon` on those columns. Update the sanctioned readers (`case-brief.ts`, `queue.ts`, cert `actions.ts`) to read via a SECURITY DEFINER function or the service client. Verify with a curl using the anon key + a trainee JWT expecting zero access. Migration + seed data move required.

**SEC-2 (P0) — SRL bodies readable via direct API.** Same shape: `srd_documents.body` is selectable by any authenticated user, defeating closed-book mode and certification decoy integrity. Fix alongside SEC-1 (move `body` behind a server-gated read or column grant; the open-book brief already gates at app layer).

**SEC-3 (P1) — Persona API cost abuse.** `/api/persona/turn` caps at 60 turns per instance, but a user can create unlimited instances; each turn is a paid Sonnet call on the platform key. Fix: per-user daily turn budget (count today's `conversation_turns` where the instance belongs to the user; deny past N=150) + consider Haiku for `attempt_type='practice'` sittings via the existing `graded` flag.

**SEC-4 (P1) — Silent evaluation failures.** `submitCase` wraps inline evaluation in `catch {}` (deliberate: a submit must never be lost), so missing keys/LLM outages leave cases silently "submitted". Add structured logging + an admin "pending evaluations" view + a retry action (S7).

**SEC-5 (P1) — No audit trail yet.** `audit_log` exists (RLS-partitioned, tested) but nothing writes to it except the RLS test. S7 requires every admin mutation to write it; also add writes for cert lock, ground-truth edits, and role changes.

**SEC-6 (P2) — Privilege-escalation trigger exemption.** `prevent_privilege_escalation` allows role/org changes when `auth.uid() IS NULL` (service context). Correct today; it means any future SECURITY DEFINER RPC touching `users` must be reviewed — it bypasses the guard.

**SEC-7 (P2) — Cert "pending" deadlock.** An abandoned certification sitting leaves the template `pending` forever (blocks re-sit, doesn't burn). Add an expiry policy (e.g. auto-fail/void first attempts not submitted within 24h — decide with Nathan: void-not-burn is friendlier).

**SEC-8 (P2) — Production env hygiene.** Keys live in `app/.env.local` (gitignored — verified). Production: Vercel env vars; `SUPABASE_SERVICE_ROLE_KEY` and `ANTHROPIC_API_KEY` are server-only (never `NEXT_PUBLIC`). Supabase free tier auto-pauses after inactivity — punch list already has the Pro upgrade. Groq ZDR verification before selling the confidentiality tier (punch list).

**SEC-9 (P2) — Firewall discipline is convention.** Nothing stops future code from selecting `ground_truth_json` elsewhere. After SEC-1, add a CI grep (`ground_truth_json` may appear only in `case-brief.ts`, migrations, seeds, and the admin ground-truth editor).

Heuristics worth knowing (not vulnerabilities): validator spelling check skips capitalized tokens (proper-noun false-positive control); the "AE surfaced in transcript" check needs ≥2 distinct description-derived markers in persona turns. Calibration may tune both.

## 5. Environment & keys (state at handoff)

| Key | Where | Status |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` / `..._ANON_KEY` | `app/.env.local` | ✅ present |
| `ANTHROPIC_API_KEY` | `app/.env.local` | ❌ **NOT FOUND at handoff** — Nathan funded $40 and believes it's added, but no `.env`/`.env.local` in this repo contains it. First action: locate/add the line `ANTHROPIC_API_KEY=sk-ant-...` to `app/.env.local`. |
| `SUPABASE_SERVICE_ROLE_KEY` | `app/.env.local` | ❌ missing — dashboard → Project Settings → API. Needed for evaluator persistence + cert locks (`lib/supabase/admin.ts` throws clearly without it). |
| `GROQ_API_KEY` | not yet added | For S5 voice (Nathan has the key). |

Budget guidance for the $40: S3 transcript test ≈ $3–5/run; S4 calibration ≈ $5–15/run; expect 1–3 calibration loops. Leave ≥$10 headroom for the S5 voice demo's persona turns.

## 6. Run order for the next Opus session

1. **Keys** (§5). Then `cd app && npx vitest run` (expect 37) and `npm run build` as a sanity gate.
2. **S3 DoD**: `cd app && npx tsx scripts/persona-transcript-test.ts` (loads `.env.local` itself). Writes `05-persona-engine/persona-transcript-test-results.{json,md}`; exit 0 = all behaviors pass. If failures: read the failing transcripts in the JSON; fixes belong in `lib/persona/prompt.ts` cue-discipline wording; re-run. Do not weaken the test to pass.
3. **Checkpoint A** (RUNBOOK): Fable-availability is limited — if no Fable session is available, Nathan reviews directly using this checklist against the results JSON: (a) SC-03/04/08/11/12 catch runs: cue volunteered ≤3 persona turns, detail surfaced only after the clarify turn; (b) pass runs: detail never surfaced despite the cue appearing; (c) SC-01/09/06 fish runs: zero invented symptoms; (d) no transcript reads as an interrogation. Explicit go/no-go recorded in BLOCKERS.md before calibration.
4. **Finish the calibration harness**: `app/scripts/calibration/fixtures.ts` exists (916 lines, from a Sonnet agent that died mid-task on a session limit — **incomplete and unreviewed**: it parses but exposes only a default export, not the specced named exports `buildGoldDoc`/`buildGoldTranscript`/`buildFailureFixtures`; expect to finish or rewrite it, verifying against 2–3 answer keys). Write `app/scripts/evaluator-calibration.ts` per the spec embedded in the fixtures file header comments + RUNBOOK S4: gold 12/12 must produce `pass`; every non-empty `expected_critical_fail` entry must produce those exact criterion fails; report to `07-evaluator/calibration-report.{json,md}` including a blind-scoring appendix. Add a `--fixtures-only` deterministic mode (validator-clean gold docs) before spending API money.
5. **S4 gate**: Nathan blind-scores ≥10 outputs (zero Critical disagreements, ≤1 Major/case). Loop `lib/evaluator/prompt.ts` on failures.
6. **SEC-1/SEC-2 fix** — before any real trainee touches the system.
7. **S5 voice** (RUNBOOK unchanged; ElevenLabs free ≈10 min/month — short utterances, full demo last), then **S7 admin**, then **Checkpoint B** (Fable if available; otherwise Nathan + this doc's §3/§4 as the review lens), then punch list.

## 7. Artifacts index

- PRD: `miacademycourse_prd_v1.md` · RUNBOOK: `RUNBOOK.md` (S7 added) · Blockers: `BLOCKERS.md`
- Rubric contract: `02-rubric-schema/` (scorecard v1, schema, scoring-contract) — Nathan-approved
- Seed cases + answer keys: `01-seed-cases/` (SC-01…SC-12 `.md` + `.answer-key.json`, addenda, product bank, SOP) — Nathan-approved; `expected_critical_fail` lists only source-marked Criticals (empty array = plain fail), which the calibration harness relies on
- Specs: `08-accreditation-cert/spec_certification-logic.md`, `09-enterprise-lite/spec_tenant-isolation-rls.md`, `06-voice-layer/spec_voice-pipeline.md`
- Tests: `app/supabase/tests/` (RLS), `app/src/**/*.test.ts` (37), `app/scripts/persona-transcript-test.ts`
- Fable checkpoint artifacts land in `05-persona-engine/` and `07-evaluator/`
