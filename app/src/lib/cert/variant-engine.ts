// =============================================================================
// CERTIFICATION VARIANT ENGINE — deterministic surface transformer
// (08-accreditation-cert/spec_certification-logic.md)
// =============================================================================
// A certification sitting must play a variant the trainee has not seen,
// seeded deterministically from (user_id, template_id, attempt_ordinal) so it
// is reproducible for audit but unpredictable to the trainee.
//
// v1 varies the SURFACE only — caller identity, delivery style, decoy
// arrangement — via a seeded PRNG. The answer key (safety facts, reveal
// rules, correct SRL, categories, routing) is never touched: the variant is
// an overlay applied at brief/persona build time, not a mutated key. This is
// intentionally NOT an LLM call: same inputs regenerate the identical
// variant, byte for byte, which is exactly the auditability the spec asks
// for. The §5.5a AI variation engine can layer richer paraphrase later.
// =============================================================================

import { createHash } from "crypto";

export type VariantSnapshot = {
  version: 1;
  seed: string;
  ordinal: number;
  /** identity overlay; background/credential is case-semantic and never swapped */
  contact: {
    name: string;
    phone: string;
    street_address: string; // empty for city/state-only requester types
    city: string;
    state: string;
    zip: string;
  };
  style_directive: string;
  /** seeded arrangement of the SRL candidate pool (srl codes) */
  decoy_order_seed: number;
  closed_book: boolean;
};

// Fictional identity pools. Names deliberately avoid the seed-case cast so a
// drilled trainee can't pattern-match "Pat Morgan = the shaky-husband case".
const FIRST_NAMES = [
  "Avery", "Rowan", "Imani", "Theo", "Priya", "Marisol", "Declan", "Yuki",
  "Nadia", "Omar", "Celeste", "Harlan", "Bea", "Stefan", "Lucia", "Kofi",
];
const LAST_NAMES = [
  "Whitaker", "Delacroix", "Okonkwo", "Marchetti", "Lindqvist", "Barrera",
  "Havel", "Ashworth", "Nakamura", "Oyelaran", "Krishnan", "Duval",
];
const STREETS = [
  "14 Beacon Hollow Rd", "290 Quarry Line Ave", "77 Sablewood Ct",
  "1830 Fenwick Sq", "412 Copper Birch Ln", "9 Halvorsen Ter",
];
const CITIES: [string, string, string][] = [
  ["Marion", "IN", "46952"], ["Sandpoint", "ID", "83864"],
  ["Batavia", "NY", "14020"], ["Kerrville", "TX", "78028"],
  ["Astoria", "OR", "97103"], ["Beloit", "WI", "53511"],
];
const STYLE_DIRECTIVES = [
  "Brisk and time-pressed — you have somewhere to be; answers are short but complete.",
  "Chatty and tangential — you wander into small talk but return to your point when guided.",
  "Soft-spoken and hesitant — you need a beat before answering, and appreciate patience.",
  "Matter-of-fact and organized — you have notes in front of you and answer precisely.",
  "Slightly frazzled — you are juggling other things mid-call and occasionally ask the specialist to repeat.",
  "Warm and talkative — friendly, thanks the specialist often, occasionally over-shares small details.",
];

/** mulberry32 — small deterministic PRNG */
function mulberry32(a: number): () => number {
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pick<T>(rand: () => number, arr: readonly T[]): T {
  return arr[Math.floor(rand() * arr.length)];
}

export function variantSeed(userId: string, templateId: string, ordinal: number): string {
  return createHash("sha256").update(`${userId}:${templateId}:${ordinal}`).digest("hex");
}

/**
 * Generates the deterministic surface variant for a certification (or
 * practice) sitting. Pure: same inputs → identical snapshot.
 */
export function generateVariant(args: {
  userId: string;
  templateId: string;
  ordinal: number;
  /** requester type steers the address format (full vs city/state), matching S4.3 */
  requesterType?: string;
  closedBook: boolean;
}): VariantSnapshot {
  const seed = variantSeed(args.userId, args.templateId, args.ordinal);
  const rand = mulberry32(parseInt(seed.slice(0, 8), 16));

  const name = `${pick(rand, FIRST_NAMES)} ${pick(rand, LAST_NAMES)}`;
  const phone = `(555) 01${Math.floor(rand() * 90 + 10)}-${Math.floor(rand() * 9000 + 1000)}`;
  const [city, state, zip] = pick(rand, CITIES);
  const fullAddressTypes = new Set(["hcp", "pharmacist", "attorney", "journalist"]);
  const full = fullAddressTypes.has(args.requesterType ?? "");
  const street = pick(rand, STREETS); // always drawn so the PRNG stream is type-independent

  return {
    version: 1,
    seed,
    ordinal: args.ordinal,
    contact: {
      name,
      phone,
      street_address: full ? street : "",
      city,
      state,
      zip: full ? zip : "",
    },
    style_directive: pick(rand, STYLE_DIRECTIVES),
    decoy_order_seed: Math.floor(rand() * 2 ** 31),
    closed_book: args.closedBook,
  };
}

/** Seeded Fisher-Yates for the SRL candidate arrangement in cert sittings. */
export function seededShuffle<T>(arr: T[], seed: number): T[] {
  const rand = mulberry32(seed);
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}
