-- S3: persona brief (scenario premise / persona profile / beat sheet) per case.
-- Server-only, like ground_truth_json — feeds the persona system prompt.
alter table case_templates add column persona_brief_json jsonb;
