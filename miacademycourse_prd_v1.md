# AI-Powered Medical Information Training & Simulation Platform
### Product Design Document — v1.0

---

## 0. Executive Summary

A vendor-neutral, simulation-based learning platform that takes someone with little or no Medical Information (MI) experience through the *complete* case lifecycle — inbound inquiry, triage, probing, safety detection (AE/PC/pregnancy/special situations), response document selection, documentation, escalation, and closure — the way real IRMS/Scimax/Veeva MI/Salesforce-Mavens environments work, without teaching any single vendor's UI.

The product is not a chatbot. It's a **workflow simulator with an embedded case management system**, an **AI persona engine** that plays callers, and an **AI evaluator** that scores judgment, not just conversation quality.

Two buyers, one product:
- **B2C/B2B2C**: individuals becoming job-ready for MI roles.
- **B2B/Enterprise**: pharma MI departments, CROs, and MI/BPO contact centers using it for onboarding, QA calibration, and certification.

---

## 1. Product Vision & Design Principles

1. **Teach the judgment, not the software.** Every screen should feel "generically familiar" to someone who's used IRMS, Scimax, Veeva MI, or Salesforce/Mavens — common fields, common workflow stages — but never replicate a specific vendor's chrome, terminology, or proprietary layout.
2. **Simulate the whole case, not a chat turn.** A "case" is a unit that starts at intake and ends at closure. Conversation is one phase of many.
3. **Safety detection is the core skill, not a side quest.** AE/PC/pregnancy/special-situation detection should be scored as heavily as medical accuracy — this is the single highest-value, highest-risk skill in MI, and the one hardest to learn from reading SOPs alone.
4. **Every simulation is unambiguously a simulation.** Persistent watermarking/state so no trainee (or auditor) could mistake a practice AE capture for a real reportable event submitted anywhere.
5. **Progressive difficulty, not random difficulty.** Cases escalate deliberately: clean inquiry → ambiguous requester type → embedded AE → dual PC/AE → hostile/escalation-prone caller → attorney/journalist edge case.
6. **Grounded generation, not free-form generation.** The AI should *vary* cases from a curated, validated seed library and grounded reference content (fictional product labels for the B2C bank, real client product info for paid enterprise custom scenarios; real ICH/regulatory frameworks throughout) rather than hallucinate medical content from scratch.

---

## 2. Users & Personas

| Persona | Goal | Primary Modules |
|---|---|---|
| **Career-switcher trainee** (nurse, pharmacist, no MI experience) | Become job-ready, build a portfolio/certificate | Case Simulator, Accreditation Mode |
| **New-hire specialist** (already hired, in onboarding) | Ramp faster than shadowing alone, hit production-ready in weeks not months | Case Simulator, Documentation Simulator, Accreditation |
| **MI Trainer / Team Lead** | Deliver consistent onboarding without 1:1 shadowing bottleneck | Manager Dashboard, case assignment |
| **QA/Compliance Manager** | Verify competency before staff touch live queues; audit trail for inspection readiness | Manager Dashboard, Accreditation reporting |
| **CRO/BPO Learning & Development leader** | Standardize training across multiple pharma clients with different SOPs | Enterprise config, custom SRD ingestion |

---

## 3. Product Architecture (high level)

```
┌───────────────────────────────────────────────────────────┐
│                        Web Client                          │
│  Case Simulator UI │ Documentation UI │ Dashboard UI        │
└──────────────┬───────────────────────────────┬────────────┘
               │                               │
        ┌──────▼──────┐                 ┌──────▼──────┐
        │  App Server  │                 │  Realtime   │
        │ (Next.js API)│                 │  (voice/    │
        │              │                 │  chat sync) │
        └──────┬───────┘                 └──────┬──────┘
               │                                │
   ┌───────────▼────────────────────────────────▼───────────┐
   │                    Orchestration Layer                  │
   │  - Persona Agent   - Case Generator   - Eval Agent       │
   │  - Coaching Agent  - Difficulty Engine - Escalation Sim  │
   │        (Claude API — Sonnet for reasoning/eval,          │
   │         Haiku for lightweight persona turns)             │
   └───────────┬──────────────────────────────┬──────────────┘
               │                              │
     ┌─────────▼─────────┐          ┌─────────▼─────────┐
     │  Case/Content Bank  │          │  Grounding Corpus  │
     │  (seed cases,       │          │  (RAG: label-style │
     │  SRD library,        │          │  product info,     │
     │  rubrics)            │          │  ICH/SOP refs)     │
     └─────────┬─────────┘          └─────────┬─────────┘
               │                              │
        ┌──────▼──────────────────────────────▼──────┐
        │        Postgres (Supabase) + pgvector        │
        │  users, orgs, cases, transcripts, scores,     │
        │  competency records, audit log                │
        └────────────────────────────────────────────┘
```

