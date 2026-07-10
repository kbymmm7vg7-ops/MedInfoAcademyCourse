# Evaluator calibration report (S4)

_Generated 2026-07-10T13:41:03.625Z · model claude-sonnet-5 · eval-prompt-v1 · rubric v1.0_

## Definition-of-done gate

| Gate | Result |
|---|---|
| Gold examples → `pass` | 12/12 ✅ |
| Non-empty `expected_critical_fail` → trips exact Critical(s) | 17/17 ✅ |
| Errors | 0 |
| **Overall DoD** | **✅ MET** |

Deduction fixtures (`expected_critical_fail: []`) are reported below but not gated — they are documented point deductions, not mandated case failures (HANDOFF §7).

## Disagreements & errors (0)

None. Every gold passed and every mandated Critical tripped.

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
| SC-05-failure-1-admitCausation | failure | S4.2 | fail | match |
| SC-05-failure-2-specialSituationMissed | failure | S5.2 | fail | match |
| SC-05-failure-3-admitCausation | failure | — | fail | info |
| SC-05-failure-4-omitLegalComms | failure | — | fail | info |
| SC-06-gold | gold | (pass) | pass | match |
| SC-06-failure-1-offLabelVolunteered | failure | S5.1 | fail | match |
| SC-06-failure-2-wrongSrl | failure | — | pass | info |
| SC-06-failure-3-omitLegalComms | failure | — | pass | info |
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
| SC-11-failure-3-wrongSrl | failure | — | pass | info |
| SC-11-failure-4-overFlagAe | failure | — | fail | info |
| SC-12-gold | gold | (pass) | pass | match |
| SC-12-failure-1-missedCue | failure | S2.1 | fail | match |
| SC-12-failure-2-noPvRouteNotFlaggedSerious | failure | S2.3 | fail | match |
| SC-12-failure-3-wrongSrl | failure | — | fail | info |

## Deduction fixtures (informational)

- `SC-01-failure-1-overFlagAe`: deduction fixture — overall fail; failing: S1.3, S2.1, S2.3, S2.4, S4.13, S5.4
- `SC-01-failure-2-wrongSrl`: deduction fixture — overall fail; failing: S4.1, S4.2, S4.6, S4.7
- `SC-02-failure-1-wrongContactSet`: deduction fixture — overall pass; failing: none
- `SC-02-failure-3-wrongSrl`: deduction fixture — overall fail; failing: S4.2, S4.6, S4.7
- `SC-03-failure-2-aeNotDocumented`: deduction fixture — overall fail; failing: S2.1, S2.3, S2.4, S5.4
- `SC-03-failure-3-aeNotDocumented`: deduction fixture — overall fail; failing: S2.1, S2.3, S2.4, S4.4, S5.4
- `SC-04-failure-3-missingPcIdentifiers`: deduction fixture — overall fail; failing: S3.6
- `SC-04-failure-4-noRetrieval`: deduction fixture — overall pass; failing: none
- `SC-05-failure-3-admitCausation`: deduction fixture — overall fail; failing: S1.2, S4.2, S4.5, S5.3
- `SC-05-failure-4-omitLegalComms`: deduction fixture — overall fail; failing: S2.3, S4.10, S5.2, S5.4
- `SC-06-failure-2-wrongSrl`: deduction fixture — overall pass; failing: none
- `SC-06-failure-3-omitLegalComms`: deduction fixture — overall pass; failing: none
- `SC-07-failure-2-spokespersonStatement`: deduction fixture — overall fail; failing: S1.1, S1.3, S4.2, S4.5, S4.7, S4.10, S5.2, S5.3, S5.4
- `SC-07-failure-3-omitLegalComms`: deduction fixture — overall fail; failing: S5.4
- `SC-08-failure-3-aeNotDocumented`: deduction fixture — overall fail; failing: S2.1, S2.3, S2.4, S4.4, S5.4
- `SC-09-failure-1-wrongSrl`: deduction fixture — overall fail; failing: S4.6, S4.7, S4.10
- `SC-09-failure-2-wrongContactSet`: deduction fixture — overall fail; failing: S4.3, S4.10
- `SC-10-failure-3-overFlagAe`: deduction fixture — overall fail; failing: S1.3, S2.1, S2.4, S4.5
- `SC-11-failure-3-wrongSrl`: deduction fixture — overall pass; failing: none
- `SC-11-failure-4-overFlagAe`: deduction fixture — overall fail; failing: S1.3, S2.1, S2.4
- `SC-12-failure-3-wrongSrl`: deduction fixture — overall fail; failing: S4.6, S4.7

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

> Clean Tier-1 HCP interaction handled well end-to-end. AE/PC Detection: no AE/PC cues were present in the call, and the trainee correctly avoided fabricating one — good discipline. Questioning Technique: trainee appropriately confirmed requester type without probing for symptoms that were never raised, matching listen-and-clarify standard. Compliance: response stayed on-label, cited the correct SRL (SRL-CDZ-INR), and avoided promotional language. Documentation: all required fields (contact, product, SRL, category, dates) were completed accurately and matched the transcript; no spelling issues. Empathy: tone was professional and pleasant throughout.

