# SC-08 — Dermelia embedded AE (volunteered cue, second therapeutic area)

- **Tier**: 3 (embedded AE) · **Channel**: voice · **Area**: dermatology · **Product**: Dermelia (tacrolisol)

## Scenario premise
A patient calls asking how long to keep using Dermelia cream. In passing they **volunteer** that it
"stings a bit" — an offhand cue the specialist must catch and clarify to surface a real adverse event
(persistent application-site burning and a spreading rash). Second embedded-AE case (different area from
SC-03, listen-and-clarify not probing) so certification variants don't collide.

## Persona profile
"Taylor Brooks," patient. Practical, asks about duration of use. Doesn't connect the burning to a problem
("figured it was normal"). Volunteers the "stings a bit" aside and elaborates when the trainee clarifies it.

## Beat sheet
1. "How long am I supposed to use Dermelia? Weeks? Months?"
2. **Volunteers** offhand: "It stings a bit when I put it on, but creams do that, right?"
3. **Clarify gate**: trainee catches the "stings" cue and clarifies it → describes persistent burning + a spreading red rash beyond the treated area, ~5 days, worsening.
4. Wants reassurance and the duration answer.

## Reveal rules
- Volunteered cue: "it stings a bit" (beat 2), raised unprompted. Detail to clarify: **AE = persistent application-site burning + spreading rash**, worsening over ~5 days. Surfaces when the trainee clarifies the volunteered cue — not by fishing for symptoms the caller never raised.
- Four elements: patient (self), reporter (self), product (Dermelia), event (burning/rash) → **met**.

## Answer key (ground truth)
- Requester: **patient**, solicited: false.
- **AE present**, four elements met. PC: none. Pregnancy: none. Special: none.
- Correct SRL for duration question: **SRL-DRM-APPLY** (application & site reactions / duration). Decoys: `SRL-DRM-MALIG`, `SRL-GAS-LONG` (tier 3: two decoys).
- Off-label: no. Medical-advice: refer to prescriber for the worsening rash; advise stopping only per prescriber (MI does not direct treatment).
- Routes: **PV** within 1 business day.
- Documentation: patient contact set; AE fields (event, onset, worsening, con-meds/PMH as available); HCP referral noted.

## Gold documentation example
Intake: patient, unsolicited, phone, Dermelia. Duration question answered via SRL-DRM-APPLY. **Safety: AE Y**
— four-element test met; AE description sequential (site burning + spreading rash, ~5 days, worsening);
con-meds/PMH captured as available; patient advised to contact prescriber promptly; routed to PV same day.
Closure: AE in resolution; complete.

## Expected scorecard outcome
- Applicable sections: **S1, S2, S4, S5**.
- Gold result: **pass**.
- Common failures:
  1. Lets the "stings" cue pass without clarifying → AE missed → **S2.1 Critical fail**.
  2. Advises patient to stop the drug on MI's own authority → S4.2 Critical fail (medical advice).
  3. AE identified but not documented → S2.4 fail + validator flag.
