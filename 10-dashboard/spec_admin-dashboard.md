# Admin Dashboard (Session S7) — Design Spec

*Written by Fable, 2026-07-07, at Nathan's direction. This is the authoritative spec for the S7 admin
session; it supersedes the shorter RUNBOOK S7 prompt where they differ. Companion startup doc:
`00-build/NEXT-SESSION-S7.md`. Operating context: `00-build/HANDOFF-OPUS.md` (attach both).*

## 0. Decisions of record (Nathan, 2026-07-07)

1. **Sequencing**: S4 (evaluator calibration) runs next per `00-build/NEXT-SESSION-S4.md`; S7 runs
   after S4 (and S5 voice, if Nathan runs it first — S7 has no dependency on S5).
2. **SEC-1/SEC-2 bundled as S7 step 0**: the answer-key/SRL-body exposure fix lands at the start of
   this session, and the admin screens are built on the hardened layer.
3. **Scope = Admin UI + Cohort Lite + pending-evaluations view.** The full Manager Dashboard
   (heatmap/trend/drill-in, PRD §5.5) stays V2 — do not build it.
4. **SEC-7 cert expiry = void, don't burn** (24h window). An expired pending certification sitting is
   voided: it does not count as the first attempt and the scenario returns to the eligible pool.

## 1. What exists already (verified 2026-07-07 — build on it, don't recreate)

- **Tables (migration 0001)**: `organizations`, `users` (role enum incl. `admin`, `platform_admin`),
  `case_templates`, `srd_documents`, `training_modules`, `org_case_access`, `case_instances`,
  `conversation_turns`, `documentation_records`, `evaluation_scores`, `competency_records`,
  `accreditation_attempts`, `cohorts`, `cohort_members`, `user_training_progress`,
  `audit_log(id, org_id, actor_id, action, target_type, target_id, ts)`; `certification_locks` (0005).
  **Cohort and audit tables exist — no new tables needed except `case_answer_keys` (step 0).**
- **Role plumbing**: `src/lib/auth/get-user-role.ts` (`AppRole`, `isManagerRole`, fails safe to
  `trainee`); manager stub at `src/app/(app)/manager/page.tsx`; nav gating in `(app)/layout.tsx`.
- **Guards**: `users_no_self_escalation` trigger (fn `prevent_privilege_escalation`, 0002) blocks
  self-service role/org changes; it exempts `auth.uid() IS NULL` (service context) — see SEC-6.
- **Audit RLS** (0002): org-partitioned reads; inserts carry the actor's own identity/org. Nothing
  writes to `audit_log` yet except the RLS test (SEC-5).
- **Ground-truth firewall**: `src/lib/simulator/case-brief.ts` is the sole sanctioned reader of
  `case_templates.ground_truth_json` (narrow read in `queue.ts`); enforced by convention only (SEC-9).
- **XSS-safe markdown renderer**: `src/lib/training/markdown.ts` — all training content renders
  through it; never introduce a raw-HTML editor.
- **Cert machinery**: `lib/cert/variant-engine.ts` (deterministic, seeded — do not touch),
  `lib/cert/logic.ts` (pure burn/lock/eligibility), `lib/cert/actions.ts` (sittings).
- **Service client**: `lib/supabase/admin.ts` (throws clearly if `SUPABASE_SERVICE_ROLE_KEY` missing).

## 2. Step 0 — SEC-1/SEC-2 hardening (P0, before any admin screens)

**Problem** (HANDOFF §4): any authenticated user can read every case's `ground_truth_json`,
`persona_brief_json`, `scripted_transcript_json`, and every `srd_documents.body` via direct PostgREST
with the anon key + their JWT. The app-layer firewall doesn't protect the REST endpoint.

**Fix — preferred design (table split):**
1. Migration `0007_answer_key_isolation.sql`:
   - `create table case_answer_keys (template_id uuid primary key references case_templates(id) on delete cascade, ground_truth_json jsonb not null, persona_brief_json jsonb, scripted_transcript_json jsonb)`.
   - Copy data across, then `alter table case_templates drop column` for all three.
   - `alter table case_answer_keys enable row level security` with **NO policies for
     `authenticated`/`anon`** — service-role/postgres only. Same pattern for SRL bodies: either move
     `srd_documents.body` to `srd_document_bodies(document_id pk/fk, body)` (preferred, same
     no-policy RLS) or, minimally, column-level `REVOKE SELECT (body)` — but verify PostgREST
     behavior with `select=*` before choosing the revoke path; if in doubt, split the table.
