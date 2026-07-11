-- MedInfo Academy — user deactivation (BLOCKERS 2026-07-10 item ①)
--
-- Adds users.deactivated_at and extends the existing privilege-escalation
-- trigger (public.prevent_privilege_escalation, 0001/0002) so that:
--   - deactivation/reactivation is NOT blocked by the trigger — only
--     role/org changes were guarded before, so flipping deactivated_at
--     alone was already legal; this migration adds an explicit guard for it
--     rather than relying on that gap.
--   - nobody may change their own active status, including platform_admin
--     (self-deactivation and self-reactivation are both denied).
--   - an org admin may deactivate/reactivate users within their own org
--     only.
--   - platform_admin may deactivate/reactivate any user (other than self).
-- Service-role writes (auth.uid() is null) remain exempt, matching the
-- existing role/org escalation guard — server actions that need the
-- self/org checks enforced must run with the RLS-scoped client (see
-- src/lib/admin/user-actions.ts), not the service-role client.

alter table public.users add column deactivated_at timestamptz;

comment on column public.users.deactivated_at is
  'Set by an org admin (own org) or platform_admin (any org) to block sign-in. Null = active.';

create or replace function public.prevent_privilege_escalation()
returns trigger
language plpgsql security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    return new; -- no user context: service role / server-side admin path
  end if;

  if (new.role is distinct from old.role or new.org_id is distinct from old.org_id) then
    if not (public.is_platform_admin()
            or (public.is_org_admin() and old.org_id = public.current_org_id())) then
      raise exception 'not authorized to change role or org';
    end if;
  end if;

  if (new.deactivated_at is distinct from old.deactivated_at) then
    if old.id = auth.uid() then
      raise exception 'cannot change your own active status';
    end if;
    if not (public.is_platform_admin()
            or (public.is_org_admin() and old.org_id = public.current_org_id())) then
      raise exception 'not authorized to change active status';
    end if;
  end if;

  return new;
end;
$$;
