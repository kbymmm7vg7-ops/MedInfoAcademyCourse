"use server";

// =============================================================================
// ADMIN CASE BANK SURFACE-FIELD ACTIONS (spec_admin-dashboard.md §4.2)
//
// SURFACE fields only: title, difficulty, therapeutic_area, product_ref,
// stt_tts_verified. Every mutation here is RLS-scoped (the caller's own
// Supabase client, not the service-role client), role-checked, and audited.
//
// This file must NEVER touch rubric_approved (that gate is
// lib/admin/answer-keys.ts#setRubricApproved) and must NEVER read or write
// any ground-truth / persona-brief / SRL-body column — those live behind the
// SEC-9 firewall in lib/admin/answer-keys.ts, the sole sanctioned reader.
// =============================================================================

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getUserRole } from "@/lib/auth/get-user-role";
import { writeAuditLog } from "@/lib/audit/log";

async function requireAdminActor() {
  const role = await getUserRole();
  if (role !== "admin" && role !== "platform_admin") {
    throw new Error("Forbidden");
  }
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Forbidden");
  return { supabase, userId: user.id };
}

/** RLS-scoped existence/access check; also gives us org_id for the audit row. */
async function accessibleTemplate(
  supabase: Awaited<ReturnType<typeof createClient>>,
  templateId: string
) {
  const { data } = await supabase
    .from("case_templates")
    .select("id, org_id")
    .eq("id", templateId)
    .maybeSingle<{ id: string; org_id: string | null }>();
  return data ?? null;
}

export type CaseActionResult = { ok: true } | { ok: false; error: string };

export type SurfaceFieldsInput = {
  title: string;
  difficulty: number;
  therapeuticArea: string | null;
  productRef: string | null;
};

/**
 * Edits the freely-editable surface fields on a case_templates row. RLS
 * decides whether this admin may actually write the row (shared bank rows
 * are platform_admin-only; org rows are that org's admin) — this function
 * just shapes the input and surfaces a clean error instead of an opaque
 * RLS rejection.
 */
export async function updateSurfaceFields(
  templateId: string,
  input: SurfaceFieldsInput
): Promise<CaseActionResult> {
  const { supabase, userId } = await requireAdminActor();

  const existing = await accessibleTemplate(supabase, templateId);
  if (!existing) {
    return { ok: false, error: "Case not found or not accessible." };
  }

  const title = input.title.trim();
  if (!title) {
    return { ok: false, error: "Title is required." };
  }
  if (!Number.isInteger(input.difficulty) || input.difficulty < 1 || input.difficulty > 6) {
    return { ok: false, error: "Difficulty must be a whole number between 1 and 6." };
  }

  const { error } = await supabase
    .from("case_templates")
    .update({
      title,
      difficulty: input.difficulty,
      therapeutic_area: input.therapeuticArea?.trim() || null,
      product_ref: input.productRef?.trim() || null,
    })
    .eq("id", templateId);

  if (error) {
    return { ok: false, error: error.message };
  }

  await writeAuditLog({
    actorId: userId,
    orgId: existing.org_id,
    action: "case_template.update_surface",
    targetType: "case_templates",
    targetId: templateId,
  });

  revalidatePath(`/admin/cases/${templateId}`);
  revalidatePath("/admin/cases");
  return { ok: true };
}

/** Toggles the STT/TTS voice-verification flag — a surface field, audited like any other. */
export async function setSttTtsVerified(
  templateId: string,
  verified: boolean
): Promise<CaseActionResult> {
  const { supabase, userId } = await requireAdminActor();

  const existing = await accessibleTemplate(supabase, templateId);
  if (!existing) {
    return { ok: false, error: "Case not found or not accessible." };
  }

  const { error } = await supabase
    .from("case_templates")
    .update({ stt_tts_verified: verified })
    .eq("id", templateId);

  if (error) {
    return { ok: false, error: error.message };
  }

  await writeAuditLog({
    actorId: userId,
    orgId: existing.org_id,
    action: "case_template.update_surface",
    targetType: "case_templates",
    targetId: templateId,
  });

  revalidatePath(`/admin/cases/${templateId}`);
  revalidatePath("/admin/cases");
  return { ok: true };
}
