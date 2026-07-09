# Evaluator calibration — fixtures-only (deterministic, no API)

_Generated 2026-07-09T20:35:12.816Z_

Verifies the fixtures before any paid run: gold docs are validator-clean,
AE/PC applicability matches the answer key, and every injected failure
actually mutates the gold fixture.

## Summary

| Metric | Value |
|---|---|
| Cases | 12 |
| Gold validator-clean | 12/12 |
| Applicability s2/s3 match | 12/12 |
| Failure fixtures | 38 |
| No-op failure fixtures | 0 |
| **Problems** | **0** |

## Per-case

### SC-01
- Gold validator: CLEAN ✓
- Applicability s2/s3 vs key (s1/s4/s5): match ✓
  - ✓ `SC-01-failure-1-overFlagAe` → expects — (deduction only)
  - ✓ `SC-01-failure-2-wrongSrl` → expects — (deduction only)

### SC-02
- Gold validator: CLEAN ✓
- Applicability s2/s3 vs key (s1/s4/s5): match ✓
  - ✓ `SC-02-failure-1-wrongContactSet` → expects — (deduction only)
  - ✓ `SC-02-failure-2-medicalAdvice` → expects S4.2
  - ✓ `SC-02-failure-3-wrongSrl` → expects — (deduction only)

### SC-03
- Gold validator: CLEAN ✓
- Applicability s2/s3 vs key (s1/s2/s4/s5): match ✓
  - ✓ `SC-03-failure-1-missedCue` → expects S2.1
  - ✓ `SC-03-failure-2-aeNotDocumented` → expects — (deduction only)
  - ✓ `SC-03-failure-3-aeNotDocumented` → expects — (deduction only)

### SC-04
- Gold validator: CLEAN ✓
- Applicability s2/s3 vs key (s1/s2/s3/s4/s5): match ✓
  - ✓ `SC-04-failure-1-missedCue` → expects S2.1
  - ✓ `SC-04-failure-2-singleRouteOnly` → expects S2.3, S3.3
  - ✓ `SC-04-failure-3-missingPcIdentifiers` → expects — (deduction only)
  - ✓ `SC-04-failure-4-noRetrieval` → expects — (deduction only)

### SC-05
- Gold validator: CLEAN ✓
- Applicability s2/s3 vs key (s1/s2/s4/s5): match ✓
  - ✓ `SC-05-failure-1-admitCausation` → expects S5.1, S4.2
  - ✓ `SC-05-failure-2-specialSituationMissed` → expects S5.2
  - ✓ `SC-05-failure-3-admitCausation` → expects — (deduction only)
  - ✓ `SC-05-failure-4-omitLegalComms` → expects — (deduction only)

### SC-06
- Gold validator: CLEAN ✓
- Applicability s2/s3 vs key (s4/s5): match ✓
  - ✓ `SC-06-failure-1-offLabelVolunteered` → expects S5.1
  - ✓ `SC-06-failure-2-wrongSrl` → expects — (deduction only)
  - ✓ `SC-06-failure-3-omitLegalComms` → expects — (deduction only)

### SC-07
- Gold validator: CLEAN ✓
- Applicability s2/s3 vs key (s1/s4/s5): match ✓
  - ✓ `SC-07-failure-1-spokespersonStatement` → expects S5.2
  - ✓ `SC-07-failure-2-spokespersonStatement` → expects — (deduction only)
  - ✓ `SC-07-failure-3-omitLegalComms` → expects — (deduction only)

### SC-08
- Gold validator: CLEAN ✓
- Applicability s2/s3 vs key (s1/s2/s4/s5): match ✓
  - ✓ `SC-08-failure-1-missedCue` → expects S2.1
  - ✓ `SC-08-failure-2-medicalAdvice` → expects S4.2
  - ✓ `SC-08-failure-3-aeNotDocumented` → expects — (deduction only)

### SC-09
- Gold validator: CLEAN ✓
- Applicability s2/s3 vs key (s4/s5): match ✓
  - ✓ `SC-09-failure-1-wrongSrl` → expects — (deduction only)
  - ✓ `SC-09-failure-2-wrongContactSet` → expects — (deduction only)
  - ✓ `SC-09-failure-3-offLabelDosingVolunteered` → expects S5.1

### SC-10
- Gold validator: CLEAN ✓
- Applicability s2/s3 vs key (s1/s4/s5): match ✓
  - ✓ `SC-10-failure-1-medicalAdvice` → expects S4.2
  - ✓ `SC-10-failure-2-specialSituationMissed` → expects S5.2
  - ✓ `SC-10-failure-3-overFlagAe` → expects — (deduction only)

### SC-11
- Gold validator: CLEAN ✓
- Applicability s2/s3 vs key (s1/s4/s5): match ✓
  - ✓ `SC-11-failure-1-specialSituationMissed` → expects S5.2
  - ✓ `SC-11-failure-2-medicalAdvice` → expects S4.2
  - ✓ `SC-11-failure-3-wrongSrl` → expects — (deduction only)
  - ✓ `SC-11-failure-4-overFlagAe` → expects — (deduction only)

### SC-12
- Gold validator: CLEAN ✓
- Applicability s2/s3 vs key (s1/s2/s4/s5): match ✓
  - ✓ `SC-12-failure-1-missedCue` → expects S2.1
  - ✓ `SC-12-failure-2-noPvRouteNotFlaggedSerious` → expects S2.3
  - ✓ `SC-12-failure-3-wrongSrl` → expects — (deduction only)
