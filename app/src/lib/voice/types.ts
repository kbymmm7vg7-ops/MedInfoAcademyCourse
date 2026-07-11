// Voice pipeline adapter contracts (spec: 06-voice-layer/spec_voice-pipeline.md).
// STT and TTS stay behind these interfaces so the production vendor remains a
// launch-time decision — the engine and routes never import a vendor directly.

export type SttInput = {
  data: ArrayBuffer;
  mimeType: string;
  filename: string;
};

export type SttResult = {
  text: string;
  vendor: string;
  /** wall-clock ms spent in the vendor call (latency instrumentation) */
  ms: number;
};

export interface SttAdapter {
  readonly vendor: string;
  transcribe(input: SttInput): Promise<SttResult>;
}

export type TtsResult = {
  audio: ArrayBuffer;
  mimeType: string;
  vendor: string;
  voiceId: string;
  /** wall-clock ms spent in the vendor call (latency instrumentation) */
  ms: number;
};

export interface TtsAdapter {
  readonly vendor: string;
  synthesize(text: string, voiceId: string): Promise<TtsResult>;
}

export type TtsVendor = "groq-orpheus" | "elevenlabs";
