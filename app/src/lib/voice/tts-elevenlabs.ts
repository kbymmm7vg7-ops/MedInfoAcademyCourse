import type { TtsAdapter, TtsResult } from "@/lib/voice/types";

// Thin ElevenLabs connector behind the same TTS adapter — A/B comparator ONLY.
// Free tier is non-commercial and ~10 min/month: never iterate on it; it is
// used for a single A/B pass on the final full-case demo (spec §TTS).
const ELEVENLABS_MODEL = "eleven_turbo_v2_5";

export function createElevenLabsTts(): TtsAdapter {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    throw new Error("ELEVENLABS_API_KEY is not set — the A/B comparator is unavailable.");
  }

  return {
    vendor: "elevenlabs",
    async synthesize(text: string, voiceId: string): Promise<TtsResult> {
      const started = Date.now();
      const res = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(voiceId)}`,
        {
          method: "POST",
          headers: {
            "xi-api-key": apiKey,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text,
            model_id: ELEVENLABS_MODEL,
            output_format: "mp3_44100_128",
          }),
        }
      );
      if (!res.ok) {
        const detail = await res.text().catch(() => "");
        throw new Error(`ElevenLabs TTS failed (${res.status}): ${detail.slice(0, 300)}`);
      }
      const audio = await res.arrayBuffer();
      return {
        audio,
        mimeType: "audio/mpeg",
        vendor: "elevenlabs",
        voiceId,
        ms: Date.now() - started,
      };
    },
  };
}
