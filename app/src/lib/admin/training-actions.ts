"use server";

// =============================================================================
// ADMIN TRAINING MODULE ACTIONS (spec_admin-dashboard.md §4.1)
//
// Platform_admin edits shared rows (org_id IS NULL) and may touch org rows;
// org admin edits ONLY their own org's rows and may create an org-tailored
// copy of a shared row (same slug, org_id set) which shadows the shared
// module for their trainees (lib/training/modules.ts does the shadowing).
//
// Every mutation here is RLS-scoped (the caller's own Supabase client — the
// service-role client is never used), role-checked BEFORE the write, and
// audited through writeAuditLog. RLS also enforces server-side; the explicit
// checks exist to surface clean error messages instead of opaque rejections.
// =============================================================================

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getUserRole, type AppRole } from "@/lib/auth/get-user-role";
import { writeAuditLog } from "@/lib/audit/log";

const MODULE_COLUMNS = "id, org_id, slug, title, content_md, required, est_minutes, order_index";

type ModuleDbRow = {
  id: string;
  org_id: string | null;
  slug: string | null;
  title: string;
  content_md: string | null;
  required: boolean;
  est_minutes: number | null;
  order_index: number;
};

type AdminActor = {
  supabase: Awaited<ReturnType<typeof createClient>>;
  userId: string;
  role: Extract<AppRole, "admin" | "platform_admin">;
  orgId: string | null;
};

async function requireAdminActor(): Promise<AdminActor> {
  const role = await getUserRole();
  if (role !== "admin" && role !== "platform_admin") {
    throw new Error("Forbidden");
  }
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Forbidden");

  const { data } = await supabase
    .from("users")
    .select("org_id")
    .eq("id", user.id)
    .maybeSingle<{ org_id: string | null }>();

  return { supabase, userId: user.id, role, orgId: data?.org_id ?? null };
}

/** RLS-scoped read of the target row — proves the actor can at least see it. */
async function accessibleModule(
  supabase: AdminActor["supabase"],
  moduleId: string
): Promise<ModuleDbRow | null> {
  const { data } = await supabase
    .from("training_modules")
    .select(MODULE_COLUMNS)
    .eq("id", moduleId)
    .maybeSingle<ModuleDbRow>();
  return data ?? null;
}

/**
 * Write permission (mirrors the RLS write policy, but with a clean message):
 * platform_admin writes anything it can see; org admin writes only rows
 * belonging to their own org — shared rows are read-only for them.
 */
function writeDenialReason(actor: AdminActor, row: ModuleDbRow): string | null {
  if (actor.role === "platform_admin") return null;
  if (row.org_id === null) {
    return "Shared modules are read-only for org admins — use “Create org copy” to tailor one for your organization.";
  }
  if (!actor.orgId || row.org_id !== actor.orgId) {
    return "This module belongs to another organization.";
  }
  return null;
}

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function validateSlug(slug: string): string | null {
  if (!slug) return "Slug is required.";
  if (!SLUG_PATTERN.test(slug)) {
    return "Slug must be lowercase letters, numbers, and hyphens (e.g. adverse-event-intake).";
  }
  return null;
}

function friendlySlugConflict(message: string): string {
  if (/duplicate key|unique/i.test(message)) {
    return "That slug is already in use in this scope — pick a different one.";
  }
  return message;
}

function revalidateTraining(moduleId?: string) {
  revalidatePath("/admin/training");
  if (moduleId) revalidatePath(`/admin/training/${moduleId}`);
  // Trainee-facing views read the same table (post-shadowing).
  revalidatePath("/training");
}

export type TrainingActionResult = { ok: true } | { ok: false; error: string };
export type CreateModuleResult = { ok: true; id: string } | { ok: false; error: string };

/**
 * Creates a new module: platform_admin creates a shared row (org_id null),
 * org admin creates a row for their own org. Starts optional (required =
 * false) at the end of its scope's ordering; the editor page is where the
 * content gets written.
 */
