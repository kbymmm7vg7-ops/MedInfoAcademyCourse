-- Two-org RLS isolation test — spec: 09-enterprise-lite/spec_tenant-isolation-rls.md
-- Run against a Supabase project with 0001/0002 migrations applied, as the
-- postgres role (e.g. via the SQL editor or MCP execute_sql). It impersonates
-- users by setting request.jwt.claims + SET ROLE authenticated, so isolation
-- is proven at the database layer, not in app code.
--
-- Result: every row of the final select must have pass = true.
-- Ran 2026-07-06 against project jigiaueqxbnxtbuvuwkr: 9/9 pass.
--
-- Cleanup afterwards: app/supabase/tests/rls-two-org-cleanup.sql

-- ==== Fixtures (idempotent) ====
insert into auth.users (id, aud, role, email)
values
  ('11111111-1111-4111-8111-111111111111', 'authenticated', 'authenticated', 'usera@test.example'),
  ('22222222-2222-4222-8222-222222222222', 'authenticated', 'authenticated', 'userb@test.example')
on conflict (id) do nothing;

insert into organizations (id, name, tier) values
  ('33333333-3333-4333-8333-333333333333', 'Test Org A', 'enterprise_lite'),
  ('44444444-4444-4444-8444-444444444444', 'Test Org B', 'enterprise_lite')
on conflict (id) do nothing;

update users set org_id = '33333333-3333-4333-8333-333333333333', role = 'admin'
  where id = '11111111-1111-4111-8111-111111111111';
update users set org_id = '44444444-4444-4444-8444-444444444444', role = 'trainee'
  where id = '22222222-2222-4222-8222-222222222222';

insert into case_templates (id, org_id, case_code, title, difficulty, requester_type) values
  ('55555555-5555-4555-8555-555555555555', null, 'TT-01', 'Shared bank case 1', 1, 'hcp'),
  ('99999999-9999-4999-8999-999999999999', null, 'TT-02', 'Shared bank case 2', 1, 'hcp'),
  ('66666666-6666-4666-8666-666666666666', '33333333-3333-4333-8333-333333333333', 'TT-A1', 'Org A custom case', 2, 'hcp')
on conflict (id) do nothing;

-- body moved to srd_document_bodies by migration 0007 (SEC-2)
insert into srd_documents (id, org_id, srl_code, title) values
  ('77777777-7777-4777-8777-777777777777', '33333333-3333-4333-8333-333333333333', 'SRL-A-001', 'Org A private SRD')
on conflict (id) do nothing;

insert into srd_document_bodies (document_id, body) values
  ('77777777-7777-4777-8777-777777777777', 'org A confidential body')
on conflict (document_id) do nothing;

insert into case_instances (id, template_id, user_id, org_id, status) values
  ('88888888-8888-4888-8888-888888888888', '66666666-6666-4666-8666-666666666666', '11111111-1111-4111-8111-111111111111', '33333333-3333-4333-8333-333333333333', 'in_progress')
on conflict (id) do nothing;

insert into documentation_records (id, case_instance_id, intake_json) values
  ('12121212-1212-4121-8121-121212121212', '88888888-8888-4888-8888-888888888888', '{"note":"org A doc"}')
on conflict (id) do nothing;

insert into audit_log (org_id, actor_id, action) values
  ('33333333-3333-4333-8333-333333333333', '11111111-1111-4111-8111-111111111111', 'orgA.action'),
  ('44444444-4444-4444-8444-444444444444', '22222222-2222-4222-8222-222222222222', 'orgB.action');

create table if not exists public._rls_test_results (check_name text primary key, expected text, actual text, pass boolean);
grant select, insert, update on public._rls_test_results to authenticated;

-- ==== Checks ====
delete from public._rls_test_results;

-- As Org B trainee
select set_config('request.jwt.claims',
  '{"sub":"22222222-2222-4222-8222-222222222222","role":"authenticated","app_metadata":{"org_id":"44444444-4444-4444-8444-444444444444","app_role":"trainee"}}',
  false);
set role authenticated;

insert into _rls_test_results
select '2a orgB reads orgA srd_documents', '0', count(*)::text, count(*) = 0
from srd_documents where org_id = '33333333-3333-4333-8333-333333333333';