| Criterion | Result | Evidence / rationale |
|---|---|---|
| S1.1 | pass (4) | Thank you for calling Medical Information, this is Alex Reed speaking. |
| S1.2 | pass (3) | Happy to help with that. |
| S1.3 | pass (3) | Could I get your name, and are you calling as a healthcare provider, caregiver, or on your own behalf? |
| S1.4 | na |  |
| S1.5 | pass (3) | Based on SRL-CDZ-INR, here's what our approved information says |
| S4.1 | pass (5) | Correct product Cardizan selected matching case. |
| S4.2 | pass (5) | Response was based on the correct SRL and contained no medical advice, consistent with PI-based interaction information. |
| S4.3 | pass (4) | deterministic validator: contact_set_per_case_type |
| S4.4 | pass (4) | MI request (drug interaction inquiry) correctly entered with category and summary. |
| S4.5 | pass (4) | Response was concise and on-inquiry, addressing only the interaction question without extraneous volunteered information. |
| S4.6 | pass (4) | Correct SRL (SRL-CDZ-INR) was cited both verbally and documented in the response field. |
| S4.7 | pass (4) | Response correctly entered with summary and correct SRL reference matching what was delivered on the call. |
| S4.8 | pass (4) | deterministic validator: received_date_match |
| S4.9 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S4.10 | pass (1) | Response route (phone, matching intake channel) is documented appropriately. |
| S4.11 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S4.12 | pass (1) | Case question category correctly selected as Drug-Interactions, matching the inquiry. |
| S4.13 | pass (1) | deterministic validator: required_fields_present |
| S4.14 | pass (1) | deterministic validator: spelling_count |
| S5.1 | na | No off-label information was requested or volunteered; the interaction question was answered on-label per PI. |
| S5.2 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S5.3 | pass (8) | Response was factual, balanced, and non-promotional, simply relaying PI-based interaction information. |
| S5.4 | na | No escalation was required for this clean, non-safety inquiry; routing fields are correctly empty. |
| S5.5 | na | No medical-advice-adjacent question requiring HCP referral was raised; caller was already the treating HCP. |

### B2. SC-02 — evaluator says: **PASS**

> Strong performance overall on this ambiguous-requester efficacy case. AE/PC Detection: not applicable here since no AE/PC was present, and correctly none was fabricated — good discipline avoiding over-flagging. Questioning Technique (S1.3): the trainee handled the reveal-rule trigger well, asking a clean requester-type clarifying question rather than assuming HCP status from the caller's clinical-adjacent language, which correctly surfaced that Jordan Ellis was a patient. Compliance: no off-label content was raised, and the response was appropriately non-promotional, redirecting the caller to a pharmacist for any dosing changes rather than giving direct medical advice — this correctly manages the medical-advice-risk flag in the case. Documentation: all required fields (requester_type, contact, product, SRL, response route) were completed accurately and matched the verbal exchange; the correct SRL-GAS-ONSET was cited both on the call and in the record. Empathy: tone was warm and professional throughout ("Happy to help with that"), with a proper closing check for additional questions. Regulatory risk: none identified, correctly reflected as N/A for S5.1/S5.2/S5.4 since no special situation or off-label ask occurred.

| Criterion | Result | Evidence / rationale |
|---|---|---|
| S1.1 | pass (3) | Thank you for calling Medical Information, this is Alex Reed speaking. |
| S1.2 | pass (3) | Happy to help with that. |
| S1.3 | pass (3) | Could I get your name, and are you calling as a healthcare provider, caregiver, or on your own behalf? |
| S1.4 | na |  |
| S1.5 | pass (3) | Based on SRL-GAS-ONSET, here's what our approved information says about your question on Gastroquell... |
| S4.1 | pass (5) | Correct product Gastroquell selected in documentation and referenced in response. |
| S4.2 | pass (5) | Response was based on the correct SRL and avoided medical advice, instead directing to pharmacist/HCP for dosing decisions. |
| S4.3 | pass (4) | deterministic validator: contact_set_per_case_type |
| S4.4 | pass (4) | Inquiry logged with category Efficacy and summary captured. |
| S4.5 | pass (4) | Response stayed on-topic addressing onset of relief and regimen adherence, without volunteering unrelated information. |
| S4.6 | pass (4) | Correct SRL (SRL-GAS-ONSET) cited both verbally and in documentation. |
| S4.7 | pass (4) | Response summary and reference to SRL correctly entered in documentation matching the verbal answer given. |
| S4.8 | pass (4) | deterministic validator: received_date_match |
| S4.9 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S4.10 | pass (1) | Delivery method (phone) documented and consistent with channel. |
| S4.11 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S4.12 | pass (1) | Efficacy category correctly selected matching the ground-truth inquiry_category. |
| S4.13 | pass (1) | deterministic validator: required_fields_present |
| S4.14 | pass (1) | deterministic validator: spelling_count |
| S5.1 | na |  |
| S5.2 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S5.3 | pass (8) | Language used was neutral and non-promotional, focused on approved SRL content. |
| S5.4 | na |  |
| S5.5 | pass (2) | Caller appropriately referred to pharmacist for dosing/regimen decision, addressing the medical-advice-adjacent risk without providing direct medical advice. |

### B3. SC-03 — evaluator says: **PASS**