Stack recommendation (matches a fast, Claude-Code-friendly build): **Next.js + Supabase (Postgres + pgvector + auth) + Vercel**, Claude API as the reasoning layer, MCP for any LMS/HRIS integrations later. This is a deliberately boring, well-trodden stack so Claude Code can move fast and you're not fighting infra.

---

## 4. Information Architecture & Navigation

```
Login / Auth (customer-facing signup + login)
├── Training & Orientation (required first, gates Case Simulator)
│   ├── Self-study modules
│   └── System walkthrough (fake MI documentation tour)
Home / My Queue
├── Case Simulator
│   ├── Active Case (conversation pane)
│   ├── Reference Panel (SRD/label lookup, probing prompts)
│   └── Documentation Drawer (opens mid-call, like real MI work)
├── Case History
│   └── Past case detail + evaluator feedback
├── Learning Path
│   ├── Current module / skill tree
│   ├── Assigned cases
│   └── Progress & badges
├── Accreditation Center
│   ├── Available assessments
│   ├── Attempt history
│   └── Certificate wallet
├── Manager Dashboard (role-gated)
│   ├── Team overview
│   ├── Trainee detail / trend view
│   ├── Case assignment
│   └── Competency heatmap
└── Settings / Org Config (enterprise)
    ├── SOP & SRD upload (tenant-specific corpus)
    ├── Competency framework mapping
    └── SSO / roles

Admin UI (separate app area, role-gated: platform admin + org admin)
├── User/roster management (create, deactivate, assign roles)
├── Case bank management (of the 20 promised case types — assign which are enabled per org)
├── Scenario content status board: per case — outline drafted, STT/TTS pronunciation verified, rubric approval status (this is where content-readiness lives, not scattered across docs)
├── Custom scenario intake (enterprise custom-build requests)
├── Training module management (self-study content, tailored versions per org)
└── Confidentiality/firewall tier config per org
```


Navigation principle: **the case is always the anchor.** From any screen you're 1 click from "resume active case" — mirrors real MI agent muscle memory of never losing the live case.

---

## 5. Core Modules

### 5.0 Training & Orientation (pre-simulation, required before Case Simulator unlocks)

- **Self-study content**: your own proprietary training material (confidential, org-owned content), reviewed and tailored by Sonnet specifically for this course — not authored from scratch by AI.
- **System walkthrough**: interactive tour of the fake MI documentation system — where fields are, what each is for — even though the UI is clearly labeled. Builds familiarity before a trainee is scored on speed/accuracy in live simulation, so the first graded case isn't also their first exposure to the interface.
- Gates progression: Case Simulator stays locked until Training & Orientation is marked complete.
- DB: `training_modules(id, org_id nullable, title, content_ref, order_index)`, `user_training_progress(id, user_id, module_id, completed_at)`.

### 5.1 Interactive Case Simulator

- **Channel modes**: Voice/phone is a required MVP capability, not deferred — text/chat exists alongside it for email/portal-channel case types. Same underlying case engine either way; channel is a presentation layer, not a different product.
- **Persona Agent** plays the caller: HCP, patient, caregiver, pharmacist, attorney, journalist, internal employee (sales rep asking off-label question — a classic compliance trap).
- **Persona behavior is scenario-scripted, not purely improvised**: each seed case defines a ground-truth answer key (requester type, solicited/unsolicited, AE present Y/N, PC present Y/N, correct response document, correct escalation path) *before* the AI plays it out — so evaluation is deterministic against a rubric, and the conversation is the variable surface, not the grading criteria.
- **Reference Panel**: simulated access to product info/label content and a response-document library — trainee must *select*, not be spoon-fed, the right SRD.
- **Live probing prompts** (toggleable): early learners get subtle on-screen nudges ("has the patient described any unexpected symptom?"); advanced mode turns these off — mirrors real supervised → independent ramp.
- **Escalating conversation trees**: caller can become agitated, ambiguous, or introduce a second issue mid-call (e.g., starts as a dosing question, becomes a product complaint) to train real-world non-linearity.

### 5.1a Call Flow — Prep → Live Simulation → Documentation (voice mode)

Two candidate flows for the phone-simulation experience:

**Proposed alternative flow**: Trainee clicks Start → receives pre-scenario reference materials (USPI + a relevant response document) → grants mic access → live simulated call begins, with a small live-caption (CC) strip showing what the persona is saying, and a large panel showing the case documentation system for real-time charting.

**Original MVP proposal**: text-first, reference panel searchable live during a chat conversation, documentation opens as a drawer, voice deferred to V2.

