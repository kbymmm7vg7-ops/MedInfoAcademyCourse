-- MedInfo Academy — Row-Level Security
-- Implements 09-enterprise-lite/spec_tenant-isolation-rls.md.
-- Isolation is enforced here, in the database — app bugs must not be able to
-- leak one org's rows to another. The Drive folder is fulfillment, not isolation.

-- ---------------------------------------------------------------------------
-- Helper functions
-- All SECURITY DEFINER with pinned search_path so policy subqueries are not
-- themselves subject to RLS (avoids recursion) and cannot be spoofed by a
-- client-supplied value: org/role come from the JWT app_metadata claim set at
-- login, with a users-table lookup as fallback until the login hook is wired.
-- ---------------------------------------------------------------------------

create or replace function public.current_org_id()
returns uuid
language sql stable security definer
set search_path = public
as $$
  select coalesce(
    nullif((auth.jwt() -> 'app_metadata') ->> 'org_id', '')::uuid,
    (select org_id from public.users where id = auth.uid())
  );
$$;

create or replace function public.current_app_role()
returns user_role
language sql stable security definer
set search_path = public
as $$
  select coalesce(
    nullif((auth.jwt() -> 'app_metadata') ->> 'app_role', '')::user_role,
    (select role from public.users where id = auth.uid()),
    'trainee'::user_role
  );
$$;

create or replace function public.is_platform_admin()
returns boolean
language sql stable security definer
set search_path = public
as $$
  select public.current_app_role() = 'platform_admin';
$$;

-- Org staff = trainer/qa/admin acting within their own org
create or replace function public.is_org_staff()
returns boolean
language sql stable security definer
set search_path = public
as $$
  select public.current_app_role() in ('trainer', 'qa', 'admin');
$$;

create or replace function public.is_org_admin()
returns boolean
language sql stable security definer
set search_path = public
as $$
  select public.current_app_role() = 'admin';
$$;

create or replace function public.user_org(target_user uuid)
returns uuid
language sql stable security definer
set search_path = public
as $$
  select org_id from public.users where id = target_user;
$$;

-- Shared-bank visibility for a case template, honoring org_case_access:
-- B2C users (no org) see the whole shared bank; an org with no enabled
-- subset configured sees the whole shared bank; an org with a configured
-- subset sees only its enabled templates.
create or replace function public.org_case_allows(template uuid)
returns boolean
language sql stable security definer
set search_path = public
as $$
  select public.current_org_id() is null
    or not exists (
      select 1 from public.org_case_access a
      where a.org_id = public.current_org_id() and a.enabled
    )
    or exists (
      select 1 from public.org_case_access a
      where a.org_id = public.current_org_id()
        and a.case_template_id = template
        and a.enabled
    );
$$;

-- Owner / same-org-staff / platform-admin access to a case instance,
-- used by the child tables (turns, documentation, scores).
create or replace function public.can_access_instance(instance uuid)
returns boolean
language sql stable security definer
set search_path = public
as $$
  select exists (
    select 1 from public.case_instances ci
    where ci.id = instance
      and (
        ci.user_id = auth.uid()
        or public.is_platform_admin()
        or (ci.org_id is not null
            and ci.org_id = public.current_org_id()
            and public.is_org_staff())
      )
  );
$$;

-- ---------------------------------------------------------------------------
-- Enable RLS everywhere (deny-by-default; policies below open access)
-- ---------------------------------------------------------------------------

alter table organizations         enable row level security;
alter table users                 enable row level security;
alter table case_templates        enable row level security;
alter table srd_documents         enable row level security;
alter table detection_rulesets    enable row level security;
alter table training_modules      enable row level security;
alter table org_case_access       enable row level security;
alter table case_instances        enable row level security;
alter table conversation_turns    enable row level security;
alter table documentation_records enable row level security;
alter table evaluation_scores     enable row level security;
alter table competency_records    enable row level security;
alter table accreditation_attempts enable row level security;
alter table cohorts               enable row level security;
alter table cohort_members        enable row level security;
alter table user_training_progress enable row level security;
alter table audit_log             enable row level security;

-- ---------------------------------------------------------------------------
-- organizations
-- ---------------------------------------------------------------------------
create policy org_select on organizations for select to authenticated
  using (id = public.current_org_id() or public.is_platform_admin());
create policy org_write on organizations for all to authenticated
  using (public.is_platform_admin()) with check (public.is_platform_admin());

-- ---------------------------------------------------------------------------
-- users
-- ---------------------------------------------------------------------------
create policy users_select on users for select to authenticated
  using (
    id = auth.uid()
    or public.is_platform_admin()
    or (org_id is not null and org_id = public.current_org_id() and public.is_org_staff())
  );
