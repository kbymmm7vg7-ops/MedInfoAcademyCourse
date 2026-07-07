# RUNBOOK — MedInfo Academy Build (post-Fable)

Written by Fable for Nathan to execute across separate Claude Code sessions after Fable access ends.
Opus 4.8 is the orchestrator (run each session with Opus); it dispatches Sonnet subagents for routine
work. You run the prompts; the agents do the work. Sign-off gates are yours.

## Standing rules for every session
- **Model**: start the session in **Opus 4.8**. Tell it explicitly: *"Dispatch routine, well-specified work (CRUD screens, forms, migrations, content tailoring, seed-data scripts) to Sonnet 5 subagents; do the complex judgment work (persona engine, evaluator, cert logic, RLS, voice) yourself."*
- **Always attach**: `RUNBOOK.md`, `00-build/BUILD-PLAN.md`, and the numbered stage folder for that session.
- **Runtime model policy** (in-product, not the build agent): Sonnet 5 for the evaluator and graded/certification personas; Haiku 4.5 only for ungraded practice personas and the coaching agent. Put this in the app config, not hardcoded per call.
- **Blocker rule**: tell each session *"if required content is missing or ambiguous, stop and write `BLOCKERS.md` — do not invent medical content or answer keys."*
- **Sign-off gates**: you personally approve (a) the rubric schema, (b) all 12 seed-case answer keys, (c) the evaluator calibration before certification mode goes live. These are the credibility foundation.

