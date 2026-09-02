-- ===========================================================================
-- 0011_audit_insert_service_only.sql — SEC-13 (S8)
--
-- Problem: policy `audit_insert` (migration 0002) let ANY authenticated user
-- insert into audit_log directly via PostgREST, provided the row carried their
-- own actor_id and org_id. The audit trail is the evidence of record for
-- admin mutations, role changes, ground-truth edits, certification locks, and
-- cert-sitting voids — a trainee who can append to it can forge entries, and
-- flood it to bury real ones. Nothing in the application relies on this
-- policy: every audit write goes through lib/audit/log.ts, which uses the
-- service client (createAdminClient) and therefore bypasses RLS entirely.
--
-- Fix: drop the authenticated INSERT policy. audit_log stays readable to
-- platform admins and to org admins for their own org (policy `audit_select`,
-- unchanged); writes become service-role-only, matching how the code already
-- behaves.
--
-- NOT APPLIED to the live database by this change — see 00-build/DECISIONS.md:
-- Nathan applies 0011 and re-runs supabase/tests/rls-two-org-test.sql.
-- ===========================================================================

drop policy if exists audit_insert on audit_log;

-- Belt and braces: even with no policy, an INSERT grant on the table is a
-- privilege the trainee role has no use for.
revoke insert on table audit_log from authenticated;