create policy users_update on users for update to authenticated
  using (
    id = auth.uid()
    or public.is_platform_admin()
    or (org_id is not null and org_id = public.current_org_id() and public.is_org_admin())
  )
  with check (
    id = auth.uid()
    or public.is_platform_admin()
    or (org_id is not null and org_id = public.current_org_id() and public.is_org_admin())
  );
create policy users_insert_admin on users for insert to authenticated
  with check (public.is_platform_admin());

-- Non-admins must not change their own role or org (RLS cannot restrict
-- columns, so a trigger enforces it).
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
  return new;
end;
$$;
create trigger users_no_self_escalation
  before update on users
  for each row execute function public.prevent_privilege_escalation();

-- ---------------------------------------------------------------------------
-- Shared-vs-tenant content: case_templates, srd_documents, training_modules
-- org_id IS NULL = shared B2C bank (readable by all authenticated, subject to
-- org_case_access for templates); org rows readable only inside that org.
-- Shared-row writes are platform_admin only; org-row writes are org admin.
-- ---------------------------------------------------------------------------
create policy case_templates_select on case_templates for select to authenticated
  using (
    (org_id is null and public.org_case_allows(id))
    or org_id = public.current_org_id()
    or public.is_platform_admin()
  );
create policy case_templates_write on case_templates for all to authenticated
  using (
    public.is_platform_admin()
    or (org_id is not null and org_id = public.current_org_id() and public.is_org_admin())
  )
  with check (
    public.is_platform_admin()
    or (org_id is not null and org_id = public.current_org_id() and public.is_org_admin())
  );

create policy srd_documents_select on srd_documents for select to authenticated
  using (
    org_id is null
    or org_id = public.current_org_id()
    or public.is_platform_admin()
  );
create policy srd_documents_write on srd_documents for all to authenticated
  using (
    public.is_platform_admin()
    or (org_id is not null and org_id = public.current_org_id() and public.is_org_admin())
  )
  with check (
    public.is_platform_admin()
    or (org_id is not null and org_id = public.current_org_id() and public.is_org_admin())
  );

create policy training_modules_select on training_modules for select to authenticated
  using (
    org_id is null
    or org_id = public.current_org_id()
    or public.is_platform_admin()
  );
create policy training_modules_write on training_modules for all to authenticated
  using (
    public.is_platform_admin()
    or (org_id is not null and org_id = public.current_org_id() and public.is_org_admin())
  )
  with check (
    public.is_platform_admin()
    or (org_id is not null and org_id = public.current_org_id() and public.is_org_admin())
  );

-- ---------------------------------------------------------------------------
-- Tenant-only config tables
-- ---------------------------------------------------------------------------
create policy detection_rulesets_select on detection_rulesets for select to authenticated
  using (org_id = public.current_org_id() or public.is_platform_admin());
create policy detection_rulesets_write on detection_rulesets for all to authenticated
  using (
    public.is_platform_admin()
    or (org_id = public.current_org_id() and public.is_org_admin())
  )
  with check (
    public.is_platform_admin()
    or (org_id = public.current_org_id() and public.is_org_admin())
  );

create policy org_case_access_select on org_case_access for select to authenticated
  using (org_id = public.current_org_id() or public.is_platform_admin());
create policy org_case_access_write on org_case_access for all to authenticated
  using (
    public.is_platform_admin()
    or (org_id = public.current_org_id() and public.is_org_admin())
  )
  with check (
    public.is_platform_admin()
    or (org_id = public.current_org_id() and public.is_org_admin())
  );

-- ---------------------------------------------------------------------------
-- Activity: case_instances + children
-- Owner always; same-org staff for oversight; platform_admin everywhere.
-- org_id on an instance is denormalized from the user at insert and must
-- match the inserter's own org (WITH CHECK) so a client cannot plant rows
-- in another tenant.
-- ---------------------------------------------------------------------------
create policy case_instances_select on case_instances for select to authenticated
  using (
    user_id = auth.uid()
    or public.is_platform_admin()
    or (org_id is not null and org_id = public.current_org_id() and public.is_org_staff())
  );
create policy case_instances_insert on case_instances for insert to authenticated
  with check (
    user_id = auth.uid()
    and org_id is not distinct from public.current_org_id()
  );
create policy case_instances_update on case_instances for update to authenticated
  using (
    user_id = auth.uid()
    or public.is_platform_admin()
    or (org_id is not null and org_id = public.current_org_id() and public.is_org_staff())
  )
  with check (
    user_id = auth.uid()
    or public.is_platform_admin()
    or (org_id is not null and org_id = public.current_org_id() and public.is_org_staff())
  );

