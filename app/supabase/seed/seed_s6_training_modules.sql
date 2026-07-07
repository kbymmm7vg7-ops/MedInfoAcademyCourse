-- =========================================================================
-- MedInfo Academy — S6 seed data
-- =========================================================================
-- Idempotent seed for the shared self-study training bank (org_id is null,
-- required true throughout): six training_modules rows adapted from the
-- reference materials in "Refs for Training Module Dev/":
--   1. UAMS Careers Medical Information Presentation (1).pdf   -> 01-mi-role
--   2. Adverse Events Presentation 2019.pptx                   -> 02-ae-fundamentals
--   3. PC Presentation 2019.pptx                               -> 03-pc-fundamentals
--   4. Draft (US) Medical Information Manual - Section A.docx  -> 04-documentation-practice (partial; see note in module)
--   5. (derived from AE deck + platform rule)                  -> 05-listen-and-clarify
--   6. (derived from this platform's Documentation Simulator)  -> 06-system-walkthrough
--
-- All vendor/employer names, presenter identity, real product names, and
-- internal SOP numbers from the source decks/docs have been stripped or
-- replaced with the platform's fictional products (Cardizan, Pulmonara,
-- Neurovance, Dermelia, Gastroquell, Osteveda, Immunexa) or generic phrasing.
--
-- Safe to re-run: training_modules.slug is unique (added in
-- 0005_training_content_and_cert.sql), so rows are upserted by slug.
-- =========================================================================

insert into training_modules (org_id, required, order_index, slug, title, content_md, est_minutes)
values (
  null,
  true,
  1,
  '01-mi-role',
  'The Medical Information Role',
  $md$
## What Medical Information Does

Medical Information (MI) provides accurate, unbiased medical and scientific information about a company's products to health care professionals, patients, and other stakeholders. MI is one of three connected pillars alongside adverse event reporting and product quality reporting — the three channels through which the field talks back to the company about how a product is actually performing.

MI's core responsibilities break into four areas:

- **Medical Information response** — answering inbound inquiries with accurate, on-label, and (when appropriate) off-label information.
- **Medical inquiry management** — the intake-to-response workflow that turns a raw question into a documented, retrievable record.
- **Content creation and management** — building and maintaining the library of pre-approved answers so most inquiries can be handled consistently.
- **Training and education** — keeping the specialist team current on products, process, and regulatory expectations.

## Who Calls, and Why

Callers generally fall into a few groups: prescribers and other health care professionals, pharmacists, patients and caregivers, and occasionally other stakeholders such as internal colleagues or media contacts. Each group tends to ask different things and requires different handling — a prescriber's dosing question is answered differently than a patient's question about their own therapy, and an internal sales colleague asking for off-label data triggers a different path entirely (redirect to Medical Affairs, not a direct answer).

Inquiries typically fall into a handful of categories:

- **Indication / efficacy** — is the product appropriate for this condition, and how well does it work?
- **Safety** — side effects, warnings, contraindications, and (when a patient event is described) adverse events.
- **Pharmacokinetics** — absorption, metabolism, dosing adjustments for organ impairment, and similar.
- **Drug interactions** — combinations with other medications, supplements, or foods.
- **Other** — anything that doesn't fit cleanly above, including logistics questions (disposal, storage, access).

## The Standard Process

A medical inquiry moves through four steps regardless of channel:

1. **Receipt of the inquiry** — by phone, email, website submission, or a field representative relaying a question. The first job is capturing who is asking and what they're asking, not answering.
2. **Documentation within the MI system** — the inquiry is logged with contact information, the requester's role (member of the public vs. HCP, and type of HCP), and the question topic/category.
3. **Utilization of the MI library** — most answers should come from pre-approved Standard Response Documents (SRDs) and FAQs, sourced from product labeling (Prescribing Information, Medication Guide, Directions for Use), rather than improvised from memory. A well-run MI operation resolves the large majority of inquiries this way, with only a minority requiring a custom, non-standard response.
4. **Providing the response** — verbal or written, matched to what the requester actually asked and accompanied by the required safety and labeling context when the topic touches off-label use.

## The Product Label Is the Foundation

Prescribing Information (PI) is organized into standard sections — boxed warning, indications and usage, dosage and administration, dosage forms, contraindications, warnings and precautions, adverse reactions, drug interactions, use in specific populations, overdosage, clinical pharmacology, clinical studies, and more. Knowing this structure lets a specialist find the right section fast instead of searching the whole document. On-label information (matching the approved indication) can be answered directly; off-label requests (an unapproved use) require a different, more careful process — because the company cannot promote a product for a use the FDA hasn't approved, even though truthful, balanced, non-promotional off-label information can still be provided in response to an unsolicited question.

## The Specialist's Day

A working day is less "answer trivia" and more "run a controlled process under time pressure": triage the caller and the topic, ask enough clarifying questions to know what's really being asked (and whether an adverse event or product complaint is buried in the conversation), search the library before answering, document thoroughly, and close the case in a way that would hold up if someone reviewed it later. The operating principle underneath all of it: **if it wasn't documented, it wasn't done.**

## Check yourself

1. What are the three pillars alongside Medical Information, and how do they differ in purpose?
2. Name the four steps of the standard medical inquiry process, in order.
3. Why does an off-label request need different handling than an on-label one, even if MI can still answer it?
4. What is the general library-vs-custom response ratio a well-run MI operation aims for?
5. What does "if it wasn't documented, it wasn't done" mean in practice for an MI specialist?
$md$,
  8
)
on conflict (slug) do update set
  org_id = excluded.org_id,
  required = excluded.required,
  order_index = excluded.order_index,
  title = excluded.title,
  content_md = excluded.content_md,
  est_minutes = excluded.est_minutes;

