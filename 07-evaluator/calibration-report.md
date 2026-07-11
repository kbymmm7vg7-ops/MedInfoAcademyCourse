# Evaluator calibration report (S4)

_Generated 2026-07-11T18:16:26.706Z · model claude-sonnet-5 · eval-prompt-v1 · rubric v1.0_

## Definition-of-done gate

| Gate | Result |
|---|---|
| Gold examples → `pass` | 12/12 ✅ |
| Non-empty `expected_critical_fail` → trips exact Critical(s) | 19/19 ✅ |
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
| SC-11-failure-3-wrongSrl | failure | — | pass | info |
| SC-11-failure-4-overFlagAe | failure | — | fail | info |
| SC-12-gold | gold | (pass) | pass | match |
| SC-12-failure-1-missedCue | failure | S2.1 | fail | match |
| SC-12-failure-2-noPvRouteNotFlaggedSerious | failure | S2.3 | fail | match |
| SC-12-failure-3-wrongSrl | failure | — | fail | info |

## Deduction fixtures (informational)

- `SC-01-failure-2-overFlagAe`: deduction fixture — overall fail; failing: S1.3, S2.1, S4.5
- `SC-01-failure-3-wrongSrl`: deduction fixture — overall fail; failing: S4.2, S4.6, S4.7
- `SC-02-failure-1-wrongContactSet`: deduction fixture — overall pass; failing: none
- `SC-02-failure-3-wrongSrl`: deduction fixture — overall fail; failing: S4.2, S4.6, S4.7
- `SC-03-failure-2-aeNotDocumented`: deduction fixture — overall fail; failing: S2.1, S2.4, S4.4, S5.4
- `SC-03-failure-3-aeNotDocumented`: deduction fixture — overall fail; failing: S2.1, S2.3, S2.4
- `SC-04-failure-3-missingPcIdentifiers`: deduction fixture — overall fail; failing: S3.6
- `SC-04-failure-4-noRetrieval`: deduction fixture — overall pass; failing: S1.5
- `SC-05-failure-3-admitCausation`: deduction fixture — overall fail; failing: S1.2, S4.2, S5.3
- `SC-05-failure-4-omitLegalComms`: deduction fixture — overall fail; failing: S2.3, S4.10, S5.2, S5.4
- `SC-06-failure-2-wrongSrl`: deduction fixture — overall fail; failing: S4.7
- `SC-06-failure-3-omitLegalComms`: deduction fixture — overall fail; failing: S5.4
- `SC-07-failure-2-spokespersonStatement`: deduction fixture — overall fail; failing: S1.1, S1.3, S4.2, S4.5, S4.7, S4.10, S5.2, S5.3, S5.4
- `SC-07-failure-3-omitLegalComms`: deduction fixture — overall fail; failing: S5.4
- `SC-08-failure-3-aeNotDocumented`: deduction fixture — overall fail; failing: S2.1, S2.3, S2.4, S4.4
- `SC-09-failure-1-wrongSrl`: deduction fixture — overall fail; failing: S4.2, S4.6, S4.7, S4.10
- `SC-09-failure-2-wrongContactSet`: deduction fixture — overall fail; failing: S4.3, S4.10
- `SC-10-failure-3-overFlagAe`: deduction fixture — overall fail; failing: S1.3, S2.1, S2.4, S4.5, S4.7
- `SC-11-failure-3-wrongSrl`: deduction fixture — overall pass; failing: none
- `SC-11-failure-4-overFlagAe`: deduction fixture — overall fail; failing: S1.3, S2.1, S4.2, S4.5
- `SC-12-failure-3-wrongSrl`: deduction fixture — overall fail; failing: S4.2, S4.6, S4.7

---

# Blind-scoring appendix (for Nathan)

Score each GOLD case yourself from the transcript + documentation **before** reading the evaluator's verdicts in Part B. The gate: **zero Critical-criterion disagreements, ≤1 Major disagreement per case.** 12 gold outputs below; the JSON report holds all 52 outputs (incl. failure fixtures) with full per-criterion evidence.

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
    "four_element_test": {
      "identifiable_patient": true,
      "identifiable_reporter": true,
      "suspect_product": true,
      "event": true
    },
    "ae_description": "Intercurrent adverse event: the patient on Cardizan has developed a sinus infection (an antibiotic is being prescribed for it); patient otherwise stable and asymptomatic. Captured for PV to assess regardless of suspected causality — an intercurrent illness reported on therapy is a reportable AE.",
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
5. **trainee**: You mentioned Gastroquell isn't working right away for your heartburn — can I ask how long you've been taking it, and whether you've had any relief at all so far?
6. **persona**: About four days now, and honestly not much relief yet.
7. **trainee**: Thank you — I'm going to capture that lack of effect for our safety team to assess, and log a product complaint so our quality team can take a look as well. Do you have the package handy — could you read me the lot number and expiration date, and would you be able to keep it in case our quality team requests it?
8. **persona**: Sure — lot LOT-CALIB-0001, expires June 2027. I'll hang on to it.
9. **trainee**: Based on SRL-GAS-ONSET, here's what our approved information says about your question on Gastroquell: full symptom relief typically takes several days of consistent dosing; I'd encourage keeping to the regimen and checking with your pharmacist before changing the dose.
10. **persona**: That's helpful, thank you.
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
    "four_element_test": {
      "identifiable_patient": true,
      "identifiable_reporter": true,
      "suspect_product": true,
      "event": true
    },
    "ae_description": "Potential lack of effect: patient reports Gastroquell isn't working right away for their heartburn — no symptom relief yet on the current regimen, and the lack of relief is ongoing at the time of the call. Captured for PV to assess; flagging is not concluding the drug failed.",
    "onset_date": "",
    "ongoing": "yes",
    "seriousness": [],
    "pc_present": "yes",
    "pc_lot_number": "LOT-CALIB-0001",
    "pc_expiration_date": "2027-06-30",
    "pc_ndc": "0000-0000-01",
    "pc_sample_available": "yes",
    "pregnancy_or_lactation": false,
    "special_situations": [
      "lack_of_effect"
    ],
    "routing_dual": {
      "route_to_pv": true,
      "route_to_quality": true
    },
    "routing_single": [],
    "routed_within_timeframe_date": "2026-07-06"
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
7. **trainee**: Thank you. Because you've been taking Neurovance during the pregnancy, I'm going to record this as a safety report and route it to our safety team today — that's standard for any pregnancy exposure, even when there's no problem to report.
8. **persona**: Okay, that makes sense.
9. **trainee**: Based on SRL-NEU-PREG, here's what our approved information says about your question on Neurovance: there's a pregnancy exposure registry for Neurovance, and any decision about continuing or stopping needs to be made with your prescriber given the risks of abrupt discontinuation.
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
    "four_element_test": {
      "identifiable_patient": true,
      "identifiable_reporter": true,
      "suspect_product": true,
      "event": true
    },
    "ae_description": "Pregnancy exposure (reportable special situation entered as a safety report): patient approximately 6 weeks pregnant by last menstrual period with Neurovance exposure throughout; no adverse outcome reported. Exposure ongoing at the time of the call.",
    "onset_date": "",
    "ongoing": "yes",
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
    "four_element_test": {
      "identifiable_patient": true,
      "identifiable_reporter": true,
      "suspect_product": true,
      "event": true
    },
    "ae_description": "Potential lack of effect: on the lowest Cardizan dose for about six weeks the INR stayed below the target range at every check and was not responding to that dose, until the doctor increased it (subtherapeutic anticoagulation). No clot or bleed reported; resolved from the caller's perspective after the prescriber increased the dose. Captured for PV to assess; flagging is not concluding the drug failed.",
    "onset_date": "",
    "ongoing": "no",
    "seriousness": [],
    "pc_present": "yes",
    "pc_lot_number": "LOT-CALIB-0001",
    "pc_expiration_date": "2027-06-30",
    "pc_ndc": "0000-0000-01",
    "pc_sample_available": "yes",
    "pregnancy_or_lactation": false,
    "special_situations": [
      "lack_of_effect"
    ],
    "routing_dual": {
      "route_to_pv": true,
      "route_to_quality": true
    },
    "routing_single": [],
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

