import Anthropic from "@anthropic-ai/sdk";
import {
  LlmConfigError,
  type LlmAdapter,
  type LlmChatArgs,
  type LlmStructuredArgs,
} from "@/lib/llm/types";

// Anthropic is the fallback LLM provider (LLM_PROVIDER=anthropic); Groq is the
// runtime default. This file is the only import site of @anthropic-ai/sdk.

let client: Anthropic | null = null;
function getClient(): Anthropic {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new LlmConfigError(
      "ANTHROPIC_API_KEY is not set — required for the anthropic LLM provider. Add it to app/.env.local."
    );
  }
  client ??= new Anthropic();
  return client;
}

export function createAnthropicLlm(): LlmAdapter {
  return {
    vendor: "anthropic",

    async chat({ model, system, messages, maxTokens }: LlmChatArgs): Promise<{ text: string }> {
      const response = await getClient().messages.create({
        model,
        max_tokens: maxTokens,
        system,
        messages,
      });
      const text = response.content
        .filter((b): b is Anthropic.TextBlock => b.type === "text")
        .map((b) => b.text)
        .join("")
        .trim();
      return { text };
    },

    async structured({
      model,
      system,
      messages,
      maxTokens,
      tool,
    }: LlmStructuredArgs): Promise<{ json: unknown }> {
      const response = await getClient().messages.create({
        model,
        max_tokens: maxTokens,
        system,
        messages,
        tools: [
          {
            name: tool.name,
            description: tool.description,
            input_schema: tool.inputSchema,
          } as Anthropic.Tool,
        ],
        tool_choice: { type: "tool", name: tool.name },
      });
      const block = response.content.find(
        (b): b is Anthropic.ToolUseBlock => b.type === "tool_use" && b.name === tool.name
      );
      if (!block) throw new Error("LLM returned no structured output");
      return { json: block.input };
    },
  };
}