> Strong performance overall. AE/PC Detection: the trainee correctly caught the caller's volunteered 'shaky' cue and clarified it precisely as trained (listen-and-clarify, not probing), surfacing a real AE (tremor + palpitations) that matched the answer key exactly — this is the core skill of this case and it was executed well. Questioning Technique: excellent re-quoting and clarification of the ambiguous mid-sentence cue. Compliance: no off-label content, no medical advice, response stayed on-topic and non-promotional; appropriate HCP referral obtained with consent. Documentation: intake, safety, and response fields were filled correctly and the AE was routed to PV within the SOP timeframe. One gap: the resolution/closure section lacks AE-specific completion notes beyond generic checklist flags, which would leave a live QA reviewer unsure exactly what next steps (e.g., HCP outreach, PV follow-up) were completed or pending.

| Criterion | Result | Evidence / rationale |
|---|---|---|
| S1.1 | pass (3) | Thank you for calling Medical Information, this is Alex Reed speaking. |
| S1.2 | pass (3) | Professional and courteous tone throughout, no condescension. |
| S1.3 | pass (4) | you mentioned "s been a bit shaky lately, but that" a moment ago. Can you tell me more about that: when it started, and whether it's still happening? |
| S1.4 | na |  |
| S1.5 | pass (4) | No jargon, slang, or acronyms used; language was clear and plain. |
| S2.1 | pass (10) | AE (tremor + palpitations) was correctly identified from the volunteered cue and documented consistently with the answer key. |
| S2.2 | pass (10) | deterministic validator: report_timeframe |
| S2.3 | pass (10) | Routed to PV, matching correct_routes ['pv']. |
| S2.4 | pass (8) |  |
| S2.5 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S2.6 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S2.7 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S2.8 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S2.9 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S2.10 | pass (2) | deterministic validator: received_date_match |
| S4.1 | pass (5) | Correct product Pulmonara selected. |
| S4.2 | pass (5) | Response based on cited SRL, no medical advice given; referred treatment decisions to prescriber. |
| S4.3 | pass (4) | deterministic validator: contact_set_per_case_type |
| S4.4 | pass (4) | Inquiry (rinse mouth question) correctly entered in database with category and summary. |
| S4.5 | pass (4) | Response stayed on the caller's actual question (mouth rinse) and safety capture; nothing extraneous volunteered. |
| S4.6 | pass (4) | Correct SRL (SRL-PUL-CANDID) is documented in the response field. |
| S4.7 | pass (4) | Response summary and reference to SRL correctly entered. |
| S4.8 | pass (4) | deterministic validator: received_date_match |
| S4.9 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S4.10 | pass (1) | Response route (phone, verbal) is appropriate and documented. |
| S4.11 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S4.12 | pass (1) | Case question category 'Other' selected appropriately for the mouth-rinse administration question. |
| S4.13 | pass (1) | deterministic validator: required_fields_present |
| S4.14 | pass (1) | deterministic validator: spelling_count |
| S5.1 | na | No off-label information was requested or volunteered in this case. |
| S5.2 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S5.3 | pass (8) | Response was balanced, non-promotional, sourced from approved SRL. |
| S5.4 | pass (8) | Correct escalation route (PV) selected and documented in routing_single field. |
| S5.5 | pass (2) | Caller appropriately referred to prescriber for treatment-related follow-up given the tremor/palpitations finding. |

### B4. SC-04 — evaluator says: **PASS**

> Strong overall handling of a complex dual PC+AE case. AE/PC Detection: Both the product complaint (cloudy solution, bent needle) and the adverse event (perioral tingling/numbness, possible hypocalcemia) were correctly identified from caller-volunteered cues and routed to both PV and Quality — no fabrication, no missed signals. Questioning Technique: Excellent listen-and-clarify approach; the trainee explicitly flagged the volunteered cues and asked clarifying follow-ups rather than fishing, exactly per SOP. Compliance: No off-label material was introduced, and the trainee appropriately restricted comments to the approved SRL, referring the caller to their HCP for urgent evaluation of hypocalcemia symptoms — good regulatory hygiene. Documentation: This is the area needing coaching. While all core safety and PC identifier fields (lot, NDC, expiry, availability) were properly captured, the resolution/completion narrative for both the AE and PC was left essentially blank — only checklist booleans were toggled with no substantive notes on next steps or case resolution. In a live QA audit this would trigger a documentation completeness finding, since reviewers need a clear textual record of what action was taken/pending for each reported issue, not just checkboxes.

