# Evaluator calibration report (S4)

_Generated 2026-07-12T13:18:24.525Z · model claude-sonnet-5 · eval-prompt-v1 · rubric v1.0_

## Definition-of-done gate

| Gate | Result |
|---|---|
| Gold examples → `pass` | 12/12 ✅ |
| Non-empty `expected_critical_fail` → trips exact Critical(s) | 18/18 ✅ |
| Errors | 0 |
| **Overall DoD** | **✅ MET** |

Deduction fixtures (`expected_critical_fail: []`) are reported below but not gated — they are documented point deductions, not mandated case failures (HANDOFF §7).

## Disagreements & errors (0)

None. Every gold passed and every mandated Critical tripped.

## All results

| Label | Kind | Expected Critical | Overall | Verdict |
|---|---|---|---|---|
| SC-01-gold | gold | (pass) | pass | match |
| SC-01-failure-1-missedCue | failure | S2.1 | fail | match |
| SC-01-failure-2-overFlagAe | failure | — | fail | info |
| SC-01-failure-3-wrongSrl | failure | — | fail | info |
| SC-02-gold | gold | (pass) | pass | match |
| SC-02-failure-1-wrongContactSet | failure | — | pass | info |
| SC-02-failure-2-medicalAdvice | failure | S4.2 | fail | match |
| SC-02-failure-3-wrongSrl | failure | — | fail | info |
| SC-02-failure-4-specialSituationMissed+pcMissedEntirely | failure | S2.1, S3.1, S5.2 | fail | match |
| SC-03-gold | gold | (pass) | pass | match |
| SC-03-failure-1-missedCue | failure | S2.1 | fail | match |
| SC-03-failure-2-aeNotDocumented | failure | — | fail | info |
| SC-03-failure-3-aeNotDocumented | failure | — | fail | info |
| SC-04-gold | gold | (pass) | pass | match |
| SC-04-failure-1-missedCue | failure | S2.1 | fail | match |
| SC-04-failure-2-singleRouteOnly | failure | S2.3, S3.3 | fail | match |
| SC-04-failure-3-missingPcIdentifiers | failure | — | fail | info |
| SC-04-failure-4-noRetrieval | failure | — | pass | info |
| SC-05-gold | gold | (pass) | pass | match |
| SC-05-failure-1-admitCausation | failure | S4.2 | fail | match |
| SC-05-failure-2-omitLegalMedia | failure | — | fail | info |
| SC-05-failure-3-admitCausation | failure | — | fail | info |
| SC-05-failure-4-omitLegalMedia | failure | — | fail | info |
| SC-06-gold | gold | (pass) | pass | match |
| SC-06-failure-1-offLabelVolunteered | failure | S5.1 | fail | match |
| SC-06-failure-2-wrongSrl | failure | — | fail | info |
| SC-07-gold | gold | (pass) | pass | match |
| SC-07-failure-1-spokespersonStatement | failure | S4.2 | fail | match |
| SC-07-failure-2-spokespersonStatement | failure | — | fail | info |
| SC-07-failure-3-omitLegalMedia | failure | — | fail | info |
| SC-08-gold | gold | (pass) | pass | match |
| SC-08-failure-1-missedCue+pcMissedEntirely | failure | S2.1, S3.1 | fail | match |
| SC-08-failure-2-medicalAdvice | failure | S4.2 | fail | match |
| SC-08-failure-3-aeNotDocumented | failure | — | fail | info |
| SC-09-gold | gold | (pass) | pass | match |
| SC-09-failure-1-wrongSrl | failure | — | fail | info |
| SC-09-failure-2-wrongContactSet | failure | — | fail | info |
| SC-09-failure-3-offLabelDosingVolunteered | failure | S5.1 | fail | match |
| SC-10-gold | gold | (pass) | pass | match |
| SC-10-failure-1-medicalAdvice | failure | S4.2 | fail | match |
| SC-10-failure-2-specialSituationMissed | failure | S2.1, S5.2 | fail | match |
| SC-10-failure-3-overFlagAe | failure | — | fail | info |
| SC-11-gold | gold | (pass) | pass | match |
| SC-11-failure-1-specialSituationMissed+pcMissedEntirely | failure | S2.1, S3.1, S5.2 | fail | match |
| SC-11-failure-2-medicalAdvice | failure | S4.2 | fail | match |
| SC-11-failure-3-wrongSrl | failure | — | fail | info |
| SC-11-failure-4-overFlagAe | failure | — | fail | info |
| SC-12-gold | gold | (pass) | pass | match |
| SC-12-failure-1-missedCue | failure | S2.1 | fail | match |
| SC-12-failure-2-noPvRouteNotFlaggedSerious | failure | S2.3 | fail | match |
| SC-12-failure-3-wrongSrl | failure | — | fail | info |

## Deduction fixtures (informational)

- `SC-01-failure-2-overFlagAe`: deduction fixture — overall fail; failing: S1.3, S2.1
- `SC-01-failure-3-wrongSrl`: deduction fixture — overall fail; failing: S4.1, S4.6, S4.7
- `SC-02-failure-1-wrongContactSet`: deduction fixture — overall pass; failing: none
- `SC-02-failure-3-wrongSrl`: deduction fixture — overall fail; failing: S4.6, S4.7
- `SC-03-failure-2-aeNotDocumented`: deduction fixture — overall fail; failing: S2.1, S2.3, S2.4, S2.7, S4.4, S5.4
- `SC-03-failure-3-aeNotDocumented`: deduction fixture — overall fail; failing: S2.1, S2.3, S2.4, S2.7, S4.4, S5.4
- `SC-04-failure-3-missingPcIdentifiers`: deduction fixture — overall fail; failing: S3.6
- `SC-04-failure-4-noRetrieval`: deduction fixture — overall pass; failing: none
- `SC-05-failure-2-omitLegalMedia`: deduction fixture — overall fail; failing: S2.3, S5.4
- `SC-05-failure-3-admitCausation`: deduction fixture — overall fail; failing: S1.2, S4.2, S5.3
- `SC-05-failure-4-omitLegalMedia`: deduction fixture — overall fail; failing: S2.3, S5.4
- `SC-06-failure-2-wrongSrl`: deduction fixture — overall fail; failing: S4.7
- `SC-07-failure-2-spokespersonStatement`: deduction fixture — overall fail; failing: S1.1, S1.3, S4.2, S4.7, S5.3, S5.4
- `SC-07-failure-3-omitLegalMedia`: deduction fixture — overall fail; failing: S5.4
- `SC-08-failure-3-aeNotDocumented`: deduction fixture — overall fail; failing: S2.1, S2.3, S2.4, S2.7
- `SC-09-failure-1-wrongSrl`: deduction fixture — overall fail; failing: S4.6, S4.7, S4.10
- `SC-09-failure-2-wrongContactSet`: deduction fixture — overall fail; failing: S4.3, S4.10
- `SC-10-failure-3-overFlagAe`: deduction fixture — overall fail; failing: S1.3, S2.1, S2.4, S4.5, S4.7
- `SC-11-failure-3-wrongSrl`: deduction fixture — overall fail; failing: S4.2
- `SC-11-failure-4-overFlagAe`: deduction fixture — overall fail; failing: S1.3, S2.1, S4.5, S4.7
- `SC-12-failure-3-wrongSrl`: deduction fixture — overall fail; failing: S4.6, S4.7

---

# Blind-scoring appendix (for Nathan)

Score each GOLD case yourself from the transcript + documentation **before** reading the evaluator's verdicts in Part B. The gate: **zero Critical-criterion disagreements, ≤1 Major disagreement per case.** 12 gold outputs below; the JSON report holds all 51 outputs (incl. failure fixtures) with full per-criterion evidence.

## Part A — cases to score (verdicts hidden)

### A1. SC-01 (gold · voice)

**Transcript**

1. **trainee**: Thank you for calling Medical Information, this is Alex Reed speaking. How can I help you today?
2. **persona**: Identifies herself as a physician, states the patient is stable on Cardizan.
3. **trainee**: Happy to help with that. Could I get your name, and are you calling as a healthcare provider, caregiver, or on your own behalf?
4. **persona**: Sure — this is Dr. Amara Chen, family physician (HCP). My callback number is (555) 0182-4471.
5. **trainee**: Since the patient developed the sinus infection while on Cardizan, I'm also going to capture that as an adverse event report and route it to our safety team — that's standard even when it appears unrelated to therapy. May I list you as the reporting physician?
6. **persona**: That's fine — you can list me as the reporting physician.
7. **trainee**: Based on SRL-CDZ-INR, here's what our approved information says about your question on Cardizan: several antibiotic classes (e.g., macrolides, fluoroquinolones) can potentiate the INR effect per the prescribing information.
8. **persona**: That's helpful, thank you.
9. **trainee**: Is there anything else I can help you with today?
10. **persona**: No, that covers it — thank you for your help.
11. **trainee**: Thank you for calling Medical Information. Have a good day.

**Submitted documentation**

```json
{
  "intake": {
    "requester_type": "hcp",
    "solicited": "unsolicited",
    "contact_channel": "phone",
    "received_date": "2026-07-06",
    "product": "Cardizan",
    "inquiry_category": "Drug-Interactions",
    "contact": {
      "name": "Dr. Amara Chen",
      "background": "family physician (HCP)",
      "phone": "(555) 0182-4471",
      "street_address": "88 Winslow Medical Plaza, Ste 210",
      "city": "Asheville",
      "state": "NC",
      "zip": "28801"
    }
  },
  "inquiry": {
    "summary": "An HCP calls asking which common medications interact with Cardizan and raise INR, so she can counsel\na stable patient starting an antibiotic. Straightforward on-label information request. No AE, no PC.",
    "verbatim_question": "Identifies herself as a physician, states the patient is stable on Cardizan.",
    "probing_questions": []
  },
  "safety": {
    "ae_present": "yes",
    "ae_description": "Intercurrent adverse event: the patient on Cardizan has developed a sinus infection (an antibiotic is being prescribed for it); patient otherwise stable and asymptomatic. Captured for PV to assess regardless of suspected causality — an intercurrent illness reported on therapy is a reportable AE.",
    "onset_date": "",
    "ongoing": "no",
    "seriousness": [],
    "patient_initials": "",
    "patient_dob": "",
    "patient_gender": "",
    "concomitant_meds": "",
    "hcp_followup_consent": "yes",
    "pc_present": "no",
    "pc_lot_number": "",
    "pc_expiration_date": "",
    "pc_ndc": "",
    "pc_sample_available": "",
    "special_situations": []
  },
  "response": {
    "selected_srl_id": "SRL-CDZ-INR",
    "customization_notes": "Answered per SC-01 gold documentation example.",
    "delivery_method": "phone",
    "verbal_answer_given": "Provided the standard response letter SRL-CDZ-INR addressing the caller's question about Cardizan."
  },
  "closure": {
    "follow_up_needed": "no",
    "follow_up_scheduled_date": "",
    "outstanding_info": "",
    "routing_dual": {
      "route_to_pv": false,
      "route_to_quality": false
    },
    "routing_single": [
      "PV"
    ],
    "checklist": {
      "inquiry_answered": true,
      "safety_captured_routed": true,
      "contact_info_complete": true,
      "no_medical_advice_given": true,
      "category_confirmed": true
    },
    "qc_self_check": true
  }
}
```

### A2. SC-02 (gold · voice)

**Transcript**

1. **trainee**: Thank you for calling Medical Information, this is Alex Reed speaking. How can I help you today?
2. **persona**: Why isn
3. **trainee**: Happy to help with that. Could I get your name, and are you calling as a healthcare provider, caregiver, or on your own behalf?
4. **persona**: Sure — this is Jordan Ellis, patient. My callback number is (555) 0143-9920.
5. **trainee**: You mentioned Gastroquell isn't working right away for your heartburn — can I ask how long you've been taking it, and whether you've had any relief at all so far?
6. **persona**: About four days now, and honestly not much relief yet.
7. **trainee**: Thank you — I'm going to capture that lack of effect for our safety team to assess, and log a product complaint so our quality team can take a look as well. Do you have the package handy — could you read me the lot number and expiration date, and would you be able to keep it in case our quality team requests it?
8. **persona**: Sure — lot LOT-CALIB-0001, expires June 2027. I'll hang on to it.
9. **trainee**: And would it be all right if I or our safety team follow up with your doctor or pharmacist about this if we need more detail?
10. **persona**: Sure, that's fine.
11. **trainee**: Based on SRL-GAS-ONSET, here's what our approved information says about your question on Gastroquell: full symptom relief typically takes several days of consistent dosing; I'd encourage keeping to the regimen and checking with your pharmacist before changing the dose.
12. **persona**: That's helpful, thank you.
13. **trainee**: Is there anything else I can help you with today?
14. **persona**: No, that covers it — thank you for your help.
15. **trainee**: Thank you for calling Medical Information. Have a good day.

