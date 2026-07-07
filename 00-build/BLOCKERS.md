# BLOCKERS — for Nathan's review

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