create policy turns_select on conversation_turns for select to authenticated
  using (public.can_access_instance(case_instance_id));
create policy turns_insert on conversation_turns for insert to authenticated
  with check (public.can_access_instance(case_instance_id));

create policy docs_select on documentation_records for select to authenticated
  using (public.can_access_instance(case_instance_id));
create policy docs_insert on documentation_records for insert to authenticated
  with check (public.can_access_instance(case_instance_id));
create policy docs_update on documentation_records for update to authenticated
  using (public.can_access_instance(case_instance_id))
  with check (public.can_access_instance(case_instance_id));

-- Scores are written by the evaluator running server-side (service role,
-- bypasses RLS). Authenticated users only read, and only their own reach.
create policy scores_select on evaluation_scores for select to authenticated
  using (public.can_access_instance(case_instance_id));

-- ---------------------------------------------------------------------------
-- Records keyed by user_id
-- ---------------------------------------------------------------------------
create policy competency_select on competency_records for select to authenticated
  using (
    user_id = auth.uid()
    or public.is_platform_admin()
    or (public.user_org(user_id) is not null
        and public.user_org(user_id) = public.current_org_id()
        and public.is_org_staff())
  );
create policy competency_write on competency_records for all to authenticated
  using (
    public.is_platform_admin()
    or (public.user_org(user_id) = public.current_org_id() and public.is_org_staff())
  )
  with check (
    public.is_platform_admin()
    or (public.user_org(user_id) = public.current_org_id() and public.is_org_staff())
  );

create policy attempts_select on accreditation_attempts for select to authenticated
  using (
    user_id = auth.uid()
    or public.is_platform_admin()
    or (public.user_org(user_id) is not null
        and public.user_org(user_id) = public.current_org_id()
        and public.is_org_staff())
  );
create policy attempts_insert on accreditation_attempts for insert to authenticated
  with check (user_id = auth.uid());

create policy training_progress_select on user_training_progress for select to authenticated
  using (
    user_id = auth.uid()
    or public.is_platform_admin()
    or (public.user_org(user_id) is not null
        and public.user_org(user_id) = public.current_org_id()
        and public.is_org_staff())
  );
create policy training_progress_insert on user_training_progress for insert to authenticated
  with check (user_id = auth.uid());

-- ---------------------------------------------------------------------------
-- Cohorts (org-scoped)
-- ---------------------------------------------------------------------------
create policy cohorts_select on cohorts for select to authenticated
  using (
    org_id = public.current_org_id()
    or public.is_platform_admin()
  );
create policy cohorts_write on cohorts for all to authenticated
  using (
    public.is_platform_admin()
    or (org_id = public.current_org_id() and public.is_org_staff())
  )
  with check (
    public.is_platform_admin()
    or (org_id = public.current_org_id() and public.is_org_staff())
  );

create policy cohort_members_select on cohort_members for select to authenticated
  using (
    user_id = auth.uid()
    or public.is_platform_admin()
    or exists (
      select 1 from cohorts c
      where c.id = cohort_id
        and c.org_id = public.current_org_id()
        and public.is_org_staff()
    )
  );
create policy cohort_members_write on cohort_members for all to authenticated
  using (
    public.is_platform_admin()
    or exists (
      select 1 from cohorts c
      where c.id = cohort_id
        and c.org_id = public.current_org_id()
        and public.is_org_staff()
    )
  )
  with check (
    public.is_platform_admin()
    or exists (
      select 1 from cohorts c
      where c.id = cohort_id
        and c.org_id = public.current_org_id()
        and public.is_org_staff()
    )
  );

-- ---------------------------------------------------------------------------
-- audit_log — org-partitioned reads; writes carry the actor's own identity/org
-- ---------------------------------------------------------------------------
create policy audit_select on audit_log for select to authenticated
  using (
    public.is_platform_admin()
    or (org_id is not null and org_id = public.current_org_id() and public.is_org_admin())
  );
create policy audit_insert on audit_log for insert to authenticated
  with check (
    actor_id = auth.uid()
    and org_id is not distinct from public.current_org_id()
  );

-- Lock helper functions down to authenticated callers
revoke execute on function public.current_org_id() from anon;
revoke execute on function public.current_app_role() from anon;
revoke execute on function public.can_access_instance(uuid) from anon;
revoke execute on function public.org_case_allows(uuid) from anon;
revoke execute on function public.user_org(uuid) from anon;
