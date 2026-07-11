-- S5 seed — product labeling (PI) reference documents (Nathan, 2026-07-11).
-- One shared srd_documents row per fictional product, srl_code 'PI-<PRODUCT>'.
-- The simulator appends the case product's PI to the SRL candidate list as a
-- pinned reference entry (case-brief.ts); bodies obey the SEC-2 split.
--
-- Content is VERBATIM the v1.0 label skeleton from the Nathan-approved
-- 01-seed-cases/fictional-product-bank.md ("Class (fictional)" / "Indication"
-- / "Key label points" columns). Full USPI-style label prose remains a
-- flagged content task (BLOCKERS 2026-07-11) — do not author it here.
-- is_decoy_eligible = false: a PI is reference material, never a decoy.
-- Idempotent: upserts by the shared-bank natural key (uq_srd_documents_srl_code_shared).

insert into srd_documents (org_id, srl_code, title, therapeutic_area, is_decoy_eligible) values
  (null, 'PI-CARDIZAN',    'Prescribing Information (label skeleton) — Cardizan',    'anticoagulation', false),
  (null, 'PI-PULMONARA',   'Prescribing Information (label skeleton) — Pulmonara',   'respiratory',     false),
  (null, 'PI-NEUROVANCE',  'Prescribing Information (label skeleton) — Neurovance',  'neurology',       false),
  (null, 'PI-DERMELIA',    'Prescribing Information (label skeleton) — Dermelia',    'dermatology',     false),
  (null, 'PI-GASTROQUELL', 'Prescribing Information (label skeleton) — Gastroquell', 'GI',              false),
  (null, 'PI-OSTEVEDA',    'Prescribing Information (label skeleton) — Osteveda',    'endocrinology',   false),
  (null, 'PI-IMMUNEXA',    'Prescribing Information (label skeleton) — Immunexa',    'immunology/RA',   false)
on conflict (srl_code) where org_id is null do update set
  title = excluded.title,
  therapeutic_area = excluded.therapeutic_area,
  is_decoy_eligible = excluded.is_decoy_eligible;

insert into srd_document_bodies (document_id, body)
select id, $pi$Cardizan (velanoxine) — fictional USPI-style label skeleton (v1.0 product bank).

Class (fictional): anticoagulant.
Indication: non-valvular AF, stroke prevention.
Key label points: narrow INR interaction profile; GI bleed risk; renal dosing.

Full label prose is a pending content task; consult the Cardizan SRLs for detailed approved guidance.

Fictional training document — not medical advice.$pi$ from srd_documents where srl_code = 'PI-CARDIZAN' and org_id is null
on conflict (document_id) do update set body = excluded.body, updated_at = now();

insert into srd_document_bodies (document_id, body)
select id, $pi$Pulmonara (fesaterol) — fictional USPI-style label skeleton (v1.0 product bank).

Class (fictional): inhaled LABA/ICS.
Indication: asthma maintenance (≥12 yr).
Key label points: not for acute bronchospasm; oral candidiasis; tremor/palpitations.

Full label prose is a pending content task; consult the Pulmonara SRLs for detailed approved guidance.

Fictional training document — not medical advice.$pi$ from srd_documents where srl_code = 'PI-PULMONARA' and org_id is null
on conflict (document_id) do update set body = excluded.body, updated_at = now();

insert into srd_document_bodies (document_id, body)
select id, $pi$Neurovance (melotigine) — fictional USPI-style label skeleton (v1.0 product bank).

Class (fictional): anticonvulsant.
Indication: partial-onset seizures.
Key label points: serious rash/SJS risk; titration schedule; suicidality warning.

Full label prose is a pending content task; consult the Neurovance SRLs for detailed approved guidance.

Fictional training document — not medical advice.$pi$ from srd_documents where srl_code = 'PI-NEUROVANCE' and org_id is null
on conflict (document_id) do update set body = excluded.body, updated_at = now();

insert into srd_document_bodies (document_id, body)
select id, $pi$Dermelia (tacrolisol) — fictional USPI-style label skeleton (v1.0 product bank).

Class (fictional): topical calcineurin inhibitor.
Indication: atopic dermatitis.
Key label points: boxed warning malignancy (class); application-site burning.

Full label prose is a pending content task; consult the Dermelia SRLs for detailed approved guidance.

Fictional training document — not medical advice.$pi$ from srd_documents where srl_code = 'PI-DERMELIA' and org_id is null
on conflict (document_id) do update set body = excluded.body, updated_at = now();

insert into srd_document_bodies (document_id, body)
select id, $pi$Gastroquell (ranozide) — fictional USPI-style label skeleton (v1.0 product bank).

Class (fictional): PPI.
Indication: GERD, erosive esophagitis.
Key label points: long-term use B12/Mg; C. diff risk; not for immediate relief.

Full label prose is a pending content task; consult the Gastroquell SRLs for detailed approved guidance.

Fictional training document — not medical advice.$pi$ from srd_documents where srl_code = 'PI-GASTROQUELL' and org_id is null
on conflict (document_id) do update set body = excluded.body, updated_at = now();

insert into srd_document_bodies (document_id, body)
select id, $pi$Osteveda (denosalar) — fictional USPI-style label skeleton (v1.0 product bank).

Class (fictional): anti-resorptive injectable.
Indication: postmenopausal osteoporosis.
Key label points: hypocalcemia; ONJ; not in pregnancy.

Full label prose is a pending content task; consult the Osteveda SRLs for detailed approved guidance.

Fictional training document — not medical advice.$pi$ from srd_documents where srl_code = 'PI-OSTEVEDA' and org_id is null
on conflict (document_id) do update set body = excluded.body, updated_at = now();

insert into srd_document_bodies (document_id, body)
select id, $pi$Immunexa (rilucept) — fictional USPI-style label skeleton (v1.0 product bank).

Class (fictional): biologic (fictional TNF-class).
Indication: rheumatoid arthritis.
Key label points: infection/TB risk; injection-site reactions; live-vaccine caution.

Full label prose is a pending content task; consult the Immunexa SRLs for detailed approved guidance.

Fictional training document — not medical advice.$pi$ from srd_documents where srl_code = 'PI-IMMUNEXA' and org_id is null
on conflict (document_id) do update set body = excluded.body, updated_at = now();
