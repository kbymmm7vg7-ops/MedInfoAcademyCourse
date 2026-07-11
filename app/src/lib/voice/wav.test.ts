import { describe, it, expect } from "vitest";
import { normalizeWavHeader } from "./wav";

function buildWav({
  riffSize,
  dataSize,
  dataBytes,
  extraChunk = false,
}: {
  riffSize: number;
  dataSize: number;
  dataBytes: number;
  extraChunk?: boolean;
}): ArrayBuffer {
  const extra = extraChunk ? 8 + 26 : 0;
  const total = 12 + 8 + 16 + extra + 8 + dataBytes;
  const buf = new ArrayBuffer(total);
  const v = new DataView(buf);
  const w = (pos: number, s: string) => {
    for (let i = 0; i < s.length; i++) v.setUint8(pos + i, s.charCodeAt(i));
  };
  w(0, "RIFF");
  v.setUint32(4, riffSize, true);
  w(8, "WAVE");
  w(12, "fmt ");
  v.setUint32(16, 16, true);
  let pos = 12 + 8 + 16;
  if (extraChunk) {
    w(pos, "LIST");
    v.setUint32(pos + 4, 26, true);
    pos += 8 + 26;
  }
  w(pos, "data");
  v.setUint32(pos + 4, dataSize, true);
  return buf;
}

function readSizes(buf: ArrayBuffer): { riff: number; data: number } {
  const v = new DataView(buf);
  let pos = 12;
  while (pos + 8 <= buf.byteLength) {
    const id = v.getUint32(pos, false);
    const size = v.getUint32(pos + 4, true);
    if (id === 0x64617461) return { riff: v.getUint32(4, true), data: size };
    pos += 8 + size + (size % 2);
  }
  throw new Error("no data chunk");
}

describe("normalizeWavHeader", () => {
  it("patches 0xFFFFFFFF riff and data sizes to the true byte counts (Groq streaming style)", () => {
    const buf = buildWav({ riffSize: 0xffffffff, dataSize: 0xffffffff, dataBytes: 1000, extraChunk: true });
    const fixed = normalizeWavHeader(buf);
    const sizes = readSizes(fixed);
    expect(sizes.riff).toBe(fixed.byteLength - 8);
    expect(sizes.data).toBe(1000);
  });

  it("leaves already-correct headers untouched", () => {
    const buf = buildWav({ riffSize: 0, dataSize: 0, dataBytes: 500 });
    // build with correct sizes first
    const v = new DataView(buf);
    v.setUint32(4, buf.byteLength - 8, true);
    v.setUint32(12 + 8 + 16 + 4, 500, true);
    const before = new Uint8Array(buf.slice(0)).join(",");
    normalizeWavHeader(buf);
    expect(new Uint8Array(buf).join(",")).toBe(before);
  });

  it("ignores non-WAV buffers", () => {
    const buf = new ArrayBuffer(64);
    const before = new Uint8Array(buf.slice(0)).join(",");
    normalizeWavHeader(buf);
    expect(new Uint8Array(buf).join(",")).toBe(before);
  });
});