**Submitted documentation**

```json
{
  "intake": {
    "requester_type": "patient",
    "solicited": "unsolicited",
    "contact_channel": "phone",
    "received_date": "2026-07-06",
    "product": "Gastroquell",
    "inquiry_category": "Efficacy",
    "contact": {
      "name": "Jordan Ellis",
      "background": "patient",
      "phone": "(555) 0143-9920",
      "street_address": "",
      "city": "Dayton",
      "state": "OH",
      "zip": ""
    }
  },
  "inquiry": {
    "summary": "A caller asks why Gastroquell \"isn't working right away\" for their heartburn. The caller speaks in\nclinical-adjacent language and could be mistaken for an HCP, but is actually a patient asking about\ntheir own therapy. The trainee must correctly establish requester type before answering, because the\nappropriate response (and documentation contact fields) differ.",
    "verbatim_question": "Why isn",
    "probing_questions": []
  },
  "safety": {
    "ae_present": "yes",
    "ae_description": "Potential lack of effect: patient reports Gastroquell isn't working right away for their heartburn — no symptom relief yet on the current regimen, and the lack of relief is ongoing at the time of the call. Captured for PV to assess; flagging is not concluding the drug failed.",
    "onset_date": "",
    "ongoing": "yes",
    "seriousness": [],
    "patient_initials": "JE",
    "patient_dob": "",
    "patient_gender": "",
    "concomitant_meds": "",
    "hcp_followup_consent": "yes",
    "pc_present": "yes",
    "pc_lot_number": "LOT-CALIB-0001",
    "pc_expiration_date": "2027-06-30",
    "pc_ndc": "0000-0000-01",
    "pc_sample_available": "yes",
    "special_situations": [
      "lack_of_effect"
    ]
  },
  "response": {
    "selected_srl_id": "SRL-GAS-ONSET",
    "customization_notes": "Answered per SC-02 gold documentation example.",
    "delivery_method": "phone",
    "verbal_answer_given": "Provided the standard response letter SRL-GAS-ONSET addressing the caller's question about Gastroquell. Referred the caller to their prescribing HCP for any treatment or dosing decisions; no medical advice was given."
  },
  "closure": {
    "follow_up_needed": "no",
    "follow_up_scheduled_date": "",
    "outstanding_info": "",
    "routing_dual": {
      "route_to_pv": true,
      "route_to_quality": true
    },
    "routing_single": [],
    "checklist": {
      "inquiry_answered": true,
      "safety_captured_routed": true,
      "contact_info_complete": true,
      "no_medical_advice_given": true,
      "category_confirmed": true
    },
    "qc_self_check": true
  }
}
```

### A3. SC-03 (gold · voice)

**Transcript**

1. **trainee**: Thank you for calling Medical Information, this is Alex Reed speaking. How can I help you today?
2. **persona**: My husband started Pulmonara last month — is he supposed to rinse his mouth after?
3. **trainee**: Happy to help with that. Could I get your name, and are you calling as a healthcare provider, caregiver, or on your own behalf?
4. **persona**: Sure — this is Pat Morgan, caregiver (spouse of patient Dale Morgan). My callback number is (555) 0134-8827.
5. **persona**: Oh, by the way — s been a bit shaky lately, but that
6. **trainee**: Before we go further — you mentioned "s been a bit shaky lately, but that" a moment ago. Can you tell me more about that: when it started, and whether it's still happening?
7. **persona**: Tremor and palpitations, onset ~1 week after Pulmonara initiation, ongoing.
8. **trainee**: I'd like to make sure this gets captured for our safety team, and with your permission I may need to reach out to the prescriber for more detail. Is that all right?
9. **persona**: Yes, that's fine — go ahead.
10. **trainee**: Based on SRL-PUL-CANDID, here's what our approved information says about your question on Pulmonara: rinsing the mouth after each Pulmonara inhalation is recommended per the administration guidance.
11. **persona**: That's helpful, thank you.
12. **trainee**: Is there anything else I can help you with today?
13. **persona**: No, that covers it — thank you for your help.
14. **trainee**: Thank you for calling Medical Information. Have a good day.

**Submitted documentation**

```json
{
  "intake": {
    "requester_type": "caregiver",
    "solicited": "unsolicited",
    "contact_channel": "phone",
    "received_date": "2026-07-06",
    "product": "Pulmonara",
    "inquiry_category": "Other",
    "contact": {
      "name": "Pat Morgan",
      "background": "caregiver (spouse of patient Dale Morgan)",
      "phone": "(555) 0134-8827",
      "street_address": "412 Larkspur Lane, Apt 3",
      "city": "Cedar Falls",
      "state": "IA",
      "zip": "50613"
    }
  },
  "inquiry": {
    "summary": "A caregiver calls with what sounds like a routine question about their spouse's inhaler technique.\nThe caller **volunteers** an offhand mention of a symptom (the patient has been \"a bit shaky\") that they\ndo **not** frame as a problem. The core MI skill is **listening and clarifying, not probing**: the\nspecialist must catch the volunteered cue and clarify its specifics — never interrogate for symptoms the\ncaller never raised. If the cue is let pass, the AE is missed, exactly like a real call.",
    "verbatim_question": "My husband started Pulmonara last month — is he supposed to rinse his mouth after?",
    "probing_questions": []
  },
  "safety": {
    "ae_present": "yes",
    "ae_description": "Tremor and palpitations, onset ~1 week after Pulmonara initiation, ongoing.",
    "onset_date": "",
    "ongoing": "yes",
    "seriousness": [],
    "patient_initials": "",
    "patient_dob": "",
    "patient_gender": "",
    "concomitant_meds": "",
    "hcp_followup_consent": "yes",
    "pc_present": "no",
    "pc_lot_number": "",
    "pc_expiration_date": "",
    "pc_ndc": "",
    "pc_sample_available": "",
    "special_situations": []
  },
  "response": {
    "selected_srl_id": "SRL-PUL-CANDID",
    "customization_notes": "Answered per SC-03 gold documentation example.",
    "delivery_method": "phone",
    "verbal_answer_given": "Provided the standard response letter SRL-PUL-CANDID addressing the caller's question about Pulmonara. Referred the caller to their prescribing HCP for any treatment or dosing decisions; no medical advice was given."
  },
  "closure": {
    "follow_up_needed": "no",
    "follow_up_scheduled_date": "",
    "outstanding_info": "",
    "routing_dual": {
      "route_to_pv": false,
      "route_to_quality": false
    },
    "routing_single": [
      "PV"
    ],
    "checklist": {
      "inquiry_answered": true,
      "safety_captured_routed": true,
      "contact_info_complete": true,
      "no_medical_advice_given": true,
      "category_confirmed": true
    },
    "qc_self_check": true
  }
}
```

### A4. SC-04 (gold · voice)

**Transcript**

1. **trainee**: Thank you for calling Medical Information, this is Alex Reed speaking. How can I help you today?
2. **persona**: I want a replacement.
3. **trainee**: Happy to help with that. Could I get your name, and are you calling as a healthcare provider, caregiver, or on your own behalf?
4. **persona**: Sure — this is Riley Nguyen, patient. My callback number is (555) 0177-3050.
5. **persona**: Oh, by the way — Persona volunteers up front the product complaint: cloudy solution and bent needle on the prefilled syringe.
6. **trainee**: Before we go further — you mentioned "Persona volunteers up front the product complaint: cloudy solution and bent needle on the prefilled syringe." a moment ago. Can you tell me more about that: when it started, and whether it's still happening?
7. **persona**: Perioral tingling and numbness (possible hypocalcemia), onset hours after Osteveda injection.
8. **trainee**: I'd like to make sure this gets captured for our safety team, and with your permission I may need to reach out to the prescriber for more detail. Is that all right?
9. **persona**: Yes, that's fine — go ahead.
10. **trainee**: Based on SRL-OST-HYPOCAL, here's what our approved information says about your question on Osteveda: the tingling and numbness you're describing can be a sign of low calcium and should be evaluated urgently by a physician.
11. **persona**: That's helpful, thank you.
12. **trainee**: Is there anything else I can help you with today?
13. **persona**: No, that covers it — thank you for your help.
14. **trainee**: Thank you for calling Medical Information. Have a good day.

**Submitted documentation**

```json
{
  "intake": {
    "requester_type": "patient",
    "solicited": "unsolicited",
    "contact_channel": "phone",
    "received_date": "2026-07-06",
    "product": "Osteveda",
    "inquiry_category": "Other",
    "contact": {
      "name": "Riley Nguyen",
      "background": "patient",
      "phone": "(555) 0177-3050",
      "street_address": "",
      "city": "Tacoma",
      "state": "WA",
      "zip": ""
    }
  },
  "inquiry": {
    "summary": "A patient calls to complain that an Osteveda prefilled syringe \"looked cloudy and the needle was bent\" —\na product complaint. During the call it emerges that they injected it anyway and then felt tingling/numbness\naround the mouth (a hypocalcemia symptom) — an adverse event. Both a PC and an AE are present in one case,\nrequiring dual routing (Quality + PV). Classic non-linear call.",
    "verbatim_question": "I want a replacement.",
    "probing_questions": []
  },
  "safety": {
    "ae_present": "yes",
    "ae_description": "Perioral tingling and numbness (possible hypocalcemia), onset hours after Osteveda injection.",
    "onset_date": "",
    "ongoing": "no",
    "seriousness": [],
    "patient_initials": "RN",
    "patient_dob": "",
    "patient_gender": "",
    "concomitant_meds": "",
    "hcp_followup_consent": "yes",
    "pc_present": "yes",
    "pc_lot_number": "LOT-CALIB-0001",
    "pc_expiration_date": "2027-06-30",
    "pc_ndc": "0000-0000-01",
    "pc_sample_available": "yes",
    "special_situations": []
  },
  "response": {
    "selected_srl_id": "SRL-OST-HYPOCAL",
    "customization_notes": "Answered per SC-04 gold documentation example.",
    "delivery_method": "phone",
    "verbal_answer_given": "Provided the standard response letter SRL-OST-HYPOCAL addressing the caller's question about Osteveda. Referred the caller to their prescribing HCP for any treatment or dosing decisions; no medical advice was given."
  },
  "closure": {
    "follow_up_needed": "no",
    "follow_up_scheduled_date": "",
    "outstanding_info": "",
    "routing_dual": {
      "route_to_pv": true,
      "route_to_quality": true
    },
    "routing_single": [],
    "checklist": {
      "inquiry_answered": true,
      "safety_captured_routed": true,
      "contact_info_complete": true,
      "no_medical_advice_given": true,
      "category_confirmed": true
    },
    "qc_self_check": true
  }
}
```

### A5. SC-05 (gold · voice)

**Transcript**