export async function createModule(input: {
  title: string;
  slug: string;
}): Promise<CreateModuleResult> {
  const actor = await requireAdminActor();

  const title = input.title.trim();
  const slug = input.slug.trim().toLowerCase();
  if (!title) return { ok: false, error: "Title is required." };
  const slugError = validateSlug(slug);
  if (slugError) return { ok: false, error: slugError };

  const targetOrgId = actor.role === "platform_admin" ? null : actor.orgId;
  if (actor.role === "admin" && !targetOrgId) {
    return { ok: false, error: "Org admins must belong to an organization to create modules." };
  }

  // Append at the end of the target scope's ordering.
  let maxQuery = actor.supabase
    .from("training_modules")
    .select("order_index")
    .order("order_index", { ascending: false })
    .limit(1);
  maxQuery =
    targetOrgId === null ? maxQuery.is("org_id", null) : maxQuery.eq("org_id", targetOrgId);
  const { data: last } = await maxQuery.maybeSingle<{ order_index: number }>();
  const orderIndex = (last?.order_index ?? -1) + 1;

  const { data: created, error } = await actor.supabase
    .from("training_modules")
    .insert({
      org_id: targetOrgId,
      slug,
      title,
      content_md: "",
      required: false,
      est_minutes: null,
      order_index: orderIndex,
    })
    .select("id")
    .maybeSingle<{ id: string }>();

  if (error || !created) {
    return {
      ok: false,
      error: friendlySlugConflict(error?.message ?? "Create failed — no row returned."),
    };
  }

  await writeAuditLog({
    actorId: actor.userId,
    orgId: targetOrgId,
    action: "training_module.create",
    targetType: "training_modules",
    targetId: created.id,
  });

  revalidateTraining(created.id);
  return { ok: true, id: created.id };
}

export type UpdateModuleInput = {
  title: string;
  slug: string;
  estMinutes: number | null;
  required: boolean;
  contentMd: string;
};

/** Edits title, slug, est_minutes, required, and content_md on one module. */
export async function updateModule(
  moduleId: string,
  input: UpdateModuleInput
): Promise<TrainingActionResult> {
  const actor = await requireAdminActor();

  const existing = await accessibleModule(actor.supabase, moduleId);
  if (!existing) return { ok: false, error: "Module not found or not accessible." };
  const denial = writeDenialReason(actor, existing);
  if (denial) return { ok: false, error: denial };

  const title = input.title.trim();
  const slug = input.slug.trim().toLowerCase();
  if (!title) return { ok: false, error: "Title is required." };
  const slugError = validateSlug(slug);
  if (slugError) return { ok: false, error: slugError };
  if (
    input.estMinutes !== null &&
    (!Number.isInteger(input.estMinutes) || input.estMinutes < 0)
  ) {
    return { ok: false, error: "Estimated minutes must be a whole number (or blank)." };
  }

  const { error } = await actor.supabase
    .from("training_modules")
    .update({
      title,
      slug,
      est_minutes: input.estMinutes,
      required: input.required,
      content_md: input.contentMd,
    })
    .eq("id", moduleId);

  if (error) return { ok: false, error: friendlySlugConflict(error.message) };

  await writeAuditLog({
    actorId: actor.userId,
    orgId: existing.org_id,
    action: "training_module.update",
    targetType: "training_modules",
    targetId: moduleId,
  });

  revalidateTraining(moduleId);
  return { ok: true };
}

/** Toggles the required flag from the list page (also part of updateModule). */
export async function setModuleRequired(
  moduleId: string,
  required: boolean
): Promise<TrainingActionResult> {
  const actor = await requireAdminActor();

  const existing = await accessibleModule(actor.supabase, moduleId);
  if (!existing) return { ok: false, error: "Module not found or not accessible." };
  const denial = writeDenialReason(actor, existing);
  if (denial) return { ok: false, error: denial };

  const { error } = await actor.supabase
    .from("training_modules")
    .update({ required })
    .eq("id", moduleId);

  if (error) return { ok: false, error: error.message };

  await writeAuditLog({
    actorId: actor.userId,
    orgId: existing.org_id,
    action: "training_module.update",
    targetType: "training_modules",
    targetId: moduleId,
  });

  revalidateTraining(moduleId);
  return { ok: true };
}

