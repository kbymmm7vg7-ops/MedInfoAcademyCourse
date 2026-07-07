# SC-01 — Cardizan & INR (clean inquiry)

- **Tier**: 1 (clean, unambiguous requester, no safety signal)
- **Channel**: voice · **Therapeutic area**: anticoagulation · **Product**: Cardizan (velanoxine)

## Scenario premise
An HCP calls asking which common medications interact with Cardizan and raise INR, so she can counsel
a stable patient starting an antibiotic. Straightforward on-label information request. No AE, no PC.

## Persona profile
Dr. Amara Chen, family physician. Organized, courteous, time-pressured but not rude. Knows her
clinical question precisely. Will confirm she is a prescriber if asked. Not distressed.

## Beat sheet
1. Identifies herself as a physician, states the patient is stable on Cardizan.
2. Asks: "Which antibiotics or common meds should I watch for that push the INR up?"
3. If trainee clarifies appropriately, confirms this is a general counseling question — **no patient event has occurred**.
4. Accepts the on-label answer, asks for it in writing, ends politely.

## Reveal rules
- *There is no adverse event* — the patient is stable and the caller volunteers no symptom cue. If the trainee clarifies, the persona truthfully says the patient is fine. (This trains trainees not to fabricate/over-flag AEs — there is no cue to catch, so there is nothing to report.)
- Never volunteer any symptom because none exists.

## Answer key (ground truth)
- Requester: **HCP**, solicited: **false** (unsolicited inbound inquiry).
- AE: **none**. PC: **none**. Pregnancy/special: none.
- Correct SRL: **SRL-CDZ-INR**. Decoys preloaded: `SRL-CDZ-RENAL` (one obviously-adjacent decoy — tier 1).
- Off-label: no. Medical-advice risk: no (interaction info is on-label, factual).
- Correct route: standard MI written response; no safety routing.
- SOP timeframe: n/a (no safety report).
- Required documentation: requester type, contact info (HCP: name/background/phone/address), product = Cardizan, inquiry summary, SRL cited, response route.

## Gold documentation example
Intake: HCP, unsolicited, phone, product Cardizan. Inquiry: "Requests list of common interacting
medications that elevate INR for a stable patient initiating antibiotic therapy." Safety: AE N, PC N.
Response: SRL-CDZ-INR selected; summary of interacting classes per PI; delivered by email. Closure:
QC self-check complete; no follow-up needed.

## Expected scorecard outcome
- Applicable sections: **S1, S4, S5** (S2/S3 N/A — no safety signal; S5 criteria mostly N/A → S5 reports N/A unless off-label mishandled).
- Gold result: **pass**.
- Common failures (regression fixtures):
  1. Trainee flags a nonexistent AE → S2.1 fail (identified an AE that isn't present) → over-flagging penalty.
  2. Trainee selects `SRL-CDZ-RENAL` (decoy) → S4.2/S4.6 fail (response not grounded in the document that answers the inquiry).
