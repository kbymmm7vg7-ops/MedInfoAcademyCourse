import {
  LlmConfigError,
  type LlmAdapter,
  type LlmChatArgs,
  type LlmStructuredArgs,
} from "@/lib/llm/types";

// Groq-hosted open models via the OpenAI-compatible endpoint (same key and
// fetch pattern as the voice adapters). Runtime default LLM provider.
const GROQ_CHAT_URL = "https://api.groq.com/openai/v1/chat/completions";

/** Structured-output mode. json_schema (response_format) is the primary; the
 *  forced-tool-call fallback exists for models where json_schema proves
 *  unreliable. scripts/groq-structured-probe.ts measures both — pin its
 *  verdict here. */
export const GROQ_STRUCTURED_MODE: GroqStructuredMode = "json_schema";
export type GroqStructuredMode = "json_schema" | "tool";

// gpt-oss models spend completion tokens on a hidden analysis channel before
// the visible reply; headroom keeps callers' maxTokens meaning "visible text".
const REASONING_HEADROOM = 1024;

type GroqChatMessage = {
  content?: string | null;
  reasoning?: string | null;
  tool_calls?: { function?: { name?: string; arguments?: string } }[];
};
type GroqChatResponse = { choices?: { message?: GroqChatMessage }[] };

function getKey(): string {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new LlmConfigError(
      "GROQ_API_KEY is not set — required for the groq LLM provider. Add it to app/.env.local."
    );
  }
  return apiKey;
}

/** Reasoning must NEVER reach the trainee or TTS: the `reasoning` field is
 *  ignored by the callers of this helper, and any inline think-block or
 *  channel-marker leakage in `content` is stripped defensively. */
export function stripReasoning(content: string): string {
  return content
    .replace(/<think>[\s\S]*?<\/think>/g, "")
    .replace(/^\s*analysis[\s\S]*?assistantfinal/, "")
    .trim();
}

/** One retry on 429/5xx/network, honoring retry-after (capped 5s). Groq
 *  dev-tier rate limits are tighter than Anthropic's — cheap insurance. */
async function callGroq(body: Record<string, unknown>): Promise<GroqChatMessage> {
  const apiKey = getKey();
  let lastError: Error | null = null;
  for (let attempt = 0; attempt < 2; attempt++) {
    let res: Response;
    try {
      res = await fetch(GROQ_CHAT_URL, {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      continue;
    }
    if (res.ok) {
      const json = (await res.json()) as GroqChatResponse;
      const message = json.choices?.[0]?.message;
      if (!message) throw new Error("Groq LLM returned no message");
      return message;
    }
    const detail = await res.text().catch(() => "");
    lastError = new Error(`Groq LLM failed (${res.status}): ${detail.slice(0, 300)}`);
    if (res.status !== 429 && res.status < 500) throw lastError;
    const retryAfter = Number(res.headers.get("retry-after"));
    const delayMs =
      Number.isFinite(retryAfter) && retryAfter > 0 ? Math.min(retryAfter * 1000, 5000) : 1000;
    await new Promise((r) => setTimeout(r, delayMs));
  }
  throw lastError ?? new Error("Groq LLM failed");
}

/** reasoning_effort is only accepted by reasoning models; sending it to
 *  non-reasoning models (e.g. llama) is a 400. */
function reasoningParams(model: string): Record<string, unknown> {
  return model.includes("gpt-oss") ? { reasoning_effort: "low" } : {};
}

export function createGroqLlm(structuredMode: GroqStructuredMode = GROQ_STRUCTURED_MODE): LlmAdapter {
  return {
    vendor: "groq",

    async chat({ model, system, messages, maxTokens }: LlmChatArgs): Promise<{ text: string }> {
      const message = await callGroq({
        model,
        messages: [{ role: "system", content: system }, ...messages],
        max_completion_tokens: maxTokens + REASONING_HEADROOM,
        ...reasoningParams(model),
      });
      return { text: stripReasoning(message.content ?? "") };
    },

    async structured({
      model,
      system,
      messages,
      maxTokens,
      tool,
    }: LlmStructuredArgs): Promise<{ json: unknown }> {
      const base = {
        model,
        messages: [{ role: "system", content: system }, ...messages],
        max_completion_tokens: maxTokens + REASONING_HEADROOM,
      };
      if (structuredMode === "json_schema") {
        const message = await callGroq({
          ...base,
          // No strict:true — the schema uses pattern/minimum/maximum, which
          // strict-mode subsets can reject; callers re-validate with ajv.
          response_format: {
            type: "json_schema",
            json_schema: { name: tool.name, schema: tool.inputSchema },
          },
        });
        const text = stripReasoning(message.content ?? "");
        if (!text) throw new Error("LLM returned no structured output");
        return { json: JSON.parse(text) };
      }
      const message = await callGroq({
        ...base,
        tools: [
          {
            type: "function",
            function: { name: tool.name, description: tool.description, parameters: tool.inputSchema },
          },
        ],
        tool_choice: { type: "function", function: { name: tool.name } },
      });
      const args = message.tool_calls?.[0]?.function?.arguments;
      if (!args) throw new Error("LLM returned no structured output");
      return { json: JSON.parse(args) };
    },
  };
}
