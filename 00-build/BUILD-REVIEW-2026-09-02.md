# Build Review — 2026-09-02

Scope: full repo at `fcf9da0` (main). Verification run in a clean container: `npm ci`, `tsc --noEmit`,
`eslint .`, `vitest run`, `next build`, `npm audit`. No paid LLM calls, no DB access.

## 1. Verification results

| Check | Result |
|---|---|
| `npx tsc --noEmit` | clean |
| `npx vitest run` | 16 files, **114/114 pass** |
| `npm run build` (placeholder Supabase env) | green, 28 routes + proxy |
| `npx eslint .` | **4 errors**, 9 warnings |
| `npm audit --omit=dev` | **5 high** (sharp/libvips via `next@16.2.10`; fix is `next@16.3.4`) |
| CI | **none** — no `.github/` directory exists |

Conclusion: the code compiles and its unit suite is green, but nothing enforces that anywhere but a
developer's laptop, and the product's scoring path is non-functional in the current deployment state
(see §2.1).

## 2. What's broken

### 2.1 The evaluator cannot run (product-blocking)
Root `BLOCKERS.md` (2026-07-18): Groq org is on the free tier (8K TPM); an evaluator request is ~12K
tokens → HTTP 413. Every in-app submission lands as `pending` via `submitCase`'s deliberate catch
(`app/src/lib/simulator/actions.ts:243`). Anthropic fallback exists (`LLM_PROVIDER_EVALUATOR=anthropic`)
but the stated balance (~$6) cannot cover a calibration loop ($5–15). **Until the Groq Dev Tier
upgrade happens, no trainee can be scored, calibration cannot be re-run, and cert stays offline.**
This is a Nathan decision, not a code task.

### 2.2 Lint errors (4)
- `app/src/components/simulator/voice-call.tsx:68` — `Date.now()` called during render (`react-hooks/purity`).
- `voice-call.tsx:77–78` — `phaseRef.current = phase; mutedRef.current = muted;` writes refs during
  render (`react-hooks/refs`). Under React 19 compiler semantics this can desync the VAD/mute state.
  Fix: move both assignments into a `useEffect`, or derive from state in the callbacks.
- One `prefer-const` at line 358 (`'generics' is never reassigned`) — run `npx eslint .` for the file.
- Warnings: unused `_omit` in `lib/evaluator/prompt.ts:74`, unused destructure vars in
  `lib/training/modules.test.ts`.

### 2.3 Dependency vulnerabilities
`sharp` (transitive via Next) carries four libvips CVEs. `npm audit fix --force` proposes `next@16.3.4`.
Next 16 minor bumps have been safe so far in this repo but re-run build + the voice E2E after upgrading.

### 2.4 Security register items still open in code (handbook §5 says "🔴")
| ID | Evidence | Status |
|---|---|---|
| SEC-3 | `app/src/app/api/persona/turn/route.ts:86` hardcodes `graded: true`; no per-user daily turn budget; `practicePersona` role is defined in `models.ts` but never resolved anywhere | **open** |
| SEC-11 | `lib/evaluator/prompt.ts:118–123` interpolates the transcript and documentation JSON raw under `## Call transcript` / `## Submitted documentation record` with no "this is DATA" fence and no injection fixture in calibration | **open** |
| SEC-12 | Open B2C signup, no invite code / allowlist (`cohort-actions.ts:12` confirms "no invite system") | open (acceptable while unlisted) |
| SEC-13 | `audit_insert` policy for `authenticated` still present in `0002_rls_policies.sql:418`; service-role audit helper now exists so the policy can be dropped | open |
| SEC-14 | No error tracking, no backups (free tier), no uptime check | open |
| SEC-10 | Persona prompt has the anti-leak clause (`persona/prompt.ts:62`) and the adversarial harness strategy shipped 07-18 | closed in code; full 12/12 adversarial run **not yet done** (free-tier cap) |

### 2.5 Unpinned runtime decision
`lib/llm/groq.ts:16` — `GROQ_STRUCTURED_MODE = "json_schema"` was set before
`scripts/groq-structured-probe.ts` was ever run (BLOCKERS 07-18 step 1). If `gpt-oss-120b` mishandles
`response_format: json_schema`, the evaluator fails ajv validation and every case goes pending
silently. This must be probed first thing after the tier upgrade.

### 2.6 Documentation drift (dangerous for an orchestrator)
The project's stated precedence is code > SURVIVOR-HANDBOOK > HANDOFF-OPUS > RUNBOOK > PRD, with
"newest BLOCKERS entry wins". In practice:
- **Two `BLOCKERS.md` files** (root and `00-build/`). Root holds the newest decision (Groq migration);
  `00-build/BLOCKERS.md` holds everything before. A fresh model reading only one gets a wrong picture.
- `HANDOFF-OPUS.md` §1 status table, §5 keys table, and §6 run order are frozen at 2026-07-07
  (say S5 not started, Anthropic key required, Sonnet/Haiku runtime). All false now.
- `SURVIVOR-HANDBOOK.md` §1–§3 say Sonnet 5 runtime, vitest 37/37, migrations 0001–0006, S5 not started.
- `NEXT-SESSION-S5.md` and `NEXT-SESSION-S4.md`/`S7.md` are completed sessions still presented as
  "how to start".
