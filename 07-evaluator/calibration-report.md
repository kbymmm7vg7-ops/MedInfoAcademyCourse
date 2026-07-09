# Evaluator calibration report (S4)

_Generated 2026-07-09T20:41:29.240Z · model claude-sonnet-5 · eval-prompt-v1 · rubric v1.0_

## Definition-of-done gate

| Gate | Result |
|---|---|
| Gold examples → `pass` | 12/12 ✅ |
| Non-empty `expected_critical_fail` → trips exact Critical(s) | 16/17 ❌ |
| Errors | 0 |
| **Overall DoD** | **❌ NOT MET** |

Deduction fixtures (`expected_critical_fail: []`) are reported below but not gated — they are documented point deductions, not mandated case failures (HANDOFF §7).

## Disagreements & errors (1)

### SC-05-failure-1-admitCausation — MISMATCH
- did NOT trip S5.1 — actual: S5.1=na (overall fail)
- failing criteria:
  - **S1.2**: I'm so sorry — the drug clearly caused this rash.
  - **S1.3**: I'm so sorry — the drug clearly caused this rash.
  - **S2.3**: routing_dual: {route_to_pv: true}, routing_single: ['Legal','Communications','Supervisor']
  - **S4.2**: I'm so sorry — the drug clearly caused this rash.
  - **S4.5**: verbal_answer_given: '...I'm so sorry — the drug clearly caused this rash.'
  - **S4.7**: verbal_answer_given: '...no medical advice was given. I'm so sorry — the drug clearly caused this rash.'
  - **S5.3**: I'm so sorry — the drug clearly caused this rash.

## All results

| Label | Kind | Expected Critical | Overall | Verdict |
|---|---|---|---|---|
| SC-01-gold | gold | (pass) | pass | match |
| SC-01-failure-1-overFlagAe | failure | — | fail | info |
| SC-01-failure-2-wrongSrl | failure | — | fail | info |
| SC-02-gold | gold | (pass) | pass | match |
| SC-02-failure-1-wrongContactSet | failure | — | pass | info |
| SC-02-failure-2-medicalAdvice | failure | S4.2 | fail | match |
| SC-02-failure-3-wrongSrl | failure | — | fail | info |
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
| SC-05-failure-1-admitCausation | failure | S5.1, S4.2 | fail | mismatch |
| SC-05-failure-2-specialSituationMissed | failure | S5.2 | fail | match |
| SC-05-failure-3-admitCausation | failure | — | fail | info |
| SC-05-failure-4-omitLegalComms | failure | — | fail | info |
| SC-06-gold | gold | (pass) | pass | match |
| SC-06-failure-1-offLabelVolunteered | failure | S5.1 | fail | match |
| SC-06-failure-2-wrongSrl | failure | — | fail | info |
| SC-06-failure-3-omitLegalComms | failure | — | fail | info |
| SC-07-gold | gold | (pass) | pass | match |
| SC-07-failure-1-spokespersonStatement | failure | S5.2 | fail | match |
| SC-07-failure-2-spokespersonStatement | failure | — | fail | info |
| SC-07-failure-3-omitLegalComms | failure | — | fail | info |
| SC-08-gold | gold | (pass) | pass | match |
| SC-08-failure-1-missedCue | failure | S2.1 | fail | match |
| SC-08-failure-2-medicalAdvice | failure | S4.2 | fail | match |
| SC-08-failure-3-aeNotDocumented | failure | — | fail | info |
| SC-09-gold | gold | (pass) | pass | match |
| SC-09-failure-1-wrongSrl | failure | — | fail | info |
| SC-09-failure-2-wrongContactSet | failure | — | fail | info |
| SC-09-failure-3-offLabelDosingVolunteered | failure | S5.1 | fail | match |
| SC-10-gold | gold | (pass) | pass | match |
| SC-10-failure-1-medicalAdvice | failure | S4.2 | fail | match |
| SC-10-failure-2-specialSituationMissed | failure | S5.2 | fail | match |
| SC-10-failure-3-overFlagAe | failure | — | fail | info |
| SC-11-gold | gold | (pass) | pass | match |
| SC-11-failure-1-specialSituationMissed | failure | S5.2 | fail | match |
| SC-11-failure-2-medicalAdvice | failure | S4.2 | fail | match |
| SC-11-failure-3-wrongSrl | failure | — | fail | info |
| SC-11-failure-4-overFlagAe | failure | — | fail | info |
| SC-12-gold | gold | (pass) | pass | match |
| SC-12-failure-1-missedCue | failure | S2.1 | fail | match |
| SC-12-failure-2-noPvRouteNotFlaggedSerious | failure | S2.3 | fail | match |
| SC-12-failure-3-wrongSrl | failure | — | fail | info |

## Deduction fixtures (informational)

- `SC-01-failure-1-overFlagAe`: deduction fixture — overall fail; failing: S1.3, S2.1, S2.3, S2.4, S4.4, S4.13, S5.4
- `SC-01-failure-2-wrongSrl`: deduction fixture — overall fail; failing: S4.1, S4.6, S4.7
- `SC-02-failure-1-wrongContactSet`: deduction fixture — overall pass; failing: none
- `SC-02-failure-3-wrongSrl`: deduction fixture — overall fail; failing: S4.2, S4.6, S4.7
- `SC-03-failure-2-aeNotDocumented`: deduction fixture — overall fail; failing: S2.1, S2.4, S4.4
- `SC-03-failure-3-aeNotDocumented`: deduction fixture — overall fail; failing: S2.1, S2.4, S5.4
- `SC-04-failure-3-missingPcIdentifiers`: deduction fixture — overall fail; failing: S3.6
- `SC-04-failure-4-noRetrieval`: deduction fixture — overall pass; failing: none
- `SC-05-failure-3-admitCausation`: deduction fixture — overall fail; failing: S1.2, S2.3, S4.2, S4.5, S4.7, S5.3
- `SC-05-failure-4-omitLegalComms`: deduction fixture — overall fail; failing: S2.3, S4.10, S5.4
- `SC-06-failure-2-wrongSrl`: deduction fixture — overall fail; failing: S4.2, S4.7
- `SC-06-failure-3-omitLegalComms`: deduction fixture — overall fail; failing: S5.4
- `SC-07-failure-2-spokespersonStatement`: deduction fixture — overall fail; failing: S1.3, S4.2, S4.7, S4.10, S5.2, S5.3, S5.4
- `SC-07-failure-3-omitLegalComms`: deduction fixture — overall fail; failing: S5.4
- `SC-08-failure-3-aeNotDocumented`: deduction fixture — overall fail; failing: S2.1, S2.4
- `SC-09-failure-1-wrongSrl`: deduction fixture — overall fail; failing: S4.1, S4.6, S4.7, S4.10
- `SC-09-failure-2-wrongContactSet`: deduction fixture — overall fail; failing: S4.3, S4.10
- `SC-10-failure-3-overFlagAe`: deduction fixture — overall fail; failing: S1.3, S2.1, S2.4, S4.5
- `SC-11-failure-3-wrongSrl`: deduction fixture — overall fail; failing: S4.7
- `SC-11-failure-4-overFlagAe`: deduction fixture — overall fail; failing: S1.3, S2.1, S2.4, S4.5, S4.7
- `SC-12-failure-3-wrongSrl`: deduction fixture — overall fail; failing: S4.2, S4.6, S4.7

---

# Blind-scoring appendix (for Nathan)

Score each GOLD case yourself from the transcript + documentation **before** reading the evaluator's verdicts in Part B. The gate: **zero Critical-criterion disagreements, ≤1 Major disagreement per case.** 12 gold outputs below; the JSON report holds all 50 outputs (incl. failure fixtures) with full per-criterion evidence.

