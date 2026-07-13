import { describe, it, expect, beforeAll } from "vitest";
import { runValidator, type ValidatorInput, type SpellCheckFn } from "./validator";
import { getSpellChecker } from "./spelling";
import { emptyFormState, type DocumentationFormState } from "@/lib/simulator/types";

let spellCheck: SpellCheckFn;
beforeAll(async () => {
  spellCheck = await getSpellChecker();
});

// SC-03 shaped fixture: caregiver call, embedded AE (tremor/palpitations)
const RECEIVED_AT = "2026-07-06T14:00:00Z"; // a Monday

function goldDoc(): DocumentationFormState {
  const d = emptyFormState({});
  d.intake = {
    requester_type: "caregiver",
    solicited: "unsolicited",
    contact_channel: "phone",
    received_date: "2026-07-06",
    product: "Pulmonara",
    inquiry_category: "Other",
    contact: {
      name: "Pat Morgan",
      background: "Caregiver (spouse of patient Dale Morgan)",
      phone: "(555) 0134-8827",
      street_address: "412 Larkspur Lane, Apt 3",
      city: "Cedar Falls",
      state: "IA",
      zip: "50613",
    },
  };
  d.inquiry.summary = "Caregiver asks whether the patient should rinse his mouth after using the inhaler.";
  d.inquiry.verbatim_question = "Is he supposed to rinse his mouth after using it?";
  d.safety.ae_present = "yes";
  d.safety.ae_description = "Tremor and palpitations, onset about one week after starting Pulmonara, ongoing.";
  d.safety.patient_initials = "DM";
  d.safety.hcp_followup_consent = "yes";
  d.closure.routing_single = ["PV"];
  d.response.selected_srl_id = "some-uuid";
  d.response.verbal_answer_given = "Advised rinsing the mouth with water after each use.";
  d.closure.qc_self_check = true;
  return d;
}

const GT = {
  safety: {
    ae_present: true,
    ae_description: "Tremor and palpitations, onset ~1 week after Pulmonara initiation, ongoing.",
  },
};

const SURFACED_TRANSCRIPT = [
  { speaker: "persona" as const, content: "He's been a bit shaky lately, but that's probably the coffee." },
  { speaker: "trainee" as const, content: "Tell me more about the shakiness — when did it start?" },
  { speaker: "persona" as const, content: "The tremor started about a week after the new inhaler, and his heart races — palpitations, the nurse called it. Still happening." },
];

function base(overrides?: Partial<ValidatorInput>): ValidatorInput {
  return {
    doc: goldDoc(),
    transcript: SURFACED_TRANSCRIPT,
    groundTruth: GT,
    receivedAt: RECEIVED_AT,
    submittedAt: RECEIVED_AT,
    sopTimeframeBusinessDays: 1,
    spellCheck,
    ...overrides,
  };
}

const byCriterion = (findings: ReturnType<typeof runValidator>, c: string) =>
  findings.find((f) => f.criterion === c)!;

