-- MedInfo Academy — initial schema
-- Implements PRD §8 plus the deltas in 09-enterprise-lite/spec_tenant-isolation-rls.md:
--   case_instances.variant_snapshot_json, accreditation_attempts.variant_ref,
--   evaluation_scores.rubric_version, org_case_access, audit_log.org_id

create extension if not exists vector;

-- Enums
create type user_role as enum ('trainee', 'trainer', 'qa', 'admin', 'platform_admin');
create type org_tier as enum ('b2c', 'enterprise_lite', 'enterprise');
create type confidentiality_tier as enum ('standard', 'firewall');
create type case_channel as enum ('chat', 'voice');
create type case_status as enum ('not_started', 'in_progress', 'documenting', 'submitted', 'evaluated', 'closed');
create type turn_speaker as enum ('persona', 'trainee');
create type attempt_type as enum ('practice', 'certification');
create type outline_status as enum ('not_started', 'drafted', 'reviewed', 'approved');

-- Tenancy
create table organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  tier org_tier not null default 'enterprise_lite',
  sop_corpus_id uuid,
  competency_framework_id uuid,
  confidentiality_tier confidentiality_tier not null default 'standard',
  google_drive_folder_ref text,
  created_at timestamptz not null default now()
);

-- App users; id mirrors auth.users. org_id null = B2C individual.
create table users (
  id uuid primary key references auth.users (id) on delete cascade,
  org_id uuid references organizations (id),
  role user_role not null default 'trainee',
  competency_level text,
  full_name text,
  email text,
  created_at timestamptz not null default now()
);

-- Content
create table case_templates (
  id uuid primary key default gen_random_uuid(),
  org_id uuid references organizations (id), -- null = shared B2C bank
  case_code text unique,                     -- e.g. SC-03
  title text not null,
  difficulty int not null check (difficulty between 1 and 6),
  requester_type text not null,
  solicited_flag boolean not null default false,
  product_ref text,
  is_fictional_product boolean not null default true,
  ground_truth_json jsonb,                   -- answer key (schema: answer-key.schema.json)
  seed_or_generated text not null default 'seed' check (seed_or_generated in ('seed', 'generated')),
  therapeutic_area text,
  outline_status outline_status not null default 'not_started',
  stt_tts_verified boolean not null default false,
  rubric_approved boolean not null default false,
  created_at timestamptz not null default now()
);

create table srd_documents (
  id uuid primary key default gen_random_uuid(),
  org_id uuid references organizations (id), -- null = shared bank
  srl_code text,                             -- e.g. SRL-PUL-004
  title text not null,
  therapeutic_area text,
  body text not null,
  embedding vector(1536),
  is_decoy_eligible boolean not null default true,
  created_at timestamptz not null default now()
);

create table detection_rulesets (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations (id),
  product_ref text not null,
  custom_ae_criteria_json jsonb,
  custom_pc_criteria_json jsonb,
  special_situations_json jsonb,
  off_label_boundaries_json jsonb
);

create table training_modules (
  id uuid primary key default gen_random_uuid(),
  org_id uuid references organizations (id), -- null = shared
  title text not null,
  content_ref text,
  order_index int not null default 0
);

-- Per-org subset of the shared case bank (RLS-spec delta)
create table org_case_access (
  org_id uuid not null references organizations (id),
  case_template_id uuid not null references case_templates (id),
  enabled boolean not null default true,
  primary key (org_id, case_template_id)
);

-- Activity
-- org_id denormalized from users.org_id at insert for direct RLS predicates.
create table case_instances (
  id uuid primary key default gen_random_uuid(),
  template_id uuid not null references case_templates (id),
  user_id uuid not null references users (id),
  org_id uuid references organizations (id),
  status case_status not null default 'not_started',
  channel case_channel not null default 'chat',
  variant_snapshot_json jsonb,               -- RLS-spec delta: frozen generated variant
  started_at timestamptz,
  closed_at timestamptz,
  created_at timestamptz not null default now()
);

create table conversation_turns (
  id uuid primary key default gen_random_uuid(),
  case_instance_id uuid not null references case_instances (id) on delete cascade,
  speaker turn_speaker not null,
  content text not null,
  ts timestamptz not null default now(),
  flags_detected_json jsonb
);

create table documentation_records (
  id uuid primary key default gen_random_uuid(),
  case_instance_id uuid not null references case_instances (id) on delete cascade,
  intake_json jsonb,
  inquiry_json jsonb,
  safety_json jsonb,
  response_json jsonb,
  closure_json jsonb,
  submitted_at timestamptz
);

create table evaluation_scores (
  id uuid primary key default gen_random_uuid(),
  case_instance_id uuid not null references case_instances (id) on delete cascade,
  dimension text not null,
  score numeric,
  rationale text,
  evaluator_version text,
  rubric_version text not null,              -- RLS-spec delta
  created_at timestamptz not null default now()
);

create table competency_records (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users (id),
  competency text not null,
  level text,
  evidence_case_ids uuid[] not null default '{}'
);

create table accreditation_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users (id),
  assessment_id uuid,
  case_template_id uuid references case_templates (id),
  attempt_type attempt_type not null,
  is_first_attempt_on_case boolean not null default true,
  variant_ref text,                          -- RLS-spec delta: which generated variant was served
  score numeric,
  pass_bool boolean,
  remediation_plan_json jsonb,
  completed_at timestamptz,
  created_at timestamptz not null default now()
);

-- Cohorts (enterprise lite)
create table cohorts (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations (id),
  name text not null,
  start_date date,
  end_date date,
  curriculum_id uuid,
  accreditation_scheduled_at timestamptz
);

create table cohort_members (
  id uuid primary key default gen_random_uuid(),
  cohort_id uuid not null references cohorts (id) on delete cascade,
  user_id uuid not null references users (id),
  unique (cohort_id, user_id)
);

create table user_training_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users (id),
  module_id uuid not null references training_modules (id),
  completed_at timestamptz not null default now(),
  unique (user_id, module_id)
);

create table audit_log (
  id bigint generated always as identity primary key,
  org_id uuid references organizations (id), -- RLS-spec delta
  actor_id uuid,
  action text not null,
  target_type text,
  target_id text,
  ts timestamptz not null default now()
);

-- Indexes for the hot paths
create index idx_users_org on users (org_id);
create index idx_case_templates_org on case_templates (org_id);
create index idx_srd_documents_org on srd_documents (org_id);
create index idx_case_instances_user on case_instances (user_id);
create index idx_case_instances_org on case_instances (org_id);
create index idx_turns_instance on conversation_turns (case_instance_id);
create index idx_docs_instance on documentation_records (case_instance_id);
create index idx_scores_instance on evaluation_scores (case_instance_id);
create index idx_attempts_user on accreditation_attempts (user_id);
create index idx_audit_org on audit_log (org_id);

-- Mirror new auth signups into public.users (B2C default: no org, trainee)
create or replace function handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data ->> 'full_name', ''))
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_auth_user();