1. **trainee**: Thank you for calling Medical Information, this is Alex Reed speaking. How can I help you today?
2. **persona**: Your drug put my mother in the hospital with a horrible rash. I
3. **persona**: I'm calling a lawyer and the news if I don't get answers today.
4. **trainee**: Happy to help with that. Could I get your name, and are you calling as a healthcare provider, caregiver, or on your own behalf?
5. **persona**: Sure — this is Sam Rivera, caregiver (adult child of pt. Lucia Rivera). My callback number is (555) 0158-6642.
6. **persona**: Someone needs to just admit this drug did this to her. Can you at least say that?
7. **trainee**: I hear how frightening this has been, and I want to make sure your mother gets the right care. I'm not able to confirm what caused the rash — that's something her treating physician needs to evaluate — but I am documenting everything you've told me and routing it to our safety team right away.
8. **persona**: Fine. Just make sure someone actually does something about it.
9. **trainee**: Because you've mentioned a lawyer and the news, I'm also flagging this to our Legal and Media desks so the right teams are looped in from the start.
10. **persona**: Good. They should be.
11. **trainee**: Thank you. With your permission, our safety team may also contact your mother's treating physician for the medical details — is that all right?
12. **persona**: Yes, fine — whatever gets this looked at.
13. **trainee**: Based on SRL-NEU-RASH, here's what our approved information says about your question on Neurovance: the approved prescribing information addresses this directly.
14. **persona**: That's helpful, thank you.
15. **trainee**: For any decisions about your treatment or dosing, please check with your prescribing physician — I'm not able to advise on that directly.
16. **persona**: Understood, I'll follow up with them.
17. **trainee**: Is there anything else I can help you with today?
18. **persona**: No, that covers it — thank you for your help.

**Submitted documentation**

```json
{
  "intake": {
    "requester_type": "caregiver",
    "solicited": "unsolicited",
    "contact_channel": "phone",
    "received_date": "2026-07-06",
    "product": "Neurovance",
    "inquiry_category": "Safety",
    "contact": {
      "name": "Sam Rivera",
      "background": "caregiver (adult child of pt. Lucia Rivera)",
      "phone": "(555) 0158-6642",
      "street_address": "27 Halewood Ct",
      "city": "Providence",
      "state": "RI",
      "zip": "02906"
    }
  },
  "inquiry": {
    "summary": "An agitated caller reports their family member developed a severe rash on Neurovance, is now hospitalized,\nand threatens to \"get a lawyer and call the news.\" The trainee must (a) recognize and capture a serious\nAE (possible SJS), (b) de-escalate while staying compliant, (c) recognize the legal/media special\nsituations and route correctly — without admitting fault, speculating on causation, or giving medical\nadvice. Scored heavily on compliance + regulatory risk.",
    "verbatim_question": "Your drug put my mother in the hospital with a horrible rash. I",
    "probing_questions": []
  },
  "safety": {
    "ae_present": "yes",
    "ae_description": "Blistering rash with mouth sores, hospitalized, possible SJS; onset ~2 weeks after starting Neurovance. Serious AE.",
    "onset_date": "",
    "ongoing": "no",
    "seriousness": [
      "hospitalization"
    ],
    "patient_initials": "",
    "patient_dob": "",
    "patient_gender": "",
    "concomitant_meds": "",
    "hcp_followup_consent": "yes",
    "pc_present": "no",
    "pc_lot_number": "",
    "pc_expiration_date": "",
    "pc_ndc": "",
    "pc_sample_available": "",
    "special_situations": []
  },
  "response": {
    "selected_srl_id": "SRL-NEU-RASH",
    "customization_notes": "Answered per SC-05 gold documentation example.",
    "delivery_method": "phone",
    "verbal_answer_given": "Provided the standard response letter SRL-NEU-RASH addressing the caller's question about Neurovance. Referred the caller to their prescribing HCP for any treatment or dosing decisions; no medical advice was given."
  },
  "closure": {
    "follow_up_needed": "no",
    "follow_up_scheduled_date": "",
    "outstanding_info": "",
    "routing_dual": {
      "route_to_pv": false,
      "route_to_quality": false
    },
    "routing_single": [
      "PV",
      "Legal",
      "Media"
    ],
    "checklist": {
      "inquiry_answered": true,
      "safety_captured_routed": true,
      "contact_info_complete": true,
      "no_medical_advice_given": true,
      "category_confirmed": true
    },
    "qc_self_check": true
  }
}
```

### A6. SC-06 (gold · text)

**Transcript**

1. **trainee**: Thank you for calling Medical Information, this is Alex Reed speaking. How can I help you today?
2. **persona**: Can you send me efficacy data for Immunexa in psoriasis? A derm I cover is interested.
3. **trainee**: Happy to help with that. Could I get your name, and are you calling as a healthcare provider, caregiver, or on your own behalf?
4. **persona**: Sure — this is Chris Delgado, internal sales representative. My callback number is (555) 0190-2213.
5. **persona**: Can you at least tell me if it works for psoriasis? Even off the record, just for my own knowledge?
6. **trainee**: I understand you're trying to help your customer, but I'm not able to share efficacy data for an unapproved use — Immunexa is only approved for RA. If the dermatologist has a genuine clinical question, it needs to come through our approved unsolicited-request process — I'll document this request and the redirect.
7. **persona**: Okay, understood — go ahead and route it.
8. **trainee**: As I mentioned, I'm not able to provide off-label efficacy data — I've documented the request and the redirect through our approved unsolicited-request process.
9. **persona**: That's helpful, thank you.
10. **trainee**: Is there anything else I can help you with today?
11. **persona**: No, that covers it — thank you for your help.
12. **trainee**: Thank you for calling Medical Information. Have a good day.

**Submitted documentation**

```json
{
  "intake": {
    "requester_type": "internal_sales",
    "solicited": "unsolicited",
    "contact_channel": "phone",
    "received_date": "2026-07-06",
    "product": "Immunexa",
    "inquiry_category": "Efficacy",
    "contact": {
      "name": "Chris Delgado",
      "background": "internal sales representative",
      "phone": "(555) 0190-2213",
      "street_address": "",
      "city": "Field/Region 4 — internal ext. 4471",
      "state": "",
      "zip": ""
    }
  },
  "inquiry": {
    "summary": "An internal sales representative emails MI asking for \"data I can share with a dermatologist about using\nImmunexa for psoriasis\" — an unapproved (off-label) indication, and a request to *promote* it. The trainee\nmust recognize this as an internal employee seeking off-label information for promotional use, decline to\nprovide it for that purpose, and route to Medical Affairs — the highest-frequency real-world compliance\ntrap. No AE/PC.",
    "verbatim_question": "Can you send me efficacy data for Immunexa in psoriasis? A derm I cover is interested.",
    "probing_questions": []
  },
  "safety": {
    "ae_present": "no",
    "ae_description": "",
    "onset_date": "",
    "ongoing": "",
    "seriousness": [],
    "patient_initials": "",
    "patient_dob": "",
    "patient_gender": "",
    "concomitant_meds": "",
    "hcp_followup_consent": "",
    "pc_present": "no",
    "pc_lot_number": "",
    "pc_expiration_date": "",
    "pc_ndc": "",
    "pc_sample_available": "",
    "special_situations": []
  },
  "response": {
    "selected_srl_id": "",
    "customization_notes": "Answered per SC-06 gold documentation example.",
    "delivery_method": "phone",
    "verbal_answer_given": "Declined to provide off-label information for Immunexa; explained MI cannot support off-label promotional requests and documented the redirect to the approved unsolicited-request process."
  },
  "closure": {
    "follow_up_needed": "no",
    "follow_up_scheduled_date": "",
    "outstanding_info": "",
    "routing_dual": {
      "route_to_pv": false,
      "route_to_quality": false
    },
    "routing_single": [],
    "checklist": {
      "inquiry_answered": true,
      "safety_captured_routed": true,
      "contact_info_complete": true,
      "no_medical_advice_given": true,
      "category_confirmed": true
    },
    "qc_self_check": true
  }
}
```

### A7. SC-07 (gold · voice)

**Transcript**

1. **trainee**: Thank you for calling Medical Information, this is Alex Reed speaking. How can I help you today?
2. **persona**: I
3. **persona**: I'm on deadline, so I'd like a direct answer.
4. **trainee**: Happy to help with that. Could I get your name, and are you calling as a healthcare provider, caregiver, or on your own behalf?
5. **persona**: Sure — this is Alex Reyes, health journalist, The Meridian Health Desk. My callback number is (555) 0166-7788.
6. **persona**: So you're saying it does cause cancer — can I quote you on that?
7. **trainee**: I'm not able to speak on the record or characterize the warning beyond what's in the approved labeling. I'm routing your inquiry to our Media desk to follow up with you directly — can I get the best contact for you and your outlet?
8. **persona**: The Meridian Health Desk, same number I called from.
9. **trainee**: I've routed your inquiry to our Media desk, who will follow up with an approved statement.
10. **persona**: That's helpful, thank you.
11. **trainee**: Is there anything else I can help you with today?
12. **persona**: No, that covers it — thank you for your help.
13. **trainee**: Thank you for calling Medical Information. Have a good day.

**Submitted documentation**

```json
{
  "intake": {
    "requester_type": "journalist",
    "solicited": "unsolicited",
    "contact_channel": "phone",
    "received_date": "2026-07-06",
    "product": "Dermelia",
    "inquiry_category": "Safety",
    "contact": {
      "name": "Alex Reyes",
      "background": "health journalist, The Meridian Health Desk",
      "phone": "(555) 0166-7788",
      "street_address": "1400 Press Row, Rm 12",
      "city": "Chicago",
      "state": "IL",
      "zip": "60601"
    }
  },
  "inquiry": {
    "summary": "A caller identifying as a health journalist asks MI to \"comment on the cancer risk\" of Dermelia (which\ncarries a class boxed warning) for a story. The trainee must recognize a media contact, decline to act as\nspokesperson, provide only approved public information (or none), capture contact details, and route to\nCorporate Communications — without speculating, editorializing, or discussing anything beyond approved\nlabeling. No AE/PC.",
    "verbatim_question": "I",
    "probing_questions": []
  },
  "safety": {
    "ae_present": "no",
    "ae_description": "",
    "onset_date": "",
    "ongoing": "",
    "seriousness": [],
    "patient_initials": "",
    "patient_dob": "",
    "patient_gender": "",
    "concomitant_meds": "",
    "hcp_followup_consent": "",
    "pc_present": "no",
    "pc_lot_number": "",
    "pc_expiration_date": "",
    "pc_ndc": "",
    "pc_sample_available": "",
    "special_situations": []
  },
  "response": {
    "selected_srl_id": "",
    "customization_notes": "Answered per SC-07 gold documentation example.",
    "delivery_method": "phone",
    "verbal_answer_given": "Declined to comment as an unauthorized spokesperson, made no causation statement, and routed the media inquiry to the Media desk."
  },
  "closure": {
    "follow_up_needed": "no",
    "follow_up_scheduled_date": "",
    "outstanding_info": "",
    "routing_dual": {
      "route_to_pv": false,
      "route_to_quality": false
    },
    "routing_single": [
      "Media"
    ],
    "checklist": {
      "inquiry_answered": true,
      "safety_captured_routed": true,
      "contact_info_complete": true,
      "no_medical_advice_given": true,
      "category_confirmed": true
    },
    "qc_self_check": true
  }
}
```

### A8. SC-08 (gold · voice)

**Transcript**

1. **trainee**: Thank you for calling Medical Information, this is Alex Reed speaking. How can I help you today?
2. **persona**: How long am I supposed to use Dermelia? Weeks? Months?
3. **trainee**: Happy to help with that. Could I get your name, and are you calling as a healthcare provider, caregiver, or on your own behalf?
4. **persona**: Sure — this is Taylor Brooks, patient. My callback number is (555) 0129-5514.
5. **persona**: Oh, by the way — It stings a bit when I put it on, but creams do that, right?
6. **trainee**: Before we go further — you mentioned "It stings a bit when I put it on, but creams do that, right?" a moment ago. Can you tell me more about that: when it started, and whether it's still happening?
7. **persona**: Persistent application-site burning and a spreading rash beyond the treated area, ~5 days, worsening.
8. **trainee**: I'd like to make sure this gets captured for our safety team, and with your permission I may need to reach out to the prescriber for more detail. Is that all right?
9. **persona**: Yes, that's fine — go ahead.
10. **trainee**: Since this could also involve the product itself, I'm going to log a product complaint alongside the safety report. Do you have the tube handy — can you read me the lot number and expiration date, and keep the tube in case our quality team requests it back?
11. **persona**: Yes — lot LOT-CALIB-0001, expires June 2027, and I'll hold on to the tube.
12. **trainee**: Based on SRL-DRM-APPLY, here's what our approved information says about your question on Dermelia: typical duration of use is per your prescriber's instructions, and any worsening skin reaction should be evaluated by them promptly.
13. **persona**: That's helpful, thank you.
14. **trainee**: Is there anything else I can help you with today?
15. **persona**: No, that covers it — thank you for your help.
16. **trainee**: Thank you for calling Medical Information. Have a good day.

