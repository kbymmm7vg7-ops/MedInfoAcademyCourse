# Design Spec — Voice Pipeline

Resolves critique #2 (TTS vendor) and specifies the channel-agnostic voice layer. Opus implements.

## Architecture (channel is a presentation layer over one case engine)
```
mic → browser MediaRecorder → VAD (end-of-utterance) → STT(adapter) → transcript turn
   → Persona Agent (Claude) reasoning → response text
   → TTS(adapter) → audio out + CC strip (same text)
```
The persona/eval engine is identical to text mode; voice only swaps input (mic→STT) and output (text→TTS).

## STT — Groq Whisper Large v3 Turbo (confirmed default, key ready)
- $0.04/hr; batch/VAD-chunked per utterance (not true streaming) — acceptable latency for MVP.
- Behind an `STT` adapter interface (`transcribe(audioChunk) → text`) so a streaming vendor (AssemblyAI Universal-Streaming) can be dropped in for the enterprise upsell without touching the engine.
- Dev fallback: local Whisper on the Mac for offline testing (dev/demo only, never production).

## TTS — adapter with Groq Orpheus as dev default ⟨PIVOT, Nathan 2026-07-10⟩
> ⟨Decided by Nathan 2026-07-10⟩ **Dev/demo TTS = Groq-hosted Orpheus** (Canopy Labs,
> `canopylabs/orpheus-v1-english` via the existing `GROQ_API_KEY`) — replaces the ElevenLabs
> free tier as the S5 default. Rationale: no new vendor (Groq already does STT, so the
> confidentiality-tier ZDR review stays one vendor), no ~10 min/month quota cliff during
> iteration, and Groq latency helps the <3s per-turn target. The original ElevenLabs plan is
> retained below only as the one-shot A/B comparator.
- `TTS` adapter interface (`synthesize(text, voiceId) → audioStream`) — unchanged; the adapter is the whole point. **Groq Orpheus connector** is the dev/demo implementation and the seed-case pronunciation-QA tool.
- Optionally keep a thin **ElevenLabs connector** behind the same adapter for a single A/B pass on the final full-case demo (free tier: non-commercial, ~10 min/month — never iterate on it).
- **Production vendor is still a launch-time decision** (post-48h): Groq Orpheus (already integrated, one-vendor compliance) vs ElevenLabs paid (best realism, easy per-persona voices) vs Deepgram Aura-2 (~$0.03/1k chars, sub-200ms TTFA — adds a second vendor + ZDR review). Decide with measured per-case audio cost + the pronunciation QA below. Whatever is chosen must carry a commercial license before any public traffic.
- Distinct `voiceId` per persona type (HCP vs patient vs caregiver) improves realism; the adapter carries voiceId so this is vendor-independent.

## Turn-taking & latency
- VAD flags end-of-utterance → fire the Claude reasoning call immediately → stream TTS sentence-by-sentence as text generates.
- Budget: round-trip silence **< ~3s** or immersion breaks (PRD §5.1a). Instrument and log per-turn latency during S5.

## Captions & QA
- CC strip renders the exact text sent to TTS (no separate transcription of the synthesized audio).
- Per PRD §5.1a QA step: run each seed case's persona lines through the chosen TTS voice once and verify pronunciation of the fictional branded names (Cardizan, Pulmonara, Neurovance, Dermelia, Gastroquell, Osteveda, Immunexa) before that case goes live.

## Mic permission & fallback
- Request mic at the "Start" click. If denied/unsupported → **graceful fallback to text input** for the same case (PRD §5.1a). No trainee is blocked.

## Confidentiality note (do not oversell)
- The firewall tier is ZDR + DPA (+BAA) across Anthropic/Groq/TTS vendor. On-prem hardware can host **STT only** (Whisper on a Mac Mini) — it cannot self-host the Claude reasoning layer, which is where client product data flows. The enterprise offer must be written accordingly (critique #8).
