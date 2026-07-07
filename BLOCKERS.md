# BLOCKERS

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
