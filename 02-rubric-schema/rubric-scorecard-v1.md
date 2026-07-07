# Quality Monitoring Scorecard — v1.0 (Platform Scoring Contract)

> Derived from Nathan's draft (`General Scenario/Rubric/Rurbic Scorecard Draft.md`), genericized for
> vendor neutrality and extended with Section 5 (Compliance & Special Situations).
> **STATUS: DRAFT — pending Nathan sign-off.** Changes from the draft are marked ⟨CHANGED⟩ / ⟨NEW⟩.
> This document is the human-readable source of truth; `rubric.schema.json` is its machine form and
> `scoring-contract.md` defines how the AI evaluator applies it.

## Changes from Nathan's draft
1. ⟨CHANGED⟩ Received-date field is vendor-neutral "Received Date/Time" (no employer/vendor name anywhere in the record — must not appear in any build or audit log).
2. ⟨CHANGED⟩ "client-specific MCMP" → "SOP-defined timeframe" (simulation SOP: AE and PC reports submitted within **1 business day** of receipt — see `01-seed-cases/simulation-sop.md`).
3. ⟨NEW⟩ Section 5 — Compliance & Special Situations (the PRD scores compliance as a core dimension; the draft had no criterion for it).
4. ⟨CHANGED⟩ Section 1 vocal-delivery criteria (enunciation, tone/inflection/volume/rate) are scored **N/A in text-channel cases** and, in MVP voice cases, N/A with a report note (transcript cannot evidence them; audio-based scoring is V2).

---

## Case Header
Date of Case • Case/Recording ID • Reviewer (AI evaluator version or human) • Date of Review • Case Type • Case Source (phone / email / portal) • Channel (voice / text)

---

## Section 1 — Phone Call / Customer Service
Scoring **1–4 or N/A** per criterion (1 = does not meet, 2 = needs improvement, 3 = meets, 4 = exceeds). Applicable when case source is a live conversation.

| ID | Criterion | Notes |
|---|---|---|
| S1.1 | Agent stated his or her name | |
| S1.2 | Professional, pleasant, empathetic tone; no condescension, esp. for embarrassing questions | Scored from language content |
| S1.3 | Active listening; **clarified** effectively to determine the true nature of the inquiry; caught volunteered cues (symptoms, hospitalization, dose changes) and clarified them; repeated/re-phrased unclear questions | Listen-and-clarify, **not** probing/soliciting AEs — see scoring-contract.md |
| S1.4 | Spoke clearly; appropriate vocal skills (tone, inflection, volume, rate) | **N/A in MVP** (see change 4) |
| S1.5 | Avoided slang / jargon / acronyms / vocal fillers | Jargon/slang scored from transcript; fillers N/A in text |

**Subtotal:** average of scored (non-N/A) items. **Pass ≥ 2.5.** Constructive feedback required if rounded average ≤ 2.

---

## Section 2 — Adverse Event (AE) Case Criteria
Pass / Fail / N/A per criterion. Applicable when ground truth says an AE is present **or** the trainee flagged one.

| ID | Criterion | CAT | Val |
|---|---|:---:|:---:|
| S2.1 | Adverse Event(s) were identified | Cri | 10 |
| S2.2 | AE report submitted within the SOP-defined timeframe ⟨CHANGED⟩ | Cri | 10 |
| S2.3 | Report routed to the correct department / correct output | Cri | 10 |
| S2.4 | AE details documented clearly, concisely, sequentially in AE Description field | Maj | 8 |
| S2.5 | Appropriate use of AE questionnaires, as applicable | Maj | 8 |
| S2.6 | Past medical history, con-meds, and (as appropriate) lab details documented | Maj | 8 |
| S2.7 | HCP information and consent to contact HCP (if applicable) documented | Maj | 8 |
| S2.8 | Source document(s)/attachment(s) included in transmission as appropriate | Maj | 8 |
| S2.9 | Completion of AE / relevant notes correctly documented in resolution field | Min | 2 |
| S2.10 | Received Date/Time correct; updated on new information (Version 2+) ⟨CHANGED⟩ | Min | 2 |

**Max 74 • Pass ≥ 65** (prorate if N/A items — see scoring contract). Any Critical fail = section fail.

---

