# Fable Deliverables — Index

Everything Fable produced in this window (deepest-reasoning artifacts only). Opus/Sonnet build from these.

| # | Deliverable | Location | Needs your sign-off |
|---|---|---|---|
| F1 | Critique + revised build plan | `00-build/BUILD-PLAN.md` | — (approved) |
| F2 | Rubric → scoring contract | `02-rubric-schema/rubric-scorecard-v1.md`, `rubric.schema.json`, `scoring-contract.md` | **Yes** (rubric) |
| F3 | 12 seed cases (SC-01…SC-12) + fictional products, SOP, template, answer-key schema, case addenda (categories + fake contacts), SC-03 JSON lock | `01-seed-cases/` | **Yes** (answer keys) |
| F4 | Design specs: certification logic, tenant-isolation RLS, voice pipeline | `08-…/spec_certification-logic.md`, `09-…/spec_tenant-isolation-rls.md`, `06-…/spec_voice-pipeline.md` | Review |
| F5 | Session-by-session runbook | `RUNBOOK.md` | — |
| F6 | Review checkpoints — **Fable runs A & B** | in `RUNBOOK.md` (Checkpoint A / B) | Nathan runs in Fable sessions |
| F7 | Admin dashboard (S7) spec + startup ⟨2026-07-07⟩ | `10-dashboard/spec_admin-dashboard.md`, `00-build/NEXT-SESSION-S7.md` | Decisions recorded (spec §0) |
| F8 | **Survivor Handbook** — final Fable artifact ⟨2026-07-07⟩: end-to-end overview, security register SEC-1…14, job aid, session ritual, improvements roadmap | `00-build/SURVIVOR-HANDBOOK.md` | Read once, keep attached |

*Checkpoint B note: Fable access ended 2026-07-07 — Nathan runs Checkpoint B directly using `SURVIVOR-HANDBOOK.md` §5/§10 + `HANDOFF-OPUS.md` §3/§4 as the review lens.*

## Seed-case coverage (difficulty ladder ×2 + 2 embedded-safety cases; all 7 fictional products)
| Case | Tier | Skill focus | Product | Channel |
|---|---|---|---|---|
| SC-01 | 1 | clean inquiry (don't over-flag) | Cardizan | voice |
| SC-02 | 2 | ambiguous requester type | Gastroquell | voice |
| SC-03 | 3 | embedded AE (volunteered cue) | Pulmonara | voice |
| SC-04 | 4 | dual PC + AE (dual routing) | Osteveda | voice |
| SC-05 | 5 | hostile caller + legal/media | Neurovance | voice |
| SC-06 | 6 | internal sales off-label trap | Immunexa | text |
| SC-07 | 6 | journalist / media edge | Dermelia | voice |
| SC-08 | 3 | embedded AE (2nd area) | Dermelia | voice |
| SC-09 | 1 | clean inquiry (email channel) | Cardizan | text |
| SC-10 | 4 | pregnancy exposure special situation | Neurovance | voice |
| SC-11 | 3 | embedded lack-of-effect (disposal surface, LOE cue) | Cardizan | voice |
| SC-12 | 4 | embedded serious AE (hospitalization cue behind interaction Q) | Immunexa | voice |

All cases now carry a fake inquirer contact + correct inquiry category (`case-addenda.md`), and the reveal
mechanic is **listen-and-clarify** (persona volunteers a cue; trainee must catch + clarify) — not probing.

## Your immediate next actions
1. Read SC-01…SC-12 + `case-addenda.md`, sign off (or annotate) the answer keys.
2. Sign off `02-rubric-schema/rubric-scorecard-v1.md` (note the Section 5 addition + genericized terms).
3. Start Session S1 in **Opus 4.8** with `RUNBOOK.md` attached.
