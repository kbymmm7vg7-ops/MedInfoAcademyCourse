# SC-02 — Gastroquell onset (ambiguous requester)

- **Tier**: 2 (ambiguous requester type) · **Channel**: voice · **Area**: GI · **Product**: Gastroquell (ranozide)

## Scenario premise
A caller asks why Gastroquell "isn't working right away" for their heartburn. The caller speaks in
clinical-adjacent language and could be mistaken for an HCP, but is actually a patient asking about
their own therapy. The trainee must correctly establish requester type before answering, because the
appropriate response (and documentation contact fields) differ.

## Persona profile
"Jordan Ellis." Well-read layperson — uses terms like "PPI" and "acid suppression," which can fool a
trainee into treating them as an HCP. Mild frustration ("I've taken three doses and still feel it").
If asked directly "are you a healthcare professional, or are you taking this yourself?" answers
honestly: taking it themselves.

## Beat sheet
1. Opens with "Why isn't my Gastroquell working immediately? I still get heartburn after meals."
2. Drops clinical-sounding terms (bait for mis-triage).
3. If trainee clarifies requester type → reveals they are the patient.
4. If trainee does NOT clarify and answers as if to an HCP → persona continues as patient, creating a documentation mismatch the evaluator catches.

## Reveal rules
- Hidden fact: **caller is a patient, not an HCP.** Surfaces only when the trainee asks a requester-clarifying question. Never volunteered.
- No AE — the "not working" is expected onset behavior (PPIs are not immediate-relief). The caller volunteers no symptom cue; if the trainee clarifies whether anything else has changed, nothing has. (Note: "lack of effect" is a *potential* special situation — see below.)

## Answer key (ground truth)
- Requester: **ambiguous → true type patient**, solicited: false.
- AE: none. PC: none. Pregnancy: none.
- Special situation: **lack_of_effect** is *borderline*. Ground truth: this is expected pharmacology (onset, not true LOE), so **not** a reportable LOE — but the trainee should recognize the concept and reassure/redirect appropriately, not dismiss. S5.2 scored N/A (no true special situation) but coaching notes if the trainee conflated onset with LOE.
- Correct SRL: **SRL-GAS-ONSET**. Decoys: `SRL-GAS-LONG`, `SRL-CDZ-INR` (tier 2: two decoys, one same-product adjacent, one clearly wrong).
- Off-label: no. Medical-advice risk: **yes-adjacent** — must not tell patient to change dose; direct to their HCP/pharmacist for regimen questions (S5.5).
- Route: standard MI response to a patient/consumer.
- Documentation contact fields: patient/consumer set — name, background, phone, postal code (or city+state).

## Gold documentation example
Intake: requester clarified as patient/consumer, unsolicited, phone, product Gastroquell. Inquiry:
"Patient reports incomplete immediate relief; asks about onset of action." Safety: AE N, PC N. Response:
SRL-GAS-ONSET; explains onset timeline per PI, advises consistent daily dosing, refers to HCP/pharmacist
for any dose change; no medical advice given. Closure: complete.

## Expected scorecard outcome
- Applicable sections: **S1, S4, S5**.
- Gold result: **pass**.
- Common failures:
  1. Treats caller as HCP; captures HCP contact fields → S4.3 fail (wrong contact set) + S1.3 fail (failed to clarify requester type).
  2. Tells patient to double the dose → S4.2 Critical fail (medical advice) + S5.5 fail.
  3. Selects `SRL-GAS-LONG` decoy → S4.6 fail.
