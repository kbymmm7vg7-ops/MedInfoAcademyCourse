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

// SEC-7 (decided 2026-07-07): a certification sitting not submitted within
// 24h of start is VOIDED — not a first attempt, no burn, template returns to
// the eligible pool. Enforced lazily at the eligibility read (no cron).
export const CERT_SITTING_EXPIRY_HOURS = 24;

export type AttemptRow = {
  case_template_id: string | null;
  attempt_type: "practice" | "certification";
  is_first_attempt_on_case: boolean;
  pass_bool: boolean | null; // null = not yet evaluated
  variant_ref: string | null;
  completed_at: string | null;
  /** sitting start (row creation); used for the 24h expiry window */
  created_at?: string | null;
  /** set when the sitting was voided (SEC-7); voided rows never count for cert state */
  voided_at?: string | null;
};

/**
 * A certification sitting that was started, never submitted, and is past the
 * 24h window. Such rows should be voided (voided_at persisted) on the next
 * eligibility read; until then every state function here already treats them
 * as void so a stale row can never block or burn a template.
 */
export function isExpiredPendingSitting(a: AttemptRow, nowIso: string): boolean {
  if (a.voided_at != null) return false; // already voided, nothing to do
  if (a.attempt_type !== "certification") return false;
  if (a.completed_at != null || a.pass_bool != null) return false;
  if (!a.created_at) return false;
  const ageMs = Date.parse(nowIso) - Date.parse(a.created_at);
  return ageMs > CERT_SITTING_EXPIRY_HOURS * 60 * 60 * 1000;
}

/** Void = explicitly voided, or expired-pending awaiting its lazy void write. */
export function isVoidSitting(a: AttemptRow, nowIso: string): boolean {
  return a.voided_at != null || isExpiredPendingSitting(a, nowIso);
}

/** Attempts that count for cert state (voided/expired sittings removed). */
export function liveAttempts(attempts: AttemptRow[], nowIso: string): AttemptRow[] {
  return attempts.filter((a) => !isVoidSitting(a, nowIso));
}

export type TemplateCertState =
  | "available"        // no certification attempt yet — can be a first-try gate
  | "pending"          // first cert attempt submitted, not yet scored
  | "passed_first_try" // counts toward the 3
  | "burned";          // first cert attempt failed — never retryable for cert

export function templateCertState(
  attempts: AttemptRow[],
  templateId: string,
  nowIso: string = new Date().toISOString()
): TemplateCertState {
  // Voided/expired sittings are invisible here: the template stays available.
  const certAttempts = liveAttempts(attempts, nowIso).filter(
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

export function certProgress(
  attempts: AttemptRow[],
  nowIso: string = new Date().toISOString()
): CertProgress {
  const live = liveAttempts(attempts, nowIso);
  const byTemplate = new Map<string, AttemptRow[]>();
  for (const a of live) {
    if (a.attempt_type !== "certification" || !a.case_template_id) continue;
    const list = byTemplate.get(a.case_template_id) ?? [];
    list.push(a);
    byTemplate.set(a.case_template_id, list);
  }
  const passed: string[] = [];
  const burned: string[] = [];
  const pending: string[] = [];
  for (const [templateId] of byTemplate) {
    const state = templateCertState(live, templateId, nowIso);
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
  templateId: string,
  nowIso: string = new Date().toISOString()
): { ok: boolean; reason?: string } {
  const progress = certProgress(attempts, nowIso);
  if (progress.locked) return { ok: false, reason: "Certification already earned and locked." };
  const state = templateCertState(attempts, templateId, nowIso);
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

/**
 * Ordinal for the deterministic variant seed: 1 + count of this user's prior
 * sittings on the template (practice + certification both consume surface
 * variants). Voided sittings STILL count — a re-sit after an expiry must get
 * a fresh variant, never a replay of the one the trainee already saw.
 */
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
  const progress = certProgress(attempts, now);
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