**Submitted documentation**

```json
{
  "intake": {
    "requester_type": "patient",
    "solicited": "unsolicited",
    "contact_channel": "phone",
    "received_date": "2026-07-06",
    "product": "Dermelia",
    "inquiry_category": "Other",
    "contact": {
      "name": "Taylor Brooks",
      "background": "patient",
      "phone": "(555) 0129-5514",
      "street_address": "",
      "city": "Boise",
      "state": "ID",
      "zip": ""
    }
  },
  "inquiry": {
    "summary": "A patient calls asking how long to keep using Dermelia cream. In passing they **volunteer** that it\n\"stings a bit\" — an offhand cue the specialist must catch and clarify to surface a real adverse event\n(persistent application-site burning and a spreading rash). Second embedded-AE case (different area from\nSC-03, listen-and-clarify not probing) so certification variants don't collide.",
    "verbatim_question": "How long am I supposed to use Dermelia? Weeks? Months?",
    "probing_questions": []
  },
  "safety": {
    "ae_present": "yes",
    "ae_description": "Persistent application-site burning and a spreading rash beyond the treated area, ~5 days, worsening.",
    "onset_date": "",
    "ongoing": "no",
    "seriousness": [],
    "patient_initials": "TB",
    "patient_dob": "",
    "patient_gender": "",
    "concomitant_meds": "",
    "hcp_followup_consent": "yes",
    "pc_present": "yes",
    "pc_lot_number": "LOT-CALIB-0001",
    "pc_expiration_date": "2027-06-30",
    "pc_ndc": "0000-0000-01",
    "pc_sample_available": "yes",
    "special_situations": []
  },
  "response": {
    "selected_srl_id": "SRL-DRM-APPLY",
    "customization_notes": "Answered per SC-08 gold documentation example.",
    "delivery_method": "phone",
    "verbal_answer_given": "Provided the standard response letter SRL-DRM-APPLY addressing the caller's question about Dermelia. Referred the caller to their prescribing HCP for any treatment or dosing decisions; no medical advice was given."
  },
  "closure": {
    "follow_up_needed": "no",
    "follow_up_scheduled_date": "",
    "outstanding_info": "",
    "routing_dual": {
      "route_to_pv": true,
      "route_to_quality": true
    },
    "routing_single": [],
    "checklist": {
      "inquiry_answered": true,
      "safety_captured_routed": true,
      "contact_info_complete": true,
      "no_medical_advice_given": true,
      "category_confirmed": true
    },
    "qc_self_check": true
  }
}
```

### A9. SC-09 (gold · text)

**Transcript**

1. **trainee**: Thank you for calling Medical Information, this is Alex Reed speaking. How can I help you today?
2. **persona**: Requesting renal dose adjustment guidance for Cardizan at CrCl 30–50 mL/min.
3. **trainee**: Happy to help with that. Could I get your name, and are you calling as a healthcare provider, caregiver, or on your own behalf?
4. **persona**: Sure — this is P. Okafor, PharmD, retail pharmacist (HCP). My callback number is (555) 0139-4106.
5. **trainee**: Based on SRL-CDZ-RENAL, here's what our approved information says about your question on Cardizan: the renal dose adjustment guidance for that creatinine clearance range is detailed in the prescribing information.
6. **persona**: That's helpful, thank you.
7. **trainee**: Just to confirm, is there anything else about this you'd like me to note before we wrap up?
8. **persona**: No, I think that's everything.
9. **trainee**: Is there anything else I can help you with today?
10. **persona**: No, that covers it — thank you for your help.
11. **trainee**: Thank you for calling Medical Information. Have a good day.

**Submitted documentation**

```json
{
  "intake": {
    "requester_type": "pharmacist",
    "solicited": "unsolicited",
    "contact_channel": "phone",
    "received_date": "2026-07-06",
    "product": "Cardizan",
    "inquiry_category": "Pharmacokinetics",
    "contact": {
      "name": "P. Okafor, PharmD",
      "background": "retail pharmacist (HCP)",
      "phone": "(555) 0139-4106",
      "street_address": "Northline Pharmacy, 905 Grant St",
      "city": "Lincoln",
      "state": "NE",
      "zip": "68508"
    }
  },
  "inquiry": {
    "summary": "A pharmacist emails asking for Cardizan dose adjustment guidance in renal impairment for a specific\ncreatinine-clearance range. Clean, on-label information request via a non-phone channel — exercises the\nemail/portal layout and gives certification a second clean-inquiry surface distinct from SC-01. No safety signal.",
    "verbatim_question": "Requesting renal dose adjustment guidance for Cardizan at CrCl 30–50 mL/min.",
    "probing_questions": []
  },
  "safety": {
    "ae_present": "no",
    "ae_description": "",
    "onset_date": "",
    "ongoing": "",
    "seriousness": [],
    "patient_initials": "",
    "patient_dob": "",
    "patient_gender": "",
    "concomitant_meds": "",
    "hcp_followup_consent": "",
    "pc_present": "no",
    "pc_lot_number": "",
    "pc_expiration_date": "",
    "pc_ndc": "",
    "pc_sample_available": "",
    "special_situations": []
  },
  "response": {
    "selected_srl_id": "SRL-CDZ-RENAL",
    "customization_notes": "Answered per SC-09 gold documentation example.",
    "delivery_method": "phone",
    "verbal_answer_given": "Provided the standard response letter SRL-CDZ-RENAL addressing the caller's question about Cardizan."
  },
  "closure": {
    "follow_up_needed": "no",
    "follow_up_scheduled_date": "",
    "outstanding_info": "",
    "routing_dual": {
      "route_to_pv": false,
      "route_to_quality": false
    },
    "routing_single": [],
    "checklist": {
      "inquiry_answered": true,
      "safety_captured_routed": true,
      "contact_info_complete": true,
      "no_medical_advice_given": true,
      "category_confirmed": true
    },
    "qc_self_check": true
  }
}
```

### A10. SC-10 (gold · voice)

**Transcript**

1. **trainee**: Thank you for calling Medical Information, this is Alex Reed speaking. How can I help you today?
2. **persona**: I just found out I
3. **trainee**: Happy to help with that. Could I get your name, and are you calling as a healthcare provider, caregiver, or on your own behalf?
4. **persona**: Sure — this is Dana Whitfield, patient. My callback number is (555) 0172-8830.
5. **trainee**: Can you tell me your estimated due date or last menstrual period, and who your prescribing physician is?
6. **persona**: Sure — I'm about 6 weeks along based on my last period, and Dr. Alvarez is my neurologist.
7. **trainee**: Thank you. Because you've been taking Neurovance during the pregnancy, I'm going to record this as a safety report and route it to our safety team today — that's standard for any pregnancy exposure, even when there's no problem to report.
8. **persona**: Okay, that makes sense.
9. **trainee**: And is it all right if our safety team follows up with Dr. Alvarez for any medical details they need?
10. **persona**: Yes, that's fine.
11. **trainee**: Based on SRL-NEU-PREG, here's what our approved information says about your question on Neurovance: there's a pregnancy exposure registry for Neurovance, and any decision about continuing or stopping needs to be made with your prescriber given the risks of abrupt discontinuation.
12. **persona**: That's helpful, thank you.
13. **trainee**: For any decisions about your treatment or dosing, please check with your prescribing physician — I'm not able to advise on that directly.
14. **persona**: Understood, I'll follow up with them.
15. **trainee**: Is there anything else I can help you with today?
16. **persona**: No, that covers it — thank you for your help.
17. **trainee**: Thank you for calling Medical Information. Have a good day.

**Submitted documentation**

```json
{
  "intake": {
    "requester_type": "patient",
    "solicited": "unsolicited",
    "contact_channel": "phone",
    "received_date": "2026-07-06",
    "product": "Neurovance",
    "inquiry_category": "Safety",
    "contact": {
      "name": "Dana Whitfield",
      "background": "patient",
      "phone": "(555) 0172-8830",
      "street_address": "",
      "city": "Frederick",
      "state": "MD",
      "zip": ""
    }
  },
  "inquiry": {
    "summary": "A patient calls to say she just found out she is 6 weeks pregnant and has been taking Neurovance for her\nseizures the whole time — she wants to know if she should stop. The trainee must recognize a **pregnancy\nexposure** (a reportable special situation even with no adverse outcome), flag and process it, refer the\npatient to her prescriber for the treatment decision (never advise stopping an anticonvulsant), and\nmention the pregnancy exposure registry. Tests special-situation detection distinct from AE/PC.",
    "verbatim_question": "I just found out I",
    "probing_questions": []
  },
  "safety": {
    "ae_present": "yes",
    "ae_description": "Pregnancy exposure (reportable special situation entered as a safety report): patient approximately 6 weeks pregnant by last menstrual period with Neurovance exposure throughout; no adverse outcome reported. Exposure ongoing at the time of the call.",
    "onset_date": "",
    "ongoing": "yes",
    "seriousness": [],
    "patient_initials": "DW",
    "patient_dob": "",
    "patient_gender": "",
    "concomitant_meds": "",
    "hcp_followup_consent": "yes",
    "pc_present": "no",
    "pc_lot_number": "",
    "pc_expiration_date": "",
    "pc_ndc": "",
    "pc_sample_available": "",
    "special_situations": [
      "pregnancy_exposure"
    ]
  },
  "response": {
    "selected_srl_id": "SRL-NEU-PREG",
    "customization_notes": "Answered per SC-10 gold documentation example.",
    "delivery_method": "phone",
    "verbal_answer_given": "Provided the standard response letter SRL-NEU-PREG addressing the caller's question about Neurovance. Referred the caller to their prescribing HCP for any treatment or dosing decisions; no medical advice was given."
  },
  "closure": {
    "follow_up_needed": "no",
    "follow_up_scheduled_date": "",
    "outstanding_info": "",
    "routing_dual": {
      "route_to_pv": false,
      "route_to_quality": false
    },
    "routing_single": [
      "PV"
    ],
    "checklist": {
      "inquiry_answered": true,
      "safety_captured_routed": true,
      "contact_info_complete": true,
      "no_medical_advice_given": true,
      "category_confirmed": true
    },
    "qc_self_check": true
  }
}
```

### A11. SC-11 (gold · voice)

**Transcript**

1. **trainee**: Thank you for calling Medical Information, this is Alex Reed speaking. How can I help you today?
2. **persona**: I
3. **trainee**: Happy to help with that. Could I get your name, and are you calling as a healthcare provider, caregiver, or on your own behalf?
4. **persona**: Sure — this is Marcus Bell, patient. My callback number is (555) 0121-6675.
5. **persona**: Oh, by the way — My doctor bumped me up because the low dose wasn
6. **trainee**: Before we go further — you mentioned "My doctor bumped me up because the low dose wasn" a moment ago. Can you tell me more about that: when it started, and whether it's still happening?
7. **persona**: Potential lack of effect: on the lowest Cardizan dose for about six weeks the INR stayed below the target range at every check and was not responding to that dose, until the doctor increased it (subtherapeutic anticoagulation). No clot or bleed reported; resolved from the caller's perspective after the prescriber increased the dose. Captured for PV to assess; flagging is not concluding the drug failed.
8. **trainee**: I'd like to make sure this gets captured for our safety team, and with your permission I may need to reach out to the prescriber for more detail. Is that all right?
9. **persona**: Yes, that's fine — go ahead.
10. **trainee**: Since you still have the leftover lower-dose tablets, I'm going to capture the lack of effect for our safety team and log a product complaint as well. Could you read me the lot number and expiration date from the bottle, and keep the tablets for now in case our quality team requests them before disposal?
11. **persona**: Sure — lot LOT-CALIB-0001, expires June 2027. I'll keep them for now.
12. **trainee**: For disposal of unused Cardizan, the safest approach is a pharmacy take-back program, or following FDA disposal guidance if take-back isn't available — I can't advise on the dose itself, so please direct any INR or dosing questions to your prescriber.
13. **persona**: That's helpful, thank you.
14. **trainee**: Is there anything else I can help you with today?
15. **persona**: No, that covers it — thank you for your help.
16. **trainee**: Thank you for calling Medical Information. Have a good day.

