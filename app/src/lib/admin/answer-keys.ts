"use server";

// =============================================================================
// ADMIN GROUND-TRUTH EDITOR DATA LAYER (S7 §4.2) — the ONE new sanctioned
// reader/writer of case_answer_keys besides lib/simulator/case-brief.ts.
// Listed in the SEC-9 firewall-test allowlist by name; keep all answer-key
// admin access in this file.
//
// Gate semantics (RUNBOOK standing rule — answer keys are Nathan's sign-off
// artifacts):
//   - every edited key is ajv-validated against the vendored copy of
//     01-seed-cases/answer-key.schema.json before save;
//   - EVERY ground-truth save flips case_templates.rubric_approved = false
//     (de-approves the case: it drops out of trainee queues + accreditation);
//   - every save and every rubric_approved flip writes audit_log;
//   - re-approval (rubric_approved -> true) is a separate explicit action that
//     the UI must present as Nathan's sign-off.
// =============================================================================

import { Ajv } from "ajv";
import addFormats from "ajv-formats";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getUserRole } from "@/lib/auth/get-user-role";
import { writeAuditLog } from "@/lib/audit/log";
import answerKeySchema from "./answer-key.schema.json";

async function requireAdmin(): Promise<{ userId: string; role: "admin" | "platform_admin"; orgId: string | null }> {
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
  return { userId: user.id, role, orgId: data?.org_id ?? null };
}

/** RLS-scoped template access check: org admins only reach their own org's
 * templates or shared ones RLS lets them see; the answer-key read itself is
 * service-role. Returns the template surface row or null. */
async function accessibleTemplate(templateId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("case_templates")
    .select("id, org_id, case_code, title, rubric_approved")
    .eq("id", templateId)
    .maybeSingle<{ id: string; org_id: string | null; case_code: string | null; title: string; rubric_approved: boolean }>();
  return data ?? null;
}

export async function loadAnswerKeyForAdmin(templateId: string): Promise<{
  template: { id: string; case_code: string | null; title: string; rubric_approved: boolean };
  groundTruthJson: Record<string, unknown> | null;
} | null> {
  await requireAdmin();
  const template = await accessibleTemplate(templateId);
  if (!template) return null;
  const admin = createAdminClient();
  const { data } = await admin
    .from("case_answer_keys")
    .select("ground_truth_json")
    .eq("template_id", templateId)
    .maybeSingle<{ ground_truth_json: Record<string, unknown> | null }>();
  return { template, groundTruthJson: data?.ground_truth_json ?? null };
}

export type SaveAnswerKeyResult =
  | { ok: true; deApproved: true }
  | { ok: false; errors: string[] };

/**
 * Validates and saves an edited ground-truth key. Always de-approves the case
 * (rubric_approved = false) and audits both writes. Never call from anything
 * but the admin editor.
 */
export async function saveGroundTruth(templateId: string, editedKeyJson: string): Promise<SaveAnswerKeyResult> {
  const { userId } = await requireAdmin();
  const template = await accessibleTemplate(templateId);
  if (!template) return { ok: false, errors: ["Case not found or not accessible."] };

  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(editedKeyJson) as Record<string, unknown>;
  } catch {
    return { ok: false, errors: ["Not valid JSON."] };
  }

  const ajv = new Ajv({ allErrors: true, strict: false });
  addFormats(ajv);
  const validate = ajv.compile(answerKeySchema as object);
  if (!validate(parsed)) {
    return {
      ok: false,
      errors: (validate.errors ?? []).map((e) => `${e.instancePath || "/"} ${e.message ?? "invalid"}`),
    };
  }

  const admin = createAdminClient();
  const { error: keyError } = await admin
    .from("case_answer_keys")
    .upsert(
      { template_id: templateId, ground_truth_json: parsed, updated_at: new Date().toISOString() },
      { onConflict: "template_id" }
    );
  if (keyError) return { ok: false, errors: [`Save failed: ${keyError.message}`] };

  // The gate: an edited key is no longer the approved key.
  const { error: flagError } = await admin
    .from("case_templates")
    .update({ rubric_approved: false })
    .eq("id", templateId);
  if (flagError) return { ok: false, errors: [`Key saved but de-approval failed: ${flagError.message}`] };

  await writeAuditLog({
    actorId: userId,
    orgId: template.org_id ?? null,
    action: "case_template.ground_truth.edit",
    targetType: "case_templates",
    targetId: templateId,
  });
  await writeAuditLog({
    actorId: userId,
    orgId: template.org_id ?? null,
    action: "case_template.rubric_approved.false",
    targetType: "case_templates",
    targetId: templateId,
  });
  return { ok: true, deApproved: true };
}

export type CreateOrgScenarioInput = {
  title: string;
  caseCode: string;
  difficulty: number;
  therapeuticArea: string | null;
  productRef: string | null;
  isFictionalProduct: boolean;
  answerKeyJson: string; // full ground-truth JSON, validated against the schema
  personaBriefJson: string | null; // {scenario_premise, persona_profile, beat_sheet}
  orgSrls: { srlCode: string; title: string; therapeuticArea: string | null; body: string }[];
};