> This was a clean, well-organized HCP interaction call correctly identified, documented, and routed under the Drug-Interactions category with the right SRL (SRL-CDZ-INR) and complete contact capture. However, the case reveals a significant AE/PC Detection and Questioning Technique issue: the ground truth confirms the patient was stable/asymptomatic with no true adverse event cue to surface, yet the trainee unilaterally declared the incidental mention of a sinus infection/antibiotic prescription to be a reportable AE without any listen-and-clarify exchange to confirm an actual event, symptom, or reporter concern. This is a fabricated/over-flagged AE — the skill required is catching and clarifying volunteered cues, not treating incidental clinical context as an automatic safety signal. In a live QA environment, this kind of over-reporting creates downstream PV workload, may trigger unnecessary follow-up outreach to the HCP, and reflects poorly on judgment around what truly qualifies as reportable versus routine clinical background. Coaching focus: reinforce the distinction between "listening for volunteered AE cues" versus "manufacturing AE reports from incidental details" — future calls should include a brief clarifying question (e.g., "was there any adverse reaction to the antibiotic or Cardizan itself?") before committing to a formal AE capture, rather than assuming reportability outright.

| Criterion | Result | Evidence / rationale |
|---|---|---|
| S1.1 | pass (3) | Thank you for calling Medical Information, this is Alex Reed speaking. |
| S1.2 | pass (3) | Professional and pleasant tone throughout, no condescension. |
| S1.3 | fail (1) | [5] TRAINEE: Since the patient developed the sinus infection while on Cardizan, I'm also going to capture that as an adverse event report and route it to our safety team — that's standard even when it appears unrelated to therapy. |
| S1.4 | na |  |
| S1.5 | pass (3) | No slang, jargon, or acronyms used inappropriately; clear phrasing. |
| S2.1 | pass (10) | Ground truth confirms ae_present=true (intercurrent sinus infection is reportable regardless of causality); trainee identified and captured it as an AE, matching the key. |
| S2.2 | na | No AE/PC documented or no SOP timeframe for this case. |
| S2.3 | pass (10) | Routed to PV, matching correct_routes in the key. |
| S2.4 | pass (8) |  |
| S2.5 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S2.6 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S2.7 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S2.8 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S2.9 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S2.10 | pass (2) | deterministic validator: received_date_match |
| S4.1 | pass (5) | Correct product Cardizan selected. |
| S4.2 | pass (5) | Response based on cited SRL, no medical advice given; on-label interaction info per PI. |
| S4.3 | pass (4) | deterministic validator: contact_set_per_case_type |
| S4.4 | pass (4) | MI request (drug interaction inquiry) correctly entered in database. |
| S4.5 | pass (4) | Response was concise and on-inquiry, limited to antibiotic-INR interaction classes. |
| S4.6 | pass (4) | Correct SRL cited and documented in response field. |
| S4.7 | pass (4) | Response correctly entered with SRL reference and summary of the interaction guidance. |
| S4.8 | pass (4) | deterministic validator: received_date_match |
| S4.9 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S4.10 | pass (1) | Response delivered via phone, matching contact channel; documented appropriately. |
| S4.11 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S4.12 | pass (1) | Drug-Interactions category correctly selected matching inquiry_category in key. |
| S4.13 | pass (1) | deterministic validator: required_fields_present |
| S4.14 | pass (1) | deterministic validator: spelling_count |
| S5.1 | na |  |
| S5.2 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S5.3 | pass (8) | No promotional language; response was balanced and factual, citing PI-based interaction classes. |
| S5.4 | pass (8) | Escalation route to PV correctly selected and documented. |
| S5.5 | na | No medical-advice-adjacent question from a consumer/patient was posed; caller was an HCP asking a straightforward interaction question answered via approved SRL. |

### B2. SC-02 — evaluator says: **PASS**

> Strong performance overall. AE/PC Detection: the trainee correctly caught the volunteered lack-of-effect cue, captured it as both an AE and PC, and applied the required dual routing to PV and Quality — matching the ground truth exactly. Questioning Technique: the trainee used a listen-and-clarify approach rather than probing, appropriately confirming requester type and asking only about the duration/relief the caller had already raised, which also correctly surfaced the ambiguous-requester detail (patient, not HCP). Compliance: no off-label content was involved, and the trainee properly redirected the dosing-adjacent question to the pharmacist without giving medical advice — good regulatory-risk management. Documentation: all required fields (lot, expiration, NDC, sample availability, AE/PC descriptions, dual-routing flags, SRL citation) were completed accurately and match the gold answer key almost verbatim. Empathy: tone was professional and warm throughout the call.