**Synthesis / recommendation:**
- **Voice is a required MVP capability — resolved, no longer a phased decision.** Build the persona/evaluation engine channel-agnostic, validate case content and rubric quality on text first internally, but the voice layer must be complete before the product is released publicly. Nothing ships without it.
- **Preloading confirmed, with decoys.** Every case preloads the product label plus a mixed set of SRLs — the correct one alongside irrelevant/distractor SRLs. Document-selection stays gradable even at preload, since the trainee still has to identify which document actually answers the inquiry. Difficulty scales via decoy count/similarity: early cases mix in one obviously-wrong SRL, advanced cases mix in several plausible-but-wrong ones (same therapeutic area, adjacent indication).
- **Fictional products for B2C, real products for enterprise custom.** The general B2C/standard case bank (the 20 promised case types) uses entirely fictional drug names with constructed, fake USPI-style labels and SRLs — sidesteps any real-label accuracy/IP concern and reinforces the SIMULATION framing. Enterprise custom scenarios (paid) use the client's real products, since that's the point of tailoring — those stay tenant-isolated per `org_id` and never leak into the fictional B2C bank.
- Layout: large documentation panel + small caption strip is the right call for voice mode — once a trainee is "on a call," a big conversation transcript pane isn't needed, just a caption strip. For email/portal-channel case types (not every real MI inquiry is a phone call), keep the full conversation-pane layout.
- Voice pipeline specifics:
  - TTS generates the persona's speech; the CC text is the same text fed to TTS — no extra step needed there.
  - STT tiering: **Groq Whisper Large v3 Turbo is the default for both B2C and enterprise** ($0.04/hr; batch/VAD-chunked, not true streaming, but fast enough that perceived latency is fine for most cases). **Local Whisper (Mac Mini) is dev/test/demo only.** Paid upsell: true streaming STT (e.g., AssemblyAI Universal-Streaming, $0.15/hr, sub-300ms partials, unlimited concurrency) for enterprise clients who want live word-by-word captions rather than per-utterance chunks.
  - TTS tiering: default TTS vendor TBD at baseline quality/cost; paid upsell to a higher-fidelity option (e.g., Deepgram Aura-2, tuned for medical-term pronunciation) for clients who want it. Same TTS call voices both routine probing questions and the ground-truth AE/PC reveal content — no separate path.
  - QA step: run each seed case's dialogue through the chosen TTS voice once before it goes live, specifically checking pronunciation of any branded product names.
  - Confidentiality/firewall tier (see Enterprise Features) layers on top of whichever STT/TTS tier a client is on — it's an orthogonal axis (data handling), not a replacement for the streaming/quality upsell.
  - Turn-taking: voice-activity detection flags end-of-utterance, fires the Claude reasoning call immediately, streams TTS sentence-by-sentence as it generates — round-trip silence past ~3 seconds starts breaking immersion.
  - Mic permission requested at the "Start" click, with graceful fallback to text input if denied or unsupported, so no trainee is blocked from the product.

### 5.5a Cohort Management (enterprise groups up to ~10)

- **Cohort as a first-class object** (`cohorts` + `cohort_members`): roster, start/end dates, assigned curriculum window, scheduled accreditation date. Admin creates via CSV roster upload — no SSO/SCIM needed for this (matches lightweight-enterprise scope).
- **Per-trainee case variation within a cohort.** All 10 members work the same seed cases/rubric, but each gets a distinct AI-generated variant (names, phrasing, minor scenario details) so trainees can't compare identical answers. Same constrained-variation engine used for the general case bank.
- **Scheduling split by purpose, not by default.** Daily practice inside the cohort's curriculum window stays unscheduled and self-paced — same reasoning as B2C, friction hurts ramp. **Cohort accreditation sittings are the one place scheduling belongs**: the whole cohort sits certification at a synchronized time, mirroring a real classroom exam.
- **Cohort Lite view pulled into MVP** (ahead of the full Manager Dashboard, which stays V2): roster, cases completed, and average score per trainee — a simple table a trainer can check daily. The heatmap/trend analytics in §5.5 remain a later build once there's enough cohort data to make them worth visualizing.

### 5.2 Documentation Simulator (the "generic case management system")

Simplified but structurally faithful case record, fields modeled on the common denominator across IRMS/Scimax/Veeva MI/Salesforce-Mavens:

- **Case Queue**: list view — status, priority, SLA timer, case type, assigned to.
- **New Case Intake**: requester type, solicited/unsolicited flag, contact channel, product/indication.
- **Inquiry Detail**: free-text inquiry summary, probing question log (auto-captured from simulator transcript).
- **Safety Assessment block**: structured AE fields (four-element test gating), PC fields, pregnancy/lactation flag, special situations flag — dual-routes if both AE + PC present.
- **Response Documentation**: SRD/SRL selected, customization notes, delivery method.
- **Follow-up**: scheduled follow-up, outstanding info needed.
- **Closure**: SOP-based closure checklist, QC self-check before submit.
- **Submit for Review** → routes into AI Evaluator (trainee) or human QA (enterprise mode).

