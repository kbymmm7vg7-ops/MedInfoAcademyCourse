// Shared client-safe types for the Documentation Simulator.
//
// IMPORTANT: nothing in this file may ever encode ground-truth answer-key
// shape (e.g. which SRL is "correct", reveal rules, expected outcomes).
// See src/lib/simulator/case-brief.ts for the firewall that guarantees this.

export type RequesterType =
  | "hcp"
  | "patient"
  | "caregiver"
  | "pharmacist"
  | "attorney"
  | "journalist"
  | "internal_sales";

export const REQUESTER_TYPES: { value: RequesterType; label: string }[] = [
  { value: "hcp", label: "Healthcare Provider" },
  { value: "patient", label: "Patient" },
  { value: "caregiver", label: "Caregiver" },
  { value: "pharmacist", label: "Pharmacist" },
  { value: "attorney", label: "Attorney" },
  { value: "journalist", label: "Journalist" },
  { value: "internal_sales", label: "Internal Sales" },
];

export type ContactChannel = "phone" | "email" | "chat";

export const CONTACT_CHANNELS: { value: ContactChannel; label: string }[] = [
  { value: "phone", label: "Phone" },
  { value: "email", label: "Email" },
  { value: "chat", label: "Chat" },
];

export type InquiryCategory =
  | "Indication"
  | "Efficacy"
  | "Safety"
  | "Pharmacokinetics"
  | "Drug-Interactions"
  | "Other";

export const INQUIRY_CATEGORIES: InquiryCategory[] = [
  "Indication",
  "Efficacy",
  "Safety",
  "Pharmacokinetics",
  "Drug-Interactions",
  "Other",
];

export type SeriousnessCriterion =
  | "death"
  | "life_threatening"
  | "hospitalization"
  | "disability"
  | "congenital_anomaly"
  | "other_medically_important";

export const SERIOUSNESS_CRITERIA: { value: SeriousnessCriterion; label: string }[] = [
  { value: "death", label: "Death" },
  { value: "life_threatening", label: "Life-threatening" },
  { value: "hospitalization", label: "Hospitalization" },
  { value: "disability", label: "Persistent/significant disability" },
  { value: "congenital_anomaly", label: "Congenital anomaly/birth defect" },
  { value: "other_medically_important", label: "Other medically important event" },
];

export type SpecialSituation =
  | "overdose"
  | "misuse_abuse"
  | "medication_error"
  | "lack_of_effect"
  | "pregnancy_exposure"
  | "product_tampering"
  | "legal"
  | "media"
  | "none";

export const SPECIAL_SITUATIONS: { value: SpecialSituation; label: string }[] = [
  { value: "overdose", label: "Overdose" },
  { value: "misuse_abuse", label: "Misuse / abuse" },
  { value: "medication_error", label: "Medication error" },
  { value: "lack_of_effect", label: "Lack of effect" },
  { value: "pregnancy_exposure", label: "Pregnancy exposure" },
  { value: "product_tampering", label: "Product tampering" },
  { value: "legal", label: "Legal" },
  { value: "media", label: "Media" },
  { value: "none", label: "None" },
];

export type RoutingTarget =
  | "PV"
  | "Quality"
  | "Legal"
  | "Communications"
  | "Medical Affairs"
  | "Supervisor";

export const ROUTING_TARGETS: RoutingTarget[] = [
  "PV",
  "Quality",
  "Legal",
  "Communications",
  "Medical Affairs",
  "Supervisor",
];

export type DeliveryMethod = "phone" | "email" | "chat" | "letter" | "fax";

export const DELIVERY_METHODS: { value: DeliveryMethod; label: string }[] = [
  { value: "phone", label: "Phone" },
  { value: "email", label: "Email" },
  { value: "chat", label: "Chat" },
  { value: "letter", label: "Letter" },
  { value: "fax", label: "Fax" },
];

// ---------------------------------------------------------------------------
// Transcript
// ---------------------------------------------------------------------------
export type TranscriptTurn = {
  speaker: "persona" | "trainee";
  content: string;
};

// ---------------------------------------------------------------------------
// SRL candidates (correct + decoys, merged & shuffled server-side — see
// case-brief.ts). No "correct" flag ever reaches the client.
// ---------------------------------------------------------------------------
export type SrlCandidate = {
  id: string;
  srl_code: string | null;
  title: string;
  /** Only populated when the case is in open-book mode. */
  body?: string;
};

// ---------------------------------------------------------------------------
// Contact prefill (from ground_truth_json.inquirer_contact, safe to expose —
// it is the seed persona's contact info, not an answer key field)
// ---------------------------------------------------------------------------
export type ContactPrefill = {
  name?: string;
  background?: string;
  phone?: string;
  email?: string;
  street_address?: string;
  city?: string;
  state?: string;
  zip?: string;
};