/**
 * Custom scenario intake (§4.3): creates an org-scoped case that starts
 * drafted + unapproved (invisible to trainee queues until Nathan approves).
 * Keeps ALL answer-key and SRL-body writes inside this sanctioned file.
 */
export async function createOrgScenario(input: CreateOrgScenarioInput): Promise<{ ok: true; templateId: string } | { ok: false; errors: string[] }> {
  const { userId, orgId, role } = await requireAdmin();
  const targetOrgId = orgId;
  if (!targetOrgId && role !== "platform_admin") {
    return { ok: false, errors: ["Org admins must belong to an organization."] };
  }
  if (!targetOrgId) {
    return { ok: false, errors: ["Custom scenarios are org-scoped: platform_admin needs an org context to create one (assign yourself to the org or use the org admin account)."] };
  }

  let parsedKey: Record<string, unknown>;
  try {
    parsedKey = JSON.parse(input.answerKeyJson) as Record<string, unknown>;
  } catch {
    return { ok: false, errors: ["Answer key is not valid JSON."] };
  }
  const ajv = new Ajv({ allErrors: true, strict: false });
  addFormats(ajv);
  const validate = ajv.compile(answerKeySchema as object);
  if (!validate(parsedKey)) {
    return {
      ok: false,
      errors: (validate.errors ?? []).map((e) => `${e.instancePath || "/"} ${e.message ?? "invalid"}`),
    };
  }

  let parsedBrief: Record<string, unknown> | null = null;
  if (input.personaBriefJson) {
    try {
      parsedBrief = JSON.parse(input.personaBriefJson) as Record<string, unknown>;
    } catch {
      return { ok: false, errors: ["Persona brief is not valid JSON."] };
    }
  }

  const admin = createAdminClient();
  const { data: created, error: templateError } = await admin
    .from("case_templates")
    .insert({
      org_id: targetOrgId,
      case_code: input.caseCode,
      title: input.title,
      difficulty: input.difficulty,
      therapeutic_area: input.therapeuticArea,
      product_ref: input.productRef,
      is_fictional_product: input.isFictionalProduct,
      requester_type: (parsedKey as { requester?: { type?: string } }).requester?.type ?? "hcp",
      outline_status: "drafted",
      rubric_approved: false,
    })
    .select("id")
    .maybeSingle<{ id: string }>();
  if (templateError || !created) {
    return { ok: false, errors: [`Case creation failed: ${templateError?.message ?? "no row"}`] };
  }

  const { error: keyError } = await admin.from("case_answer_keys").insert({
    template_id: created.id,
    ground_truth_json: parsedKey,
    persona_brief_json: parsedBrief,
  });
  if (keyError) {
    await admin.from("case_templates").delete().eq("id", created.id);
    return { ok: false, errors: [`Answer-key save failed: ${keyError.message}`] };
  }

  for (const srl of input.orgSrls) {
    const { data: srd, error: srdError } = await admin
      .from("srd_documents")
      .insert({
        org_id: targetOrgId,
        srl_code: srl.srlCode,
        title: srl.title,
        therapeutic_area: srl.therapeuticArea,
        is_decoy_eligible: true,
      })
      .select("id")
      .maybeSingle<{ id: string }>();
    if (srdError || !srd) {
      return { ok: false, errors: [`Case created but SRL ${srl.srlCode} failed: ${srdError?.message ?? "no row"}`] };
    }
    const { error: bodyError } = await admin
      .from("srd_document_bodies")
      .insert({ document_id: srd.id, body: srl.body });
    if (bodyError) {
      return { ok: false, errors: [`Case created but SRL body ${srl.srlCode} failed: ${bodyError.message}`] };
    }
  }

  await writeAuditLog({
    actorId: userId,
    orgId: targetOrgId,
    action: "case_template.create_custom",
    targetType: "case_templates",
    targetId: created.id,
  });
  return { ok: true, templateId: created.id };
}

/**
 * Re-approval — Nathan's sign-off action (platform_admin only). The UI must
 * present a confirm that names him before calling this.
 */
export async function setRubricApproved(templateId: string, approved: boolean): Promise<{ ok: boolean; error?: string }> {
  const { userId, role } = await requireAdmin();
  if (approved && role !== "platform_admin") {
    return { ok: false, error: "Only platform_admin may approve a rubric (Nathan's sign-off gate)." };
  }
  const template = await accessibleTemplate(templateId);
  if (!template) return { ok: false, error: "Case not found or not accessible." };

  const admin = createAdminClient();
  const { error } = await admin
    .from("case_templates")
    .update({ rubric_approved: approved })
    .eq("id", templateId);
  if (error) return { ok: false, error: error.message };

  await writeAuditLog({
    actorId: userId,
    orgId: template.org_id ?? null,
    action: `case_template.rubric_approved.${approved}`,
    targetType: "case_templates",
    targetId: templateId,
  });
  return { ok: true };
}
