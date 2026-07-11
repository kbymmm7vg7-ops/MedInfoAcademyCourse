// Pure voice-activity-detection state machine (client feeds it RMS samples on
// a timer; unit-testable without WebAudio). End-of-utterance fires the STT →
// persona → TTS chain immediately (spec §Turn-taking: round-trip silence past
// ~3s breaks immersion, so the endpoint delay is part of the latency budget).

export type VadConfig = {
  /** floor below which a frame can never count as speech */
  minSpeechRms: number;
  /** multiplier over the adaptive noise floor for a frame to count as speech */
  noiseFloorRatio: number;
  /** continuous voiced ms before an utterance starts (debounce) */
  speechStartMs: number;
  /** continuous silent ms after speech that ends the utterance */
  endSilenceMs: number;
  /** utterances shorter than this are discarded as noise blips */
  minUtteranceMs: number;
  /** EMA weight for the noise-floor estimate (applied on non-voiced frames) */
  noiseFloorAlpha: number;
};

export const DEFAULT_VAD_CONFIG: VadConfig = {
  minSpeechRms: 0.012,
  noiseFloorRatio: 2.5,
  speechStartMs: 180,
  endSilenceMs: 750,
  minUtteranceMs: 350,
  noiseFloorAlpha: 0.05,
};

export type VadState = {
  speaking: boolean;
  /** ts of the first voiced frame of the current candidate/utterance */
  voicedSince: number | null;
  /** ts of the last voiced frame */
  lastVoicedAt: number | null;
  noiseFloor: number;
};

export type VadEvent = "speech-start" | "utterance-end" | "noise-blip" | null;

export function createVadState(): VadState {
  return { speaking: false, voicedSince: null, lastVoicedAt: null, noiseFloor: 0.004 };
}

export function advanceVad(
  state: VadState,
  rms: number,
  now: number,
  cfg: VadConfig = DEFAULT_VAD_CONFIG
): { state: VadState; event: VadEvent } {
  const threshold = Math.max(cfg.minSpeechRms, state.noiseFloor * cfg.noiseFloorRatio);
  const voiced = rms >= threshold;
  const next: VadState = { ...state };
  let event: VadEvent = null;

  if (voiced) {
    next.lastVoicedAt = now;
    if (next.voicedSince == null) next.voicedSince = now;
    if (!next.speaking && now - next.voicedSince >= cfg.speechStartMs) {
      next.speaking = true;
      event = "speech-start";
    }
  } else {
    // Adapt the noise floor only from non-voiced frames so speech does not
    // inflate it.
    next.noiseFloor = next.noiseFloor * (1 - cfg.noiseFloorAlpha) + rms * cfg.noiseFloorAlpha;

    if (next.speaking) {
      const silentFor = next.lastVoicedAt == null ? 0 : now - next.lastVoicedAt;
      if (silentFor >= cfg.endSilenceMs) {
        const utteranceMs =
          next.voicedSince != null && next.lastVoicedAt != null
            ? next.lastVoicedAt - next.voicedSince
            : 0;
        next.speaking = false;
        next.voicedSince = null;
        next.lastVoicedAt = null;
        event = utteranceMs >= cfg.minUtteranceMs ? "utterance-end" : "noise-blip";
      }
    } else if (next.voicedSince != null) {
      // Voiced blip that never reached speechStartMs — reset the candidate.
      const sinceLastVoice = next.lastVoicedAt == null ? 0 : now - next.lastVoicedAt;
      if (sinceLastVoice >= cfg.endSilenceMs) {
        next.voicedSince = null;
        next.lastVoicedAt = null;
      }
    }
  }

  return { state: next, event };
}
