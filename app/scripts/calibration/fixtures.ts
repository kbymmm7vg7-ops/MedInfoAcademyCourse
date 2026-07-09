// =============================================================================
// CALIBRATION FIXTURES — S4 evaluator calibration harness
// =============================================================================
// Builds gold documentation records, gold call transcripts, and per-case
// failure-fixture libraries directly from the seed-case answer keys + case
// markdown. No DB, no persistence — pure functions over the on-disk seed
// artifacts, consumed by scripts/evaluator-calibration.ts.
//
// Mirrors the markdown-extraction approach in scripts/persona-transcript-test.ts
// (the `section()` helper below is copied verbatim from that script).
// =============================================================================

import type {
  DocumentationFormState,
  InquiryCategory,
  RequesterType,
  RoutingTarget,
  SeriousnessCriterion,
  SpecialSituation,
} from "../../src/lib/simulator/types";
import { emptyFormState } from "../../src/lib/simulator/types";

// ---------------------------------------------------------------------------
// Answer-key shape (machine form of 01-seed-cases/answer-key.schema.json)
// ---------------------------------------------------------------------------
export type AnswerKeyRequesterType =
  | "hcp"
  | "patient"
  | "caregiver"
  | "pharmacist"
  | "attorney"
  | "journalist"
  | "internal_sales"
  | "ambiguous";

export type AnswerKeyInquiryCategory =
  | "indication"
  | "efficacy"
  | "safety"
  | "pharmacokinetics"
  | "drug_interactions"
  | "other";

export type AnswerKeyRoute = "pv" | "quality" | "legal" | "communications" | "medical_affairs" | "supervisor";

export type AnswerKey = {
  case_id: string;
  title?: string;
  difficulty_tier: number;
  channel: "voice" | "text";
  therapeutic_area?: string;
  inquiry_category?: AnswerKeyInquiryCategory;
  inquirer_contact?: {
    name?: string;
    background?: string;
    phone?: string;
    address?: string;
  };
  products?: { name: string; is_fictional: boolean; srl_id?: string }[];
  requester: {
    type: AnswerKeyRequesterType;
    true_type_if_ambiguous?: string;
    solicited: boolean;
  };
  safety: {
    ae_present: boolean;
    ae_four_elements_met?: boolean;
    ae_description?: string;
    pc_present: boolean;
    pc_description?: string;
    pregnancy_or_lactation: boolean;
    special_situations: SpecialSituationKey[];
    dual_routing_required?: boolean;
    correct_routes?: AnswerKeyRoute[];
  };
  compliance: {
    off_label_involved: boolean;
    off_label_correct_handling?: string;
    medical_advice_risk?: boolean;
  };
  correct_srl: string;
  decoy_srl_ids?: string[];
  sop_timeframe_business_days?: number;
  documentation: {
    required_fields?: string[];
  };
  reveal_rules?: {
    cue: string;
    detail_withheld?: string;
    surfaces_when: string;
    volunteers_cue?: boolean;
  }[];
  expected_outcome: {
    applicable_sections: string[];
    gold_result: "pass";
    common_failures?: {
      description: string;
      expected_critical_fail: string[];
    }[];
  };
};

export type SpecialSituationKey =
  | "overdose"
  | "misuse_abuse"
  | "medication_error"
  | "lack_of_effect"
  | "pregnancy_exposure"
  | "product_tampering"
  | "legal"
  | "media"
  | "none";

export type TranscriptTurn = { speaker: "persona" | "trainee"; content: string };

// ---------------------------------------------------------------------------
// Markdown section extraction (copied from persona-transcript-test.ts)
// ---------------------------------------------------------------------------
export function section(md: string, name: string): string {
  const m = md.match(new RegExp(`^## ${name}[^\\n]*\\n([\\s\\S]*?)(?=^## |$(?![\\s\\S]))`, "m"));
  return m ? m[1].trim() : "";
}

function quotedFragment(cue: string): string | null {
  const m = cue.match(/["'“‘]([^"'”’]{4,})["'”’]/);
  return m ? m[1] : null;
}

// ---------------------------------------------------------------------------
// Small parsers
// ---------------------------------------------------------------------------

/** Parses "88 Winslow Medical Plaza, Ste 210, Asheville, NC 28801" or "Dayton, OH". */
function parseAddress(address: string | undefined): {
  street_address: string;
  city: string;
  state: string;
  zip: string;
} {
  if (!address) return { street_address: "", city: "", state: "", zip: "" };
  const parts = address.split(",").map((p) => p.trim());
  if (parts.length <= 2) {
    // "City, ST" or "City, ST zip" short format — no street address.
    const [city, stateZip] = parts;
    const m = (stateZip ?? "").match(/^([A-Z]{2})\s*(\d{5})?$/);
    return {
      street_address: "",
      city: city ?? "",
      state: m ? m[1] : (stateZip ?? ""),
      zip: m?.[2] ?? "",
    };
  }
  // Full format: everything except the last two comma-parts is the street address.
  const stateZipPart = parts[parts.length - 1];
  const city = parts[parts.length - 2];
  const street = parts.slice(0, parts.length - 2).join(", ");
  const m = stateZipPart.match(/^([A-Z]{2})\s*(\d{5})?$/);
  return {
    street_address: street,
    city,
    state: m ? m[1] : stateZipPart,
    zip: m?.[2] ?? "",
  };
}

