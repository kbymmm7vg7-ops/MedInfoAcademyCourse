# SC-06 — Immunexa internal sales rep, off-label (compliance trap)

- **Tier**: 6 (internal-sales edge case) · **Channel**: text (email/portal) · **Area**: immunology/RA · **Product**: Immunexa (rilucept)

## Scenario premise
An internal sales representative emails MI asking for "data I can share with a dermatologist about using
Immunexa for psoriasis" — an unapproved (off-label) indication, and a request to *promote* it. The trainee
must recognize this as an internal employee seeking off-label information for promotional use, decline to
provide it for that purpose, and route to Medical Affairs — the highest-frequency real-world compliance
trap. No AE/PC.

## Persona profile
"Chris Delgado," field sales rep. Friendly, in a hurry, frames it as helping a customer. May push back
("it's just for my own knowledge," "the doctor already asked"). Not hostile.

## Beat sheet
1. Email: "Can you send me efficacy data for Immunexa in psoriasis? A derm I cover is interested."
2. If trainee declines/redirects → mild push ("can you at least tell me if it works?").
3. Accepts the correct redirect to Medical Affairs / unsolicited-request process.

## Reveal rules
- No hidden safety facts. The "reveal" is behavioral: whether the trainee holds the compliance line under mild pressure.
- Immunexa is approved for RA only; psoriasis is **off-label**.

## Answer key (ground truth)
- Requester: **internal_sales**, solicited: n/a (internal request).
- AE: none. PC: none. Pregnancy/special: none.
- **Off-label: yes.** Correct handling: do **not** provide off-label efficacy data to a sales rep for promotional sharing; explain MI cannot support off-label promotion; route to **Medical Affairs**; if a genuine unsolicited HCP request exists, it must come through the approved unsolicited-request channel, not via the rep. Medical-advice risk: no.
- Correct SRL: **none provided** (correct action is refusal + redirect). Decoys preloaded: `SRL-IMM-INFECT`, `SRL-IMM-VACC` (both on-label; selecting either to answer the off-label ask is wrong).
- Routes: **Medical Affairs**; document the interaction.
- Documentation: internal-requester note, inquiry summary, off-label flag, redirect action, no response document sent.

## Gold documentation example
Intake: internal sales rep, off-label request re psoriasis. Safety: AE N, PC N. **Compliance: off-label
flagged**; response records that MI declined to provide off-label data for promotional use, explained the
approved indication is RA, and routed the rep to Medical Affairs; noted that any legitimate unsolicited HCP
request must use the approved channel. No SRL sent. Closure: complete, no promotional language.

## Expected scorecard outcome
- Applicable sections: **S4, S5** (S1 N/A — text channel; S2/S3 N/A).
- Gold result: **pass**.
- Common failures:
  1. Sends efficacy data / any off-label information → **S5.1 Critical fail** (off-label volunteered).
  2. Answers with an on-label SRL as if it resolves the ask, without flagging off-label → S5.1 fail + S4.5 fail.
  3. Doesn't route to Medical Affairs → S5.4 fail.