| Criterion | Result | Evidence / rationale |
|---|---|---|
| S1.1 | pass (4) | Thank you for calling Medical Information, this is Alex Reed speaking. |
| S1.2 | pass (3) | Happy to help with that. |
| S1.3 | pass (3) | You mentioned Gastroquell isn't working right away for your heartburn — can I ask how long you've been taking it, and whether you've had any relief at all so far? |
| S1.4 | na |  |
| S1.5 | pass (3) | No jargon or acronyms present in trainee's turns. |
| S2.1 | pass (10) | Lack of effect AE correctly identified and documented, matching ground truth. |
| S2.2 | pass (10) | deterministic validator: report_timeframe |
| S2.3 | pass (10) | Dual routing to PV and Quality correctly flagged, matching required correct_routes. |
| S2.4 | pass (8) | AE description is clear, concise, sequential, and matches the ground-truth wording closely. |
| S2.5 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S2.6 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S2.7 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S2.8 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S2.9 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S2.10 | pass (2) | deterministic validator: received_date_match |
| S3.1 | pass (10) | Product complaint identified alongside the AE, consistent with ground truth pc_present true. |
| S3.2 | pass (10) | deterministic validator: report_timeframe |
| S3.3 | pass (10) | Routed to quality team as required for the PC. |
| S3.4 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S3.5 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S3.6 | pass (8) | deterministic validator: pc_identifiers |
| S3.7 | pass (8) | Availability of suspect product documented as available (patient will keep it). |
| S3.8 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S3.9 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S3.10 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S3.11 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S3.12 | pass (2) | deterministic validator: received_date_match |
| S4.1 | pass (5) | Correct product Gastroquell selected. |
| S4.2 | pass (5) | Response based on approved SRL; no medical advice given, only referred to pharmacist/HCP for dose questions. |
| S4.3 | pass (4) | deterministic validator: contact_set_per_case_type |
| S4.4 | pass (4) | Inquiry logged in database with correct category and product. |
| S4.5 | pass (4) | Response stayed on-topic, addressing onset of relief without extraneous information. |
| S4.6 | pass (4) | Correct SRL-GAS-ONSET cited and documented in response field. |
| S4.7 | pass (4) | Response summary and reference correctly entered. |
| S4.8 | pass (4) | deterministic validator: received_date_match |
| S4.9 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S4.10 | pass (1) | Response route (phone) appropriate and documented. |
| S4.11 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S4.12 | pass (1) | Case category correctly selected as Efficacy. |
| S4.13 | pass (1) | deterministic validator: required_fields_present |
| S4.14 | pass (1) | deterministic validator: spelling_count |
| S5.1 | na |  |
| S5.2 | pass (10) | Lack-of-effect special situation correctly flagged. |
| S5.3 | pass (8) | Response was balanced, non-promotional, and directed caller to pharmacist for dosing. |
| S5.4 | pass (8) | Dual routing to PV and Quality documented in routing fields as required. |
| S5.5 | pass (2) | Caller appropriately referred to pharmacist for dose-related decision rather than receiving medical advice. |

### B3. SC-03 — evaluator says: **PASS**

> Strong call overall. AE/PC Detection: the trainee correctly caught the caller's fragmented, volunteered cue ('s been a bit shaky lately, but that') and clarified it without over-probing — this is exactly the listen-and-clarify skill the scorecard rewards, and it surfaced a real AE (tremor + palpitations) that matched the ground truth. Documentation of the AE description, routing to PV, and timeframe were all correct and complete. Questioning Technique (S1.3) was excellent — verbatim re-quote of the caller's own words to prompt clarification is a model approach. Compliance: response stayed on-label, non-promotional, and appropriately deferred treatment questions to the prescriber, with consent to contact HCP obtained. One documentation gap: the resolution/closure notes lack a substantive narrative closing out the AE handling (S2.9) — only checklist booleans are present, with no free-text confirmation of case completion or next steps. In live QA this would likely just need a one-line closure note to fully close the loop.

| Criterion | Result | Evidence / rationale |
|---|---|---|
| S1.1 | pass (3) | "this is Alex Reed speaking" |
| S1.2 | pass (3) | "Happy to help with that." |
| S1.3 | pass (4) | "you mentioned \"s been a bit shaky lately, but that\" a moment ago. Can you tell me more about that: when it started, and whether it's still happening?" |
| S1.4 | na |  |
| S1.5 | pass (3) | N/A - no jargon present |
| S2.1 | pass (10) | AE (tremor and palpitations) correctly identified after catching the volunteered cue, matching ground truth. |
| S2.2 | pass (10) | deterministic validator: report_timeframe |
| S2.3 | pass (10) | Routed to PV per correct_routes, matching ground truth single-route requirement. |
| S2.4 | pass (8) |  |
| S2.5 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S2.6 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S2.7 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S2.8 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S2.9 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S2.10 | pass (2) | deterministic validator: received_date_match |
| S4.1 | pass (5) | Correct product Pulmonara selected. |
| S4.2 | pass (5) | Response based on SRL-PUL-CANDID with no medical advice; caller referred to prescriber for treatment decisions. |
| S4.3 | pass (4) | deterministic validator: contact_set_per_case_type |
| S4.4 | pass (4) | Inquiry entered in database with category and summary captured. |
| S4.5 | pass (4) | Response stayed on-inquiry (mouth-rinse question) without volunteering unrelated information. |
| S4.6 | pass (4) | Correct SRL cited and documented in response field. |
| S4.7 | pass (4) | Response correctly entered with reference to SRL and summary of verbal answer. |
| S4.8 | pass (4) | deterministic validator: received_date_match |
| S4.9 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S4.10 | pass (1) | Response route (phone, verbal) documented appropriately. |
| S4.11 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S4.12 | pass (1) | Case question category appropriately selected as 'Other' matching ground truth inquiry_category. |
| S4.13 | pass (1) | deterministic validator: required_fields_present |
| S4.14 | pass (1) | deterministic validator: spelling_count |
| S5.1 | na | No off-label information was volunteered or requested in this case. |
| S5.2 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S5.3 | pass (8) | Response was balanced, non-promotional, sourced from approved SRL. |
| S5.4 | pass (8) | Correct escalation route (PV) selected and documented in routing_single field, matching ground truth correct_routes. |
| S5.5 | pass (2) | Caller appropriately referred to prescriber for treatment/dosing decisions related to the tremor/palpitations. |

