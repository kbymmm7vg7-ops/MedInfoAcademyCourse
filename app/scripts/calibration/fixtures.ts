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

export type AnswerKeyRoute = "pv" | "quality" | "legal" | "media";

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

// Legal/Media are routing destinations, not special situations, since the
// 2026-07-11 ruling — the answer-key schema enum matches.
export type SpecialSituationKey =
  | "overdose"
  | "misuse_abuse"
  | "medication_error"
  | "lack_of_effect"
  | "pregnancy_exposure"
  | "product_tampering"
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

// Routing roster per Nathan 2026-07-11: PV / Quality / Legal / Media.
const ROUTE_MAP: Record<AnswerKeyRoute, RoutingTarget> = {
  pv: "PV",
  quality: "Quality",
  legal: "Legal",
  media: "Media",
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

  // Patient initials only when the caller IS the patient (derivable from the
  // inquirer name); third-party reports leave demographics blank — no
  // minimum-completeness gate exists (Nathan, 2026-07-11).
  const isPatientCaller = requesterType === "patient";
  const initials = isPatientCaller
    ? (answerKey.inquirer_contact?.name ?? "")
        .split(/\s+/)
        .map((p) => p[0] ?? "")
        .join("")
        .toUpperCase()
    : "";

  doc.safety = {
    ...doc.safety,
    ae_present: aePresent ? "yes" : "no",
    ae_description: aePresent ? aeDescription : "",
    onset_date: "",
    ongoing: aePresent && /ongoing/i.test(aeDescription) ? "yes" : aePresent ? "no" : "",
    seriousness,
    patient_initials: aePresent ? initials : "",
    patient_dob: "",
    patient_gender: "",
    concomitant_meds: "",
    // S2.7 live (Nathan, 2026-07-11): every gold AE conversation carries the
    // consent/reporter exchange, so the gold record documents consent.
    hcp_followup_consent: aePresent ? "yes" : "",
    pc_present: pcPresent ? "yes" : "no",
    pc_lot_number: pcPresent ? "LOT-CALIB-0001" : "",
    pc_expiration_date: pcPresent ? "2027-06-30" : "",
    pc_ndc: pcPresent ? "0000-0000-01" : "",
    pc_sample_available: pcPresent ? "yes" : "",
    special_situations: specialSituations,
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
    // Routing moved to the Closure tab (Nathan, 2026-07-11); the routed-date
    // field is gone — S2.2/S3.2 is computed from the submission timestamp.
    routing_dual: routingDual,
    routing_single: routingSingle,
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
      `Declined to provide off-label information for ${product}; explained MI cannot support off-label promotional requests and documented the redirect to the approved unsolicited-request process.`
    );
  } else if (answerKey.safety.correct_routes?.includes("media")) {
    parts.push(
      `Declined to comment as an unauthorized spokesperson, made no causation statement, and routed the media inquiry to the Media desk.`
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
    // LOE/SSE parity (Nathan, 2026-07-11): pregnancy exposure is entered as a
    // safety report through the same AE reporting process, not a flag-only note.
    turns.push({
      speaker: "trainee",
      content:
        "Thank you. Because you've been taking Neurovance during the pregnancy, I'm going to record this as a safety report and route it to our safety team today — that's standard for any pregnancy exposure, even when there's no problem to report.",
    });
    turns.push({ speaker: "persona", content: "Okay, that makes sense." });
    turns.push({
      speaker: "trainee",
      content:
        "And is it all right if our safety team follows up with Dr. Alvarez for any medical details they need?",
    });
    turns.push({ speaker: "persona", content: "Yes, that's fine." });
  }

  // SC-01 ruling (Nathan, 2026-07-11): the sinus infection is an intercurrent
  // reportable AE — the gold conversation states the capture explicitly.
  if (answerKey.case_id === "SC-01") {
    turns.push({
      speaker: "trainee",
      content:
        "Since the patient developed the sinus infection while on Cardizan, I'm also going to capture that as an adverse event report and route it to our safety team — that's standard even when it appears unrelated to therapy. May I list you as the reporting physician?",
    });
    turns.push({ speaker: "persona", content: "That's fine — you can list me as the reporting physician." });
  }

  // LOE/SSE parity (Nathan, 2026-07-11): reportable lack of effect is captured
  // as an AE and a product complaint (dual PV+Quality routing), so the gold
  // conversations must show the capture + lot/NDC exchange the gold docs claim.
  if (answerKey.case_id === "SC-02") {
    turns.push({
      speaker: "trainee",
      content:
        "You mentioned Gastroquell isn't working right away for your heartburn — can I ask how long you've been taking it, and whether you've had any relief at all so far?",
    });
    turns.push({ speaker: "persona", content: "About four days now, and honestly not much relief yet." });
    turns.push({
      speaker: "trainee",
      content:
        "Thank you — I'm going to capture that lack of effect for our safety team to assess, and log a product complaint so our quality team can take a look as well. Do you have the package handy — could you read me the lot number and expiration date, and would you be able to keep it in case our quality team requests it?",
    });
    turns.push({
      speaker: "persona",
      content: "Sure — lot LOT-CALIB-0001, expires June 2027. I'll hang on to it.",
    });
    turns.push({
      speaker: "trainee",
      content:
        "And would it be all right if I or our safety team follow up with your doctor or pharmacist about this if we need more detail?",
    });
    turns.push({ speaker: "persona", content: "Sure, that's fine." });
  }

  if (answerKey.case_id === "SC-08") {
    turns.push({
      speaker: "trainee",
      content:
        "Since this could also involve the product itself, I'm going to log a product complaint alongside the safety report. Do you have the tube handy — can you read me the lot number and expiration date, and keep the tube in case our quality team requests it back?",
    });
    turns.push({
      speaker: "persona",
      content: "Yes — lot LOT-CALIB-0001, expires June 2027, and I'll hold on to the tube.",
    });
  }

  if (answerKey.case_id === "SC-11") {
    turns.push({
      speaker: "trainee",
      content:
        "Since you still have the leftover lower-dose tablets, I'm going to capture the lack of effect for our safety team and log a product complaint as well. Could you read me the lot number and expiration date from the bottle, and keep the tablets for now in case our quality team requests them before disposal?",
    });
    turns.push({
      speaker: "persona",
      content: "Sure — lot LOT-CALIB-0001, expires June 2027. I'll keep them for now.",
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
        "I understand you're trying to help your customer, but I'm not able to share efficacy data for an unapproved use — Immunexa is only approved for RA. If the dermatologist has a genuine clinical question, it needs to come through our approved unsolicited-request process — I'll document this request and the redirect.",
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
    turns.push({
      speaker: "trainee",
      content:
        "Because you've mentioned a lawyer and the news, I'm also flagging this to our Legal and Media desks so the right teams are looped in from the start.",
    });
    turns.push({ speaker: "persona", content: "Good. They should be." });
    turns.push({
      speaker: "trainee",
      content:
        "Thank you. With your permission, our safety team may also contact your mother's treating physician for the medical details — is that all right?",
    });
    turns.push({ speaker: "persona", content: "Yes, fine — whatever gets this looked at." });
  }

  if (answerKey.case_id === "SC-07") {
    turns.push({
      speaker: "persona",
      content: "So you're saying it does cause cancer — can I quote you on that?",
    });
    turns.push({
      speaker: "trainee",
      content:
        "I'm not able to speak on the record or characterize the warning beyond what's in the approved labeling. I'm routing your inquiry to our Media desk to follow up with you directly — can I get the best contact for you and your outlet?",
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

  // Ensure 10-18 turns; pad with a benign clarifying exchange if short.
  // (Cap raised 16→18 on 2026-07-11: the S2.7 consent exchanges added two
  // turns to several gold calls and the professional close must survive.)
  while (turns.length < 10) {
    turns.splice(turns.length - 3, 0, {
      speaker: "trainee",
      content: "Just to confirm, is there anything else about this you'd like me to note before we wrap up?",
    });
    turns.splice(turns.length - 3, 0, { speaker: "persona", content: "No, I think that's everything." });
  }

  return turns.slice(0, 18);
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
    return "As I mentioned, I'm not able to provide off-label efficacy data — I've documented the request and the redirect through our approved unsolicited-request process.";
  }
  if (answerKey.case_id === "SC-07") {
    return "I've routed your inquiry to our Media desk, who will follow up with an approved statement.";
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
  // Also scrub explicit compliant-capture lines (and their persona ack) —
  // gold transcripts state the capture out loud ("capture that … for our
  // safety team", "record this as a safety report", "log … adverse event");
  // an AE-missed fixture must not keep that contrary evidence.
  const captureLine =
    /record this as a safety report|capture (that|the) [^.]*for our safety team|log[^.]*(adverse event|safety report)|route (it|this) to our safety team|safety team (also )?follows? up/i;
  newTranscript = newTranscript.filter(
    (t, i, arr) =>
      !(
        (t.speaker === "trainee" && captureLine.test(t.content)) ||
        (arr[i - 1]?.speaker === "trainee" && captureLine.test(arr[i - 1].content) && t.speaker === "persona")
      )
  );
  doc.safety.ae_present = "no";
  doc.safety.ae_description = "";
  doc.safety.seriousness = [];
  doc.safety.patient_initials = "";
  doc.safety.patient_dob = "";
  doc.safety.patient_gender = "";
  doc.safety.concomitant_meds = "";
  doc.safety.hcp_followup_consent = "";
  doc.closure.routing_single = [];
  doc.closure.routing_dual = { route_to_pv: false, route_to_quality: false };
  return { doc, transcript: newTranscript };
};

// AE caught/clarified verbally in the transcript, but the Safety tab is blank.
const aeNotDocumented: Mutator = (_ak, doc, transcript) => {
  doc.safety.ae_present = "no";
  doc.safety.ae_description = "";
  doc.safety.patient_initials = "";
  doc.safety.patient_dob = "";
  doc.safety.patient_gender = "";
  doc.safety.concomitant_meds = "";
  doc.safety.hcp_followup_consent = "";
  return { doc, transcript };
};

// AE documented, but routing/seriousness cleared.
const noPvRouteNotFlaggedSerious: Mutator = (_ak, doc, transcript) => {
  doc.closure.routing_single = [];
  doc.closure.routing_dual = { route_to_pv: false, route_to_quality: false };
  doc.safety.seriousness = [];
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
  doc.closure.routing_single = [];
  doc.closure.routing_dual = { route_to_pv: false, route_to_quality: false };
  // For EMBEDDED special situations (e.g. SC-11 LOE surfaced via a volunteered
  // cue), also strip the transcript's clarify/disclosure turns — otherwise the
  // evaluator credits S5.2 identification from the trainee catching the cue.
  // No-op for upfront special situations (no such turn to remove).
  const { transcript: cueScrubbed } = missedCue(ak, doc, transcript);
  // LOE/SSE parity gold transcripts contain explicit compliant-capture lines
  // ("record this as a safety report", "capture that lack of effect"); a
  // never-flagged fixture must not keep them as contrary transcript evidence.
  const scrubbed = cueScrubbed.filter(
    (t, i, arr) =>
      !(
        (t.speaker === "trainee" &&
          /record this as a safety report|capture (that|the) lack of effect|route (it|this) to our safety team|safety team (also )?follows? up/i.test(t.content)) ||
        (arr[i - 1]?.speaker === "trainee" &&
          /record this as a safety report|capture (that|the) lack of effect|route (it|this) to our safety team|safety team (also )?follows? up/i.test(arr[i - 1].content) &&
          t.speaker === "persona")
      )
  );
  return { doc, transcript: scrubbed };
};

// LOE/SSE parity (Nathan, 2026-07-11): where a reportable LOE (SC-02/SC-11) or
// a cue-borne AE (SC-08) also carries a product complaint, missing the event
// means the PC leg is missed too — clear the PC documentation and remove the
// lot/complaint exchange from the transcript so S3.1 trips alongside S2.1.
const pcMissedEntirely: Mutator = (_ak, doc, transcript) => {
  doc.safety.pc_present = "no";
  doc.safety.pc_lot_number = "";
  doc.safety.pc_expiration_date = "";
  doc.safety.pc_ndc = "";
  doc.safety.pc_sample_available = "";
  doc.closure.routing_dual = { ...doc.closure.routing_dual, route_to_quality: false };
  doc.closure.routing_single = doc.closure.routing_single.filter((r) => r !== "Quality");
  const newTranscript = transcript.filter(
    (t, i, arr) =>
      !(
        (t.speaker === "trainee" && /product complaint|lot number/i.test(t.content)) ||
        (arr[i - 1]?.speaker === "trainee" &&
          /product complaint|lot number/i.test(arr[i - 1].content) &&
          t.speaker === "persona" &&
          /lot|tube|package|tablets|hang on|hold on|keep them/i.test(t.content))
      )
  );
  return { doc, transcript: newTranscript };
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
  doc.closure.routing_dual = { ...doc.closure.routing_dual, route_to_quality: false };
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
  doc.closure.routing_single = [];
  doc.closure.routing_dual = { route_to_pv: false, route_to_quality: false };
  // Scrub the compliant media-handling turns so the transcript consistently
  // shows on-record spokesperson behavior (otherwise those turns evidence S5.2).
  const newTranscript = cloneTranscript(transcript).map((t) =>
    t.speaker === "trainee" &&
    /on the record|media desk|approved statement|not able to (speak|comment)|follow up with/i.test(t.content)
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

// Routes only to PV, dropping the Legal/Media escalation legs.
const omitLegalMedia: Mutator = (_ak, doc, transcript) => {
  doc.closure.routing_single = ["PV"];
  doc.closure.routing_dual = { route_to_pv: false, route_to_quality: false };
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
  omitLegalMedia,
  offLabelDosingVolunteered,
  pcMissedEntirely,
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
  else if (/omits (the )?legal\/(communications|media)|routes? the ae to pv but omits|routes ae to pv but omits|neither legal nor media routing/.test(d)) picks.push("omitLegalMedia");
  else if (/doesn'?t flag the pregnancy exposure|doesn'?t route to pv \/ omits registry|never captures the (loe|reported lack of effect)|dismisses the dose-increase/.test(d)) {
    picks.push("specialSituationMissed");
  } else if (/tells? (the )?patient to (double|stop|keep taking)|advises? (the )?patient (to stop|on dosing)|advises the patient on dosing/.test(d)) {
    picks.push("medicalAdvice");
  } else if (/selects? `?srl-|selects srl-/.test(d)) picks.push("wrongSrl");
  else if (/treats caller as hcp|captures (hcp|patient\/consumer) contact fields/.test(d)) picks.push("wrongContactSet");
  else if (/doesn'?t capture lot\/expiry/.test(d)) picks.push("missingPcIdentifiers");
  else if (/doesn'?t offer retrieval/.test(d)) picks.push("noRetrieval");
  else if (/flags a nonexistent ae|over-flag|fabricates an ae|over-states the loe/.test(d)) picks.push("overFlagAe");
  else if (/de-escalation fails/.test(d)) picks.push("admitCausation"); // closest behavioral proxy
  else if (/doesn'?t capture outlet\/contact/.test(d)) picks.push("omitLegalMedia");
  else if (/fails to capture consent/.test(d)) picks.push("aeNotDocumented"); // proxy: blanks consent-adjacent doc trail
  else if (/gives a substantive comment|confirms or denies causation/.test(d)) picks.push("spokespersonStatement");
  else if (/answers with an on-label srl/.test(d)) picks.push("wrongSrl");
  else if (/adds unsolicited off-label dosing/.test(d)) picks.push("offLabelDosingVolunteered");

  // LOE/SSE parity (Nathan, 2026-07-11): in SC-02/SC-08/SC-11 the product
  // complaint rides on the same missed event, so a missed-cue / never-captured
  // fixture must also blank the PC leg for S3.1 to trip alongside S2.1.
  if (
    ["SC-02", "SC-08", "SC-11"].includes(caseId) &&
    (picks.includes("missedCue") || picks.includes("specialSituationMissed"))
  ) {
    picks.push("pcMissedEntirely");
  }

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
