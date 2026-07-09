-- =========================================================================
-- MedInfo Academy — S2 seed data
-- =========================================================================
-- Idempotent seed for the shared B2C content bank (org_id is null throughout):
--   1. srd_documents      — 18 Standard Response Letters (fictional products)
--   2. case_templates     — 12 seed cases (SC-01 .. SC-12), ground_truth_json
--                            transcribed verbatim from 01-seed-cases/*.answer-key.json
--   3. SC-03 update       — scripted gold-path voice transcript
--
-- Safe to re-run: srd_documents and case_templates are upserted by natural key
-- (srl_code / case_code respectively); the SC-03 transcript is a plain update.
-- =========================================================================

-- =========================================================================
-- Part 1: srd_documents — 18 rows, one per SRL id in the fictional product bank
-- =========================================================================

-- srl_code has no unique constraint in 0001_init_schema.sql; add one scoped to
-- the shared B2C bank (org_id is null for all seed rows) so upsert-by-natural-key
-- is possible and this file is idempotent on repeat application.
create unique index if not exists uq_srd_documents_srl_code_shared
  on srd_documents (srl_code)
  where org_id is null;

insert into srd_documents (org_id, srl_code, title, therapeutic_area, body, is_decoy_eligible)
values (
  null,
  'SRL-CDZ-INR',
  'Cardizan & INR monitoring / interacting drugs',
  'anticoagulation',
  $gt$Cardizan (velanoxine) is indicated for reduction of stroke risk in non-valvular atrial fibrillation. Unlike some anticoagulants that require routine coagulation monitoring, Cardizan does not require routine INR monitoring for dose adjustment; INR assays are not a reliable measure of velanoxine's anticoagulant effect and should not be used to titrate the dose. Prescribers who order INR testing for an unrelated reason should be aware that Cardizan may produce mild, non-actionable prolongation of INR-based assays in some patients; this finding alone does not indicate over-anticoagulation and should not prompt a dose change.

Velanoxine has a narrow interaction profile centered on other agents that affect hemostasis or hepatic clearance. Concomitant use with other anticoagulants, antiplatelet agents (including aspirin and NSAIDs), and strong inhibitors or inducers of the relevant hepatic clearance pathway described in the Prescribing Information may increase bleeding risk or alter drug exposure. Patients starting or stopping any interacting medication, including over-the-counter NSAIDs or herbal supplements with antiplatelet activity, should have their overall bleeding-risk profile reassessed by the prescriber.

Health care professionals with questions about a specific interacting agent, or about switching a patient to or from Cardizan around a procedure, should consult the full Prescribing Information's Drug Interactions section and, for patient-specific dosing decisions, use clinical judgment supported by the patient's renal function and concomitant therapy. This information is not a substitute for the full Prescribing Information.

Fictional training document — not medical advice.$gt$,
  true
)
on conflict (srl_code) where org_id is null do update set
  title = excluded.title,
  therapeutic_area = excluded.therapeutic_area,
  body = excluded.body,
  is_decoy_eligible = excluded.is_decoy_eligible;

insert into srd_documents (org_id, srl_code, title, therapeutic_area, body, is_decoy_eligible)
values (
  null,
  'SRL-CDZ-RENAL',
  'Cardizan renal dosing',
  'anticoagulation',
  $gt$Cardizan (velanoxine) exposure increases as renal function declines, and dose adjustment based on creatinine clearance is described in the Prescribing Information. Prescribers and pharmacists should estimate creatinine clearance before initiating therapy and periodically thereafter, particularly in patients with fluctuating renal function, active illness, or new nephrotoxic medications, since a meaningful decline in renal function can shift a patient into a lower recommended dosing tier.

For patients with mild renal impairment, the standard maintenance dose described in the Prescribing Information is generally appropriate. For patients with moderate impairment, a reduced maintenance dose is recommended. Cardizan has not been adequately studied in patients with severe renal impairment or end-stage renal disease requiring dialysis, and use in these populations should be guided by the full Prescribing Information and individualized clinical judgment, weighing stroke-prevention benefit against bleeding risk.

Because renal clearance is a key determinant of velanoxine exposure, any new diagnosis of acute kidney injury, a significant creatinine rise, or initiation of a nephrotoxic co-medication should prompt renal function reassessment and consideration of dose adjustment per the Prescribing Information's renal dosing table. Pharmacists verifying a Cardizan dose against a patient's most recent creatinine clearance should refer to that table rather than extrapolating from other anticoagulants' renal dosing conventions.

Fictional training document — not medical advice.$gt$,
  true
)
on conflict (srl_code) where org_id is null do update set
  title = excluded.title,
  therapeutic_area = excluded.therapeutic_area,
  body = excluded.body,
  is_decoy_eligible = excluded.is_decoy_eligible;

insert into srd_documents (org_id, srl_code, title, therapeutic_area, body, is_decoy_eligible)
values (
  null,
  'SRL-CDZ-BLEED',
  'Cardizan bleeding risk management',
  'anticoagulation',
  $gt$Cardizan (velanoxine), like all anticoagulants indicated for stroke prevention in non-valvular atrial fibrillation, carries an inherent risk of bleeding, which can be serious and, rarely, fatal. The Prescribing Information describes gastrointestinal bleeding as the most commonly reported serious bleeding event in the pivotal trials described in the Prescribing Information. Risk factors that increase bleeding likelihood include concomitant antiplatelet or anticoagulant use, advanced age, renal impairment, and a prior history of GI bleeding or peptic ulcer disease.

Patients and caregivers should be counseled to seek prompt medical attention for signs of serious bleeding, including unusual bruising, pink or brown urine, red or black stools, prolonged bleeding from cuts, coughing up blood, or severe headache with neurological symptoms suggestive of intracranial hemorrhage. Health care professionals managing a patient with active or suspected bleeding on Cardizan should follow the reversal and supportive-care guidance in the full Prescribing Information; there is no requirement to discontinue therapy for minor, self-limited bruising alone, but any bleeding event should prompt clinical assessment.

Before invasive procedures or surgery, prescribers should consult the Prescribing Information's perioperative management section regarding appropriate timing for holding and resuming Cardizan based on renal function and bleeding risk of the procedure. Questions about a specific bleeding event in a patient should be directed to the treating clinician for individualized management; this document provides general labeled safety information only.

Fictional training document — not medical advice.$gt$,
  true
)
on conflict (srl_code) where org_id is null do update set
  title = excluded.title,
  therapeutic_area = excluded.therapeutic_area,
  body = excluded.body,
  is_decoy_eligible = excluded.is_decoy_eligible;

insert into srd_documents (org_id, srl_code, title, therapeutic_area, body, is_decoy_eligible)
values (
  null,
  'SRL-PUL-ACUTE',
  'Pulmonara not for acute symptoms / rescue use',
  'respiratory',
  $gt$Pulmonara (fesaterol) is a combination inhaled long-acting beta2-agonist (LABA) and inhaled corticosteroid (ICS) indicated for the maintenance treatment of asthma in patients 12 years of age and older. Pulmonara is a maintenance therapy only and is not indicated for the relief of acute bronchospasm or as a rescue inhaler. Its onset of bronchodilation is not rapid enough to relieve sudden or worsening asthma symptoms, and relying on it for acute relief can delay appropriate treatment of a worsening episode.

Patients prescribed Pulmonara should also be prescribed a short-acting rescue bronchodilator (such as a short-acting beta2-agonist) for treatment of acute symptoms or sudden bronchospasm, and should be counseled to always carry that rescue inhaler separately from their Pulmonara maintenance inhaler. Patients should be instructed to seek medical attention if their rescue inhaler use increases, if symptoms worsen while on Pulmonara, or if they need more than the usual number of rescue inhalations to control symptoms, as this may indicate deteriorating asthma control requiring reassessment of the treatment plan.

As with other LABA-containing medicines, Pulmonara carries a labeled warning regarding an increased risk of asthma-related death; it should be used only in patients whose asthma is not adequately controlled on an inhaled corticosteroid alone, or whose disease severity clearly warrants initiation of a LABA/ICS combination, per the full Prescribing Information. Pulmonara should not be used more frequently, at higher doses, or in additional puffs beyond what is prescribed in an attempt to relieve acute symptoms.

Fictional training document — not medical advice.$gt$,
  true
)
on conflict (srl_code) where org_id is null do update set
  title = excluded.title,
  therapeutic_area = excluded.therapeutic_area,
  body = excluded.body,
  is_decoy_eligible = excluded.is_decoy_eligible;

insert into srd_documents (org_id, srl_code, title, therapeutic_area, body, is_decoy_eligible)
values (
  null,
  'SRL-PUL-CANDID',
  'Pulmonara oral candidiasis prevention',
  'respiratory',
  $gt$Pulmonara (fesaterol) contains an inhaled corticosteroid component, and local deposition of corticosteroid in the mouth and throat during inhalation can predispose patients to oropharyngeal candidiasis (oral thrush). The Prescribing Information identifies oral candidiasis as a common local adverse reaction associated with inhaled corticosteroid-containing products in this class, and simple technique measures can meaningfully reduce this risk.

Patients should be instructed to rinse their mouth with water and spit (without swallowing) immediately after each use of Pulmonara. This rinse-and-spit step should be performed after every dose, every time, not only when symptoms are noticed, because it is a preventive measure rather than a treatment for existing thrush. Proper inhaler technique — including full inhalation coordinated with actuation, and use of a spacer device if prescribed — also reduces oropharyngeal deposition and lowers the risk of local irritation and candidiasis.

Patients who develop white patches on the tongue or inside the cheeks, mouth or throat soreness, difficulty swallowing, or a change in voice while using Pulmonara should be advised to contact their prescriber, as these may be signs of oral candidiasis requiring antifungal treatment; Pulmonara can typically be continued while candidiasis is treated, per the judgment of the treating clinician. Reinforcing the rinse-mouth-after-use habit at every counseling opportunity is the single most effective prevention step described in the Prescribing Information.

Fictional training document — not medical advice.$gt$,
  true
)
on conflict (srl_code) where org_id is null do update set
  title = excluded.title,
  therapeutic_area = excluded.therapeutic_area,
  body = excluded.body,
  is_decoy_eligible = excluded.is_decoy_eligible;

insert into srd_documents (org_id, srl_code, title, therapeutic_area, body, is_decoy_eligible)
values (
  null,
  'SRL-PUL-PEDS',
  'Pulmonara pediatric use (<12)',
  'respiratory',
  $gt$Pulmonara (fesaterol) is indicated for the maintenance treatment of asthma in patients 12 years of age and older. Safety and effectiveness in pediatric patients younger than 12 years of age have not been established, and Pulmonara is not indicated for use in this younger population. The Prescribing Information's pediatric use section should be consulted for the full basis of this age restriction.

Because pediatric airway anatomy, dosing requirements, and long-term growth considerations differ meaningfully from the adolescent and adult population studied in the pivotal trials described in the Prescribing Information, extrapolating adult or adolescent dosing to a child under 12 is not supported by the available data. Prescribers considering asthma maintenance therapy for a child under 12 should refer to age-appropriate treatment options and current pediatric asthma management guidelines rather than using Pulmonara off-label.

Caregivers or health care professionals asking about use of Pulmonara in a child under 12 should be informed that this use falls outside the approved indication, and any questions about an off-label use in a specific pediatric patient should be directed to the treating prescriber, who can weigh the individual clinical circumstances. This response provides labeled information only and does not constitute a recommendation for or against off-label pediatric use.

Fictional training document — not medical advice.$gt$,
  true
)
on conflict (srl_code) where org_id is null do update set
  title = excluded.title,
  therapeutic_area = excluded.therapeutic_area,
  body = excluded.body,
  is_decoy_eligible = excluded.is_decoy_eligible;

insert into srd_documents (org_id, srl_code, title, therapeutic_area, body, is_decoy_eligible)
values (
  null,
  'SRL-NEU-RASH',
  'Neurovance serious rash / when to stop',
  'neurology',
  $gt$Neurovance (melotigine) carries a labeled warning for serious dermatologic reactions, including Stevens-Johnson syndrome (SJS) and other serious rash presentations, which have been reported in patients taking anticonvulsants in this class. These reactions can be life-threatening and, in rare cases, fatal. The Prescribing Information describes early features that may include fever, malaise, or flu-like symptoms followed by a rash that can progress to blistering, skin peeling, and mucosal involvement (mouth, eyes, or genital sores).

Patients and caregivers should be counseled at initiation to seek immediate medical attention if a rash of any kind develops while taking Neurovance, and should not wait to see whether the rash worsens before contacting a health care provider or seeking emergency care. Any rash occurring during Neurovance therapy should be evaluated promptly, because early recognition and discontinuation, where clinically indicated, is associated with better outcomes in the class generally.

The decision to discontinue Neurovance in the setting of a rash is a clinical one that must be made by the treating prescriber based on direct examination of the patient; this document does not direct treatment or discontinuation decisions. Health care professionals evaluating a patient with a new rash on Neurovance should assess for mucosal involvement, systemic symptoms, and other features suggestive of a serious cutaneous reaction, and should consult the full Prescribing Information's boxed warning and dermatologic adverse reaction sections for further detail.

Fictional training document — not medical advice.$gt$,
  true
)
on conflict (srl_code) where org_id is null do update set
  title = excluded.title,
  therapeutic_area = excluded.therapeutic_area,
  body = excluded.body,
  is_decoy_eligible = excluded.is_decoy_eligible;

insert into srd_documents (org_id, srl_code, title, therapeutic_area, body, is_decoy_eligible)
values (
  null,
  'SRL-NEU-TITR',
  'Neurovance titration schedule',
  'neurology',
  $gt$Neurovance (melotigine) is indicated for the treatment of partial-onset seizures and requires a gradual titration schedule to the target maintenance dose, as described in the Prescribing Information's Dosage and Administration section. Initiating at the full maintenance dose without titration is not recommended and has been associated with a higher incidence of dose-related adverse reactions, including dizziness, somnolence, and coordination difficulty.

The recommended titration schedule begins with a lower starting dose, with stepwise increases at intervals specified in the Prescribing Information until the target maintenance dose is reached, based on clinical response and tolerability. Patients who miss several days of therapy during titration, or who discontinue and wish to restart, should generally resume at a lower dose and re-titrate rather than resuming at their prior maintenance dose, per the Prescribing Information, to reduce the risk of dose-related adverse effects.

Prescribers adjusting the titration pace for an individual patient — for example, slowing titration in patients who experience dizziness or somnolence, or in those with hepatic or renal impairment — should refer to the full Prescribing Information's dosing tables and special population guidance. Abrupt discontinuation of Neurovance should be avoided where possible because of the risk of increased seizure frequency; any planned discontinuation should be tapered under the treating prescriber's guidance.

Fictional training document — not medical advice.$gt$,
  true
)
on conflict (srl_code) where org_id is null do update set
  title = excluded.title,
  therapeutic_area = excluded.therapeutic_area,
  body = excluded.body,
  is_decoy_eligible = excluded.is_decoy_eligible;

insert into srd_documents (org_id, srl_code, title, therapeutic_area, body, is_decoy_eligible)
values (
  null,
  'SRL-NEU-PREG',
  'Neurovance use in pregnancy / registry',
  'neurology',
  $gt$Neurovance (melotigine) is an anticonvulsant, and as with other antiepileptic drugs, use during pregnancy requires careful weighing of the risks of fetal exposure against the risks of uncontrolled maternal seizures, which themselves pose a risk to both mother and fetus. The Prescribing Information's Use in Specific Populations section describes available data on pregnancy outcomes and directs prescribers to encourage enrollment of pregnant patients exposed to Neurovance in the applicable antiepileptic drug pregnancy registry so that outcome data can continue to be collected.

Patients who are pregnant or become pregnant while taking Neurovance should not stop or change their dose without first discussing it with their prescriber, since abrupt discontinuation of an anticonvulsant can precipitate seizures, which carry their own risks to the pregnancy. Medical Information can provide the registry enrollment information and general labeled safety information, but decisions about continuing, adjusting, or discontinuing therapy during pregnancy must be individualized by the treating prescriber based on seizure control history and other clinical factors.

Health care professionals or patients with questions about a specific pregnancy exposure, estimated gestational age, or registry enrollment should be directed to the contact information in the full Prescribing Information and encouraged to maintain close follow-up with the prescriber and obstetric provider throughout the pregnancy.

Fictional training document — not medical advice.$gt$,
  true
)
on conflict (srl_code) where org_id is null do update set
  title = excluded.title,
  therapeutic_area = excluded.therapeutic_area,
  body = excluded.body,
  is_decoy_eligible = excluded.is_decoy_eligible;

insert into srd_documents (org_id, srl_code, title, therapeutic_area, body, is_decoy_eligible)
values (
  null,
  'SRL-DRM-APPLY',
  'Dermelia application & site reactions',
  'dermatology',
  $gt$Dermelia (tacrolisol) is a topical calcineurin inhibitor indicated for the treatment of atopic dermatitis. The most commonly reported adverse reaction in the pivotal trials described in the Prescribing Information is application-site burning or stinging, which typically occurs shortly after application, is most pronounced during the first few days of treatment, and tends to decrease in frequency and intensity as treatment continues and the skin barrier improves.

Dermelia should be applied as a thin layer to the affected skin only, per the Prescribing Information's Dosage and Administration instructions, and patients should wash their hands after application unless the hands are the treated area. Application-site reactions that are mild and stable or improving are generally consistent with the expected local tolerability profile described in the label. However, a rash that spreads beyond the originally treated area, worsens rather than improves over time, or is accompanied by signs of infection (increasing warmth, swelling, pus, or fever) is not typical of expected local irritation and should prompt evaluation by the prescriber.

Patients experiencing persistent or worsening burning, spreading rash, or any application-site reaction that concerns them should be advised to contact their prescriber for assessment rather than stopping or continuing therapy on their own; Medical Information does not direct treatment decisions. The full Prescribing Information should be consulted for the complete local and systemic adverse reaction profile.

Fictional training document — not medical advice.$gt$,
  true
)
on conflict (srl_code) where org_id is null do update set
  title = excluded.title,
  therapeutic_area = excluded.therapeutic_area,
  body = excluded.body,
  is_decoy_eligible = excluded.is_decoy_eligible;

insert into srd_documents (org_id, srl_code, title, therapeutic_area, body, is_decoy_eligible)
values (
  null,
  'SRL-DRM-MALIG',
  'Dermelia boxed-warning malignancy context',
  'dermatology',
  $gt$Dermelia (tacrolisol) carries a boxed warning, consistent with other agents in the topical calcineurin inhibitor class, regarding a potential risk of malignancy. Although a causal relationship has not been established, rare cases of malignancy, including skin malignancies and lymphoma, have been reported in patients treated with topical calcineurin inhibitors, and animal studies have shown an association between systemic exposure to this drug class and lymphoma risk. The full boxed warning language should be reviewed in the Prescribing Information.

Consistent with the boxed warning, Dermelia is not indicated for use in children younger than the age specified in the Prescribing Information, is intended for short-term and intermittent (not continuous) long-term use, and should be applied to the minimum area and duration needed to control symptoms. Use of Dermelia should be avoided in patients with a compromised immune system or a history of malignancy unless directed by the treating prescriber after individualized risk-benefit assessment.

Health care professionals and patients asking about the malignancy warning should be directed to the full boxed warning and Warnings and Precautions sections of the Prescribing Information for the complete risk information; this document is a general labeled-information summary and does not provide an individualized risk assessment for a specific patient. Questions about whether continued use is appropriate for a particular patient should be directed to the treating prescriber.

Fictional training document — not medical advice.$gt$,
  true
)
on conflict (srl_code) where org_id is null do update set
  title = excluded.title,
  therapeutic_area = excluded.therapeutic_area,
  body = excluded.body,
  is_decoy_eligible = excluded.is_decoy_eligible;

insert into srd_documents (org_id, srl_code, title, therapeutic_area, body, is_decoy_eligible)
values (
  null,
  'SRL-GAS-LONG',
  'Gastroquell long-term use risks',
  'GI',
  $gt$Gastroquell (ranozide) is a proton pump inhibitor indicated for the treatment of GERD and erosive esophagitis. As with other agents in this class, prolonged use at the doses described in the Prescribing Information has been associated with certain risks that should be considered when therapy extends beyond the shortest effective duration for the indication being treated.

Long-term acid suppression with Gastroquell may reduce absorption of vitamin B12 and, over time, some patients may develop hypomagnesemia, particularly with use beyond one year or in combination with certain other medications such as diuretics. The Prescribing Information recommends that prescribers consider monitoring magnesium levels in patients anticipated to be on prolonged treatment or who are taking Gastroquell with medications known to cause hypomagnesemia. Prolonged PPI use has also been associated with an increased risk of Clostridioides difficile-associated diarrhea, and patients should be counseled to seek medical attention for diarrhea that does not improve.

Patients on long-term Gastroquell therapy should have the ongoing need for acid suppression periodically reassessed by their prescriber, and any new gastrointestinal symptoms, unexplained diarrhea, or symptoms suggestive of electrolyte disturbance (such as muscle cramps, tremor, or irregular heartbeat) should be reported to the prescriber promptly. This document summarizes labeled long-term risk information only and does not replace individualized monitoring guidance from the treating clinician.

Fictional training document — not medical advice.$gt$,
  true
)
on conflict (srl_code) where org_id is null do update set
  title = excluded.title,
  therapeutic_area = excluded.therapeutic_area,
  body = excluded.body,
  is_decoy_eligible = excluded.is_decoy_eligible;

insert into srd_documents (org_id, srl_code, title, therapeutic_area, body, is_decoy_eligible)
values (
  null,
  'SRL-GAS-ONSET',
  'Gastroquell onset of action / not for immediate relief',
  'GI',
  $gt$Gastroquell (ranozide) is a proton pump inhibitor indicated for the treatment of GERD and erosive esophagitis. Gastroquell works by reducing gastric acid production over time and is not designed to provide immediate relief of heartburn or acid-related discomfort. Patients often notice a gradual improvement in symptoms over the first several days of consistent daily use, with fuller symptomatic benefit typically continuing to build over one to two weeks, consistent with the pharmacodynamic profile described in the Prescribing Information.

Because Gastroquell is not a rapid-onset antacid, patients who need fast relief of an acute heartburn episode should be directed to an appropriate immediate-relief product (such as an antacid) rather than taking an extra dose of Gastroquell, which will not speed its onset and is not supported by the Prescribing Information's dosing instructions. Taking more than the prescribed or labeled dose, or dosing more frequently than directed, does not improve or accelerate symptom control and is not recommended.

Patients who do not experience adequate symptom improvement after a full, consistent course of Gastroquell as directed should be advised to follow up with their prescriber or pharmacist to reassess the treatment plan, rather than adjusting the dose or frequency on their own. This response provides general labeled information about onset of action and is not a substitute for individualized guidance from a health care provider.

Fictional training document — not medical advice.$gt$,
  true
)
on conflict (srl_code) where org_id is null do update set
  title = excluded.title,
  therapeutic_area = excluded.therapeutic_area,
  body = excluded.body,
  is_decoy_eligible = excluded.is_decoy_eligible;

insert into srd_documents (org_id, srl_code, title, therapeutic_area, body, is_decoy_eligible)
values (
  null,
  'SRL-OST-HYPOCAL',
  'Osteveda hypocalcemia management',
  'bone health',
  $gt$Osteveda (denosalar) is an anti-resorptive injectable indicated for the treatment of postmenopausal osteoporosis. Because Osteveda works by inhibiting bone resorption, it can lower serum calcium, and hypocalcemia is a labeled risk described in the Prescribing Information's Warnings and Precautions section. Patients with pre-existing hypocalcemia must have that condition corrected before initiating Osteveda, and adequate calcium and vitamin D intake is recommended for all patients during treatment.

Patients at greatest risk of hypocalcemia include those with severe renal impairment, malabsorption conditions, or a history of hypoparathyroidism. Signs and symptoms of hypocalcemia described in the Prescribing Information include perioral paresthesia or numbness, muscle stiffness, twitching, spasms, or cramps, and in more severe cases, seizures, prolonged QT interval, or cardiac arrhythmia. Symptoms may occur any time during treatment and can appear within hours to days of a dose in susceptible patients.

Any patient reporting perioral tingling, numbness, muscle cramping, or spasms following an Osteveda injection should be advised to contact their prescriber promptly for evaluation, including serum calcium measurement, as hypocalcemia can be serious if not addressed. Medical Information does not direct clinical management of a suspected hypocalcemic event; such symptoms should be triaged by the treating prescriber or, if severe, emergency services. The full Prescribing Information should be consulted for monitoring recommendations.

Fictional training document — not medical advice.$gt$,
  true
)
on conflict (srl_code) where org_id is null do update set
  title = excluded.title,
  therapeutic_area = excluded.therapeutic_area,
  body = excluded.body,
  is_decoy_eligible = excluded.is_decoy_eligible;

insert into srd_documents (org_id, srl_code, title, therapeutic_area, body, is_decoy_eligible)
values (
  null,
  'SRL-OST-ONJ',
  'Osteveda osteonecrosis of the jaw',
  'bone health',
  $gt$Osteveda (denosalar) carries a labeled warning for osteonecrosis of the jaw (ONJ), a risk associated with anti-resorptive therapies in this class. ONJ has been reported in patients receiving Osteveda, manifesting as delayed healing, exposed bone, pain, swelling, or infection of the jaw, most often following a dental procedure such as tooth extraction, but occurring spontaneously in some cases.

The Prescribing Information recommends that patients undergo a dental examination, with appropriate preventive dentistry performed, prior to initiating Osteveda if feasible, particularly in patients with risk factors such as invasive dental procedures, poor oral hygiene, cancer, concomitant chemotherapy or corticosteroid use, or pre-existing dental disease. Patients should be counseled to maintain good oral hygiene and to inform both their prescriber and their dentist that they are receiving Osteveda before any invasive dental procedure is performed while on therapy.

Patients who develop jaw pain, swelling, numbness, a feeling of heaviness, loosening of a tooth, or exposed bone in the mouth while on Osteveda should be referred to their prescriber and a dentist or oral surgeon promptly for evaluation. Decisions about whether to interrupt Osteveda therapy in a patient who requires invasive dental work, or who develops signs of ONJ, should be individualized by the treating prescriber in consultation with a dental specialist, per the full Prescribing Information.

Fictional training document — not medical advice.$gt$,
  true
)
on conflict (srl_code) where org_id is null do update set
  title = excluded.title,
  therapeutic_area = excluded.therapeutic_area,
  body = excluded.body,
  is_decoy_eligible = excluded.is_decoy_eligible;

insert into srd_documents (org_id, srl_code, title, therapeutic_area, body, is_decoy_eligible)
values (
  null,
  'SRL-OST-PREG',
  'Osteveda contraindicated in pregnancy',
  'bone health',
  $gt$Osteveda (denosalar) is contraindicated in pregnancy. Osteveda is indicated for postmenopausal osteoporosis, and nonclinical data described in the Prescribing Information have shown adverse effects on pregnancy outcomes when this class of anti-resorptive agent was administered during gestation. Because the treated population is postmenopausal, pregnancy exposure is expected to be rare, but the contraindication applies regardless of circumstance if pregnancy occurs or is discovered during treatment.

Patients of reproductive potential who could become pregnant should be advised of the contraindication and counseled on appropriate contraception during treatment and for the interval after the last dose specified in the Prescribing Information, given the drug's prolonged duration of pharmacologic effect on bone turnover. If a patient becomes pregnant while receiving Osteveda, or pregnancy is discovered after a dose has been administered, the prescriber should be notified promptly so that appropriate monitoring and counseling can be arranged.

Medical Information can confirm the contraindication and provide the labeled information on file, but questions about management of a specific pregnancy exposure, including monitoring recommendations or risk assessment for that pregnancy, should be directed to the treating prescriber and, as appropriate, a maternal-fetal medicine specialist. The full Prescribing Information should be consulted for complete contraindication and use-in-pregnancy information.

Fictional training document — not medical advice.$gt$,
  true
)
on conflict (srl_code) where org_id is null do update set
  title = excluded.title,
  therapeutic_area = excluded.therapeutic_area,
  body = excluded.body,
  is_decoy_eligible = excluded.is_decoy_eligible;

insert into srd_documents (org_id, srl_code, title, therapeutic_area, body, is_decoy_eligible)
values (
  null,
  'SRL-IMM-INFECT',
  'Immunexa infection / TB screening',
  'immunology/RA',
  $gt$Immunexa (rilucept) is a biologic indicated for the treatment of rheumatoid arthritis. As a TNF-class agent, Immunexa carries a boxed warning for serious infections, including bacterial, viral, fungal, and mycobacterial infections (notably tuberculosis), which have been reported in patients treated with drugs in this class and can lead to hospitalization or death. Patients treated with Immunexa are at increased risk of developing new infections and of reactivating latent infections, including latent tuberculosis.

The Prescribing Information recommends that all patients be evaluated for latent tuberculosis infection with an appropriate test prior to initiating Immunexa and that treatment for latent TB be started before Immunexa is initiated, if indicated. Patients should be monitored for signs and symptoms of infection, including fever, fatigue, cough, or wound-healing problems, during and after treatment, and Immunexa should be interrupted if a patient develops a serious infection until the infection is controlled, per the judgment of the treating prescriber.

Patients or caregivers reporting signs of infection — including fever, chills, persistent cough, or a wound that is not healing — while on Immunexa should be advised to contact their prescriber promptly, and to seek emergency care for severe symptoms such as difficulty breathing or signs of sepsis. Any hospitalization for a serious infection in a patient taking Immunexa should be reported and evaluated per the full Prescribing Information's boxed warning; Medical Information does not direct clinical management of an active infection.

Fictional training document — not medical advice.$gt$,
  true
)
on conflict (srl_code) where org_id is null do update set
  title = excluded.title,
  therapeutic_area = excluded.therapeutic_area,
  body = excluded.body,
  is_decoy_eligible = excluded.is_decoy_eligible;

insert into srd_documents (org_id, srl_code, title, therapeutic_area, body, is_decoy_eligible)
values (
  null,
  'SRL-IMM-VACC',
  'Immunexa live-vaccine guidance',
  'immunology/RA',
  $gt$Immunexa (rilucept) is a TNF-class biologic indicated for rheumatoid arthritis, and because it modulates immune function, the Prescribing Information advises caution regarding vaccination while a patient is receiving therapy. Live or live-attenuated vaccines should not be given concurrently with Immunexa, as the immune response to the vaccine may be diminished and there is a theoretical risk of the vaccine strain causing infection in an immunosuppressed host.

Whenever possible, patients should be brought up to date with all age-appropriate vaccinations, including live vaccines, prior to initiating Immunexa, per current immunization guidelines and the Prescribing Information's vaccination recommendations. If a live vaccine is being considered for a patient who is already established on Immunexa — for example, around a hospital discharge or a planned procedure — the prescriber should weigh the timing carefully; the Prescribing Information does not recommend administering live vaccines during active therapy, and any planned interruption of Immunexa to permit vaccination should be individualized by the treating prescriber.

Non-live (inactivated) vaccines may generally be given during Immunexa therapy, though the immune response may be attenuated compared to a non-immunosuppressed patient, per the Prescribing Information. Health care professionals coordinating vaccination timing for a specific patient, particularly around a hospitalization or discharge, should consult the full Prescribing Information's immunization guidance and coordinate with the patient's full care team.

Fictional training document — not medical advice.$gt$,
  true
)
on conflict (srl_code) where org_id is null do update set
  title = excluded.title,
  therapeutic_area = excluded.therapeutic_area,
  body = excluded.body,
  is_decoy_eligible = excluded.is_decoy_eligible;

-- =========================================================================
-- Part 2: case_templates — 12 rows (SC-01 .. SC-12)
-- =========================================================================

insert into case_templates (
  org_id, case_code, title, difficulty, requester_type, solicited_flag,
  product_ref, is_fictional_product, ground_truth_json, seed_or_generated,
  therapeutic_area, outline_status, rubric_approved
) values (
  null, 'SC-01', 'Cardizan & INR (clean inquiry)', 1, 'hcp', false,
  'Cardizan', true, $gt${"case_id":"SC-01","title":"Cardizan & INR (clean inquiry)","difficulty_tier":1,"channel":"voice","therapeutic_area":"anticoagulation","inquiry_category":"drug_interactions","inquirer_contact":{"name":"Dr. Amara Chen","background":"family physician (HCP)","phone":"(555) 0182-4471","address":"88 Winslow Medical Plaza, Ste 210, Asheville, NC 28801"},"products":[{"name":"Cardizan","is_fictional":true,"srl_id":"SRL-CDZ-INR"}],"requester":{"type":"hcp","solicited":false},"safety":{"ae_present":false,"pc_present":false,"pregnancy_or_lactation":false,"special_situations":["none"],"dual_routing_required":false,"correct_routes":[]},"compliance":{"off_label_involved":false,"medical_advice_risk":false},"correct_srl":"SRL-CDZ-INR","decoy_srl_ids":["SRL-CDZ-RENAL"],"documentation":{"required_fields":["requester_type","hcp_contact","product","inquiry_summary","srl_cited","response_route"]},"reveal_rules":[{"cue":"No symptom cue exists; the patient is stable and no offhand mention is volunteered.","detail_withheld":"none — there is no AE to surface","surfaces_when":"if the trainee clarifies, the persona truthfully confirms the patient is fine and no event has occurred","volunteers_cue":false}],"expected_outcome":{"applicable_sections":["s1","s4","s5"],"gold_result":"pass","common_failures":[{"description":"Trainee flags a nonexistent AE (over-flagging)","expected_critical_fail":[]},{"description":"Trainee selects SRL-CDZ-RENAL decoy instead of SRL-CDZ-INR","expected_critical_fail":[]}]}}$gt$::jsonb, 'seed',
  'anticoagulation', 'approved', true
) on conflict (case_code) do update set
  title = excluded.title,
  difficulty = excluded.difficulty,
  requester_type = excluded.requester_type,
  solicited_flag = excluded.solicited_flag,
  product_ref = excluded.product_ref,
  is_fictional_product = excluded.is_fictional_product,
  ground_truth_json = excluded.ground_truth_json,
  seed_or_generated = excluded.seed_or_generated,
  therapeutic_area = excluded.therapeutic_area,
  outline_status = excluded.outline_status,
  rubric_approved = excluded.rubric_approved;

insert into case_templates (
  org_id, case_code, title, difficulty, requester_type, solicited_flag,
  product_ref, is_fictional_product, ground_truth_json, seed_or_generated,
  therapeutic_area, outline_status, rubric_approved
) values (
  null, 'SC-02', 'Gastroquell onset (ambiguous requester)', 2, 'ambiguous', false,
  'Gastroquell', true, $gt${"case_id":"SC-02","title":"Gastroquell onset (ambiguous requester)","difficulty_tier":2,"channel":"voice","therapeutic_area":"GI","inquiry_category":"efficacy","inquirer_contact":{"name":"Jordan Ellis","background":"patient","phone":"(555) 0143-9920","address":"Dayton, OH"},"products":[{"name":"Gastroquell","is_fictional":true,"srl_id":"SRL-GAS-ONSET"}],"requester":{"type":"ambiguous","true_type_if_ambiguous":"patient","solicited":false},"safety":{"ae_present":false,"pc_present":false,"pregnancy_or_lactation":false,"special_situations":["none"],"dual_routing_required":false,"correct_routes":[]},"compliance":{"off_label_involved":false,"medical_advice_risk":true,"off_label_correct_handling":"Not applicable (no off-label ask); must not advise a dose change — direct patient to HCP/pharmacist for regimen questions."},"correct_srl":"SRL-GAS-ONSET","decoy_srl_ids":["SRL-GAS-LONG","SRL-CDZ-INR"],"sop_timeframe_business_days":1,"documentation":{"required_fields":["requester_type","patient_contact","product","inquiry_summary","srl_cited","response_route"]},"reveal_rules":[{"cue":"Caller uses clinical-adjacent terms (\"PPI\", \"acid suppression\") that could be mistaken for HCP language.","detail_withheld":"caller is actually the patient, not an HCP","surfaces_when":"trainee asks a requester-clarifying question (e.g. 'are you a healthcare professional, or are you taking this yourself?')","volunteers_cue":false}],"expected_outcome":{"applicable_sections":["s1","s4","s5"],"gold_result":"pass","common_failures":[{"description":"Treats caller as HCP and captures HCP contact fields","expected_critical_fail":[]},{"description":"Tells patient to double the dose","expected_critical_fail":["S4.2"]},{"description":"Selects SRL-GAS-LONG decoy","expected_critical_fail":[]}]}}$gt$::jsonb, 'seed',
  'GI', 'approved', true
) on conflict (case_code) do update set
  title = excluded.title,
  difficulty = excluded.difficulty,
  requester_type = excluded.requester_type,
  solicited_flag = excluded.solicited_flag,
  product_ref = excluded.product_ref,
  is_fictional_product = excluded.is_fictional_product,
  ground_truth_json = excluded.ground_truth_json,
  seed_or_generated = excluded.seed_or_generated,
  therapeutic_area = excluded.therapeutic_area,
  outline_status = excluded.outline_status,
  rubric_approved = excluded.rubric_approved;

insert into case_templates (
  org_id, case_code, title, difficulty, requester_type, solicited_flag,
  product_ref, is_fictional_product, ground_truth_json, seed_or_generated,
  therapeutic_area, outline_status, rubric_approved
) values (
  null, 'SC-03', 'Pulmonara embedded AE', 3, 'caregiver', false,
  'Pulmonara', true, $gt${"case_id":"SC-03","title":"Pulmonara embedded AE","difficulty_tier":3,"channel":"voice","therapeutic_area":"respiratory","inquiry_category":"other","inquirer_contact":{"name":"Pat Morgan","background":"caregiver (spouse of patient Dale Morgan)","phone":"(555) 0134-8827","address":"412 Larkspur Lane, Apt 3, Cedar Falls, IA 50613"},"products":[{"name":"Pulmonara","is_fictional":true,"srl_id":"SRL-PUL-CANDID"}],"requester":{"type":"caregiver","solicited":false},"safety":{"ae_present":true,"ae_four_elements_met":true,"ae_description":"Tremor and palpitations, onset ~1 week after Pulmonara initiation, ongoing.","pc_present":false,"pregnancy_or_lactation":false,"special_situations":["none"],"dual_routing_required":false,"correct_routes":["pv"]},"compliance":{"off_label_involved":false,"medical_advice_risk":true,"off_label_correct_handling":"Refer tremor management to prescriber; MI does not advise treatment."},"correct_srl":"SRL-PUL-CANDID","decoy_srl_ids":["SRL-PUL-ACUTE","SRL-PUL-PEDS"],"sop_timeframe_business_days":1,"documentation":{"required_fields":["requester_type","caregiver_contact","patient_identifier","product","inquiry_summary","ae_description","ae_onset","concomitant_meds","medical_history","hcp_info_and_consent","srl_cited","response_route"]},"reveal_rules":[{"cue":"Persona volunteers offhand in beat 2: 'he's been a bit shaky lately, but that's probably the coffee.'","detail_withheld":"tremor + palpitations, onset ~1 week after Pulmonara initiation, ongoing","surfaces_when":"trainee catches the volunteered 'shaky' cue and clarifies it — asks the caller to expand on the shakiness (when it started, whether it came with anything else)","volunteers_cue":true}],"expected_outcome":{"applicable_sections":["s1","s2","s4","s5"],"gold_result":"pass","common_failures":[{"description":"Lets the volunteered 'shaky' cue pass without clarifying; AE missed entirely","expected_critical_fail":["S2.1"]},{"description":"Catches and clarifies the AE verbally but omits it from Safety tab","expected_critical_fail":[]},{"description":"Fails to capture consent to contact HCP","expected_critical_fail":[]}]}}$gt$::jsonb, 'seed',
  'respiratory', 'approved', true
) on conflict (case_code) do update set
  title = excluded.title,
  difficulty = excluded.difficulty,
  requester_type = excluded.requester_type,
  solicited_flag = excluded.solicited_flag,
  product_ref = excluded.product_ref,
  is_fictional_product = excluded.is_fictional_product,
  ground_truth_json = excluded.ground_truth_json,
  seed_or_generated = excluded.seed_or_generated,
  therapeutic_area = excluded.therapeutic_area,
  outline_status = excluded.outline_status,
  rubric_approved = excluded.rubric_approved;

insert into case_templates (
  org_id, case_code, title, difficulty, requester_type, solicited_flag,
  product_ref, is_fictional_product, ground_truth_json, seed_or_generated,
  therapeutic_area, outline_status, rubric_approved
) values (
  null, 'SC-04', 'Osteveda dual PC + AE (dual routing)', 4, 'patient', false,
  'Osteveda', true, $gt${"case_id":"SC-04","title":"Osteveda dual PC + AE (dual routing)","difficulty_tier":4,"channel":"voice","therapeutic_area":"bone health","inquiry_category":"other","inquirer_contact":{"name":"Riley Nguyen","background":"patient","phone":"(555) 0177-3050","address":"Tacoma, WA"},"products":[{"name":"Osteveda","is_fictional":true,"srl_id":"SRL-OST-HYPOCAL"}],"requester":{"type":"patient","solicited":false},"safety":{"ae_present":true,"ae_four_elements_met":true,"ae_description":"Perioral tingling and numbness (possible hypocalcemia), onset hours after Osteveda injection.","pc_present":true,"pc_description":"Prefilled syringe solution appeared cloudy and needle was bent; product used anyway.","pregnancy_or_lactation":false,"special_situations":["none"],"dual_routing_required":true,"correct_routes":["pv","quality"]},"compliance":{"off_label_involved":false,"medical_advice_risk":true,"off_label_correct_handling":"Refer urgently to HCP/ER for hypocalcemia symptoms; MI does not manage clinically."},"correct_srl":"SRL-OST-HYPOCAL","decoy_srl_ids":["SRL-OST-ONJ","SRL-OST-PREG","SRL-CDZ-BLEED"],"sop_timeframe_business_days":1,"documentation":{"required_fields":["requester_type","patient_contact","product","inquiry_summary","ae_description","ae_onset","pc_description","lot_number","expiration_date","ndc","suspect_product_availability","retrieval_kit_offered","concomitant_meds","medical_history","srl_cited","response_route","dual_routing_flags"]},"reveal_rules":[{"cue":"Persona volunteers up front the product complaint: cloudy solution and bent needle on the prefilled syringe.","detail_withheld":"lot number, expiration date, NDC, suspect product availability","surfaces_when":"trainee asks for lot/expiry/NDC and whether the product is still available","volunteers_cue":true},{"cue":"Persona volunteers offhand in beat 2: \"and honestly I've felt a bit off since.\"","detail_withheld":"perioral tingling and numbness, onset hours after injection","surfaces_when":"trainee catches the volunteered 'felt off since' cue and clarifies it","volunteers_cue":true}],"expected_outcome":{"applicable_sections":["s1","s2","s3","s4","s5"],"gold_result":"pass","common_failures":[{"description":"Handles the PC, lets the 'felt off since' cue pass without clarifying","expected_critical_fail":["S2.1"]},{"description":"Identifies both AE and PC but routes to only one department","expected_critical_fail":["S2.3","S3.3"]},{"description":"Doesn't capture lot/expiry","expected_critical_fail":[]},{"description":"Doesn't offer retrieval kit","expected_critical_fail":[]}]}}$gt$::jsonb, 'seed',
  'bone health', 'approved', true
) on conflict (case_code) do update set
  title = excluded.title,
  difficulty = excluded.difficulty,
  requester_type = excluded.requester_type,
  solicited_flag = excluded.solicited_flag,
  product_ref = excluded.product_ref,
  is_fictional_product = excluded.is_fictional_product,
  ground_truth_json = excluded.ground_truth_json,
  seed_or_generated = excluded.seed_or_generated,
  therapeutic_area = excluded.therapeutic_area,
  outline_status = excluded.outline_status,
  rubric_approved = excluded.rubric_approved;

insert into case_templates (
  org_id, case_code, title, difficulty, requester_type, solicited_flag,
  product_ref, is_fictional_product, ground_truth_json, seed_or_generated,
  therapeutic_area, outline_status, rubric_approved
) values (
  null, 'SC-05', 'Neurovance hostile caller / legal threat (escalation)', 5, 'caregiver', false,
  'Neurovance', true, $gt${"case_id":"SC-05","title":"Neurovance hostile caller / legal threat (escalation)","difficulty_tier":5,"channel":"voice","therapeutic_area":"neurology","inquiry_category":"safety","inquirer_contact":{"name":"Sam Rivera","background":"caregiver (adult child of pt. Lucia Rivera)","phone":"(555) 0158-6642","address":"27 Halewood Ct, Providence, RI 02906"},"products":[{"name":"Neurovance","is_fictional":true,"srl_id":"SRL-NEU-RASH"}],"requester":{"type":"caregiver","solicited":false},"safety":{"ae_present":true,"ae_four_elements_met":true,"ae_description":"Blistering rash with mouth sores, hospitalized, possible SJS; onset ~2 weeks after starting Neurovance. Serious AE.","pc_present":false,"pregnancy_or_lactation":false,"special_situations":["legal","media"],"dual_routing_required":true,"correct_routes":["pv","legal","communications","supervisor"]},"compliance":{"off_label_involved":false,"medical_advice_risk":true,"off_label_correct_handling":"Not applicable (no off-label ask); must not confirm causation, must not advise stopping/continuing the drug, must not admit fault — refer to treating physician/ER."},"correct_srl":"SRL-NEU-RASH","decoy_srl_ids":["SRL-NEU-TITR","SRL-DRM-APPLY","SRL-NEU-PREG"],"sop_timeframe_business_days":1,"documentation":{"required_fields":["requester_type","caregiver_contact","patient_identifier","product","inquiry_summary","ae_description","ae_onset","seriousness_flag","special_situation_flags","escalation_notes","srl_cited","response_route"]},"reveal_rules":[{"cue":"Caller opens hot with the legal/media threat: \"Your drug put my mother in the hospital with a horrible rash. I'm calling a lawyer and the news.\"","detail_withheld":"blistering rash, mucosal involvement, hospitalization, onset ~2 weeks after starting Neurovance","surfaces_when":"trainee de-escalates with empathy and control (acknowledges feelings, avoids fault/causation language, gives concrete next steps), after which the caller provides the clinical details","volunteers_cue":true}],"expected_outcome":{"applicable_sections":["s1","s2","s4","s5"],"gold_result":"pass","common_failures":[{"description":"Admits the drug caused the rash / apologizes for a product defect","expected_critical_fail":["S5.1","S4.2"]},{"description":"Doesn't flag legal/media special situations","expected_critical_fail":["S5.2"]},{"description":"De-escalation fails (cold/defensive)","expected_critical_fail":[]},{"description":"Routes AE to PV but omits Legal/Communications","expected_critical_fail":[]}]}}$gt$::jsonb, 'seed',
  'neurology', 'approved', true
) on conflict (case_code) do update set
  title = excluded.title,
  difficulty = excluded.difficulty,
  requester_type = excluded.requester_type,
  solicited_flag = excluded.solicited_flag,
  product_ref = excluded.product_ref,
  is_fictional_product = excluded.is_fictional_product,
  ground_truth_json = excluded.ground_truth_json,
  seed_or_generated = excluded.seed_or_generated,
  therapeutic_area = excluded.therapeutic_area,
  outline_status = excluded.outline_status,
  rubric_approved = excluded.rubric_approved;

insert into case_templates (
  org_id, case_code, title, difficulty, requester_type, solicited_flag,
  product_ref, is_fictional_product, ground_truth_json, seed_or_generated,
  therapeutic_area, outline_status, rubric_approved
) values (
  null, 'SC-06', 'Immunexa internal sales rep, off-label (compliance trap)', 6, 'internal_sales', false,
  'Immunexa', true, $gt${"case_id":"SC-06","title":"Immunexa internal sales rep, off-label (compliance trap)","difficulty_tier":6,"channel":"text","therapeutic_area":"immunology/RA","inquiry_category":"efficacy","inquirer_contact":{"name":"Chris Delgado","background":"internal sales representative","phone":"(555) 0190-2213","address":"Field/Region 4 — internal ext. 4471"},"products":[{"name":"Immunexa","is_fictional":true}],"requester":{"type":"internal_sales","solicited":false},"safety":{"ae_present":false,"pc_present":false,"pregnancy_or_lactation":false,"special_situations":["none"],"dual_routing_required":false,"correct_routes":["medical_affairs"]},"compliance":{"off_label_involved":true,"medical_advice_risk":false,"off_label_correct_handling":"Do not provide off-label efficacy data to a sales rep for promotional sharing; explain MI cannot support off-label promotion; route to Medical Affairs; if a genuine unsolicited HCP request exists, it must come through the approved unsolicited-request channel, not via the rep."},"correct_srl":"none","decoy_srl_ids":["SRL-IMM-INFECT","SRL-IMM-VACC"],"sop_timeframe_business_days":1,"documentation":{"required_fields":["requester_type","internal_requester_note","product","inquiry_summary","off_label_flag","redirect_action","response_route"]},"reveal_rules":[{"cue":"No hidden safety facts. The rep asks for efficacy data for Immunexa in psoriasis (off-label) and mildly pushes back if declined (\"can you at least tell me if it works?\").","detail_withheld":"none — the reveal is behavioral: whether the trainee holds the compliance line under mild pressure","surfaces_when":"not applicable — this is a behavioral compliance test, not an information-reveal","volunteers_cue":false}],"expected_outcome":{"applicable_sections":["s4","s5"],"gold_result":"pass","common_failures":[{"description":"Sends efficacy data / any off-label information","expected_critical_fail":["S5.1"]},{"description":"Answers with an on-label SRL as if it resolves the off-label ask, without flagging off-label","expected_critical_fail":[]},{"description":"Doesn't route to Medical Affairs","expected_critical_fail":[]}]}}$gt$::jsonb, 'seed',
  'immunology/RA', 'approved', true
) on conflict (case_code) do update set
  title = excluded.title,
  difficulty = excluded.difficulty,
  requester_type = excluded.requester_type,
  solicited_flag = excluded.solicited_flag,
  product_ref = excluded.product_ref,
  is_fictional_product = excluded.is_fictional_product,
  ground_truth_json = excluded.ground_truth_json,
  seed_or_generated = excluded.seed_or_generated,
  therapeutic_area = excluded.therapeutic_area,
  outline_status = excluded.outline_status,
  rubric_approved = excluded.rubric_approved;

insert into case_templates (
  org_id, case_code, title, difficulty, requester_type, solicited_flag,
  product_ref, is_fictional_product, ground_truth_json, seed_or_generated,
  therapeutic_area, outline_status, rubric_approved
) values (
  null, 'SC-07', 'Dermelia journalist inquiry (media edge case)', 6, 'journalist', false,
  'Dermelia', true, $gt${"case_id":"SC-07","title":"Dermelia journalist inquiry (media edge case)","difficulty_tier":6,"channel":"voice","therapeutic_area":"dermatology","inquiry_category":"safety","inquirer_contact":{"name":"Alex Reyes","background":"health journalist, The Meridian Health Desk","phone":"(555) 0166-7788","address":"1400 Press Row, Rm 12, Chicago, IL 60601"},"products":[{"name":"Dermelia","is_fictional":true}],"requester":{"type":"journalist","solicited":false},"safety":{"ae_present":false,"pc_present":false,"pregnancy_or_lactation":false,"special_situations":["media"],"dual_routing_required":false,"correct_routes":["communications","supervisor"]},"compliance":{"off_label_involved":false,"medical_advice_risk":false},"correct_srl":"none","decoy_srl_ids":["SRL-DRM-MALIG","SRL-DRM-APPLY"],"sop_timeframe_business_days":1,"documentation":{"required_fields":["requester_type","journalist_contact","outlet","product","inquiry_summary","special_situation_flags","redirect_action","response_route"]},"reveal_rules":[{"cue":"Reporter opens asking MI to comment on Dermelia's cancer warning and presses for a quotable yes/no on causation.","detail_withheld":"none — the reveal is behavioral: whether the trainee avoids becoming an unauthorized spokesperson and avoids causation statements","surfaces_when":"not applicable — this is a behavioral compliance test, not an information-reveal","volunteers_cue":false}],"expected_outcome":{"applicable_sections":["s1","s4","s5"],"gold_result":"pass","common_failures":[{"description":"Gives a substantive comment / confirms or denies causation","expected_critical_fail":["S5.2"]},{"description":"Reads an SRL to the reporter as an official statement","expected_critical_fail":[]},{"description":"Doesn't capture outlet/contact or notify Communications","expected_critical_fail":[]}]}}$gt$::jsonb, 'seed',
  'dermatology', 'approved', true
) on conflict (case_code) do update set
  title = excluded.title,
  difficulty = excluded.difficulty,
  requester_type = excluded.requester_type,
  solicited_flag = excluded.solicited_flag,
  product_ref = excluded.product_ref,
  is_fictional_product = excluded.is_fictional_product,
  ground_truth_json = excluded.ground_truth_json,
  seed_or_generated = excluded.seed_or_generated,
  therapeutic_area = excluded.therapeutic_area,
  outline_status = excluded.outline_status,
  rubric_approved = excluded.rubric_approved;

insert into case_templates (
  org_id, case_code, title, difficulty, requester_type, solicited_flag,
  product_ref, is_fictional_product, ground_truth_json, seed_or_generated,
  therapeutic_area, outline_status, rubric_approved
) values (
  null, 'SC-08', 'Dermelia embedded AE (volunteered cue, second therapeutic area)', 3, 'patient', false,
  'Dermelia', true, $gt${"case_id":"SC-08","title":"Dermelia embedded AE (volunteered cue, second therapeutic area)","difficulty_tier":3,"channel":"voice","therapeutic_area":"dermatology","inquiry_category":"other","inquirer_contact":{"name":"Taylor Brooks","background":"patient","phone":"(555) 0129-5514","address":"Boise, ID"},"products":[{"name":"Dermelia","is_fictional":true,"srl_id":"SRL-DRM-APPLY"}],"requester":{"type":"patient","solicited":false},"safety":{"ae_present":true,"ae_four_elements_met":true,"ae_description":"Persistent application-site burning and a spreading rash beyond the treated area, ~5 days, worsening.","pc_present":false,"pregnancy_or_lactation":false,"special_situations":["none"],"dual_routing_required":false,"correct_routes":["pv"]},"compliance":{"off_label_involved":false,"medical_advice_risk":true,"off_label_correct_handling":"Refer to prescriber for the worsening rash; advise stopping only per prescriber — MI does not direct treatment."},"correct_srl":"SRL-DRM-APPLY","decoy_srl_ids":["SRL-DRM-MALIG","SRL-GAS-LONG"],"sop_timeframe_business_days":1,"documentation":{"required_fields":["requester_type","patient_contact","product","inquiry_summary","ae_description","ae_onset","ae_worsening","concomitant_meds","medical_history","hcp_referral_note","srl_cited","response_route"]},"reveal_rules":[{"cue":"Persona volunteers offhand in beat 2: \"It stings a bit when I put it on, but creams do that, right?\"","detail_withheld":"persistent application-site burning + spreading rash, worsening over ~5 days","surfaces_when":"trainee catches the volunteered 'stings' cue and clarifies it","volunteers_cue":true}],"expected_outcome":{"applicable_sections":["s1","s2","s4","s5"],"gold_result":"pass","common_failures":[{"description":"Lets the 'stings' cue pass without clarifying; AE missed entirely","expected_critical_fail":["S2.1"]},{"description":"Advises patient to stop the drug on MI's own authority","expected_critical_fail":["S4.2"]},{"description":"AE identified but not documented","expected_critical_fail":[]}]}}$gt$::jsonb, 'seed',
  'dermatology', 'approved', true
) on conflict (case_code) do update set
  title = excluded.title,
  difficulty = excluded.difficulty,
  requester_type = excluded.requester_type,
  solicited_flag = excluded.solicited_flag,
  product_ref = excluded.product_ref,
  is_fictional_product = excluded.is_fictional_product,
  ground_truth_json = excluded.ground_truth_json,
  seed_or_generated = excluded.seed_or_generated,
  therapeutic_area = excluded.therapeutic_area,
  outline_status = excluded.outline_status,
  rubric_approved = excluded.rubric_approved;

insert into case_templates (
  org_id, case_code, title, difficulty, requester_type, solicited_flag,
  product_ref, is_fictional_product, ground_truth_json, seed_or_generated,
  therapeutic_area, outline_status, rubric_approved
) values (
  null, 'SC-09', 'Cardizan renal dosing (clean inquiry, second tier-1)', 1, 'pharmacist', false,
  'Cardizan', true, $gt${"case_id":"SC-09","title":"Cardizan renal dosing (clean inquiry, second tier-1)","difficulty_tier":1,"channel":"text","therapeutic_area":"anticoagulation","inquiry_category":"pharmacokinetics","inquirer_contact":{"name":"P. Okafor, PharmD","background":"retail pharmacist (HCP)","phone":"(555) 0139-4106","address":"Northline Pharmacy, 905 Grant St, Lincoln, NE 68508"},"products":[{"name":"Cardizan","is_fictional":true,"srl_id":"SRL-CDZ-RENAL"}],"requester":{"type":"pharmacist","solicited":false},"safety":{"ae_present":false,"pc_present":false,"pregnancy_or_lactation":false,"special_situations":["none"],"dual_routing_required":false,"correct_routes":[]},"compliance":{"off_label_involved":false,"medical_advice_risk":false},"correct_srl":"SRL-CDZ-RENAL","decoy_srl_ids":["SRL-CDZ-INR"],"documentation":{"required_fields":["requester_type","hcp_contact","product","inquiry_summary","srl_cited","response_route"]},"reveal_rules":[{"cue":"No safety cues to catch. Straight on-label information request.","detail_withheld":"none — there is no AE to surface","surfaces_when":"if the trainee fishes for AEs anyway, the pharmacist confirms this is a general dosing question, no patient event","volunteers_cue":false}],"expected_outcome":{"applicable_sections":["s4","s5"],"gold_result":"pass","common_failures":[{"description":"Selects SRL-CDZ-INR decoy","expected_critical_fail":[]},{"description":"Captures patient/consumer contact fields instead of HCP set","expected_critical_fail":[]},{"description":"Adds unsolicited off-label dosing beyond the labeled range","expected_critical_fail":["S5.1"]}]}}$gt$::jsonb, 'seed',
  'anticoagulation', 'approved', true
) on conflict (case_code) do update set
  title = excluded.title,
  difficulty = excluded.difficulty,
  requester_type = excluded.requester_type,
  solicited_flag = excluded.solicited_flag,
  product_ref = excluded.product_ref,
  is_fictional_product = excluded.is_fictional_product,
  ground_truth_json = excluded.ground_truth_json,
  seed_or_generated = excluded.seed_or_generated,
  therapeutic_area = excluded.therapeutic_area,
  outline_status = excluded.outline_status,
  rubric_approved = excluded.rubric_approved;

insert into case_templates (
  org_id, case_code, title, difficulty, requester_type, solicited_flag,
  product_ref, is_fictional_product, ground_truth_json, seed_or_generated,
  therapeutic_area, outline_status, rubric_approved
) values (
  null, 'SC-10', 'Neurovance pregnancy exposure (special situation)', 4, 'patient', false,
  'Neurovance', true, $gt${"case_id":"SC-10","title":"Neurovance pregnancy exposure (special situation)","difficulty_tier":4,"channel":"voice","therapeutic_area":"neurology","inquiry_category":"safety","inquirer_contact":{"name":"Dana Whitfield","background":"patient","phone":"(555) 0172-8830","address":"Frederick, MD"},"products":[{"name":"Neurovance","is_fictional":true,"srl_id":"SRL-NEU-PREG"}],"requester":{"type":"patient","solicited":false},"safety":{"ae_present":false,"pc_present":false,"pregnancy_or_lactation":true,"special_situations":["pregnancy_exposure"],"dual_routing_required":false,"correct_routes":["pv"]},"compliance":{"off_label_involved":false,"medical_advice_risk":true,"off_label_correct_handling":"Not applicable (no off-label ask); must NOT tell patient to stop or continue an anticonvulsant (abrupt discontinuation risk) — refer urgently to prescriber."},"correct_srl":"SRL-NEU-PREG","decoy_srl_ids":["SRL-NEU-TITR","SRL-OST-PREG","SRL-DRM-APPLY"],"sop_timeframe_business_days":1,"documentation":{"required_fields":["requester_type","patient_contact","product","inquiry_summary","special_situation_flags","estimated_gestational_age_or_lmp","prescriber_info","registry_referral","no_treatment_advice_note","srl_cited","response_route"]},"reveal_rules":[{"cue":"The pregnancy exposure is stated up front, not hidden: \"I just found out I'm 6 weeks pregnant and I've been on Neurovance the whole time — should I stop it?\"","detail_withheld":"none — the skill is recognizing it as a reportable special situation and handling the 'should I stop' trap correctly, not surfacing a hidden fact","surfaces_when":"if the trainee clarifies, patient confirms no current adverse outcome to the pregnancy or mother, and provides LMP/estimated gestational age and prescriber info if asked","volunteers_cue":true}],"expected_outcome":{"applicable_sections":["s1","s4","s5"],"gold_result":"pass","common_failures":[{"description":"Tells the patient to stop (or keep taking) Neurovance","expected_critical_fail":["S4.2"]},{"description":"Doesn't flag the pregnancy exposure / doesn't route to PV / omits registry","expected_critical_fail":["S5.2"]},{"description":"Fabricates an AE where there is only an exposure","expected_critical_fail":[]}]}}$gt$::jsonb, 'seed',
  'neurology', 'approved', true
) on conflict (case_code) do update set
  title = excluded.title,
  difficulty = excluded.difficulty,
  requester_type = excluded.requester_type,
  solicited_flag = excluded.solicited_flag,
  product_ref = excluded.product_ref,
  is_fictional_product = excluded.is_fictional_product,
  ground_truth_json = excluded.ground_truth_json,
  seed_or_generated = excluded.seed_or_generated,
  therapeutic_area = excluded.therapeutic_area,
  outline_status = excluded.outline_status,
  rubric_approved = excluded.rubric_approved;

insert into case_templates (
  org_id, case_code, title, difficulty, requester_type, solicited_flag,
  product_ref, is_fictional_product, ground_truth_json, seed_or_generated,
  therapeutic_area, outline_status, rubric_approved
) values (
  null, 'SC-11', 'Cardizan disposal question, embedded lack-of-effect (LOE)', 3, 'patient', false,
  'Cardizan', true, $gt${"case_id":"SC-11","title":"Cardizan disposal question, embedded lack-of-effect (LOE)","difficulty_tier":3,"channel":"voice","therapeutic_area":"anticoagulation","inquiry_category":"other","inquirer_contact":{"name":"Marcus Bell","background":"patient","phone":"(555) 0121-6675","address":"Chattanooga, TN"},"products":[{"name":"Cardizan","is_fictional":true}],"requester":{"type":"patient","solicited":false},"safety":{"ae_present":false,"pc_present":false,"pregnancy_or_lactation":false,"special_situations":["lack_of_effect"],"dual_routing_required":false,"correct_routes":["pv"]},"compliance":{"off_label_involved":false,"medical_advice_risk":true,"off_label_correct_handling":"Not applicable (no off-label ask); must NOT advise on dosing or the INR target — refer all therapy questions to the prescriber/pharmacist. Disposal guidance is general safety info, not medical advice."},"correct_srl":"none","decoy_srl_ids":["SRL-CDZ-INR","SRL-CDZ-RENAL"],"sop_timeframe_business_days":1,"documentation":{"required_fields":["requester_type","patient_contact","product","inquiry_summary","special_situation_flags","dose_titration_note","disposal_guidance_given","no_dosing_advice_note","response_route"]},"reveal_rules":[{"cue":"Persona volunteers in beat 2: \"My doctor bumped me up because the low dose wasn't getting my INR where it needed to be.\"","detail_withheld":"potential lack of effect — persistently sub-target INR over several weeks on the lowest Cardizan dose (subtherapeutic anticoagulation): at every INR check the readings stayed below the target range and were not responding to that dose, until the doctor increased it","surfaces_when":"trainee catches the cue and clarifies (how long on the low dose, what the INR was doing, any clotting symptoms)","volunteers_cue":true}],"expected_outcome":{"applicable_sections":["s1","s4","s5"],"gold_result":"pass","common_failures":[{"description":"Answers only the disposal question; dismisses the dose-increase remark as 'normal titration' and never captures the LOE","expected_critical_fail":["S5.2"]},{"description":"Advises the patient on dosing / the INR target / whether the increase was right","expected_critical_fail":["S4.2"]},{"description":"Selects SRL-CDZ-INR or SRL-CDZ-RENAL to answer a disposal question","expected_critical_fail":[]},{"description":"Over-states the LOE as an actual clot/bleed AE that didn't occur","expected_critical_fail":[]}]}}$gt$::jsonb, 'seed',
  'anticoagulation', 'approved', true
) on conflict (case_code) do update set
  title = excluded.title,
  difficulty = excluded.difficulty,
  requester_type = excluded.requester_type,
  solicited_flag = excluded.solicited_flag,
  product_ref = excluded.product_ref,
  is_fictional_product = excluded.is_fictional_product,
  ground_truth_json = excluded.ground_truth_json,
  seed_or_generated = excluded.seed_or_generated,
  therapeutic_area = excluded.therapeutic_area,
  outline_status = excluded.outline_status,
  rubric_approved = excluded.rubric_approved;

insert into case_templates (
  org_id, case_code, title, difficulty, requester_type, solicited_flag,
  product_ref, is_fictional_product, ground_truth_json, seed_or_generated,
  therapeutic_area, outline_status, rubric_approved
) values (
  null, 'SC-12', 'Immunexa interaction question, embedded serious AE (hospitalization cue)', 4, 'hcp', false,
  'Immunexa', true, $gt${"case_id":"SC-12","title":"Immunexa interaction question, embedded serious AE (hospitalization cue)","difficulty_tier":4,"channel":"voice","therapeutic_area":"immunology/RA","inquiry_category":"drug_interactions","inquirer_contact":{"name":"Dr. Nadia Farouk","background":"hospitalist (HCP)","phone":"(555) 0184-9902","address":"St. Elowen Regional Hospital, 300 Caldwell Ave, Dept of Medicine, Portland, OR 97204"},"products":[{"name":"Immunexa","is_fictional":true,"srl_id":"SRL-IMM-VACC"}],"requester":{"type":"hcp","solicited":false},"safety":{"ae_present":true,"ae_four_elements_met":true,"ae_description":"Hospitalization for a serious infection (pneumonia) while on Immunexa, a known serious risk of the TNF-class. Serious AE.","pc_present":false,"pregnancy_or_lactation":false,"special_situations":["none"],"dual_routing_required":false,"correct_routes":["pv"]},"compliance":{"off_label_involved":false,"medical_advice_risk":true,"off_label_correct_handling":"Not applicable (no off-label ask); provide labeled interaction/vaccine guidance to the HCP — appropriate, she's a prescriber — but do not direct clinical management of the infection."},"correct_srl":"SRL-IMM-VACC","decoy_srl_ids":["SRL-IMM-INFECT","SRL-DRM-APPLY","SRL-CDZ-INR"],"sop_timeframe_business_days":1,"documentation":{"required_fields":["requester_type","hcp_contact","patient_identifier","product","inquiry_summary","ae_description","ae_onset_timing","seriousness_flag","concomitant_meds","medical_history","srl_cited","response_route"]},"reveal_rules":[{"cue":"Persona volunteers offhand in beat 2: \"They were just being treated over at the hospital, so I want to sort the vaccine out before discharge.\"","detail_withheld":"serious AE — hospitalization for a serious infection (pneumonia) while on Immunexa","surfaces_when":"trainee catches the 'treated at the hospital' cue and clarifies it (what were they admitted for, when, relationship to Immunexa)","volunteers_cue":true}],"expected_outcome":{"applicable_sections":["s1","s2","s4","s5"],"gold_result":"pass","common_failures":[{"description":"Answers the vaccine-interaction question, lets the 'treated at the hospital' cue pass, never clarifies","expected_critical_fail":["S2.1"]},{"description":"Catches and clarifies the AE but doesn't route to PV / doesn't flag serious","expected_critical_fail":["S2.3"]},{"description":"Selects SRL-IMM-INFECT (about infection, not the vaccine question) to answer the interaction inquiry","expected_critical_fail":[]}]}}$gt$::jsonb, 'seed',
  'immunology/RA', 'approved', true
) on conflict (case_code) do update set
  title = excluded.title,
  difficulty = excluded.difficulty,
  requester_type = excluded.requester_type,
  solicited_flag = excluded.solicited_flag,
  product_ref = excluded.product_ref,
  is_fictional_product = excluded.is_fictional_product,
  ground_truth_json = excluded.ground_truth_json,
  seed_or_generated = excluded.seed_or_generated,
  therapeutic_area = excluded.therapeutic_area,
  outline_status = excluded.outline_status,
  rubric_approved = excluded.rubric_approved;


-- =========================================================================
-- Part 3: SC-03 scripted gold-path transcript (0003_scripted_transcript.sql column)
-- =========================================================================

update case_templates
set scripted_transcript_json = $tr${"mode": "scripted", "turns": [{"speaker": "persona", "text": "Hi there, thanks for taking my call. My husband started on Pulmonara last month for his asthma, and I just wanted to check \u2014 is he supposed to rinse his mouth out after he uses it?"}, {"speaker": "trainee", "text": "Hi, thank you for calling Medical Information. I'd be glad to help. Can I get your name and your relationship to the patient first?"}, {"speaker": "persona", "text": "Sure, I'm Pat Morgan \u2014 I'm his wife. His name's Dale Morgan. He's been pretty good about taking it every morning and night, it's become part of our routine."}, {"speaker": "trainee", "text": "That's good to hear. I'll get you the rinse guidance in just a moment."}, {"speaker": "persona", "text": "Oh \u2014 and, funny thing, he's been a bit shaky lately, but that's probably the coffee. He's always been a two-cups-a-day guy."}, {"speaker": "trainee", "text": "I don't want to gloss over that \u2014 can you tell me more about the shakiness? When did you notice it start, and has it come with anything else?"}, {"speaker": "persona", "text": "Now that you ask, it's more than I was giving it credit for. His hands shake a little, kind of a tremor, and his heart's been racing sometimes too. Started maybe a week after he began the Pulmonara, and it's really never gone away since \u2014 comes and goes but still happening."}, {"speaker": "trainee", "text": "Thank you for telling me that. Is he on any other medications, or any other medical conditions I should know about?"}, {"speaker": "persona", "text": "Just a blood pressure pill, don't remember the name offhand. No other health issues that I know of."}, {"speaker": "trainee", "text": "Understood. Since this sounds possibly related to the Pulmonara and it's ongoing, I need to document it so our safety team can look into it. Is that all right, and can I get a callback number and address in case they need to follow up?"}, {"speaker": "persona", "text": "Of course, that's fine. My number is (555) 0134-8827, and we're at 412 Larkspur Lane, Apt 3, Cedar Falls, IA 50613."}, {"speaker": "trainee", "text": "Thank you. Would you consent to us contacting Dale's prescriber for more clinical detail?"}, {"speaker": "persona", "text": "Yes, that's fine. He sees Dr. Patel over at the family clinic, though I don't have the office number memorized."}, {"speaker": "trainee", "text": "Got it, I'll note that. Given the tremor and racing heart have been ongoing, I'd strongly encourage having Dale contact Dr. Patel soon so it can be evaluated directly \u2014 I can't say whether it's related or what to do about it, but it's worth having them take a look."}, {"speaker": "persona", "text": "That makes sense, I'll have him call this week. So, back to my original question \u2014 the mouth rinsing?"}, {"speaker": "trainee", "text": "Yes, thanks for your patience. Pulmonara contains an inhaled corticosteroid, so rinsing with water and spitting it out \u2014 not swallowing \u2014 right after every dose helps prevent oral thrush, a buildup of yeast in the mouth. Best to do this every time, morning and night, not just when something feels off. If he ever notices white patches, soreness, or trouble swallowing, that's worth mentioning to his doctor too."}, {"speaker": "persona", "text": "Okay, easy enough to add to the routine. Thank you, and I feel better having mentioned the shaky thing now too, honestly."}, {"speaker": "trainee", "text": "I'm glad you did \u2014 that's exactly what we want to hear. To recap: rinse and spit after every Pulmonara dose, and please have Dale contact Dr. Patel this week about the tremor and racing heart. Our safety team will also follow up given the timing. Anything else I can help with today?"}, {"speaker": "persona", "text": "No, that covers it. Thank you for listening and taking the time."}, {"speaker": "trainee", "text": "You're very welcome, Pat. Thank you for calling, and I hope Dale feels better soon."}]}$tr$::jsonb
where case_code = 'SC-03';
