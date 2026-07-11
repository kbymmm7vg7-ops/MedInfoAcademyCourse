// Pure authorization matrix for user.deactivate / user.reactivate
// (BLOCKERS 2026-07-10 item ①). Kept out of user-actions.ts because "use
// server" modules may only export async functions, and this needs plain
// unit tests (see user-deactivation.test.ts).
//
// This mirrors — and is checked ahead of — the DB-level guard added in
// 0010_user_deactivation.sql (the extended prevent_privilege_escalation
// trigger). Checking here first gives the caller a clean error message
// instead of an opaque RLS/trigger rejection; the DB trigger remains the
// real backstop against a bug here.
import type { AppRole } from "@/lib/auth/get-user-role";

export type DeactivationActor = {
  id: string;
  role: AppRole;
  orgId: string | null;
};

export type DeactivationTarget = {
  id: string;
  orgId: string | null;
};

/**
 * - Nobody may change their own active status — platform_admin included.
 * - platform_admin may change anyone else's.
 * - org admin (`role === "admin"`) may change users within their own org
 *   only; an admin with no org (should not happen, but defensively
 *   handled) can change nobody.
 * - trainee/trainer/qa may never change anyone's active status.
 */
export function canChangeActiveStatus(
  actor: DeactivationActor,
  target: DeactivationTarget
): boolean {
  if (actor.id === target.id) return false;
  if (actor.role === "platform_admin") return true;
  if (actor.role === "admin") {
    return actor.orgId !== null && actor.orgId === target.orgId;
  }
  return false;
}