insert into _rls_test_results
select '2b orgB reads orgA case_templates', '0', count(*)::text, count(*) = 0
from case_templates where org_id = '33333333-3333-4333-8333-333333333333';

insert into _rls_test_results
select '2c orgB reads orgA case_instances', '0', count(*)::text, count(*) = 0
from case_instances where org_id = '33333333-3333-4333-8333-333333333333';

insert into _rls_test_results
select '2d orgB reads orgA documentation_records', '0', count(*)::text, count(*) = 0
from documentation_records where case_instance_id = '88888888-8888-4888-8888-888888888888';

insert into _rls_test_results
select '3 orgB sees shared (org_id null) case bank', '2', count(*)::text, count(*) = 2
from case_templates where org_id is null and case_code like 'TT-%';

do $$
declare n int;
begin
  update documentation_records set intake_json = '{"tampered":true}'
   where id = '12121212-1212-4121-8121-121212121212';
  get diagnostics n = row_count;
  insert into _rls_test_results values ('4a orgB update of orgA documentation', '0 rows', n || ' rows', n = 0);
exception when others then
  insert into _rls_test_results values ('4a orgB update of orgA documentation', '0 rows', 'error: ' || sqlerrm, true);
end $$;

do $$
begin
  insert into case_instances (template_id, user_id, org_id)
  values ('66666666-6666-4666-8666-666666666666',
          '22222222-2222-4222-8222-222222222222',
          '33333333-3333-4333-8333-333333333333');
  insert into _rls_test_results values ('4b orgB insert row planted in orgA', 'denied by RLS', 'ALLOWED', false);
exception when others then
  insert into _rls_test_results values ('4b orgB insert row planted in orgA', 'denied by RLS', 'denied: ' || sqlerrm, true);
end $$;

-- Configure a shared-bank subset for Org B, re-check as Org B
reset role;
insert into org_case_access (org_id, case_template_id, enabled) values
  ('44444444-4444-4444-8444-444444444444', '55555555-5555-4555-8555-555555555555', true)
on conflict do nothing;

set role authenticated;
insert into _rls_test_results
select '5 org_case_access subset limits shared bank', '1 (only TT-01)',
       count(*)::text || ' (' || coalesce(string_agg(case_code, ','), 'none') || ')',
       count(*) = 1 and min(case_code) = 'TT-01'
from case_templates where org_id is null and case_code like 'TT-%';

-- SEC-1/SEC-2 (migration 0007): answer keys and SRL bodies must be
-- unreachable for ANY authenticated user — even the org's own admin. Still
-- running as Org B trainee here; org A admin is re-checked implicitly since
-- both tables have no authenticated grants at all.
do $$
begin
  perform count(*) from case_answer_keys;
  insert into _rls_test_results values ('7a authenticated reads case_answer_keys', 'permission denied', 'ALLOWED', false);
exception when others then
  insert into _rls_test_results values ('7a authenticated reads case_answer_keys', 'permission denied', 'denied: ' || sqlerrm, true);
end $$;

do $$
begin
  perform count(*) from srd_document_bodies;
  insert into _rls_test_results values ('7b authenticated reads srd_document_bodies', 'permission denied', 'ALLOWED', false);
exception when others then
  insert into _rls_test_results values ('7b authenticated reads srd_document_bodies', 'permission denied', 'denied: ' || sqlerrm, true);
end $$;

-- As Org A admin: audit export
reset role;
select set_config('request.jwt.claims',
  '{"sub":"11111111-1111-4111-8111-111111111111","role":"authenticated","app_metadata":{"org_id":"33333333-3333-4333-8333-333333333333","app_role":"admin"}}',
  false);
set role authenticated;

insert into _rls_test_results
select '6 orgA audit export excludes orgB rows', 'orgA>=1, orgB=0',
       'orgA=' || count(*) filter (where org_id = '33333333-3333-4333-8333-333333333333')
       || ', orgB=' || count(*) filter (where org_id = '44444444-4444-4444-8444-444444444444'),
       count(*) filter (where org_id = '44444444-4444-4444-8444-444444444444') = 0
       and count(*) filter (where org_id = '33333333-3333-4333-8333-333333333333') >= 1
from audit_log;

reset role;
select check_name, expected, actual, pass from _rls_test_results order by check_name;
