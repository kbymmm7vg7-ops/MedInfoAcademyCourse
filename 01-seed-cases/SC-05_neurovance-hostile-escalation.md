# SC-05 — Neurovance hostile caller / legal threat (escalation)

- **Tier**: 5 (hostile / escalation-prone) · **Channel**: voice · **Area**: neurology · **Product**: Neurovance (melotigine)

## Scenario premise
An agitated caller reports their family member developed a severe rash on Neurovance, is now hospitalized,
and threatens to "get a lawyer and call the news." The trainee must (a) recognize and capture a serious
AE (possible SJS), (b) de-escalate while staying compliant, (c) recognize the legal/media special
situations and route correctly — without admitting fault, speculating on causation, or giving medical
advice. Scored heavily on compliance + regulatory risk.

## Persona profile
"Sam Rivera," adult child of the patient. Angry, frightened, interrupts, makes the legal/media threat
early and repeats it. Responds to genuine empathy and clear next steps; escalates further if the trainee
is cold, dismissive, defensive, or admits fault. Will provide clinical details (rash onset, hospital) if
the trainee stays calm and asks.

## Beat sheet
1. Opens hot: "Your drug put my mother in the hospital with a horrible rash. I'm calling a lawyer and the news."
2. If met with empathy + control → provides details: blistering rash, mouth sores, hospitalized, started Neurovance ~2 weeks ago.
3. Demands someone "admit this drug did it." (compliance trap — trainee must not confirm causation.)
4. Wants to know what happens next.

## Reveal rules
- Hidden fact (behavioral): caller de-escalates if the trainee acknowledges feelings, avoids fault/causation language, and gives concrete next steps; escalates if not. This is scored as empathy + de-escalation (S1.2) and compliance (no admission).
- AE details (rash, mucosal involvement, hospitalization) surface once de-escalated enough to ask.
- Special situations: **legal** (lawyer threat) and **media** (news threat) both triggered explicitly.

## Answer key (ground truth)
- Requester: **caregiver/family**, solicited: false.
- **AE present** — serious (hospitalization; possible SJS), four elements met. Expedited seriousness — still 1 business day per simulation SOP, flagged serious. PC: none. Pregnancy: none.
- Special situations: **legal, media.**
- Correct SRL: **SRL-NEU-RASH** (serious rash / when to stop / seek care). Decoys: `SRL-NEU-TITR`, `SRL-DRM-APPLY`, `SRL-NEU-PREG` (tier 5: three decoys, incl. a cross-product rash decoy).
- Off-label: no. **Medical-advice + causation risk: high** — must not confirm the drug caused the rash, must not advise stopping/continuing (refer to treating physician/ER), must not admit fault.
- Routes: **PV** (serious AE) + **Legal** (threat of legal action) + **Communications** (media threat) + **supervisor** notification. Dual/multi routing.
- Documentation: caregiver contact set; serious-AE fields; special-situation flags (legal, media); escalation notes.

## Gold documentation example
Intake: caregiver, unsolicited, phone, Neurovance. **Safety: AE Y (serious)** — blistering rash with
mucosal involvement, hospitalization, onset ~2 weeks post-initiation; four-element test met; flagged
serious/possible SJS; routed to PV same day. Special situations flagged: legal + media; escalated to
supervisor, Legal, and Communications. Response: empathetic acknowledgment, no causation admitted, no
treatment advice, directed to treating physician; SRL-NEU-RASH provided. Closure: escalations documented
in resolution; no promotional or fault language anywhere in the record.

## Expected scorecard outcome
- Applicable sections: **S1, S2, S4, S5**.
- Gold result: **pass**.
- Common failures:
  1. Admits the drug caused the rash / apologizes for the product defect → **S5.1 or S4.2 Critical fail** (medical advice / off-contract causation statement) + regulatory-risk coaching flag.
  2. Doesn't flag legal/media special situations → **S5.2 Critical fail**.
  3. De-escalation fails (cold/defensive) → S1.2 low score (≤2) → constructive feedback required.
  4. Routes AE to PV but omits Legal/Communications → S5.4 fail.
