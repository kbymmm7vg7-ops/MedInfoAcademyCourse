// Sentence chunking for streamed TTS (spec §Turn-taking: stream TTS
// sentence-by-sentence — perceived silence ends at the FIRST sentence's
// audio, not the whole reply's). Chunks merge short sentences so we don't
// pay per-request overhead for two-word fragments.
const MIN_CHUNK_CHARS = 60;
const MAX_CHUNK_CHARS = 300;

export function splitForTts(text: string): string[] {
  const trimmed = text.trim();
  if (!trimmed) return [];

  // Split on sentence enders followed by whitespace; keep the punctuation.
  const sentences = trimmed.split(/(?<=[.!?…])\s+/).filter((s) => s.length > 0);

  const chunks: string[] = [];
  let current = "";
  for (const sentence of sentences) {
    if (current && (current.length >= MIN_CHUNK_CHARS || current.length + sentence.length + 1 > MAX_CHUNK_CHARS)) {
      chunks.push(current);
      current = sentence;
    } else {
      current = current ? `${current} ${sentence}` : sentence;
    }
  }
  if (current) chunks.push(current);
  return chunks;
}