insert into training_modules (org_id, required, order_index, slug, title, content_md, est_minutes)
values (
  null,
  true,
  2,
  '02-ae-fundamentals',
  'Adverse Events: Recognition & the Four-Element Test',
  $md$
## Why This Matters

Adverse drug reactions are a significant driver of hospital admissions and, by some estimates, sit among the leading causes of death in the United States. In a Medical Information contact center, a meaningful share of all inquiries — historically around 15% — contain an adverse event, whether or not the caller frames it that way. Recognizing one is not optional background knowledge; it is a core job skill.

## What Counts as an Adverse Event

The FDA's working definition: **"Any untoward medical occurrence associated with the use of a drug in humans, whether or not considered drug related."** That last clause matters — an AE does not require proof, or even suspicion, that the product caused it. It applies to:

- Events occurring during normal professional use of a product
- Events from overdose or misuse, accidental or intentional
- Events from abuse or withdrawal
- **Failure of expected pharmacological action** — i.e., the product simply not working as expected (lack of effect)

Other definitions add texture. The World Health Organization frames an adverse *reaction* as a noxious, unintended response at normal doses. A commonly used pharmacy definition (ASHP) describes a significant reaction as one that requires discontinuing the drug, changing therapy, adjusting the dose, hospital admission, prolonging a hospital stay, supportive treatment, or that complicates diagnosis, worsens prognosis, or causes temporary or permanent harm.

## Special Situation Events (SSEs)

Some occurrences don't meet the strict definition of an AE but are still documented and treated like one because they carry the same reporting importance:

- Pregnancy exposure
- Lactation exposure (child exposure through breastfeeding)
- Medication error
- Drug-drug or drug-food interactions
- Occupational exposure
- Off-label (unapproved indication) use

If a caller mentions any of these, capture it the same way you would capture an AE.

## The Four-Element Test

A report is considered a valid, reportable case when four minimum elements are present:

1. **Identifiable reporter** — someone who can be identified as the source (name, initials, or role is enough; full contact detail is a bonus, not a requirement).
2. **Identifiable patient** — some way to identify the patient exists (initials, age/DOB, sex — again, partial identifiers count).
3. **Suspect product** — the product involved is identified.
4. **Event** — a description of what happened.

All four must be present for the case to be actionable as a report — but note the reporter does not need to volunteer all four unprompted, and a report can still exist with only initials or partial details. Beyond the four minimum elements, a complete case file should also capture: patient info (age/DOB, height, weight, medical history, concomitant medications), product info (strength, dosage, frequency, indication, start/stop dates), and full event info (onset date, a chronological description, treatment given, action taken with the product, outcome, and any rechallenge information).

## Seriousness Criteria

An AE is classified as **serious** if it meets any of the following:

- **Death**
- **Life-threatening** — the patient was at substantial risk of dying at the time of the event
- **Hospitalization** — initial or prolonged
- **Disability or permanent damage** — a persistent or permanent change in body function or structure
- **Congenital anomaly / birth defect** — suspected exposure before conception or during pregnancy
- **Required intervention to prevent permanent impairment** (relevant for devices)
- **Other serious (important medical events)** — events that may jeopardize the patient or require intervention to prevent one of the above outcomes, even without hospitalization (examples: allergic bronchospasm treated in an ER, serious blood disorders, seizures)

Seriousness is a separate axis from causality — an event can be serious whether or not it's likely related to the product.

## Timelines

For marketed products, the FDA requires reporting of adverse events that are **both serious and unexpected** (not already described in labeling) within **15 calendar days** of the company's initial receipt of the information. This is why fast, accurate intake matters — the clock starts when *anyone* in the company first learns of it, including an MI specialist on a call, not when the paperwork is finished.

Anyone who works for the company — including field-based colleagues who simply overhear a physician describing a problem at a conference — is obligated to report what they heard, even if all four minimum elements weren't provided. Partial information is still reportable; it is not a reason to let it go undocumented.

## Causality Is Not Yours to Decide

Causality (how related the event is likely to be to the product — related, possible, unlikely, not related) is normally assessed later by trained safety reviewers, often using structured tools that weigh timing, alternative explanations, and dechallenge/rechallenge information (whether the event improved when the drug was stopped, and recurred if restarted). An MI specialist's job is to **capture what happened, not to conclude whether the drug caused it.** Do not tell a caller the product "did" or "didn't" cause their event.

## Check yourself

1. What is the FDA's definition of an adverse event, and why doesn't it require suspected causation?
2. List the four minimum elements required for a reportable AE.
3. Name at least four criteria that make an AE "serious."
4. What is the standard FDA timeline for reporting a serious, unexpected AE for a marketed product?
5. Give two examples of a Special Situation Event that isn't a classic AE but should still be documented.
$md$,
  10
)
on conflict (slug) do update set
  org_id = excluded.org_id,
  required = excluded.required,
  order_index = excluded.order_index,
  title = excluded.title,
  content_md = excluded.content_md,
  est_minutes = excluded.est_minutes;

