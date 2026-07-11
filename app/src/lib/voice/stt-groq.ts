import type { SttAdapter, SttInput, SttResult } from "@/lib/voice/types";

// Groq-hosted Whisper Large v3 Turbo — the confirmed STT default (spec §STT).
// Batch per VAD-chunked utterance, not true streaming.
const GROQ_STT_URL = "https://api.groq.com/openai/v1/audio/transcriptions";
const GROQ_STT_MODEL = "whisper-large-v3-turbo";

export function createGroqWhisperStt(): SttAdapter {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("GROQ_API_KEY is not set — required for voice STT.");
  }

  return {
    vendor: "groq-whisper-v3-turbo",
    async transcribe(input: SttInput): Promise<SttResult> {
      const started = Date.now();
      const form = new FormData();
      form.append("model", GROQ_STT_MODEL);
      // English-only product for MVP; pinning the language cuts detection cost.
      form.append("language", "en");
      form.append("response_format", "json");
      form.append("file", new Blob([input.data], { type: input.mimeType }), input.filename);

      const res = await fetch(GROQ_STT_URL, {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}` },
        body: form,
      });
      if (!res.ok) {
        const detail = await res.text().catch(() => "");
        throw new Error(`Groq STT failed (${res.status}): ${detail.slice(0, 300)}`);
      }
      const json = (await res.json()) as { text?: string };
      return {
        text: (json.text ?? "").trim(),
        vendor: "groq-whisper-v3-turbo",
        ms: Date.now() - started,
      };
    },
  };
}
