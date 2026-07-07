# MedInfo Academy Course — PRD Critique & Revised Build Plan

## Context

Nathan's PRD v1 (`miacademycourse_prd_v1.md`) describes an MI training/simulation platform. Fable access ends in ~48h under a usage cap, so this plan does three things: (1) critiques the PRD, (2) fixes the gaps, (3) produces the orchestration split the PRD's §18 asks for — **Fable = deepest-reasoning artifacts only; Opus 4.8 = build orchestrator + complex implementation; Sonnet 5 = routine implementation**. Confirmed by Nathan: 48h goal is Fable deliverables + getting as close to launch as possible with Opus/Sonnet, finishing post-48h; rubric provided (`General Scenario/Rubric/Rurbic Scorecard Draft.md`); Training module built from the 4 files in `Refs for Training Module Dev/`; Fable drafts the seed cases for Nathan's sign-off (12 authored; 20 is the ceiling). Fable also runs Checkpoints A & B.

## Current state audit

| PRD assumption | Reality |
|---|---|
| GitHub repo ready | `kbymmm7vg7-ops/MedInfoAcademyCourse` exists but is **empty**; local folder is **not a git repo** |
| Rubric "in a folder for Fable" | ✅ Now provided: `General Scenario/Rubric/Rurbic Scorecard Draft.md` (note filename typo — rename to `rubric-scorecard-draft.md` at repo init) |
| 10 hand-authored seed cases | Fable authored **12** (SC-01…SC-12) toward the 20 ceiling; Nathan signs off answer keys |
| Proprietary training content | `Training Modules and Self-Study/` is **empty**; only 4 reference files exist (UAMS careers PDF, 2019 AE & PC decks, MI Manual Section A docx). Confirmed: build from these 4 |
| EmersonApp-style stack familiarity | Fine — Next.js + Supabase + Vercel; Supabase & Vercel MCPs already connected |

**Consequence:** the critical path for the next 48h is *content* (seed cases, rubric schema, fictional labels/SRLs), not code. Code without answer keys can't test the persona engine, evaluator, or certification.

## PRD critique (issues to fix; each has a disposition in the revised plan)

**Scope & sequencing**
1. **The MVP list is 3–4 weeks of work labeled "2 days."** §14 flags it but doesn't cut anything. Resolution: 48h target = core loop (simulate → document → validate → evaluate) working in text + baseline voice demo; enterprise-lite, admin board, cohort lite, confidentiality tier, cases 11–20 are post-48h fast-follows before launch.
2. **TTS vendor "TBD" is a launch blocker in a voice-mandatory product.** Resolved: build the voice layer behind a **thin TTS adapter**. Dev/demo + seed-case pronunciation QA run on the **ElevenLabs connector (free tier)** during the 48h; production vendor (ElevenLabs paid vs Deepgram Aura-2) is decided at launch with real per-case cost data. The free tier is non-commercial and ~10 min audio/month — it must never be the launch vendor.
3. **Placement mini-assessment (Journey A) appears in no module, schema, or roadmap item.** Cut from MVP explicitly; start everyone at difficulty tier 1.
4. **Journey A references skill tree/badges but §14 says no gamification in MVP.** Align: MVP = linear difficulty tiers, no badges/XP.

**Design integrity**
5. **Certification is gameable as specified.** §5.4 allows unlimited practice on the same 20-case bank that serves certification, with "first attempt per scenario" as the gate. A trainee can drill scenario X ten times in practice, then take it "first-try" in cert mode. Fix (uses machinery the PRD already has): **certification sittings always run a fresh AI-generated variant** of the seed (same ground-truth answer key, different surface — names, phrasing, order of reveals) via the §5.5a cohort-variation engine. This also fixes bank exhaustion when failed scenarios are "burned." Fable specs this logic; Opus implements.
6. **No evaluator-calibration step before certificates are issued.** The product's entire moat is trust in the score, yet nothing validates the AI evaluator against human judgment. Fix: each seed case's "gold documentation example" doubles as an eval fixture; before cert goes live, Nathan blind-scores ≥10 evaluator outputs with the scorecard and agreement must clear a threshold (suggest: no Critical-criterion disagreement, ≤1 Major disagreement per case). Cheap, uses artifacts we're already making.
7. **Persona model choice is underpowered.** §3 assigns persona turns to Haiku, but the persona must hold hidden ground-truth state, volunteer a cue, and only reveal the AE detail when the trainee catches that cue and clarifies it (listen-and-clarify, not probing) — that recognition *is* the gradeable skill. Runtime split: **Sonnet 5 for persona in graded/certification cases and for the evaluator; Haiku 4.5 acceptable only for ungraded warm-up practice and the coaching agent.** (Runtime models are separate from build-time orchestration models.)
8. **"Mac Mini self-hosted" firewall tier is not deliverable as described.** A Mac Mini can host Whisper STT — it cannot self-host the Claude reasoning layer, which is where client product data actually flows. Rewrite the offer as: ZDR + DPA (+BAA) across Anthropic/Groq/Deepgram, with on-prem *STT only* as the hardware add-on. Don't sell what the architecture can't do.
9. **Google Drive folder ≠ isolation layer.** It's a fulfillment convenience. The real tenant isolation is **Supabase RLS policies on `org_id`**, which the schema section never mentions. Fable specs the RLS design; Opus implements and tests it with a two-org fixture.

