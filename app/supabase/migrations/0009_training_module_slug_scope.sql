-- ===========================================================================
-- 0009_training_module_slug_scope.sql — S4 admin module 4.1: org-tailored
-- copies of shared training modules shadow the shared row by slug (spec
-- §4.1: "org copy" = duplicate the shared row with org_id set and the SAME
-- slug; org rows shadow shared ones by slug for that org's trainees).
--
-- Migration 0005 added `slug text unique` — a single, table-wide unique
-- constraint. That makes an org copy impossible by construction: the copy's
-- slug always collides with the shared row it is meant to shadow. Replace it
-- with two scope-aware unique indexes: shared slugs (org_id is null) stay
-- unique among themselves, and each org's slugs stay unique within that org,
-- while the same slug text may exist once in the shared bank and once per
-- org (the shadowing case).
-- ===========================================================================
alter table training_modules drop constraint if exists training_modules_slug_key;

create unique index training_modules_shared_slug_key
  on training_modules (slug)
  where org_id is null;

create unique index training_modules_org_slug_key
  on training_modules (org_id, slug)
  where org_id is not null;