2. Update the sanctioned readers to go through the service client (`lib/supabase/admin.ts`) —
   they are all server-side already: `lib/simulator/case-brief.ts`, `lib/simulator/queue.ts`
   (narrow read), `lib/cert/actions.ts`, evaluator assembly, and the S7 admin ground-truth editor.
   Do NOT use SECURITY DEFINER functions that touch `users` (SEC-6 bypasses the escalation guard);
   for these tables plain service-role reads are simpler and sufficient.
3. Update the idempotent seeds (`app/supabase/seed/seed_s2.sql`, `seed_s3_persona_briefs.sql`) to
   write the new tables; re-run them. **Fold in the SC-11 re-seed** if S4 hasn't already done it
   (the approved lay `detail_withheld` wording in `01-seed-cases/SC-11.answer-key.json` must match
   the DB row — check first).
4. **Verify**: curl PostgREST directly with the anon key + a trainee JWT
   (`nite414+s1test@gmail.com` test user) selecting the moved columns/tables → expect zero
   rows/permission error. Extend `app/supabase/tests/rls-two-org-test.sql` with these probes.
   Re-run the full app E2E (simulator brief, persona turn, cert variant, training gate) — every
   sanctioned reader changed, so this is the regression that matters.
5. **SEC-9 CI grep**: add a lightweight check (vitest or a script wired into `npm run build`) that
   `ground_truth_json` appears only in `case-brief.ts`, migrations, seeds, and the admin
   ground-truth editor. Fails the build otherwise.

## 3. Access model & routing

- **Routes**: `/admin/*` route group with a **server-side role check in the layout**
  (`src/app/(app)/admin/layout.tsx` or a separate group) — check `getUserRole()` and `notFound()`
  (404, not redirect-to-login) for anything below `admin`. Nav links are hidden for non-admins, but
  hiding is cosmetic; the layout check is the gate. Note `getUserRole` fails safe to `trainee`.
- **Two admin tiers**: `platform_admin` sees everything, all orgs. `admin` (org admin) sees only
  their org's rows — RLS already partitions; the UI must scope queries and surface clean RLS errors
  rather than empty mystery states.
- **Trainer/QA**: no `/admin` access; they get the Cohort Lite view (module 7) under
  `/manager` (extend the existing stub), gated by `isManagerRole`.
- **Every admin mutation writes `audit_log`** (actor_id, action, target_type, target_id, org_id).
  Build one helper (`src/lib/audit/log.ts`, service-role write) and use it everywhere — including
  the cert-lock write in `evaluate.ts#persistEvaluation`, ground-truth edits, and role changes
  (SEC-5 closure).

## 4. Modules (priority order)

### 4.1 Training module management
List/edit `training_modules`. Platform_admin edits shared rows (`org_id IS NULL`); org admin edits
only their org's rows (RLS enforces; surface clean errors). Edit `content_md` in a textarea with
live preview through `src/lib/training/markdown.ts` (no raw-HTML editor). Reorder via
`order_index`; toggle `required`; create new modules; **per-org tailored copies** = duplicate row
with `org_id` set, and org rows **shadow shared ones by slug** for that org's trainees — implement
the shadowing in the training loaders (`lib/training/modules.ts`), where it doesn't exist yet.

### 4.2 Scenario adjustment / case bank + content status board
List `case_templates` with the PRD §4 content-status board columns: `outline_status`,
`stt_tts_verified`, `rubric_approved`. Surface fields (title, difficulty, therapeutic_area,
product_ref) edit freely. **Ground-truth edits are gated**: the editor (server-side, service-role —
this becomes a sanctioned `case_answer_keys` reader/writer) validates the edited key with ajv
against a vendored copy of `01-seed-cases/answer-key.schema.json`, and on save flips
`rubric_approved = false` and writes an `audit_log` row. The UI must state plainly that answer keys
are Nathan-sign-off artifacts (RUNBOOK standing rule) and editing de-approves the case.