### B4. SC-04 — evaluator says: **PASS**

> Strong overall handling of a complex dual PC/AE case. AE/PC Detection: Trainee correctly caught both the volunteered PC cue (cloudy solution/bent needle) and the offhand AE cue ("felt a bit off since"), clarifying each per the listen-and-clarify standard rather than fishing — matching the ground truth exactly, and routed dual to PV+Quality correctly. Questioning Technique: Excellent re-engagement on the volunteered detail ("Before we go further, you mentioned..."), a good model of catching cues without over-probing. Compliance: No medical advice given; appropriately referred to HCP/ER for the hypocalcemia-adjacent symptom, non-promotional tone maintained throughout. Documentation: Most required fields are complete and accurate (contact, product, SRL, dual routing, PC identifiers), but resolution/closure fields are thin — onset_date was left blank despite the AE description specifying "onset hours after injection," and neither the AE nor PC resolution notes summarize next steps or completion status in the resolution fields. In a live QA environment this would trigger a minor documentation deficiency at audit even though the safety-critical routing and identification were done correctly.

| Criterion | Result | Evidence / rationale |
|---|---|---|
| S1.1 | pass (4) | "this is Alex Reed speaking" |
| S1.2 | pass (3) | "I'd like to make sure this gets captured for our safety team..." |
| S1.3 | pass (3) | "Before we go further — you mentioned... Can you tell me more about that: when it started, and whether it's still happening?" |
| S1.4 | na |  |
| S1.5 | pass (3) | N/A - no jargon present in transcript |
| S2.1 | pass (10) | AE (perioral tingling/numbness, possible hypocalcemia) was identified and captured matching ground truth. |
| S2.2 | pass (10) | deterministic validator: report_timeframe |
| S2.3 | pass (10) | Dual routing to PV and Quality documented as required. |
| S2.4 | pass (8) |  |
| S2.5 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S2.6 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S2.7 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S2.8 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S2.9 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S2.10 | pass (2) | deterministic validator: received_date_match |
| S3.1 | pass (10) | PC (cloudy solution, bent needle) identified and documented matching ground truth. |
| S3.2 | pass (10) | deterministic validator: report_timeframe |
| S3.3 | pass (10) | Routed to Quality as required for PC alongside PV for AE. |
| S3.4 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S3.5 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S3.6 | pass (8) | deterministic validator: pc_identifiers |
| S3.7 | pass (8) | Suspect product availability documented as available. |
| S3.8 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S3.9 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S3.10 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S3.11 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S3.12 | pass (2) | deterministic validator: received_date_match |
| S4.1 | pass (5) | Correct product (Osteveda) selected. |
| S4.2 | pass (5) | Response cited approved SRL and referred to HCP without giving medical advice. |
| S4.3 | pass (4) | deterministic validator: contact_set_per_case_type |
| S4.4 | pass (4) | MI request (the 'other' inquiry re: replacement/complaint) correctly entered. |
| S4.5 | pass (4) | Response stayed on-inquiry, addressed the symptom and referred to HCP without volunteering unrelated info. |
| S4.6 | pass (4) | Correct SRL documented in response field. |
| S4.7 | pass (4) | Response correctly entered with SRL reference and summary of what was conveyed. |
| S4.8 | pass (4) | deterministic validator: received_date_match |
| S4.9 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S4.10 | pass (1) | Response route (phone) appropriate and documented. |
| S4.11 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S4.12 | pass (1) | Case categorized appropriately as Other given the dual PC/AE nature. |
| S4.13 | pass (1) | deterministic validator: required_fields_present |
| S4.14 | pass (1) | deterministic validator: spelling_count |
| S5.1 | na |  |
| S5.2 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S5.3 | pass (8) | Response was balanced, non-promotional, focused on safety referral. |
| S5.4 | pass (8) | Correct dual escalation route (PV + Quality) selected and documented. |
| S5.5 | pass (2) | Caller appropriately referred to HCP for the medical-advice-adjacent symptom question. |

### B5. SC-05 — evaluator says: **PASS**

> Strong performance on a high-difficulty hostile/legal-threat case. AE/PC Detection: the trainee correctly identified the serious AE (blistering rash, mouth sores, hospitalization, possible SJS) exactly as the caller volunteered it, without fabricating additional symptoms — a clean listen-and-clarify catch. Both special situations (legal, media) were correctly flagged and dual-routed to PV, Legal, Communications, and Supervisor, matching the required escalation route. Questioning Technique: the trainee de-escalated skillfully before eliciting clinical details, modeling the correct 'clarify, don't probe' approach. Compliance/Regulatory risk: excellent — the trainee explicitly declined to confirm causation or admit fault, and redirected treatment/dosing decisions to the prescribing physician, avoiding both promotional language and medical advice. Documentation: overall thorough and complete (contact info, SRL citation, routing, resolution notes), with one gap — the onset_date field was left blank even though the AE description clearly states onset ~2 weeks after starting the drug; this timeline detail should be captured in the structured onset field, not just narrative text, to support downstream PV timeline analysis.

