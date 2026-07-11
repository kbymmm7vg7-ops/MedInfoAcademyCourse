// Pure decision logic for the deactivation gate (BLOCKERS 2026-07-10 item ①),
// kept separate from any Supabase/Next glue so it is directly unit-testable
// (see deactivation.test.ts). The DB read + redirect/response wiring lives in
// src/lib/supabase/proxy.ts (middleware), src/app/(app)/layout.tsx, and any
// API route that needs an active-session guard (e.g.
// src/app/api/persona/turn/route.ts).
import type { SupabaseClient } from "@supabase/supabase-js";

export const DEACTIVATED_MESSAGE =
  "This account has been deactivated. Contact your organization administrator.";

/** True when a `users.deactivated_at` value marks the account as blocked. */
export function isDeactivated(deactivatedAt: string | null | undefined): boolean {
  return deactivatedAt != null;
}

/**
 * Reads the current value of `users.deactivated_at` for a given user id.
 * Any read failure (missing row, RLS rejection, network error) is treated
 * as "not deactivated" — the same fail-safe posture as getUserRole(), since
 * this must never be the reason a legitimate user gets locked out.
 */
export async function fetchDeactivatedAt(
  supabase: SupabaseClient,
  userId: string
): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("deactivated_at")
      .eq("id", userId)
      .maybeSingle<{ deactivated_at: string | null }>();
    if (error || !data) return null;
    return data.deactivated_at;
  } catch {
    return null;
  }
}
