// Service-role client for server-only writes that RLS intentionally denies to
// authenticated users (evaluation_scores, certification_locks, attempt
// pass_bool). NEVER import from client components; the key must never carry a
// NEXT_PUBLIC prefix.
import { createClient as createSupabaseClient, type SupabaseClient } from "@supabase/supabase-js";

export function createAdminClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is not set — the evaluator needs it to persist scores (see BLOCKERS.md)."
    );
  }
  return createSupabaseClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