// ---------------------------------------------------------------------------
// The safe, client-facing projection of a case_templates row.
// ---------------------------------------------------------------------------
export type CaseBrief = {
  id: string;
  case_code: string | null;
  title: string;
  difficulty: number;
  product_ref: string | null;
  therapeutic_area: string | null;
  channel: "chat" | "voice";
  hasScriptedTranscript: boolean;
  transcript: TranscriptTurn[];
  srl_candidates: SrlCandidate[];
  contact_prefill: ContactPrefill;
  sop_timeframe_business_days: number | null;
};

// ---------------------------------------------------------------------------
// Documentation record shape (client-editable form state)
// ---------------------------------------------------------------------------
export type IntakeData = {
  requester_type: RequesterType | "";
  solicited: "solicited" | "unsolicited" | "";
  contact_channel: ContactChannel | "";
  product: string;
  inquiry_category: InquiryCategory | "";
  contact: {
    name: string;
    background: string;
    phone: string;
    street_address: string;
    city: string;
    state: string;
    zip: string;
  };
};

export type InquiryData = {
  summary: string;
  verbatim_question: string;
  probing_questions: string[];
};

export type AeFourElementTest = {
  identifiable_patient: boolean;
  identifiable_reporter: boolean;
  suspect_product: boolean;
  event: boolean;
};

export type SafetyData = {
  ae_present: "yes" | "no" | "";
  four_element_test: AeFourElementTest;
  ae_description: string;
  onset_date: string;
  ongoing: "yes" | "no" | "";
  seriousness: SeriousnessCriterion[];
  pc_present: "yes" | "no" | "";
  pc_lot_number: string;
  pc_expiration_date: string;
  pc_ndc: string;
  pc_sample_available: "yes" | "no" | "";
  pregnancy_or_lactation: boolean;
  special_situations: SpecialSituation[];
  routing_dual: {
    route_to_pv: boolean;
    route_to_quality: boolean;
  };
  routing_single: RoutingTarget[];
  routed_within_timeframe_date: string;
};

export type ResponseData = {
  selected_srl_id: string;
  customization_notes: string;
  delivery_method: DeliveryMethod | "";
  verbal_answer_given: string;
};

export type ClosureData = {
  follow_up_needed: "yes" | "no" | "";
  follow_up_scheduled_date: string;
  outstanding_info: string;
  checklist: {
    inquiry_answered: boolean;
    safety_captured_routed: boolean;
    contact_info_complete: boolean;
    no_medical_advice_given: boolean;
    category_confirmed: boolean;
  };
  qc_self_check: boolean;
};

export type DocumentationFormState = {
  intake: IntakeData;
  inquiry: InquiryData;
  safety: SafetyData;
  response: ResponseData;
  closure: ClosureData;
};

export function emptyFormState(contactPrefill: ContactPrefill): DocumentationFormState {
  return {
    intake: {
      requester_type: "",
      solicited: "",
      contact_channel: "",
      product: "",
      inquiry_category: "",
      contact: {
        name: contactPrefill.name ?? "",
        background: contactPrefill.background ?? "",
        phone: contactPrefill.phone ?? "",
        street_address: contactPrefill.street_address ?? "",
        city: contactPrefill.city ?? "",
        state: contactPrefill.state ?? "",
        zip: contactPrefill.zip ?? "",
      },
    },
    inquiry: {
      summary: "",
      verbatim_question: "",
      probing_questions: [],
    },
    safety: {
      ae_present: "",
      four_element_test: {
        identifiable_patient: false,
        identifiable_reporter: false,
        suspect_product: false,
        event: false,
      },
      ae_description: "",
      onset_date: "",
      ongoing: "",
      seriousness: [],
      pc_present: "",
      pc_lot_number: "",
      pc_expiration_date: "",
      pc_ndc: "",
      pc_sample_available: "",
      pregnancy_or_lactation: false,
      special_situations: [],
      routing_dual: {
        route_to_pv: false,
        route_to_quality: false,
      },
      routing_single: [],
      routed_within_timeframe_date: "",
    },
    response: {
      selected_srl_id: "",
      customization_notes: "",
      delivery_method: "",
      verbal_answer_given: "",
    },
    closure: {
      follow_up_needed: "",
      follow_up_scheduled_date: "",
      outstanding_info: "",
      checklist: {
        inquiry_answered: false,
        safety_captured_routed: false,
        contact_info_complete: false,
        no_medical_advice_given: false,
        category_confirmed: false,
      },
      qc_self_check: false,
    },
  };
}

export function mergeFormState(
  base: DocumentationFormState,
  patch: Partial<DocumentationFormState>
): DocumentationFormState {
  return {
    intake: { ...base.intake, ...patch.intake },
    inquiry: { ...base.inquiry, ...patch.inquiry },
    safety: { ...base.safety, ...patch.safety },
    response: { ...base.response, ...patch.response },
    closure: { ...base.closure, ...patch.closure },
  };
}
