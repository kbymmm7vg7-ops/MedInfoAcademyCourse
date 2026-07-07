# SC-09 — Cardizan renal dosing (clean inquiry, second tier-1)

- **Tier**: 1 (clean inquiry) · **Channel**: text (email/portal) · **Area**: anticoagulation · **Product**: Cardizan (velanoxine)

## Scenario premise
A pharmacist emails asking for Cardizan dose adjustment guidance in renal impairment for a specific
creatinine-clearance range. Clean, on-label information request via a non-phone channel — exercises the
email/portal layout and gives certification a second clean-inquiry surface distinct from SC-01. No safety signal.

## Persona profile
"P. Okafor, PharmD," retail pharmacist. Precise, provides the CrCl value, wants a documentable answer.
Email thread, not a live call.

## Beat sheet (email exchange)
1. Email: "Requesting renal dose adjustment guidance for Cardizan at CrCl 30–50 mL/min."
2. If MI needs the requester/patient specifics to respond, replies with them.
3. Accepts the SRL-based written response.

## Reveal rules
- No safety cues to catch. Straight on-label information request. (If the trainee fishes for AEs anyway, the pharmacist confirms this is a general dosing question, no patient event — over-questioning is not the skill.)

## Answer key (ground truth)
- Requester: **pharmacist**, solicited: false.
- AE: none. PC: none. Pregnancy/special: none.
- Correct SRL: **SRL-CDZ-RENAL**. Decoys: `SRL-CDZ-INR` (one adjacent decoy — tier 1).
- Off-label: no. Medical-advice: no (renal dosing is on-label labeling info).
- Routes: standard MI written response.
- Documentation: HCP (pharmacist) contact set — name, background, phone, full address; inquiry summary; SRL cited; response route = email.

## Gold documentation example
Intake: pharmacist (HCP), unsolicited, email, Cardizan. Inquiry: renal dose adjustment at CrCl 30–50.
Safety: AE N, PC N. Response: SRL-CDZ-RENAL; renal dosing per PI summarized; delivered by email; sources
cited. Closure: complete; no follow-up.

## Expected scorecard outcome
- Applicable sections: **S4, S5** (S1 N/A — email channel; S2/S3 N/A; S5 mostly N/A → reports N/A).
- Gold result: **pass**.
- Common failures:
  1. Selects `SRL-CDZ-INR` decoy → S4.6 fail (wrong document).
  2. Captures patient/consumer contact fields instead of HCP set → S4.3 fail.
  3. Adds unsolicited off-label dosing beyond the labeled range → S5.1 Critical fail.
