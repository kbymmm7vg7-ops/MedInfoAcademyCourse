// Groq's TTS endpoint streams WAV with RIFF/data chunk sizes of 0xFFFFFFFF
// (length unknown at header-write time). Desktop players tolerate that;
// Chrome's HTMLAudioElement does not reliably play such files. We hold the
// full buffer anyway, so patch the true sizes in before returning audio.
export function normalizeWavHeader(buf: ArrayBuffer): ArrayBuffer {
  if (buf.byteLength < 44) return buf;
  const view = new DataView(buf);
  if (view.getUint32(0, false) !== 0x52494646 /* RIFF */) return buf;
  if (view.getUint32(8, false) !== 0x57415645 /* WAVE */) return buf;

  const riffSize = view.getUint32(4, true);
  const trueRiffSize = buf.byteLength - 8;
  if (riffSize === 0xffffffff || riffSize === 0 || riffSize > trueRiffSize) {
    view.setUint32(4, trueRiffSize, true);
  }

  let pos = 12;
  while (pos + 8 <= buf.byteLength) {
    const chunkId = view.getUint32(pos, false);
    const size = view.getUint32(pos + 4, true);
    if (chunkId === 0x64617461 /* data */) {
      const actual = buf.byteLength - pos - 8;
      if (size === 0xffffffff || size === 0 || size > actual) {
        view.setUint32(pos + 4, actual, true);
      }
      break;
    }
    if (size === 0xffffffff) break; // malformed non-data chunk — stop walking
    pos += 8 + size + (size % 2);
  }
  return buf;
}
