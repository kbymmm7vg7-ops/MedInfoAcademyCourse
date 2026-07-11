"use server";

// =============================================================================
// ADMIN USER/ROSTER MANAGEMENT (spec_admin-dashboard.md §4.4)
//
// Org admin: sees + edits their own org's roster (RLS partitions the read
// automatically via the users_select policy). Platform_admin: sees every
// org, with an org column in the UI.
//
// Role changes ONLY ever offer trainee|trainer|qa — admin/platform_admin are
// never assignable from this screen. The users_no_self_escalation DB trigger
// (0002_rls_policies.sql, prevent_privilege_escalation) is the real backstop
// against privilege escalation; this file additionally never offers the
// dangerous roles in the first place.
//
// SEC-6: role changes go through the RLS-scoped client (lib/supabase/server),
// never the service client — service-role writes run with auth.uid() IS NULL,
// which the trigger explicitly exempts (service context), so a role change
// made with the admin client would bypass the escalation guard entirely.
// =============================================================================

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getUserRole, type AppRole } from "@/lib/auth/get-user-role";
import { writeAuditLog } from "@/lib/audit/log";
import { canChangeActiveStatus } from "@/lib/admin/user-deactivation";

export type RosterRole = "trainee" | "trainer" | "qa";
const ASSIGNABLE_ROLES: readonly RosterRole[] = ["trainee", "trainer", "qa"];

export type RosterUser = {
  id: string;
  fullName: string | null;
  email: string | null;
  role: string;
  orgId: string | null;
  orgName: string | null;
  createdAt: string;
  deactivatedAt: string | null;
};

export type ListUsersResult =
  | { ok: true; viewerRole: "admin" | "platform_admin"; viewerId: string; users: RosterUser[] }
  | { ok: false; error: string };

type UserRow = {
  id: string;
  full_name: string | null;
  email: string | null;
  role: string;
  org_id: string | null;
  created_at: string;
  deactivated_at: string | null;
  organizations: { name: string } | null;
};

/**
 * Loads the roster this admin can see. No manual org filter is applied — the
 * users_select RLS policy already partitions: org admin gets their own org's
 * rows (plus their own row), platform_admin gets everything.
 */
export async function listUsers(): Promise<ListUsersResult> {
  const role = await getUserRole();
  if (role !== "admin" && role !== "platform_admin") {
    return { ok: false, error: "Not authorized." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { ok: false, error: "Not authenticated." };
  }

  const { data, error } = await supabase
    .from("users")
    .select("id, full_name, email, role, org_id, created_at, deactivated_at, organizations(name)")
    .order("created_at", { ascending: false })
    .returns<UserRow[]>();

  if (error) {
    return { ok: false, error: error.message };
  }

  const users: RosterUser[] = (data ?? []).map((u) => ({
    id: u.id,
    fullName: u.full_name,
    email: u.email,
    role: u.role,
    orgId: u.org_id,
    orgName: u.organizations?.name ?? null,
    createdAt: u.created_at,
    deactivatedAt: u.deactivated_at,
  }));

  return { ok: true, viewerRole: role, viewerId: user.id, users };
}

export type UpdateRoleResult = { ok: true } | { ok: false; error: string };

/**
 * Assigns trainee|trainer|qa to a user. Authorization is RLS + the
 * escalation trigger: this function only shapes the input (rejects any
 * role outside the assignable set) and surfaces a clean error instead of
 * an opaque RLS rejection.
 */
export async function updateUserRole(userId: string, newRole: string): Promise<UpdateRoleResult> {
  const role = await getUserRole();
  if (role !== "admin" && role !== "platform_admin") {
    return { ok: false, error: "Not authorized." };
  }
  if (!ASSIGNABLE_ROLES.includes(newRole as RosterRole)) {
    return { ok: false, error: "Role must be one of trainee, trainer, qa." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { ok: false, error: "Not authenticated." };
  }

  const { data: updated, error } = await supabase
    .from("users")
    .update({ role: newRole })
    .eq("id", userId)
    .select("id, org_id")
    .maybeSingle<{ id: string; org_id: string | null }>();

  if (error) {
    return { ok: false, error: error.message };
  }
  if (!updated) {
    return { ok: false, error: "User not found, or you are not authorized to change this user." };
  }

  await writeAuditLog({
    actorId: user.id,
    orgId: updated.org_id,
    action: "user.role.change",
    targetType: "users",
    targetId: updated.id,
  });

  revalidatePath("/admin/users");
  return { ok: true };
}

export type SetActiveStatusResult = { ok: true } | { ok: false; error: string };

/**
 * Flips `users.deactivated_at` on or off. Authorization is checked twice:
 * canChangeActiveStatus() here (for a clean error message) and the extended
 * prevent_privilege_escalation trigger in the DB (0010_user_deactivation.sql,
 * the real backstop). Both agree: nobody may change their own status, org
 * admins are scoped to their own org, platform_admin can reach anyone else.
 *
 * Uses the RLS-scoped client, not the service client — same SEC-6 reasoning
 * as updateUserRole: a service-role write runs with auth.uid() IS NULL,
 * which the trigger exempts, so it would bypass the self/org guard entirely.
 */
async function setActiveStatus(userId: string, deactivate: boolean): Promise<SetActiveStatusResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { ok: false, error: "Not authenticated." };
  }

  const { data: actorRow, error: actorError } = await supabase
    .from("users")
    .select("role, org_id")
    .eq("id", user.id)
    .maybeSingle<{ role: string; org_id: string | null }>();
  if (actorError || !actorRow || (actorRow.role !== "admin" && actorRow.role !== "platform_admin")) {
    return { ok: false, error: "Not authorized." };
  }

  const { data: targetRow, error: targetError } = await supabase
    .from("users")
    .select("org_id")
    .eq("id", userId)
    .maybeSingle<{ org_id: string | null }>();
  if (targetError || !targetRow) {
    return { ok: false, error: "User not found, or you are not authorized to change this user." };
  }

  const actor = { id: user.id, role: actorRow.role as AppRole, orgId: actorRow.org_id };
  const target = { id: userId, orgId: targetRow.org_id };
  if (!canChangeActiveStatus(actor, target)) {
    return {
      ok: false,
      error:
        user.id === userId
          ? "You cannot change your own active status."
          : "Not authorized to change this user's active status.",
    };
  }

  const { data: updated, error } = await supabase
    .from("users")
    .update({ deactivated_at: deactivate ? new Date().toISOString() : null })
    .eq("id", userId)
    .select("id, org_id")
    .maybeSingle<{ id: string; org_id: string | null }>();

  if (error) {
    return { ok: false, error: error.message };
  }
  if (!updated) {
    return { ok: false, error: "User not found, or you are not authorized to change this user." };
  }

  await writeAuditLog({
    actorId: user.id,
    orgId: updated.org_id,
    action: deactivate ? "user.deactivate" : "user.reactivate",
    targetType: "users",
    targetId: updated.id,
  });

  revalidatePath("/admin/users");
  return { ok: true };
}

export async function deactivateUser(userId: string): Promise<SetActiveStatusResult> {
  return setActiveStatus(userId, true);
}

export async function reactivateUser(userId: string): Promise<SetActiveStatusResult> {
  return setActiveStatus(userId, false);
}
