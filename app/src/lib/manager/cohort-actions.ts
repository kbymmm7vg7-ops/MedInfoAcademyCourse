"use server";

// =============================================================================
// COHORT LITE MUTATIONS (spec_admin-dashboard.md §4.7) — trainer-facing.
//
// Every action here re-checks role + org server-side (Server Actions are
// reachable by direct POST; the /manager page gate is not a security
// boundary), runs its writes on the caller's own RLS-scoped client (the
// cohorts/cohort_members policies allow org staff within their org), and
// writes an audit_log row via the shared helper.
//
// Roster upload matches EXISTING users by email only. There is no invite
// system: emails without a users row are reported back as "not registered
// yet" — we never create auth users here.
// =============================================================================

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getUserRole, isManagerRole } from "@/lib/auth/get-user-role";
import { writeAuditLog } from "@/lib/audit/log";
import { MAX_ROSTER_EMAILS, parseRosterEmails } from "@/lib/manager/roster";

type ManagerActor = {
  supabase: Awaited<ReturnType<typeof createClient>>;
  userId: string;
  orgId: string;
};

type ActorResult = { ok: true; actor: ManagerActor } | { ok: false; error: string };

async function requireManagerActor(): Promise<ActorResult> {
  const role = await getUserRole();
  if (!isManagerRole(role)) return { ok: false, error: "Forbidden" };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Forbidden" };

  const { data } = await supabase
    .from("users")
    .select("org_id")
    .eq("id", user.id)
    .maybeSingle<{ org_id: string | null }>();
  if (!data?.org_id) {
    return {
      ok: false,
      error: "Your account has no organization, so cohorts are unavailable.",
    };
  }

  return { ok: true, actor: { supabase, userId: user.id, orgId: data.org_id } };
}

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export type CreateCohortResult =
  | { ok: true; cohortId: string }
  | { ok: false; error: string };

export async function createCohort(input: {
  name: string;
  startDate: string | null;
  endDate: string | null;
}): Promise<CreateCohortResult> {
  const gate = await requireManagerActor();
  if (!gate.ok) return { ok: false, error: gate.error };
  const { supabase, userId, orgId } = gate.actor;

  const name = input.name.trim();
  if (!name) return { ok: false, error: "Cohort name is required." };
  if (name.length > 200) return { ok: false, error: "Cohort name is too long." };

  const startDate = input.startDate?.trim() || null;
  const endDate = input.endDate?.trim() || null;
  for (const d of [startDate, endDate]) {
    if (d && !DATE_RE.test(d)) return { ok: false, error: "Dates must be YYYY-MM-DD." };
  }
  if (startDate && endDate && endDate < startDate) {
    return { ok: false, error: "End date cannot be before the start date." };
  }

  const { data: created, error } = await supabase
    .from("cohorts")
    .insert({ org_id: orgId, name, start_date: startDate, end_date: endDate })
    .select("id")
    .single<{ id: string }>();
  if (error || !created) {
    return { ok: false, error: "Could not create the cohort. Please try again." };
  }

  await writeAuditLog({
    actorId: userId,
    orgId,
    action: "cohort.create",
    targetType: "cohorts",
    targetId: created.id,
  });

  revalidatePath("/manager");
  return { ok: true, cohortId: created.id };
}

export type RosterUploadResult =
  | {
      ok: true;
      /** members newly added to the cohort */
      added: number;
      /** matched users who were already cohort members */
      alreadyMembers: number;
      /** emails with no users row in this org — no invite system, not created */
      notRegistered: string[];
    }
  | { ok: false; error: string };

export async function uploadRoster(
  cohortId: string,
  rawText: string
): Promise<RosterUploadResult> {
  const gate = await requireManagerActor();
  if (!gate.ok) return { ok: false, error: gate.error };
  const { supabase, userId, orgId } = gate.actor;

  // The cohort must exist in the actor's own org (RLS also enforces the org
  // boundary; this check turns a silent zero-row write into a clean error).
  const { data: cohort } = await supabase
    .from("cohorts")
    .select("id")
    .eq("id", cohortId)
    .eq("org_id", orgId)
    .maybeSingle<{ id: string }>();
  if (!cohort) return { ok: false, error: "Cohort not found." };

  const emails = parseRosterEmails(rawText ?? "");
  if (emails.length === 0) {
    return { ok: false, error: "No email addresses found in the pasted text or file." };
  }
  if (emails.length > MAX_ROSTER_EMAILS) {
    return {
      ok: false,
      error: `Too many emails (${emails.length}). Upload at most ${MAX_ROSTER_EMAILS} at a time.`,
    };
  }

  // Match against existing users in this org only (email matching is
  // case-insensitive: parse lowercases, and stored emails are normalized
  // lowercase by auth signup).
  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("id, email")
    .eq("org_id", orgId)
    .in("email", emails);
  if (userError) {
    return { ok: false, error: "Could not look up users. Please try again." };
  }
  const matched = (userData ?? []) as { id: string; email: string | null }[];
  const matchedEmails = new Set(matched.map((u) => (u.email ?? "").toLowerCase()));
  const notRegistered = emails.filter((e) => !matchedEmails.has(e));

  // Skip users already in the cohort (unique on cohort_id + user_id).
  const { data: existingData } = await supabase
    .from("cohort_members")
    .select("user_id")
    .eq("cohort_id", cohortId);
  const existingIds = new Set(
    ((existingData ?? []) as { user_id: string }[]).map((r) => r.user_id)
  );
  const toAdd = matched.filter((u) => !existingIds.has(u.id));

  if (toAdd.length > 0) {
    const { error: insertError } = await supabase.from("cohort_members").insert(
      toAdd.map((u) => ({ cohort_id: cohortId, user_id: u.id }))
    );
    if (insertError) {
      return { ok: false, error: "Could not add members. Please try again." };
    }
  }

  // Audit with the added count in the action suffix (audit_log has no
  // metadata column; same pattern as case_template.rubric_approved.<bool>).
  await writeAuditLog({
    actorId: userId,
    orgId,
    action: `cohort.roster_upload.${toAdd.length}`,
    targetType: "cohorts",
    targetId: cohortId,
  });

  revalidatePath("/manager");
  revalidatePath(`/manager/cohorts/${cohortId}`);
  return {
    ok: true,
    added: toAdd.length,
    alreadyMembers: matched.length - toAdd.length,
    notRegistered,
  };
}
