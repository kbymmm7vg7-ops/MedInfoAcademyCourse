// =============================================================================
// CERTIFICATION FIRST-ATTEMPT / BURN / LOCK LOGIC — pure functions
// (08-accreditation-cert/spec_certification-logic.md)
// =============================================================================
// - Certification = 3 distinct seed templates, each passed on the FIRST
//   certification attempt.
// - Fail a first certification attempt on template S → S is burned for this
//   user's certification track forever. Practice on S stays unlimited and
//   irrelevant.
// - 3rd first-try pass → immediate immutable lock + evidence packet.
// All burn/lock/eligibility state derives from accreditation_attempts rows so
// there is exactly one source of truth; these functions are pure so the spec's
// behaviors are unit-testable without a database.
// =============================================================================

export const CERT_PASSES_REQUIRED = 3;

export type AttemptRow = {
  case_template_id: string | null;
  attempt_type: "practice" | "certification";
  is_first_attempt_on_case: boolean;
  pass_bool: boolean | null; // null = not yet evaluated
  variant_ref: string | null;
  completed_at: string | null;
};

export type TemplateCertState =
  | "available"        // no certification attempt yet — can be a first-try gate
  | "pending"          // first cert attempt submitted, not yet scored
  | "passed_first_try" // counts toward the 3
  | "burned";          // first cert attempt failed — never retryable for cert

export function templateCertState(
  attempts: AttemptRow[],
  templateId: string
): TemplateCertState {
  const certAttempts = attempts.filter(
    (a) => a.attempt_type === "certification" && a.case_template_id === templateId
  );
  if (certAttempts.length === 0) return "available";
  const first = certAttempts.find((a) => a.is_first_attempt_on_case) ?? certAttempts[0];
  if (first.pass_bool === null) return "pending";
  return first.pass_bool ? "passed_first_try" : "burned";
}

export type CertProgress = {
  passedTemplateIds: string[];
  burnedTemplateIds: string[];
  pendingTemplateIds: string[];
  passesRemaining: number;
  locked: boolean;
};

export function certProgress(attempts: AttemptRow[]): CertProgress {
  const byTemplate = new Map<string, AttemptRow[]>();
  for (const a of attempts) {
    if (a.attempt_type !== "certification" || !a.case_template_id) continue;
    const list = byTemplate.get(a.case_template_id) ?? [];
    list.push(a);
    byTemplate.set(a.case_template_id, list);
  }
  const passed: string[] = [];
  const burned: string[] = [];
  const pending: string[] = [];
  for (const [templateId] of byTemplate) {
    const state = templateCertState(attempts, templateId);
    if (state === "passed_first_try") passed.push(templateId);
    else if (state === "burned") burned.push(templateId);
    else if (state === "pending") pending.push(templateId);
  }
  return {
    passedTemplateIds: passed.sort(),
    burnedTemplateIds: burned.sort(),
    pendingTemplateIds: pending.sort(),
    passesRemaining: Math.max(0, CERT_PASSES_REQUIRED - passed.length),
    locked: passed.length >= CERT_PASSES_REQUIRED,
  };
}

/** May the user open a NEW certification sitting on this template? */
export function canStartCertAttempt(
  attempts: AttemptRow[],
  templateId: string
): { ok: boolean; reason?: string } {
  const progress = certProgress(attempts);
  if (progress.locked) return { ok: false, reason: "Certification already earned and locked." };
  const state = templateCertState(attempts, templateId);
  switch (state) {
    case "available":
      return { ok: true };
    case "pending":
      return { ok: false, reason: "This case's first certification attempt is awaiting evaluation." };
    case "passed_first_try":
      return { ok: false, reason: "Already passed — pick a different case for your next credit." };
    case "burned":
      return {
        ok: false,
        reason: "This case was failed on its first certification attempt and is burned for certification. Choose a different case (practice on it remains unlimited).",
      };
  }
}

/** Ordinal for the deterministic variant seed: 1 + count of this user's prior sittings on the template (practice + certification both consume surface variants). */
export function nextVariantOrdinal(attempts: AttemptRow[], templateId: string): number {
  return 1 + attempts.filter((a) => a.case_template_id === templateId).length;
}

export type EvidencePacket = {
  generated_at: string;
  rubric_version: string;
  passes: {
    template_id: string;
    variant_ref: string | null;
    completed_at: string | null;
  }[];
};

/** Built exactly once, at the moment of the 3rd first-try pass. */
export function buildEvidencePacket(
  attempts: AttemptRow[],
  rubricVersion: string,
  now: string
): EvidencePacket | null {
  const progress = certProgress(attempts);
  if (!progress.locked) return null;
  const passes = progress.passedTemplateIds.map((templateId) => {
    const first = attempts.find(
      (a) =>
        a.attempt_type === "certification" &&
        a.case_template_id === templateId &&
        a.is_first_attempt_on_case &&
        a.pass_bool === true
    )!;
    return {
      template_id: templateId,
      variant_ref: first.variant_ref,
      completed_at: first.completed_at,
    };
  });
  return { generated_at: now, rubric_version: rubricVersion, passes };
}