const INQUIRY_CATEGORY_MAP: Record<AnswerKeyInquiryCategory, InquiryCategory> = {
  indication: "Indication",
  efficacy: "Efficacy",
  safety: "Safety",
  pharmacokinetics: "Pharmacokinetics",
  drug_interactions: "Drug-Interactions",
  other: "Other",
};

const ROUTE_MAP: Record<AnswerKeyRoute, RoutingTarget> = {
  pv: "PV",
  quality: "Quality",
  legal: "Legal",
  communications: "Communications",
  medical_affairs: "Medical Affairs",
  supervisor: "Supervisor",
};

const REQUESTER_TYPE_MAP: Record<Exclude<AnswerKeyRequesterType, "ambiguous">, RequesterType> = {
  hcp: "hcp",
  patient: "patient",
  caregiver: "caregiver",
  pharmacist: "pharmacist",
  attorney: "attorney",
  journalist: "journalist",
  internal_sales: "internal_sales",
};

function resolveRequesterType(answerKey: AnswerKey): RequesterType {
  if (answerKey.requester.type === "ambiguous") {
    const trueType = (answerKey.requester.true_type_if_ambiguous ?? "patient") as Exclude<
      AnswerKeyRequesterType,
      "ambiguous"
    >;
    return REQUESTER_TYPE_MAP[trueType] ?? "patient";
  }
  return REQUESTER_TYPE_MAP[answerKey.requester.type];
}

// ---------------------------------------------------------------------------
// buildGoldDoc
// ---------------------------------------------------------------------------
export function buildGoldDoc(answerKey: AnswerKey, receivedDate: string): DocumentationFormState {
  const requesterType = resolveRequesterType(answerKey);
  const contactParsed = parseAddress(answerKey.inquirer_contact?.address);
  const doc = emptyFormState({});

  const aePresent = answerKey.safety.ae_present === true;
  const pcPresent = answerKey.safety.pc_present === true;
  const dualRouting = answerKey.safety.dual_routing_required === true;
  const routes = (answerKey.safety.correct_routes ?? []).map((r) => ROUTE_MAP[r]);
  const specialSituations = (answerKey.safety.special_situations ?? []).filter(
    (s): s is Exclude<SpecialSituationKey, "none"> => s !== "none"
  );

  const aeDescription = answerKey.safety.ae_description ?? "";
  const seriousness: SeriousnessCriterion[] = /hospitali[sz]ation|hospitali[sz]ed/i.test(aeDescription)
    ? ["hospitalization"]
    : [];

  // route_to_pv / route_to_quality model the AE→PV + PC→Quality dual-routing
  // flags; every OTHER target (Legal, Communications, Supervisor, Medical
  // Affairs) — and PV/Quality when NOT dual — goes in routing_single. Without
  // this, dual-routing cases silently drop their non-PV/Quality routes (e.g.
  // SC-05 Legal/Communications/Supervisor).
  const routingDual = {
    route_to_pv: dualRouting && routes.includes("PV"),
    route_to_quality: dualRouting && routes.includes("Quality"),
  };
  const routingSingle: RoutingTarget[] = routes.filter(
    (r) => !(routingDual.route_to_pv && r === "PV") && !(routingDual.route_to_quality && r === "Quality")
  );

  const scenarioPremise = ""; // filled in by caller when available; see buildGoldDocFromCase below

  doc.intake = {
    ...doc.intake,
    requester_type: requesterType,
    solicited: answerKey.requester.solicited ? "solicited" : "unsolicited",
    contact_channel: "phone",
    received_date: receivedDate,
    product: answerKey.products?.[0]?.name ?? "",
    inquiry_category: answerKey.inquiry_category
      ? INQUIRY_CATEGORY_MAP[answerKey.inquiry_category]
      : "",
    contact: {
      name: answerKey.inquirer_contact?.name ?? "",
      background: answerKey.inquirer_contact?.background ?? "",
      phone: answerKey.inquirer_contact?.phone ?? "",
      street_address: contactParsed.street_address,
      city: contactParsed.city,
      state: contactParsed.state,
      zip: contactParsed.zip,
    },
  };

  doc.inquiry = {
    ...doc.inquiry,
    summary: scenarioPremise,
    verbatim_question: "",
    probing_questions: [],
  };

  doc.safety = {
    ...doc.safety,
    ae_present: aePresent ? "yes" : "no",
    four_element_test: {
      identifiable_patient: aePresent && answerKey.safety.ae_four_elements_met === true,
      identifiable_reporter: aePresent && answerKey.safety.ae_four_elements_met === true,
      suspect_product: aePresent && answerKey.safety.ae_four_elements_met === true,
      event: aePresent && answerKey.safety.ae_four_elements_met === true,
    },
    ae_description: aePresent ? aeDescription : "",
    onset_date: "",
    ongoing: aePresent && /ongoing/i.test(aeDescription) ? "yes" : aePresent ? "no" : "",
    seriousness,
    pc_present: pcPresent ? "yes" : "no",
    pc_lot_number: pcPresent ? "LOT-CALIB-0001" : "",
    pc_expiration_date: pcPresent ? "2027-06-30" : "",
    pc_ndc: pcPresent ? "0000-0000-01" : "",
    pc_sample_available: pcPresent ? "yes" : "",
    pregnancy_or_lactation: answerKey.safety.pregnancy_or_lactation === true,
    special_situations: specialSituations,
    routing_dual: routingDual,
    routing_single: routingSingle,
    routed_within_timeframe_date: aePresent || pcPresent || specialSituations.length > 0 ? receivedDate : "",
  };

  const correctSrl = answerKey.correct_srl;
  const verbalAnswer = buildVerbalAnswer(answerKey);

  doc.response = {
    ...doc.response,
    selected_srl_id: correctSrl && correctSrl !== "none" ? correctSrl : "",
    customization_notes: `Answered per ${answerKey.case_id} gold documentation example.`,
    delivery_method: "phone",
    verbal_answer_given: verbalAnswer,
  };

  doc.closure = {
    ...doc.closure,
    follow_up_needed: "no",
    follow_up_scheduled_date: "",
    outstanding_info: "",
    checklist: {
      inquiry_answered: true,
      safety_captured_routed: true,
      contact_info_complete: true,
      no_medical_advice_given: true,
      category_confirmed: true,
    },
    qc_self_check: true,
  };

  return doc;
}