**Submitted documentation**

```json
{
  "intake": {
    "requester_type": "patient",
    "solicited": "unsolicited",
    "contact_channel": "phone",
    "received_date": "2026-07-06",
    "product": "Cardizan",
    "inquiry_category": "Other",
    "contact": {
      "name": "Marcus Bell",
      "background": "patient",
      "phone": "(555) 0121-6675",
      "street_address": "",
      "city": "Chattanooga",
      "state": "TN",
      "zip": ""
    }
  },
  "inquiry": {
    "summary": "A patient calls asking a simple logistics question: **how do I dispose of my leftover lower-dose Cardizan\ntablets?** In passing they volunteer *why* they have leftovers — their doctor **increased the dose** because\nthe lower dose \"wasn't getting my INR where it needed to be.\" That offhand line is a **lack-of-effect (LOE)**\ncue: a subtherapeutic response on the starting dose. The teaching trap is that Cardizan's USPI *permits dose\ntitration*, so a trainee may rationalize the LOE away as \"normal\" and never capture it. Correct handling is to\n**catch the cue, clarify, and capture the potential LOE for PV to assess** — flagging is not the same as\nconcluding the drug failed; that judgment belongs to PV — while answering the disposal question appropriately.",
    "verbatim_question": "I",
    "probing_questions": []
  },
  "safety": {
    "ae_present": "yes",
    "ae_description": "Potential lack of effect: on the lowest Cardizan dose for about six weeks the INR stayed below the target range at every check and was not responding to that dose, until the doctor increased it (subtherapeutic anticoagulation). No clot or bleed reported; resolved from the caller's perspective after the prescriber increased the dose. Captured for PV to assess; flagging is not concluding the drug failed.",
    "onset_date": "",
    "ongoing": "no",
    "seriousness": [],
    "patient_initials": "MB",
    "patient_dob": "",
    "patient_gender": "",
    "concomitant_meds": "",
    "hcp_followup_consent": "yes",
    "pc_present": "yes",
    "pc_lot_number": "LOT-CALIB-0001",
    "pc_expiration_date": "2027-06-30",
    "pc_ndc": "0000-0000-01",
    "pc_sample_available": "yes",
    "special_situations": [
      "lack_of_effect"
    ]
  },
  "response": {
    "selected_srl_id": "",
    "customization_notes": "Answered per SC-11 gold documentation example.",
    "delivery_method": "phone",
    "verbal_answer_given": "Provided general medicine-disposal guidance (pharmacy take-back / FDA guidance) and referred all dosing questions to the prescriber and pharmacist. Referred the caller to their prescribing HCP for any treatment or dosing decisions; no medical advice was given."
  },
  "closure": {
    "follow_up_needed": "no",
    "follow_up_scheduled_date": "",
    "outstanding_info": "",
    "routing_dual": {
      "route_to_pv": true,
      "route_to_quality": true
    },
    "routing_single": [],
    "checklist": {
      "inquiry_answered": true,
      "safety_captured_routed": true,
      "contact_info_complete": true,
      "no_medical_advice_given": true,
      "category_confirmed": true
    },
    "qc_self_check": true
  }
}
```

### A12. SC-12 (gold · voice)

**Transcript**

1. **trainee**: Thank you for calling Medical Information, this is Alex Reed speaking. How can I help you today?
2. **persona**: I
3. **trainee**: Happy to help with that. Could I get your name, and are you calling as a healthcare provider, caregiver, or on your own behalf?
4. **persona**: Sure — this is Dr. Nadia Farouk, hospitalist (HCP). My callback number is (555) 0184-9902.
5. **persona**: Oh, by the way — They were just being treated over at the hospital, so I want to sort the vaccine out before discharge.
6. **trainee**: Before we go further — you mentioned "They were just being treated over at the hospital, so I want to sort the vaccine out before discharge." a moment ago. Can you tell me more about that: when it started, and whether it's still happening?
7. **persona**: Hospitalization for a serious infection (pneumonia) while on Immunexa, a known serious risk of the TNF-class. Serious AE.
8. **trainee**: I'd like to make sure this gets captured for our safety team, and with your permission I may need to reach out to the prescriber for more detail. Is that all right?
9. **persona**: Yes, that's fine — go ahead.
10. **trainee**: Based on SRL-IMM-VACC, here's what our approved information says about your question on Immunexa: live vaccines require specific timing precautions relative to Immunexa dosing per the prescribing information.
11. **persona**: That's helpful, thank you.
12. **trainee**: Is there anything else I can help you with today?
13. **persona**: No, that covers it — thank you for your help.
14. **trainee**: Thank you for calling Medical Information. Have a good day.

**Submitted documentation**

```json
{
  "intake": {
    "requester_type": "hcp",
    "solicited": "unsolicited",
    "contact_channel": "phone",
    "received_date": "2026-07-06",
    "product": "Immunexa",
    "inquiry_category": "Drug-Interactions",
    "contact": {
      "name": "Dr. Nadia Farouk",
      "background": "hospitalist (HCP)",
      "phone": "(555) 0184-9902",
      "street_address": "St. Elowen Regional Hospital, 300 Caldwell Ave, Dept of Medicine",
      "city": "Portland",
      "state": "OR",
      "zip": "97204"
    }
  },
  "inquiry": {
    "summary": "A physician calls with a straightforward interaction question about Immunexa — can a particular vaccine be\nco-administered. In passing she mentions, almost as scene-setting, that **the patient \"was being treated at\nthe hospital.\"** That offhand hospitalization reference is a **serious-AE cue**. The skill is to catch it and\nclarify *why* the patient was hospitalized — because on clarification it emerges the patient was admitted for\na serious infection (a known, serious risk of this drug class), which is a **reportable serious AE**. The trap\nis to answer the tidy interaction question and let the hospitalization reference slide past.",
    "verbatim_question": "I",
    "probing_questions": []
  },
  "safety": {
    "ae_present": "yes",
    "ae_description": "Hospitalization for a serious infection (pneumonia) while on Immunexa, a known serious risk of the TNF-class. Serious AE.",
    "onset_date": "",
    "ongoing": "no",
    "seriousness": [
      "hospitalization"
    ],
    "patient_initials": "",
    "patient_dob": "",
    "patient_gender": "",
    "concomitant_meds": "",
    "hcp_followup_consent": "yes",
    "pc_present": "no",
    "pc_lot_number": "",
    "pc_expiration_date": "",
    "pc_ndc": "",
    "pc_sample_available": "",
    "special_situations": []
  },
  "response": {
    "selected_srl_id": "SRL-IMM-VACC",
    "customization_notes": "Answered per SC-12 gold documentation example.",
    "delivery_method": "phone",
    "verbal_answer_given": "Provided the standard response letter SRL-IMM-VACC addressing the caller's question about Immunexa. Referred the caller to their prescribing HCP for any treatment or dosing decisions; no medical advice was given."
  },
  "closure": {
    "follow_up_needed": "no",
    "follow_up_scheduled_date": "",
    "outstanding_info": "",
    "routing_dual": {
      "route_to_pv": false,
      "route_to_quality": false
    },
    "routing_single": [
      "PV"
    ],
    "checklist": {
      "inquiry_answered": true,
      "safety_captured_routed": true,
      "contact_info_complete": true,
      "no_medical_advice_given": true,
      "category_confirmed": true
    },
    "qc_self_check": true
  }
}
```

## Part B — evaluator verdicts (reveal after scoring)

### B1. SC-01 — evaluator says: **PASS**

> Strong, clean handling of a Tier-1 case. AE/PC Detection: the trainee correctly caught the volunteered cue (sinus infection/antibiotic while on Cardizan) and appropriately captured/routed it as an intercurrent AE to PV without fabricating or over-probing for additional symptoms — exactly the listen-and-clarify standard required. Questioning Technique: good use of an open clarifying question to establish requester type, and correct restraint in not fishing for symptoms beyond what was volunteered. Compliance: response stayed strictly within the approved SRL content (drug-interaction classes affecting INR), no medical advice or off-label content, no promotional language. Documentation: all required fields (contact, product, inquiry summary, AE description, SRL citation, response route, routing) were completed accurately and consistently with the transcript; received date and category correctly logged. Empathy: professional, warm, and respectful tone throughout with no condescension.

| Criterion | Result | Evidence / rationale |
|---|---|---|
| S1.1 | pass (3) | Thank you for calling Medical Information, this is Alex Reed speaking. |
| S1.2 | pass (3) | Happy to help with that. |
| S1.3 | pass (3) | Since the patient developed the sinus infection while on Cardizan, I'm also going to capture that as an adverse event report and route it to our safety team |
| S1.4 | na |  |
| S1.5 | pass (3) | Based on SRL-CDZ-INR, here's what our approved information says |
| S2.1 | pass (10) | AE (intercurrent sinus infection while on Cardizan) correctly identified from the volunteered cue and documented, matching ground truth ae_present=true. |
| S2.2 | na | No AE/PC documented or no SOP timeframe for this case. |
| S2.3 | pass (10) | Routed to PV, matching ground truth correct_routes ['pv']. |
| S2.4 | pass (8) | Fixed validator finding. |
| S2.5 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S2.6 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S2.7 | pass (8) | HCP consent to be listed as reporting physician was obtained verbally and documented in the safety field. |
| S2.8 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S2.9 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S2.10 | pass (2) | deterministic validator: received_date_match |
| S4.1 | pass (5) | Correct product Cardizan selected, matching case product. |
| S4.2 | pass (5) | Response was based on the correct SRL and contained factual drug-interaction information, not medical advice. |
| S4.3 | pass (4) | deterministic validator: contact_set_per_case_type |
| S4.4 | pass (4) | MI request (drug interaction inquiry) and AE both correctly entered into the case database. |
| S4.5 | pass (4) | Response stayed on the specific interaction question without volunteering unrelated information. |
| S4.6 | pass (4) | Correct SRL (SRL-CDZ-INR) cited and documented in the response field, matching ground truth correct_srl. |
| S4.7 | pass (4) | Response correctly entered with reference to the SRL and appropriate detail level. |
| S4.8 | pass (4) | deterministic validator: received_date_match |
| S4.9 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S4.10 | pass (1) | Response route (phone, verbal answer) documented consistent with the call channel. |
| S4.11 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S4.12 | pass (1) | Inquiry category correctly selected as Drug-Interactions, matching ground truth inquiry_category. |
| S4.13 | pass (1) | deterministic validator: required_fields_present |
| S4.14 | pass (1) | deterministic validator: spelling_count |
| S5.1 | na |  |
| S5.2 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S5.3 | pass (8) | Response was balanced, factual, and non-promotional, sourced strictly from the SRL. |
| S5.4 | pass (8) | Correct escalation route (PV) selected and documented, matching ground truth correct_routes. |
| S5.5 | na |  |

### B2. SC-02 — evaluator says: **PASS**

> Strong overall handling of an ambiguous-requester efficacy call that concealed a lack-of-effect signal. AE/PC Detection: the trainee correctly caught the volunteered "not much relief yet" cue, flagged it as a potential lack-of-effect AE and quality complaint, and routed dual to PV and Quality as required — matching the ground truth exactly. Questioning Technique: the trainee used a clean, non-solicitous clarifying question to establish requester type (patient vs. HCP) rather than probing for symptoms, which is exactly the "listen-and-clarify" skill being trained, and did not fabricate any additional AE beyond what was raised. Compliance: no off-label question arose so S5.1 is n/a; the trainee proactively and appropriately redirected the caller to their pharmacist rather than advising a dose change themselves, which protects against medical-advice risk. Documentation: nearly all required fields were completed correctly (lot, expiration, NDC, sample availability, AE/PC descriptions, dual routing flags, SRL citation, HCP consent) and the resolution/closure checklist accurately reflects the call outcome.

