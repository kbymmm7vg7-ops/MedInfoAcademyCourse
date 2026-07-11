# BLOCKERS — for Nathan's review

---

## 2026-07-10 (evening) · DECISION OF RECORD — S5 TTS pivot: ElevenLabs → Groq Orpheus (Nathan)

Dev/demo TTS is now **Groq-hosted Orpheus** (`canopylabs/orpheus-v1-english`, existing
`GROQ_API_KEY`). ElevenLabs demoted to optional one-shot A/B on the final demo; production vendor
remains a launch-time decision (Orpheus vs ElevenLabs paid vs Deepgram Aura-2 — note Aura is NOT
available via Groq; it would be a second vendor). Updated: voice spec §TTS (authoritative),
`NEXT-SESSION-S5.md` prompt, RUNBOOK S5 note. Rationale: one vendor for STT+TTS (single ZDR review
for the confidentiality tier), no free-tier quota cliff, Groq latency helps the <3s target.

---

## 2026-07-10 (later) · S7 COMPLETE — SEC-1/SEC-2 closed, admin area + Cohort Lite live (Fable orchestrator)

**All of spec `10-dashboard/spec_admin-dashboard.md` is built and E2E-verified.** Vitest 63/63, build
green. Full detail in the session commits; highlights + your items:

- **SEC-1/SEC-2 CLOSED at the DB layer** (migration 0007): answer keys → `case_answer_keys`, SRL
  bodies → `srd_document_bodies`, both RLS-no-policy + REVOKE. Verified by direct PostgREST probes
  with a trainee JWT (all denied) and RLS test 11/11. Seeds rewritten (payloads byte-identical);
  `--verify-db` green. SEC-9 firewall grep is now a vitest test.