| Criterion | Result | Evidence / rationale |
|---|---|---|
| S1.1 | pass (3) | Thank you for calling Medical Information, this is Alex Reed speaking. |
| S1.2 | pass (4) | I hear how frightening this has been, and I want to make sure your mother gets the right care. |
| S1.3 | pass (4) | Happy to help with that. Could I get your name, and are you calling as a healthcare provider, caregiver, or on your own behalf? |
| S1.4 | na |  |
| S1.5 | pass (4) | N/A - clean language throughout |
| S2.1 | pass (10) | Serious AE (blistering rash, mouth sores, hospitalization, possible SJS) correctly identified and documented matching ground truth. |
| S2.2 | pass (10) | deterministic validator: report_timeframe |
| S2.3 | pass (10) | Routed dual to PV and to Legal/Communications/Supervisor per case's dual routing requirement matching ground truth correct_routes. |
| S2.4 | pass (8) | AE description is clear, concise, and sequential covering rash, mouth sores, hospitalization, suspected SJS, and onset timing. |
| S2.5 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S2.6 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S2.7 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S2.8 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S2.9 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S2.10 | pass (2) | deterministic validator: received_date_match |
| S4.1 | pass (5) | Correct product Neurovance selected, matching ground truth. |
| S4.2 | pass (5) | Response was based on approved SRL and PI, refused to speculate on causation, and gave no medical advice. |
| S4.3 | pass (4) | deterministic validator: contact_set_per_case_type |
| S4.4 | pass (4) | Inquiry entered into database with category and summary correctly captured. |
| S4.5 | pass (4) | Response stayed on-inquiry, referencing the SRL and redirecting to HCP without volunteering unrelated information. |
| S4.6 | pass (4) | Correct SRL (SRL-NEU-RASH) cited and documented in response field, matching ground truth correct_srl. |
| S4.7 | pass (4) | Response summary correctly entered with reference to SRL and HCP redirection captured in verbal_answer_given. |
| S4.8 | pass (4) | deterministic validator: received_date_match |
| S4.9 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S4.10 | pass (1) | Response route (phone) documented appropriately and consistent with voice channel. |
| S4.11 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S4.12 | pass (1) | Case question category correctly selected as Safety, matching ground truth inquiry_category. |
| S4.13 | pass (1) | deterministic validator: required_fields_present |
| S4.14 | pass (1) | deterministic validator: spelling_count |
| S5.1 | na |  |
| S5.2 | pass (10) | Both legal and media special situations correctly identified and flagged, matching ground truth special_situations. |
| S5.3 | pass (8) | Response was balanced and non-promotional; trainee explicitly avoided confirming causation or fault. |
| S5.4 | pass (8) | Escalation route documented across routing_dual (PV) and routing_single (Legal, Communications, Supervisor) fields matching ground truth correct_routes of pv, legal, communications, supervisor. |
| S5.5 | pass (2) | Caller was appropriately referred to the treating physician for causation and treatment/dosing decisions. |

### B6. SC-06 — evaluator says: **PASS**

> Strong handling of a high-stakes internal compliance trap. Alex identified the off-label efficacy request from an internal sales rep, held the line clearly and professionally even after mild pushback ('can you at least tell me if it works... off the record'), and correctly explained why MI could not share off-label data for promotional use. The case was properly routed to Medical Affairs and documentation (requester type, off-label flag, routing) matches the required fields and ground truth. No AE/PC was present and none was fabricated — good discipline in not over-flagging. Contact info, product selection, and inquiry categorization were all correctly captured; no medical advice or promotional language crept into the response.

| Criterion | Result | Evidence / rationale |
|---|---|---|
| S1.1 | pass (4) | Thank you for calling Medical Information, this is Alex Reed speaking. |
| S1.2 | pass (3) | I understand you're trying to help your customer, but I'm not able to share efficacy data for an unapproved use |
| S1.3 | pass (4) | Could I get your name, and are you calling as a healthcare provider, caregiver, or on your own behalf? |
| S1.4 | na |  |
| S1.5 | pass (3) | N/A - no jargon present in transcript |
| S4.1 | pass (5) | Correct product (Immunexa) selected and documented. |
| S4.2 | pass (5) | No medical advice given; response restricted to compliance explanation, consistent with PI/SOP for off-label requests. |
| S4.3 | pass (4) | deterministic validator: contact_set_per_case_type |
| S4.4 | pass (4) | Inquiry logged with category, product, and summary reflecting the off-label efficacy request. |
| S4.5 | pass (4) | Response stayed on-topic, declining off-label data without volunteering extra unrelated information. |
| S4.6 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S4.7 | pass (4) | Response summary correctly reflects verbal answer given and rationale; no fabricated references. |
| S4.8 | pass (4) | deterministic validator: received_date_match |
| S4.9 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S4.10 | pass (1) | Response route (phone/verbal) documented and appropriate to how the case was received. |
| S4.11 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S4.12 | pass (1) | Case categorized correctly as Efficacy inquiry. |
| S4.13 | pass (1) | deterministic validator: required_fields_present |
| S4.14 | pass (1) | deterministic validator: spelling_count |
| S5.1 | pass (10) | Trainee correctly refused to volunteer off-label efficacy data despite mild pushback, explained the compliance boundary, and routed properly instead of answering promotionally. |
| S5.2 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S5.3 | pass (8) | Language was neutral and non-promotional; no product claims were made. |
| S5.4 | pass (8) | Routed to Medical Affairs matches the correct_routes in the key, and is reflected in routing_single field. |
| S5.5 | na | No medical-advice-adjacent question directed at a patient/consumer; requester is an internal sales rep, not seeking personal medical guidance. |

### B7. SC-07 — evaluator says: **PASS**

> Strong handling of a high-risk media edge case. The trainee correctly identified the journalist/media special situation early through active listening (clarifying caller type at the outset), avoided becoming an unauthorized spokesperson, made no causation statement about the boxed warning, and cleanly redirected to Corporate Communications while capturing full contact details. Documentation mirrors the verbal handling: special_situations flagged as 'media', routing captured to Communications and Supervisor, contact fields complete, and no AE/PC fabricated where none was present — good discipline avoiding over-flagging. All fixed/validator criteria pass and no regulatory or compliance red flags were found.