function buildVerbalAnswer(answerKey: AnswerKey): string {
  const parts: string[] = [];
  const product = answerKey.products?.[0]?.name ?? "the product";
  if (answerKey.correct_srl && answerKey.correct_srl !== "none") {
    parts.push(`Provided the standard response letter ${answerKey.correct_srl} addressing the caller's question about ${product}.`);
  } else if (answerKey.compliance.off_label_involved) {
    parts.push(
      `Declined to provide off-label information for ${product}; explained MI cannot support off-label promotional requests and routed to Medical Affairs.`
    );
  } else if (answerKey.safety.special_situations?.includes("media")) {
    parts.push(
      `Declined to comment as an unauthorized spokesperson, made no causation statement, and routed the media inquiry to Corporate Communications.`
    );
  } else if (answerKey.safety.special_situations?.includes("lack_of_effect")) {
    parts.push(
      `Provided general medicine-disposal guidance (pharmacy take-back / FDA guidance) and referred all dosing questions to the prescriber and pharmacist.`
    );
  } else {
    parts.push(`Answered the caller's question using approved reference materials.`);
  }
  if (answerKey.compliance.medical_advice_risk) {
    parts.push(`Referred the caller to their prescribing HCP for any treatment or dosing decisions; no medical advice was given.`);
  }
  return parts.join(" ");
}

/** Preferred entry point: derives the inquiry summary/verbatim from the case markdown's Scenario premise. */
export function buildGoldDocFromCase(
  answerKey: AnswerKey,
  caseMd: string,
  receivedDate: string
): DocumentationFormState {
  const doc = buildGoldDoc(answerKey, receivedDate);
  const premise = section(caseMd, "Scenario premise");
  const beatSheet = section(caseMd, "Beat sheet");
  const firstBeat = beatSheet
    .split("\n")
    .find((l) => /^\d+\./.test(l.trim()))
    ?.replace(/^\d+\.\s*/, "")
    .trim();
  doc.inquiry.summary = premise;
  doc.inquiry.verbatim_question = firstBeat ? stripQuotes(firstBeat) : premise;
  return doc;
}

function stripQuotes(s: string): string {
  const m = s.match(/["'“‘]([^"'”’]+)["'”’]/);
  return m ? m[1] : s;
}

// ---------------------------------------------------------------------------
// buildGoldTranscript
// ---------------------------------------------------------------------------

const CASE_KIND: Record<string, "upfront" | "clean" | "embedded"> = {
  "SC-01": "clean",
  "SC-02": "embedded",
  "SC-03": "embedded",
  "SC-04": "embedded",
  "SC-05": "upfront",
  "SC-06": "clean",
  "SC-07": "upfront",
  "SC-08": "embedded",
  "SC-09": "clean",
  "SC-10": "upfront",
  "SC-11": "embedded",
  "SC-12": "embedded",
};

const TRAINEE_OPEN = "Thank you for calling Medical Information, this is Alex Reed speaking. How can I help you today?";

function callerNameFirst(answerKey: AnswerKey): string {
  const name = answerKey.inquirer_contact?.name ?? "there";
  return name.split(/[\s,]/)[0] || name;
}