/**
 * Moves a module one position up or down WITHIN ITS SCOPE (the shared bank,
 * or its org's list) and persists order_index for every row whose position
 * changed. Scope-local by design: shared and org orderings are independent,
 * and the trainee-facing merge keeps shadowed copies in the shared slot.
 */
export async function reorderModule(
  moduleId: string,
  direction: "up" | "down"
): Promise<TrainingActionResult> {
  const actor = await requireAdminActor();

  const existing = await accessibleModule(actor.supabase, moduleId);
  if (!existing) return { ok: false, error: "Module not found or not accessible." };
  const denial = writeDenialReason(actor, existing);
  if (denial) return { ok: false, error: denial };

  let scopeQuery = actor.supabase
    .from("training_modules")
    .select("id, order_index")
    .order("order_index", { ascending: true });
  scopeQuery =
    existing.org_id === null
      ? scopeQuery.is("org_id", null)
      : scopeQuery.eq("org_id", existing.org_id);
  const { data: scopeRows, error: scopeError } = await scopeQuery.returns<
    { id: string; order_index: number }[]
  >();
  if (scopeError) return { ok: false, error: scopeError.message };

  const ordered = (scopeRows ?? []).map((r) => r.id);
  const from = ordered.indexOf(moduleId);
  if (from < 0) return { ok: false, error: "Module not found in its scope." };
  const to = direction === "up" ? from - 1 : from + 1;
  if (to < 0 || to >= ordered.length) {
    return { ok: false, error: "Module is already at that end of the list." };
  }
  [ordered[from], ordered[to]] = [ordered[to], ordered[from]];

  // Persist positions as clean sequential indexes; only touch changed rows.
  const byId = new Map((scopeRows ?? []).map((r) => [r.id, r.order_index]));
  for (let position = 0; position < ordered.length; position++) {
    const id = ordered[position];
    if (byId.get(id) === position) continue;
    const { error } = await actor.supabase
      .from("training_modules")
      .update({ order_index: position })
      .eq("id", id);
    if (error) return { ok: false, error: `Reorder partially applied: ${error.message}` };
  }

  await writeAuditLog({
    actorId: actor.userId,
    orgId: existing.org_id,
    action: "training_module.reorder",
    targetType: "training_modules",
    targetId: moduleId,
  });

  revalidateTraining(moduleId);
  return { ok: true };
}

/**
 * Org admin's per-org tailored copy of a SHARED module: duplicates the row
 * with org_id = the admin's org and the SAME slug. The shadowing loader
 * (lib/training/modules.ts) then serves the copy instead of the shared
 * original to that org's trainees.
 */
export async function createOrgCopy(moduleId: string): Promise<CreateModuleResult> {
  const actor = await requireAdminActor();

  if (actor.role !== "admin") {
    return {
      ok: false,
      error: "Org copies are an org-admin action — platform admins edit the shared row directly.",
    };
  }
  if (!actor.orgId) {
    return { ok: false, error: "Org admins must belong to an organization." };
  }

  const source = await accessibleModule(actor.supabase, moduleId);
  if (!source) return { ok: false, error: "Module not found or not accessible." };
  if (source.org_id !== null) {
    return { ok: false, error: "Only shared modules can be copied for your organization." };
  }

  const { data: created, error } = await actor.supabase
    .from("training_modules")
    .insert({
      org_id: actor.orgId,
      slug: source.slug,
      title: source.title,
      content_md: source.content_md,
      required: source.required,
      est_minutes: source.est_minutes,
      order_index: source.order_index,
    })
    .select("id")
    .maybeSingle<{ id: string }>();

  if (error || !created) {
    const message = error?.message ?? "Copy failed — no row returned.";
    return {
      ok: false,
      error: /duplicate key|unique/i.test(message)
        ? "Your organization already has a copy of this module."
        : message,
    };
  }

  await writeAuditLog({
    actorId: actor.userId,
    orgId: actor.orgId,
    action: "training_module.org_copy",
    targetType: "training_modules",
    targetId: created.id,
  });

  revalidateTraining(created.id);
  return { ok: true, id: created.id };
}