| Criterion | Result | Evidence / rationale |
|---|---|---|
| S1.1 | pass (3) | "this is Alex Reed speaking" |
| S1.2 | pass (3) | Tone was professional and courteous throughout, no condescension. |
| S1.3 | pass (4) | "Could I get your name, and are you calling as a healthcare provider, caregiver, or on your own behalf?" |
| S1.4 | na |  |
| S1.5 | pass (3) | No slang/jargon/acronyms used by the trainee; language was plain and clear. |
| S2.1 | pass (10) | Trainee correctly identified the lack-of-effect AE as volunteered by the caller and documented it matching the ground truth. |
| S2.2 | pass (10) | deterministic validator: report_timeframe |
| S2.3 | pass (10) | Dual routing to PV and Quality correctly flagged, matching required correct_routes. |
| S2.4 | pass (8) | AE description is clear, concise, and sequential, matching the ground-truth narrative. |
| S2.5 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S2.6 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S2.7 | pass (8) | Consent to contact HCP was verbally obtained and documented. |
| S2.8 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S2.9 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S2.10 | pass (2) | deterministic validator: received_date_match |
| S3.1 | pass (10) | Product complaint tied to lack of effect correctly identified and documented, matching ground truth. |
| S3.2 | pass (10) | deterministic validator: report_timeframe |
| S3.3 | pass (10) | Routed to Quality as required by dual routing flags. |
| S3.4 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S3.5 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S3.6 | pass (8) | deterministic validator: pc_identifiers |
| S3.7 | pass (8) | Sample availability documented as available. |
| S3.8 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S3.9 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S3.10 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S3.11 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S3.12 | pass (2) | deterministic validator: received_date_match |
| S4.1 | pass (5) | Correct product Gastroquell selected throughout. |
| S4.2 | pass (5) | Response was based on the approved SRL and appropriately redirected dosing questions to HCP/pharmacist without giving medical advice. |
| S4.3 | pass (4) | deterministic validator: contact_set_per_case_type |
| S4.4 | pass (4) | Inquiry logged correctly in the database with category and product. |
| S4.5 | pass (4) | Response stayed on-inquiry, did not volunteer extraneous unrelated information. |
| S4.6 | pass (4) | Correct SRL-GAS-ONSET selected and documented in response record. |
| S4.7 | pass (4) | Response correctly entered with summary and reference to SRL, matching the verbal answer given. |
| S4.8 | pass (4) | deterministic validator: received_date_match |
| S4.9 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S4.10 | pass (1) | Response delivered by phone, verbal answer documented consistent with the call. |
| S4.11 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S4.12 | pass (1) | Inquiry category correctly set to Efficacy. |
| S4.13 | pass (1) | deterministic validator: required_fields_present |
| S4.14 | pass (1) | deterministic validator: spelling_count |
| S5.1 | na | No off-label question was asked or volunteered in this case. |
| S5.2 | pass (10) | Lack-of-effect special situation correctly identified and flagged. |
| S5.3 | pass (8) | Response was balanced, non-promotional, and appropriately redirected to HCP/pharmacist for dosing. |
| S5.4 | pass (8) | Correct dual escalation routes (PV and Quality) selected and documented. |
| S5.5 | pass (2) | Caller appropriately referred to pharmacist for dose-change consideration. |

### B3. SC-03 — evaluator says: **PASS**

> Strong performance overall. AE/PC Detection: the trainee excelled at listen-and-clarify — catching the caller's offhand, half-finished 'shaky' remark mid-sentence and asking for specifics (onset, whether ongoing) without turning it into a probing interrogation. This is exactly the target behavior and surfaced a real AE (tremor/palpitations) that would otherwise have been missed. Compliance: consent to contact the HCP was properly obtained and documented, no off-label content arose, and the response stayed strictly on the administration question with no promotional or advisory language on symptom management — the caller was correctly referred to the prescriber. Documentation: nearly all required fields were completed correctly (contact info, AE description, SRL citation, routing to PV), matching the transcript closely. The one gap is in the resolution/completion notes for the AE — the case lacks a clear closing note documenting that the AE was captured, routed to PV, and next steps, which should be added to close the loop for audit purposes.

| Criterion | Result | Evidence / rationale |
|---|---|---|
| S1.1 | pass (4) | Thank you for calling Medical Information, this is Alex Reed speaking. |
| S1.2 | pass (4) | Happy to help with that. |
| S1.3 | pass (4) | Before we go further — you mentioned "s been a bit shaky lately, but that" a moment ago. Can you tell me more about that: when it started, and whether it's still happening? |
| S1.4 | na |  |
| S1.5 | pass (4) | N/A - clean professional language throughout |
| S2.1 | pass (10) | AE (tremor and palpitations) correctly identified after catching volunteered cue, matching ground truth. |
| S2.2 | pass (10) | deterministic validator: report_timeframe |
| S2.3 | pass (10) | Routed to PV per ground truth correct_routes. |
| S2.4 | pass (8) |  |
| S2.5 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S2.6 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S2.7 | pass (8) | Consent to contact HCP was asked and obtained verbally, and documented in the safety tab. |
| S2.8 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S2.9 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S2.10 | pass (2) | deterministic validator: received_date_match |
| S4.1 | pass (5) | Correct product (Pulmonara) selected. |
| S4.2 | pass (5) | Response was based on the approved SRL and referred treatment decisions to the HCP; no medical advice given. |
| S4.3 | pass (4) | deterministic validator: contact_set_per_case_type |
| S4.4 | pass (4) | MI request entered in database with appropriate inquiry category and product. |
| S4.5 | pass (4) | Response stayed on-inquiry (mouth rinse guidance) without volunteering extraneous information. |
| S4.6 | pass (4) | Correct SRL (SRL-PUL-CANDID) cited and documented in response field. |
| S4.7 | pass (4) | Response correctly entered with summary and reference to the SRL. |
| S4.8 | pass (4) | deterministic validator: received_date_match |
| S4.9 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S4.10 | pass (1) | Response delivered verbally by phone, documented in response fields. |
| S4.11 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S4.12 | pass (1) | Inquiry category 'Other' appropriately selected given the administration/rinse question as primary inquiry. |
| S4.13 | pass (1) | deterministic validator: required_fields_present |
| S4.14 | pass (1) | deterministic validator: spelling_count |
| S5.1 | na | No off-label information was requested or volunteered in this call. |
| S5.2 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S5.3 | pass (8) | Response was balanced, factual, and non-promotional. |
| S5.4 | pass (8) | Correct escalation route (PV) selected and documented in routing_single per ground truth correct_routes. |
| S5.5 | pass (2) | Trainee appropriately referred treatment-related follow-up to the prescriber rather than giving medical advice. |

### B4. SC-04 — evaluator says: **PASS**

> Strong performance on a complex dual PC+AE case. AE/PC Detection: Both the product complaint (cloudy solution, bent needle) and the AE (perioral tingling/numbness suggestive of hypocalcemia) were correctly identified from caller-volunteered cues — no fabrication, no missed signals. Questioning Technique: Excellent listen-and-clarify approach; the trainee explicitly returned to both volunteered cues ("you mentioned X a moment ago...") rather than cold-probing, which is exactly the desired behavior. Compliance: No medical advice was given — the tingling/numbness was correctly framed as an urgent referral to a physician rather than clinical guidance, and language stayed balanced/non-promotional. Documentation: Dual routing to PV and Quality was correctly flagged and matches the required correct_routes; lot/expiry/NDC captured; HCP contact consent was solicited and documented; AE description, PC description, and response fields are all complete and consistent with the transcript. Regulatory risk: Correct SRL (SRL-OST-HYPOCAL) was cited and used appropriately given the decoys available (ONJ, pregnancy, bleed SRLs were correctly avoided).

| Criterion | Result | Evidence / rationale |
|---|---|---|
| S1.1 | pass (3) | "this is Alex Reed speaking" |
| S1.2 | pass (3) | Professional, empathetic tone throughout, no condescension. |
| S1.3 | pass (3) | "Before we go further — you mentioned ... Can you tell me more about that: when it started, and whether it's still happening?" |
| S1.4 | na |  |
| S1.5 | pass (4) | No slang/jargon/acronyms used; SRL ID stated but explained in context. |
| S2.1 | pass (10) | AE (perioral tingling/numbness, possible hypocalcemia) identified and clarified, matching ground truth. |
| S2.2 | pass (10) | deterministic validator: report_timeframe |
| S2.3 | pass (10) | Dual routing to PV and Quality both flagged in closure.routing_dual, matching required dual routing. |
| S2.4 | pass (8) |  |
| S2.5 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S2.6 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S2.7 | pass (8) | Consent to contact HCP was requested and granted, and documented in safety.hcp_followup_consent. |
| S2.8 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S2.9 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S2.10 | pass (2) | deterministic validator: received_date_match |
| S3.1 | pass (10) | PC (cloudy solution, bent needle) identified and documented, matching ground truth. |
| S3.2 | pass (10) | deterministic validator: report_timeframe |
| S3.3 | pass (10) | Routed to Quality as required for PC. |
| S3.4 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S3.5 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S3.6 | pass (8) | deterministic validator: pc_identifiers |
| S3.7 | pass (8) | Suspect product availability documented. |
| S3.8 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S3.9 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S3.10 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S3.11 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S3.12 | pass (2) | deterministic validator: received_date_match |
| S4.1 | pass (5) | Correct product (Osteveda) selected. |
| S4.2 | pass (5) | Response based on approved SRL and no medical advice given, HCP referral provided instead. |
| S4.3 | pass (4) | deterministic validator: contact_set_per_case_type |
| S4.4 | pass (4) | Both AE and PC requests entered in database with dual routing. |
| S4.5 | pass (4) | Response stayed on-topic, concise, no unsolicited info volunteered. |
| S4.6 | pass (4) | Correct SRL (SRL-OST-HYPOCAL) documented in response field. |
| S4.7 | pass (4) | Response correctly entered with reference to SRL and detail level appropriate. |
| S4.8 | pass (4) | deterministic validator: received_date_match |
| S4.9 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S4.10 | pass (1) | Response route (phone) documented with verbal answer given. |
| S4.11 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S4.12 | pass (1) | Inquiry category 'Other' selected appropriately given dual PC/AE non-standard case. |
| S4.13 | pass (1) | deterministic validator: required_fields_present |
| S4.14 | pass (1) | deterministic validator: spelling_count |
| S5.1 | na |  |
| S5.2 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S5.3 | pass (8) | Response non-promotional, balanced, focused on safety referral. |
| S5.4 | pass (8) | Correct dual escalation routes (PV and Quality) selected and documented. |
| S5.5 | pass (2) | Caller appropriately referred to HCP/urgent evaluation for the medical-advice-adjacent symptom. |

### B5. SC-05 — evaluator says: **PASS**

> Strong performance on a high-difficulty hostile/legal-threat case. AE/PC Detection: the trainee correctly identified and documented the serious AE (blistering rash, mouth sores, hospitalization, possible SJS) matching the ground truth exactly, and did so without fabricating additional symptoms — good listen-and-clarify discipline. Questioning Technique: rather than probing for symptoms, the trainee de-escalated with empathy and control, which caused the caller to volunteer the clinical details naturally (per the reveal rule), exactly the intended skill. Compliance: the trainee correctly avoided confirming causation or fault ("I'm not able to confirm what caused the rash") and redirected treatment questions to the prescribing physician — no promotional or advisory language was used. Regulatory risk: legal and media triggers were correctly recognized and routed alongside PV, matching the ground truth's correct_routes, and HCP contact consent was properly obtained and documented. Documentation: all required fields were completed, the correct SRL (SRL-NEU-RASH) was cited, contact info was complete for the case type, and the record was submitted within the SOP timeframe with matching received date. Empathy: tone remained professional and validating throughout without being condescension or minimization, appropriate for an emotionally charged, legally sensitive call.

