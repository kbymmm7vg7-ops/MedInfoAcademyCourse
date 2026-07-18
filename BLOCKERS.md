# BLOCKERS

## Groq migration (2026-07-18) — Groq org must upgrade to Dev Tier before paid gate runs
- **Decision of record (Nathan, 2026-07-18):** all LLM calls move from Anthropic to
  Groq to preserve the ~$6 Anthropic balance. Models: evaluator + graded persona =
  `openai/gpt-oss-120b`, practice persona + coaching = `openai/gpt-oss-20b`
  (escalation slot: `moonshotai/kimi-k2-instruct-0905` if the evaluator gate fails).
  Anthropic stays as a one-env-var fallback: `LLM_PROVIDER=anthropic` (per-role
  overrides in `app/src/lib/llm/config.ts`). SEC-10 persona anti-leak hardening
  shipped in the same change (deflection rules + ADVERSARIAL harness strategy).
- **BLOCKED (deferred by Nathan, 2026-07-18):** the Groq org
  (`org_01ksxtv618e1597rmntmdg3e0k`) is on the free `on_demand` tier — 8K
  tokens/minute and 200K tokens/day for the gpt-oss models. An evaluator request
  alone is ~12K tokens → HTTP 413; the full persona transcript test would blow the
  daily cap. **Nathan's ruling: stay on free tier for now, upgrade to Dev Tier
  (Groq console → Settings → Billing) closer to production; until then limit
  testing to single cases at a time.**
- **Interim operating mode (free tier):**
  - Persona turns (text + voice) fit the free tier — single-case harness runs are
    fine: `npx tsx scripts/persona-transcript-test.ts SC-09` (results merge, so the
    12/12 verdict accumulates across days if run case-by-case under the daily cap).
  - Evaluator calls CANNOT run on free tier at all (413) — in-app submissions will
    land as "pending" (submitCase's silent fallback); recover them with the admin
    pending-evaluations retry view AFTER the Dev Tier upgrade. Calibration paid
    mode is likewise deferred.
  - Voice STT/TTS is unaffected.
- **Verified so far (free tier / free checks):** vitest 114/114; calibration
  `--fixtures-only` + `--verify-db` green; persona SC-09 live on Groq incl. the new
  adversarial probe (deflects in character, no leak, no reasoning text in replies);
  Anthropic fallback path smoke-tested (one Haiku call).
- **After the upgrade, run in order (all `cd app`):**
  1. `npx tsx scripts/groq-structured-probe.ts` → pin `GROQ_STRUCTURED_MODE` in
     `src/lib/llm/groq.ts` (currently `json_schema`).
  2. `npx tsx scripts/persona-transcript-test.ts` — gate: 12/12 behavior + 12/12
     adversarial.
  3. `npx tsx scripts/evaluator-calibration.ts` — gate: 12/12 gold + 18/18 Criticals.
     If it fails → swap `evaluator.groq` to kimi-k2 in `src/lib/config/models.ts`,
     re-run; if that fails too → `LLM_PROVIDER_EVALUATOR=anthropic`.
- The regenerated calibration report then becomes the artifact for Nathan's pending
  full 12-output blind-score (covers the safety-tab redesign AND the model swap in
  one review). Cert stays offline until that gate.

## S4 — two keys needed in `app/.env.local` (Nathan adding ~$40 API credit EOD 2026-07-07)
- `ANTHROPIC_API_KEY=sk-ant-...` — persona runtime, S3 transcript test, evaluator runs.
- `SUPABASE_SERVICE_ROLE_KEY=...` — from the Supabase dashboard (Project Settings →
  API keys → service_role). The evaluator persists scores/locks with it because RLS
  intentionally blocks trainees from writing their own `evaluation_scores` /
  `certification_locks`. Server-only var — never prefix with NEXT_PUBLIC.
- When both are present:
  1. `cd app && npx tsx scripts/persona-transcript-test.ts` (S3 DoD → Checkpoint A)
  2. `cd app && npx tsx scripts/evaluator-calibration.ts` (S4 DoD → calibration report
     for Nathan's blind-scoring gate)
  3. In-app: submitting a case evaluates it inline (falls back to "pending" without keys).

## S3 — ANTHROPIC_API_KEY required (blocking the live persona test)
- **What**: The persona engine (S3) and its 12-case transcript test are built and
  ready, but running them requires an Anthropic API key at runtime.
- **Where to put it**: add `ANTHROPIC_API_KEY=sk-ant-...` to `app/.env.local`
  (the file already holds the Supabase keys; it is gitignored).
- **Then run**: `cd app && npx tsx scripts/persona-transcript-test.ts`
  → writes `05-persona-engine/persona-transcript-test-results.{json,md}`
  (the Checkpoint A artifact). Exit 0 = 12/12 behaviors verified.
- Everything not needing the key is done: validator (13/13 unit tests),
  persona prompt/engine/API route, chat UI, briefs seeded.
- Note: the key will also be needed for S4 (evaluator) and the in-app live chat.
