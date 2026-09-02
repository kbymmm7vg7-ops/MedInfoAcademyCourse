// Runtime model policy (RUNBOOK standing rule: app config, not hardcoded per
// call). Per-provider table — the active provider per role is resolved from
// env by @/lib/llm/config (default: groq; Anthropic kept as fallback).
// Groq gpt-oss-120b runs the evaluator and all graded/certification personas;
// gpt-oss-20b is only for ungraded practice personas and the coaching agent.
// Escalation slot if the evaluator calibration gate fails on gpt-oss-120b:
// evaluator.groq -> "moonshotai/kimi-k2-instruct-0905".
// The `fake` column is the offline adapter (LLM_PROVIDER=fake, lib/llm/fake.ts):
// no network, no key, no cost. Its ids are stamped into evaluation records so a
// fake-scored row is identifiable and can never be mistaken for a graded run.
export const MODEL_POLICY = {
  evaluator: { groq: "openai/gpt-oss-120b", anthropic: "claude-sonnet-5", fake: "fake/evaluator" },
  gradedPersona: { groq: "openai/gpt-oss-120b", anthropic: "claude-sonnet-5", fake: "fake/persona" },
  practicePersona: { groq: "openai/gpt-oss-20b", anthropic: "claude-haiku-4-5-20251001", fake: "fake/persona" },
  coaching: { groq: "openai/gpt-oss-20b", anthropic: "claude-haiku-4-5-20251001", fake: "fake/coaching" },
} as const;

export type ModelRole = keyof typeof MODEL_POLICY;