function surfaceQuestion(caseMd: string): string {
  const beatSheet = section(caseMd, "Beat sheet");
  const firstLine = beatSheet
    .split("\n")
    .map((l) => l.trim())
    .find((l) => /^\d+\./.test(l));
  if (!firstLine) return "I have a question about the product.";
  return stripQuotes(firstLine.replace(/^\d+\.\s*/, "").replace(/^\*\*[^*]+\*\*:?\s*/, ""));
}

function contactExchangeTurns(answerKey: AnswerKey): TranscriptTurn[] {
  const name = answerKey.inquirer_contact?.name ?? "the caller";
  const phone = answerKey.inquirer_contact?.phone ?? "";
  const background = answerKey.inquirer_contact?.background ?? "";
  return [
    {
      speaker: "trainee",
      content: `Happy to help with that. Could I get your name, and are you calling as a healthcare provider, caregiver, or on your own behalf?`,
    },
    {
      speaker: "persona",
      content: `Sure — this is ${name}${background ? `, ${background}` : ""}. My callback number is ${phone}.`,
    },
  ];
}

function professionalClose(): TranscriptTurn[] {
  return [
    { speaker: "trainee", content: "Is there anything else I can help you with today?" },
    { speaker: "persona", content: "No, that covers it — thank you for your help." },
    { speaker: "trainee", content: "Thank you for calling Medical Information. Have a good day." },
  ];
}

function consentTurns(): TranscriptTurn[] {
  return [
    {
      speaker: "trainee",
      content:
        "I'd like to make sure this gets captured for our safety team, and with your permission I may need to reach out to the prescriber for more detail. Is that all right?",
    },
    { speaker: "persona", content: "Yes, that's fine — go ahead." },
  ];
}

export function buildGoldTranscript(answerKey: AnswerKey, caseMd: string): TranscriptTurn[] {
  const kind = CASE_KIND[answerKey.case_id] ?? "embedded";
  const surface = surfaceQuestion(caseMd);
  const caller = callerNameFirst(answerKey);
  const turns: TranscriptTurn[] = [];

  turns.push({ speaker: "trainee", content: TRAINEE_OPEN });

  if (kind === "upfront") {
    // Opens WITH the situation stated (SC-05 legal threat / SC-07 journalist / SC-10 pregnancy).
    turns.push({ speaker: "persona", content: surface });
    turns.push(...upfrontSpecificTurns(answerKey));
  } else {
    turns.push({ speaker: "persona", content: surface });
  }

  turns.push(...contactExchangeTurns(answerKey));

  if (kind === "embedded") {
    const rule = (answerKey.reveal_rules ?? []).find((r) => r.detail_withheld && r.volunteers_cue !== false);
    if (rule) {
      const cueQuote = quotedFragment(rule.cue) ?? rule.cue;
      turns.push({
        speaker: "persona",
        content: `Oh, by the way — ${cueQuote}`,
      });
      turns.push({
        speaker: "trainee",
        content: `Before we go further — you mentioned "${cueQuote}" a moment ago. Can you tell me more about that: when it started, and whether it's still happening?`,
      });
      turns.push({
        speaker: "persona",
        content: describeDisclosure(answerKey),
      });
      if (answerKey.compliance.medical_advice_risk) {
        turns.push(...consentTurns());
      }
    }
  } else if (kind === "upfront" && answerKey.case_id === "SC-10") {
    turns.push({
      speaker: "trainee",
      content: "Can you tell me your estimated due date or last menstrual period, and who your prescribing physician is?",
    });
    turns.push({
      speaker: "persona",
      content: "Sure — I'm about 6 weeks along based on my last period, and Dr. Alvarez is my neurologist.",
    });
  }

  if (answerKey.case_id === "SC-06") {
    turns.push({
      speaker: "persona",
      content: "Can you at least tell me if it works for psoriasis? Even off the record, just for my own knowledge?",
    });
    turns.push({
      speaker: "trainee",
      content:
        "I understand you're trying to help your customer, but I'm not able to share efficacy data for an unapproved use — Immunexa is only approved for RA. I'll route this to Medical Affairs, and if the dermatologist has a genuine question, that needs to come through our approved unsolicited-request process.",
    });
    turns.push({ speaker: "persona", content: "Okay, understood — go ahead and route it." });
  }

  if (answerKey.case_id === "SC-05") {
    turns.push({
      speaker: "persona",
      content: "Someone needs to just admit this drug did this to her. Can you at least say that?",
    });
    turns.push({
      speaker: "trainee",
      content:
        "I hear how frightening this has been, and I want to make sure your mother gets the right care. I'm not able to confirm what caused the rash — that's something her treating physician needs to evaluate — but I am documenting everything you've told me and routing it to our safety team right away.",
    });
    turns.push({ speaker: "persona", content: "Fine. Just make sure someone actually does something about it." });
  }

  if (answerKey.case_id === "SC-07") {
    turns.push({
      speaker: "persona",
      content: "So you're saying it does cause cancer — can I quote you on that?",
    });
    turns.push({
      speaker: "trainee",
      content:
        "I'm not able to speak on the record or characterize the warning beyond what's in the approved labeling. I'll have our Corporate Communications team follow up with you directly — can I get the best contact for you and your outlet?",
    });
    turns.push({ speaker: "persona", content: "The Meridian Health Desk, same number I called from." });
  }

  // Answer the surface question, citing SRL or general guidance.
  turns.push({
    speaker: "trainee",
    content: answerSurfaceLine(answerKey),
  });
  turns.push({ speaker: "persona", content: "That's helpful, thank you." });

  if (answerKey.compliance.medical_advice_risk && kind !== "embedded") {
    turns.push({
      speaker: "trainee",
      content: "For any decisions about your treatment or dosing, please check with your prescribing physician — I'm not able to advise on that directly.",
    });
    turns.push({ speaker: "persona", content: "Understood, I'll follow up with them." });
  }

  turns.push(...professionalClose());

  // Ensure 10-16 turns; pad with a benign clarifying exchange if short.
  while (turns.length < 10) {
    turns.splice(turns.length - 3, 0, {
      speaker: "trainee",
      content: "Just to confirm, is there anything else about this you'd like me to note before we wrap up?",
    });
    turns.splice(turns.length - 3, 0, { speaker: "persona", content: "No, I think that's everything." });
  }

  return turns.slice(0, 16);
}

