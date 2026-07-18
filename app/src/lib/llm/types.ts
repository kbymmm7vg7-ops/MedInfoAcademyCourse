// SERVER-ONLY LLM adapter contracts (mirrors the voice adapter layer in
// @/lib/voice/types). System prompts passed through here embed answer-key
// material and must never reach the client.
//
// `maxTokens` is the VISIBLE-TEXT budget. Reasoning models spend completion
// tokens on hidden analysis before the reply; adapters own whatever headroom
// their vendor needs on top of `maxTokens` so callers never think about it.

export type LlmVendor = "groq" | "anthropic";

export type LlmMessage = { role: "user" | "assistant"; content: string };

export type LlmChatArgs = {
  model: string;
  system: string;
  messages: LlmMessage[];
  maxTokens: number;
};

/** Provider-neutral structured-output request (Anthropic tool_use shape and
 *  OpenAI function/json_schema shapes are both derived from this). */
export type LlmTool = {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
};

export type LlmStructuredArgs = LlmChatArgs & { tool: LlmTool };

export interface LlmAdapter {
  readonly vendor: LlmVendor;
  chat(args: LlmChatArgs): Promise<{ text: string }>;
  /** Returns unvalidated JSON — callers keep their own ajv/shape validation. */
  structured(args: LlmStructuredArgs): Promise<{ json: unknown }>;
}

/** Missing-key/misconfiguration errors. Routes map these to 503 (config
 *  problem, surfaced in dev) instead of 502 (transient upstream failure). */
export class LlmConfigError extends Error {}
