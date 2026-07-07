// Section applicability — deterministic, computed BEFORE the LLM runs
// (scoring-contract.md §Section applicability).
import type { DocumentationFormState } from "@/lib/simulator/types";

export type SectionApplicability = {
  s1: boolean;
  s2: boolean;
  s3: boolean;
  s4: boolean;
  s5: boolean;
};

export type ApplicabilityGroundTruth = {
  safety?: { ae_present?: boolean; pc_present?: boolean };
};

export function computeApplicability(args: {
  groundTruth: ApplicabilityGroundTruth;
  doc: DocumentationFormState;
  /** live conversation (phone/voice or live chat) vs email/portal */
  liveConversation: boolean;
}): SectionApplicability {
  const { groundTruth: gt, doc, liveConversation } = args;
  return {
    s1: liveConversation,
    // A false AE/PC flag is scored INSIDE the section (identification wrong →
    // S2.1/S3.1 fail), so trainee-flagged counts as applicable.
    s2: gt.safety?.ae_present === true || doc.safety.ae_present === "yes",
    s3: gt.safety?.pc_present === true || doc.safety.pc_present === "yes",
    s4: true,
    s5: true,
  };
}
