// =============================================================================
// DOCUMENTATION VALIDATOR — rules-based, deterministic (scoring-contract.md §7)
// =============================================================================
// SERVER-ONLY (takes ground-truth fields as input). Pre-computes the objective
// criteria and hands them to the LLM evaluator as fixed findings it must not
// contradict:
//   S4.13 required-field presence        S4.3  contact set per case type
//   S4.14 spelling count (≤2 passes)     S2.10/S3.12/S4.8 received-date match
//   S2.2/S3.2 report-timeframe arithmetic (business days)
//   S3.6  lot/expiration/NDC captured    S2.4  AE in transcript, not documented
// Everything here is pure and deterministic: same inputs → same findings.
// =============================================================================

import type {
  DocumentationFormState,
  TranscriptTurn,
} from "@/lib/simulator/types";

export type ValidatorFinding = {
  criterion: string;
  check: string;
  status: "pass" | "fail" | "na";
  evidence: string;
};

export type ValidatorGroundTruth = {
  safety?: {
    ae_present?: boolean;
    ae_description?: string;
    pc_present?: boolean;
    pc_description?: string;
  };
};

export type SpellCheckFn = (word: string) => boolean; // true = correctly spelled

export type ValidatorInput = {
  doc: DocumentationFormState;
  transcript: TranscriptTurn[];
  groundTruth: ValidatorGroundTruth;
  /** case_instances.started_at — the simulated "received" moment */
  receivedAt: string;
  sopTimeframeBusinessDays: number | null;
  /** injected spell checker; when omitted, S4.14 reports "na" */
  spellCheck?: SpellCheckFn;
};

const STOPWORDS = new Set([
  "about", "after", "along", "around", "because", "before", "being", "between",
  "could", "during", "every", "having", "hours", "later", "onset", "ongoing",
  "other", "patient", "since", "started", "starting", "their", "there", "these",
  "under", "weeks", "which", "while", "would", "approximately", "initiation",
  "possible", "known", "risk", "class", "serious", "event", "spouse", "reporter",
]);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function addBusinessDays(start: Date, days: number): Date {
  const d = new Date(start);
  let remaining = days;
  while (remaining > 0) {
    d.setDate(d.getDate() + 1);
    const dow = d.getDay();
    if (dow !== 0 && dow !== 6) remaining--;
  }
  return d;
}

function dateOnly(iso: string): string | null {
  const m = iso.match(/^(\d{4}-\d{2}-\d{2})/);
  return m ? m[1] : null;
}

function markersFrom(description: string): string[] {
  return [
    ...new Set(
      (description.toLowerCase().match(/[a-z][a-z-]{4,}/g) ?? []).filter(
        (w) => !STOPWORDS.has(w)
      )
    ),
  ];
}

const FREE_TEXT_FIELDS: [string, (d: DocumentationFormState) => string][] = [
  ["inquiry.summary", (d) => d.inquiry.summary],
  ["inquiry.verbatim_question", (d) => d.inquiry.verbatim_question],
  ["safety.ae_description", (d) => d.safety.ae_description],
  ["response.customization_notes", (d) => d.response.customization_notes],
  ["response.verbal_answer_given", (d) => d.response.verbal_answer_given],
  ["closure.outstanding_info", (d) => d.closure.outstanding_info],
];

// ---------------------------------------------------------------------------
// Validator
// ---------------------------------------------------------------------------

