import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { voiceForBackground, resolveTtsVendor } from "./config";

describe("voiceForBackground", () => {
  it("maps persona backgrounds to distinct Orpheus voices", () => {
    expect(voiceForBackground("groq-orpheus", "patient")).toBe("autumn");
    expect(voiceForBackground("groq-orpheus", "caregiver")).toBe("diana");
    expect(voiceForBackground("groq-orpheus", "pharmacist")).toBe("austin");
    expect(voiceForBackground("groq-orpheus", "HCP")).toBe("daniel");
  });

  it("normalizes spacing/case/hyphens", () => {
    expect(voiceForBackground("groq-orpheus", "Sales Rep")).toBe("troy");
    expect(voiceForBackground("groq-orpheus", "sales-rep")).toBe("troy");
  });

  it("falls back to the default voice for unknown or missing backgrounds", () => {
    expect(voiceForBackground("groq-orpheus", "astronaut")).toBe("autumn");
    expect(voiceForBackground("groq-orpheus", null)).toBe("autumn");
    expect(voiceForBackground("groq-orpheus", undefined)).toBe("autumn");
  });

  it("maps to ElevenLabs premade voices for the A/B vendor", () => {
    expect(voiceForBackground("elevenlabs", "patient")).toBe("21m00Tcm4TlvDq8ikWAM");
    expect(voiceForBackground("elevenlabs", "hcp")).toBe("pNInz6obpgDQGcFmaJgB");
  });
});

describe("resolveTtsVendor", () => {
  const savedEleven = process.env.ELEVENLABS_API_KEY;
  const savedVendor = process.env.VOICE_TTS_VENDOR;

  beforeEach(() => {
    delete process.env.ELEVENLABS_API_KEY;
    delete process.env.VOICE_TTS_VENDOR;
  });
  afterEach(() => {
    if (savedEleven !== undefined) process.env.ELEVENLABS_API_KEY = savedEleven;
    else delete process.env.ELEVENLABS_API_KEY;
    if (savedVendor !== undefined) process.env.VOICE_TTS_VENDOR = savedVendor;
    else delete process.env.VOICE_TTS_VENDOR;
  });

  it("defaults to Groq Orpheus (the 2026-07-10 decision of record)", () => {
    expect(resolveTtsVendor(null)).toBe("groq-orpheus");
    expect(resolveTtsVendor(undefined)).toBe("groq-orpheus");
  });

  it("ignores an elevenlabs request when no key is configured", () => {
    expect(resolveTtsVendor("elevenlabs")).toBe("groq-orpheus");
  });

  it("honors an elevenlabs request only when its key is present (A/B pass)", () => {
    process.env.ELEVENLABS_API_KEY = "test-key";
    expect(resolveTtsVendor("elevenlabs")).toBe("elevenlabs");
  });

  it("rejects arbitrary vendor strings", () => {
    process.env.ELEVENLABS_API_KEY = "test-key";
    expect(resolveTtsVendor("some-other-vendor")).toBe("groq-orpheus");
  });
});