| Criterion | Result | Evidence / rationale |
|---|---|---|
| S1.1 | pass (3) | Thank you for calling Medical Information, this is Alex Reed speaking. |
| S1.2 | pass (3) | Tone professional and empathetic throughout, no condescension. |
| S1.3 | pass (3) | Before we go further — you mentioned ... Can you tell me more about that: when it started, and whether it's still happening? |
| S1.4 | na |  |
| S1.5 | pass (3) | No slang/jargon/acronyms used; SRL id spoken but clarified as approved info source. |
| S2.1 | pass (10) | AE (perioral tingling/numbness, possible hypocalcemia) correctly identified and documented. |
| S2.2 | pass (10) | deterministic validator: report_timeframe |
| S2.3 | pass (10) | Routed to both PV and Quality per dual routing requirement. |
| S2.4 | pass (8) |  |
| S2.5 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S2.6 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S2.7 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S2.8 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S2.9 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S2.10 | pass (2) | deterministic validator: received_date_match |
| S3.1 | pass (10) | PC (cloudy solution, bent needle) correctly identified and documented. |
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
| S4.1 | pass (5) | Correct product Osteveda selected. |
| S4.2 | pass (5) | Response based on correct SRL, no medical advice given; referred to HCP for evaluation. |
| S4.3 | pass (4) | deterministic validator: contact_set_per_case_type |
| S4.4 | pass (4) | MI request (PC+AE dual) entered correctly in database with appropriate category. |
| S4.5 | pass (4) | Response stayed on-inquiry, concise, no extraneous volunteering. |
| S4.6 | pass (4) | Correct SRL documented in response field. |
| S4.7 | pass (4) | Response correctly entered with source SRL referenced and appropriate summary/detail level. |
| S4.8 | pass (4) | deterministic validator: received_date_match |
| S4.9 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S4.10 | pass (1) | Response route (phone) appropriate and documented. |
| S4.11 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S4.12 | pass (1) | Case question category 'Other' selected appropriately for dual PC/AE scenario. |
| S4.13 | pass (1) | deterministic validator: required_fields_present |
| S4.14 | pass (1) | deterministic validator: spelling_count |
| S5.1 | na |  |
| S5.2 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S5.3 | pass (8) | Response was balanced, non-promotional, factual referral to HCP. |
| S5.4 | pass (8) | Correct dual escalation route (PV + Quality) selected and documented. |
| S5.5 | pass (2) | Caller appropriately referred to HCP/urgent care for the medical-advice-adjacent hypocalcemia symptom. |

### B5. SC-05 — evaluator says: **PASS**

> Strong performance on a high-difficulty hostile caller/legal-media escalation case. AE/PC Detection: the trainee correctly caught the volunteered serious AE (blistering rash, mouth sores, hospitalization, possible SJS) without fabricating or over-probing, and both legal and media special situations were identified and flagged appropriately in documentation. Questioning Technique: the trainee used a single clarifying question to establish caller type/contact info and otherwise practiced listen-and-clarify rather than soliciting symptoms — appropriate for this skill. Compliance/Regulatory risk: excellent de-escalation language avoided confirming causation, avoided fault admission, and redirected treatment questions to the HCP — this is exactly the risk-mitigation behavior expected in a legal-threat scenario. Documentation: all required fields (AE description, seriousness, special situations, dual routing to PV/Legal/Communications/Supervisor, SRL citation, contact info) were completed accurately and the routing timeframe was met (same-day, within the 1-business-day SOP). Empathy: opening acknowledgment ("I hear how frightening this has been...") was well-calibrated to a hostile caller without over-promising outcomes.

| Criterion | Result | Evidence / rationale |
|---|---|---|
| S1.1 | pass (3) | "this is Alex Reed speaking" |
| S1.2 | pass (4) | "I hear how frightening this has been, and I want to make sure your mother gets the right care." |
| S1.3 | pass (4) | Trainee asked clarifying intake question ("Could I get your name, and are you calling as a healthcare provider, caregiver, or on your own behalf?") and caught the volunteered AE cue and clarified without probing further for unraised symptoms. |
| S1.4 | na |  |
| S1.5 | pass (3) | No slang/jargon/acronyms used in trainee's speech; SRL cited by name but that's standard MI terminology, not problematic jargon. |
| S2.1 | pass (10) |  |
| S2.2 | pass (10) | deterministic validator: report_timeframe |
| S2.3 | pass (10) |  |
| S2.4 | pass (8) |  |
| S2.5 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S2.6 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S2.7 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S2.8 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S2.9 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S2.10 | pass (2) | deterministic validator: received_date_match |
| S4.1 | pass (5) |  |
| S4.2 | pass (5) |  |
| S4.3 | pass (4) | deterministic validator: contact_set_per_case_type |
| S4.4 | pass (4) |  |
| S4.5 | pass (4) |  |
| S4.6 | pass (4) |  |
| S4.7 | pass (4) |  |
| S4.8 | pass (4) | deterministic validator: received_date_match |
| S4.9 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S4.10 | pass (1) |  |
| S4.11 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S4.12 | pass (1) |  |
| S4.13 | pass (1) | deterministic validator: required_fields_present |
| S4.14 | pass (1) | deterministic validator: spelling_count |
| S5.1 | na |  |
| S5.2 | pass (10) |  |
| S5.3 | pass (8) |  |
| S5.4 | pass (8) |  |
| S5.5 | pass (2) |  |

### B6. SC-06 — evaluator says: **PASS**

> Strong performance on a high-stakes compliance trap. The trainee (Alex Reed) correctly identified this as an internal sales rep seeking off-label efficacy data for promotional sharing, declined firmly but empathetically under mild pushback, explained the approved indication boundary, and routed to Medical Affairs while correctly noting that a genuine unsolicited HCP request would need to come through the proper channel — this is exactly the target behavior for S5.1/Regulatory risk. Documentation captured requester type, contact info, inquiry summary, off-label flag context, and correct single routing to Medical Affairs consistent with the answer key. No AE/PC was present and none was fabricated, and no special situation applied, so S2/S3/S5.2 are properly out of scope or na. Contact fields, dates, and required fields all passed per the deterministic validator.