This is the module that makes the platform "transferable" — a trainee who's done 50 cases here can walk into *any* real MI system and recognize every field, just under a different label.

### 5.3 AI Evaluator

Scored dimensions (see full rubric in §10):
Medical accuracy • Questioning technique • Empathy/rapport • Compliance (off-label handling, promotional language avoidance) • Documentation completeness • Grammar/professionalism • Regulatory risk • Missed safety signals • Missed follow-up opportunities.

Evaluator runs against **two inputs**: the conversation transcript AND the documentation record — because a trainee can ask all the right questions verbally and still fail by not *documenting* the AE correctly (which is, realistically, where most real-world failures happen).

### 5.4 Accreditation Mode

- **Mimics a live call** — certification runs on the voice pipeline, not text, since that's the real-world skill being certified.
- **Beginner phase (practice, doesn't count)**: up to 3 scenarios with the help toggle on (probing prompts, open-book reference materials). Purely diagnostic/ramp-up — no bearing on certification.
- **Certification requirement**: 3 distinct real-life scenarios, help toggle OFF (closed-book), each passed on the **first attempt**. If a trainee fails their first attempt at a given scenario, that scenario is burned for certification purposes — they must use a different scenario from the bank for another first-attempt try. This preserves the stakes of "first try" and prevents gaming via retries.
- **Unlimited practice, separate from certification.** Trainees can replay any scenario as many times as they want outside certification mode — practice attempts never count toward or interfere with the 3-first-try-pass requirement.
- Weighted scoring against a defined passing threshold; failure triggers **remediation path** (targeted practice cases on the specific missed competency, not a generic retake).
- Progression tracking: Associate → Specialist → Senior tiers, each gated by an assessment.
- Exportable certificate + evidence packet (transcript + scored rubric) for enterprise QA files.
- **Confirmed behavior**: once a trainee earns their 3 first-try passes, certification is locked in immediately. They can continue practicing any scenario afterward — including ones previously used in certification attempts — with zero effect on the certification already earned. No held-out subset; the same 20-case bank serves both practice and certification, tracked via first-attempt-per-scenario-per-user.

### 5.5 Manager Dashboard

- Team roster with competency heatmap (which trainees are weak on AE detection vs. documentation vs. off-label handling).
- Assign specific case types to specific trainees (targeted coaching).
- Trend view over time (is this cohort's AE-detection score improving week over week).
- Drill into any single case: transcript + documentation + AI score + ability to override/annotate (human-in-the-loop calibration — also doubles as training data to improve the evaluator).

---

## 6. Key User Journeys

**A. New trainee, first week**
Sign up → placement mini-assessment (calibrates starting difficulty) → guided Learning Path assigns first 5 "clean" cases (single issue, unambiguous requester) → each case: simulate → document → submit → instant AI feedback with explanation (not just a score — *why*) → skill tree unlocks next tier (ambiguous requester type, then embedded AE, then dual AE/PC).

**B. Enterprise onboarding cohort**
Org admin uploads their own SOP/SRD corpus (tenant-isolated RAG) → trainer assigns a structured 4-week curriculum → trainees work independently → trainer dashboard shows heatmap → trainer manually assigns extra reps on weak spots → cohort sits Accreditation Mode assessment in week 4 → passing certificate + evidence packet feeds into the org's own QA record.

**C. Escalation-handling rep** (advanced track)
Case starts routine, caller becomes hostile/threatens legal action mid-call, trainee must recognize special-situation flag, de-escalate, and route correctly — scored heavily on compliance + regulatory risk dimensions.

---

## 7. Screen Layout Sketches (text wireframes)

**Case Simulator (active case)**
```
┌─ Case #A1042  [SIMULATION]  ⏱ 04:12 ───────────────┐
│ Caller: Dr. Amara Chen, HCP        [Requester: ?]   │
├──────────────────────────────┬──────────────────────┤
│  Conversation                │  Reference Panel      │
│  Dr: "My patient's INR..."   │  [Product Info]        │
│  You: ...                    │  [SRD Library]         │
│  [type / speak]              │  [Probing Prompts ▾]   │
├──────────────────────────────┴──────────────────────┤
│ [Open Documentation ▾]     [Flag AE] [Flag PC]        │
└───────────────────────────────────────────────────────┘
```

**Documentation Drawer**
```
┌─ Case #A1042 — Documentation ───────────────────────┐
│ Tabs: Intake | Inquiry | Safety | Response | Closure  │
├───────────────────────────────────────────────────────┤
│ Solicited/Unsolicited: ( ) ( )     Requester: [____]  │
│ AE present:  Y / N     PC present: Y / N              │
│   → four-element check auto-expands if Y              │
│ SRD selected: [search/select]                          │
│ Case notes: [___________________________]             │
│         [Save Draft]        [Submit for Review]        │
└───────────────────────────────────────────────────────┘
```

**Voice Call Mode**
```
┌─ Case #A1042  [SIMULATION — LIVE CALL]  ⏱ 04:12 ────┐
│  🎙 recording                          [End Call]     │
│  CC: "...and she's been on it for about three weeks"  │
├────────────────────────────────────────────────────────┤
│  Documentation Panel (large)                           │
│  Tabs: Intake | Inquiry | Safety | Response | Closure   │
│  [___________________________________________]         │
│  [Open Reference Library ▾]  ← closed-book tier only   │
└────────────────────────────────────────────────────────┘
```

**Manager Dashboard**
```
┌─ Team: Onboarding Cohort 3 ─────────────────────────┐
│ Heatmap:            AE-det  PC-det  Doc  Compliance   │
│  J. Rivera            ●92     ●88   ●75     ●81       │
│  T. Okafor             68     71     ●90     65        │
│  ...                                                  │
│ [Assign Cases]   [View Trend]   [Export Report]        │
└───────────────────────────────────────────────────────┘
```

---

## 8. Database Schema (core entities)

```
organizations(id, name, tier, sop_corpus_id, competency_framework_id,
    confidentiality_tier[standard|firewall], google_drive_folder_ref)
users(id, org_id, role[trainee|trainer|qa|admin|platform_admin], competency_level)

case_templates(id, org_id nullable, title, difficulty, requester_type,
    solicited_flag, product_ref, is_fictional_product bool, ground_truth_json /* AE/PC/answer key */,
    seed_or_generated, therapeutic_area,
    outline_status, stt_tts_verified bool, rubric_approved bool)

case_instances(id, template_id, user_id, status, channel[chat|voice],
    started_at, closed_at)

conversation_turns(id, case_instance_id, speaker[persona|trainee],
    content, ts, flags_detected_json)

documentation_records(id, case_instance_id, intake_json, inquiry_json,
    safety_json, response_json, closure_json, submitted_at)

srd_documents(id, org_id nullable, title, therapeutic_area, body,
    embedding vector, is_decoy_eligible bool)

detection_rulesets(id, org_id, product_ref, custom_ae_criteria_json,
    custom_pc_criteria_json, special_situations_json, off_label_boundaries_json)

cohorts(id, org_id, name, start_date, end_date, curriculum_id,
    accreditation_scheduled_at)

cohort_members(id, cohort_id, user_id)

training_modules(id, org_id nullable, title, content_ref, order_index)

user_training_progress(id, user_id, module_id, completed_at)

evaluation_scores(id, case_instance_id, dimension, score, rationale,
    evaluator_version)

competency_records(id, user_id, competency, level, evidence_case_ids[])

accreditation_attempts(id, user_id, assessment_id, case_template_id,
    attempt_type[practice|certification], is_first_attempt_on_case bool,
    score, pass_bool, remediation_plan_json, completed_at)

audit_log(id, actor_id, action, target_type, target_id, ts)
```

Tenant isolation is enforced at the `org_id` level for anything ingested (SRDs, SOP corpus) — critical for enterprise trust (see §16).

---

## 9. AI Workflows

1. **Case Generator**: takes a seed template + target difficulty + target competency gap (from a trainee's heatmap) → produces a *variation* (different caller name, phrasing, therapeutic area) while preserving the ground-truth answer key. Generation is constrained/grounded against the org's SRD/product corpus via RAG — not free hallucination of medical facts.
2. **Persona Agent**: plays the caller turn-by-turn, aware of the ground-truth case state (what it will/won't reveal until probed correctly) — this is what makes probing skill actually gradeable ("the AE only surfaces if the trainee asks the right follow-up," exactly like real calls).
3. **Escalation/Difficulty Engine**: adjusts persona behavior (curtness, tangents, second issue injection) based on trainee's running competency level.
4. **Documentation Validator**: rules-based pre-check (required fields, logical consistency, e.g., AE flagged in chat but not documented) layered under the AI evaluator — cheap, deterministic, catches the most common real-world failure mode first.
5. **Evaluation Agent**: scores transcript + documentation jointly against rubric, produces both a score and a plain-language rationale ("You correctly identified the AE, but didn't capture the four-element criteria in the case note — this would return in QA in a live environment").
6. **Coaching Agent**: converts evaluator output into a personalized next-case recommendation and a short explanatory micro-lesson.

---

## 10. Evaluation Rubric (illustrative anchors)

| Dimension | 1 (Fail) | 3 (Meets) | 5 (Exceeds) |
|---|---|---|---|
| AE/PC Detection | Missed clear AE | Caught AE, applied four-element test | Caught embedded/ambiguous AE, correctly dual-routed AE+PC |
| Questioning Technique | Closed/leading questions only | Open questions, covers required probes | Adapts probing to caller's answers, uncovers hidden issue |
| Compliance | Provided off-label claim unprompted | Redirected off-label appropriately | Redirected + documented appropriately + no promotional language |
| Documentation | Missing required fields | Complete, accurate | Complete, accurate, audit-ready prose |
| Empathy | Clinical/cold with distressed caller | Appropriate acknowledgment | De-escalates a hostile caller while staying compliant |

---

## 11. Gamification

- XP per case, streaks for daily practice.
- Badges tied to *skills*, not vanity: "Four-Element Test Master," "Off-Label Redirect Pro," "Documentation Precision."
- Optional cohort leaderboard (enterprise, opt-in only — avoid punitive feel).
- Career-ladder titles mirroring real MI roles (Associate → Specialist → Senior → SME) unlocked by accreditation, not just XP.
- "Shift mode": timed queue-pressure simulation (multiple cases, SLA clock) for advanced learners — closest analog to a real live queue.

---

## 12. Business Model

| Tier | Buyer | Includes |
|---|---|---|
| Individual | Career switcher | Case Simulator + Accreditation Mode, access to the 20-case bank (fictional products), personal certificate |
| Team | Small MI department | + Manager Dashboard, assign/track, shared access to the 20-case bank |
| Enterprise | Pharma / CRO / BPO | + custom SRD/SOP ingestion, SSO/SCIM, competency framework mapping, audit export, multi-tenant. Enterprise trainees draw from a client-selected subset of the 20 base cases, plus any paid custom scenarios. |
| Certification-as-a-Service | Any | Standalone proctored assessment product, sold independent of full training |

**Enterprise custom scenario pricing:**
- Base enterprise package includes **5 custom scenarios** built to the client's own products/therapeutic areas.
- Additional custom scenarios: **$1,000 flat**, assuming ≤4 hours of build effort.
- If a scenario runs longer than 4 hours to build, bill the excess time at **$250/hr** rather than eating it — the $1,000 is effectively a 4-hour-equivalent flat rate, not a hard cap on effort.
- Custom scenarios are bolted to that org's account only (tenant-isolated via `org_id` on `case_templates` — never visible to other clients or the general B2C bank).
- Confidentiality/firewall handling (ZDR+DPA+/-BAA, or dedicated self-hosted hardware if that's insufficient) is bundled into custom scenario pricing, not sold separately.

---

## 13. Enterprise Features

- SSO/SCIM, role-based access.
- Tenant-isolated RAG corpus from client's own SOPs/SRDs — simulations reflect *their* therapeutic areas without leaking one client's content to another. **Each enterprise client gets a dedicated Google Drive folder for their SRD/SOP source documents** — additional isolation layer on top of `org_id` scoping in the DB. If a client's own materials live in SharePoint, the workflow is manual: copy their content into the client's Drive folder rather than building a live SharePoint integration. Provisioning the Drive folder is a fulfillment step per new enterprise client, not a config toggle.
- Audit trail export (evidence for inspection readiness — frame as "training compliance record," not a regulated system of record).
- Configurable competency framework (map to internal QA criteria or external standards, see §16).
- **Configurable AE/PC detection definitions per org.** ICH E2A seriousness criteria stay fixed (that's regulatory, not company-specific), but product-specific layers — known AE profile relevance, product-specific special situations (e.g., a pregnancy exposure registry unique to their product), device/combination-product complaint categories, off-label/compendia boundaries — are tenant-configurable and feed both the persona agent's ground truth and the evaluator's scoring for that org's scenarios only.
- **Confidentiality/firewall tier — bundled with custom scenario builds, not sold standalone.** Default: ZDR + DPA (+ BAA where applicable) across Groq, TTS vendor, and Anthropic API. If a client doesn't consider that sufficient, escalation path is a dedicated Mac Mini purchased specifically for their account, fully self-hosted, billed to the client (hardware cost passed through, not absorbed).
- API/LMS integration (SCORM/xAPI export or direct HRIS webhook).
- Human-in-the-loop QA override on AI scoring (trainer can annotate/correct — feeds evaluator improvement).

---

## 14. MVP vs. V2 Roadmap

**MVP (must include before public release — no soft-launch without these)**
- Curated seed case bank: **10 hand-authored cases** now, expanding to a **hard-capped 20** — this is the promised ceiling, not a stretch goal. Enterprise clients select which subset of the 20 their trainees can access, in addition to their paid custom builds.
- **Voice pipeline (STT + TTS) is in MVP, non-negotiable.** Text/chat channel exists alongside it for email/portal case types, but voice is required before launch, not a followed-on milestone.
- **Training & Orientation module** (self-study + fake-system walkthrough) gates entry to Case Simulator — required MVP, not a later add-on. Your existing training content, reviewed/tailored by Sonnet for this course.
- Documentation Simulator with full field set; open-book/closed-book toggle for reference materials.
- Rules-based Documentation Validator + LLM Evaluation Agent.
- **Certification workflow**: beginner practice (help toggle on, doesn't count) → 3 first-try passes on distinct closed-book scenarios via voice → certificate issuance. See §5.4.
- **Customer login/auth (B2C self-serve) and Admin UI (platform + org admin)** — both required MVP screens, not implied extras.
- **Lightweight enterprise from day one**: org-scoped account, manual per-org SRD/SOP upload (plus dedicated client folder/SharePoint), basic tenant isolation, CSV cohort roster upload (up to ~10 per cohort) — *without* full SSO/SCIM, which is deferred.
- **Cohort Lite view**: roster, cases completed, avg score per trainee — thin trainer-facing table, not the full heatmap/trend dashboard (that stays V2).
- Basic progress tracking for individual (B2C) users (no gamification yet).

**V2**
- Voice pipeline hardening (streaming STT upsell, improved TTS upsell, latency tuning) — the *baseline* voice pipeline is MVP; these are the paid-tier refinements.
- Full Manager Dashboard (heatmap, trend view).
- SSO/SCIM + full multi-tenant enterprise config.
- Gamification layer.
- Any generative expansion beyond the 20-case ceiling — not currently promised at all, would require revisiting the "only 20" commitment.

**Reality check on the 2-day build window**: this is a genuinely large scope for 2 days — voice pipeline, certification logic, documentation simulator, evaluator, admin UI, login, and lightweight enterprise config, all as "must-have." Fable's task-planning pass (§18) needs to produce an honest sequencing of what's achievable in 2 days versus what's realistically a fast-follow within the same sprint. Flagging this now rather than assuming the full MVP list above lands in 48 hours.

---

## 15. Competitive Advantage & Acquisition Attractiveness

- **Vendor-neutral training layer** sitting *above* IRMS/Veeva MI/Salesforce-Mavens/Scimax — none of those vendors currently offer a dedicated judgment-training simulator; they offer the system of record, not the training ground.
- **Proprietary data moat**: every scored transcript + documentation pair is training data that improves the evaluator over time — a competitor starting later can't replicate the calibration data quickly.
- **Certification could become a portable credential** — if enough BPOs/CROs recognize it, "Certified" becomes a hiring signal, creating network effects (candidates want it because employers ask for it; employers ask for it because it's reliable).
- **Natural acquirers**: Veeva (extends MI suite into L&D), IQVIA/major CROs (ICON, Syneos, Parexel — training cost center becomes a product), NICE (CX/QM crossover from contact center tooling), or a dedicated Medical Affairs L&D player looking to add a differentiated simulation asset.

---

## 16. Critique, Open Questions & Risks

These are the things I'd want nailed down *before* writing code:

1. **Resolved: regulatory sign-off.** You will personally sign off on the rubric and seed case answer keys — the credibility foundation the earlier recommendation was after is covered by your own domain background.
2. **Resolved: hard cap at 20, not "unlimited."** 20 case types is the firm promise, not a stretch ceiling. Enterprise clients pick which of the 20 their trainees can access, on top of their paid custom builds.
3. **Resolved: proprietary rubric weighted over PhactMI/DIA.** PhactMI and DIA frameworks are considered/cross-referenced, but your own rubric (to be placed in a folder for Claude Code/Fable to read) is weighted heavier, given your direct experience across multiple pharma/biotech vendor engagements.
4. **Resolved: SIMULATION labeling + fictional products.** Persistent SIMULATION state throughout, plus the B2C standard bank uses entirely fictional drug names/labels rather than real products — reduces both the real-system-confusion risk and any real-label accuracy/IP exposure. Enterprise custom scenarios use real client products, since that's the point of the paid tier.
5. **Resolved: voice is mandatory pre-launch, not deferred.** Laptop speakers/mic for STT/TTS. If any part of the voice build lands under an internal "V2" label for sequencing reasons, that V2 must complete *before* public release — there's no launch without it.
6. **Resolved: tenant isolation includes a dedicated folder/SharePoint per enterprise client**, in addition to `org_id`-level DB isolation — see §13.
7. **Resolved: launching B2C and enterprise onboarding together.** Trade-off to have eyes open about: doing both simultaneously usually dilutes early execution focus, since enterprise buyers need tenant isolation, org config, and procurement-grade trust signals that B2C users don't care about at all. The mitigation baked into the roadmap above is a **lightweight enterprise mode** — org-scoped accounts and manual SRD upload, but no SSO/SCIM yet — so enterprise pilots can start without forcing the full enterprise-integration build before the core loop is even validated. Revisit whether full enterprise (SSO, audit export, competency framework mapping) gets pulled forward based on which channel actually converts first.

---

## 17. Recommended Path Forward — Building with Claude Code

**Phase 0 (before any code):**
- Write **10 seed cases** by hand, using fictional products for the B2C bank. Each case needs: scenario script, ground-truth answer key, correct SRD (+ decoys), and rubric-scored "gold" documentation example. Expand to the hard-capped 20 after evaluator accuracy is validated.
- You sign off on the rubric and all seed case answer keys before anything goes live.
- Place your proprietary rubric (weighted heavier than PhactMI/DIA) in a dedicated folder for Fable/Claude Code to read and treat as the primary scoring contract.
- Lock the evaluation rubric (§10) into a structured JSON schema.
- Scaffold using your existing ICM (`/folder-project-structure`) approach — numbered stages: `01-seed-cases`, `02-rubric-schema`, `03-doc-simulator-ui`, `04-auth-admin`, `05-persona-engine`, `06-voice-layer`, `07-evaluator`, `08-accreditation-cert`, `09-enterprise-lite`, `10-dashboard`.

**Build sequence:**
1. Auth (customer login) + Admin UI shell — needed before anything else is testable end-to-end.
2. Training & Orientation module: Sonnet reviews/tailors your existing training content for this course; build the self-study + system-walkthrough flow.
3. Documentation Simulator UI, with **static/scripted cases, no AI yet** — nail workflow UX and the open-book/closed-book toggle.
4. Wire in the Persona Agent against the 10 seed cases in text mode first internally, to validate case/rubric quality fast — but voice must land before release, not stay text-only.
5. Voice pipeline: TTS + STT (Groq default), VAD-based turn-taking, CC caption strip.
6. Rules-based Documentation Validator.
7. LLM Evaluation Agent scoring against the rubric schema (your signed-off version).
8. Certification workflow: beginner (help-on, uncounted) → 3 first-try closed-book passes via voice → certificate. Certification locks in immediately on the 3rd pass; further practice on any scenario doesn't affect it.
9. Lightweight enterprise mode (org accounts, manual SRD/SOP upload + dedicated Google Drive folder, basic tenant isolation, CSV cohort roster).
10. Confidentiality/firewall tier (ZDR+DPA+/-BAA setup per vendor) — bundled with custom scenario builds.
11. Defer full SSO/SCIM, gamification, full Manager Dashboard, and any generative expansion past 20 cases to true V2.

**Stack**: Next.js + Supabase (Postgres/pgvector/auth) + Vercel + Claude API — the same stack you already know from EmersonApp.

---

## 18. Fable Build Orchestration

Fable's job here is planning and self-tasking, not execution of the whole build. Workflow:

1. **Fable plans the entire build up front** from this PRD (plus your rubric and training content, once placed in its folder): full task breakdown, sequencing, and an honest read on what fits in 2 days versus fast-follow.
2. **Fable determines which tasks it will execute itself** versus hand off — the highest-judgment, lowest-volume items: architecture decisions, rubric-to-code translation, security/tenant-isolation design, certification first-try/burn logic design, and review checkpoints on Opus's output. Fable states this split explicitly in its plan rather than silently doing everything or delegating everything.
3. **The completed plan (including Fable's self-assigned tasks and the delegation map) goes to Opus, which orchestrates actual execution** — dispatching to itself for complex-but-scoped implementation (persona engine, evaluator pipeline, voice integration, tenant isolation code) and to Sonnet for routine, well-specified work (CRUD screens, login/admin UI, documentation forms, case queue lists, CSV roster upload, training-module content review/tailoring).
4. **Fable also produces a step-by-step runbook for you.** Not just a plan for the AI agents — literal sequential instructions for you to execute across separate sessions: which prompt to run in which session, and what specific content/files to attach at each phase (e.g., "Session 1: attach seed cases + rubric, run this prompt with Opus" / "Session 2: once Documentation Simulator UI is done, attach training module source content, run this prompt with Sonnet"). You're the one executing prompts across sessions, so this needs to be concrete enough to follow without re-deriving the plan yourself.
5. Fable scopes the full enterprise Manager Dashboard build-out itself (heatmap, trend view, drill-in) as part of its planning pass — intentionally left lighter in this PRD (see Cohort Lite vs. full dashboard, §14) for Fable to size properly.
6. Report back a day-1/day-2 schedule with clear checkpoints, so scope tradeoffs are visible before time runs out rather than discovered at the deadline.