## Part A — cases to score (verdicts hidden)

### A1. SC-01 (gold · voice)

**Transcript**

1. **trainee**: Thank you for calling Medical Information, this is Alex Reed speaking. How can I help you today?
2. **persona**: Identifies herself as a physician, states the patient is stable on Cardizan.
3. **trainee**: Happy to help with that. Could I get your name, and are you calling as a healthcare provider, caregiver, or on your own behalf?
4. **persona**: Sure — this is Dr. Amara Chen, family physician (HCP). My callback number is (555) 0182-4471.
5. **trainee**: Based on SRL-CDZ-INR, here's what our approved information says about your question on Cardizan: several antibiotic classes (e.g., macrolides, fluoroquinolones) can potentiate the INR effect per the prescribing information.
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
    "ae_present": "no",
    "four_element_test": {
      "identifiable_patient": false,
      "identifiable_reporter": false,
      "suspect_product": false,
      "event": false
    },
    "ae_description": "",
    "onset_date": "",
    "ongoing": "",
    "seriousness": [],
    "pc_present": "no",
    "pc_lot_number": "",
    "pc_expiration_date": "",
    "pc_ndc": "",
    "pc_sample_available": "",
    "pregnancy_or_lactation": false,
    "special_situations": [],
    "routing_dual": {
      "route_to_pv": false,
      "route_to_quality": false
    },
    "routing_single": [],
    "routed_within_timeframe_date": ""
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
5. **trainee**: Based on SRL-GAS-ONSET, here's what our approved information says about your question on Gastroquell: full symptom relief typically takes several days of consistent dosing; I'd encourage keeping to the regimen and checking with your pharmacist before changing the dose.
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
    "ae_present": "no",
    "four_element_test": {
      "identifiable_patient": false,
      "identifiable_reporter": false,
      "suspect_product": false,
      "event": false
    },
    "ae_description": "",
    "onset_date": "",
    "ongoing": "",
    "seriousness": [],
    "pc_present": "no",
    "pc_lot_number": "",
    "pc_expiration_date": "",
    "pc_ndc": "",
    "pc_sample_available": "",
    "pregnancy_or_lactation": false,
    "special_situations": [],
    "routing_dual": {
      "route_to_pv": false,
      "route_to_quality": false
    },
    "routing_single": [],
    "routed_within_timeframe_date": ""
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
    "four_element_test": {
      "identifiable_patient": true,
      "identifiable_reporter": true,
      "suspect_product": true,
      "event": true
    },
    "ae_description": "Tremor and palpitations, onset ~1 week after Pulmonara initiation, ongoing.",
    "onset_date": "",
    "ongoing": "yes",
    "seriousness": [],
    "pc_present": "no",
    "pc_lot_number": "",
    "pc_expiration_date": "",
    "pc_ndc": "",
    "pc_sample_available": "",
    "pregnancy_or_lactation": false,
    "special_situations": [],
    "routing_dual": {
      "route_to_pv": false,
      "route_to_quality": false
    },
    "routing_single": [
      "PV"
    ],
    "routed_within_timeframe_date": "2026-07-06"
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
    "four_element_test": {
      "identifiable_patient": true,
      "identifiable_reporter": true,
      "suspect_product": true,
      "event": true
    },
    "ae_description": "Perioral tingling and numbness (possible hypocalcemia), onset hours after Osteveda injection.",
    "onset_date": "",
    "ongoing": "no",
    "seriousness": [],
    "pc_present": "yes",
    "pc_lot_number": "LOT-CALIB-0001",
    "pc_expiration_date": "2027-06-30",
    "pc_ndc": "0000-0000-01",
    "pc_sample_available": "yes",
    "pregnancy_or_lactation": false,
    "special_situations": [],
    "routing_dual": {
      "route_to_pv": true,
      "route_to_quality": true
    },
    "routing_single": [],
    "routed_within_timeframe_date": "2026-07-06"
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
9. **trainee**: Based on SRL-NEU-RASH, here's what our approved information says about your question on Neurovance: the approved prescribing information addresses this directly.
10. **persona**: That's helpful, thank you.
11. **trainee**: For any decisions about your treatment or dosing, please check with your prescribing physician — I'm not able to advise on that directly.
12. **persona**: Understood, I'll follow up with them.
13. **trainee**: Is there anything else I can help you with today?
14. **persona**: No, that covers it — thank you for your help.
15. **trainee**: Thank you for calling Medical Information. Have a good day.

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
    "four_element_test": {
      "identifiable_patient": true,
      "identifiable_reporter": true,
      "suspect_product": true,
      "event": true
    },
    "ae_description": "Blistering rash with mouth sores, hospitalized, possible SJS; onset ~2 weeks after starting Neurovance. Serious AE.",
    "onset_date": "",
    "ongoing": "no",
    "seriousness": [
      "hospitalization"
    ],
    "pc_present": "no",
    "pc_lot_number": "",
    "pc_expiration_date": "",
    "pc_ndc": "",
    "pc_sample_available": "",
    "pregnancy_or_lactation": false,
    "special_situations": [
      "legal",
      "media"
    ],
    "routing_dual": {
      "route_to_pv": true,
      "route_to_quality": false
    },
    "routing_single": [
      "Legal",
      "Communications",
      "Supervisor"
    ],
    "routed_within_timeframe_date": "2026-07-06"
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
6. **trainee**: I understand you're trying to help your customer, but I'm not able to share efficacy data for an unapproved use — Immunexa is only approved for RA. I'll route this to Medical Affairs, and if the dermatologist has a genuine question, that needs to come through our approved unsolicited-request process.
7. **persona**: Okay, understood — go ahead and route it.
8. **trainee**: As I mentioned, I'm not able to provide off-label efficacy data — I've routed this to Medical Affairs.
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
    "four_element_test": {
      "identifiable_patient": false,
      "identifiable_reporter": false,
      "suspect_product": false,
      "event": false
    },
    "ae_description": "",
    "onset_date": "",
    "ongoing": "",
    "seriousness": [],
    "pc_present": "no",
    "pc_lot_number": "",
    "pc_expiration_date": "",
    "pc_ndc": "",
    "pc_sample_available": "",
    "pregnancy_or_lactation": false,
    "special_situations": [],
    "routing_dual": {
      "route_to_pv": false,
      "route_to_quality": false
    },
    "routing_single": [
      "Medical Affairs"
    ],
    "routed_within_timeframe_date": ""
  },
  "response": {
    "selected_srl_id": "",
    "customization_notes": "Answered per SC-06 gold documentation example.",
    "delivery_method": "phone",
    "verbal_answer_given": "Declined to provide off-label information for Immunexa; explained MI cannot support off-label promotional requests and routed to Medical Affairs."
  },
  "closure": {
    "follow_up_needed": "no",
    "follow_up_scheduled_date": "",
    "outstanding_info": "",
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
7. **trainee**: I'm not able to speak on the record or characterize the warning beyond what's in the approved labeling. I'll have our Corporate Communications team follow up with you directly — can I get the best contact for you and your outlet?
8. **persona**: The Meridian Health Desk, same number I called from.
9. **trainee**: I've routed your inquiry to Corporate Communications, who will follow up with an approved statement.
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
    "four_element_test": {
      "identifiable_patient": false,
      "identifiable_reporter": false,
      "suspect_product": false,
      "event": false
    },
    "ae_description": "",
    "onset_date": "",
    "ongoing": "",
    "seriousness": [],
    "pc_present": "no",
    "pc_lot_number": "",
    "pc_expiration_date": "",
    "pc_ndc": "",
    "pc_sample_available": "",
    "pregnancy_or_lactation": false,
    "special_situations": [
      "media"
    ],
    "routing_dual": {
      "route_to_pv": false,
      "route_to_quality": false
    },
    "routing_single": [
      "Communications",
      "Supervisor"
    ],
    "routed_within_timeframe_date": "2026-07-06"
  },
  "response": {
    "selected_srl_id": "",
    "customization_notes": "Answered per SC-07 gold documentation example.",
    "delivery_method": "phone",
    "verbal_answer_given": "Declined to comment as an unauthorized spokesperson, made no causation statement, and routed the media inquiry to Corporate Communications."
  },
  "closure": {
    "follow_up_needed": "no",
    "follow_up_scheduled_date": "",
    "outstanding_info": "",
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
10. **trainee**: Based on SRL-DRM-APPLY, here's what our approved information says about your question on Dermelia: typical duration of use is per your prescriber's instructions, and any worsening skin reaction should be evaluated by them promptly.
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
    "four_element_test": {
      "identifiable_patient": true,
      "identifiable_reporter": true,
      "suspect_product": true,
      "event": true
    },
    "ae_description": "Persistent application-site burning and a spreading rash beyond the treated area, ~5 days, worsening.",
    "onset_date": "",
    "ongoing": "no",
    "seriousness": [],
    "pc_present": "no",
    "pc_lot_number": "",
    "pc_expiration_date": "",
    "pc_ndc": "",
    "pc_sample_available": "",
    "pregnancy_or_lactation": false,
    "special_situations": [],
    "routing_dual": {
      "route_to_pv": false,
      "route_to_quality": false
    },
    "routing_single": [
      "PV"
    ],
    "routed_within_timeframe_date": "2026-07-06"
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
    "four_element_test": {
      "identifiable_patient": false,
      "identifiable_reporter": false,
      "suspect_product": false,
      "event": false
    },
    "ae_description": "",
    "onset_date": "",
    "ongoing": "",
    "seriousness": [],
    "pc_present": "no",
    "pc_lot_number": "",
    "pc_expiration_date": "",
    "pc_ndc": "",
    "pc_sample_available": "",
    "pregnancy_or_lactation": false,
    "special_situations": [],
    "routing_dual": {
      "route_to_pv": false,
      "route_to_quality": false
    },
    "routing_single": [],
    "routed_within_timeframe_date": ""
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
7. **trainee**: Based on SRL-NEU-PREG, here's what our approved information says about your question on Neurovance: there's a pregnancy exposure registry for Neurovance, and any decision about continuing or stopping needs to be made with your prescriber given the risks of abrupt discontinuation.
8. **persona**: That's helpful, thank you.
9. **trainee**: For any decisions about your treatment or dosing, please check with your prescribing physician — I'm not able to advise on that directly.
10. **persona**: Understood, I'll follow up with them.
11. **trainee**: Is there anything else I can help you with today?
12. **persona**: No, that covers it — thank you for your help.
13. **trainee**: Thank you for calling Medical Information. Have a good day.

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
    "ae_present": "no",
    "four_element_test": {
      "identifiable_patient": false,
      "identifiable_reporter": false,
      "suspect_product": false,
      "event": false
    },
    "ae_description": "",
    "onset_date": "",
    "ongoing": "",
    "seriousness": [],
    "pc_present": "no",
    "pc_lot_number": "",
    "pc_expiration_date": "",
    "pc_ndc": "",
    "pc_sample_available": "",
    "pregnancy_or_lactation": true,
    "special_situations": [
      "pregnancy_exposure"
    ],
    "routing_dual": {
      "route_to_pv": false,
      "route_to_quality": false
    },
    "routing_single": [
      "PV"
    ],
    "routed_within_timeframe_date": "2026-07-06"
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
7. **persona**: It's been going on for a little while now, honestly.
8. **trainee**: I'd like to make sure this gets captured for our safety team, and with your permission I may need to reach out to the prescriber for more detail. Is that all right?
9. **persona**: Yes, that's fine — go ahead.
10. **trainee**: For disposal of unused Cardizan, the safest approach is a pharmacy take-back program, or following FDA disposal guidance if take-back isn't available — I can't advise on the dose itself, so please direct any INR or dosing questions to your prescriber.
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
    "ae_present": "no",
    "four_element_test": {
      "identifiable_patient": false,
      "identifiable_reporter": false,
      "suspect_product": false,
      "event": false
    },
    "ae_description": "",
    "onset_date": "",
    "ongoing": "",
    "seriousness": [],
    "pc_present": "no",
    "pc_lot_number": "",
    "pc_expiration_date": "",
    "pc_ndc": "",
    "pc_sample_available": "",
    "pregnancy_or_lactation": false,
    "special_situations": [
      "lack_of_effect"
    ],
    "routing_dual": {
      "route_to_pv": false,
      "route_to_quality": false
    },
    "routing_single": [
      "PV"
    ],
    "routed_within_timeframe_date": "2026-07-06"
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
    "four_element_test": {
      "identifiable_patient": true,
      "identifiable_reporter": true,
      "suspect_product": true,
      "event": true
    },
    "ae_description": "Hospitalization for a serious infection (pneumonia) while on Immunexa, a known serious risk of the TNF-class. Serious AE.",
    "onset_date": "",
    "ongoing": "no",
    "seriousness": [
      "hospitalization"
    ],
    "pc_present": "no",
    "pc_lot_number": "",
    "pc_expiration_date": "",
    "pc_ndc": "",
    "pc_sample_available": "",
    "pregnancy_or_lactation": false,
    "special_situations": [],
    "routing_dual": {
      "route_to_pv": false,
      "route_to_quality": false
    },
    "routing_single": [
      "PV"
    ],
    "routed_within_timeframe_date": "2026-07-06"
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

> This was a clean, low-complexity HCP drug-interaction inquiry (Cardizan & INR) with no AE/PC or special situation triggers. Alex opened professionally, stated his name, captured the HCP's identity and contact details efficiently, and delivered the correct SRL-cited response (SRL-CDZ-INR) without volunteering off-label or promotional content. Documentation was complete, accurate, and free of spelling errors, with the correct product, category, and contact fields all populated per the fixed validator findings.

| Criterion | Result | Evidence / rationale |
|---|---|---|
| S1.1 | pass (3) | Thank you for calling Medical Information, this is Alex Reed speaking. |
| S1.2 | pass (3) | Happy to help with that. |
| S1.3 | pass (3) | Could I get your name, and are you calling as a healthcare provider, caregiver, or on your own behalf? |
| S1.4 | na |  |
| S1.5 | pass (4) | Based on SRL-CDZ-INR, here's what our approved information says... |
| S4.1 | pass (5) | Correct product Cardizan selected and referenced throughout. |
| S4.2 | pass (5) | Response was based on the approved SRL and contained no medical advice, consistent with correct_srl. |
| S4.3 | pass (4) | deterministic validator: contact_set_per_case_type |
| S4.4 | pass (4) | Inquiry entered with correct category, product, and summary in documentation. |
| S4.5 | pass (4) | Response stayed on-topic to the interaction question without volunteering unrelated information. |
| S4.6 | pass (4) | Correct SRL (SRL-CDZ-INR) was cited verbally and documented in the response field, matching the correct_srl in the answer key. |
| S4.7 | pass (4) | Response summary and reference to the SRL were documented adequately for a clean, low-detail inquiry. |
| S4.8 | pass (4) | deterministic validator: received_date_match |
| S4.9 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S4.10 | pass (1) | Response route (phone) is appropriate and documented, matching the voice channel. |
| S4.11 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S4.12 | pass (1) | Case question category correctly selected as Drug-Interactions, matching the ground truth inquiry_category. |
| S4.13 | pass (1) | deterministic validator: required_fields_present |
| S4.14 | pass (1) | deterministic validator: spelling_count |
| S5.1 | na | No off-label information was requested or volunteered in this case; ground truth confirms off_label_involved is false. |
| S5.2 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S5.3 | pass (8) | Response was factual, balanced, and non-promotional, drawn directly from the approved SRL. |
| S5.4 | na | No escalation was required since there is no AE/PC or special situation in this case. |
| S5.5 | na | The HCP's question was a straightforward drug-interaction information request, not a medical-advice-adjacent question requiring referral to the patient's own HCP (caller IS the HCP). |

### B2. SC-02 — evaluator says: **PASS**

> Overall a solid, compliant handling of an ambiguous-requester efficacy inquiry. AE/PC Detection: not applicable here — no AE/PC cues were present, and the trainee correctly did not fabricate any. Questioning Technique (S1.3): the trainee used one clean, non-probing clarifying question to establish requester type ('are you calling as a healthcare provider, caregiver, or on your own behalf?'), which correctly surfaced that the clinical-sounding caller was actually a patient — good listen-and-clarify practice without over-probing. Compliance (S5.1/S5.3): no off-label material was raised, and the response was balanced, sourced from the correct SRL (SRL-GAS-ONSET), and free of promotional language. Documentation: all required fields were completed accurately (requester type, contact, product, SRL, route), received date matched, and only a trivial verbatim transcription artifact ('isn') appeared, which is sourced directly from the caller's cut-off statement and not a true trainee error. Empathy (S1.2): tone was professional and warm throughout with a proper opening/closing. Regulatory risk: none identified — the trainee appropriately redirected the dosing question to the pharmacist rather than giving direct medical advice, satisfying S5.5.

| Criterion | Result | Evidence / rationale |
|---|---|---|
| S1.1 | pass (3) | Thank you for calling Medical Information, this is Alex Reed speaking. |
| S1.2 | pass (3) | Happy to help with that. |
| S1.3 | pass (3) | Could I get your name, and are you calling as a healthcare provider, caregiver, or on your own behalf? |
| S1.4 | na |  |
| S1.5 | pass (3) | N/A - no jargon present in trainee's lines. |
| S4.1 | pass (5) | Correct product (Gastroquell) selected and referenced. |
| S4.2 | pass (5) | Response cited approved SRL and avoided medical advice, redirecting to pharmacist for dosing. |
| S4.3 | pass (4) | deterministic validator: contact_set_per_case_type |
| S4.4 | pass (4) | Inquiry logged into database with category and summary fields. |
| S4.5 | pass (4) | Response stayed on-inquiry, addressed onset timing, and did not volunteer unrelated information. |
| S4.6 | pass (4) | Correct SRL was cited and recorded in the documentation as required by the answer key. |
| S4.7 | pass (4) | Response summary and reference (SRL) correctly entered with appropriate detail level. |
| S4.8 | pass (4) | deterministic validator: received_date_match |
| S4.9 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S4.10 | pass (1) | Response route (phone, verbal) is appropriate and documented in delivery_method field. |
| S4.11 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S4.12 | pass (1) | Case correctly categorized as Efficacy inquiry, matching the ground truth inquiry category. |
| S4.13 | pass (1) | deterministic validator: required_fields_present |
| S4.14 | pass (1) | deterministic validator: spelling_count |
| S5.1 | na | No off-label information was requested or discussed in this case; off_label_involved is false in the ground truth. |
| S5.2 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S5.3 | pass (8) | Response was balanced, factual, and non-promotional, focused on approved label information. |
| S5.4 | na | No escalation was required for this case (no AE/PC/special situation); routing fields are appropriately empty. |
| S5.5 | pass (2) | Trainee appropriately referred the patient to their pharmacist for dose-related decisions instead of giving medical advice. |

### B3. SC-03 — evaluator says: **PASS**

> Strong performance on AE/PC Detection: the trainee correctly caught the caller's offhand volunteered cue ('s been a bit shaky lately') and clarified it appropriately without cold-probing for symptoms — this is exactly the listen-and-clarify skill the SOP requires, and it surfaced a real AE (tremor + palpitations) that was then correctly documented and routed to PV within the SOP timeframe. Compliance handling was clean: consent to contact the HCP was obtained, no medical advice was given regarding tremor management, and the response stayed on-inquiry using the correct SRL (SRL-PUL-CANDID). Contact info, product selection, category, and dates were all captured correctly.

The one gap is in Documentation: the resolution/closure fields do not capture clear follow-up notes on the AE's disposition (e.g., pending HCP contact, next steps) beyond a generic checklist — in a live QA environment this could create ambiguity for the safety team reviewing case status later. Recommend adding a brief resolution note whenever an AE is routed with pending HCP follow-up, even when the checklist box is ticked.

| Criterion | Result | Evidence / rationale |
|---|---|---|
| S1.1 | pass (3) | TRAINEE: 'this is Alex Reed speaking.' |
| S1.2 | pass (3) | TRAINEE: 'Happy to help with that.' |
| S1.3 | pass (4) | TRAINEE: 'Before we go further — you mentioned "s been a bit shaky lately, but that" a moment ago. Can you tell me more about that: when it started, and whether it's still happening?' |
| S1.4 | na |  |
| S1.5 | pass (3) | No slang, jargon, or acronyms used in trainee's dialogue. |
| S2.1 | pass (10) | AE correctly identified from volunteered cue and documented, matching ground truth. |
| S2.2 | pass (10) | deterministic validator: report_timeframe |
| S2.3 | pass (10) | Routed to correct department per ground truth. |
| S2.4 | pass (8) |  |
| S2.5 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S2.6 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S2.7 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S2.8 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S2.9 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S2.10 | pass (2) | deterministic validator: received_date_match |
| S4.1 | pass (5) | Correct product selected matching case. |
| S4.2 | pass (5) | Response based on SRL, no medical advice given regarding tremor management. |
| S4.3 | pass (4) | deterministic validator: contact_set_per_case_type |
| S4.4 | pass (4) | Both the general inquiry and safety event are captured in the database. |
| S4.5 | pass (4) | Response stayed on-inquiry, concise, no unsolicited extra information volunteered. |
| S4.6 | pass (4) | Correct SRL cited and documented matching ground truth correct_srl. |
| S4.7 | pass (4) | Response correctly entered with reference cited. |
| S4.8 | pass (4) | deterministic validator: received_date_match |
| S4.9 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S4.10 | pass (1) | Response route (phone, matching call channel) appropriately documented. |
| S4.11 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S4.12 | pass (1) | Category selected matches ground truth inquiry_category 'other'. |
| S4.13 | pass (1) | deterministic validator: required_fields_present |
| S4.14 | pass (1) | deterministic validator: spelling_count |
| S5.1 | na |  |
| S5.2 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S5.3 | pass (8) | Response balanced, non-promotional, factual administration guidance only. |
| S5.4 | pass (8) | Correct escalation route (PV) selected and documented matching correct_routes. |
| S5.5 | pass (2) | Caller appropriately directed toward HCP involvement for the AE/tremor issue rather than receiving treatment advice from MI. |

### B4. SC-04 — evaluator says: **PASS**

> Strong overall handling of a complex dual-routing case. AE/PC Detection (S2.1/S3.1): both the volunteered PC (cloudy solution, bent needle) and the AE (perioral tingling/numbness) were correctly caught and clarified rather than solicited — excellent listen-and-clarify technique (Questioning Technique, S1.3). Compliance (S5.1/S5.3) was clean: no medical advice given, caller was properly referred to HCP for urgent evaluation, and the response stayed non-promotional and on-inquiry. Regulatory risk was well managed — correct SRL selected, correct dual routing to PV and Quality documented, and consent to contact HCP obtained verbally. Empathy (S1.2) was appropriate and professional throughout.

Documentation is the main gap: while the AE/PC descriptions, identifiers, and routing were captured well, the resolution/closure fields lack narrative substance — outstanding_info and completion notes were left blank or generic, so a QA reviewer would not be able to confirm what final disposition or follow-up (e.g., retrieval kit, replacement decision, HCP callback outcome) was communicated to the caller. In a live environment this could delay case closure or create ambiguity for the safety/quality teams reviewing the file.

| Criterion | Result | Evidence / rationale |
|---|---|---|
| S1.1 | pass (3) | Thank you for calling Medical Information, this is Alex Reed speaking. |
| S1.2 | pass (3) | Professional, pleasant tone throughout; acknowledged and reassured caller without condescension. |
| S1.3 | pass (3) | Before we go further — you mentioned ... Can you tell me more about that: when it started, and whether it's still happening? |
| S1.4 | na |  |
| S1.5 | pass (3) | No slang/jargon/acronyms used; language was clear and plain. |
| S2.1 | pass (10) | AE (perioral tingling/numbness, possible hypocalcemia) was identified matching ground truth and documented in Safety tab. |
| S2.2 | pass (10) | deterministic validator: report_timeframe |
| S2.3 | pass (10) | Routed to both PV and Quality as required for dual routing case. |
| S2.4 | pass (8) |  |
| S2.5 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S2.6 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S2.7 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S2.8 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S2.9 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S2.10 | pass (2) | deterministic validator: received_date_match |
| S3.1 | pass (10) | PC (cloudy solution, bent needle) correctly identified and documented. |
| S3.2 | pass (10) | deterministic validator: report_timeframe |
| S3.3 | pass (10) | Routed to Quality as required. |
| S3.4 | pass (8) | PC details (cloudy solution, bent needle, used anyway) documented clearly and sequentially in inquiry summary. |
| S3.5 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S3.6 | pass (8) | deterministic validator: pc_identifiers |
| S3.7 | pass (8) | Suspect product availability documented as 'yes'. |
| S3.8 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S3.9 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S3.10 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S3.11 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S3.12 | pass (2) | deterministic validator: received_date_match |
| S4.1 | pass (5) | Correct product 'Osteveda' selected. |
| S4.2 | pass (5) | Response cited SRL-OST-HYPOCAL and referred to HCP for urgent evaluation; no medical advice given. |
| S4.3 | pass (4) | deterministic validator: contact_set_per_case_type |
| S4.4 | pass (4) | Both AE and PC requests entered into database with appropriate fields. |
| S4.5 | pass (4) | Response stayed on-inquiry, referring to HCP without volunteering unrelated info. |
| S4.6 | pass (4) | Correct SRL (SRL-OST-HYPOCAL) documented in response field matching ground truth. |
| S4.7 | pass (4) | Response summary and reference correctly entered with appropriate detail level. |
| S4.8 | pass (4) | deterministic validator: received_date_match |
| S4.9 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S4.10 | pass (1) | Response route (phone) documented and appropriate for voice channel. |
| S4.11 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S4.12 | pass (1) | Inquiry category 'Other' selected, consistent with case ground truth. |
| S4.13 | pass (1) | deterministic validator: required_fields_present |
| S4.14 | pass (1) | deterministic validator: spelling_count |
| S5.1 | na |  |
| S5.2 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S5.3 | pass (8) | Response was balanced, non-promotional, focused on safety referral. |
| S5.4 | pass (8) | Correct dual escalation route (PV + Quality) documented in routing fields. |
| S5.5 | pass (2) | Caller appropriately referred to HCP for the medical-advice-adjacent hypocalcemia symptom. |

### B5. SC-05 — evaluator says: **PASS**

> Strong high-difficulty performance overall. AE/PC Detection: the trainee correctly caught the serious AE (blistering rash, mouth sores, hospitalization, possible SJS) and both special situations (legal, media) exactly as the caller volunteered them — no fishing, no fabrication. Questioning Technique: excellent listen-and-clarify approach — asked only for requester type/name, did not probe for symptoms, and let the caller's own account surface the clinical detail after de-escalation, exactly per the reveal-rule design. Compliance: exemplary regulatory discipline — refused to confirm causation, refused to give treatment/dosing advice, and redirected to the treating physician, all while remaining empathetic and non-defensive under a hostile, threatening opening. Documentation: contact info, product, AE description, seriousness, special situations, SRL citation, and dual/legal/communications/supervisor routing were all captured correctly and within the SOP timeframe. The one gap is the missing AE resolution/completion note in the closure section — the checklist booleans are present but there's no narrative describing case disposition, which in a live QA environment would be flagged since auditors expect a clear closing statement per AE record, not just checkbox confirmation.

| Criterion | Result | Evidence / rationale |
|---|---|---|
| S1.1 | pass (4) | "this is Alex Reed speaking" |
| S1.2 | pass (4) | "I hear how frightening this has been, and I want to make sure your mother gets the right care." |
| S1.3 | pass (4) | "Could I get your name, and are you calling as a healthcare provider, caregiver, or on your own behalf?" |
| S1.4 | na |  |
| S1.5 | pass (4) | Full transcript contains no jargon or acronyms. |
| S2.1 | pass (10) | AE (serious rash/possible SJS, hospitalization) identified and documented consistent with ground truth. |
| S2.2 | pass (10) | deterministic validator: report_timeframe |
| S2.3 | pass (10) | Routed to PV, Legal, Communications, Supervisor per dual routing requirement matching ground truth correct_routes. |
| S2.4 | pass (8) | AE description is clear, concise, and sequential, matching the ground-truth clinical picture. |
| S2.5 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S2.6 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S2.7 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S2.8 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S2.9 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S2.10 | pass (2) | deterministic validator: received_date_match |
| S4.1 | pass (5) | Correct product Neurovance selected. |
| S4.2 | pass (5) | Response based on SRL-NEU-RASH (correct SRL) with no medical advice; causation and treatment questions deflected to HCP. |
| S4.3 | pass (4) | deterministic validator: contact_set_per_case_type |
| S4.4 | pass (4) | MI request (safety inquiry) correctly entered with category Safety and full inquiry summary. |
| S4.5 | pass (4) | Response stayed on-inquiry, referring to SRL and HCP without volunteering extraneous information. |
| S4.6 | pass (4) | Correct SRL (SRL-NEU-RASH) documented in response field, matching ground truth correct_srl. |
| S4.7 | pass (4) | Response summary and reference (SRL) correctly entered in documentation. |
| S4.8 | pass (4) | deterministic validator: received_date_match |
| S4.9 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S4.10 | pass (1) | Response route (phone) documented appropriately and matches delivery method used during call. |
| S4.11 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S4.12 | pass (1) | Case category correctly selected as Safety, matching the AE nature of the inquiry. |
| S4.13 | pass (1) | deterministic validator: required_fields_present |
| S4.14 | pass (1) | deterministic validator: spelling_count |
| S5.1 | na |  |
| S5.2 | pass (10) | Legal and media special situations correctly identified and flagged, matching ground truth. |
| S5.3 | pass (8) | No promotional language; balanced, compliant response avoiding fault admission or causation claims. |
| S5.4 | pass (8) | Escalation routes (PV, Legal, Communications, Supervisor) documented in routing fields matching ground truth correct_routes. |
| S5.5 | pass (2) | Caller appropriately referred to treating physician for causation and treatment/dosing questions. |

### B6. SC-06 — evaluator says: **PASS**

> Strong performance on the core compliance trap this case is designed to test. AE/PC Detection: correctly identified no AE/PC signals were present (none were raised) — no fabrication, no missed cues. Questioning Technique (S1.3): appropriately clarified the caller's role/identity upfront without over-probing, and caught the off-label cue naturally as the caller raised it. Compliance (S5.1/S5.3): this is the standout strength — held the line firmly and politely when the rep pushed for 'off the record' efficacy info, correctly explained MI cannot support off-label promotional sharing, and routed to Medical Affairs rather than engaging in back-channel disclosure. Documentation: all required fields (requester_type, contact, product, inquiry summary, off_label_flag equivalent via routing, response_route) were captured cleanly and the routing field correctly reflects Medical Affairs as escalation target. Empathy (S1.2): acknowledged the rep's motivation ('trying to help your customer') while still declining, which is the right tone — firm but not dismissive. Regulatory risk: no off-label data was leaked at any point in the call or in documentation notes, which is the single highest-stakes risk in this case and it was fully avoided.

| Criterion | Result | Evidence / rationale |
|---|---|---|
| S1.1 | pass (4) | Thank you for calling Medical Information, this is Alex Reed speaking. |
| S1.2 | pass (3) | I understand you're trying to help your customer, but I'm not able to share efficacy data for an unapproved use |
| S1.3 | pass (4) | Could I get your name, and are you calling as a healthcare provider, caregiver, or on your own behalf? |
| S1.4 | na |  |
| S1.5 | pass (4) | I'm not able to provide off-label efficacy data — I've routed this to Medical Affairs. |
| S4.1 | pass (5) | Correct product (Immunexa) selected and documented. |
| S4.2 | pass (5) | No medical advice or off-label data given; response grounded in compliance policy, not promotional/clinical claims. |
| S4.3 | pass (4) | deterministic validator: contact_set_per_case_type |
| S4.4 | pass (4) | Inquiry entered with correct category (Efficacy), requester type, and product in documentation. |
| S4.5 | pass (4) | Response stayed on-inquiry, declined off-label ask, volunteered nothing beyond the compliance explanation and routing. |
| S4.6 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S4.7 | pass (4) | Response summary and verbal answer correctly reflect the decline-and-route handling with no fabricated detail level or references needed. |
| S4.8 | pass (4) | deterministic validator: received_date_match |
| S4.9 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S4.10 | pass (1) | Response route (phone, routed to Medical Affairs) is appropriate and documented in routing_single field. |
| S4.11 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S4.12 | pass (1) | Inquiry category 'Efficacy' correctly selected matching the nature of the request. |
| S4.13 | pass (1) | deterministic validator: required_fields_present |
| S4.14 | pass (1) | deterministic validator: spelling_count |
| S5.1 | pass (10) | Trainee correctly declined to volunteer off-label efficacy data despite mild pushback from the internal rep, explained the compliance boundary, and routed via Medical Affairs rather than answering promotionally. |
| S5.2 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S5.3 | pass (8) | No promotional language used; response was balanced, factual about approved indication only (RA), and non-promotional. |
| S5.4 | pass (8) | Correct escalation route (Medical Affairs) selected and documented in routing_single field, consistent with correct_routes in the answer key. |
| S5.5 | na | No medical-advice-adjacent question from a patient/consumer was raised; caller was an internal sales rep relaying a third-party derm's interest, not seeking personal medical advice, so HCP referral is not triggered. |

### B7. SC-07 — evaluator says: **PASS**

> Strong handling of a high-difficulty media edge case. AE/PC Detection: correctly identified no AE/PC present and properly flagged the 'media' special situation (S5.2) rather than mistaking the boxed-warning discussion for a reportable AE — good judgment avoiding over-flagging. Questioning Technique (S1.3): trainee listened for the core cue (journalist calling for comment) and clarified requester type and outlet without probing beyond what was needed, exactly the listen-and-clarify skill expected. Compliance (S5.1/S5.3): excellent restraint — declined to comment or confirm causation, avoided becoming an unauthorized spokesperson, and used no promotional language. Regulatory risk (S5 criticals): correctly triaged and routed to Communications/Supervisor, matching the required dual-route destinations, minimizing legal/PR risk. Documentation: all required fields (contact, special situation flags, routing, summary) were completed accurately and matched the verbal handling; no spelling issues, correct product and dates recorded.

| Criterion | Result | Evidence / rationale |
|---|---|---|
| S1.1 | pass (4) | Thank you for calling Medical Information, this is Alex Reed speaking. |
| S1.2 | pass (3) | I'm not able to speak on the record or characterize the warning beyond what's in the approved labeling. |
| S1.3 | pass (3) | Could I get your name, and are you calling as a healthcare provider, caregiver, or on your own behalf? |
| S1.4 | na |  |
| S1.5 | pass (4) | I'll have our Corporate Communications team follow up with you directly |
| S4.1 | pass (5) | Correct fictional product Dermelia selected and documented. |
| S4.2 | pass (5) | No medical advice or causation statement given; response limited to compliance-safe language based on approved process. |
| S4.3 | pass (4) | deterministic validator: contact_set_per_case_type |
| S4.4 | pass (4) | Inquiry properly logged as a media/safety category request with summary captured. |
| S4.5 | pass (4) | Trainee's response was concise, stayed on-topic (routing to Communications) without volunteering extra information. |
| S4.6 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S4.7 | pass (4) | Response summary accurately reflects the verbal handling given (decline to comment, no causation, routed to Communications) with no fabricated detail. |
| S4.8 | pass (4) | deterministic validator: received_date_match |
| S4.9 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S4.10 | pass (1) | Response route (Communications/Supervisor) documented and appropriate for a media contact. |
| S4.11 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S4.12 | pass (1) | Case correctly categorized as Safety/media inquiry. |
| S4.13 | pass (1) | deterministic validator: required_fields_present |
| S4.14 | pass (1) | deterministic validator: spelling_count |
| S5.1 | na | No off-label information was requested or volunteered in this case; the exchange centered on a labeled boxed warning/media handling, not off-label use. |
| S5.2 | pass (10) | Trainee correctly identified the media special situation and flagged/routed it appropriately. |
| S5.3 | pass (8) | No promotional language used; trainee firmly declined to make causation claims or act as spokesperson. |
| S5.4 | pass (8) | Correct escalation route (Communications, Supervisor) selected and documented matching the required correct_routes. |
| S5.5 | na | No medical-advice-adjacent patient question was posed; this was a media/press inquiry, not a patient/consumer medical question requiring HCP referral. |

### B8. SC-08 — evaluator says: **PASS**

> Strong performance overall. AE/PC Detection (S2.1/S5.2): Excellent — the trainee caught the volunteered 'stings' cue rather than ignoring it or fabricating additional symptoms, correctly surfacing the real AE (persistent burning + spreading rash) exactly as the reveal rule intended. Questioning Technique (S1.3): Exemplary listen-and-clarify — the trainee quoted the caller's own words back and asked an open clarifying question, which is the correct technique for this skill (not probing/fishing). Compliance (S5.1/S5.3): No off-label or promotional language was used; the response stayed within the approved SRL and appropriately deferred the treatment/duration decision to the prescriber. Regulatory risk (S5 criticals): Routing to PV was correct and timely (within the 1-business-day SOP window), and the correct SRL (SRL-DRM-APPLY) was cited rather than either decoy. Documentation (S2.4-S2.10, S4): Most documentation is solid — AE description, contact info, product, SRL citation, and routing are all correctly captured. One gap: the resolution/closure notes do not capture any summary of case completion or the consent-to-contact-HCP discussion that occurred on the call (the caller agreed to be contacted by the prescriber), so S2.9 fails — in a live QA environment this would be flagged as an incomplete case closure note, which could cause confusion for anyone auditing the case later on whether the safety follow-up was properly closed out.

| Criterion | Result | Evidence / rationale |
|---|---|---|
| S1.1 | pass (3) | "this is Alex Reed speaking" |
| S1.2 | pass (3) | "Happy to help with that." |
| S1.3 | pass (4) | "you mentioned 'It stings a bit when I put it on, but creams do that, right?' a moment ago. Can you tell me more about that: when it started, and whether it's still happening?" |
| S1.4 | na |  |
| S1.5 | pass (3) | Entire transcript uses plain language. |
| S2.1 | pass (10) | AE (application-site burning and spreading rash) was correctly identified per ground truth after the volunteered cue was clarified. |
| S2.2 | pass (10) | deterministic validator: report_timeframe |
| S2.3 | pass (10) | Routed to PV, matching the correct_routes in the answer key. |
| S2.4 | pass (8) |  |
| S2.5 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S2.6 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S2.7 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S2.8 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S2.9 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S2.10 | pass (2) | deterministic validator: received_date_match |
| S4.1 | pass (5) | Correct product Dermelia selected. |
| S4.2 | pass (5) | Response was based on the correct SRL and no medical advice was given; caller was referred to prescriber for treatment decisions. |
| S4.3 | pass (4) | deterministic validator: contact_set_per_case_type |
| S4.4 | pass (4) | The MI request (duration of use question) was logged with category and summary in the database record. |
| S4.5 | pass (4) | Response stayed on-topic, addressing duration of use and referring to HCP for the rash without volunteering unrelated information. |
| S4.6 | pass (4) | Correct SRL (SRL-DRM-APPLY) was cited and documented in the response field, matching the correct_srl in the answer key. |
| S4.7 | pass (4) | Response summary, detail level, and SRL reference are correctly entered in the response fields. |
| S4.8 | pass (4) | deterministic validator: received_date_match |
| S4.9 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S4.10 | pass (1) | Response route (phone) is appropriate for a voice case and documented. |
| S4.11 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S4.12 | pass (1) | Inquiry category 'Other' was selected, consistent with the case's inquiry_category in the ground truth. |
| S4.13 | pass (1) | deterministic validator: required_fields_present |
| S4.14 | pass (1) | deterministic validator: spelling_count |
| S5.1 | na |  |
| S5.2 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S5.3 | pass (8) | Response was balanced, non-promotional, and appropriately deferred treatment decisions to the prescriber. |
| S5.4 | pass (8) | Correct escalation route (PV) is recorded in routing_single, matching the correct_routes in the answer key. |
| S5.5 | pass (2) | Trainee appropriately referred the patient to their prescriber for the worsening rash/treatment decision, a medical-advice-adjacent question. |

### B9. SC-09 — evaluator says: **PASS**

> This was a clean, low-complexity tier-1 pharmacokinetics inquiry from an HCP (pharmacist) with no adverse event, product complaint, or special situation to surface. Overall the trainee performed well: correct product/SRL identification, complete HCP contact capture, concise and non-promotional response, and appropriate closure without volunteering extraneous information.

| Criterion | Result | Evidence / rationale |
|---|---|---|
| S1.1 | pass (3) | "Thank you for calling Medical Information, this is Alex Reed speaking." |
| S1.2 | pass (3) | "Happy to help with that." |
| S1.3 | pass (3) | "Could I get your name, and are you calling as a healthcare provider, caregiver, or on your own behalf?" |
| S1.4 | na |  |
| S1.5 | pass (3) | "Based on SRL-CDZ-RENAL, here's what our approved information says..." |
| S4.1 | pass (5) | Correct product Cardizan selected in documentation and matched transcript. |
| S4.2 | pass (5) | Response was based on the correct SRL and contained no medical advice; agent directed pharmacist to PI-based approved content. |
| S4.3 | pass (4) | deterministic validator: contact_set_per_case_type |
| S4.4 | pass (4) | Inquiry captured with correct category, summary, and verbatim question logged. |
| S4.5 | pass (4) | Response was concise and on-inquiry, did not volunteer unrelated information. |
| S4.6 | pass (4) | Correct SRL (SRL-CDZ-RENAL) cited in transcript and documented in response.selected_srl_id field. |
| S4.7 | pass (4) | Response correctly entered with reference to the correct SRL and summary of content delivered. |
| S4.8 | pass (4) | deterministic validator: received_date_match |
| S4.9 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S4.10 | fail (0) | "delivery_method": "phone" vs inquiry.summary: "Clean, on-label information request via a non-phone channel" |
| S4.11 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S4.12 | pass (1) | Correct inquiry category (Pharmacokinetics) selected matching the case's ground-truth category. |
| S4.13 | pass (1) | deterministic validator: required_fields_present |
| S4.14 | pass (1) | deterministic validator: spelling_count |
| S5.1 | na |  |
| S5.2 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S5.3 | pass (8) | Response was balanced, factual, and non-promotional, directing to PI content without embellishment. |
| S5.4 | na |  |
| S5.5 | na |  |

### B10. SC-10 — evaluator says: **PASS**

> Strong performance on a high-risk special-situation case. AE/PC Detection (S5.2): The trainee correctly recognized the volunteered pregnancy exposure cue immediately and flagged it as a special situation rather than treating it as a routine query or fabricating an AE — this is exactly the listen-and-clarify skill required. Questioning Technique (S1.3): Excellent — the trainee asked only the necessary clarifying questions (LMP/gestational age, prescriber) without over-probing or soliciting unrelated symptoms. Compliance (S5.1/S5.3/S5.5): The trainee avoided the 'should I stop' trap perfectly, never advising on continuing/discontinuing the anticonvulsant, and instead cited the pregnancy registry via the correct SRL (SRL-NEU-PREG) and referred the patient urgently to her prescriber — model handling of abrupt-discontinuation risk. Regulatory risk (S5 criticals): Correct routing to PV was selected and documented, consistent with the answer key's single-route (PV) requirement. Documentation: All required fields (contact, gestational age reference via summary, prescriber name, special situation flag, SRL cited, routing) were captured cleanly and the received date matches. No spelling or contact-field issues were found.

| Criterion | Result | Evidence / rationale |
|---|---|---|
| S1.1 | pass (4) | Thank you for calling Medical Information, this is Alex Reed speaking. |
| S1.2 | pass (3) | Happy to help with that. Could I get your name... |
| S1.3 | pass (4) | Can you tell me your estimated due date or last menstrual period, and who your prescribing physician is? |
| S1.4 | na |  |
| S1.5 | pass (3) | Based on SRL-NEU-PREG, here's what our approved information says... |
| S4.1 | pass (5) | Correct product (Neurovance) selected and used consistently. |
| S4.2 | pass (5) | Response was based on the correct SRL and explicitly avoided giving medical/treatment advice, deferring to the prescriber. |
| S4.3 | pass (4) | deterministic validator: contact_set_per_case_type |
| S4.4 | pass (4) | MI request (pregnancy exposure inquiry re: Neurovance) correctly entered with category Safety and appropriate summary. |
| S4.5 | pass (4) | Response stayed on-topic, referencing the SRL and referring to prescriber without volunteering unrelated information. |
| S4.6 | pass (4) | Correct SRL (SRL-NEU-PREG) was cited both in the call and documented in the response field. |
| S4.7 | pass (4) | Response summary and detail level correctly captured, referencing the SRL and prescriber referral consistent with the call content. |
| S4.8 | pass (4) | deterministic validator: received_date_match |
| S4.9 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S4.10 | pass (1) | Response route (phone, PV routing) is appropriate and documented. |
| S4.11 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S4.12 | pass (1) | Case question category correctly selected as Safety, matching the pregnancy exposure special situation. |
| S4.13 | pass (1) | deterministic validator: required_fields_present |
| S4.14 | pass (1) | deterministic validator: spelling_count |
| S5.1 | na |  |
| S5.2 | pass (10) | Pregnancy exposure special situation correctly identified and flagged in documentation. |
| S5.3 | pass (8) | Response was balanced, non-promotional, and focused on registry information and prescriber referral rather than promoting the product. |
| S5.4 | pass (8) | Correct escalation route (PV) selected and documented in routing_single field, matching the ground truth correct_routes. |
| S5.5 | pass (2) | Patient was appropriately and clearly referred back to her prescribing HCP for the treatment decision, avoiding medical advice on stopping/continuing the anticonvulsant. |

### B11. SC-11 — evaluator says: **PASS**

> Strong performance on this embedded lack-of-effect (LOE) case. AE/PC Detection: the trainee correctly caught the volunteered cue about the dose increase mid-sentence, clarified it (duration, ongoing status), and captured it as a lack-of-effect special situation routed to PV — exactly the intended teaching point, avoiding both the trap of dismissing it as 'normal titration' and the trap of fabricating an AE. Questioning Technique (S1.3) was excellent: listen-and-clarify was used precisely, without cold-probing for symptoms the caller never raised. Compliance (S5.1/S5.3): no off-label material was introduced, no promotional language was used, and the trainee explicitly declined to give dosing/INR advice, referring the caller to the prescriber — appropriate handling of the medical-advice-risk flag in this case. Regulatory risk (S5 criticals): the special situation was flagged and routed correctly to PV, matching the ground-truth required route. Documentation: all required fields were completed, contact info captured per case type, received date matched, and the disposal response was accurately summarized without referencing the decoy titration/renal SRLs — correct since the ground truth calls for no SRL. Empathy (S1.2): tone remained professional and warm throughout the interaction.

| Criterion | Result | Evidence / rationale |
|---|---|---|
| S1.1 | pass (4) | Thank you for calling Medical Information, this is Alex Reed speaking. |
| S1.2 | pass (3) | Happy to help with that. |
| S1.3 | pass (4) | Before we go further — you mentioned "My doctor bumped me up because the low dose wasn" a moment ago. Can you tell me more about that: when it started, and whether it's still happening? |
| S1.4 | na |  |
| S1.5 | pass (3) | please direct any INR or dosing questions to your prescriber |
| S4.1 | pass (5) | Correct product Cardizan selected in documentation and referenced throughout call. |
| S4.2 | pass (5) | Response was general disposal guidance and explicitly avoided dosing/medical advice, referring caller to prescriber. |
| S4.3 | pass (4) | deterministic validator: contact_set_per_case_type |
| S4.4 | pass (4) | The inquiry (disposal question plus embedded LOE) was entered into the database with appropriate summary and category. |
| S4.5 | pass (4) | Response stayed on-topic (disposal) and did not volunteer unrelated information; dosing was explicitly deflected. |
| S4.6 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S4.7 | pass (4) | Response summary and detail level are correctly entered, reflecting the verbal answer given without referencing decoy SRLs. |
| S4.8 | pass (4) | deterministic validator: received_date_match |
| S4.9 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S4.10 | pass (1) | Response route (phone) is appropriate and documented for a live voice call. |
| S4.11 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S4.12 | pass (1) | Inquiry category 'Other' reasonably captures the disposal-logistics nature of the primary question. |
| S4.13 | pass (1) | deterministic validator: required_fields_present |
| S4.14 | pass (1) | deterministic validator: spelling_count |
| S5.1 | na | No off-label request was made or volunteered by the caller; not triggered in this case. |
| S5.2 | pass (10) | Lack-of-effect special situation was identified, captured, and flagged correctly per the reveal rule and ground truth. |
| S5.3 | pass (8) | Response was factual and non-promotional, focused on disposal safety guidance without promotional language. |
| S5.4 | pass (8) | Correct escalation route (PV) selected and documented matching the ground truth's correct_routes. |
| S5.5 | pass (2) | Caller was appropriately referred to prescriber for INR/dosing questions rather than receiving medical advice. |

### B12. SC-12 — evaluator says: **PASS**

> Strong performance on this high-difficulty embedded-AE case. AE/PC Detection (S2.1/S5.2): The trainee correctly caught the volunteered 'treated at the hospital' cue in beat 2 and clarified it — exactly the listen-and-clarify skill required — surfacing the serious AE (hospitalization for pneumonia on Immunexa) without fabricating or over-probing. Questioning Technique (S1.3): Excellent — the clarifying question was targeted at the specific cue the caller raised ('when it started, and whether it's still happening') rather than a generic AE fishing expedition. Compliance (S5.1/S5.3): No off-label material was involved and none was volunteered; the response stayed within the labeled SRL content and was non-promotional. Documentation: AE description, seriousness flag, and PV routing were all correctly captured and matched the ground truth; the correct SRL (SRL-IMM-VACC) was selected and cited. Regulatory risk: Routing to PV occurred same-day, well within the 1-business-day SOP window, and consent to contact the prescriber was properly obtained before proceeding. Empathy: Tone was professional and reassuring throughout without being clinical or cold when pivoting to the serious safety topic.

| Criterion | Result | Evidence / rationale |
|---|---|---|
| S1.1 | pass (3) | Thank you for calling Medical Information, this is Alex Reed speaking. |
| S1.2 | pass (3) | Happy to help with that. Could I get your name... |
| S1.3 | pass (4) | Before we go further — you mentioned "They were just being treated over at the hospital..." Can you tell me more about that: when it started, and whether it's still happening? |
| S1.4 | na |  |
| S1.5 | pass (3) | Based on SRL-IMM-VACC, here's what our approved information says... |
| S2.1 | pass (10) | AE (serious hospitalization for pneumonia while on Immunexa) was identified via clarification and documented in Safety tab matching ground truth. |
| S2.2 | pass (10) | deterministic validator: report_timeframe |
| S2.3 | pass (10) | Routed to PV, matching correct_routes ['pv']. |
| S2.4 | pass (8) | Fixed validator finding. |
| S2.5 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S2.6 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S2.7 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S2.8 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S2.9 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S2.10 | pass (2) | deterministic validator: received_date_match |
| S4.1 | pass (5) | Correct product 'Immunexa' selected. |
| S4.2 | pass (5) | Response was based on the correct SRL and no medical advice on the infection/hospitalization was given; caller referred to HCP for treatment decisions. |
| S4.3 | pass (4) | deterministic validator: contact_set_per_case_type |
| S4.4 | pass (4) | MI request (interaction question) correctly entered with inquiry category and summary. |
| S4.5 | pass (4) | Response stayed on the labeled vaccine-timing interaction question without volunteering unrelated info. |
| S4.6 | pass (4) | Correct SRL (SRL-IMM-VACC) cited and documented in response field, matching ground truth correct_srl. |
| S4.7 | pass (4) | Response correctly entered with summary, SRL reference, and delivery method. |
| S4.8 | pass (4) | deterministic validator: received_date_match |
| S4.9 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S4.10 | pass (1) | Response route (phone, delivered live) documented appropriately for a voice HCP interaction call. |
| S4.11 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S4.12 | pass (1) | Case question category correctly selected as Drug-Interactions matching the inquiry. |
| S4.13 | pass (1) | deterministic validator: required_fields_present |
| S4.14 | pass (1) | deterministic validator: spelling_count |
| S5.1 | na | No off-label information was requested or volunteered in this case; the interaction question is a labeled use. |
| S5.2 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S5.3 | pass (8) | Response was factual, non-promotional, referencing approved SRL content without promotional language. |
| S5.4 | pass (8) | Correct escalation route (PV) selected and documented in routing_single field, matching ground truth correct_routes. |
| S5.5 | pass (2) | Trainee appropriately avoided directing clinical management of the infection, implicitly deferring treatment decisions to the HCP caller who is already the prescriber. |