| Criterion | Result | Evidence / rationale |
|---|---|---|
| S1.1 | pass (3) | Thank you for calling Medical Information, this is Alex Reed speaking. |
| S1.2 | pass (3) | I'm not able to speak on the record or characterize the warning beyond what's in the approved labeling. |
| S1.3 | pass (3) | Could I get your name, and are you calling as a healthcare provider, caregiver, or on your own behalf? |
| S1.4 | na |  |
| S1.5 | pass (3) | I'll have our Corporate Communications team follow up with you directly |
| S4.1 | pass (5) | Correct product (Dermelia) selected and documented. |
| S4.2 | pass (5) | No medical advice or causation statement given; response limited to approved labeling framework and redirection. |
| S4.3 | pass (4) | deterministic validator: contact_set_per_case_type |
| S4.4 | pass (4) | Inquiry logged in the database with correct category (Safety) and summary reflecting the media/cancer-warning question. |
| S4.5 | pass (4) | Response was concise and on-inquiry; trainee did not volunteer any additional off-topic information or speculation. |
| S4.6 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S4.7 | pass (4) | Response summary accurately reflects the verbal exchange and redirect action; no misrepresentation of what was said. |
| S4.8 | pass (4) | deterministic validator: received_date_match |
| S4.9 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S4.10 | pass (1) | Response route (phone, redirect to Corporate Communications) is appropriate and documented. |
| S4.11 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S4.12 | pass (1) | Case question category correctly selected as Safety, matching the nature of the inquiry (media asking about boxed warning/cancer risk). |
| S4.13 | pass (1) | deterministic validator: required_fields_present |
| S4.14 | pass (1) | deterministic validator: spelling_count |
| S5.1 | pass (10) | No off-label information was involved or volunteered; trainee correctly declined to characterize the warning beyond approved labeling. |
| S5.2 | pass (10) | Media contact special situation correctly identified and flagged both verbally (routed to Corp Comms) and in documentation. |
| S5.3 | pass (8) | No promotional language used; response was neutral, declined causation, and redirected appropriately. |
| S5.4 | pass (8) | Escalation route correctly captured as Communications and Supervisor, matching the ground-truth correct_routes. |
| S5.5 | na | No medical-advice-adjacent question was posed by this journalist caller requiring an HCP referral; case is a media/compliance scenario, not a patient medical question. |

### B8. SC-08 — evaluator says: **PASS**

> Strong performance overall. AE/PC Detection: The trainee correctly caught the volunteered 'stings a bit' cue (S1.3), clarified it without over-probing, and accurately identified both the AE and the PC (S2.1/S3.1), routing dual to PV and Quality as required — a critical-criteria success. Compliance: No medical advice was given; the worsening rash was appropriately referred to the prescriber (S5.5), and the response stayed on-label and non-promotional (S5.1 na, S5.3 pass). Documentation: Most required fields (contact, product, lot/exp/NDC, routing flags, SRL) were completed accurately and on time. However, resolution/notes fields for both the AE and PC records (S2.9, S3.10) were left as generic checklist booleans without a substantive closure note — in a live QA environment this would raise questions about whether follow-up (e.g., HCP contact outcome, sample retrieval confirmation) was properly tracked to closure.

| Criterion | Result | Evidence / rationale |
|---|---|---|
| S1.1 | pass (4) | Agent stated name 'Alex Reed' in the opening greeting. |
| S1.2 | pass (4) | Professional, warm, non-condescending tone throughout, including when handling the sensitive AE disclosure. |
| S1.3 | pass (4) | Trainee caught the volunteered 'stings a bit' cue and clarified it directly without over-probing: 'Before we go further — you mentioned...Can you tell me more about that.' This is textbook listen-and-clarify. |
| S1.4 | na |  |
| S1.5 | pass (4) | No slang, jargon, or unexplained acronyms used; SRL reference was framed clearly for the caller. |
| S2.1 | pass (10) | AE was correctly identified per ground truth via the volunteered cue and captured in Safety tab ae_present='yes' with matching description. |
| S2.2 | pass (10) | deterministic validator: report_timeframe |
| S2.3 | pass (10) | Correct dual routing (PV + Quality) matches ground-truth correct_routes. |
| S2.4 | pass (8) |  |
| S2.5 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S2.6 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S2.7 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S2.8 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S2.9 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S2.10 | pass (2) | deterministic validator: received_date_match |
| S3.1 | pass (10) | PC correctly identified alongside AE, matching ground truth pc_present=true. |
| S3.2 | pass (10) | deterministic validator: report_timeframe |
| S3.3 | pass (10) | PC correctly routed to quality department as required by dual routing. |
| S3.4 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S3.5 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S3.6 | pass (8) | deterministic validator: pc_identifiers |
| S3.7 | pass (8) | Availability of suspect product (tube) documented correctly per caller's confirmation 'I'll hold on to the tube.' |
| S3.8 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S3.9 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S3.10 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S3.11 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S3.12 | pass (2) | deterministic validator: received_date_match |
| S4.1 | pass (5) | Correct product selected matching case. |
| S4.2 | pass (5) | Response based on approved SRL, no medical advice given directly; deferred to prescriber. |
| S4.3 | pass (4) | deterministic validator: contact_set_per_case_type |
| S4.4 | pass (4) | MI request correctly entered in database with category and verbatim question. |
| S4.5 | pass (4) | Concise, on-topic response with no unsolicited additional information. |
| S4.6 | pass (4) | Correct SRL documented matching ground truth correct_srl. |
| S4.7 | pass (4) | Response correctly entered with summary and reference to source. |
| S4.8 | pass (4) | deterministic validator: received_date_match |
| S4.9 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S4.10 | pass (1) | Response route (phone) appropriate and documented, consistent with voice channel. |
| S4.11 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S4.12 | pass (1) | Case question category appropriately selected matching ground truth inquiry_category 'other'. |
| S4.13 | pass (1) | deterministic validator: required_fields_present |
| S4.14 | pass (1) | deterministic validator: spelling_count |
| S5.1 | na |  |
| S5.2 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S5.3 | pass (8) | Response balanced, non-promotional, focused on safety and prescriber referral. |
| S5.4 | pass (8) | Correct dual escalation route (PV + Quality) documented matching ground truth correct_routes. |
| S5.5 | pass (2) | Caller appropriately referred to HCP/prescriber for the medical-advice-adjacent worsening rash question. |

### B9. SC-09 — evaluator says: **PASS**