| Criterion | Result | Evidence / rationale |
|---|---|---|
| S1.1 | pass (3) | Thank you for calling Medical Information, this is Alex Reed speaking. |
| S1.2 | pass (3) | I understand you're trying to help your customer, but I'm not able to share efficacy data for an unapproved use |
| S1.3 | pass (3) | Could I get your name, and are you calling as a healthcare provider, caregiver, or on your own behalf? |
| S1.4 | na |  |
| S1.5 | pass (3) | N/A - no jargon present in transcript |
| S4.1 | pass (5) | Correct product (Immunexa) selected and documented consistently. |
| S4.2 | pass (5) | No medical advice given; response correctly declined off-label efficacy data and stayed within approved handling. |
| S4.3 | pass (4) | deterministic validator: contact_set_per_case_type |
| S4.4 | pass (4) | Inquiry captured with category, product, and summary reflecting the off-label efficacy request. |
| S4.5 | pass (4) | Response was concise and on-inquiry, declining off-label info without volunteering unrelated content. |
| S4.6 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S4.7 | pass (4) | Response summary correctly reflects the declined off-label request and routing action; no references needed since correct_srl is none. |
| S4.8 | pass (4) | deterministic validator: received_date_match |
| S4.9 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S4.10 | pass (1) | Response route (phone/verbal decline + routing to Medical Affairs) is appropriate and documented. |
| S4.11 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S4.12 | pass (1) | Inquiry category correctly selected as Efficacy, matching the nature of the request. |
| S4.13 | pass (1) | deterministic validator: required_fields_present |
| S4.14 | pass (1) | deterministic validator: spelling_count |
| S5.1 | pass (10) | Trainee correctly declined to volunteer off-label efficacy information, held the line under mild pushback, and routed properly per SOP instead of answering promotionally. |
| S5.2 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S5.3 | pass (8) | No promotional language; response was balanced, factual about approved indication only. |
| S5.4 | pass (8) | Correct escalation route (Medical Affairs) selected and documented matching correct_routes in answer key. |
| S5.5 | na | No medical-advice-adjacent question from a patient/consumer was raised; caller is internal sales rep relaying a third-party dermatologist's interest, not a direct HCP medical query requiring HCP referral. |

### B7. SC-07 — evaluator says: **PASS**

