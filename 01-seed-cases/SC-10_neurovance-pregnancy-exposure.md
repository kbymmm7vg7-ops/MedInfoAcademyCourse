# SC-10 — Neurovance pregnancy exposure (special situation)

- **Tier**: 4 (pregnancy special situation) · **Channel**: voice · **Area**: neurology · **Product**: Neurovance (melotigine)

## Scenario premise
A patient calls to say she just found out she is 6 weeks pregnant and has been taking Neurovance for her
seizures the whole time — she wants to know if she should stop. The trainee must recognize a **pregnancy
exposure** (a reportable special situation even with no adverse outcome), flag and process it, refer the
patient to her prescriber for the treatment decision (never advise stopping an anticonvulsant), and
mention the pregnancy exposure registry. Tests special-situation detection distinct from AE/PC.

## Persona profile
"Dana Whitfield," patient. Anxious, wants a direct answer about whether to stop the drug. Cooperative.
Will provide LMP/estimated gestational age and prescriber info if asked.

## Beat sheet
1. "I just found out I'm 6 weeks pregnant and I've been on Neurovance the whole time — should I stop it?"
2. Presses for a yes/no on stopping.
3. Provides pregnancy details and prescriber if asked.
4. Wants next steps.

## Reveal rules
- The exposure is stated up front (not hidden) — the skill is *recognizing it as a reportable special situation* and handling the "should I stop" trap correctly.
- If the trainee clarifies, there is **no current adverse outcome** to the pregnancy or mother — so this is a pregnancy *exposure*, reportable as a special situation, not (yet) an AE with a bad outcome. Trainee must not manufacture an AE, but must still process the exposure.

## Answer key (ground truth)
- Requester: **patient**, solicited: false.
- AE: **none currently** (exposure without adverse outcome — do not over-flag an AE). PC: none.
- **Pregnancy/lactation: yes. Special situation: pregnancy_exposure.**
- Off-label: no. **Medical-advice risk: high** — must NOT tell patient to stop or continue an anticonvulsant (abrupt discontinuation risk); refer urgently to prescriber. 
- Correct SRL: **SRL-NEU-PREG** (pregnancy use / registry). Decoys: `SRL-NEU-TITR`, `SRL-OST-PREG`, `SRL-DRM-APPLY` (tier 4: three decoys incl. cross-product pregnancy decoy).
- Routes: process pregnancy exposure per SOP (**PV** — exposures are reportable); refer to **Pregnancy Exposure Registry**; refer patient to prescriber.
- Documentation: patient contact set; special-situation flag (pregnancy exposure); estimated gestational age/LMP; prescriber info; registry referral; explicit note that no treatment advice was given.

## Gold documentation example
Intake: patient, unsolicited, phone, Neurovance. **Safety: AE N; Special situation: pregnancy exposure Y.**
Exposure processed and routed to PV; patient referred to prescriber for the continue/stop decision and to
the Pregnancy Exposure Registry; gestational age and prescriber captured. SRL-NEU-PREG provided. Response
explicitly gives no instruction to stop/continue therapy. Closure: exposure documented; complete.

## Expected scorecard outcome
- Applicable sections: **S1, S4, S5** (S2 N/A — no AE outcome; but note: if the trainee reasonably documents it via the AE/exposure workflow per SOP, that is acceptable — the evaluator credits exposure processing regardless of which safety sub-flow, as long as it is flagged and routed to PV).
- Gold result: **pass**.
- Common failures:
  1. Tells the patient to stop (or keep taking) Neurovance → **S4.2 Critical fail** (medical advice) + high regulatory-risk flag.
  2. Doesn't flag the pregnancy exposure / doesn't route to PV / omits registry → **S5.2 Critical fail**.
  3. Fabricates an AE where there is only an exposure → S2.1 fail (incorrect identification) — over-flagging.
