import { describe, it, expect } from "vitest";
import { generateVariant, variantSeed, seededShuffle } from "./variant-engine";
import {
  certProgress,
  templateCertState,
  canStartCertAttempt,
  nextVariantOrdinal,
  buildEvidencePacket,
  type AttemptRow,
} from "./logic";

const U = "user-1";
const T1 = "tpl-1", T2 = "tpl-2", T3 = "tpl-3", T4 = "tpl-4";

function attempt(over: Partial<AttemptRow>): AttemptRow {
  return {
    case_template_id: T1,
    attempt_type: "certification",
    is_first_attempt_on_case: true,
    pass_bool: true,
    variant_ref: "v1",
    completed_at: "2026-07-07T00:00:00Z",
    ...over,
  };
}

describe("variant engine (spec: determinism + fresh surface)", () => {
  it("same (user, template, ordinal) regenerates the identical variant", () => {
    const a = generateVariant({ userId: U, templateId: T1, ordinal: 1, requesterType: "patient", closedBook: true });
    const b = generateVariant({ userId: U, templateId: T1, ordinal: 1, requesterType: "patient", closedBook: true });
    expect(a).toEqual(b);
  });

  it("different ordinal or user yields a different surface", () => {
    const base = generateVariant({ userId: U, templateId: T1, ordinal: 1, requesterType: "patient", closedBook: true });
    const nextSitting = generateVariant({ userId: U, templateId: T1, ordinal: 2, requesterType: "patient", closedBook: true });
    const otherUser = generateVariant({ userId: "user-2", templateId: T1, ordinal: 1, requesterType: "patient", closedBook: true });
    expect(nextSitting.seed).not.toBe(base.seed);
    expect(otherUser.seed).not.toBe(base.seed);
    expect(
      nextSitting.contact.name !== base.contact.name ||
        nextSitting.contact.phone !== base.contact.phone ||
        nextSitting.style_directive !== base.style_directive
    ).toBe(true);
  });

  it("practice-then-certify plays a different surface (ordinal advances)", () => {
    const attempts: AttemptRow[] = [
      attempt({ attempt_type: "practice", is_first_attempt_on_case: false, pass_bool: null }),
      attempt({ attempt_type: "practice", is_first_attempt_on_case: false, pass_bool: null }),
    ];
    const certOrdinal = nextVariantOrdinal(attempts, T1);
    expect(certOrdinal).toBe(3);
    const practiceVariant = generateVariant({ userId: U, templateId: T1, ordinal: 1, closedBook: false });
    const certVariant = generateVariant({ userId: U, templateId: T1, ordinal: certOrdinal, closedBook: true });
    expect(certVariant.seed).not.toBe(practiceVariant.seed);
  });

  it("variant is a surface overlay only (no answer-key fields present)", () => {
    const v = generateVariant({ userId: U, templateId: T1, ordinal: 1, requesterType: "hcp", closedBook: true });
    expect(Object.keys(v).sort()).toEqual(
      ["closed_book", "contact", "decoy_order_seed", "ordinal", "seed", "style_directive", "version"].sort()
    );
    expect(v.contact.street_address).not.toBe(""); // full address for HCP
    expect(v.contact.zip).toMatch(/^\d{5}$/);
    const patient = generateVariant({ userId: U, templateId: T1, ordinal: 1, requesterType: "patient", closedBook: true });
    expect(patient.contact.street_address).toBe(""); // city+state only
    expect(patient.contact.city).not.toBe("");
  });

  it("seeded shuffle is deterministic", () => {
    const arr = ["a", "b", "c", "d", "e"];
    expect(seededShuffle(arr, 42)).toEqual(seededShuffle(arr, 42));
    expect(variantSeed(U, T1, 1)).toBe(variantSeed(U, T1, 1));
  });
});

describe("first-attempt / burn / lock (spec tests)", () => {
  it("fail first cert attempt on S → S burned; a different template is available", () => {
    const attempts = [attempt({ case_template_id: T1, pass_bool: false })];
    expect(templateCertState(attempts, T1)).toBe("burned");
    expect(canStartCertAttempt(attempts, T1).ok).toBe(false);
    expect(canStartCertAttempt(attempts, T1).reason).toContain("burned");
    expect(canStartCertAttempt(attempts, T2).ok).toBe(true);
  });

  it("practice attempts never burn or gate the certification track", () => {
    const attempts = [
      attempt({ attempt_type: "practice", is_first_attempt_on_case: false, pass_bool: false }),
      attempt({ attempt_type: "practice", is_first_attempt_on_case: false, pass_bool: null }),
    ];
    expect(templateCertState(attempts, T1)).toBe("available");
    expect(canStartCertAttempt(attempts, T1).ok).toBe(true);
    expect(certProgress(attempts).passedTemplateIds).toEqual([]);
  });

  it("pending first attempt blocks a re-sit without burning", () => {
    const attempts = [attempt({ pass_bool: null })];
    expect(templateCertState(attempts, T1)).toBe("pending");
    const gate = canStartCertAttempt(attempts, T1);
    expect(gate.ok).toBe(false);
    expect(gate.reason).toContain("awaiting evaluation");
  });

  it("3rd first-try pass locks certification; evidence packet lists the 3 passes", () => {
    const attempts = [
      attempt({ case_template_id: T1, variant_ref: "v-t1" }),
      attempt({ case_template_id: T2, variant_ref: "v-t2" }),
      attempt({ case_template_id: T3, variant_ref: "v-t3" }),
    ];
    const progress = certProgress(attempts);
    expect(progress.locked).toBe(true);
    expect(progress.passesRemaining).toBe(0);
    const packet = buildEvidencePacket(attempts, "rubric-v1", "2026-07-07T12:00:00Z");
    expect(packet).not.toBeNull();
    expect(packet!.passes.map((p) => p.variant_ref).sort()).toEqual(["v-t1", "v-t2", "v-t3"]);
    expect(packet!.rubric_version).toBe("rubric-v1");
    // a further cert sitting anywhere is refused once locked
    expect(canStartCertAttempt(attempts, T4).ok).toBe(false);
  });

  it("later practice attempts do not mutate lock state or progress", () => {
    const locked = [
      attempt({ case_template_id: T1 }),
      attempt({ case_template_id: T2 }),
      attempt({ case_template_id: T3 }),
    ];
    const withPractice = [
      ...locked,
      attempt({ case_template_id: T1, attempt_type: "practice", is_first_attempt_on_case: false, pass_bool: false }),
    ];
    expect(certProgress(withPractice)).toEqual(certProgress(locked));
  });

  it("two passes is not a lock; evidence packet refuses to build early", () => {
    const attempts = [attempt({ case_template_id: T1 }), attempt({ case_template_id: T2 })];
    expect(certProgress(attempts).locked).toBe(false);
    expect(buildEvidencePacket(attempts, "rubric-v1", "now")).toBeNull();
  });
});
