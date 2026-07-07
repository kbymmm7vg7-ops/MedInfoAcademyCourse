# Design Spec — Tenant Isolation (Supabase RLS)

Fixes critique #9 (Drive folder is not isolation) and schema gaps #10–13. Opus implements + tests.

## Principle
Tenant isolation is enforced in the **database via Row-Level Security on `org_id`**, not in app code
and not by the Google Drive folder (which is only a source-document fulfillment convenience). App bugs
must not be able to leak one client's SRDs/cases to another; RLS is the backstop.

## Schema deltas to apply in the first migration (additions to PRD §8)
- `case_instances`: add `variant_snapshot_json jsonb`.
- `accreditation_attempts`: add `variant_ref text`.
- `evaluation_scores`: add `rubric_version text not null`.
- new `org_case_access(org_id, case_template_id, enabled bool, primary key(org_id, case_template_id))` — per-org subset of the 20 base cases (PRD §12).
- `audit_log`: add `org_id`.

## RLS model
- Every tenant-scoped table (`users`, `case_templates` where `org_id` not null, `case_instances`, `conversation_turns`, `documentation_records`, `srd_documents` where `org_id` not null, `detection_rulesets`, `cohorts`, `cohort_members`, `training_modules` where `org_id` not null, `evaluation_scores`, `competency_records`, `accreditation_attempts`, `org_case_access`, `audit_log`) gets RLS enabled.
- Current org derived from the authenticated user: a `current_org_id()` SQL function reading the JWT claim (set at login from `users.org_id`), not from a client-supplied value.
- **Shared vs tenant content**: `case_templates`, `srd_documents`, `training_modules` with `org_id IS NULL` are the shared B2C bank — readable by all authenticated users; rows with an `org_id` are readable only when `org_id = current_org_id()`. Policy: `USING (org_id IS NULL OR org_id = current_org_id())` for read; writes to `org_id IS NULL` rows restricted to `platform_admin`.
- Tenant-only tables (instances, documentation, scores, cohorts, attempts, audit): `USING (org_id = current_org_id())` for all operations; org-admin role additionally gated for management actions.
- Role gating (`trainee|trainer|qa|admin|platform_admin`) layered on top for write/manage operations.

## Enterprise custom cases
- Custom scenarios live in `case_templates` with the client's `org_id` and `is_fictional_product=false`; RLS guarantees they never appear in another org's queries or the B2C (`org_id IS NULL`) bank. This is the enforcement behind the PRD's tenant-isolation promise (§12/§13/§16.6).

## Tests (Opus writes, as pgTAP or integration tests — the plan's verification gate)
1. Two-org fixture (Org A, Org B) + a platform-shared set.
2. As Org B user: query Org A's `srd_documents`, `case_templates`, `case_instances`, `documentation_records` → **0 rows** each.
3. As Org B user: shared (`org_id IS NULL`) cases → visible.
4. As Org B trainee: attempt to write to Org A rows → denied by RLS, not by app check.
5. `org_case_access` restricts which shared cases an org's trainees see when a subset is configured.
6. Audit export for Org A returns only Org A `audit_log` rows.