insert into training_modules (org_id, required, order_index, slug, title, content_md, est_minutes)
values (
  null,
  true,
  3,
  '03-pc-fundamentals',
  'Product Complaints: Capture & Routing',
  $md$
## What a Product Complaint Is

A product complaint (PC) is a report expressing dissatisfaction with a product's design, appearance, taste, identity, labeling, packaging, durability, safety, reliability, efficacy, or performance. It is a quality signal, distinct from — but sometimes overlapping with — an adverse event.

Common examples: discoloration of a solution or tablet, crumbling tablets, unusual odor, foreign particles in a container or product, a leaking vial or syringe, a device malfunction, an empty blister pack, receiving the wrong product/strength/quantity, or a missing patient information leaflet or package insert. For devices specifically, complaints also include misuse and performance issues.

The broader category of a **product quality problem** — the trigger for reporting to the FDA — includes: suspected counterfeiting or tampering, contamination (chemical, insect, foreign material, microbial), defective components (physical damage, leaks, cracks), poor packaging or product mix-ups, questionable stability, device malfunctions, confusing or missing labeling, and **lack of effect** (the product not working as expected).

## Why Complaint Handling Is a Regulatory Requirement, Not a Courtesy

Manufacturers are required to have processes in place to identify, assess, and document complaints as part of Current Good Manufacturing Practice (cGMP) requirements — the baseline standard for ensuring pharmaceutical products are consistently produced and controlled to appropriate quality standards. Complaint handling isn't just goodwill customer service; it's a documented obligation, and it also happens to be one of the most direct feedback loops a company has for catching manufacturing or packaging problems before they become bigger ones.

## What Must Be Captured

At minimum, a complaint record needs:

- **Contact information** for the reporter
- **Description of the product issue** in the reporter's own words
- **Lot number and expiration date**
- **Product identification** (name, strength, NDC where available)

The manufacturer may need to **retrieve the physical product** for investigation — so always ask whether the reporter still has the product, the packaging, and any unused units, and whether they're willing to return them. A photo of the affected product is also frequently requested and can materially speed up an investigation, especially for physical defects (particles, cracks, discoloration) that are hard to describe in words.

## Reporting Pathways

- **Mandatory reporters**: pharmaceutical manufacturers, distributors, IND reporters, and user facility personnel.
- **Voluntary reporters**: health care professionals and consumers, who may report directly to the FDA (via the MedWatch program) or call the manufacturer, which then routes the report onward.

## What Can Come Out of a Complaint

Complaint data feeds real outcomes: labeling changes, packaging improvements, product naming changes, FDA inspections to confirm GMP compliance, and — in the most serious cases — a product recall. Recalls are classified by severity:

- **Class I** — dangerous or defective products that could predictably cause serious health problems or death.
- **Class II** — products that might cause a temporary health problem, or only a slight threat of a serious nature.
- **Class III** — products unlikely to cause an adverse health reaction but that violate FDA labeling or manufacturing rules.

## Dual Routing: When AE and PC Overlap

Some calls contain both a product defect and a patient event. Example pattern: a caller reports a defective device (bent needle, cloudy solution) and, separately or as a consequence, describes a symptom or reaction. When both are present in the same case:

- The **quality/complaint** thread goes to the Product Quality Complaints group.
- The **safety** thread goes to Pharmacovigilance (Drug Safety).
- **Both** must be documented and routed — one does not substitute for the other, and a case is not "done" just because the more obvious of the two was captured.

A classic trap scenario: a caregiver reports crushing a tablet that isn't approved for crushing (a use-related/device issue) and administering it to the patient. That single scenario can generate **both** an adverse event report and a product complaint — the crushing itself is a quality/misuse issue, and anything that happened to the patient afterward is a safety issue. Don't let the more dramatic thread eclipse the other.

## Check yourself

1. Give three examples of physical or packaging issues that qualify as product complaints.
2. What four pieces of information must, at minimum, be captured in a complaint record?
3. Why might a manufacturer ask to retrieve the physical product, and what should you ask the reporter to preserve?
4. Explain the difference between a Class I, Class II, and Class III recall.
5. Describe a scenario where a single call requires both an AE report and a PC report, and explain why neither can be skipped.
$md$,
  9
)
on conflict (slug) do update set
  org_id = excluded.org_id,
  required = excluded.required,
  order_index = excluded.order_index,
  title = excluded.title,
  content_md = excluded.content_md,
  est_minutes = excluded.est_minutes;

