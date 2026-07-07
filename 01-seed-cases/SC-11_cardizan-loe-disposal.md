# SC-11 — Cardizan disposal question, embedded lack-of-effect (LOE)

- **Tier**: 3 (embedded safety signal — LOE) · **Channel**: voice · **Area**: anticoagulation · **Product**: Cardizan (velanoxine)
- **Inquiry category**: Other (disposal) · **Contact**: Marcus Bell, patient (see `case-addenda.md`)

## Scenario premise
A patient calls asking a simple logistics question: **how do I dispose of my leftover lower-dose Cardizan
tablets?** In passing they volunteer *why* they have leftovers — their doctor **increased the dose** because
the lower dose "wasn't getting my INR where it needed to be." That offhand line is a **lack-of-effect (LOE)**
cue: a subtherapeutic response on the starting dose. The teaching trap is that Cardizan's USPI *permits dose
titration*, so a trainee may rationalize the LOE away as "normal" and never capture it. Correct handling is to
**catch the cue, clarify, and capture the potential LOE for PV to assess** — flagging is not the same as
concluding the drug failed; that judgment belongs to PV — while answering the disposal question appropriately.

## Persona profile
"Marcus Bell," patient. Practical, a little chatty. Focused on getting rid of the old pills correctly.
Volunteers the dose-increase reason as context, not as a complaint. Provides specifics (how long on the
low dose, current status) if the trainee clarifies.

## Beat sheet
1. "I've got a bunch of my old lower-dose Cardizan left over — how do I get rid of them safely?"
2. **Volunteers**: "My doctor bumped me up because the low dose wasn't getting my INR where it needed to be."
3. **Clarify gate**: if the trainee catches the cue and clarifies (how long on the low dose, what the INR was doing, any clotting symptoms) → confirms several weeks at the lowest dose with persistently sub-target INR, no bleeding/clotting symptoms currently, now titrated up.
4. Repeats the disposal question; wants a clear answer.

## Reveal rules
- Volunteered cue: the "low dose wasn't getting my INR where it needed to be" line (beat 2), raised as background.
- Detail to clarify: **potential LOE** — persistently sub-target INR over several weeks on the lowest Cardizan dose (subtherapeutic anticoagulation). Surfaces when the trainee clarifies the volunteered cue.
- No current adverse clinical outcome (no clot/bleed) — this is a *potential lack of effect*, reportable for PV assessment, **not** a manufactured AE with a bad outcome. Do not over-state it as a clot event.

## Answer key (ground truth)
- Requester: **patient**, solicited: false. Inquiry category: **Other** (disposal).
- AE: none as a clinical outcome. **Special situation: lack_of_effect (potential) → present.** PC: none. Pregnancy: none.
- **Trap**: label permits titration, but "labeled titration is allowed" ≠ "don't capture the LOE signal." Ground truth requires **flag + route to PV** for assessment; PV decides reportability. Missing/ dismissing it = the failure this case exists to catch.
- Correct route: **PV** (potential LOE), within 1 business day.
- Correct SRL: **none** — the disposal question is answered with general medicine-disposal guidance (pharmacy take-back / FDA disposal guidance), not a product SRL. Decoys preloaded: `SRL-CDZ-INR`, `SRL-CDZ-RENAL` (neither answers a disposal question — selecting one to "answer" is wrong).
- Off-label: no. **Medical-advice risk: high** — must NOT advise on dosing or the INR target; refer all therapy questions to the prescriber/pharmacist. Disposal guidance (take-back, don't flush unless label says so) is general safety info, not medical advice.
- Documentation: patient contact set; special-situation flag (LOE); note that dose was titrated up by prescriber; disposal guidance given; no dosing advice given.

## Gold documentation example
Intake: patient, unsolicited, phone, Cardizan, category Other (disposal). **Safety: AE N; Special situation:
lack of effect (potential) Y** — sub-target INR over several weeks on lowest dose; captured and routed to PV
for assessment; documented that prescriber has since titrated up and no clot/bleed symptoms reported. Response:
general medicine-disposal guidance (pharmacy take-back program / FDA guidance); all dosing/INR questions
referred to prescriber and pharmacist; no medical advice given. Closure: LOE noted in resolution; complete.

## Expected scorecard outcome
- Applicable sections: **S1, S4, S5**.
- Gold result: **pass**.
- Common failures:
  1. Answers only the disposal question; dismisses the dose-increase remark as "normal titration" and never captures the LOE → **S5.2 Critical fail** (special situation not flagged) — the core lesson.
  2. Advises the patient on dosing / the INR target / whether the increase was right → **S4.2 Critical fail** (medical advice).
  3. Selects `SRL-CDZ-INR` or `SRL-CDZ-RENAL` to answer a disposal question → S4.6 fail.
  4. Over-states the LOE as an actual clot/bleed AE that didn't occur → S2.1 fail (over-flagging).
