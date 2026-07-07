-- S2: static scripted case support. The scripted gold-path transcript lives
-- beside (not inside) ground_truth_json so the client-facing case brief can
-- include the transcript without ever shipping the answer key.
alter table case_templates add column scripted_transcript_json jsonb;
