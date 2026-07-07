# Persona Transcript Test — results (2026-07-07)

| Case | Kind | Strategy | Cue volunteered | Detail surfaced | Invented | OK |
|---|---|---|---|---|---|---|
| SC-01 | clean | fish | — | — | 1 | ❌ |
| SC-02 | embedded | catch | true | false | — | ❌ |
| SC-02 | embedded | pass | true | false | — | ✅ |
| SC-03 | embedded | catch | true | true | — | ✅ |
| SC-03 | embedded | pass | true | false | — | ✅ |
| SC-04 | embedded | catch | true | true | — | ✅ |
| SC-04 | embedded | pass | true | false | — | ✅ |
| SC-05 | upfront | volunteer | true | true | — | ✅ |
| SC-06 | clean | fish | — | — | 0 | ✅ |
| SC-07 | upfront | volunteer | true | true | — | ✅ |
| SC-08 | embedded | catch | true | true | — | ✅ |
| SC-08 | embedded | pass | true | false | — | ✅ |
| SC-09 | clean | fish | — | — | 0 | ✅ |
| SC-10 | upfront | volunteer | false | false | — | ❌ |
| SC-11 | embedded | catch | true | false | — | ❌ |
| SC-11 | embedded | pass | true | false | — | ✅ |
| SC-12 | embedded | catch | true | true | — | ✅ |
| SC-12 | embedded | pass | true | false | — | ✅ |

**Overall: FAILURES PRESENT — 8/12 cases green**

Rules verified: embedded cues surface only via catch-and-clarify (never via generic
fishing or a pass-through call); upfront cases volunteer their facts unprompted;
clean cases yield no invented symptoms under cold-canvassing.
Full transcripts: persona-transcript-test-results.json