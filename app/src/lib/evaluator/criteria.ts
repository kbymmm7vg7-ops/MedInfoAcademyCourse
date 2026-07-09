// Machine form of rubric-scorecard-v1.md (rubric_version 1.0). The scorecard
// markdown is the human source of truth; if they diverge, the markdown wins
// and this file is the bug.

export type CriterionCategory = "critical" | "major" | "minor";

export type WeightedCriterion = {
  id: string;
  text: string;
  cat: CriterionCategory;
  val: number;
};

export type ScaledCriterion = {
  id: string;
  text: string;
  /** forced N/A in MVP (S1.4 vocal skills — transcript cannot evidence them) */
  mvpNa?: boolean;
};

export const RUBRIC_VERSION = "1.0";

export const S1_CRITERIA: ScaledCriterion[] = [
  { id: "S1.1", text: "Agent stated his or her name" },
  { id: "S1.2", text: "Professional, pleasant, empathetic tone; no condescension, esp. for embarrassing questions" },
  { id: "S1.3", text: "Active listening; clarified effectively to determine the true nature of the inquiry; caught volunteered cues (symptoms, hospitalization, dose changes) and clarified them; repeated/re-phrased unclear questions. Listen-and-clarify, NOT probing/soliciting AEs" },
  { id: "S1.4", text: "Spoke clearly; appropriate vocal skills (tone, inflection, volume, rate)", mvpNa: true },
  { id: "S1.5", text: "Avoided slang / jargon / acronyms / vocal fillers (fillers N/A in text mode)" },
];

export const S2_CRITERIA: WeightedCriterion[] = [
  { id: "S2.1", text: "Adverse Event(s) were identified", cat: "critical", val: 10 },
  { id: "S2.2", text: "AE report submitted within the SOP-defined timeframe", cat: "critical", val: 10 },
  { id: "S2.3", text: "Report routed to the correct department / correct output", cat: "critical", val: 10 },
  { id: "S2.4", text: "AE details documented clearly, concisely, sequentially in AE Description field", cat: "major", val: 8 },
  { id: "S2.5", text: "Appropriate use of AE questionnaires, as applicable", cat: "major", val: 8 },
  { id: "S2.6", text: "Past medical history, con-meds, and (as appropriate) lab details documented", cat: "major", val: 8 },
  { id: "S2.7", text: "HCP information and consent to contact HCP (if applicable) documented", cat: "major", val: 8 },
  { id: "S2.8", text: "Source document(s)/attachment(s) included in transmission as appropriate", cat: "major", val: 8 },
  { id: "S2.9", text: "Completion of AE / relevant notes correctly documented in resolution field", cat: "minor", val: 2 },
  { id: "S2.10", text: "Received Date/Time correct; updated on new information (Version 2+)", cat: "minor", val: 2 },
];

export const S3_CRITERIA: WeightedCriterion[] = [
  { id: "S3.1", text: "Product Complaint(s) were identified", cat: "critical", val: 10 },
  { id: "S3.2", text: "PC report submitted within the SOP-defined timeframe", cat: "critical", val: 10 },
  { id: "S3.3", text: "Report routed to the correct department / correct output", cat: "critical", val: 10 },
  { id: "S3.4", text: "Clear, concise, sequential PC details in PC Description field", cat: "major", val: 8 },
  { id: "S3.5", text: "Appropriate use of PC questionnaires, as applicable", cat: "major", val: 8 },
  { id: "S3.6", text: "Lot number, expiration date, NDC and/or serial number obtained & documented", cat: "major", val: 8 },
  { id: "S3.7", text: "Availability of suspect product documented", cat: "major", val: 8 },
  { id: "S3.8", text: "Retrieval kit / sample-return instructions sent as appropriate", cat: "major", val: 8 },
  { id: "S3.9", text: "Source document(s)/attachment(s) included as appropriate", cat: "major", val: 8 },
  { id: "S3.10", text: "Completion of PC / relevant notes correctly documented in resolution field", cat: "minor", val: 2 },
  { id: "S3.11", text: "Credit, refund, or replacement request documented", cat: "minor", val: 2 },
  { id: "S3.12", text: "Received Date/Time correct; updated on new information (Version 2+)", cat: "minor", val: 2 },
];