## Pre-flight (already done by Fable — verify these exist)
- `02-rubric-schema/`: `rubric-scorecard-v1.md`, `rubric.schema.json`, `scoring-contract.md`
- `01-seed-cases/`: `_case-template.md`, `answer-key.schema.json`, `simulation-sop.md`, `fictional-product-bank.md`, `case-addenda.md` (categories + fake contacts), `SC-01`…`SC-12` markdown, `SC-03.answer-key.json` (format lock)
- specs: `08-accreditation-cert/spec_certification-logic.md`, `09-enterprise-lite/spec_tenant-isolation-rls.md`, `06-voice-layer/spec_voice-pipeline.md`
- **Your first action**: read the 12 seed cases (`SC-01`…`SC-12`) + `case-addenda.md` and sign off (or annotate) the answer keys. Then rename `General Scenario/Rubric/Rurbic Scorecard Draft.md` → keep as-is (it's the original); the platform contract is the v1 in `02-rubric-schema/`.

---

## Session S1 — Scaffold, DB, auth (Opus; most work → Sonnet)
**Attach**: stage folders `01`, `02`, `04`, `09` + the two schema specs.
**Prompt**:
> Scaffold the project. git init this folder and push to `kbymmm7vg7-ops/MedInfoAcademyCourse` (currently empty). Create a Next.js app (App Router, TS) + Supabase. Create a **new Supabase project on the free tier** via the Supabase MCP; if the free two-project limit blocks it, delete the `Scanmons` project first (pre-authorized). Write the initial migration implementing PRD §8 schema **plus the deltas in `09-enterprise-lite/spec_tenant-isolation-rls.md`** (variant_snapshot_json, variant_ref, rubric_version, org_case_access, audit_log.org_id). Implement **RLS per that spec** and write the two-org isolation test. Add Supabase auth (B2C email signup/login) and an app shell with the §4 nav. Convert the 12 seed-case markdown answer keys into `*.answer-key.json` per `answer-key.schema.json` (SC-03 is the format lock; fold in `inquiry_category` and `inquirer_contact` from `case-addenda.md`) — Sonnet does the conversion, you review that ground truth wasn't altered. Dispatch CRUD/migration/auth-screen work to Sonnet; you own the RLS design and test.
**Definition of done**: app boots, login works, migration applied, RLS two-org test passes, 10 answer-key JSONs committed.

## Session S2 — Documentation Simulator UI (Opus; mostly Sonnet)
**Attach**: `03`, `01`, `02`.
**Prompt**:
> Build the Documentation Simulator (PRD §5.2): case queue + the Intake/Inquiry/Safety/Response/Closure tabbed record, four-element AE gating that auto-expands, dual AE+PC routing fields, SRL search/select with preloaded decoys, open-book/closed-book toggle. **Intake must include an Inquiry Category dropdown — Indication · Efficacy · Safety · Pharmacokinetics · Drug-Interactions · Other** (trains categorization; correct value per case in `case-addenda.md`, scored at S4.12), and contact fields that adapt to requester type (HCP/AE/PC = full address; patient/consumer = city+state or postal), prefilled in seed data from `case-addenda.md`. Wire it to a **static scripted case first (no AI yet)** to nail workflow UX. Seed the DB from the 12 seed cases + fictional product/SRL bank. Route "Submit for Review" to a stub. Dispatch the form/queue/seed-script work to Sonnet.
**Definition of done**: a trainee can open a scripted case, fill all tabs, select an SRL among decoys, toggle open/closed-book, and submit.

## Session S3 — Persona engine + validator (Opus does this itself)
**Attach**: `05`, `01`, `02`.
**Prompt**:
> Implement the Persona Agent (PRD §9.2) in **text mode** against the 12 seed cases, per the **listen-and-clarify model** in `scoring-contract.md` (MI does NOT probe/solicit AEs). The persona **volunteers** each case's `reveal_rules.cue` as an offhand mention in natural conversation, and reveals the withheld detail **only** when the trainee catches that cue and clarifies it (`reveal_rules.surfaces_when`) — it must not hide the fact behind a required interrogation, and must not reward a trainee who fishes for symptoms the caller never raised (SC-03/SC-04/SC-08/SC-12 embedded AEs and SC-11 embedded LOE are the key cue-catch tests; SC-01/SC-09 test not-over-flagging). Use Sonnet 5 as the runtime persona model for graded cases. Then implement the rules-based Documentation Validator (PRD §9.4 / `scoring-contract.md` §7): required-field presence, spelling count, date match, timeframe arithmetic, lot/NDC capture, and the "AE in transcript but not documented" check. Write the automated transcript test: catching + clarifying the volunteered cue surfaces the AE 12/12; letting the cue pass never surfaces it.
**Definition of done**: cue-catch-then-clarify reveal works on all 12 cases; validator produces deterministic findings.

### → CHECKPOINT A (**Fable** — Nathan runs this in a Fable session)
Bring Fable: the RLS two-org test output + the persona transcript-test results on the cue-catch cases
(SC-03/04/08/11/12). Fable reviews tenant-isolation correctness and whether the persona honors the
listen-and-clarify model (volunteers cues, doesn't hide behind interrogation, doesn't reward fishing).
Fable gives an explicit go/no-go before the evaluator is built.

## Session S4 — Evaluation Agent (Opus itself)
**Attach**: `07`, `02`, `01` (incl. the gold documentation examples).
**Prompt**:
> Implement the Evaluation Agent (PRD §9.5) scoring **transcript + documentation jointly** against `rubric.schema.json` per `scoring-contract.md`. Output must validate against the schema, cite verbatim evidence for every fail, and never fail a criterion without evidence. Runtime model: Sonnet 5. Run all 12 gold documentation examples → each must produce `pass`; run each case's `common_failures` → each must produce the listed Critical fail. Produce a calibration report (12 outputs) for Nathan's blind-scoring gate.
**Definition of done**: 12/12 gold examples pass; regression failures trip the right Critical criteria; calibration report generated.
**Your gate**: blind-score the 10 outputs against the scorecard. Ship only if zero Critical-criterion disagreements, ≤1 Major/case. Otherwise loop the evaluator prompt and re-run.

## Session S5 — Voice baseline (Opus itself)
**Attach**: `06`, `01`.
**Prompt**:
> Implement the voice pipeline per `06-voice-layer/spec_voice-pipeline.md`: mic capture → VAD → **Groq Whisper v3 Turbo** STT (adapter) → persona reasoning → **ElevenLabs (free tier)** TTS (adapter) → audio + CC strip; the large-doc-panel voice layout (§7); mic-permission-at-Start with text fallback. Instrument per-turn latency (target <3s). **Budget the ElevenLabs free quota (~10 min/month): iterate with short utterances, run the one full-case voice demo last.** Keep STT/TTS behind adapters so production vendors swap in later.
**Definition of done**: one seed case completed end-to-end by voice on laptop mic, captions correct, latency logged.

## Session S6 — Training module + cert workflow (Opus; content tailoring → Sonnet)
**Attach**: `08` (cert spec), `Refs for Training Module Dev/` (the 4 files), `Training Modules and Self-Study/`.
**Prompt**:
> (a) Build the Training & Orientation module (PRD §5.0): self-study content **tailored by Sonnet from the 4 reference files** (UAMS careers PDF, AE 2019 deck, PC 2019 deck, MI Manual Section A) — reviewed/adapted, not authored from scratch — plus the fake-system walkthrough; gate Case Simulator until complete. (b) Build the certification workflow UI implementing `08-accreditation-cert/spec_certification-logic.md` exactly: practice (help-on, uncounted) → 3 first-try closed-book passes on fresh generated variants → immediate lock-in + evidence packet. Dispatch content tailoring and the walkthrough UI to Sonnet; you own the cert variant/burn/lock logic.
**Definition of done**: training gates the simulator; cert serves fresh variants; practice-then-certify test from the spec passes.

### → CHECKPOINT B (**Fable** — final Fable act; Nathan runs this in a Fable session)
Bring Fable: the certification variant/burn/lock implementation + the evaluator calibration report vs the
12 gold fixtures (at minimum SC-03, SC-11, SC-12 — the subtle cue-catch cases). Fable reviews cert-logic
correctness against `spec_certification-logic.md` and the evaluator's agreement with ground truth, then
writes the post-48h punch list into `BLOCKERS.md`. This is the last scheduled use of Fable.

---

## Session S7 — Admin area (Opus; screens → Sonnet) ⟨ADDED by Fable 2026-07-07⟩
**Attach**: `RUNBOOK.md`, `00-build/HANDOFF-OPUS.md` (state + invariants), stage folders `04`, `09`.
**Prompt**:
> Build the Admin area (PRD §4 admin, role-gated: platform_admin + org admin) as `/admin/*` routes with a server-side role check in the layout (NOT just nav hiding). Five modules, in priority order:
> 1. **Training module management**: list/edit the shared (`org_id IS NULL`) `training_modules` — edit `content_md` in a textarea with live preview through the existing XSS-safe renderer (`src/lib/training/markdown.ts` — do NOT introduce a raw-HTML editor), reorder (`order_index`), toggle `required`, create new modules, per-org tailored copies (duplicate row with `org_id` set; org rows shadow shared ones by slug for that org's trainees — implement the shadowing in the training loaders). Platform_admin edits shared rows; org admin edits only their org's rows (RLS already enforces; surface clean errors).
> 2. **Scenario adjustment (case bank)**: list `case_templates` with the content-status board columns (`outline_status`, `stt_tts_verified`, `rubric_approved`); edit SURFACE fields freely (title, difficulty, therapeutic_area, product_ref). **Ground-truth (`ground_truth_json`) edits are gated**: editing it flips `rubric_approved` to false and writes an `audit_log` row — answer keys are Nathan-sign-off artifacts (RUNBOOK standing rule); the UI must say so. Validate any edited key against `01-seed-cases/answer-key.schema.json` (vendor a copy) before save.
> 3. **Custom scenario intake (enterprise)**: create org-scoped `case_templates` (`org_id` set, `is_fictional_product` false allowed) via a guided form: case brief fields, answer-key builder matching the schema, persona brief (premise/profile/beat sheet), org SRLs (`srd_documents` with `org_id`). New custom cases start `outline_status='drafted'`, `rubric_approved=false`, and are EXCLUDED from trainee queues until approved (extend the queue/accreditation loaders to filter on `rubric_approved` — currently they don't; see HANDOFF known-gaps).
> 4. **User/roster management**: org admin lists/deactivates users in their org, assigns roles trainee|trainer|qa (never admin+ — the `users_no_self_escalation` trigger backstops); platform_admin manages orgs + `org_case_access` (which shared cases each org sees).
> 5. **Confidentiality tier config** per org (`organizations.confidentiality_tier`), platform_admin only.
> Dispatch all screens to Sonnet; Opus owns the role-gating layout, the ground-truth edit gate + audit write, and the queue-filter change. Every admin mutation writes an `audit_log` row (actor, action, target) — the table exists and is currently unused (HANDOFF gap #7).
**Definition of done**: org admin can tailor a training module and draft a custom scenario that stays invisible to trainees until `rubric_approved`; platform_admin can reorder/edit shared modules, flip org case access, and see every change in `audit_log`; unauthorized roles get 404s on `/admin/*`.

## Post-48h punch list (Opus/Sonnet, before public launch)
- Voice hardening + **certification-via-voice** end-to-end (MVP cert can validate on text; voice cert before launch).
- **Production TTS decision** + commercial license; **Supabase free → Pro** (backups, no auto-pause).
- Enterprise lite: org accounts, manual SRD/SOP upload, per-client Google Drive folder (fulfillment step), Cohort Lite table, CSV roster upload.
- Admin UI + scenario content-status board (PRD §4 admin area).
- Seed cases **11–20**: Sonnet drafts against `_case-template.md`, you sign off each answer key.
- Trainee voice-recording **retention/consent policy**; verify Groq ZDR contractually before selling the confidentiality tier.
- Launch gate = PRD §14 MVP checklist complete (voice non-negotiable).