function upfrontSpecificTurns(answerKey: AnswerKey): TranscriptTurn[] {
  if (answerKey.case_id === "SC-05") {
    return [
      { speaker: "persona", content: "I'm calling a lawyer and the news if I don't get answers today." },
    ];
  }
  if (answerKey.case_id === "SC-07") {
    return [{ speaker: "persona", content: "I'm on deadline, so I'd like a direct answer." }];
  }
  return [];
}

function describeDisclosure(answerKey: AnswerKey): string {
  const desc = answerKey.safety.ae_description || answerKey.safety.pc_description || "";
  if (desc) return desc.replace(/\.$/, "") + ".";
  return "It's been going on for a little while now, honestly.";
}

function answerSurfaceLine(answerKey: AnswerKey): string {
  const product = answerKey.products?.[0]?.name ?? "the product";
  if (answerKey.correct_srl && answerKey.correct_srl !== "none") {
    return `Based on ${answerKey.correct_srl}, here's what our approved information says about your question on ${product}: ${genericAnswerBody(answerKey)}`;
  }
  if (answerKey.case_id === "SC-11") {
    return "For disposal of unused Cardizan, the safest approach is a pharmacy take-back program, or following FDA disposal guidance if take-back isn't available — I can't advise on the dose itself, so please direct any INR or dosing questions to your prescriber.";
  }
  if (answerKey.case_id === "SC-06") {
    return "As I mentioned, I'm not able to provide off-label efficacy data — I've routed this to Medical Affairs.";
  }
  if (answerKey.case_id === "SC-07") {
    return "I've routed your inquiry to Corporate Communications, who will follow up with an approved statement.";
  }
  return `Here's the approved information addressing your question about ${product}.`;
}

function genericAnswerBody(answerKey: AnswerKey): string {
  switch (answerKey.case_id) {
    case "SC-01":
      return "several antibiotic classes (e.g., macrolides, fluoroquinolones) can potentiate the INR effect per the prescribing information.";
    case "SC-02":
      return "full symptom relief typically takes several days of consistent dosing; I'd encourage keeping to the regimen and checking with your pharmacist before changing the dose.";
    case "SC-03":
      return "rinsing the mouth after each Pulmonara inhalation is recommended per the administration guidance.";
    case "SC-04":
      return "the tingling and numbness you're describing can be a sign of low calcium and should be evaluated urgently by a physician.";
    case "SC-08":
      return "typical duration of use is per your prescriber's instructions, and any worsening skin reaction should be evaluated by them promptly.";
    case "SC-09":
      return "the renal dose adjustment guidance for that creatinine clearance range is detailed in the prescribing information.";
    case "SC-10":
      return "there's a pregnancy exposure registry for Neurovance, and any decision about continuing or stopping needs to be made with your prescriber given the risks of abrupt discontinuation.";
    case "SC-12":
      return "live vaccines require specific timing precautions relative to Immunexa dosing per the prescribing information.";
    default:
      return "the approved prescribing information addresses this directly.";
  }
}

// ---------------------------------------------------------------------------
// Failure fixtures
// ---------------------------------------------------------------------------
export type FailureFixture = {
  label: string;
  expected_critical_fail: string[];
  doc: DocumentationFormState;
  transcript: TranscriptTurn[];
};

type Mutator = (
  answerKey: AnswerKey,
  doc: DocumentationFormState,
  transcript: TranscriptTurn[]
) => { doc: DocumentationFormState; transcript: TranscriptTurn[] };

function cloneDoc(doc: DocumentationFormState): DocumentationFormState {
  return JSON.parse(JSON.stringify(doc));
}
function cloneTranscript(t: TranscriptTurn[]): TranscriptTurn[] {
  return JSON.parse(JSON.stringify(t));
}

