"use server";

// =============================================================================
// ORG CONFIG ACTIONS (spec_admin-dashboard.md §4.5) — platform_admin ONLY.
//
// Two mutations live here:
//   - organizations.confidentiality_tier (enum: standard | firewall, 0001)
//   - org_case_access rows (which shared-bank cases an org's trainees see;
//     the queue loader + org_case_allows() RLS helper already respect it)
//
// Both run on the RLS-scoped client — org_write / org_case_access_write
// policies already restrict them to platform_admin, the app check here just
// produces a clean error instead of an opaque RLS rejection. Every mutation
// writes audit_log.
// =============================================================================

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getUserRole } from "@/lib/auth/get-user-role";
import { writeAuditLog } from "@/lib/audit/log";

// Must match the confidentiality_tier enum in 0001_init_schema.sql.
export type ConfidentialityTier = "standard" | "firewall";
const CONFIDENTIALITY_TIERS: readonly ConfidentialityTier[] = ["standard", "firewall"];

export type OrgActionResult = { ok: true } | { ok: false; error: string };

async function requirePlatformAdmin(): Promise<
  { ok: true; supabase: Awaited<ReturnType<typeof createClient>>; userId: string } | { ok: false; error: string }
> {
  const role = await getUserRole();
  if (role !== "platform_admin") {
    return { ok: false, error: "Not authorized — platform admin only." };
  }
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { ok: false, error: "Not authenticated." };
  }
  return { ok: true, supabase, userId: user.id };
}

export async function updateConfidentialityTier(
  orgId: string,
  tier: string
): Promise<OrgActionResult> {
  const ctx = await requirePlatformAdmin();
  if (!ctx.ok) return ctx;

  if (!CONFIDENTIALITY_TIERS.includes(tier as ConfidentialityTier)) {
    return { ok: false, error: "Tier must be one of: standard, firewall." };
  }

  const { data: updated, error } = await ctx.supabase
    .from("organizations")
    .update({ confidentiality_tier: tier })
    .eq("id", orgId)
    .select("id")
    .maybeSingle<{ id: string }>();

  if (error) {
    return { ok: false, error: error.message };
  }
  if (!updated) {
    return { ok: false, error: "Organization not found." };
  }

  await writeAuditLog({
    actorId: ctx.userId,
    orgId,
    action: "org.confidentiality_tier.change",
    targetType: "organizations",
    targetId: orgId,
  });

  revalidatePath("/admin/orgs");
  return { ok: true };
}

/**
 * Enables/disables one shared-bank case for an org. Only shared
 * (org_id IS NULL) templates are eligible — an org's own templates are
 * always visible to it and never go through org_case_access.
 *
 * Note the RLS default: an org with NO enabled org_case_access rows sees
 * the ENTIRE shared bank (org_case_allows in 0002). Configuring the first
 * enabled row switches that org to subset mode.
 */
export async function setOrgCaseAccess(
  orgId: string,
  caseTemplateId: string,
  enabled: boolean
): Promise<OrgActionResult> {
  const ctx = await requirePlatformAdmin();
  if (!ctx.ok) return ctx;

  // The row must be a shared-bank template.
  const { data: template } = await ctx.supabase
    .from("case_templates")
    .select("id, org_id")
    .eq("id", caseTemplateId)
    .maybeSingle<{ id: string; org_id: string | null }>();
  if (!template) {
    return { ok: false, error: "Case template not found." };
  }
  if (template.org_id !== null) {
    return { ok: false, error: "Only shared-bank cases can be toggled via org case access." };
  }

  const { error } = await ctx.supabase
    .from("org_case_access")
    .upsert(
      { org_id: orgId, case_template_id: caseTemplateId, enabled },
      { onConflict: "org_id,case_template_id" }
    );

  if (error) {
    return { ok: false, error: error.message };
  }

  await writeAuditLog({
    actorId: ctx.userId,
    orgId,
    action: "org_case_access.toggle",
    targetType: "org_case_access",
    targetId: `${orgId}:${caseTemplateId}`,
  });

  revalidatePath("/admin/orgs");
  return { ok: true };
}
