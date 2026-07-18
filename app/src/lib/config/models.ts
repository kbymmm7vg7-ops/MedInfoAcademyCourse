// Runtime model policy (RUNBOOK standing rule: app config, not hardcoded per
// call). Per-provider table — the active provider per role is resolved from
// env by @/lib/llm/config (default: groq; Anthropic kept as fallback).
// Groq gpt-oss-120b runs the evaluator and all graded/certification personas;
// gpt-oss-20b is only for ungraded practice personas and the coaching agent.
// Escalation slot if the evaluator calibration gate fails on gpt-oss-120b:
// evaluator.groq -> "moonshotai/kimi-k2-instruct-0905".
export const MODEL_POLICY = {
  evaluator: { groq: "openai/gpt-oss-120b", anthropic: "claude-sonnet-5" },
  gradedPersona: { groq: "openai/gpt-oss-120b", anthropic: "claude-sonnet-5" },
  practicePersona: { groq: "openai/gpt-oss-20b", anthropic: "claude-haiku-4-5-20251001" },
  coaching: { groq: "openai/gpt-oss-20b", anthropic: "claude-haiku-4-5-20251001" },
} as const;

export type ModelRole = keyof typeof MODEL_POLICY;