describe("documentation validator", () => {
  it("passes a gold documentation record on every check", () => {
    const findings = runValidator(base());
    for (const f of findings) {
      expect(f.status, `${f.criterion}: ${f.evidence}`).not.toBe("fail");
    }
  });

  it("is deterministic (same input, same findings)", () => {
    expect(runValidator(base())).toEqual(runValidator(base()));
  });

  it("S4.13 fails when required fields are missing", () => {
    const doc = goldDoc();
    doc.intake.inquiry_category = "";
    doc.inquiry.summary = "";
    const f = byCriterion(runValidator(base({ doc })), "S4.13");
    expect(f.status).toBe("fail");
    expect(f.evidence).toContain("inquiry category");
    expect(f.evidence).toContain("inquiry summary");
  });

  it("S4.13 fails when AE documented without routing recorded on closure", () => {
    const doc = goldDoc();
    doc.closure.routing_single = [];
    doc.closure.routing_dual = { route_to_pv: false, route_to_quality: false };
    const f = byCriterion(runValidator(base({ doc })), "S4.13");
    expect(f.status).toBe("fail");
    expect(f.evidence).toContain("safety routing");
  });

  it("S4.3 requires the full address set when an AE is documented", () => {
    const doc = goldDoc();
    doc.intake.contact.street_address = "";
    const f = byCriterion(runValidator(base({ doc })), "S4.3");
    expect(f.status).toBe("fail");
    expect(f.evidence).toContain("street address");
  });

  it("S4.3 accepts city+state for a patient case without AE/PC", () => {
    const doc = goldDoc();
    doc.intake.requester_type = "patient";
    doc.safety.ae_present = "no";
    doc.safety.ae_description = "";
    doc.closure.routing_single = [];
    doc.intake.contact.street_address = "";
    const f = byCriterion(runValidator(base({ doc })), "S4.3");
    expect(f.status).toBe("pass");
  });

  it("S4.3 accepts city+state for a PATIENT reporting an AE (SC-04/SC-08 shape)", () => {
    // Patients get the city+state allowance even when an AE is documented —
    // the approved seeds SC-04 & SC-08 have city+state-only patient contacts.
    const doc = goldDoc();
    doc.intake.requester_type = "patient";
    doc.intake.contact.street_address = ""; // patient gave city+state only
    const f = byCriterion(runValidator(base({ doc })), "S4.3"); // AE still documented
    expect(f.status).toBe("pass");
  });

  it("S4.14 does not flag common hyphenated domain compounds", () => {
    const doc = goldDoc();
    doc.inquiry.summary =
      "Off-label take-back question about creatinine-clearance and co-administered meds.";
    const f = byCriterion(runValidator(base({ doc })), "S4.14");
    expect(f.status, f.evidence).toBe("pass");
  });

  it("S4.14 still catches a genuinely misspelled hyphen component", () => {
    const doc = goldDoc();
    doc.inquiry.summary = "the wrongg-word and anotherr-thingg and thirdd-oops here"; // 3 bad parts
    const f = byCriterion(runValidator(base({ doc })), "S4.14");
    expect(f.status).toBe("fail");
  });

  it("S4.14 tolerates ≤2 misspellings and fails on 3+", () => {
    const doc = goldDoc();
    doc.inquiry.summary = "the pateint has an inhaller and a palpitaton problem"; // 3 misspellings
    const f = byCriterion(runValidator(base({ doc })), "S4.14");
    expect(f.status).toBe("fail");

    const doc2 = goldDoc();
    doc2.inquiry.summary = "the pateint asked about rinsing"; // 1 misspelling
    const f2 = byCriterion(runValidator(base({ doc: doc2 })), "S4.14");
    expect(f2.status).toBe("pass");
  });

  it("S4.8 fails on a received-date mismatch", () => {
    const doc = goldDoc();
    doc.intake.received_date = "2026-07-05";
    const f = byCriterion(runValidator(base({ doc })), "S4.8");
    expect(f.status).toBe("fail");
  });

  it("S2.2/S3.2 business-day arithmetic: Friday receipt allows Monday submission", () => {
    const doc = goldDoc();
    doc.intake.received_date = "2026-07-10";
    const f = byCriterion(
      runValidator(
        base({
          doc,
          receivedAt: "2026-07-10T15:00:00Z",
          submittedAt: "2026-07-13T09:00:00Z", // Mon after Fri = 1 business day
        })
      ),
      "S2.2/S3.2"
    );
    expect(f.status).toBe("pass");
  });

  it("S2.2/S3.2 fails when submitted after the deadline", () => {
    const f = byCriterion(
      runValidator(base({ submittedAt: "2026-07-10T09:00:00Z" })), // 3 business days later
      "S2.2/S3.2"
    );
    expect(f.status).toBe("fail");
  });

  it("S3.6 fails when PC documented without lot/expiry/NDC", () => {
    const doc = goldDoc();
    doc.safety.pc_present = "yes";
    const f = byCriterion(runValidator(base({ doc })), "S3.6");
    expect(f.status).toBe("fail");
    expect(f.evidence).toContain("lot number");
  });

  it("S2.4 fails when the AE surfaced in the call but is absent from documentation", () => {
    const doc = goldDoc();
    doc.safety.ae_present = "no";
    const f = byCriterion(runValidator(base({ doc })), "S2.4");
    expect(f.status).toBe("fail");
    expect(f.evidence).toContain("Safety tab");
  });

  it("S2.4 is N/A when the cue was never clarified (AE never surfaced)", () => {
    const transcript = [
      { speaker: "persona" as const, content: "He's been a bit shaky lately, but that's probably the coffee." },
      { speaker: "trainee" as const, content: "Understood. For the rinse question, yes — rinse after each use." },
    ];
    const doc = goldDoc();
    doc.safety.ae_present = "no";
    const f = byCriterion(runValidator(base({ doc, transcript })), "S2.4");
    expect(f.status).toBe("na");
  });
});
