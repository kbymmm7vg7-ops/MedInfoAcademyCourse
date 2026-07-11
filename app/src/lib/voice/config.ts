import type { SttAdapter, TtsAdapter, TtsVendor } from "@/lib/voice/types";
import { createGroqWhisperStt } from "@/lib/voice/stt-groq";
import { createGroqOrpheusTts } from "@/lib/voice/tts-groq";
import { createElevenLabsTts } from "@/lib/voice/tts-elevenlabs";

// Distinct voiceId per persona type (HCP vs patient vs caregiver) improves
// realism; the adapter carries voiceId so the mapping is vendor-independent
// (spec §TTS). Keys are the client-safe contact_prefill.background values.
// Groq's Orpheus v1 English roster: autumn, diana, hannah (female);
// austin, daniel, troy (male).
const ORPHEUS_VOICES: Record<string, string> = {
  patient: "autumn",
  caregiver: "diana",
  consumer: "hannah",
  hcp: "daniel",
  physician: "daniel",
  pharmacist: "austin",
  nurse: "hannah",
  journalist: "troy",
  sales_rep: "troy",
};
const ORPHEUS_DEFAULT = "autumn";

// ElevenLabs premade voices for the one-shot A/B pass only.
const ELEVENLABS_VOICES: Record<string, string> = {
  patient: "21m00Tcm4TlvDq8ikWAM", // Rachel
  caregiver: "21m00Tcm4TlvDq8ikWAM",
  consumer: "21m00Tcm4TlvDq8ikWAM",
  hcp: "pNInz6obpgDQGcFmaJgB", // Adam
  physician: "pNInz6obpgDQGcFmaJgB",
  pharmacist: "pNInz6obpgDQGcFmaJgB",
  nurse: "21m00Tcm4TlvDq8ikWAM",
  journalist: "pNInz6obpgDQGcFmaJgB",
  sales_rep: "pNInz6obpgDQGcFmaJgB",
};
const ELEVENLABS_DEFAULT = "21m00Tcm4TlvDq8ikWAM";

function normalizeBackground(background: string | null | undefined): string {
  return (background ?? "").trim().toLowerCase().replace(/[\s-]+/g, "_");
}

export function voiceForBackground(vendor: TtsVendor, background: string | null | undefined): string {
  const key = normalizeBackground(background);
  if (vendor === "elevenlabs") return ELEVENLABS_VOICES[key] ?? ELEVENLABS_DEFAULT;
  return ORPHEUS_VOICES[key] ?? ORPHEUS_DEFAULT;
}

/** Dev/demo default is Groq Orpheus (Nathan 2026-07-10). `VOICE_TTS_VENDOR`
 *  env can flip the default; a per-request vendor is honored only for the
 *  ElevenLabs A/B pass and only when its key is configured. */
export function resolveTtsVendor(requested?: string | null): TtsVendor {
  if (requested === "elevenlabs" && process.env.ELEVENLABS_API_KEY) return "elevenlabs";
  const configured = process.env.VOICE_TTS_VENDOR;
  if (configured === "elevenlabs" && process.env.ELEVENLABS_API_KEY) return "elevenlabs";
  return "groq-orpheus";
}

export function getStt(): SttAdapter {
  return createGroqWhisperStt();
}

export function getTts(vendor: TtsVendor): TtsAdapter {
  return vendor === "elevenlabs" ? createElevenLabsTts() : createGroqOrpheusTts();
}
