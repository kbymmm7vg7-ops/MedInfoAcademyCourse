-- S4: the overall evaluation row carries the full schema-validated record.
alter table evaluation_scores add column record_json jsonb;
