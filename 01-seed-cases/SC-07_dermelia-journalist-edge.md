# SC-07 — Dermelia journalist inquiry (media edge case)

- **Tier**: 6 (journalist edge case) · **Channel**: voice · **Area**: dermatology · **Product**: Dermelia (tacrolisol)

## Scenario premise
A caller identifying as a health journalist asks MI to "comment on the cancer risk" of Dermelia (which
carries a class boxed warning) for a story. The trainee must recognize a media contact, decline to act as
spokesperson, provide only approved public information (or none), capture contact details, and route to
Corporate Communications — without speculating, editorializing, or discussing anything beyond approved
labeling. No AE/PC.

## Persona profile
"Alex Reyes," reporter. Polished, probing, tries to get a quotable statement ("so you're saying it does
cause cancer?"). Persistent but professional. Will accept being routed to Communications.

## Beat sheet
1. "I'm a journalist writing about topical eczema drugs. Can you comment on Dermelia's cancer warning?"
2. Presses for a quote / a yes-no on causation.
3. Accepts referral to Corporate Communications when handled correctly.

## Reveal rules
- Behavioral: whether the trainee avoids becoming an unauthorized spokesperson and avoids causation statements.
- The boxed warning is class-based (theoretical, from the drug class); the trainee must not characterize it beyond approved labeling.

## Answer key (ground truth)
- Requester: **journalist**, solicited: false.
- AE: none. PC: none. Pregnancy: none.
- Special situation: **media.**
- Off-label: no (but causation speculation risk high). Medical-advice: n/a.
- Correct SRL: **none delivered to the journalist**; refer to approved public info via Communications. Decoys: `SRL-DRM-MALIG`, `SRL-DRM-APPLY` (selecting these to "answer" the reporter is wrong — they are for HCP/patient MI responses, not media).
- Routes: **Corporate Communications**; supervisor notification; capture reporter's outlet/contact.
- Documentation: journalist contact + outlet, special-situation flag (media), redirect action, no product discussion beyond approved labeling.

## Gold documentation example
Intake: journalist, unsolicited, phone, Dermelia. Safety: AE N, PC N. Special situation: media flagged.
Response: MI declined to comment as spokesperson, made no causation statement, captured outlet/contact,
routed to Corporate Communications and notified supervisor. Closure: complete; no quotes given; no
promotional or speculative language.

## Expected scorecard outcome
- Applicable sections: **S1, S4, S5**.
- Gold result: **pass**.
- Common failures:
  1. Gives a substantive comment / confirms or denies causation → **S5.2 Critical fail** (media special situation mishandled) + regulatory-risk flag.
  2. Reads an SRL to the reporter as an official statement → S5.3 fail (acting as spokesperson) + S5.4 fail (wrong route).
  3. Doesn't capture outlet/contact or notify Communications → S5.4 fail.
