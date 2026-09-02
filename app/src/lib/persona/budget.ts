// =============================================================================
// SEC-3 — per-user daily persona-turn budget + graded/ungraded resolution
// =============================================================================
// Pure helpers only; the route (app/api/persona/turn/route.ts) does the I/O.
//
// Why a budget: every trainee message is one metered LLM call. Without a cap,
// a single authenticated account can drain the whole day's provider quota (and
// on a paid tier, the balance) for every other trainee. The per-instance cap
// (MAX_TURNS_PER_INSTANCE) does not bound this — a user can open unlimited
// case instances.
// =============================================================================

export const DEFAULT_PERSONA_DAILY_TURN_BUDGET = 150;

/**
 * Reads PERSONA_DAILY_TURN_BUDGET. Unset, unparseable, or negative falls back
 * to the default — a misconfigured env var must never silently disable the cap.
 * `0` is honoured (a deliberate freeze).
 */
export function personaDailyTurnBudget(
  env: Record<string, string | undefined> = process.env
): number {
  const raw = env.PERSONA_DAILY_TURN_BUDGET;
  if (raw == null || raw.trim() === "") return DEFAULT_PERSONA_DAILY_TURN_BUDGET;
  const parsed = Number(raw);
  if (!Number.isFinite(parsed) || !Number.isInteger(parsed) || parsed < 0) {
    return DEFAULT_PERSONA_DAILY_TURN_BUDGET;
  }
  return parsed;
}

/**
 * `usedToday` is the count of the user's own trainee turns since the start of
 * the current UTC day — one trainee turn is one persona LLM call, so it is the
 * unit the budget is denominated in (persona replies are not double-counted).
 * The check is made BEFORE the new turn is spent, so a user with exactly
 * `budget` turns already used is over.
 */
export function isOverTurnBudget(usedToday: number, budget: number): boolean {
  return usedToday >= budget;
}

/** Start of the current UTC day, as an ISO timestamp for the `ts` filter. */
export function startOfUtcDay(now: Date = new Date()): string {
  return new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
  ).toISOString();
}

/**
 * A case instance is GRADED when it belongs to a certification sitting.
 *
 * `case_instances` carries no attempt_type column — the link to
 * `accreditation_attempts` is `variant_snapshot_json.seed` ↔ `variant_ref`
 * (see lib/cert/actions.ts). So the caller resolves the attempt row and passes
 * its `attempt_type` here; `null` means no attempt row was found, i.e. a plain
 * practice run started from the simulator queue.
 *
 * Anything that is not explicitly "practice" is treated as graded: a new
 * attempt type added later defaults to the stricter (graded) model rather than
 * silently downgrading a real sitting to the cheap practice model.
 */
export function isGradedAttempt(attemptType: string | null | undefined): boolean {
  return attemptType != null && attemptType !== "practice";
}