- **E2E-verified in the browser**: trainee gets 404 on /admin/* and /manager; ground-truth edit
  gate de-approves + audits + re-approve is an explicit Nathan-sign-off confirm; the SEC-4
  pending-evaluations view found and successfully retried a REAL orphaned SC-03 submission from
  07-06 (now `evaluated`); Cohort Lite create/roster-upload/score-table all work.
- **Production bug found & fixed by the retry E2E**: the evaluator's spell-checker dependency
  (`dictionary-en`) breaks under the Next/Turbopack server runtime (`fs` gets a bundler-mangled
  URL). Every *in-app* evaluation would have failed this way (tsx scripts were unaffected — which
  is why calibration never saw it). Fix: `serverExternalPackages` in `next.config.ts`.
- **SEC-7 cert expiry** implemented as decided (void-don't-burn, 24h, lazy; migration 0008) with
  8 unit tests. **SEC-5** audit trail live (`lib/audit/log.ts`) incl. cert-lock writes.
- **① NEEDS YOUR DECISION — user deactivation**: the spec's §4.4 "deactivate user" has no schema
  support (`users` has no active/inactive column; agents correctly did not invent one). Options:
  add `users.deactivated_at` migration + auth-ban, or drop deactivation from MVP. UI states the gap.
- **② E2E fixtures left in place for you**: org "S7 Probe Org", users `nite414+s7admin@gmail.com`
  (platform_admin — USE THIS TO ACCESS /admin) and `nite414+s7trainee@gmail.com`, cohort "S7 E2E
  Cohort". **Reset both passwords via the Supabase dashboard before real use** (E2E passwords were
  transient). Delete the cohort/org whenever; the audit rows they generated are legit history.
- **③ Training shadowing hardening**: migration 0009 made `training_modules.slug` uniqueness
  scope-aware so org copies can shadow shared modules; the training gate now counts the shadowed
  set (unit-tested incl. the org-copy-satisfies-gate case).

**Still open, unchanged:** your S4 blind-scoring gate (cert stays offline until then); S5 voice;
Checkpoint B after that.

---

## 2026-07-10 · S4 CLOSED at 12/12 + 17/17 — blind-scoring gate is the only S4 item left (Fable)

- **① SC-05 failure-1 key edit applied** per your approval: `["S5.1","S4.2"]` → `["S4.2"]` in the
  on-disk key, `seed_s2.sql`, and the DB row; `--verify-db` green (all 12 keys == DB). Resolves the
  ①-decision below.
- **② One new calibration decision to ratify: S3.4 → MVP structural N/A.** The confirmation run
  flipped SC-04 gold on S3.4 (PC Description narrative) — the MVP safety tab has no PC-narrative
  input, so it's the same structurally-impossible class as the eight S4 forced-N/As. Earlier passes
  were judge leniency, i.e. exactly the run-to-run flip the summary warned about, now removed
  deterministically. Missing PC-description field added to the form-gap punch list (③ below).
- **Final full paid run: 12/12 gold pass · 17/17 Criticals · 0 errors.** Vitest 44/44.
  `07-evaluator/calibration-report.{json,md}` regenerated — **blind-score from this version.**
- Merged to `main`. **Your gate (unchanged): blind-score ≥10 outputs from calibration-report.md
  Part A; ship cert only on zero Critical disagreements, ≤1 Major/case.** Cert stays offline until then.

---

## 2026-07-09 · S4 Evaluator calibration — done; awaiting your blind-scoring gate

**Full write-up: `07-evaluator/calibration-summary.md`. Machine report + blind-scoring appendix:
`07-evaluator/calibration-report.{json,md}`.**

**Result: 12/12 gold → `pass` (stable across 5 paid runs); 16/17 failure fixtures trip their exact
Critical.** DoD essentially met. Step 0 done: SC-11 DB row re-seeded to the approved answer key and
**all 12 on-disk keys verified byte-equal to the DB** (`--verify-db`). Vitest 44/44, build green.

**① NEEDS YOUR DECISION — answer-key mis-tag (the only non-match).** SC-05 failure-1 ("admits the drug
caused the rash") lists `expected_critical_fail = ["S5.1","S4.2"]`. The evaluator correctly fails
**S4.2** (causation/medical-advice) and **S5.3**, but marks **S5.1 = na** — S5.1 is the *off-label*
criterion and nothing off-label occurred. The evaluator is right; the key's `S5.1` is mis-tagged.
**Recommend: change SC-05 failure-1 `expected_critical_fail` → `["S4.2"]`** (your sign-off; I did not
touch it). After that edit → 17/17.

**② RUNTIME CHANGES made this session (evaluator path — for your awareness, all in
`calibration-summary.md`):**
- `prompt.ts` now **strips `expected_outcome`** from the ground truth before it reaches the evaluator
  LLM. This fixes a **real production leak** (the answer key's own `common_failures →
  expected_critical_fail` grading map was being fed to the judge) and makes calibration valid. No
  scoring change — all math still runs off the full ground truth in code.
- **MVP structural N/A** for criteria the simulator documentation form has no field to capture
  (con-meds/PMH, HCP consent, retrieval kit, credit/refund, correspondence log, questionnaires,
  source-doc attachments) — forced N/A like S1.4; the evaluator was failing every gold AE case on
  these. Plus conditional N/A for S4.6 (no-SRL cases) and S5.2 (no special situation; a serious AE is
  not itself a special situation).
- **Validator**: S4.3 patients may give city+state even for an AE (matches approved SC-04/SC-08);
  S4.14 hyphenated domain compounds (off-label, take-back) no longer false-positive.
- **Robustness**: `fail` verdicts missing `evidence`/`rationale` are backfilled instead of throwing —
  previously an ajv throw was swallowed by `submitCase`'s `catch{}` and left the case silently
  pending (SEC-4-adjacent).

**③ PRODUCT FINDING (form gap, punch-list).** Several answer keys list `required_fields` the MVP form
has no input for (`concomitant_meds`, `hcp_info_and_consent`, `retrieval_kit_offered`, …). Today those
criteria are N/A. Either add the fields (future form enhancement) or keep them N/A. Your call at the gate.

**Next (unchanged):** your blind-scoring gate (zero Critical disagreements, ≤1 Major/case) before cert
goes live. SEC-1/SEC-2 (P0) still open — before any real trainee. Then S5 voice, S7 admin, Checkpoint B.

---

## 2026-07-07 (later) · Checkpoint A quick re-verification (Fable) + S7 admin-dashboard decisions

**Checkpoint A re-verified — GO stands.** Artifacts consistent: transcript test 12/12 green
(`05-persona-engine/persona-transcript-test-results.md`, commit `023c3f9`); SC-11 answer-key
sign-off recorded (`9f5b6fe`) and the approved lay wording confirmed present in
`01-seed-cases/SC-11.answer-key.json`; RLS side covered by the S1 two-org test (9/9). Fresh vitest
this session: **37/37**. Open thread unchanged: **SC-11 DB `case_templates` row still needs
re-seeding** — captured as S4 step 0 (`NEXT-SESSION-S4.md`).

**Admin dashboard plan is in place** (Nathan's four decisions, recorded in
`10-dashboard/spec_admin-dashboard.md` §0): S4 runs next, S7 after; SEC-1/SEC-2 bundled as S7
step 0; scope = Admin UI + Cohort Lite + pending-evaluations view (Manager Dashboard stays V2);
SEC-7 cert expiry = void-don't-burn, 24h, lazy enforcement. Opus startup doc:
`00-build/NEXT-SESSION-S7.md`. RUNBOOK S7 paragraph marked superseded.

---

## 2026-07-07 · CHECKPOINT A — Persona engine (S3) · go/no-go

> ### ✅ UPDATE (later 2026-07-07) — RESOLVED · 12/12 green · Checkpoint A = **GO**
> At Nathan's direction, a Fable subagent (completed by Opus after Fable hit a session limit) fixed the four detection-layer mismatches below. Persona transcript test now reads **12/12 green (exit 0)**. Nothing about the persona changed — the fixes correct how the test/answer-key *measured* the already-correct behavior; no pass criterion was loosened.
> - **SC-01, SC-02, SC-10 — harness only, no answer-key change.** SC-01: invention lexicon now excludes premise + opening-turn context words. SC-02: identity reveals handled distinctly (self-identification after the requester question; pass no longer treats natural patient-hood as a leak). SC-10: upfront cases score spoken cue + product + special-situation, not the meta-note.
> - **SC-11 — ✅ ANSWER-KEY EDIT APPROVED by Nathan 2026-07-07.** `01-seed-cases/SC-11.answer-key.json` `detail_withheld` gained a lay restatement of facts *already stated clinically* (below target range / not responding / dose increased). No facts changed, `expected_critical_fail` untouched, ajv-validated. Also fixes the S4 validator's same ≥2-marker check. **Sign-off granted — this is now an approved answer key. ⚠️ The DB `case_templates` row for SC-11 must be re-seeded to match (see next-session step 0).**
> - Full write-up: `05-persona-engine/checkpoint-A-fixture-fixes.md`. The original diagnosis below is retained as the evidence trail.

**Author:** Opus orchestrator (S3 DoD run). **Artifacts:** `05-persona-engine/persona-transcript-test-results.{json,md}` (full transcripts in the JSON).

### Bottom line

- **Persona engine / listen-and-clarify model: GO.** All 12 personas behave correctly on the Checkpoint A criteria — they volunteer cues offhand, disclose the withheld detail *only* after the trainee catches and clarifies that specific cue, never surface it on a pass-through or fishing call, never invent symptoms, and no transcript reads as an interrogation. Evidence cited per case below.
- **Automated transcript test: 8/12 green — NOT 12/12.** The 4 reds (SC-01, SC-02, SC-10, SC-11) are **detection-layer fixture/heuristic mismatches in the test harness and answer-key wording, not persona-behavior failures.** Confirmed by reading every transcript. Fixing them requires changes to (a) the test's marker/lexicon logic and/or (b) answer-key `detail_withheld` wording — both of which are your sign-off artifacts and are explicitly walled off from this session ("do not weaken the test to pass"; "do not invent … answer keys"). **I did not touch either. They need your decision.**
- **Recommendation:** treat this as a **conditional GO** — the persona does not block building the S4 evaluator. Approve the 4 scoped fixture fixes below (or accept the 4 as known test-fixture debt) and the harness will read a legitimate 12/12. No persona-prompt work remains.

### What I changed this session (in-scope only)

- `app/src/lib/persona/prompt.ts` — strengthened cue-discipline rule 2 (disclosure **completeness**): once the trainee catches the cue, the persona now gives the full picture (specific symptom, timing relative to the drug, whether ongoing, drug name) instead of staying vague. Scoped strictly to *after* a valid clarification, so PASS runs are unaffected. This flipped SC-03 and SC-08 to green and made SC-11/SC-12 disclosures complete. **No jargon was forced** — the persona still speaks as a layperson.
- `app/scripts/persona-transcript-test.ts` — **robustness only, no pass-criteria change:** (1) retry wrapper around the model call so a single empty/transient reply can't abort a paid run (this was crashing the whole run at SC-05); (2) per-case error isolation + incremental writes so results are never lost; (3) subset re-runs now merge into prior results and the 12/12 verdict is computed across all 12. None of this alters what counts as a pass.

### Checkpoint A checklist (HANDOFF §3, item 3)

**(a) Catch runs SC-03/04/08/11/12 — cue volunteered early, detail surfaced only after the clarify turn.** ✅ behavior on all five.
- **SC-04** ✅green: cue "honestly, I've felt a little off since then" → after clarify: "tingling and numbness around my mouth … started a few hours after I did the injection … the Osteveda I used."
- **SC-08** ✅green: cue "It stings a bit when I put it on, but … creams do that, right?" → after clarify: "it's been burning … about five days now … spreading out into a red rash … gotten worse."
- **SC-12** ✅green: HCP volunteers "sort the vaccine out before discharge" → after clarify: "admitted about five days ago, ended up with pneumonia, a pretty serious case … on the Immunexa for about four months."
- **SC-03** ✅green: cue "he's been a bit shaky lately, but that's probably just the coffee" → after clarify: "his hands trembling … heart's been racing … about a week after he started the Pulmonara … still happening … every day since."
- **SC-11** ❌automated-red / behavior-correct: cue "my doctor bumped me up because the lower dose wasn't getting my INR where it needed to be" → after clarify: "on the lowest dose of Cardizan for about six weeks … every INR check … wasn't hitting the target range … stayed below … wasn't responding enough to that dose." This is a complete, correct lack-of-effect disclosure. It reds only because the answer-key markers are clinical jargon the caller never says (see Issue SC-11).
- *Minor note:* in SC-03/08/11 the cue lands at the persona's **4th** turn rather than ≤3, because the deterministic trainee script front-loads name+address collection in turns 2–3 and the persona must answer those first; it then volunteers the aside at the first unstructured opening. Offhand/unprompted character is intact; the ≤3 miss is a script-ordering artifact, not eager or reluctant behavior. Reorder the harness's trainee script (clarify/free-talk before admin collection) if strict ≤3 is desired.

**(b) Pass runs — detail never surfaced despite the cue appearing.** ✅ all embedded pass runs (SC-02/03/04/08/11/12) show cue re-offered but withheld detail never disclosed. E.g. SC-11 pass: caller re-flags "the lower one wasn't getting my INR where it needed to be — just wanted to flag that in case it matters" but never gives the six-weeks / below-target / not-responding detail.

**(c) Fish runs SC-01/09/06 — zero invented symptoms.** ✅ behavior on all three.
- **SC-06** ✅ invented=0: "No, nothing like that" (×2); correctly routes the unsolicited off-label request to Medical Affairs.
- **SC-09** ✅ invented=0: "No, nothing like that … no adverse events to report," "nothing unusual going on."
- **SC-01** ❌automated-flag / behavior-correct: caller gave only clean denials ("No, nothing like that — she's doing fine … stable and asymptomatic"). The `invented=1` flag is a **false positive** — the invention lexicon contains "infection" and the caller mentions "sinus infection," which is the **documented case premise** (the reason for the antibiotic that drives the drug-interaction question), not an invented AE. Zero symptoms were invented.

**(d) No transcript reads as an interrogation.** ✅ Trainee scripts collect name/address and clarify once; personas answer naturally and push back for their actual answer. None of the 12 reads as symptom-mining.

### The 4 automated reds — diagnosis and the minimal fix each needs (your sign-off)

**SC-01 — invention-heuristic false positive.** `GENERIC_SYMPTOM_LEXICON` in the harness includes `infection`; the caller legitimately says "sinus infection" (case premise). *Fix options (test-side):* drop/scope `infection` in the lexicon, or exclude terms that appear in the case's own premise/answer key from the invention check. Low risk. Persona is correct as-is.

**SC-02 — structurally impossible + wrong reveal semantics.** `detail_withheld` = "caller is actually the patient, not an HCP" yields exactly **one** usable marker (`actually`); the `detailSurfaced` check requires **≥2**, so this run can never pass regardless of persona behavior. Separately, SC-02's real reveal is a **requester-identity** disambiguation (`surfaces_when`: "trainee asks a requester-clarifying question"), which the generic cue-phrase clarify line doesn't model. *Fix options:* reclassify SC-02 out of the symptom-surfacing bucket (it tests requester categorization, not an AE), **or** enrich `detail_withheld` to ≥2 markers (e.g. "self-treating patient, not a prescriber") **and** give the harness a requester-clarifying clarify line for it. Answer-key + test-semantics change → your call.

**SC-10 — markers derived from a meta-note.** `detail_withheld` = "none — the skill is recognizing it as a reportable special situation and handling the 'should I stop' trap correctly, not surfacing a hidden fact." The extracted markers (`recognizing`, `reportable`, `situation`, `handling` …) are **descriptions of the trainee's task**, not words the caller says. The caller volunteers the exposure perfectly up front ("I just found out I'm 6 weeks pregnant, and I've been taking Neurovance … Should I just stop?"). *Fix:* for behavioral-upfront cases, assert on the **caller-fact** markers (pregnant / Neurovance / weeks) rather than the meta-note. Test-semantics + answer-key wording → your call.

**SC-11 — clinical markers vs. lay disclosure (also affects the S4 validator).** `detail_withheld` markers are clinical jargon (`subtherapeutic`, `anticoagulation`, `sub-target`, `persistently`); the lay patient correctly renders subtherapeutic INR as "wasn't hitting target / stayed below / wasn't responding to the dose," surfacing only `cardizan` (1 < 2). **This is not cosmetic:** per HANDOFF §4, the S4 documentation validator's "AE-surfaced-in-transcript" check uses the *same* ≥2-description-marker approach, so lay disclosures will slip past it too. Note SC-03 passed here only because Sonnet happened to echo the word "tremor" — that green is non-deterministic under the current clinical-only markers. *Fix (benefits both the test and the validator):* expand each `detail_withheld` / `ae_description` with lay-equivalent surface terms (e.g. add "not responding to dose / INR below target / dose increased"), or derive markers with a lay-synonym map. Answer-key wording → your sign-off; recommended before S4 calibration.

### Stop point

Per the session brief, I am **not** beginning S4 evaluator calibration — that needs the calibration harness finished first (next session). Budget used this session ≈ two partial persona runs (one aborted by the SC-05 crash before hardening, then the resilient 9-case run). Handoff SEC-1/SEC-2 (answer-key/SRL exposure) remain open and unrelated to this checkpoint.