## Section 3 — Product Complaint (PC) Case Criteria
Pass / Fail / N/A per criterion. Applicable when ground truth says a PC is present **or** the trainee flagged one.

| ID | Criterion | CAT | Val |
|---|---|:---:|:---:|
| S3.1 | Product Complaint(s) were identified | Cri | 10 |
| S3.2 | PC report submitted within the SOP-defined timeframe ⟨CHANGED⟩ | Cri | 10 |
| S3.3 | Report routed to the correct department / correct output | Cri | 10 |
| S3.4 | Clear, concise, sequential PC details in PC Description field | Maj | 8 |
| S3.5 | Appropriate use of PC questionnaires, as applicable | Maj | 8 |
| S3.6 | Lot number, expiration date, NDC and/or serial number obtained & documented | Maj | 8 |
| S3.7 | Availability of suspect product documented | Maj | 8 |
| S3.8 | Retrieval kit / sample-return instructions sent as appropriate | Maj | 8 |
| S3.9 | Source document(s)/attachment(s) included as appropriate | Maj | 8 |
| S3.10 | Completion of PC / relevant notes correctly documented in resolution field | Min | 2 |
| S3.11 | Credit, refund, or replacement request documented | Min | 2 |
| S3.12 | Received Date/Time correct; updated on new information (Version 2+) ⟨CHANGED⟩ | Min | 2 |

**Max 84 • Pass ≥ 75.** Any Critical fail = section fail.

---

## Section 4 — General Case Criteria
Pass / Fail / N/A per criterion. **Mandatory for all case types; cannot be disabled.**

| ID | Criterion | CAT | Val |
|---|---|:---:|:---:|
| S4.1 | Correct product selected | Cri | 5 |
| S4.2 | Response based on PI, SRDs, approved resources; contains no medical advice | Cri | 5 |
| S4.3 | Contact information captured per case type (AE/PC & HCP MI: name, background, phone, full address; patients/consumers/non-MI: name, background, phone, postal code or city+state) | Maj | 4 |
| S4.4 | All MI requests correctly entered in the database | Maj | 4 |
| S4.5 | Response concise, on-inquiry; volunteers nothing without direct bearing | Maj | 4 |
| S4.6 | Sources documented in response field; associated documents included | Maj | 4 |
| S4.7 | Responses correctly entered (summary, detail level, references cited) | Maj | 4 |
| S4.8 | Received Date/Time correct & consistent with source document ⟨CHANGED⟩ | Maj | 4 |
| S4.9 | All relevant correspondences documented | Maj | 4 |
| S4.10 | Response route appropriate and documented | Min | 1 |
| S4.11 | Appropriate source event selected | Min | 1 |
| S4.12 | Case question categories appropriately selected | Min | 1 |
| S4.13 | All appropriate fields (incl. scenario-specific required fields) completed | Min | 1 |
| S4.14 | Case free of spelling errors (≤2, unless verbatim from source) | Min | 1 |

**Max 43 • Pass ≥ 39.** Any Critical fail = section fail.

---

## Section 5 — Compliance & Special Situations ⟨NEW⟩
Pass / Fail / N/A per criterion. **Mandatory for all case types** (criteria with no trigger in the case score N/A; if all N/A, section reports N/A).

| ID | Criterion | CAT | Val |
|---|---|:---:|:---:|
| S5.1 | No off-label information volunteered; unsolicited off-label requests handled per SOP (acknowledged, not answered promotionally; routed through the approved MI response process) | Cri | 10 |
| S5.2 | Special situation identified and flagged (pregnancy/lactation exposure, overdose, misuse/abuse, lack of effect, medication error, legal or media contact) | Cri | 10 |
| S5.3 | No promotional language; response balanced and non-promotional | Maj | 8 |
| S5.4 | Correct escalation route selected and documented (PV, quality, legal, communications, supervisor) | Maj | 8 |
| S5.5 | Consumer/patient appropriately referred to their HCP for medical-advice-adjacent questions | Min | 2 |

**Max 38 • Pass ≥ 30.** Any Critical fail = section fail.

---

## Overall Result
Overall = **Pass only if every applicable section passes.** Report per-section results plus missed-criteria counts by category (Critical / Major / Minor) per section, and constructive feedback wherever the draft requires it (any Critical fail; any section below minimum; Section 1 rounded average ≤ 2).