> Solid, clean-inquiry handling on a tier-1 case. AE/PC Detection: correctly recognized no safety signal was present and did not fabricate or fish for one — good discipline per S1.3/S5.2 guidance. Compliance: response stayed strictly on-label, citing the correct SRL (SRL-CDZ-RENAL) with no promotional or off-label content — no regulatory risk noted. Documentation: contact info, product selection, inquiry category, SRL citation, and response route were all captured accurately and completely; fixed validator checks (S4.3, S4.8, S4.13, S4.14) all passed. Empathy/Questioning: tone was professional and courteous; agent appropriately confirmed there was nothing further to note without over-probing. One minor inconsistency: response.delivery_method was logged as "phone" while intake.contact_channel is also "phone" — consistent and correct here, but ensure channel fields are double-checked for cross-consistency in email/portal-based variants of similar cases. Overall this is a strong example of correct minimal, compliant, well-documented handling of a clean pharmacokinetics inquiry.

| Criterion | Result | Evidence / rationale |
|---|---|---|
| S1.1 | pass (3) | Thank you for calling Medical Information, this is Alex Reed speaking. |
| S1.2 | pass (3) | Tone is professional and pleasant throughout, no condescension. |
| S1.3 | pass (3) | Just to confirm, is there anything else about this you'd like me to note before we wrap up? |
| S1.4 | na |  |
| S1.5 | pass (3) | No slang, jargon, or unexplained acronyms used inappropriately; clinical terms like CrCl were used by the caller, not introduced improperly by agent. |
| S4.1 | pass (5) | Correct product Cardizan selected in documentation and referenced correctly in response. |
| S4.2 | pass (5) | Response was based on the correct SRL and contained no medical advice, only referencing PI-based guidance. |
| S4.3 | pass (4) | deterministic validator: contact_set_per_case_type |
| S4.4 | pass (4) | MI request (pharmacokinetics/renal dosing) correctly entered with category and summary in database record. |
| S4.5 | pass (4) | Response stayed on-inquiry, did not volunteer unrelated information. |
| S4.6 | pass (4) | Correct SRL (SRL-CDZ-RENAL) documented in response field matching the ground truth correct_srl. |
| S4.7 | pass (4) | Response summary and reference to SRL correctly entered in documentation matching what was delivered verbally. |
| S4.8 | pass (4) | deterministic validator: received_date_match |
| S4.9 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S4.10 | pass (1) | Response route (phone, matching the actual call channel) is documented appropriately. |
| S4.11 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S4.12 | pass (1) | Question category 'Pharmacokinetics' appropriately selected matching the inquiry_category in ground truth. |
| S4.13 | pass (1) | deterministic validator: required_fields_present |
| S4.14 | pass (1) | deterministic validator: spelling_count |
| S5.1 | na | No off-label information was requested or discussed; question was strictly on-label renal dosing per PI. |
| S5.2 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S5.3 | pass (8) | Response was factual, PI-based, and non-promotional in tone. |
| S5.4 | na | No escalation required per ground truth (dual_routing_required=false, correct_routes=[]). |
| S5.5 | na | Caller is an HCP (pharmacist) asking a dosing question directly relevant to their professional practice; no medical-advice-adjacent consumer referral was triggered. |

### B10. SC-10 — evaluator says: **PASS**

> Strong performance on a high-difficulty special-situation case. AE/PC Detection: the trainee correctly recognized the pregnancy exposure as a reportable safety event immediately upon the volunteered cue, without fabricating additional AEs — textbook listen-and-clarify. Questioning Technique: follow-up questions (LMP/gestational age, prescriber name) were precisely targeted at closing documentation gaps rather than probing for unrelated symptoms. Compliance/Regulatory risk: the trainee avoided the key trap of advising the patient to stop or continue her anticonvulsant, correctly redirecting to the prescriber and citing the abrupt-discontinuation risk — exactly per SOP. Documentation: all required fields (contact, ae_description, special_situation_flags, gestational age, prescriber, SRL citation, routing) were completed accurately and match the ground truth almost verbatim, with correct routing to PV within the 1-business-day SOP window.

| Criterion | Result | Evidence / rationale |
|---|---|---|
| S1.1 | pass (4) | "this is Alex Reed speaking" |
| S1.2 | pass (3) | "Happy to help with that." / "Thank you." |
| S1.3 | pass (4) | "Can you tell me your estimated due date or last menstrual period, and who your prescribing physician is?" |
| S1.4 | na |  |
| S1.5 | pass (4) | No slang/jargon/acronyms used in trainee dialogue. |
| S2.1 | pass (10) | Correctly identified pregnancy exposure as a reportable safety event, matching ground truth ae_present=true. |
| S2.2 | pass (10) | deterministic validator: report_timeframe |
| S2.3 | pass (10) | Routed to PV as required by correct_routes: ["pv"]. |
| S2.4 | pass (8) | Clear, concise, sequential description matching the ground-truth ae_description exactly. |
| S2.5 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S2.6 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S2.7 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S2.8 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S2.9 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S2.10 | pass (2) | deterministic validator: received_date_match |
| S4.1 | pass (5) | Correct product selected matching the case. |
| S4.2 | pass (5) | Response was based on approved SRL and avoided giving medical advice, correctly redirecting the 'should I stop' trap to the prescriber. |
| S4.3 | pass (4) | deterministic validator: contact_set_per_case_type |
| S4.4 | pass (4) | MI request captured in database with appropriate detail. |
| S4.5 | pass (4) | Response stayed on-topic and did not volunteer unrelated information. |
| S4.6 | pass (4) | Correct SRL matching the case's correct_srl was cited and documented. |
| S4.7 | pass (4) | Response correctly entered with reference to source document and detail level appropriate. |
| S4.8 | pass (4) | deterministic validator: received_date_match |
| S4.9 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S4.10 | pass (1) | Response route (phone) and safety routing (PV) documented appropriately. |
| S4.11 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S4.12 | pass (1) | Case correctly categorized as Safety given the pregnancy exposure special situation. |
| S4.13 | pass (1) | deterministic validator: required_fields_present |
| S4.14 | pass (1) | deterministic validator: spelling_count |
| S5.1 | na |  |
| S5.2 | pass (10) | Pregnancy exposure special situation correctly identified and flagged, matching ground truth. |
| S5.3 | pass (8) | Response was balanced, non-promotional, and safety-focused. |
| S5.4 | pass (8) | Correct escalation route (PV) selected and documented, matching correct_routes. |
| S5.5 | pass (2) | Patient appropriately referred to HCP for the medical-advice-adjacent 'should I stop' question, avoiding the discontinuation trap. |

