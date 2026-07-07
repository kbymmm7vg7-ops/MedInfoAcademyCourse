# Design Spec — Certification Variant / Burn / First-Attempt Logic

Fixes PRD critique #5 (certification is gameable as written). Opus implements exactly this.

## Problem
§5.4 lets trainees drill any scenario unlimited times in practice, then take the *same* scenario
"first-try" in certification. "First attempt per scenario" is not a real gate if practice teaches the
exact surface. Also, "burning" a failed scenario shrinks a 20-case bank fast.

## Solution: certification always plays a fresh generated variant
1. Seed cases hold an invariant **answer key** (ground truth) and a variable **surface** (names, phrasing, reveal order, decoy arrangement). The §5.5a variation engine already produces surface variants that preserve the answer key.
2. **Practice** attempts play variants freely; nothing is recorded against certification.
3. A **certification sitting** for scenario S generates a *new* variant of S the trainee has not seen, seeded deterministically from `(user_id, template_id, attempt_ordinal)` so it is reproducible for audit but unpredictable to the trainee. Same answer key → still deterministically gradeable.
4. Because the surface is always fresh, drilling in practice builds skill (the intent) without leaking the exact answers (the exploit).

## First-attempt & burn
- Certification requires **3 distinct seed templates, each passed on the first certification attempt**.
- `accreditation_attempts` records `attempt_type`, `template_id`, `variant_ref`, `is_first_attempt_on_case`, `pass_bool`.
- First **certification** attempt on template S = the gate. Fail → S is **burned for certification** (cannot be retried for cert by this user); the trainee must use a different template for another first-attempt try. Practice on S remains unlimited and irrelevant to cert.
- Burn is per-user, per-template, certification-only. Practice attempts never set `is_first_attempt_on_case` on the certification track.
- With 20 templates and a 3-pass requirement, burn tolerance is ample; no held-out subset needed (matches §5.4 "confirmed behavior").

## Lock-in
- On the 3rd first-try pass, certification is **locked immediately** and immutably (write a `competency_records` row + evidence packet: variant snapshots + score records + rubric_version). Subsequent practice on any template — including certified ones — has zero effect (PRD §5.4 confirmed behavior).

## Data touchpoints
- `case_instances.variant_snapshot_json` — the exact variant + persona reveal-state played (audit/replay).
- `accreditation_attempts.variant_ref` — links attempt to its variant snapshot.
- `evaluation_scores.rubric_version` — the rubric the pass was scored against.

## Tests (Opus writes these)
- Practice-then-certify same template → cert serves a different surface (assert variant_ref differs, answer key identical).
- Fail first cert attempt on S → S cannot be re-selected for certification; a different template can.
- 3rd pass → competency record + evidence packet written; a later practice attempt does not mutate it.
- Variant determinism → same (user, template, ordinal) regenerates the identical variant.