// Removes the clarify+disclosure pair (and any consent turns) from the transcript,
// and blanks the safety signal from the doc — the cue was let pass entirely.
const missedCue: Mutator = (_ak, doc, transcript) => {
  const idx = transcript.findIndex(
    (t) => t.speaker === "trainee" && /mentioned ".*" a moment ago/.test(t.content)
  );
  let newTranscript = transcript;
  if (idx >= 0) {
    // Remove trainee-clarify, persona-disclosure, and any consent turns that follow
    // immediately (up to 2 more persona/trainee pairs) before the next non-safety line.
    let end = idx + 2;
    while (
      end < transcript.length &&
      /consent|permission|reach out to the prescriber/i.test(transcript[end]?.content ?? "")
    ) {
      end += 2;
    }
    newTranscript = [...transcript.slice(0, idx - 1), ...transcript.slice(end)];
  }
  doc.safety.ae_present = "no";
  doc.safety.four_element_test = {
    identifiable_patient: false,
    identifiable_reporter: false,
    suspect_product: false,
    event: false,
  };
  doc.safety.ae_description = "";
  doc.safety.routing_single = [];
  doc.safety.routing_dual = { route_to_pv: false, route_to_quality: false };
  doc.safety.seriousness = [];
  return { doc, transcript: newTranscript };
};

// AE caught/clarified verbally in the transcript, but the Safety tab is blank.
const aeNotDocumented: Mutator = (_ak, doc, transcript) => {
  doc.safety.ae_present = "no";
  doc.safety.four_element_test = {
    identifiable_patient: false,
    identifiable_reporter: false,
    suspect_product: false,
    event: false,
  };
  doc.safety.ae_description = "";
  return { doc, transcript };
};

// AE documented, but routing/seriousness cleared.
const noPvRouteNotFlaggedSerious: Mutator = (_ak, doc, transcript) => {
  doc.safety.routing_single = [];
  doc.safety.routing_dual = { route_to_pv: false, route_to_quality: false };
  doc.safety.seriousness = [];
  doc.safety.routed_within_timeframe_date = "";
  return { doc, transcript };
};

function medicalAdviceLine(caseId: string): string {
  switch (caseId) {
    case "SC-02":
      return " You could just double the dose to get faster relief.";
    case "SC-08":
      return " Go ahead and stop the cream on your own — that should clear it up.";
    case "SC-10":
      return " You should just stop taking Neurovance right away to be safe.";
    case "SC-11":
      return " Since your INR was low anyway, you probably didn't need the dose increase.";
    default:
      return " You could just double the dose to get faster relief.";
  }
}

const medicalAdvice: Mutator = (ak, doc, transcript) => {
  const advice = medicalAdviceLine(ak.case_id).trim();
  doc.response.verbal_answer_given = doc.response.verbal_answer_given + " " + advice;
  doc.closure.checklist.no_medical_advice_given = false;
  const newTranscript = cloneTranscript(transcript);
  // Insert the advice as a prominent standalone trainee turn just before the
  // professional close — appending it to the sign-off turn buries it where the
  // evaluator can miss it (non-deterministic S4.2).
  const closeIdx = newTranscript.findIndex((t) => /anything else i can help/i.test(t.content));
  const insertAt = closeIdx >= 0 ? closeIdx : Math.max(0, newTranscript.length - 3);
  newTranscript.splice(insertAt, 0, { speaker: "trainee", content: advice });
  return { doc, transcript: newTranscript };
};

function decoyFor(ak: AnswerKey): string {
  return ak.decoy_srl_ids?.[0] ?? "SRL-DECOY-UNKNOWN";
}

const wrongSrl: Mutator = (ak, doc, transcript) => {
  doc.response.selected_srl_id = decoyFor(ak);
  return { doc, transcript };
};

const wrongContactSet: Mutator = (ak, doc, transcript) => {
  const isHcpLike = doc.intake.requester_type === "hcp" || doc.intake.requester_type === "pharmacist";
  if (isHcpLike) {
    // HCP case: strip to city+state only.
    doc.intake.contact.street_address = "";
  } else {
    // Patient case: fill full HCP-style contact incorrectly (over-collection isn't
    // the failure mode being tested — under-collection for HCP/AE/PC cases is).
    doc.intake.contact.street_address = "999 Should Not Be Required St";
  }
  void ak;
  return { doc, transcript };
};

const missingPcIdentifiers: Mutator = (_ak, doc, transcript) => {
  doc.safety.pc_lot_number = "";
  doc.safety.pc_expiration_date = "";
  doc.safety.pc_ndc = "";
  return { doc, transcript };
};

const noRetrieval: Mutator = (_ak, doc, transcript) => {
  doc.safety.pc_sample_available = "no";
  const newTranscript = transcript.filter((t) => !/retriev/i.test(t.content));
  return { doc, transcript: newTranscript };
};

