// Runtime model policy (RUNBOOK standing rule: app config, not hardcoded per call).
// Sonnet 5 runs the evaluator and all graded/certification personas; Haiku 4.5
// is only for ungraded practice personas and the coaching agent.
export const MODEL_POLICY = {
  evaluator: "claude-sonnet-5",
  gradedPersona: "claude-sonnet-5",
  practicePersona: "claude-haiku-4-5-20251001",
  coaching: "claude-haiku-4-5-20251001",
} as const;

export type ModelRole = keyof typeof MODEL_POLICY;