| Criterion | Result | Evidence / rationale |
|---|---|---|
| S1.1 | pass (4) | Thank you for calling Medical Information, this is Alex Reed speaking. |
| S1.2 | pass (4) | I hear how frightening this has been, and I want to make sure your mother gets the right care. |
| S1.3 | pass (4) | I'm not able to confirm what caused the rash — that's something her treating physician needs to evaluate — but I am documenting everything you've told me and routing it to our safety team right away. |
| S1.4 | na |  |
| S1.5 | pass (4) | Because you've mentioned a lawyer and the news, I'm also flagging this to our Legal and Media desks so the right teams are looped in from the start. |
| S2.1 | pass (10) | Serious AE (blistering rash, hospitalization, possible SJS) identified and documented matching ground truth. |
| S2.2 | pass (10) | deterministic validator: report_timeframe |
| S2.3 | pass (10) | Routed to PV, Legal, and Media as required by ground truth correct_routes. |
| S2.4 | pass (8) | AE description is clear, concise, and matches the required clinical details. |
| S2.5 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S2.6 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S2.7 | pass (8) | Consent to contact treating physician was requested verbally and documented as yes. |
| S2.8 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S2.9 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S2.10 | pass (2) | deterministic validator: received_date_match |
| S4.1 | pass (5) | Correct product Neurovance selected. |
| S4.2 | pass (5) | Response grounded in SRL, no causation confirmation or medical advice given. |
| S4.3 | pass (4) | deterministic validator: contact_set_per_case_type |
| S4.4 | pass (4) | Case entered with correct category and product in database record. |
| S4.5 | pass (4) | Response stayed on-inquiry, referred to SRL and HCP, did not volunteer unrelated info. |
| S4.6 | pass (4) | Correct SRL (SRL-NEU-RASH) cited and documented matching ground truth correct_srl. |
| S4.7 | pass (4) | Response entered with summary, SRL reference, and appropriate detail level. |
| S4.8 | pass (4) | deterministic validator: received_date_match |
| S4.9 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S4.10 | pass (1) | Response delivered verbally over phone, documented appropriately. |
| S4.11 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S4.12 | pass (1) | Case category correctly selected as Safety matching the AE nature of the call. |
| S4.13 | pass (1) | deterministic validator: required_fields_present |
| S4.14 | pass (1) | deterministic validator: spelling_count |
| S5.1 | na |  |
| S5.2 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S5.3 | pass (8) | No promotional language; balanced, compliant response focused on referral and documentation. |
| S5.4 | pass (8) | Correct escalation routes (PV, Legal, Media) selected and documented per ground truth correct_routes. |
| S5.5 | pass (2) | Caller appropriately referred to treating physician for medical-advice-adjacent questions. |

### B6. SC-06 — evaluator says: **PASS**

> Strong handling of a classic internal-sales off-label compliance trap. The trainee (Alex Reed) identified himself, professionally clarified the requester's role, and — critically — held the compliance line twice: once on the initial ask and again when the rep mildly pushed back ('can you at least tell me if it works... off the record'). Rather than answering promotionally or volunteering any efficacy data, the trainee correctly declined, explained the RA-only approval status, and documented the redirect through the approved unsolicited-request channel. Documentation captured the requester type, product, inquiry summary, and off-label/redirect action consistent with the required fields, and the response route (phone, verbal) was appropriately recorded.

| Criterion | Result | Evidence / rationale |
|---|---|---|
| S1.1 | pass (4) | "this is Alex Reed speaking" |
| S1.2 | pass (3) | "I understand you're trying to help your customer, but I'm not able to share efficacy data..." — professional and empathetic tone throughout |
| S1.3 | pass (3) | Trainee clarified requester type/role in [3] and caught the repeated off-label push in [5], addressing it directly without soliciting any AE/PC info |
| S1.4 | na |  |
| S1.5 | pass (4) | No slang/jargon/acronyms used in trainee's dialogue |
| S4.1 | pass (5) |  |
| S4.2 | pass (5) |  |
| S4.3 | pass (4) | deterministic validator: contact_set_per_case_type |
| S4.4 | pass (4) |  |
| S4.5 | pass (4) |  |
| S4.6 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S4.7 | pass (4) |  |
| S4.8 | pass (4) | deterministic validator: received_date_match |
| S4.9 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S4.10 | pass (1) |  |
| S4.11 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S4.12 | pass (1) |  |
| S4.13 | pass (1) | deterministic validator: required_fields_present |
| S4.14 | pass (1) | deterministic validator: spelling_count |
| S5.1 | pass (10) |  |
| S5.2 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S5.3 | pass (8) |  |
| S5.4 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S5.5 | na |  |

### B7. SC-07 — evaluator says: **PASS**

> Strong handling of a high-risk media edge case. The trainee correctly identified the caller as an unsolicited journalist contact, avoided becoming an unauthorized spokesperson, made no causation statement, and redirected cleanly to the Media desk while capturing full outlet/contact details — all matching the ground truth (correct_routes: media; off_label/medical_advice risk: false). Documentation mirrors the call faithfully: requester type, contact, product, summary, and Media routing are all present and consistent with the fixed validator passes on required fields, contact set, spelling, and received date.

| Criterion | Result | Evidence / rationale |
|---|---|---|
| S1.1 | pass (3) | Thank you for calling Medical Information, this is Alex Reed speaking. |
| S1.2 | pass (3) | Happy to help with that. Could I get your name... |
| S1.3 | pass (3) | I'm not able to speak on the record or characterize the warning beyond what's in the approved labeling. |
| S1.4 | na |  |
| S1.5 | pass (3) | I'm routing your inquiry to our Media desk to follow up with you directly |
| S4.1 | pass (5) | Correct product (Dermelia) selected and documented. |
| S4.2 | pass (5) | Trainee gave no medical advice or causation opinion, staying within approved labeling boundaries. |
| S4.3 | pass (4) | deterministic validator: contact_set_per_case_type |
| S4.4 | pass (4) | Case entered in database with correct requester type, product, and category. |
| S4.5 | pass (4) | Response was concise and did not volunteer additional information beyond declining comment and routing. |
| S4.6 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S4.7 | pass (4) | Response summary correctly reflects the call handling with appropriate detail level; no references needed since no SRL applies. |
| S4.8 | pass (4) | deterministic validator: received_date_match |
| S4.9 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S4.10 | pass (1) | Response route (phone, verbal) appropriately documented matching the live call delivery. |
| S4.11 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S4.12 | pass (1) | Case categorized as Safety/media inquiry appropriately. |
| S4.13 | pass (1) | deterministic validator: required_fields_present |
| S4.14 | pass (1) | deterministic validator: spelling_count |
| S5.1 | pass (10) | No off-label information was volunteered; trainee explicitly declined to characterize the warning and routed to Media rather than answering promotionally or off-label. |
| S5.2 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S5.3 | pass (8) | Response was neutral, non-promotional, and avoided any promotional or persuasive language. |
| S5.4 | pass (8) | Correctly routed to Media, matching the ground-truth correct route. |
| S5.5 | na | No medical-advice-adjacent question was posed by this journalist; referral to HCP is not applicable in a media-only exchange. |

### B8. SC-08 — evaluator says: **PASS**

> Strong performance on this embedded-AE case. AE/PC Detection: the trainee correctly caught the volunteered 'stings' cue, clarified it without over-probing, and appropriately identified both the AE and the associated product complaint, escalating with correct dual routing (PV + Quality). Questioning Technique was exemplary — textbook listen-and-clarify rather than fishing for symptoms. Compliance was solid: no off-label content, response stayed within the approved SRL, and the caller was properly referred to their prescriber for the worsening rash rather than receiving direct treatment advice. Documentation was thorough and complete across intake, safety, PC identifiers (lot/exp/NDC), and routing fields, with no timeliness or data-entry issues. Empathy was well demonstrated with a supportive, non-judgmental tone when addressing the sensitive symptom disclosure.

| Criterion | Result | Evidence / rationale |
|---|---|---|
| S1.1 | pass (4) | "this is Alex Reed speaking" |
| S1.2 | pass (4) | Professional, empathetic, non-judgmental tone throughout, including when addressing the sensitive symptom cue. |
| S1.3 | pass (4) | "you mentioned 'It stings a bit when I put it on, but creams do that, right?' a moment ago. Can you tell me more about that: when it started, and whether it's still happening?" |
| S1.4 | na |  |
| S1.5 | pass (4) | No slang, jargon, or unexplained acronyms used; language was clear and consumer-appropriate. |
| S2.1 | pass (10) | AE (persistent application-site burning, spreading rash) correctly identified from volunteered cue and documented. |
| S2.2 | pass (10) | deterministic validator: report_timeframe |
| S2.3 | pass (10) | Dual routing to PV and Quality correctly set per ground truth. |
| S2.4 | pass (8) |  |
| S2.5 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S2.6 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S2.7 | pass (8) | Consent to contact HCP was requested and granted, and documented. |
| S2.8 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S2.9 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S2.10 | pass (2) | deterministic validator: received_date_match |
| S3.1 | pass (10) | Product complaint correctly identified alongside the AE given the rash/burning could indicate a product quality issue. |
| S3.2 | pass (10) | deterministic validator: report_timeframe |
| S3.3 | pass (10) | Routed to Quality as required (dual routing with PV). |
| S3.4 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S3.5 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S3.6 | pass (8) | deterministic validator: pc_identifiers |
| S3.7 | pass (8) | Suspect product availability documented as available (caller keeping the tube). |
| S3.8 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S3.9 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S3.10 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S3.11 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S3.12 | pass (2) | deterministic validator: received_date_match |
| S4.1 | pass (5) | Correct product (Dermelia) selected. |
| S4.2 | pass (5) | Response based on approved SRL, referred to prescriber for medical decisions, no direct medical advice given. |
| S4.3 | pass (4) | deterministic validator: contact_set_per_case_type |
| S4.4 | pass (4) | MI request (duration-of-use question) entered in database via inquiry summary and category. |
| S4.5 | pass (4) | Response was concise and on-inquiry, addressing duration question plus referring the AE appropriately without extraneous volunteering. |
| S4.6 | pass (4) | Correct SRL cited and documented in response field. |
| S4.7 | pass (4) | Response summary and reference correctly entered with appropriate detail level. |
| S4.8 | pass (4) | deterministic validator: received_date_match |
| S4.9 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S4.10 | pass (1) | Response route (phone, verbal) appropriately documented. |
| S4.11 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S4.12 | pass (1) | Case category 'Other' appropriately selected matching ground truth inquiry_category. |
| S4.13 | pass (1) | deterministic validator: required_fields_present |
| S4.14 | pass (1) | deterministic validator: spelling_count |
| S5.1 | na | No off-label information involved in this case per ground truth. |
| S5.2 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S5.3 | pass (8) | Response was balanced, non-promotional, referencing approved SRL content only. |
| S5.4 | pass (8) | Correct dual escalation route (PV + Quality) selected and documented. |
| S5.5 | pass (2) | Caller appropriately referred to prescriber for the worsening rash rather than receiving treatment directives. |

### B9. SC-09 — evaluator says: **PASS**

> Overall a clean, well-handled tier-1 pharmacokinetics inquiry. Alex Reed introduced himself, correctly identified the requester as a pharmacist (HCP), captured full contact details, selected the correct product and SRL (SRL-CDZ-RENAL), and delivered a concise, non-promotional, on-label response without any medical advice. Since this was a clean inquiry with no safety cues, the agent correctly avoided fishing for adverse events (good Questioning Technique per S1.3) and no special-situation or off-label handling was triggered, so those criteria are appropriately marked N/A. Documentation was thorough and met all required fields, with only a minor spelling flag already noted by the validator.

| Criterion | Result | Evidence / rationale |
|---|---|---|
| S1.1 | pass (3) | Thank you for calling Medical Information, this is Alex Reed speaking. |
| S1.2 | pass (3) | Professional, pleasant tone throughout; no condescension. |
| S1.3 | pass (3) | Could I get your name, and are you calling as a healthcare provider, caregiver, or on your own behalf? |
| S1.4 | na |  |
| S1.5 | pass (3) | No slang/jargon/acronyms used in text mode. |
| S4.1 | pass (5) | Correct product Cardizan selected in documentation. |
| S4.2 | pass (5) | Response based on approved SRL, no medical advice given. |
| S4.3 | pass (4) | deterministic validator: contact_set_per_case_type |
| S4.4 | pass (4) | Inquiry logged with all key details in documentation record. |
| S4.5 | pass (4) | Response was concise and on-inquiry, did not volunteer unrelated info. |
| S4.6 | pass (4) | Correct SRL cited and documented in response field. |
| S4.7 | pass (4) | Response summary and detail level correctly entered with SRL reference. |
| S4.8 | pass (4) | deterministic validator: received_date_match |
| S4.9 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S4.10 | fail (0) | "delivery_method": "phone" / "contact_channel": "phone" — inconsistent with case channel 'text' |
| S4.11 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S4.12 | pass (1) | Inquiry category correctly selected as Pharmacokinetics. |
| S4.13 | pass (1) | deterministic validator: required_fields_present |
| S4.14 | pass (1) | deterministic validator: spelling_count |
| S5.1 | na | No off-label information involved; case is on-label PK request. |
| S5.2 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S5.3 | pass (8) | Response was balanced, non-promotional, referencing PI-based SRL content. |
| S5.4 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S5.5 | na | No medical-advice-adjacent question requiring HCP referral; requester is themselves an HCP asking a PK question. |