### B11. SC-11 — evaluator says: **PASS**

> Strong performance on a difficult embedded-cue case. AE/PC Detection: the trainee caught the volunteered dose-increase cue mid-sentence, paused to clarify it properly (not by cold-probing but by reflecting the caller's own words back), and this correctly surfaced the full lack-of-effect detail per the reveal rule. Both the AE (subtherapeutic INR/LOE) and the associated PC (leftover lower-dose tablets) were identified, dual-routed to PV and Quality, and documented with lot/expiration/NDC captured. Questioning Technique was exemplary — used a listen-and-clarify approach rather than solicitation, exactly per the SOP standard. Compliance/Regulatory risk: the trainee explicitly declined to advise on dosing/INR target and appropriately redirected to the prescriber, correctly treating disposal guidance as general safety information rather than medical advice, and did not engage with the decoy SRLs (INR/renal) that would have constituted overreach. Documentation: all required fields were completed, dates/lot/expiration accurately transcribed, resolution and routing fields correctly reflect the dual PV/Quality escalation.

| Criterion | Result | Evidence / rationale |
|---|---|---|
| S1.1 | pass (4) | Thank you for calling Medical Information, this is Alex Reed speaking. |
| S1.2 | pass (3) | Happy to help with that. |
| S1.3 | pass (4) | Before we go further — you mentioned "My doctor bumped me up because the low dose wasn" a moment ago. Can you tell me more about that: when it started, and whether it's still happening? |
| S1.4 | na |  |
| S1.5 | pass (3) | For disposal of unused Cardizan, the safest approach is a pharmacy take-back program... |
| S2.1 | pass (10) | AE (potential lack of effect / subtherapeutic INR) correctly identified per ground truth. |
| S2.2 | pass (10) | deterministic validator: report_timeframe |
| S2.3 | pass (10) | Dual routing to PV and Quality correctly captured, matching required correct_routes. |
| S2.4 | pass (8) |  |
| S2.5 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S2.6 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S2.7 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S2.8 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S2.9 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S2.10 | pass (2) | deterministic validator: received_date_match |
| S3.1 | pass (10) | Product complaint (leftover tablets tied to the LOE) correctly identified alongside the AE. |
| S3.2 | pass (10) | deterministic validator: report_timeframe |
| S3.3 | pass (10) | PC routed to Quality as required by dual routing. |
| S3.4 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S3.5 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S3.6 | pass (8) | deterministic validator: pc_identifiers |
| S3.7 | pass (8) | Availability of suspect product documented (patient retains sample). |
| S3.8 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S3.9 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S3.10 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S3.11 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S3.12 | pass (2) | deterministic validator: received_date_match |
| S4.1 | pass (5) | Correct product (Cardizan) selected. |
| S4.2 | pass (5) | Response limited to general disposal guidance; no dosing/INR medical advice given; correctly avoided the decoy SRLs (INR/renal). |
| S4.3 | pass (4) | deterministic validator: contact_set_per_case_type |
| S4.4 | pass (4) | Inquiry entered with appropriate summary and category capturing both the disposal question and embedded LOE. |
| S4.5 | pass (4) | Response stayed on-topic (disposal) and did not volunteer unrelated info. |
| S4.6 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S4.7 | pass (4) | Response summary/detail level appropriately entered; no SRL needed since general guidance only. |
| S4.8 | pass (4) | deterministic validator: received_date_match |
| S4.9 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S4.10 | pass (1) | Response route (phone, verbal) appropriately documented. |
| S4.11 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S4.12 | pass (1) | Case category selected as 'Other', matching ground truth inquiry_category. |
| S4.13 | pass (1) | deterministic validator: required_fields_present |
| S4.14 | pass (1) | deterministic validator: spelling_count |
| S5.1 | na | No off-label information was requested or involved in this case per ground truth. |
| S5.2 | pass (10) | Lack-of-effect special situation correctly identified and flagged. |
| S5.3 | pass (8) | Response was balanced, factual, and non-promotional throughout. |
| S5.4 | pass (8) | Dual routing to PV and Quality correctly selected, matching required escalation targets. |
| S5.5 | pass (2) | Caller appropriately referred to prescriber/pharmacist for dosing/INR questions. |

### B12. SC-12 — evaluator says: **PASS**

> Strong performance on this difficult embedded-AE case. AE/PC Detection (S2.1): the trainee correctly caught the volunteered "treated at the hospital" cue in beat 2 and clarified it before proceeding, surfacing the serious AE (hospitalization for pneumonia on Immunexa) rather than letting it slide past to answer only the tidy vaccine-interaction question — this is exactly the target skill for this case tier. Questioning Technique (S1.3): the clarification was a clean listen-and-clarify (repeating the caller's own words and asking onset/status) rather than a fishing expedition, which is the correct approach. Compliance (S5.1/S5.3): no off-label content was introduced, and the response was properly grounded in SRL-IMM-VACC with an appropriate HCP referral for infection management, avoiding medical advice. Documentation across Section 2 and Section 4 was thorough and consistent between transcript and case record (AE description, seriousness flag, PV routing, contact fields, SRL citation all correctly captured). Regulatory risk (S5 criticals): AE correctly routed to PV within the 1-business-day SOP window with correct routing documentation. No significant gaps found in this transcript/documentation pair.

| Criterion | Result | Evidence / rationale |
|---|---|---|
| S1.1 | pass (4) | "this is Alex Reed speaking" |
| S1.2 | pass (3) | Professional and courteous tone throughout, no condescension. |
| S1.3 | pass (4) | TRAINEE caught the volunteered cue: "you mentioned 'They were just being treated over at the hospital...' Can you tell me more about that: when it started, and whether it's still happening?" — correctly clarified without over-probing. |
| S1.4 | na |  |
| S1.5 | pass (4) | No slang/jargon/acronyms used; clear plain language. |
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
| S5.1 | na | No off-label information was involved in this case per compliance.off_label_involved: false. |
| S5.2 | na | MVP documentation form has no field for this criterion (S4 calibration). |
| S5.3 | pass (8) |  |
| S5.4 | pass (8) |  |
| S5.5 | pass (2) |  |
