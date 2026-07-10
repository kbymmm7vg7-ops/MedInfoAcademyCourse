-- ===========================================================================
-- 0007_answer_key_isolation.sql — SEC-1 / SEC-2 hardening (S7 step 0)
--
-- Problem: ground_truth_json / persona_brief_json / scripted_transcript_json
-- on case_templates and srd_documents.body were selectable by ANY
-- authenticated user via direct PostgREST with the anon key + their JWT.
-- The app-layer ground-truth firewall (lib/simulator/case-brief.ts) does not
-- protect the REST endpoint.
--
-- Fix (table split, spec_admin-dashboard.md §2): move the secret columns to
-- service-role-only side tables with RLS enabled and NO policies for
-- authenticated/anon, plus a belt-and-braces privilege REVOKE. The service
-- client (lib/supabase/admin.ts) bypasses RLS; sanctioned readers switch to it.
-- ===========================================================================

-- --- 1. case_answer_keys -----------------------------------------------------
create table case_answer_keys (
  template_id uuid primary key references case_templates (id) on delete cascade,
  ground_truth_json jsonb not null,
  persona_brief_json jsonb,
  scripted_transcript_json jsonb,
  updated_at timestamptz not null default now()
);

insert into case_answer_keys (template_id, ground_truth_json, persona_brief_json, scripted_transcript_json)
select id, ground_truth_json, persona_brief_json, scripted_transcript_json
from case_templates
where ground_truth_json is not null;

alter table case_templates
  drop column ground_truth_json,
  drop column persona_brief_json,
  drop column scripted_transcript_json;

-- RLS on, and deliberately NO policies for authenticated/anon: only the
-- service role (bypasses RLS) and postgres can touch this table.
alter table case_answer_keys enable row level security;
revoke all on table case_answer_keys from anon, authenticated;

-- --- 2. srd_document_bodies --------------------------------------------------
create table srd_document_bodies (
  document_id uuid primary key references srd_documents (id) on delete cascade,
  body text not null,
  updated_at timestamptz not null default now()
);

insert into srd_document_bodies (document_id, body)
select id, body from srd_documents;

alter table srd_documents drop column body;

alter table srd_document_bodies enable row level security;
revoke all on table srd_document_bodies from anon, authenticated;
