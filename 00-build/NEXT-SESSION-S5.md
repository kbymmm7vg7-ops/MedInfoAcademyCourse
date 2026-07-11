# NEXT SESSION — S5 Voice baseline (Opus) + leftovers

*Written by Fable 2026-07-10 at S7 completion. S1–S4, S6, S7 are done; SEC-1/SEC-2 closed.
Remaining before Checkpoint B: Nathan's S4 blind-scoring gate (his action, not a session) and S5 voice.*

## State you inherit
- `main` @ S7 completion: vitest **63/63**, build green, migrations 0001–0009 applied.
- SEC-1/2/4/5/7/9 closed. Cert is NOT live — blocked on Nathan's blind-scoring gate
  (`07-evaluator/calibration-report.md` Part A; zero Critical disagreements, ≤1 Major/case).
- Admin access: platform_admin test user `nite414+s7admin@gmail.com` (Nathan: reset its password
  in the Supabase dashboard first).
- Keys in `app/.env.local` incl. `GROQ_API_KEY` (now covers BOTH STT and TTS after the
  2026-07-10 Orpheus pivot) and `ELEVENLABS_API_KEY` (A/B comparator only).

## How to start
1. Fresh **Opus 4.8** session in the repo root.
2. **Attach:** `RUNBOOK.md`, `00-build/HANDOFF-OPUS.md`, `00-build/BLOCKERS.md`, this file,
   `06-voice-layer/spec_voice-pipeline.md`, `01-seed-cases/`.
3. Paste the S5 prompt below (**updated 2026-07-10 for Nathan's TTS pivot to Groq Orpheus** —
   supersedes the RUNBOOK S5 prompt's ElevenLabs wording; spec §TTS has the decision of record):

> Implement the voice pipeline per `06-voice-layer/spec_voice-pipeline.md`: mic capture → VAD →
> **Groq Whisper v3 Turbo** STT (adapter) → persona reasoning → **Groq Orpheus TTS**
> (`canopylabs/orpheus-v1-english`, same `GROQ_API_KEY`, adapter) → audio + CC strip; the
> large-doc-panel voice layout (§7); mic-permission-at-Start with text fallback. Instrument
> per-turn latency (target <3s). Run the seed-case pronunciation QA (the seven fictional brand
> names) on the Orpheus voice. Optionally add a thin ElevenLabs connector behind the same adapter
> for ONE A/B pass on the final full-case demo only (free tier ≈10 min/month — never iterate on
> it). Keep STT/TTS behind adapters so the production vendor stays a launch-time decision.

**Definition of done**: one seed case completed end-to-end by voice on laptop mic, captions
correct, latency logged. (Voice needs Nathan at the machine for mic permission — this session is
interactive, not autonomous.)

## Leftovers to fold in (small)
- **User deactivation decision** (BLOCKERS 2026-07-10 ①): if Nathan wants it, add
  `users.deactivated_at` migration + surface in `/admin/users` + auth ban on sign-in.
- After Nathan's blind-scoring gate passes: flip cert-live per `08-accreditation-cert` spec (no
  code should be needed — the gate was the only blocker).
- Persona/evaluator runtime through the app now runs Sonnet via the Next server — if any new
  Node-only dependency is added to that path, remember `serverExternalPackages` (see
  `next.config.ts` and the dictionary-en incident in BLOCKERS).

## Recurring traps (HANDOFF §2)
- Run vitest/tsx from `app/`, never repo root (`@/` alias).
- Next 16: middleware is `src/proxy.ts`; Turbopack can't import files outside `app/`.
- The tsx scripts self-load `app/.env.local`.
- Ground-truth firewall: answer-key reads ONLY in `lib/simulator/case-brief.ts` +
  `lib/admin/answer-keys.ts` (SEC-9 vitest enforces).

## After S5 → CHECKPOINT B (RUNBOOK): cert variant/burn/lock + evaluator calibration review,
then the post-48h punch list.