### 4.3 Custom scenario intake (enterprise)
Guided form creating org-scoped `case_templates` (`org_id` set; `is_fictional_product` false
allowed): case brief fields, answer-key builder matching the schema, persona brief
(premise/profile/beat sheet), org SRLs (`srd_documents` with `org_id`; bodies go to the hardened
store from step 0). New custom cases start `outline_status='drafted'`, `rubric_approved=false`, and
are **excluded from trainee queues until approved** — extend the queue and accreditation loaders to
filter on `rubric_approved` (they currently don't; HANDOFF known gap). That loader change is
load-bearing for the DoD.

### 4.4 User/roster management
Org admin: list/deactivate users in their org, assign roles `trainee|trainer|qa` (never admin+ —
the `users_no_self_escalation` trigger backstops, but the UI shouldn't offer it). Platform_admin:
manage `organizations` and `org_case_access` (which shared cases each org sees — the queue loader
already respects it; verify, don't assume). Role changes write `audit_log`.

### 4.5 Confidentiality tier config
`organizations.confidentiality_tier`, platform_admin only. Plain select + audit write.

### 4.6 Pending evaluations view (SEC-4)
`submitCase` deliberately swallows evaluation failures, so outages leave instances silently
"submitted". Admin list of submitted-but-unevaluated `case_instances` (submitted status, no
`evaluation_scores` row), with per-row **retry** that re-invokes the server-side evaluation
pipeline (`evaluate.ts`), plus structured logging on the original failure path. Platform_admin sees
all orgs; org admin their own.

### 4.7 Cohort Lite (trainer-facing, under `/manager`)
Tables exist (`cohorts`, `cohort_members`). Build: create cohort (name, start/end dates), **CSV
roster upload** (emails → match/create `users` rows in the org, per PRD §5.5a — no SSO/SCIM), and
the Cohort Lite table: roster × cases completed × average score per trainee (from `case_instances`
+ `evaluation_scores`). A thin table a trainer checks daily — **no heatmap, no trends** (V2).
Accessible to `trainer|qa|admin` of the org.

### 4.8 Cert sitting expiry (SEC-7 — decided: void, don't burn)
Sittings not submitted within **24h** of start are voided: status `voided`, does **not** count as
the first attempt, does **not** burn the scenario, template returns to the eligible pool. Implement
the rule in `lib/cert/logic.ts` as pure logic (with vitest), enforce lazily at the eligibility
check in `lib/cert/actions.ts` (no cron needed: expired-pending is treated as void on next read and
persisted then), write an `audit_log` row when a void is persisted. Do not modify the variant
engine or `certification_locks` semantics (insert-only, service-role).

## 5. Invariants (HANDOFF §3 — restated for this session)

1. Answer keys never reach the browser — after step 0 this is DB-enforced; the admin ground-truth
   editor renders keys server-side to admins only and becomes the one new sanctioned reader.
2. Markdown renders only through the escaping renderer; no raw-HTML editing anywhere.
3. Variant engine stays deterministic and untouched; answer keys never mutated by variants.
4. `certification_locks` insert-only, service-role-only.
5. Persona prompt untouched (any edit would force a transcript-test re-run — out of scope here).
6. Nathan's sign-off gates stand: a `rubric_approved` flip to true for a *new/edited* key is
   Nathan's action (the UI can offer the toggle to platform_admin with a confirm that names him).
7. No vendor/employer names anywhere, including seed/fixture data for admin screens.

## 6. Opus / Sonnet split

**Opus owns**: step 0 entirely (migration, reader refactor, verification curl, CI grep); the
`/admin` role-gating layout; the ground-truth edit gate + ajv + audit write; the queue/accreditation
`rubric_approved` filter change; cert expiry logic (4.8); the audit helper; final security review
pass (grep for new `ground_truth_json`/`body` reads).
**Sonnet gets**: all screens/forms/tables (4.1 UI, 4.2 board UI, 4.3 form, 4.4, 4.5, 4.6 list UI,
4.7 CSV upload + table), seed data for a demo org/cohort, loader shadowing implementation under
Opus review. Sonnet subagent quota note: shared with account, resets 4am America/Chicago.

## 7. Definition of done

- Direct PostgREST probes with anon key + trainee JWT return zero answer-key/SRL-body data (SEC-1/2
  closed); full app E2E still green after the reader refactor; vitest green (37 + new cert-expiry
  and logic tests); CI grep in place.
- Org admin can tailor a training module (shadowing works for their trainees) and draft a custom
  scenario that stays invisible to trainee queues until `rubric_approved`.
- Platform_admin can reorder/edit shared modules, edit a surface field freely, edit a ground-truth
  key only through the gate (flips approval + audits), flip org case access, and see every admin
  mutation in `audit_log`.
- Trainer sees the Cohort Lite table for a CSV-uploaded roster; unauthorized roles get 404 on
  `/admin/*`; an artificially-expired cert sitting voids without burning and the template is
  re-eligible.