export const S4_CRITERIA: WeightedCriterion[] = [
  { id: "S4.1", text: "Correct product selected", cat: "critical", val: 5 },
  { id: "S4.2", text: "Response based on PI, SRDs, approved resources; contains no medical advice", cat: "critical", val: 5 },
  { id: "S4.3", text: "Contact information captured per case type (AE/PC & HCP MI: name, background, phone, full address; patients/consumers/non-MI: name, background, phone, postal code or city+state)", cat: "major", val: 4 },
  { id: "S4.4", text: "All MI requests correctly entered in the database", cat: "major", val: 4 },
  { id: "S4.5", text: "Response concise, on-inquiry; volunteers nothing without direct bearing", cat: "major", val: 4 },
  { id: "S4.6", text: "Sources documented in response field; associated documents included", cat: "major", val: 4 },
  { id: "S4.7", text: "Responses correctly entered (summary, detail level, references cited)", cat: "major", val: 4 },
  { id: "S4.8", text: "Received Date/Time correct & consistent with source document", cat: "major", val: 4 },
  { id: "S4.9", text: "All relevant correspondences documented", cat: "major", val: 4 },
  { id: "S4.10", text: "Response route appropriate and documented", cat: "minor", val: 1 },
  { id: "S4.11", text: "Appropriate source event selected", cat: "minor", val: 1 },
  { id: "S4.12", text: "Case question categories appropriately selected", cat: "minor", val: 1 },
  { id: "S4.13", text: "All appropriate fields (incl. scenario-specific required fields) completed", cat: "minor", val: 1 },
  { id: "S4.14", text: "Case free of spelling errors (≤2, unless verbatim from source)", cat: "minor", val: 1 },
];

export const S5_CRITERIA: WeightedCriterion[] = [
  { id: "S5.1", text: "No off-label information volunteered; unsolicited off-label requests handled per SOP (acknowledged, not answered promotionally; routed through the approved MI response process)", cat: "critical", val: 10 },
  { id: "S5.2", text: "Special situation identified and flagged (pregnancy/lactation exposure, overdose, misuse/abuse, lack of effect, medication error, legal or media contact)", cat: "critical", val: 10 },
  { id: "S5.3", text: "No promotional language; response balanced and non-promotional", cat: "major", val: 8 },
  { id: "S5.4", text: "Correct escalation route selected and documented (PV, quality, legal, communications, supervisor)", cat: "major", val: 8 },
  { id: "S5.5", text: "Consumer/patient appropriately referred to their HCP for medical-advice-adjacent questions", cat: "minor", val: 2 },
];

/** scoring-contract.md §Scoring rules 1: min_passing = ceil(ratio × available_points) */
export const SECTION_RATIOS: Record<"s2" | "s3" | "s4" | "s5", number> = {
  s2: 65 / 74,
  s3: 75 / 84,
  s4: 39 / 43,
  s5: 30 / 38,
};

export const WEIGHTED_SECTIONS = {
  s2: S2_CRITERIA,
  s3: S3_CRITERIA,
  s4: S4_CRITERIA,
  s5: S5_CRITERIA,
} as const;

export type WeightedSectionKey = keyof typeof WEIGHTED_SECTIONS;

export const S1_PASS_THRESHOLD = 2.5;

/**
 * MVP structural N/A — criteria the MVP documentation form has NO field to
 * capture, so no trainee can ever satisfy (or fail) them in this version. They
 * are forced N/A in code (evaluate.ts), deterministically, exactly as S1.4
 * (vocal skills) already is — not left to the LLM. The scorecard targets a full
 * commercial QMS; the simulator form is a subset. Discovered at S4 calibration:
 * the evaluator was failing every gold AE case on these absent fields.
 *
 * Covered: AE/PC questionnaires (S2.5/S3.5); past-med-history / con-meds / lab
 * (S2.6); HCP info + consent-to-contact (S2.7); source-document attachment
 * (S2.8/S3.9/S4.11); AE/PC resolution narrative (S2.9/S3.10); retrieval kit
 * (S3.8); credit/refund/replacement (S3.11); correspondence log (S4.9).
 *
 * NOTE for Nathan (S4 gate): the answer keys list these as `required_fields`
 * (con-meds, hcp_info_and_consent, retrieval_kit_offered, …) — the MVP form
 * lacks them. Either the form grows these fields (future enhancement) or they
 * stay N/A. Ratify at the blind-scoring gate. S4.6 is handled separately
 * (conditional: N/A only when the correct response cites no SRL/source).
 */
export const MVP_FORCED_NA: ReadonlySet<string> = new Set([
  "S2.5", "S2.6", "S2.7", "S2.8", "S2.9",
  "S3.5", "S3.8", "S3.9", "S3.10", "S3.11",
  "S4.9", "S4.11",
]);