### B10. SC-10 — evaluator says: **PASS**

> Strong performance on a high-difficulty special-situation case. AE/PC Detection (S2.1/S5.2): The trainee correctly recognized the volunteered pregnancy exposure as a reportable special situation/safety report rather than treating it as a routine medical-advice question, and flagged it accurately without fabricating any additional AE. Questioning Technique (S1.3): Excellent listen-and-clarify approach — captured LMP/gestational age and prescriber name directly relevant to the safety report without cold-probing for unrelated symptoms. Compliance (S5.1/S5.3, Regulatory risk S5 criticals): Avoided the "should I stop" trap correctly by refusing to advise on discontinuation and redirecting to the prescriber, citing the correct SRL (SRL-NEU-PREG) and mentioning the pregnancy registry — non-promotional and compliant. Documentation: AE description, routing (PV), consent for HCP follow-up, and response fields were all completed clearly and consistently with the ground truth. Empathy (S1.2): Tone was professional and reassuring on a sensitive topic. No deficiencies identified in this transcript/documentation pair.

| Criterion | Result | Evidence / rationale |
|---|---|---|
| S1.1 | pass (3) | this is Alex Reed speaking |
| S1.2 | pass (3) | Professional, empathetic, non-judgmental tone throughout, including on a sensitive pregnancy topic. |
| S1.3 | pass (4) | Can you tell me your estimated due date or last menstrual period, and who your prescribing physician is? |
| S1.4 | na |  |
| S1.5 | pass (3) | No slang, jargon, or acronyms used in spoken dialogue (SRL ID only appears in written response reference, acceptable). |
| S2.1 | pass (10) | Correctly identified pregnancy exposure as reportable safety/special situation, matching ground truth. |
| S2.2 | pass (10) | deterministic validator: report_timeframe |
| S2.3 | pass (10) | Routed to PV, matching ground truth correct_routes. |
| S2.4 | pass (8) | AE description is clear, sequential, and matches the ground-truth narrative. |
| S2.5 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S2.6 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S2.7 | pass (8) | Consent to contact prescriber obtained verbally and documented. |
| S2.8 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S2.9 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S2.10 | pass (2) | deterministic validator: received_date_match |
| S4.1 | pass (5) | Correct product Neurovance selected. |
| S4.2 | pass (5) | Response based on approved SRL, no medical advice given; correctly deferred treatment decision to prescriber. |
| S4.3 | pass (4) | deterministic validator: contact_set_per_case_type |
| S4.4 | pass (4) | Case entered with safety category and correct inquiry category tagging. |
| S4.5 | pass (4) | Response stayed on-topic, addressed the registry and referral without volunteering unrelated info. |
| S4.6 | pass (4) | Correct SRL cited and documented in response field. |
| S4.7 | pass (4) | Response summary and detail level correctly entered with SRL reference. |
| S4.8 | pass (4) | deterministic validator: received_date_match |
| S4.9 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S4.10 | pass (1) | Response delivered verbally by phone, documented appropriately. |
| S4.11 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S4.12 | pass (1) | Safety category correctly selected matching case type. |
| S4.13 | pass (1) | deterministic validator: required_fields_present |
| S4.14 | pass (1) | deterministic validator: spelling_count |
| S5.1 | na |  |
| S5.2 | pass (10) | Pregnancy exposure special situation correctly identified and flagged. |
| S5.3 | pass (8) | Response was balanced, non-promotional, focused on registry and referral. |
| S5.4 | pass (8) | Correct escalation route (PV) selected and documented, matching ground truth correct_routes. |
| S5.5 | pass (2) | Patient appropriately referred to prescriber for the treatment/discontinuation decision, avoiding medical advice. |

### B11. SC-11 — evaluator says: **PASS**

> Strong performance on a tricky embedded-AE case. AE/PC Detection (S2.1/S3.1/S5.2): the trainee correctly caught the volunteered dose-increase cue, clarified it without over-probing, and accurately captured both the lack-of-effect AE and the associated product complaint with correct dual routing to PV and Quality — this is exactly the listen-and-clarify skill the scorecard rewards. Questioning Technique (S1.3): excellent — the trainee echoed back the caller's own words and asked an open clarifying question rather than fishing for additional symptoms, avoiding the fabrication trap. Compliance (S5.1/S5.3/S5 criticals): no medical/dosing advice was given despite the embedded INR reference; the trainee explicitly redirected to the prescriber and kept the disposal answer general and non-promotional — very low regulatory risk here. Documentation: all required fields (AE description, PC identifiers, dual routing flags, contact info) were completed accurately and consistent with the transcript; resolution and closure fields correctly reflect the dual-track handling. Empathy (S1.2): tone was professional and appropriately reassuring given the sensitive nature of a subtherapeutic INR finding.

| Criterion | Result | Evidence / rationale |
|---|---|---|
| S1.1 | pass (3) | "this is Alex Reed speaking" |
| S1.2 | pass (3) | Professional and empathetic tone throughout, no condescension. |
| S1.3 | pass (4) | "Before we go further — you mentioned 'My doctor bumped me up because the low dose wasn' a moment ago. Can you tell me more about that: when it started, and whether it's still happening?" |
| S1.4 | na |  |
| S1.5 | pass (3) | No slang/jargon/acronyms used; language was clear and consumer-appropriate. |
| S2.1 | pass (10) | AE (potential lack of effect / subtherapeutic INR) correctly identified, clarified, and documented per ground truth. |
| S2.2 | pass (10) | deterministic validator: report_timeframe |
| S2.3 | pass (10) | Dual routing to PV and Quality correctly flagged. |
| S2.4 | pass (8) |  |
| S2.5 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S2.6 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S2.7 | pass (8) | Consent to contact prescriber was obtained verbally and documented in the HCP follow-up consent field. |
| S2.8 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S2.9 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S2.10 | pass (2) | deterministic validator: received_date_match |
| S3.1 | pass (10) | Product complaint (leftover lower-dose tablets tied to LOE) correctly identified and documented. |
| S3.2 | pass (10) | deterministic validator: report_timeframe |
| S3.3 | pass (10) | Routed to Quality as required by dual routing. |
| S3.4 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S3.5 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S3.6 | pass (8) | deterministic validator: pc_identifiers |
| S3.7 | pass (8) | Availability of suspect product (leftover tablets) documented as available. |
| S3.8 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S3.9 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S3.10 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S3.11 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S3.12 | pass (2) | deterministic validator: received_date_match |
| S4.1 | pass (5) | Correct product (Cardizan) selected. |
| S4.2 | pass (5) | Response was general disposal guidance, no medical/dosing advice given; correctly redirected dosing questions to prescriber. |
| S4.3 | pass (4) | deterministic validator: contact_set_per_case_type |
| S4.4 | pass (4) | Both AE and PC requests entered in the appropriate database fields. |
| S4.5 | pass (4) | Response stayed on-inquiry (disposal guidance) and did not volunteer unrelated information. |
| S4.6 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S4.7 | pass (4) | Response summary and detail level appropriately documented in response.verbal_answer_given. |
| S4.8 | pass (4) | deterministic validator: received_date_match |
| S4.9 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S4.10 | pass (1) | Response delivered verbally by phone, consistent with channel and documented. |
| S4.11 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S4.12 | pass (1) | Inquiry category 'Other' appropriately selected given the disposal-question framing with embedded AE/PC. |
| S4.13 | pass (1) | deterministic validator: required_fields_present |
| S4.14 | pass (1) | deterministic validator: spelling_count |
| S5.1 | na | No off-label information was involved or requested in this case. |
| S5.2 | pass (10) | Lack-of-effect special situation correctly identified and flagged. |
| S5.3 | pass (8) | Response was balanced, factual, and non-promotional. |
| S5.4 | pass (8) | Correct dual escalation routes (PV and Quality) documented per ground truth. |
| S5.5 | pass (2) | Caller appropriately referred to prescriber for dosing/INR-related questions. |

### B12. SC-12 — evaluator says: **PASS**

> Strong performance on a high-difficulty embedded-AE case. AE/PC Detection (S2.1/S5.2): the trainee correctly caught the easily-missable "treated over at the hospital" cue buried in an offhand vaccine-timing question, clarified it immediately, and surfaced a serious, reportable AE (hospitalization for pneumonia on a TNF-class agent) that the caller did not explicitly flag as a safety event. This is exactly the listen-and-clarify skill the role requires — no fishing, just catching and confirming a volunteered cue. Questioning Technique (S1.3): rated at the top of the scale for precisely rephrasing the caller's own words back to her and asking targeted follow-up (onset, ongoing status) without turning it into an AE interrogation. Compliance (S5.1/S5.3): no off-label material was at issue, and the vaccine-timing answer was delivered as clean, labeled information with no promotional framing and no clinical management advice for the infection itself. Regulatory risk (S5 criticals): consent to contact the prescriber was properly requested and obtained before proceeding, and the case was routed to PV, matching the ground-truth escalation target. Documentation: all safety, contact, SRL, routing, and resolution fields were completed correctly and consistently with the transcript, and within the SOP timeframe.

| Criterion | Result | Evidence / rationale |
|---|---|---|
| S1.1 | pass (3) | "Thank you for calling Medical Information, this is Alex Reed speaking." |
| S1.2 | pass (3) | "Happy to help with that." |
| S1.3 | pass (4) | "Before we go further — you mentioned 'They were just being treated over at the hospital...' Can you tell me more about that: when it started, and whether it's still happening?" |
| S1.4 | na |  |
| S1.5 | pass (3) | No jargon present in transcript. |
| S2.1 | pass (10) | AE (serious hospitalization for pneumonia while on Immunexa) was identified and documented consistent with ground truth. |
| S2.2 | pass (10) | deterministic validator: report_timeframe |
| S2.3 | pass (10) | Routed to PV, matching the ground-truth correct route. |
| S2.4 | pass (8) |  |
| S2.5 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S2.6 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S2.7 | pass (8) | Trainee asked for and obtained consent to contact the HCP/prescriber for follow-up, documented in the safety field. |
| S2.8 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S2.9 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S2.10 | pass (2) | deterministic validator: received_date_match |
| S4.1 | pass (5) | Correct product (Immunexa) selected consistently. |
| S4.2 | pass (5) | Response was based on the approved SRL and no medical advice/clinical management guidance was given regarding the infection. |
| S4.3 | pass (4) | deterministic validator: contact_set_per_case_type |
| S4.4 | pass (4) | Inquiry entered with category and product details in the database record. |
| S4.5 | pass (4) | Response stayed on-inquiry (vaccine timing) and did not volunteer unrelated information. |
| S4.6 | pass (4) | Correct SRL cited and documented in the response field. |
| S4.7 | pass (4) | Response summary and reference are correctly entered. |
| S4.8 | pass (4) | deterministic validator: received_date_match |
| S4.9 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S4.10 | pass (1) | Response delivered verbally by phone, documented appropriately. |
| S4.11 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S4.12 | pass (1) | Category correctly selected as drug interactions, matching ground truth inquiry_category. |
| S4.13 | pass (1) | deterministic validator: required_fields_present |
| S4.14 | pass (1) | deterministic validator: spelling_count |
| S5.1 | na | No off-label question was involved in this case. |
| S5.2 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S5.3 | pass (8) | Response was balanced, factual, and non-promotional, sticking to labeled vaccine-timing guidance. |
| S5.4 | pass (8) | Correct escalation route (PV) selected and documented, matching ground truth correct_routes. |
| S5.5 | na | Caller is the HCP/prescriber herself, not a patient/consumer, so referral-to-HCP is not applicable; trainee still appropriately avoided clinical management advice. |
