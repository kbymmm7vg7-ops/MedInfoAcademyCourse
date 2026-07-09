// Deterministic spell checker for the validator (S4.14).
// nspell + dictionary-en, extended with the fictional-product / MI domain
// allowlist so training vocabulary never counts as a misspelling.
import nspell from "nspell";
import type { SpellCheckFn } from "@/lib/validator/validator";

export const DOMAIN_ALLOWLIST = [
  // fictional products + generics (fictional-product-bank.md)
  "cardizan", "velanoxine", "pulmonara", "fesaterol", "neurovance", "melotigine",
  "dermelia", "tacrolisol", "gastroquell", "ranozide", "osteveda", "denosalar",
  "immunexa", "rilucept",
  // MI / pharma vocabulary
  "pharmacovigilance", "candidiasis", "perioral", "hypocalcemia", "osteonecrosis",
  "anticoagulant", "anticonvulsant", "bronchospasm", "esophagitis", "teratogenic",
  "titration", "subtherapeutic", "unsolicited", "reportable", "prefilled",
  "prescriber", "prescribers", "titrated", "titrate",
  "hcp", "ndc", "srl", "srd", "loe", "inr", "onj", "sjs", "uspi", "pv",
];

/** Pure builder — same nspell + domain allowlist, given the dictionary buffers.
 *  Kept free of the `dictionary-en` import so callers that supply their own
 *  buffers (e.g. the calibration harness under tsx, which cannot transform that
 *  package's top-level await) can reuse the exact same checker. */
export function buildSpellChecker(dict: { aff: Uint8Array; dic: Uint8Array }): SpellCheckFn {
  const spell = nspell(dict as unknown as { aff: Buffer; dic: Buffer });
  for (const word of DOMAIN_ALLOWLIST) spell.add(word);
  return (word: string) => spell.correct(word) || spell.correct(word.toLowerCase());
}

let cached: SpellCheckFn | null = null;

export async function getSpellChecker(): Promise<SpellCheckFn> {
  if (cached) return cached;
  // Dynamic import: `dictionary-en` v5 uses top-level await (ESM). Loading it
  // lazily keeps the module graph importable from CJS/tsx contexts that never
  // call this function. It exports { aff, dic } directly.
  const dictionaryEn = (await import("dictionary-en")).default;
  cached = buildSpellChecker(dictionaryEn as unknown as { aff: Uint8Array; dic: Uint8Array });
  return cached;
}
