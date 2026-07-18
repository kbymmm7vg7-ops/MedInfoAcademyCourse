import { MODEL_POLICY, type ModelRole } from "@/lib/config/models";
import type { LlmAdapter, LlmVendor } from "@/lib/llm/types";
import { createGroqLlm } from "@/lib/llm/groq";
import { createAnthropicLlm } from "@/lib/llm/anthropic";

// Provider resolution (mirrors voice/config.ts posture: env-driven, lenient on
// unknown values). Precedence: per-role override > LLM_PROVIDER > code default.
//
//   LLM_PROVIDER                     groq | anthropic   (default: groq)
//   LLM_PROVIDER_EVALUATOR           per-role overrides, same values
//   LLM_PROVIDER_GRADED_PERSONA
//   LLM_PROVIDER_PRACTICE_PERSONA
//   LLM_PROVIDER_COACHING
//
// Rollback to Anthropic is therefore one env var — no code change.

const DEFAULT_VENDOR: LlmVendor = "groq";

const ROLE_ENV: Record<ModelRole, string> = {
  evaluator: "LLM_PROVIDER_EVALUATOR",
  gradedPersona: "LLM_PROVIDER_GRADED_PERSONA",
  practicePersona: "LLM_PROVIDER_PRACTICE_PERSONA",
  coaching: "LLM_PROVIDER_COACHING",
};

function parseVendor(value: string | undefined): LlmVendor | null {
  return value === "groq" || value === "anthropic" ? value : null;
}

export function resolveLlmVendor(role: ModelRole): LlmVendor {
  return (
    parseVendor(process.env[ROLE_ENV[role]]) ??
    parseVendor(process.env.LLM_PROVIDER) ??
    DEFAULT_VENDOR
  );
}

/** Resolved model id for a role — for record stamping and harness reports. */
export function modelFor(role: ModelRole): string {
  return MODEL_POLICY[role][resolveLlmVendor(role)];
}

/** Which env key a role needs — for script preflight checks. */
export function requiredKeyFor(role: ModelRole): "GROQ_API_KEY" | "ANTHROPIC_API_KEY" {
  return resolveLlmVendor(role) === "anthropic" ? "ANTHROPIC_API_KEY" : "GROQ_API_KEY";
}

export function getLlm(role: ModelRole): { adapter: LlmAdapter; model: string } {
  const vendor = resolveLlmVendor(role);
  return {
    adapter: vendor === "anthropic" ? createAnthropicLlm() : createGroqLlm(),
    model: MODEL_POLICY[role][vendor],
  };
}
