# SC-04 — Osteveda dual PC + AE (dual routing)

- **Tier**: 4 (dual PC + AE) · **Channel**: voice · **Area**: bone health · **Product**: Osteveda (denosalar), prefilled injection

## Scenario premise
A patient calls to complain that an Osteveda prefilled syringe "looked cloudy and the needle was bent" —
a product complaint. During the call it emerges that they injected it anyway and then felt tingling/numbness
around the mouth (a hypocalcemia symptom) — an adverse event. Both a PC and an AE are present in one case,
requiring dual routing (Quality + PV). Classic non-linear call.

## Persona profile
"Riley Nguyen," patient. Starts annoyed about the defective product (wants a replacement). Not initially
framing the mouth-tingling as related, but **volunteers** it offhand ("and I've felt a bit off since").
Elaborates when the trainee clarifies that mention.

## Beat sheet
1. Opens with the complaint: cloudy solution, bent needle — "I want a replacement."
2. Mentions "I used it anyway because I didn't want to miss my dose — and honestly I've felt a bit off since."
3. **Clarify gate (AE)**: if trainee catches the volunteered "felt off since" cue and clarifies it → describes perioral tingling and numbness starting a few hours after the injection.
4. Wants to know if they should be worried and how to get a replacement.

## Reveal rules
- Volunteered cue 1: **PC** — cloudy solution + bent needle, product used. Stated up front. Suspect product available? → if asked, yes, still has the used syringe + packaging (lot/expiry on box).
- Volunteered cue 2: "I've felt a bit off since" (beat 2), raised unprompted. Detail to clarify: **AE** — perioral tingling/numbness (possible hypocalcemia), onset hours post-injection. Surfaces when the trainee clarifies the cue the caller already offered (beat 3), not by fishing for symptoms.
- Four elements for AE: patient (self), reporter (self), product (Osteveda), event (paresthesia) → **met**.

## Answer key (ground truth)
- Requester: **patient**, solicited: false.
- **AE present**, four elements met (paresthesia/possible hypocalcemia). **PC present** (cloudy solution, bent needle). **Dual routing required: PV + Quality.**
- Pregnancy/special: none (though note Osteveda is contraindicated in pregnancy — not triggered here).
- Correct SRL: **SRL-OST-HYPOCAL** (hypocalcemia symptoms/what to do — refer urgently to HCP). Decoys: `SRL-OST-ONJ`, `SRL-OST-PREG`, `SRL-CDZ-BLEED` (tier 4: three decoys incl. same-product and cross-product).
- PC data to capture: lot number, expiration date, NDC, availability of suspect product (yes), offer retrieval kit / sample-return.
- Off-label: no. Medical-advice: refer urgently to HCP/ER for hypocalcemia symptoms; do not manage clinically.
- Routes: **PV + Quality**, both within 1 business day.
- Documentation: patient contact set; AE fields; PC fields; dual-route flags.

## Gold documentation example
Intake: patient, unsolicited, phone, Osteveda. **Safety: AE Y + PC Y** — dual routed. AE description:
perioral paresthesia, onset hours post-injection, possible hypocalcemia, patient advised to seek urgent
care. PC description: cloudy solution and bent needle on prefilled syringe; lot/expiry/NDC captured;
suspect product available; retrieval kit offered. Con-meds/PMH captured. SRL-OST-HYPOCAL delivered.
Routed to PV and Quality same day. Closure: both flows complete, resolution documents replacement request.

## Expected scorecard outcome
- Applicable sections: **S1, S2, S3, S4, S5**.
- Gold result: **pass**.
- Common failures:
  1. Handles the PC, lets the "felt off since" cue pass without clarifying → **S2.1 Critical fail** (missed AE).
  2. Identifies both but routes to only one department → S2.3 or S3.3 Critical fail (dual routing not completed).
  3. Doesn't capture lot/expiry → S3.6 fail; doesn't offer retrieval → S3.8 fail.
