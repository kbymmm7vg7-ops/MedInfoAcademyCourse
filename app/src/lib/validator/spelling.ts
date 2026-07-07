// Deterministic spell checker for the validator (S4.14).
// nspell + dictionary-en, extended with the fictional-product / MI domain
// allowlist so training vocabulary never counts as a misspelling.
import nspell from "nspell";
import dictionaryEn from "dictionary-en";
import type { SpellCheckFn } from "@/lib/validator/validator";

const DOMAIN_ALLOWLIST = [
  // fictional products + generics (fictional-product-bank.md)
  "cardizan", "velanoxine", "pulmonara", "fesaterol", "neurovance", "melotigine",
  "dermelia", "tacrolisol", "gastroquell", "ranozide", "osteveda", "denosalar",
  "immunexa", "rilucept",
  // MI / pharma vocabulary
  "pharmacovigilance", "candidiasis", "perioral", "hypocalcemia", "osteonecrosis",
  "anticoagulant", "anticonvulsant", "bronchospasm", "esophagitis", "teratogenic",
  "titration", "subtherapeutic", "unsolicited", "reportable", "prefilled",
  "hcp", "ndc", "srl", "srd", "loe", "inr", "onj", "sjs", "uspi", "pv",
];

let cached: SpellCheckFn | null = null;

export async function getSpellChecker(): Promise<SpellCheckFn> {
  if (cached) return cached;
  // dictionary-en v5 exports { aff, dic } directly
  const spell = nspell(dictionaryEn as unknown as { aff: Buffer; dic: Buffer });
  for (const word of DOMAIN_ALLOWLIST) spell.add(word);
  cached = (word: string) => spell.correct(word) || spell.correct(word.toLowerCase());
  return cached;
}