const overFlagAe: Mutator = (_ak, doc, transcript) => {
  doc.safety.ae_present = "yes";
  doc.safety.four_element_test = {
    identifiable_patient: true,
    identifiable_reporter: true,
    suspect_product: true,
    event: true,
  };
  doc.safety.ae_description = "Possible headache reported (unconfirmed, not volunteered by caller).";
  const newTranscript = cloneTranscript(transcript);
  newTranscript.push(
    {
      speaker: "trainee",
      content: "Before we finish — have you noticed any headaches or other side effects at all, even minor ones?",
    },
    { speaker: "persona", content: "I mean... I guess maybe a mild headache, but I wasn't calling about that." }
  );
  return { doc, transcript: newTranscript };
};

const offLabelVolunteered: Mutator = (_ak, doc, transcript) => {
  doc.response.verbal_answer_given =
    "Sure, I can send over the efficacy data for Immunexa in psoriasis for you to share with the dermatologist.";
  const newTranscript = cloneTranscript(transcript);
  const idx = newTranscript.findIndex((t) => /at least tell me if it works/i.test(t.content));
  if (idx >= 0) {
    newTranscript[idx + 1] = {
      speaker: "trainee",
      content:
        "Sure, I can send over the efficacy data for Immunexa in psoriasis for you to share with the dermatologist.",
    };
  }
  return { doc, transcript: newTranscript };
};

const specialSituationMissed: Mutator = (ak, doc, transcript) => {
  doc.safety.special_situations = [];
  doc.safety.routing_single = [];
  doc.safety.routing_dual = { route_to_pv: false, route_to_quality: false };
  // For EMBEDDED special situations (e.g. SC-11 LOE surfaced via a volunteered
  // cue), also strip the transcript's clarify/disclosure turns — otherwise the
  // evaluator credits S5.2 identification from the trainee catching the cue.
  // No-op for upfront special situations (no such turn to remove).
  const { transcript: scrubbed } = missedCue(ak, doc, transcript);
  return { doc, transcript: scrubbed };
};

// Trainee volunteers explicit off-label / above-labeled-dose guidance (a
// deliberately non-compliant response used to test that S5.1 trips). Not
// medical guidance — a simulated failure.
const offLabelDosingVolunteered: Mutator = (ak, doc, transcript) => {
  const product = ak.products?.[0]?.name ?? "the product";
  const line = ` And off the record, you can go above the labeled maximum dose of ${product} for a faster effect — a lot of prescribers use it off-label at higher doses.`;
  doc.response.verbal_answer_given = doc.response.verbal_answer_given + line;
  const newTranscript = cloneTranscript(transcript);
  const lastTraineeIdx = [...newTranscript]
    .map((t, i) => ({ t, i }))
    .reverse()
    .find(({ t }) => t.speaker === "trainee")?.i;
  if (lastTraineeIdx != null) {
    newTranscript[lastTraineeIdx] = {
      ...newTranscript[lastTraineeIdx],
      content: newTranscript[lastTraineeIdx].content + line,
    };
  }
  return { doc, transcript: newTranscript };
};

const singleRouteOnly: Mutator = (_ak, doc, transcript) => {
  doc.safety.routing_dual = { ...doc.safety.routing_dual, route_to_quality: false };
  return { doc, transcript };
};

const admitCausation: Mutator = (_ak, doc, transcript) => {
  const line = "I'm so sorry — the drug clearly caused this rash.";
  doc.response.verbal_answer_given = doc.response.verbal_answer_given + " " + line;
  const newTranscript = cloneTranscript(transcript);
  const idx = newTranscript.findIndex((t) => /admit this drug did this/i.test(t.content));
  if (idx >= 0) {
    newTranscript[idx + 1] = { speaker: "trainee", content: line };
  } else {
    newTranscript.push({ speaker: "trainee", content: line });
  }
  return { doc, transcript: newTranscript };
};

const spokespersonStatement: Mutator = (ak, doc, transcript) => {
  const line = `Official statement: per ${ak.correct_srl !== "none" ? ak.correct_srl : "our labeling"}, this product is safe and effective as directed. Yes, you can quote me on that.`;
  doc.response.verbal_answer_given = line;
  // Acting as an unauthorized spokesperson means the trainee treated it as a
  // routine inquiry — neither flagged nor routed as a media special situation
  // (the evaluator otherwise infers identification from Communications routing
  // or the compliant redirect turns) → trips S5.2.
  doc.safety.special_situations = [];
  doc.safety.routing_single = [];
  doc.safety.routing_dual = { route_to_pv: false, route_to_quality: false };
  // Scrub the compliant media-handling turns so the transcript consistently
  // shows on-record spokesperson behavior (otherwise those turns evidence S5.2).
  const newTranscript = cloneTranscript(transcript).map((t) =>
    t.speaker === "trainee" &&
    /on the record|communications|approved statement|not able to (speak|comment)|follow up with/i.test(t.content)
      ? { speaker: "trainee" as const, content: line }
      : t
  );
  const idx = newTranscript.findIndex((t) => /quote you on that/i.test(t.content));
  if (idx >= 0 && newTranscript[idx + 1]) {
    newTranscript[idx + 1] = { speaker: "trainee", content: line };
  } else if (idx < 0) {
    newTranscript.push({ speaker: "trainee", content: line });
  }
  return { doc, transcript: newTranscript };
};

