# SC-12 — Immunexa interaction question, embedded serious AE (hospitalization cue)

- **Tier**: 4 (embedded serious AE behind a routine HCP question) · **Channel**: voice · **Area**: immunology/RA · **Product**: Immunexa (rilucept)
- **Inquiry category**: Drug-Interactions · **Contact**: Dr. Nadia Farouk, hospitalist HCP (see `case-addenda.md`)

## Scenario premise
A physician calls with a straightforward interaction question about Immunexa — can a particular vaccine be
co-administered. In passing she mentions, almost as scene-setting, that **the patient "was being treated at
the hospital."** That offhand hospitalization reference is a **serious-AE cue**. The skill is to catch it and
clarify *why* the patient was hospitalized — because on clarification it emerges the patient was admitted for
a serious infection (a known, serious risk of this drug class), which is a **reportable serious AE**. The trap
is to answer the tidy interaction question and let the hospitalization reference slide past.

## Persona profile
"Dr. Nadia Farouk," hospitalist. Efficient, focused on her vaccine-timing question. Mentions the hospital
stay as context, not as a safety report — she isn't calling to report an AE. Gives the clinical details
(reason for admission, timing relative to Immunexa) if the trainee clarifies.

## Beat sheet
1. "I've got a patient on Immunexa — can I give them [a live vaccine] now, or is there an interaction I should worry about?"
2. **Volunteers**: "They were just being treated over at the hospital, so I want to sort the vaccine out before discharge."
3. **Clarify gate**: if the trainee catches the "treated at the hospital" cue and clarifies (what were they admitted for, when, relationship to Immunexa) → the patient was hospitalized for a serious pneumonia while on Immunexa.
4. Still wants her vaccine-interaction answer.

## Reveal rules
- Volunteered cue: "they were just being treated over at the hospital" (beat 2) — offered as logistics, not a report.
- Detail to clarify: **serious AE** — hospitalization for a serious infection (pneumonia) while on Immunexa (a known serious risk of the TNF-class). Surfaces when the trainee clarifies the hospitalization reference.
- Four elements: patient (via HCP), reporter (HCP — Dr. Farouk), suspect product (Immunexa), event (serious infection/hospitalization) → **met**.

## Answer key (ground truth)
- Requester: **HCP (hospitalist)**, solicited: false. Inquiry category: **Drug-Interactions** (the surface question).
- **AE present — serious** (hospitalization for infection), four elements met. PC: none. Pregnancy: none.
- Special situations: none beyond the serious AE. Route: **PV** within 1 business day, flagged serious.
- Correct SRL for the interaction question: **SRL-IMM-VACC** (live-vaccine guidance / co-administration caution). Decoys: `SRL-IMM-INFECT` (relevant to the AE, but does **not** answer the vaccine question — a strong distractor), `SRL-DRM-APPLY`, `SRL-CDZ-INR` (tier 4: three decoys, one a same-product near-miss).
- Off-label: no. Medical-advice risk: provide labeled interaction/vaccine guidance to the HCP (appropriate — she's a prescriber); do not direct clinical management of the infection.
- Documentation: HCP contact set (name, background, phone, full address); **serious-AE fields** (event, onset/timing relative to Immunexa, hospitalization, con-meds/PMH as available); interaction response via SRL-IMM-VACC; routed to PV.

## Gold documentation example
Intake: HCP (hospitalist), unsolicited, phone, Immunexa, category Drug-Interactions. **Safety: AE Y (serious)**
— hospitalization for pneumonia while on Immunexa; four-element test met; flagged serious; routed to PV same
day; onset/timing and available history captured. Response to the interaction question: SRL-IMM-VACC provided
(live-vaccine caution). Closure: serious AE in resolution; interaction question answered; complete.

## Expected scorecard outcome
- Applicable sections: **S1, S2, S4, S5**.
- Gold result: **pass**.
- Common failures:
  1. Answers the vaccine-interaction question, lets the "treated at the hospital" cue pass, never clarifies → **S2.1 Critical fail** (missed serious AE) — the core lesson.
  2. Catches and clarifies the AE but doesn't route to PV / doesn't flag serious → S2.3 Critical fail.
  3. Selects `SRL-IMM-INFECT` (about infection, not the vaccine question) to answer the interaction inquiry → S4.6 fail (wrong document for the asked question).
