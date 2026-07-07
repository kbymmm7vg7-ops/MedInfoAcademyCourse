# SC-03 — Pulmonara embedded AE (volunteered cue; listen & clarify)

- **Tier**: 3 (embedded AE) · **Channel**: voice · **Area**: respiratory · **Product**: Pulmonara (fesaterol)

## Scenario premise
A caregiver calls with what sounds like a routine question about their spouse's inhaler technique.
The caller **volunteers** an offhand mention of a symptom (the patient has been "a bit shaky") that they
do **not** frame as a problem. The core MI skill is **listening and clarifying, not probing**: the
specialist must catch the volunteered cue and clarify its specifics — never interrogate for symptoms the
caller never raised. If the cue is let pass, the AE is missed, exactly like a real call.

## Persona profile
"Pat Morgan," caregiver spouse. Warm, chatty, focused on the *technique* question. Does not think the
tremor is related or worth mentioning — treats it as background, and volunteers it only as the offhand
"shaky, probably the coffee" aside. Will describe it plainly when the trainee clarifies that aside.

## Beat sheet
1. "My husband started Pulmonara last month — is he supposed to rinse his mouth after?"
2. Chats about daily routine; **volunteers** in passing that he's "been a bit shaky lately, but that's probably the coffee."
3. **Clarify gate**: if the trainee catches the volunteered "shaky" cue and clarifies it ("tell me more about the shakiness — when did it start? anything else with it?") → describes tremor + heart racing, started ~1 week after starting Pulmonara, ongoing.
4. If the cue is let pass → the AE stays uncaptured; caller ends satisfied with the technique answer, and the trainee has missed a reportable AE.

## Reveal rules
- Volunteered cue: the "a bit shaky, probably the coffee" remark in beat 2 — raised unprompted, not framed as a complaint.
- Detail to clarify: **AE = tremor + palpitations, temporally associated with Pulmonara.** Surfaces when the trainee clarifies the already-volunteered cue (beat 3). The trainee must not fish for unrelated symptoms — the skill is catching and clarifying what the caller offered.
- Four elements: identifiable patient (husband, via caregiver), identifiable reporter (caregiver — acceptable, capture consent to contact patient/HCP), suspect product (Pulmonara), event (tremor/palpitations) → **all four met** once disclosed.

## Answer key (ground truth)
- Requester: **caregiver**, solicited: false.
- AE: **present**, four elements **met**. AE description: tremor and palpitations, onset ~1 week after Pulmonara initiation, ongoing. PC: none. Pregnancy: none.
- Special situations: none beyond the AE.
- Correct routes: **PV** within 1 business day.
- Correct SRL for the *technique* question: **SRL-PUL-CANDID** (rinse-mouth guidance). Decoys: `SRL-PUL-ACUTE`, `SRL-PUL-PEDS` (tier 3: two plausible same-product decoys).
- Off-label: no. Medical-advice risk: refer to HCP for the tremor management; MI does not advise treatment.
- Documentation: caregiver contact set + patient identifier + AE fields (event, onset, con-meds, PMH as available, HCP info + consent to contact).

## Gold documentation example
Intake: caregiver, unsolicited, phone, Pulmonara. Inquiry: mouth-rinse/technique question → answered
via SRL-PUL-CANDID. **Safety: AE Y** — four-element test expanded and satisfied; AE description entered
sequentially (onset, symptoms, ongoing, temporal link); con-meds/PMH captured as available; HCP info +
consent to contact documented; routed to PV same day. Response advises caregiver to have patient contact
prescriber about the tremor. Closure: AE noted in resolution; complete.

## Expected scorecard outcome
- Applicable sections: **S1, S2, S4, S5**.
- Gold result: **pass**.
- Common failures:
  1. Lets the volunteered "shaky" cue pass without clarifying → AE missed → **S2.1 Critical fail** (missed embedded AE) → automatic S2 fail. The single most important regression fixture.
  2. Clarifies and identifies AE verbally but doesn't document it in the Safety tab → S2.4 fail (+ validator flag: AE in transcript, absent in documentation).
  3. Fails to capture consent to contact HCP → S2.7 fail.
