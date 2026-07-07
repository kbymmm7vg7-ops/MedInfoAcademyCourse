// PRD §5.2 — hardcoded fictional product catalog for the Documentation
// Simulator. These are the only products selectable on the Intake tab; case
// templates reference one of these codes via case_templates.product_ref.
export const FICTIONAL_PRODUCTS = [
  "Cardizan",
  "Pulmonara",
  "Neurovance",
  "Dermelia",
  "Gastroquell",
  "Osteveda",
  "Immunexa",
] as const;

export type FictionalProduct = (typeof FICTIONAL_PRODUCTS)[number];
