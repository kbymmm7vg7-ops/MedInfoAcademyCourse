import { describe, it, expect } from "vitest";
import { advanceVad, createVadState, DEFAULT_VAD_CONFIG, type VadState } from "./vad";

const LOUD = 0.1;
const QUIET = 0.001;
const TICK = 50;

function run(
  frames: number[],
  state: VadState = createVadState()
): { state: VadState; events: { at: number; event: string }[] } {
  const events: { at: number; event: string }[] = [];
  let now = 0;
  for (const rms of frames) {
    now += TICK;
    const res = advanceVad(state, rms, now);
    state = res.state;
    if (res.event) events.push({ at: now, event: res.event });
  }
  return { state, events };
}

function frames(ms: number, rms: number): number[] {
  return Array(Math.ceil(ms / TICK)).fill(rms);
}

describe("advanceVad", () => {
  it("fires speech-start after the debounce and utterance-end after trailing silence", () => {
    const { events } = run([...frames(600, LOUD), ...frames(1000, QUIET)]);
    expect(events.map((e) => e.event)).toEqual(["speech-start", "utterance-end"]);
  });

  it("does not start speech for a blip shorter than speechStartMs", () => {
    const { events } = run([...frames(100, LOUD), ...frames(1000, QUIET)]);
    expect(events).toEqual([]);
  });

  it("classifies a too-short utterance as a noise blip, not an utterance", () => {
    // Just past the start debounce (250ms voiced) but under minUtteranceMs
    // measured start-of-voice → last-voice? 250ms voiced < 350ms min.
    const { events } = run([...frames(250, LOUD), ...frames(1000, QUIET)]);
    expect(events.map((e) => e.event)).toEqual(["speech-start", "noise-blip"]);
  });

  it("keeps one utterance across a mid-speech pause shorter than endSilenceMs", () => {
    const { events } = run([
      ...frames(500, LOUD),
      ...frames(400, QUIET), // shorter than endSilenceMs (750)
      ...frames(500, LOUD),
      ...frames(1000, QUIET),
    ]);
    expect(events.map((e) => e.event)).toEqual(["speech-start", "utterance-end"]);
  });

  it("adapts the noise floor upward in sustained moderate noise and stays quiet", () => {
    // Hum above the resting threshold trigger point but adapted away over time:
    // 0.008 < minSpeechRms (0.012), so it can never be speech; floor rises.
    const { state, events } = run(frames(3000, 0.008));
    expect(events).toEqual([]);
    expect(state.noiseFloor).toBeGreaterThan(0.006);
  });

  it("requires louder speech once the noise floor has risen", () => {
    // Sub-threshold hum (0.008 < minSpeechRms) adapts the floor to ≈0.008 →
    // threshold ≈ 0.02: a 0.015 voice (loud enough at rest) no longer counts
    // as speech, a 0.1 voice does.
    const noisy = run(frames(5000, 0.008), createVadState());
    const quietVoice = run(frames(600, 0.015), { ...noisy.state });
    expect(quietVoice.events).toEqual([]);
    const loudVoice = run(frames(600, 0.1), { ...noisy.state });
    expect(loudVoice.events.map((e) => e.event)).toEqual(["speech-start"]);
  });

  it("never mutates the input state object", () => {
    const s0 = createVadState();
    const frozen = JSON.stringify(s0);
    advanceVad(s0, LOUD, 50, DEFAULT_VAD_CONFIG);
    expect(JSON.stringify(s0)).toBe(frozen);
  });
});