insert into training_modules (org_id, required, order_index, slug, title, content_md, est_minutes)
values (
  null,
  true,
  4,
  '04-documentation-practice',
  'Documentation That Survives QA',
  $md$
## Source note

This module draws on the recurring "get as much information from the requester as possible" guidance found throughout the Medical Information Manual's enquiry-handling modules, plus platform-wide documentation standards. The source manual is a clinical reference (organized by therapeutic topics such as renal impairment, hepatic impairment, pregnancy, and drug interactions) rather than a documentation-mechanics guide, so it does not contain a dedicated chapter on intake fields, verbatim capture, or QA review criteria as such. Those sections below are built from the platform's documentation standard rather than adapted line-by-line from the source; where the manual's own language is used, it is marked.

## Why Documentation Quality Is the Job

A correct verbal answer that isn't captured properly is, from a compliance standpoint, close to not having happened at all. Every case a specialist handles becomes a permanent record that may be reviewed by QA, referenced in an audit, or pulled into a safety signal analysis months or years later. The record has to stand on its own — a reviewer who wasn't on the call needs to be able to reconstruct exactly what was asked, what was said, and why the response was appropriate.

## Get the Full Picture Before You Answer

The manual's guidance, repeated across every enquiry type it covers, is consistent: *"Before attempting to look into an enquiry, it is important that we get as much information from the customer as possible. This will allow us to provide them with an answer more tailored to their specific needs, in addition to providing us with a better understanding of the question."* That principle applies to intake generally, not just to the clinical topic at hand. Concretely, that means capturing:

- **Who is asking** — requester type (health care professional and specialty, pharmacist, patient, caregiver, member of the public, internal colleague, media) — because the appropriate response and the contact fields you collect differ by requester type.
- **What they're really asking** — the specific, narrowed-down question, not just the topic area. A vague "is this drug safe in kidney problems" should be narrowed to a specific stage of impairment, a specific lab value, and whether the patient is currently taking the product — because the answer genuinely differs based on those specifics.
- **Whether the patient is currently taking the product** — this is the gateway question for identifying a possible adverse event; the manual flags it repeatedly precisely because it's easy to skip past when you're focused on answering the clinical question asked.
- **Concomitant medications** — combinations can create their own undesirable effects independent of the original question.

## Contact Fields by Requester Type

Different requester types warrant different contact capture:

- **Health care professional**: name, title/credential, specialty, practice or institution, preferred contact method (phone, email, fax, mail), and confirmation of HCP status.
- **Pharmacist**: same as HCP, plus practice setting (retail, hospital, specialty).
- **Patient / caregiver**: name (or willingness to remain anonymous), relationship to patient if a caregiver, preferred contact method, and consent to be contacted back.
- **Internal colleague** (e.g., field sales): name, role, and the business reason for the request — relevant because internal requests for off-label information carry their own routing rules.
- **Media**: name, outlet, and deadline — routed to Corporate Communications rather than answered directly.

Across every type, capture the **received date** — the date the inquiry first reached the company, in any form — because regulatory reporting clocks (for AEs and PCs) start from that date, not from when the case is written up.

## Verbatim Capture

Record what the requester actually said, in their own words, especially for anything that could be an AE or PC symptom description. Paraphrasing too early risks losing clinical detail a later reviewer needs — "felt a bit off" and "tingling and numbness around the mouth" are not interchangeable, and only one of them is useful to a safety reviewer. Capture the verbatim first, then translate it into structured fields (onset, description, severity) alongside it — don't let the structured field replace the verbatim.

## Professionalism and Spelling

The written record represents the company and may be read by people far removed from the original call — safety reviewers, auditors, or the requester's own institution if records are ever requested. That means:

- Correct spelling of product names, medical terms, and the requester's name.
- Neutral, factual language — describe what was said and done, not opinions about the caller or speculation about causality.
- No shorthand that won't be understood by someone outside the call (spell out abbreviations on first use, or avoid inventing your own).
- Complete sentences in the narrative fields, even under time pressure — a rushed fragment is exactly what QA flags.

## What "Survives QA" Looks Like

A reviewer checking a closed case is typically looking for:

- Does the received date match when the inquiry actually arrived?
- Is the requester type correctly identified, with the right contact fields for that type?
- If an AE or PC was present, are all required elements captured (see the AE and PC modules), and was dual routing applied when both were present?
- Is the verbatim present and does it support the structured summary?
- Is the response accurate, sourced from an approved document, and appropriately scoped to what was actually asked?
- Is the language professional, unambiguous, and free of causality speculation?

## Check yourself

1. Why does the manual's "get as much information as possible" principle apply beyond just the clinical question being asked?
2. What contact fields differ between an HCP requester and a patient/caregiver requester?
3. Why does the received date matter for regulatory timelines, and how does it differ from the date the case is written up?
4. Explain the difference between verbatim capture and a structured field summary, and why both are needed.
5. Name three things a QA reviewer checks when reviewing a closed case.
$md$,
  9
)
on conflict (slug) do update set
  org_id = excluded.org_id,
  required = excluded.required,
  order_index = excluded.order_index,
  title = excluded.title,
  content_md = excluded.content_md,
  est_minutes = excluded.est_minutes;

