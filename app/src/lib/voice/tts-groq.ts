import type { TtsAdapter, TtsResult } from "@/lib/voice/types";
import { normalizeWavHeader } from "@/lib/voice/wav";

// Groq-hosted Orpheus (Canopy Labs) — dev/demo TTS default.
// Decision of record: Nathan 2026-07-10 (BLOCKERS + spec §TTS) — same
// GROQ_API_KEY as STT, no free-tier quota cliff, one-vendor ZDR review.
const GROQ_TTS_URL = "https://api.groq.com/openai/v1/audio/speech";
const GROQ_TTS_MODEL = "canopylabs/orpheus-v1-english";

export function createGroqOrpheusTts(): TtsAdapter {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("GROQ_API_KEY is not set — required for voice TTS.");
  }

  return {
    vendor: "groq-orpheus",
    async synthesize(text: string, voiceId: string): Promise<TtsResult> {
      const started = Date.now();
      const res = await fetch(GROQ_TTS_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: GROQ_TTS_MODEL,
          voice: voiceId,
          input: text,
          response_format: "wav",
        }),
      });
      if (!res.ok) {
        const detail = await res.text().catch(() => "");
        throw new Error(`Groq TTS failed (${res.status}): ${detail.slice(0, 300)}`);
      }
      const audio = normalizeWavHeader(await res.arrayBuffer());
      return {
        audio,
        mimeType: "audio/wav",
        vendor: "groq-orpheus",
        voiceId,
        ms: Date.now() - started,
      };
    },
  };
}
