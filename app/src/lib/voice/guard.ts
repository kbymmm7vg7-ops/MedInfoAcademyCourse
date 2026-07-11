import type { SupabaseClient } from "@supabase/supabase-js";
import { isDeactivated, fetchDeactivatedAt, DEACTIVATED_MESSAGE } from "@/lib/auth/deactivation";

// Shared auth/ownership guard for the voice routes — same posture as
// /api/persona/turn: authenticated, not deactivated, owns an active instance.
export type VoiceGuardResult =
  | { ok: true; userId: string }
  | { ok: false; status: number; error: string };

export async function authorizeVoiceRequest(
  supabase: SupabaseClient,
  instanceId: string | null
): Promise<VoiceGuardResult> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, status: 401, error: "Not authenticated" };

  if (isDeactivated(await fetchDeactivatedAt(supabase, user.id))) {
    return { ok: false, status: 403, error: DEACTIVATED_MESSAGE };
  }

  if (!instanceId) return { ok: false, status: 400, error: "instanceId is required" };

  const { data: instance } = await supabase
    .from("case_instances")
    .select("id, user_id, status")
    .eq("id", instanceId)
    .maybeSingle<{ id: string; user_id: string; status: string }>();

  if (!instance || instance.user_id !== user.id) {
    return { ok: false, status: 404, error: "Case not found" };
  }
  if (instance.status !== "in_progress" && instance.status !== "documenting") {
    return { ok: false, status: 409, error: "Case is not active" };
  }
  return { ok: true, userId: user.id };
}