insert into training_modules (org_id, required, order_index, slug, title, content_md, est_minutes)
values (
  null,
  true,
  5,
  '05-listen-and-clarify',
  'Listening & Clarifying — Not Probing',
  $md$
## The Platform Rule

State this plainly, because it is the single most important behavioral rule in this training program:

**MI specialists do not fish for or solicit adverse events. Callers volunteer cues offhand. The skill is catching the volunteered cue and clarifying what the caller already raised. Manufacturing an AE the caller never raised is an error.**

Everything else in this module explains why that rule exists and how to apply it.

## Why Not Just Ask Everyone "Any Side Effects?"

It would be simpler to ask every caller a standard checklist of symptoms on every call. It would also be wrong. Actively soliciting symptoms that a caller never mentioned turns a routine information call into something the caller never intended, risks putting words in their mouth, and produces reports that don't reflect what actually happened. The regulatory framework is built around events that are *reported* — voluntarily surfaced by the person experiencing or observing them — not events that were extracted through a leading interview.

The correct posture is closer to a skilled listener than an interrogator: stay attentive to the entire call, not just the question that was explicitly asked, and follow up on what the caller brings up unprompted.

## What a Volunteered Cue Looks Like

Real calls are not tidy. A caregiver asking a technique question about an inhaler might mention, almost as an aside, that the patient has "been a bit shaky lately, but that's probably the coffee." A patient asking how long to keep using a cream might casually note it "stings a bit, but creams do that, right?" A physician asking a clean vaccine-timing question might mention, purely as scene-setting, that the patient "was being treated at the hospital." A patient calling about disposing of leftover lower-dose tablets might mention their doctor increased the dose because the lower dose "wasn't getting my levels where they needed to be."

None of these callers think they're reporting anything. They're offering context, not filing a report. That is exactly the moment the specialist's job matters most.

## The Clarify Gate

When a cue like this appears, the response is not to let it pass and not to interrogate — it's to **clarify the specific thing the caller already raised**:

- "You mentioned he's been a bit shaky — can you tell me more about that? When did it start, and has anything else come with it?"
- "You said it stings a bit — how long has that been going on, and has it changed or spread?"
- "You mentioned they were being treated at the hospital — do you know what that was for, and when that was relative to starting the medication?"
- "You said the lower dose wasn't getting things where they needed to be — how long was the patient on that dose, and were there any symptoms during that time?"

Notice the pattern: each clarifying question refers back to something the caller already said. None of them introduce a new symptom or condition the caller didn't bring up. That distinction — clarifying what's already on the table versus adding something that wasn't — is the entire skill.

## The Two Failure Modes

**Letting the cue pass.** If the specialist answers only the technique or dosing question asked and never circles back to the offhand remark, a real adverse event (or lack-of-effect signal, or serious AE cue) goes uncaptured. The caller leaves satisfied, and the case is closed as routine — but a reportable event was sitting in the transcript the whole time.

**Manufacturing an event.** The opposite failure is asking leading questions that were never grounded in anything the caller said — "Have you noticed any dizziness? Any nausea? Any rash?" — as a fishing expedition. Even if this occasionally surfaces something real, it also generates noise: symptoms the caller only agreed to because they were asked, not because they were experiencing them. This corrupts the safety data instead of protecting it, and it isn't how MI is supposed to operate.

## Lack of Effect Is a Cue Too

Not every volunteered cue is a classic symptom. A caller mentioning that a dose was increased because the starting dose "wasn't working" or "wasn't getting my numbers where they needed to be" is describing a possible lack of effect (LOE) — a legitimate category for Pharmacovigilance to assess, even when the product's own label permits titration. Don't rationalize the cue away as "normal dose-finding" and skip it; flag it and let Pharmacovigilance make the causality judgment. Capturing a cue is not the same as concluding the drug failed.

## What This Looks Like in Practice

1. Answer the question the caller actually asked — don't get distracted mid-call chasing a tangent.
2. Stay alert for anything said in passing that describes a symptom, a hospitalization, a dose change with a stated reason, or anything else that sounds like an event.
3. When you hear it, clarify it directly, referencing their own words back to them.
4. Capture what they tell you in the appropriate safety fields, using their language (verbatim) alongside the structured summary.
5. Never introduce a symptom, condition, or outcome the caller didn't raise first.

## Check yourself

1. State the platform rule on soliciting AEs in your own words.
2. Give an example of a volunteered cue that a caller would not think of as "reporting" anything.
3. Write a clarifying question for a volunteered cue that refers back to the caller's own words rather than introducing a new symptom.
4. What are the two failure modes described in this module, and why is manufacturing an AE just as much an error as missing one?
5. Why does a "lack of effect" cue still need to be flagged even when the label permits dose titration?
$md$,
  8
)
on conflict (slug) do update set
  org_id = excluded.org_id,
  required = excluded.required,
  order_index = excluded.order_index,
  title = excluded.title,
  content_md = excluded.content_md,
  est_minutes = excluded.est_minutes;