**Schema gaps (fix at migration time)**
10. `case_instances` needs `variant_snapshot_json` (the generated variant + persona reveal-state actually played, for audit/replay) and `accreditation_attempts` needs `variant_ref`.
11. `evaluation_scores` needs `rubric_version`; scores are meaningless in an audit without the rubric they were scored against.
12. No `org_case_access(org_id, case_template_id)` join table, though §12 promises per-org case-bank subsets.
13. `audit_log` lacks `org_id` (needed for per-tenant audit export).

**Rubric scorecard review (it's good — better than §10 for machine scoring; four fixes)**
14. **Genericize employer-specific terms** before this ships: the received-date field → vendor-neutral "Received Date/Time" (no employer/vendor name in any build or audit log); "client-specific MCMP" → "the SOP-defined timeframe" with a simulation-world SOP (e.g., AE submission within 1 business day) written into each case's ground truth. Both a vendor-neutrality and a confidentiality issue. **Resolved — Nathan: strike all vendor names entirely; new rubric approved.**
15. **No compliance/off-label criterion exists in any section**, yet the PRD calls compliance a core scored dimension (§5.3, §10, Journey C). Add a **Section 5 — Compliance & Special Situations** (Cri: no off-label information volunteered / correct redirect; Cri: special-situation flag applied when triggered; Maj: no promotional language; Maj: correct escalation route) — Fable drafts it in the schema pass, Nathan signs off.
16. **Section 1's vocal criteria (enunciation, tone, inflection) can't be scored from a transcript.** MVP: evaluator scores the transcript-assessable items (professionalism of language, active listening/re-phrasing, jargon avoidance) and marks enunciation/vocal-skills N/A, with a note in the score report; audio-based scoring is a V2 item.
17. Encode the scorecard's real semantics in the JSON schema: per-criterion Pass/Fail/NA with Cri(10)/Maj(8)/Min(2) weights and section minimums (AE 65/74, PC 75/84, General 39/43, Section 1 avg ≥2.5), Critical-failure = automatic section fail, and section-applicability flags (AE/PC sections toggle per case type; General always on). This replaces the §10 1–5 anchor table as the scoring contract; §10 survives as coaching language.

**Flagged, no action this sprint**
18. Trainee voice recordings: retention/consent policy needed before public launch (trainees will occasionally say real personal things); Groq ZDR is an enterprise-tier feature — verify contractually before selling the confidentiality tier.
19. 5 included custom scenarios × ~4h each = ~20h fulfillment per enterprise client — a capacity note for pricing, not a build item.

## Model orchestration (the §18 deliverable)

**Fable — this session/window only (token-capped, deepest reasoning only):**
- F1. This plan (done on approval).
- F2. **Rubric → scoring JSON schema**: encode the scorecard (items 14–17 above), add Section 5, produce `02-rubric-schema/rubric.schema.json` + evaluator scoring contract. Requires Nathan sign-off.
- F3. **12 seed cases** (SC-01…SC-12): per case — scenario script/beat sheet, persona profile + listen-and-clarify reveal rules, inquiry category + fake inquirer contact (`case-addenda.md`), ground-truth answer key (requester type, solicited flag, AE/PC/pregnancy/special/LOE flags, correct SRL + decoy list, correct escalation), gold documentation example (doubles as eval fixture, per #6). Fictional products with USPI-style label skeletons (Sonnet fleshes out label prose later from Fable's specs). Requires Nathan sign-off.
- F4. **Design specs** (one doc each, ~1 page): certification variant/burn/first-attempt logic (#5); tenant-isolation RLS design (#9, #10–13 schema deltas); voice pipeline architecture (Groq Whisper v3 Turbo batch STT — key confirmed ready — + VAD turn-taking + TTS adapter with ElevenLabs free-tier dev implementation and a launch-time vendor slot, latency budget, text fallback).
- F5. **Runbook** (`RUNBOOK.md`): the literal session-by-session prompts below.
- F6. **Two review checkpoints** (small, bounded token spend): Checkpoint A after Day-1 (schema/RLS + persona hidden-state handling); Checkpoint B after Day-2 (cert logic + evaluator output vs 2 gold fixtures). Nothing else goes to Fable.

**Opus 4.8 — orchestrator + complex implementation:** runs every build session; implements persona engine (hidden-state reveal), evaluator pipeline, documentation validator, certification workflow, voice integration, RLS/tenant isolation. Dispatches Sonnet subagents for everything routine.

**Sonnet 5 — routine implementation:** repo/Next.js/Supabase scaffold, migrations from Fable's schema, auth screens, app shell/nav, Documentation Simulator forms + case queue, Training & Orientation module (tailoring content from the 4 ref files), fictional label/SRL prose from Fable's skeletons, seed-data scripts, CSV roster upload, Cohort Lite table, admin shell.

**Runtime (in-product) models — distinct from the above:** Sonnet 5 for evaluator + graded-case personas; Haiku 4.5 for ungraded practice personas and coaching; case-generator variants on Sonnet 5.

## 48h schedule

**Hour 0–10 (Fable, this session, sequential):** F2 rubric schema → F3 seed cases 1–10 (batch of 5, sign-off, batch of 5) → F4 specs → F5 runbook. Nathan reviews/signs off rubric schema + cases asynchronously. Repo init + ICM folder structure (`01-seed-cases` … `10-dashboard` per §17) is Sonnet's first session, running in parallel once F2 lands.

**Day 1 (Opus orchestrating):**
- S1 (Sonnet): git init + push, ICM scaffold, Next.js scaffold; **new Supabase project on the free tier** (if the two-project free limit blocks creation, delete the Scanmons project first — pre-authorized by Nathan); migrations incl. Fable's schema deltas + RLS, auth, app shell.
- S2 (Sonnet): Documentation Simulator UI with static scripted case; seed data from Fable's cases; open/closed-book toggle.
- S3 (Opus): Persona engine, text mode, against seed cases; rules-based Documentation Validator.
- **Checkpoint A (Fable):** review RLS + persona hidden-state handling. Go/no-go on evaluator build.

**Day 2 (Opus orchestrating):**
- S4 (Opus): Evaluation Agent against rubric schema; run all 12 gold fixtures; report agreement for Nathan's calibration pass (#6).
- S5 (Opus): Voice baseline — mic capture, VAD chunking → Groq STT, ElevenLabs TTS (via adapter) with CC strip, voice-mode layout. Target: one full case playable by voice end-to-end, rough is fine; budget the free tier's ~10 min/month of TTS audio (use short test utterances; full-case run last).
- S6 (Sonnet, parallel with S5): Training & Orientation module from the 4 refs; certification workflow UI (logic per Fable's F4 spec).
- **Checkpoint B (Fable, final Fable act):** cert logic + evaluator calibration review; write the post-48h punch list.

**Post-48h (Opus/Sonnet, pre-launch):** voice hardening + certification-via-voice end-to-end; **production TTS decision** (ElevenLabs paid vs Deepgram Aura-2, using measured per-case audio cost) + commercial-license upgrade before any public traffic; Supabase free→Pro upgrade before launch (backups, no auto-pause); enterprise lite (org accounts, SRD upload, Drive folder fulfillment step); Admin UI + content status board; Cohort Lite; cases 11–20 (Sonnet drafts against Fable's established case pattern, Nathan signs off); trainee-recording retention policy (#18); launch gate = PRD §14 checklist.

## Runbook (F5 will expand; shape)

Each session = fresh Opus 4.8 session in the repo. Attach: always `RUNBOOK.md` + the numbered-stage folder for that session; S1–S2 add rubric schema + seed cases; S4 adds gold fixtures; S6 adds the 4 training refs. Each prompt states: objective, files to read, definition of done, "dispatch routine work to Sonnet subagents," and "stop and write BLOCKERS.md rather than improvising around missing content."

## Verification

- **Rubric schema:** validates against all 12 gold documentation examples; scoring a gold example yields a pass, scoring a deliberately broken variant (missing AE flag) yields Critical fail.
- **Persona engine:** catching + clarifying the volunteered cue surfaces the AE; letting the cue pass never surfaces it, and fishing for unmentioned symptoms is not rewarded (12/12 seed cases, automated transcript test; listen-and-clarify model).
- **Tenant isolation:** two-org fixture; org-B user queries org-A SRDs/cases → zero rows, enforced by RLS not app code.
- **Certification:** simulate practice-then-certify on same seed → cert sitting serves a variant, not the practiced surface; failed first attempt burns the scenario.
- **Voice:** one seed case completed by voice on laptop mic; round-trip silence < ~3s per turn.
- **Evaluator calibration:** Nathan blind-scores ≥10 outputs; no Critical disagreements before cert mode activates.