> Strong handling of a high-difficulty media edge case. AE/PC Detection & Special Situation Flagging (S5.2): the trainee correctly recognized this as a media contact rather than a clinical AE/PC inquiry, and flagged/routed it accordingly to Communications and Supervisor — matching the answer key exactly. Questioning Technique (S1.3): the trainee did not get baited into confirming causation ('you're saying it does cause cancer — can I quote you on that?') and instead clarified identity/role and redirected without fabricating any adverse event or over-probing — exemplary listen-and-clarify behavior for this scenario type. Compliance (S5.1/S5.3): no off-label or promotional language was used; the trainee explicitly declined to characterize the boxed warning beyond approved labeling, which is the correct SOP-driven response for an unauthorized-spokesperson risk. Documentation: all required fields (contact, special_situations, routing, summary) were completed accurately and consistent with the transcript; routing matches the correct escalation targets from the answer key.

| Criterion | Result | Evidence / rationale |
|---|---|---|
| S1.1 | pass (3) | "this is Alex Reed speaking" |
| S1.2 | pass (3) | "Happy to help with that." |
| S1.3 | pass (4) | "I'm not able to speak on the record or characterize the warning beyond what's in the approved labeling." |
| S1.4 | na |  |
| S1.5 | pass (3) | N/A - no jargon present in transcript |
| S4.1 | pass (5) | Correct product (Dermelia) selected and referenced throughout. |
| S4.2 | pass (5) | No medical advice or causation statement given; response limited to approved labeling reference and redirect. |
| S4.3 | pass (4) | deterministic validator: contact_set_per_case_type |
| S4.4 | pass (4) | Inquiry captured in database record with category Safety and summary present. |
| S4.5 | pass (4) | Response was concise and did not volunteer any info beyond the redirect and non-answer. |
| S4.6 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S4.7 | pass (4) | Response entered correctly summarizing the interaction with appropriate detail level; no fabricated references. |
| S4.8 | pass (4) | deterministic validator: received_date_match |
| S4.9 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S4.10 | pass (1) | Response route (phone, then routed to Communications) is appropriate and documented. |
| S4.11 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S4.12 | pass (1) | Case question category correctly selected as Safety given the media/boxed-warning nature of inquiry. |
| S4.13 | pass (1) | deterministic validator: required_fields_present |
| S4.14 | pass (1) | deterministic validator: spelling_count |
| S5.1 | pass (10) | No off-label info was involved or volunteered; trainee correctly avoided characterizing the boxed warning beyond labeling. |
| S5.2 | pass (10) | Media special situation correctly identified and flagged in both routing and documentation. |
| S5.3 | pass (8) | No promotional language used; response was balanced, neutral, and compliant. |
| S5.4 | pass (8) | Correct escalation route (Communications and Supervisor) selected and documented, matching answer key's correct_routes. |
| S5.5 | na | No medical-advice-adjacent question from a patient/consumer was present; this was a media/journalist inquiry, not a patient seeking HCP referral. |

### B8. SC-08 — evaluator says: **PASS**

> Strong performance on AE/PC Detection: the trainee successfully caught the volunteered 'stings' cue in beat 2 and clarified it using listen-and-clarify technique rather than probing, surfacing the full AE (persistent burning + spreading rash) exactly as the ground truth intended. Consent to contact HCP was obtained, and the case was correctly routed to PV within the SOP timeframe. Compliance was solid — no medical advice was given, the caller was properly referred to their prescriber for the worsening rash, and the response stayed on-inquiry using the correct SRL (SRL-DRM-APPLY) without any promotional language. Empathy and professionalism were consistent throughout the call, and the agent's name was clearly stated at the opening. One documentation gap: the AE onset date field was left blank despite the caller specifying an approximate 5-day onset, which should be captured in the resolution/AE fields to support version tracking and follow-up. In a live QA environment, this gap would be flagged as incomplete safety documentation risking incomplete case closure, though the core detection and routing were correct.

| Criterion | Result | Evidence / rationale |
|---|---|---|
| S1.1 | pass (4) | "this is Alex Reed speaking" |
| S1.2 | pass (3) | "I'd like to make sure this gets captured for our safety team..." |
| S1.3 | pass (4) | "you mentioned 'It stings a bit when I put it on...' Can you tell me more about that: when it started, and whether it's still happening?" |
| S1.4 | na |  |
| S1.5 | pass (4) | N/A - clean language throughout transcript |
| S2.1 | pass (10) | AE was correctly identified after catching the volunteered cue, matching the ground truth AE (burning + spreading rash). |
| S2.2 | pass (10) | deterministic validator: report_timeframe |
| S2.3 | pass (10) | Routed to PV, matching ground-truth correct_routes. |
| S2.4 | pass (8) |  |
| S2.5 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S2.6 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S2.7 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S2.8 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S2.9 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S2.10 | pass (2) | deterministic validator: received_date_match |
| S4.1 | pass (5) | Correct product selected. |
| S4.2 | pass (5) | Response based on approved SRL, no medical advice given, patient referred to prescriber. |
| S4.3 | pass (4) | deterministic validator: contact_set_per_case_type |
| S4.4 | pass (4) | The MI request (duration of use question) was entered into the database along with the AE. |
| S4.5 | pass (4) | Response stayed on-topic, addressed the duration question and referred appropriately without volunteering extraneous information. |
| S4.6 | pass (4) | Correct SRL cited and documented in response field. |
| S4.7 | pass (4) | Response correctly entered with reference to SRL and summary of verbal answer given. |
| S4.8 | pass (4) | deterministic validator: received_date_match |
| S4.9 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S4.10 | pass (1) | Response route (phone) documented appropriately, matching voice channel. |
| S4.11 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S4.12 | pass (1) | Inquiry category appropriately selected as 'Other', matching case ground truth inquiry_category. |
| S4.13 | pass (1) | deterministic validator: required_fields_present |
| S4.14 | pass (1) | deterministic validator: spelling_count |
| S5.1 | na |  |
| S5.2 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S5.3 | pass (8) | Response was balanced, non-promotional, and appropriately referred to prescriber. |
| S5.4 | pass (8) | Correct escalation route (PV) selected and documented in routing_single field, matching correct_routes. |
| S5.5 | pass (2) | Caller was appropriately referred to their HCP/prescriber for the worsening skin reaction, a medical-advice-adjacent matter. |

### B9. SC-09 — evaluator says: **PASS**

> Clean, well-executed tier-1 pharmacokinetics inquiry from an HCP pharmacist. Trainee opened professionally with name and role clarification (Empathy/S1 strong), correctly identified requester type and captured full HCP contact details, selected the correct product and SRL (SRL-CDZ-RENAL, not the INR decoy), and delivered a concise, on-inquiry, non-promotional response with no medical advice. No AE/PC or special-situation cues were present in this case, and the trainee correctly did not fabricate or fish for any — this is exactly the desired 'listen-and-clarify, not probe' behavior. Documentation fields align with the transcript and required-field set; only a single minor spelling flag (creatinine-clearance) which is a non-issue at this volume.

| Criterion | Result | Evidence / rationale |
|---|---|---|
| S1.1 | pass (3) | Thank you for calling Medical Information, this is Alex Reed speaking. |
| S1.2 | pass (3) | Happy to help with that. |
| S1.3 | pass (3) | Could I get your name, and are you calling as a healthcare provider, caregiver, or on your own behalf? |
| S1.4 | na |  |
| S1.5 | pass (3) | Based on SRL-CDZ-RENAL, here's what our approved information says... |
| S4.1 | pass (5) | Correct product Cardizan selected in documentation and response. |
| S4.2 | pass (5) | Response was based on the correct SRL and contained no medical advice, only reference to PI. |
| S4.3 | pass (4) | deterministic validator: contact_set_per_case_type |
| S4.4 | pass (4) | Inquiry correctly entered with category, summary, and verbatim question. |
| S4.5 | pass (4) | Response was concise and on-inquiry, no extraneous information volunteered. |
| S4.6 | pass (4) | Correct SRL-CDZ-RENAL documented in response field, matching correct_srl. |
| S4.7 | pass (4) | Response correctly entered with reference to the standard letter used. |
| S4.8 | pass (4) | deterministic validator: received_date_match |
| S4.9 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S4.10 | pass (1) | Response route documented as phone, consistent with the live call channel. |
| S4.11 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S4.12 | pass (1) | Inquiry category correctly selected as Pharmacokinetics, matching ground truth. |
| S4.13 | pass (1) | deterministic validator: required_fields_present |
| S4.14 | pass (1) | deterministic validator: spelling_count |
| S5.1 | na | No off-label request was involved in this case (renal dosing per PI is on-label). |
| S5.2 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S5.3 | pass (8) | Response was neutral, factual, and non-promotional. |
| S5.4 | na | No escalation was required for this clean inquiry with no safety or special situation triggers. |
| S5.5 | na | No medical-advice-adjacent question was raised requiring HCP referral; caller was already an HCP asking a PK question. |

### B10. SC-10 — evaluator says: **PASS**

> Strong handling of a high-risk special-situation call. AE/PC Detection: the trainee correctly recognized the volunteered pregnancy exposure as a reportable special situation (not an AE/PC) and flagged/routed it to PV appropriately — no fabrication, no missed cue. Questioning Technique: excellent listen-and-clarify behavior — immediately captured LMP/gestational age and prescriber name without cold-probing for unrelated symptoms. Compliance/Regulatory risk: avoided the 'should I stop' trap perfectly by refusing to advise on continuing/discontinuing the anticonvulsant and redirecting urgently to the prescriber, citing the correct SRL (SRL-NEU-PREG) and mentioning the pregnancy registry — no promotional or off-label language issues. Documentation: all required intake, safety, and response fields were completed accurately and consistently with the transcript and received date; routing to PV was documented correctly. Empathy: tone was professional and non-condescending throughout a sensitive disclosure.

| Criterion | Result | Evidence / rationale |
|---|---|---|
| S1.1 | pass (3) | "this is Alex Reed speaking" |
| S1.2 | pass (3) | "Happy to help with that." |
| S1.3 | pass (4) | "Can you tell me your estimated due date or last menstrual period, and who your prescribing physician is?" |
| S1.4 | na |  |
| S1.5 | pass (4) | "Based on SRL-NEU-PREG, here's what our approved information says..." |
| S4.1 | pass (5) | Correct product (Neurovance) selected and documented. |
| S4.2 | pass (5) | Response was based on the approved SRL and explicitly avoided giving medical/treatment advice, deferring to prescriber. |
| S4.3 | pass (4) | deterministic validator: contact_set_per_case_type |
| S4.4 | pass (4) | Inquiry logged with category Safety and summary reflecting the pregnancy exposure question. |
| S4.5 | pass (4) | Response stayed on-topic, addressing the pregnancy exposure and registry without volunteering unrelated information. |
| S4.6 | pass (4) | Correct SRL (SRL-NEU-PREG) cited in transcript and documented in response field. |
| S4.7 | pass (4) | Response summary and reference documented adequately reflecting the verbal answer given. |
| S4.8 | pass (4) | deterministic validator: received_date_match |
| S4.9 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S4.10 | pass (1) | Response route (phone, verbal) documented and appropriate for a live call. |
| S4.11 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S4.12 | pass (1) | Case category correctly selected as Safety, matching the pregnancy exposure special situation. |
| S4.13 | pass (1) | deterministic validator: required_fields_present |
| S4.14 | pass (1) | deterministic validator: spelling_count |
| S5.1 | na | No off-label information was requested or volunteered in this case. |
| S5.2 | pass (10) | Pregnancy exposure special situation was correctly identified, flagged, and documented. |
| S5.3 | pass (8) | Response was balanced, non-promotional, and focused on safety/registry information and referral to prescriber. |
| S5.4 | pass (8) | Routed to PV as required, correctly reflected in routing fields. |
| S5.5 | pass (2) | Patient was explicitly and appropriately referred to her prescriber for the treatment decision, avoiding the 'should I stop' trap. |

### B11. SC-11 — evaluator says: **PASS**

> Strong performance on AE/PC Detection and Compliance: the trainee caught the volunteered dose-increase cue in real time, clarified it appropriately (duration, ongoing status) without over-probing or fabricating a false AE, obtained consent to contact the HCP, and correctly flagged it as a lack-of-effect special situation routed to PV. The disposal question was answered with general, non-promotional safety guidance while explicitly declining to give dosing/INR advice and redirecting the caller to their prescriber — exactly the correct compliance handling for this embedded medical-advice-risk trap. Documentation is complete, consistent, and well-organized across intake, safety, and response fields, with correct routing and no spelling issues.

| Criterion | Result | Evidence / rationale |
|---|---|---|
| S1.1 | pass (3) | "this is Alex Reed speaking" |
| S1.2 | pass (3) | Professional and courteous tone throughout, no condescension. |
| S1.3 | pass (4) | "Before we go further — you mentioned... Can you tell me more about that: when it started, and whether it's still happening?" |
| S1.4 | na |  |
| S1.5 | pass (4) | No slang, jargon, or unexplained acronyms used; clear plain language. |
| S4.1 | pass (5) | Correct product Cardizan selected in documentation. |
| S4.2 | pass (5) | Response was general disposal guidance with explicit refusal to advise on dosing/INR, consistent with PI/SOP; no medical advice given. |
| S4.3 | pass (4) | deterministic validator: contact_set_per_case_type |
| S4.4 | pass (4) | Inquiry captured with summary and category in database; special situation flagged. |
| S4.5 | pass (4) | Response stayed on-inquiry (disposal) and did not volunteer unrelated information. |
| S4.6 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S4.7 | pass (4) | Response summary and detail level documented in customization_notes and verbal_answer_given fields; no SRL reference needed since correct_srl is none. |
| S4.8 | pass (4) | deterministic validator: received_date_match |
| S4.9 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S4.10 | pass (1) | Response route (phone, routed to PV) is appropriate and documented. |
| S4.11 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S4.12 | pass (1) | Inquiry category 'Other' selected, consistent with the ground-truth inquiry_category 'other'. |
| S4.13 | pass (1) | deterministic validator: required_fields_present |
| S4.14 | pass (1) | deterministic validator: spelling_count |
| S5.1 | na | No off-label information was requested or volunteered; off_label_involved is false in the key. |
| S5.2 | pass (10) | Lack-of-effect special situation correctly identified, clarified, and flagged in documentation. |
| S5.3 | pass (8) | Response was balanced, factual disposal guidance with no promotional language. |
| S5.4 | pass (8) | Correct escalation route (PV) selected and documented in routing_single field, matching correct_routes. |
| S5.5 | pass (2) | Caller was referred to prescriber for dosing/INR questions, appropriately deflecting medical-advice-adjacent content. |

### B12. SC-12 — evaluator says: **PASS**

> Strong performance on a high-difficulty embedded-AE case. AE/PC Detection: The trainee correctly caught the easily-missable volunteered cue ('being treated over at the hospital') in beat 2 rather than letting it pass to answer only the tidy vaccine-interaction question — this is exactly the listen-and-clarify skill being tested, and it surfaced a reportable serious AE (hospitalization for pneumonia on a TNF-class product). Questioning Technique: The clarifying question was well-framed, quoting the caller's own words back and asking for onset/status — not fishing, just clarifying an actual cue, which is the correct approach. Compliance: No off-label material was introduced, and the trainee appropriately declined to give clinical management advice for the infection, redirecting to the treating HCP — good regulatory-risk control. Documentation: All required fields were completed — AE description, four-element test, seriousness, correct SRL citation, correct PV routing, and consistent received/routing dates. Contact info was captured in full per HCP case-type requirements.

| Criterion | Result | Evidence / rationale |
|---|---|---|
| S1.1 | pass (3) | "this is Alex Reed speaking" |
| S1.2 | pass (3) | Professional and empathetic tone throughout, no condescension. |
| S1.3 | pass (4) | "you mentioned 'They were just being treated over at the hospital, so I want to sort the vaccine out before discharge.' a moment ago. Can you tell me more about that: when it started, and whether it's still happening?" |
| S1.4 | na |  |
| S1.5 | pass (3) | No slang/jargon/acronyms used inappropriately. |
| S2.1 | pass (10) | AE (hospitalization for pneumonia while on Immunexa) was correctly identified and clarified per ground truth. |
| S2.2 | pass (10) | deterministic validator: report_timeframe |
| S2.3 | pass (10) | Routed to PV, matching correct_routes. |
| S2.4 | pass (8) |  |
| S2.5 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S2.6 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S2.7 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S2.8 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S2.9 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S2.10 | pass (2) | deterministic validator: received_date_match |
| S4.1 | pass (5) | Correct product Immunexa selected. |
| S4.2 | pass (5) | Response based on SRL, no medical advice given; caller referred to HCP for treatment. |
| S4.3 | pass (4) | deterministic validator: contact_set_per_case_type |
| S4.4 | pass (4) | Inquiry correctly entered in database with category and summary. |
| S4.5 | pass (4) | Response was concise and on-inquiry, addressing vaccine timing without extraneous info. |
| S4.6 | pass (4) | Correct SRL cited and documented in response field. |
| S4.7 | pass (4) | Response correctly entered with SRL reference and summary of verbal answer given. |
| S4.8 | pass (4) | deterministic validator: received_date_match |
| S4.9 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S4.10 | pass (1) | Response route (phone, verbal) appropriate and documented. |
| S4.11 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S4.12 | pass (1) | Inquiry category correctly selected as Drug-Interactions. |
| S4.13 | pass (1) | deterministic validator: required_fields_present |
| S4.14 | pass (1) | deterministic validator: spelling_count |
| S5.1 | na | No off-label information was requested or volunteered in this case. |
| S5.2 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S5.3 | pass (8) | Response was balanced, non-promotional, sourced from approved SRL. |
| S5.4 | pass (8) | Correct escalation route (PV) selected and documented in routing fields. |
| S5.5 | pass (2) | Caller referred to HCP for treatment/clinical management decisions regarding the infection. |