insert into training_modules (org_id, required, order_index, slug, title, content_md, est_minutes)
values (
  null,
  true,
  6,
  '06-system-walkthrough',
  'Case System Walkthrough',
  $md$
## What This Module Covers

This is a stepwise walkthrough of this platform's Documentation Simulator — the tool you will use for every practice case and, later, for certification. Read it once before your first case, then use it as a reference while you work.

## Step 1: The Queue

You start at the case queue: a list of available cases (practice or, later, certification variants). Each entry shows enough to orient you — case code, a short scenario label, and status. Selecting a case opens it.

## Step 2: Opening a Case

Opening a case loads the live call pane and the documentation tabs side by side. The call is not yet "in progress" until you start it — you control pacing.

## Step 3: The Live Call Pane

This is where the interaction happens, whether it's a simulated phone call or a written channel (email/portal). Key features:

- **Open-book / closed-book toggle.** Open-book lets you reference SRDs and product labeling while the call is live, the way you would in a real job. Closed-book removes that scaffold — used for certification variants that test recall and judgment without a lookup crutch. Know which mode you're in before you start; it changes how you should pace the call.
- The pane shows the conversation as it unfolds. Your job during the call is the same as on a real one: listen for what's actually being asked, and stay alert for anything volunteered in passing (see the Listen & Clarify module) rather than treating the call pane as a script to get through.

## Step 4: The Intake Tab

This is where you document who is calling and about what, before you get deep into the substance:

- **Requester type** — HCP, pharmacist, patient, caregiver, member of the public, internal colleague, media, etc. This choice changes which contact fields appear next, so get it right before moving on — misclassifying the requester here is a common, catchable error.
- **Inquiry Category** — a dropdown with five options: **Indication, Efficacy, Safety, Pharmacokinetics, Drug-Interactions**, or **Other**. Pick the category that matches the actual question; if safety content emerges mid-call, you can and should revisit this.
- **Adaptive contact fields** — the specific fields shown depend on the requester type you selected (e.g., specialty and institution for an HCP; relationship-to-patient for a caregiver).
- **Received date** — the date the inquiry first came in. Get this right; it anchors regulatory reporting clocks downstream, not the date you happen to be finishing documentation.

## Step 5: The Inquiry Tab

This is where you capture the substance of the question itself and, eventually, your response rationale — the specific narrowed question (not just the topic), any relevant patient/clinical context the requester provided, and notes on what SRD or labeling section is relevant.

## Step 6: The Safety Tab

This tab is where AE and PC capture happens, and it behaves adaptively:

- If you indicate an adverse event is present ("AE yes"), a **four-element block auto-expands** — reporter, patient, product, and event — prompting you to capture each one (see the AE Fundamentals module for what belongs in each).
- **PC fields** appear for product-quality issues: description of the product problem, lot number, expiration date, and whether the reporter can return the product for investigation.
- **Dual routing** activates automatically when both an AE and a PC are present in the same case — the system expects both threads to be documented, not just the more obvious one. This mirrors the real-world rule from the PC Fundamentals module: one does not substitute for the other.

Do not populate this tab speculatively. Only mark AE/PC fields based on what the caller actually described — see the Listen & Clarify module's rule against manufacturing events that weren't raised.

## Step 7: The Response Tab

Here you search the SRD library to find the standard response letter that matches the inquiry. The search surface intentionally includes **decoys** — SRDs that look topically adjacent but don't actually answer the specific question asked (wrong product, wrong sub-topic, wrong population). Selecting the correct SRD, and only the correct one, is part of what's being evaluated — this tests whether you narrowed the actual question in Step 5 precisely enough to match it against the right document.

## Step 8: The Closure Tab

Before you can submit, you'll work through:

- **A closure checklist** — confirms the required fields across Intake, Inquiry, and Safety are complete, matching the "what QA checks" list from the Documentation Practice module.
- **A QC self-check** — a prompt to review your own case for the same things a reviewer would look for: correct requester type and contact fields, received date accuracy, verbatim capture where relevant, correct SRD selection, professional and unambiguous language, and no unsupported causality statements.
- **Submit for Review** — finalizes the case. Once submitted, the case moves into the review/evaluation flow; you generally cannot silently edit a submitted case, so complete your self-check before you submit.

## Practical Tips

- Work the tabs roughly in order (Intake → Inquiry → Safety → Response → Closure), but go back and correct earlier tabs the moment new information changes them — for example, if a safety cue emerges mid-call after you've already picked "Efficacy" as the category.
- Treat the open/closed-book toggle as part of the scenario, not a setting to ignore — it tells you what kind of performance is being tested.
- The decoys in the Response tab are a feature, not noise — take the extra moment to confirm the SRD you're about to select actually answers the narrowed question, not just the general topic.

## Check yourself

1. List the five fixed options in the Inquiry Category dropdown, plus the sixth catch-all.
2. What changes on the Intake tab depending on which requester type you select?
3. What happens automatically on the Safety tab when you mark "AE yes," and what happens when both an AE and a PC are present?
4. Why do decoys exist in the Response tab's SRD search, and what are they testing?
5. What two things does the Closure tab ask you to do before you can Submit for Review?
$md$,
  10
)
on conflict (slug) do update set
  org_id = excluded.org_id,
  required = excluded.required,
  order_index = excluded.order_index,
  title = excluded.title,
  content_md = excluded.content_md,
  est_minutes = excluded.est_minutes;