export function runValidator(input: ValidatorInput): ValidatorFinding[] {
  const { doc, transcript, groundTruth, receivedAt, sopTimeframeBusinessDays, spellCheck } = input;
  const findings: ValidatorFinding[] = [];
  const aeDocumented = doc.safety.ae_present === "yes";
  const pcDocumented = doc.safety.pc_present === "yes";

  // --- S4.13 required-field presence -------------------------------------
  {
    const missing: string[] = [];
    if (!doc.intake.requester_type) missing.push("requester type");
    if (!doc.intake.solicited) missing.push("solicited/unsolicited");
    if (!doc.intake.contact_channel) missing.push("contact channel");
    if (!doc.intake.product) missing.push("product");
    if (!doc.intake.inquiry_category) missing.push("inquiry category");
    if (!doc.inquiry.summary.trim()) missing.push("inquiry summary");
    if (!doc.response.selected_srl_id && !doc.response.verbal_answer_given.trim())
      missing.push("response (no SRL selected and no verbal answer)");
    if (aeDocumented) {
      if (!doc.safety.ae_description.trim()) missing.push("AE description");
      const fe = doc.safety.four_element_test;
      const feMissing = (
        [
          ["identifiable patient", fe.identifiable_patient],
          ["identifiable reporter", fe.identifiable_reporter],
          ["suspect product", fe.suspect_product],
          ["event", fe.event],
        ] as const
      )
        .filter(([, v]) => !v)
        .map(([k]) => k);
      if (feMissing.length > 0) missing.push(`four-element test (${feMissing.join(", ")})`);
      const routed =
        doc.safety.routing_single.length > 0 ||
        doc.safety.routing_dual.route_to_pv ||
        doc.safety.routing_dual.route_to_quality;
      if (!routed) missing.push("safety routing");
    }
    if (!doc.closure.qc_self_check) missing.push("QC self-check");
    findings.push({
      criterion: "S4.13",
      check: "required_fields_present",
      status: missing.length === 0 ? "pass" : "fail",
      evidence:
        missing.length === 0
          ? "All scenario-required fields completed."
          : `Missing: ${missing.join("; ")}.`,
    });
  }

  // --- S4.3 contact set per case type -------------------------------------
  {
    const c = doc.intake.contact;
    const fullSetRequired =
      aeDocumented ||
      pcDocumented ||
      doc.intake.requester_type === "hcp" ||
      doc.intake.requester_type === "pharmacist";
    const missing: string[] = [];
    if (!c.name.trim()) missing.push("name");
    if (!c.background.trim()) missing.push("background");
    if (!c.phone.trim()) missing.push("phone");
    if (fullSetRequired) {
      if (!c.street_address.trim()) missing.push("street address");
      if (!c.city.trim()) missing.push("city");
      if (!c.state.trim()) missing.push("state");
    } else if (!c.city.trim() && !c.zip.trim()) {
      missing.push("city+state or postal code");
    }
    findings.push({
      criterion: "S4.3",
      check: "contact_set_per_case_type",
      status: missing.length === 0 ? "pass" : "fail",
      evidence:
        missing.length === 0
          ? `Contact set complete for ${fullSetRequired ? "full-address" : "city/state"} case type.`
          : `Contact set (${fullSetRequired ? "full address required" : "city+state required"}) missing: ${missing.join(", ")}.`,
    });
  }

  // --- S4.14 spelling count (≤2 passes per scorecard) ----------------------
  if (spellCheck) {
    const misspelled: string[] = [];
    for (const [field, get] of FREE_TEXT_FIELDS) {
      const text = get(doc);
      for (const token of text.match(/[A-Za-z][A-Za-z'-]{2,}/g) ?? []) {
        // Skip capitalized tokens (proper nouns / sentence starts) and short
        // acronyms — deterministic false-positive control, documented choice.
        if (/^[A-Z]/.test(token)) continue;
        if (!spellCheck(token)) misspelled.push(`${token} (${field})`);
      }
    }
    findings.push({
      criterion: "S4.14",
      check: "spelling_count",
      status: misspelled.length <= 2 ? "pass" : "fail",
      evidence:
        misspelled.length === 0
          ? "No spelling errors detected."
          : `${misspelled.length} possible misspelling(s): ${misspelled.slice(0, 10).join(", ")}.`,
    });
  } else {
    findings.push({
      criterion: "S4.14",
      check: "spelling_count",
      status: "na",
      evidence: "Spell checker unavailable in this environment.",
    });
  }

  // --- S2.10 / S3.12 / S4.8 received-date match ----------------------------
  {
    const documented = doc.intake.received_date?.trim() ?? "";
    const actual = dateOnly(receivedAt);
    if (!actual) {
      findings.push({
        criterion: "S4.8",
        check: "received_date_match",
        status: "na",
        evidence: "Instance has no started_at timestamp.",
      });
    } else {
      const match = documented === actual;
      findings.push({
        criterion: "S4.8",
        check: "received_date_match",
        status: match ? "pass" : "fail",
        evidence: match
          ? `Received date ${documented} matches case receipt ${actual}.`
          : `Documented received date "${documented || "(empty)"}" ≠ case receipt date ${actual}.`,
      });
    }
  }

  // --- S2.2 / S3.2 timeframe arithmetic ------------------------------------
  {
    const applicable = (aeDocumented || pcDocumented) && sopTimeframeBusinessDays != null;
    if (!applicable) {
      findings.push({
        criterion: "S2.2/S3.2",
        check: "report_timeframe",
        status: "na",
        evidence: "No AE/PC documented or no SOP timeframe for this case.",
      });
    } else {
      const routedDateStr = doc.safety.routed_within_timeframe_date.trim();
      const received = new Date(receivedAt);
      const deadline = addBusinessDays(received, sopTimeframeBusinessDays);
      if (!routedDateStr) {
        findings.push({
          criterion: "S2.2/S3.2",
          check: "report_timeframe",
          status: "fail",
          evidence: "No routing date documented for a case with a reportable safety finding.",
        });
      } else {
        const routed = new Date(`${routedDateStr}T00:00:00`);
        const ok = routed.getTime() <= deadline.getTime();
        findings.push({
          criterion: "S2.2/S3.2",
          check: "report_timeframe",
          status: ok ? "pass" : "fail",
          evidence: ok
            ? `Routed ${routedDateStr}, within ${sopTimeframeBusinessDays} business day(s) of receipt (deadline ${deadline.toISOString().slice(0, 10)}).`
            : `Routed ${routedDateStr}, after the ${sopTimeframeBusinessDays}-business-day deadline (${deadline.toISOString().slice(0, 10)}).`,
        });
      }
    }
  }

  // --- S3.6 lot / expiration / NDC ----------------------------------------
  {
    if (!pcDocumented) {
      findings.push({
        criterion: "S3.6",
        check: "pc_identifiers",
        status: "na",
        evidence: "No product complaint documented.",
      });
    } else {
      const missing: string[] = [];
      if (!doc.safety.pc_lot_number.trim()) missing.push("lot number");
      if (!doc.safety.pc_expiration_date.trim()) missing.push("expiration date");
      if (!doc.safety.pc_ndc.trim()) missing.push("NDC");
      findings.push({
        criterion: "S3.6",
        check: "pc_identifiers",
        status: missing.length === 0 ? "pass" : "fail",
        evidence:
          missing.length === 0
            ? "Lot, expiration, and NDC captured."
            : `PC documented without: ${missing.join(", ")}.`,
      });
    }
  }

  // --- S2.4 AE in transcript but not documented ----------------------------
  {
    const gtAe = groundTruth.safety?.ae_present === true;
    const desc = groundTruth.safety?.ae_description ?? "";
    if (!gtAe || !desc) {
      findings.push({
        criterion: "S2.4",
        check: "ae_transcript_vs_documentation",
        status: "na",
        evidence: "Case has no ground-truth AE.",
      });
    } else {
      const markers = markersFrom(desc);
      const personaText = transcript
        .filter((t) => t.speaker === "persona")
        .map((t) => t.content.toLowerCase())
        .join(" ");
      const hits = markers.filter((m) => personaText.includes(m));
      const surfacedInTranscript = hits.length >= 2;
      if (!surfacedInTranscript) {
        findings.push({
          criterion: "S2.4",
          check: "ae_transcript_vs_documentation",
          status: "na",
          evidence: "AE details never surfaced in the transcript (cue not clarified).",
        });
      } else {
        findings.push({
          criterion: "S2.4",
          check: "ae_transcript_vs_documentation",
          status: aeDocumented ? "pass" : "fail",
          evidence: aeDocumented
            ? `AE surfaced in call (markers: ${hits.slice(0, 4).join(", ")}) and documented in Safety tab.`
            : `AE surfaced in call (persona mentioned: ${hits.slice(0, 4).join(", ")}) but Safety tab has ae_present="${doc.safety.ae_present || "(empty)"}".`,
        });
      }
    }
  }

  return findings;
}
