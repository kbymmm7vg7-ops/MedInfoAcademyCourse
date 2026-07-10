// SEC-5 — the one shared audit writer. Every admin mutation, role change,
// ground-truth edit, cert lock, and cert-sitting void goes through here so
// audit_log coverage is a grep away (`writeAuditLog(`), not a convention.
//
// Writes with the service client: RLS on audit_log only allows inserts that
// carry the actor's own identity/org, but several audited events happen in
// service context (cert locks, expiry voids) where there is no JWT. The
// helper takes the actor explicitly instead.
import { createAdminClient } from "@/lib/supabase/admin";

export type AuditEntry = {
  /** auth user id performing the action; null for system events (e.g. lazy cert expiry) */
  actorId: string | null;
  /** org the action is scoped to; null for shared/platform-level targets */
  orgId?: string | null;
  /** dotted verb, e.g. "training_module.update", "case_template.ground_truth.edit", "cert.lock", "cert.sitting.void", "user.role.change" */
  action: string;
  targetType?: string | null;
  targetId?: string | null;
};

/**
 * Best-effort audit write: an audit outage must never abort the mutation it
 * records, but it is logged loudly so it shows up in server logs/monitoring.
 */
export async function writeAuditLog(entry: AuditEntry): Promise<void> {
  try {
    const admin = createAdminClient();
    const { error } = await admin.from("audit_log").insert({
      actor_id: entry.actorId,
      org_id: entry.orgId ?? null,
      action: entry.action,
      target_type: entry.targetType ?? null,
      target_id: entry.targetId ?? null,
    });
    if (error) {
      console.error("[audit] insert failed", { action: entry.action, error: error.message });
    }
  } catch (err) {
    console.error("[audit] insert threw", { action: entry.action, err });
  }
}
