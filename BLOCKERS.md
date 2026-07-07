# BLOCKERS

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
