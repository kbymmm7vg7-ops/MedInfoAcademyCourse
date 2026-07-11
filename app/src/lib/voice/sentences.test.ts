import { describe, it, expect } from "vitest";
import { splitForTts } from "./sentences";

describe("splitForTts", () => {
  it("returns empty for blank input", () => {
    expect(splitForTts("")).toEqual([]);
    expect(splitForTts("   ")).toEqual([]);
  });

  it("keeps a short reply as a single chunk", () => {
    expect(splitForTts("Yes, that's fine — go ahead.")).toEqual(["Yes, that's fine — go ahead."]);
  });

  it("merges short sentences up to the minimum chunk size", () => {
    const chunks = splitForTts("Okay. Sure. That works for me, thank you so much for checking on it today.");
    expect(chunks.length).toBe(1);
  });

  it("splits a long multi-sentence reply into ordered chunks that reassemble", () => {
    const reply =
      "It's been burning for about five days now, and honestly it seems to be getting worse instead of better. " +
      "The redness has started spreading out past where I actually put the cream, which worried me. " +
      "My doctor bumped the dose up because the lower one wasn't doing enough. " +
      "Should I stop using it until someone tells me what's going on?";
    const chunks = splitForTts(reply);
    expect(chunks.length).toBeGreaterThan(1);
    expect(chunks.join(" ")).toBe(reply);
    for (const c of chunks) expect(c.length).toBeLessThanOrEqual(300);
  });
});