const omitLegalComms: Mutator = (_ak, doc, transcript) => {
  doc.safety.routing_single = ["PV"];
  doc.safety.routing_dual = { route_to_pv: false, route_to_quality: false };
  doc.safety.special_situations = doc.safety.special_situations.filter((s) => s === "legal" || s === "media");
  return { doc, transcript };
};

const MUTATOR_LIB: Record<string, Mutator> = {
  missedCue,
  aeNotDocumented,
  noPvRouteNotFlaggedSerious,
  medicalAdvice,
  wrongSrl,
  wrongContactSet,
  missingPcIdentifiers,
  noRetrieval,
  overFlagAe,
  offLabelVolunteered,
  specialSituationMissed,
  singleRouteOnly,
  admitCausation,
  spokespersonStatement,
  omitLegalComms,
  offLabelDosingVolunteered,
};

/** Maps a common_failures[].description to one or more mutators by keyword. */
function pickMutators(caseId: string, description: string): string[] {
  const d = description.toLowerCase();
  const picks: string[] = [];

  if (caseId === "SC-05" && /admit|causation|apologiz/.test(d)) picks.push("admitCausation");
  else if (caseId === "SC-07" && /reads an srl|spokesperson|official statement/.test(d)) picks.push("spokespersonStatement");
  else if (caseId === "SC-06" && /sends efficacy data|off-label information/.test(d)) picks.push("offLabelVolunteered");
  else if (/lets? the .*cue pass|missed entirely|never clarifies/.test(d)) picks.push("missedCue");
  else if (/clarifies.*verbally but (doesn'?t|omits)|identified but not documented|identifies both.*doesn'?t route|catches and clarifies the ae but doesn'?t route/.test(d) && /route|pv|quality/.test(d)) {
    picks.push("noPvRouteNotFlaggedSerious");
  } else if (/clarifies.*verbally but omits it from safety tab|identified but not documented|omits it from safety tab/.test(d)) {
    picks.push("aeNotDocumented");
  } else if (/routes? to only one department/.test(d)) picks.push("singleRouteOnly");
  else if (/omits legal\/communications|routes ae to pv but omits/.test(d)) picks.push("omitLegalComms");
  else if (/doesn'?t flag the pregnancy exposure|doesn'?t route to pv \/ omits registry|never captures the loe|dismisses the dose-increase|doesn'?t flag legal\/media/.test(d)) {
    picks.push("specialSituationMissed");
  } else if (/tells? (the )?patient to (double|stop|keep taking)|advises? (the )?patient (to stop|on dosing)|advises the patient on dosing/.test(d)) {
    picks.push("medicalAdvice");
  } else if (/selects? `?srl-|selects srl-/.test(d)) picks.push("wrongSrl");
  else if (/treats caller as hcp|captures (hcp|patient\/consumer) contact fields/.test(d)) picks.push("wrongContactSet");
  else if (/doesn'?t capture lot\/expiry/.test(d)) picks.push("missingPcIdentifiers");
  else if (/doesn'?t offer retrieval/.test(d)) picks.push("noRetrieval");
  else if (/flags a nonexistent ae|over-flag|fabricates an ae|over-states the loe/.test(d)) picks.push("overFlagAe");
  else if (/doesn'?t route to medical affairs/.test(d)) picks.push("omitLegalComms"); // clears routing generically
  else if (/de-escalation fails/.test(d)) picks.push("admitCausation"); // closest behavioral proxy
  else if (/doesn'?t capture outlet\/contact or notify communications/.test(d)) picks.push("omitLegalComms");
  else if (/fails to capture consent/.test(d)) picks.push("aeNotDocumented"); // proxy: blanks consent-adjacent doc trail
  else if (/gives a substantive comment|confirms or denies causation/.test(d)) picks.push("spokespersonStatement");
  else if (/answers with an on-label srl/.test(d)) picks.push("wrongSrl");
  else if (/adds unsolicited off-label dosing/.test(d)) picks.push("offLabelDosingVolunteered");

  if (picks.length === 0) picks.push("overFlagAe"); // safe generic fallback, always applicable
  return picks;
}

export function buildFailureFixtures(
  answerKey: AnswerKey,
  goldDoc: DocumentationFormState,
  goldTranscript: TranscriptTurn[]
): FailureFixture[] {
  const failures = answerKey.expected_outcome.common_failures ?? [];
  return failures.map((f, i) => {
    const mutatorNames = pickMutators(answerKey.case_id, f.description);
    let doc = cloneDoc(goldDoc);
    let transcript = cloneTranscript(goldTranscript);
    for (const name of mutatorNames) {
      const mutator = MUTATOR_LIB[name];
      const result = mutator(answerKey, doc, transcript);
      doc = result.doc;
      transcript = result.transcript;
    }
    const label = `${answerKey.case_id}-failure-${i + 1}-${mutatorNames.join("+")}`;
    return {
      label,
      expected_critical_fail: f.expected_critical_fail ?? [],
      doc,
      transcript,
    };
  });
}
