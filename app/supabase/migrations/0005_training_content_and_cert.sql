-- S6: self-study content lives in the row (content_ref stays for external refs);
-- required modules gate the Case Simulator.
alter table training_modules
  add column slug text unique,
  add column content_md text,
  add column required boolean not null default true,
  add column est_minutes int;

-- Certification burn state is derivable from accreditation_attempts, but the
-- lock is explicit and immutable once written.
create table certification_locks (
  user_id uuid primary key references users (id) on delete cascade,
  locked_at timestamptz not null default now(),
  evidence_packet_json jsonb not null,
  rubric_version text not null
);
alter table certification_locks enable row level security;
create policy cert_locks_select on certification_locks for select to authenticated
  using (
    user_id = auth.uid()
    or public.is_platform_admin()
    or (public.user_org(user_id) is not null
        and public.user_org(user_id) = public.current_org_id()
        and public.is_org_staff())
  );
-- writes: server-side only (service role); no authenticated write policy.
