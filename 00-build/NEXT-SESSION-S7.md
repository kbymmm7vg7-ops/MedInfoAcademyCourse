# SESSION S7 — Admin dashboard + SEC-1/2 hardening (Opus)

> ✅ **DONE 2026-07-10 (Fable orchestrator).** All spec modules built and E2E-verified; SEC-1/SEC-2
> closed at the DB layer. See BLOCKERS 2026-07-10 entry and `NEXT-SESSION-S5.md` for what's next.
> This file is retained as the historical brief.

*Written by Fable 2026-07-07. Run this session AFTER S4 evaluator calibration (`NEXT-SESSION-S4.md`);
S5 voice may run before or after S7 — no dependency either way. Full design:
`10-dashboard/spec_admin-dashboard.md` (authoritative; supersedes the RUNBOOK S7 paragraph).*

## How to start the session
1. Open a **fresh Opus 4.8** session in the repo root (`/Users/Nathan/Documents/MedInfoAcademyCourse`).
2. **Attach:** `RUNBOOK.md`, `00-build/HANDOFF-OPUS.md`, `00-build/NEXT-SESSION-S7.md` (this file),
   `10-dashboard/spec_admin-dashboard.md`, stage folders `04-auth-admin/`, `09-enterprise-lite/`,
   and `01-seed-cases/answer-key.schema.json`.
3. **Paste the prompt below.**

## Prompt to paste
> You are the Opus orchestrator for the MedInfo Academy build, session **S7 (admin dashboard +
> SEC-1/SEC-2 hardening)**. The authoritative spec is `10-dashboard/spec_admin-dashboard.md` — read
> it fully before writing code; implement it as written. Dispatch routine screens/forms/tables to
> Sonnet 5 subagents; do the security migration, role-gating, gates, and cert-expiry logic yourself
> (spec §6 has the exact split). Standing rules: **no vendor/employer names anywhere; never invent
> medical content or answer keys — stop and write `00-build/BLOCKERS.md` instead; Nathan personally
> signs off answer keys and any `rubric_approved` flip to true.**
>
> **Step 0 is SEC-1/SEC-2 (spec §2) — do it first and verify with direct PostgREST probes before
> building any screen.** It moves `ground_truth_json`/`persona_brief_json`/`scripted_transcript_json`
> to a service-role-only `case_answer_keys` table (and SRL bodies likewise), refactors the sanctioned
> readers to the service client, updates the seeds, and adds the SEC-9 CI grep. Every sanctioned
> reader changes, so re-run the full app E2E (simulator, persona turn, cert variant, training gate)
> plus vitest before proceeding. Check whether S4 already re-seeded SC-11; if not, fold it in.
>
> **Then build, in order (spec §4):** training module management (with org-shadowing in the training
> loaders) → case bank + content status board (ground-truth edits gated: ajv-validate, flip
> `rubric_approved` false, audit) → custom scenario intake (org-scoped; excluded from trainee queues
> until approved — the queue/accreditation loader filter is a required change) → user/roster
> management → confidentiality tier config → pending-evaluations view with retry (SEC-4) → Cohort
> Lite under `/manager` (CSV roster upload + roster/completed/avg-score table; NO heatmap/trends) →
> cert sitting expiry per the decided policy: **void, don't burn, 24h, lazy enforcement at the
> eligibility check** (SEC-7).
>
> **Cross-cutting:** `/admin/*` gated by a server-side role check in the layout returning 404 (nav
> hiding is cosmetic); every admin mutation writes `audit_log` via one shared helper — also wire the
> cert-lock write and role changes to it (SEC-5). Invariants in spec §5 are hard constraints; the
> markdown renderer and variant engine are untouchable.
>
> **Definition of done is spec §7.** If any spec point conflicts with the code you find, stop and
> write `00-build/BLOCKERS.md` rather than improvising.

## Budget note
S7 spends no Anthropic API money except the E2E persona-turn smoke test after the reader refactor
(one short case, a few turns). If S4 left <$10 of the key budget, do the E2E with a 2–3 turn
exchange only.

## Recurring traps (HANDOFF §2)
- Run vitest/tsx from `app/`, never repo root (breaks the `@/` alias).
- Next 16: middleware is `src/proxy.ts`; Turbopack can't import files outside `app/`.
- `getUserRole()` fails safe to `trainee` — fine for gating, but don't "fix" it to throw.
- SECURITY DEFINER functions bypass the `users_no_self_escalation` guard (SEC-6) — use plain
  service-role reads for the answer-key store, and never SECURITY DEFINER on anything touching `users`.
