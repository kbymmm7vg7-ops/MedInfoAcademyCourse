import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { createGroqLlm, stripReasoning } from "./groq";
import { LlmConfigError } from "./types";

function jsonResponse(body: unknown, init?: { status?: number; headers?: Record<string, string> }) {
  return new Response(JSON.stringify(body), {
    status: init?.status ?? 200,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });
}

function chatBody(message: Record<string, unknown>) {
  return { choices: [{ message }] };
}

const CHAT_ARGS = {
  model: "openai/gpt-oss-120b",
  system: "You are a caller.",
  messages: [{ role: "user" as const, content: "Hello?" }],
  maxTokens: 400,
};

const TOOL = {
  name: "submit_evaluation",
  description: "Submit verdicts.",
  inputSchema: { type: "object", properties: { verdicts: { type: "array" } } },
};

describe("stripReasoning", () => {
  it("strips <think> blocks and channel markers, passes clean text through", () => {
    expect(stripReasoning("<think>secret analysis</think>Hi, this is Ruth.")).toBe(
      "Hi, this is Ruth."
    );
    expect(stripReasoning("analysisThe user asked X so I will…assistantfinalHi there.")).toBe(
      "Hi there."
    );
    expect(stripReasoning("Hi, this is Ruth.")).toBe("Hi, this is Ruth.");
  });
});

describe("createGroqLlm", () => {
  const savedKey = process.env.GROQ_API_KEY;
  const fetchMock = vi.fn();

  beforeEach(() => {
    process.env.GROQ_API_KEY = "test-key";
    fetchMock.mockReset();
    vi.stubGlobal("fetch", fetchMock);
  });
  afterEach(() => {
    vi.unstubAllGlobals();
    if (savedKey !== undefined) process.env.GROQ_API_KEY = savedKey;
    else delete process.env.GROQ_API_KEY;
  });

  it("throws LlmConfigError when GROQ_API_KEY is missing", async () => {
    delete process.env.GROQ_API_KEY;
    await expect(createGroqLlm().chat(CHAT_ARGS)).rejects.toBeInstanceOf(LlmConfigError);
  });

  it("chat ignores the reasoning field and returns only visible content", async () => {
    fetchMock.mockResolvedValueOnce(
      jsonResponse(chatBody({ content: "Hi, this is Ruth.", reasoning: "hidden analysis" }))
    );
    const { text } = await createGroqLlm().chat(CHAT_ARGS);
    expect(text).toBe("Hi, this is Ruth.");
    const body = JSON.parse(fetchMock.mock.calls[0][1].body as string);
    expect(body.max_completion_tokens).toBeGreaterThan(400); // reasoning headroom
    expect(body.reasoning_effort).toBe("low"); // gpt-oss only
  });

  it("omits reasoning_effort for non-reasoning models", async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse(chatBody({ content: "ok" })));
    await createGroqLlm().chat({ ...CHAT_ARGS, model: "llama-3.3-70b-versatile" });
    const body = JSON.parse(fetchMock.mock.calls[0][1].body as string);
    expect(body.reasoning_effort).toBeUndefined();
  });

  it("retries once on 429 then succeeds", async () => {
    fetchMock
      .mockResolvedValueOnce(
        new Response("rate limited", { status: 429, headers: { "retry-after": "0" } })
      )
      .mockResolvedValueOnce(jsonResponse(chatBody({ content: "second try" })));
    const { text } = await createGroqLlm().chat(CHAT_ARGS);
    expect(text).toBe("second try");
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("does not retry non-429 4xx errors", async () => {
    fetchMock.mockResolvedValueOnce(new Response("bad request", { status: 400 }));
    await expect(createGroqLlm().chat(CHAT_ARGS)).rejects.toThrow("Groq LLM failed (400)");
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("structured json_schema mode sends response_format and parses content", async () => {
    fetchMock.mockResolvedValueOnce(
      jsonResponse(chatBody({ content: '{"verdicts":[{"id":"S1.1","result":"pass"}]}' }))
    );
    const { json } = await createGroqLlm("json_schema").structured({
      ...CHAT_ARGS,
      maxTokens: 8000,
      tool: TOOL,
    });
    expect((json as { verdicts: unknown[] }).verdicts).toHaveLength(1);
    const body = JSON.parse(fetchMock.mock.calls[0][1].body as string);
    expect(body.response_format.type).toBe("json_schema");
    expect(body.response_format.json_schema.name).toBe("submit_evaluation");
    expect(body.tools).toBeUndefined();
  });

  it("structured tool mode forces the named function and parses arguments", async () => {
    fetchMock.mockResolvedValueOnce(
      jsonResponse(
        chatBody({
          tool_calls: [{ function: { name: "submit_evaluation", arguments: '{"verdicts":[]}' } }],
        })
      )
    );
    const { json } = await createGroqLlm("tool").structured({
      ...CHAT_ARGS,
      maxTokens: 8000,
      tool: TOOL,
    });
    expect(json).toEqual({ verdicts: [] });
    const body = JSON.parse(fetchMock.mock.calls[0][1].body as string);
    expect(body.tool_choice).toEqual({ type: "function", function: { name: "submit_evaluation" } });
    expect(body.response_format).toBeUndefined();
  });

  it("structured throws when no structured output comes back", async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse(chatBody({ content: "" })));
    await expect(
      createGroqLlm("json_schema").structured({ ...CHAT_ARGS, maxTokens: 8000, tool: TOOL })
    ).rejects.toThrow("no structured output");
  });
});
