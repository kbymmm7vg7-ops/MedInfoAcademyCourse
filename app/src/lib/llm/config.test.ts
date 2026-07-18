import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { resolveLlmVendor, modelFor, requiredKeyFor } from "./config";
import { MODEL_POLICY } from "@/lib/config/models";

const ENV_VARS = [
  "LLM_PROVIDER",
  "LLM_PROVIDER_EVALUATOR",
  "LLM_PROVIDER_GRADED_PERSONA",
  "LLM_PROVIDER_PRACTICE_PERSONA",
  "LLM_PROVIDER_COACHING",
] as const;

describe("resolveLlmVendor", () => {
  const saved: Record<string, string | undefined> = {};

  beforeEach(() => {
    for (const v of ENV_VARS) {
      saved[v] = process.env[v];
      delete process.env[v];
    }
  });
  afterEach(() => {
    for (const v of ENV_VARS) {
      if (saved[v] !== undefined) process.env[v] = saved[v];
      else delete process.env[v];
    }
  });

  it("defaults every role to groq (the cost-preservation decision of record)", () => {
    expect(resolveLlmVendor("evaluator")).toBe("groq");
    expect(resolveLlmVendor("gradedPersona")).toBe("groq");
    expect(resolveLlmVendor("practicePersona")).toBe("groq");
    expect(resolveLlmVendor("coaching")).toBe("groq");
  });

  it("honors the global LLM_PROVIDER rollback switch", () => {
    process.env.LLM_PROVIDER = "anthropic";
    expect(resolveLlmVendor("evaluator")).toBe("anthropic");
    expect(resolveLlmVendor("practicePersona")).toBe("anthropic");
  });

  it("per-role override beats the global setting", () => {
    process.env.LLM_PROVIDER = "groq";
    process.env.LLM_PROVIDER_EVALUATOR = "anthropic";
    expect(resolveLlmVendor("evaluator")).toBe("anthropic");
    expect(resolveLlmVendor("gradedPersona")).toBe("groq");
  });

  it("falls back leniently on unknown vendor strings", () => {
    process.env.LLM_PROVIDER = "openai";
    process.env.LLM_PROVIDER_EVALUATOR = "nonsense";
    expect(resolveLlmVendor("evaluator")).toBe("groq");
  });

  it("modelFor resolves the provider-specific model id", () => {
    expect(modelFor("evaluator")).toBe(MODEL_POLICY.evaluator.groq);
    process.env.LLM_PROVIDER_EVALUATOR = "anthropic";
    expect(modelFor("evaluator")).toBe(MODEL_POLICY.evaluator.anthropic);
  });

  it("requiredKeyFor tracks the resolved provider", () => {
    expect(requiredKeyFor("gradedPersona")).toBe("GROQ_API_KEY");
    process.env.LLM_PROVIDER = "anthropic";
    expect(requiredKeyFor("gradedPersona")).toBe("ANTHROPIC_API_KEY");
  });
});
