-- Removes the two-org RLS test fixtures.
delete from audit_log where action in ('orgA.action', 'orgB.action');
delete from documentation_records where id = '12121212-1212-4121-8121-121212121212';
delete from case_instances where id = '88888888-8888-4888-8888-888888888888';
delete from org_case_access where org_id = '44444444-4444-4444-8444-444444444444';
delete from case_templates where case_code like 'TT-%';
delete from srd_documents where id = '77777777-7777-4777-8777-777777777777';
delete from users where id in ('11111111-1111-4111-8111-111111111111', '22222222-2222-4222-8222-222222222222');
delete from auth.users where id in ('11111111-1111-4111-8111-111111111111', '22222222-2222-4222-8222-222222222222');
delete from organizations where id in ('33333333-3333-4333-8333-333333333333', '44444444-4444-4444-8444-444444444444');
drop table if exists public._rls_test_results;