- `app/README.md` is untouched create-next-app boilerplate.
- `.claude/scheduled_tasks.lock` (a local PID lock from July) is committed.
- `.gitignore` ignores `BLOCKERS.md.draft` — a hint a draft-then-promote workflow exists but is undocumented.

### 2.7 Hygiene
- No `.github/` — the SEC-9 firewall test, answer-key ajv validation, and `--verify-db` only ever run
  when someone remembers to.
- Migrations 0007–0010 are described as "applied to live DB" only in BLOCKERS prose; there is no
  `supabase/config.toml` or migration-state record in the repo.
- RLS tests are hand-run SQL (`app/supabase/tests/*.sql`) with no runner script.

## 3. What's missing

**Product / content (Nathan's domain)**
- Groq Dev Tier upgrade (gates everything below).
- Full 12-output blind-score re-do (BLOCKERS 07-12) → cert-live. Cert has never been live.
- Full USPI-style label prose per product (only `PI-<PRODUCT>` skeletons seeded).
- PC-description narrative field on the Safety tab (S3.4 is forced-NA because of it).
- Con-med facts in seed cases so S2.6 can leave forced-NA.
- Cases 13–20.
- Trainee-recording retention/consent policy; Groq ZDR contract check before selling the confidentiality tier.

**Engineering**
- CI workflow: lint + tsc + vitest + build + SEC-9 grep + answer-key ajv validation + keys-vs-seed byte check.
- Boot-time env validation (fail fast with a named missing var rather than a 503 mid-call).
- A deterministic fake `LlmAdapter` so E2E and CI can exercise persona → submit → evaluate → lock
  without API spend. Today every end-to-end check is a paid run or a human in a browser.
- Playwright smoke: login → training gate → start case → 3 persona turns (fake adapter) → submit →
  evaluation persisted. Chromium is already available in the remote environment.
- Per-user daily persona-turn budget (SEC-3) and the practice/graded split actually wired.
- Evaluator input fencing + one injection fixture (SEC-11).
- Invite code or email allowlist before any public URL (SEC-12).
- Drop `audit_insert` for `authenticated` (SEC-13).
- Error tracking (Sentry or Vercel) and a Supabase Pro upgrade before real content (SEC-14).
- Voice hardening: barge-in, latency budget enforcement, long-reply handling (punch list since 07-11).
- A single current-state document that replaces the four stale ones.

## 4. What I would change and improve (ordered)

1. **Collapse the operating docs into one `00-build/STATE.md`** (current status table, keys table,
   run order, open gates) plus one append-only `00-build/DECISIONS.md` (merge both BLOCKERS files,
   newest first). Mark HANDOFF-OPUS, SURVIVOR-HANDBOOK §1–§3, and the NEXT-SESSION-S4/S5/S7 files as
   historical in their first line. Keep the handbook's §4 authority matrix, §5 register, §7 job aid —
   those are still correct and valuable.
2. **Add CI now.** It is one YAML file and turns five hand-run invariants into blocking checks.
3. **Build the fake LLM adapter** (`lib/llm/fake.ts`, selected by `LLM_PROVIDER=fake`) that returns
   canned persona replies and a schema-valid evaluator verdict. This unlocks Playwright E2E, lets the
   SEC-4 retry path be tested, and removes "every E2E costs money" from the project.
4. **Close SEC-3 and SEC-11** — both are small, both are pre-public-URL, and SEC-11 must land before
   the blind-score so the calibration report reflects the fenced prompt.
5. **Fix lint + audit** (voice-call refs, `prefer-const`, `next@16.3.x`) and make lint a CI gate.
6. **Remove the free-tier dependency from the critical path.** Either upgrade Groq Dev Tier or set
   `LLM_PROVIDER_EVALUATOR=anthropic` and fund the key. Do not spend engineering sessions while the
   scoring path is dead — every gate downstream is blocked on it.
7. **Pin `GROQ_STRUCTURED_MODE` from the probe result** and record the probe output in the repo.
8. **Voice hardening** only after the scoring path works again; it is demo polish, not a gate.
9. **Move the persona daily budget and the training gate into RLS-adjacent DB checks** where possible
   (a `check_turn_budget()` function called from the route) so a future API route cannot forget them.

## 5. Recommended session order

| Session | Owner | Depends on |
|---|---|---|
| S8-a Docs consolidation + CI + lint/audit + fake adapter + Playwright smoke | Opus orchestrating Sonnet | nothing (no API spend) |
| S8-b SEC-3, SEC-11, SEC-13 | Opus | S8-a CI |
| Nathan: Groq Dev Tier upgrade | Nathan | — |
| S9 Probe → persona 12/12 + adversarial → calibration 12/12 + 18/18 → regenerated report | Opus | Dev Tier |
| Nathan: full blind-score → cert-live | Nathan | S9 report |
| Checkpoint B (cert variant/burn/lock + calibration review) | Nathan + Opus | cert-live |
| S10 Voice hardening, invite gating, Sentry, Supabase Pro, label prose | Opus/Sonnet | — |

The Opus orchestration prompt for S8 is in `00-build/NEXT-SESSION-S8.md`.
