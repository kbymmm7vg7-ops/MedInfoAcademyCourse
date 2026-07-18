// SERVER-ONLY persona turn runner. Shared by the /api/persona/turn route and
// the automated transcript test harness (scripts/persona-transcript-test.mjs
// imports the compiled logic via tsx).
import { getLlm } from "@/lib/llm/config";
import type { LlmMessage } from "@/lib/llm/types";

export type ChatTurn = { speaker: "persona" | "trainee"; content: string };

const MAX_PERSONA_TOKENS = 400; // phone-register turns are short
export const MAX_TURNS_PER_INSTANCE = 60; // cost guard

/**
 * Runs one persona turn. `history` is the prior conversation (oldest first),
 * `traineeMessage` the new trainee utterance. Returns the persona's reply.
 */
export async function runPersonaTurn(args: {
  systemPrompt: string;
  history: ChatTurn[];
  traineeMessage: string;
  graded?: boolean;
}): Promise<string> {
  const { systemPrompt, history, traineeMessage, graded = true } = args;

  const messages: LlmMessage[] = [
    ...history.map((t) => ({
      role: t.speaker === "trainee" ? ("user" as const) : ("assistant" as const),
      content: t.content,
    })),
    { role: "user" as const, content: traineeMessage },
  ];

  const { adapter, model } = getLlm(graded ? "gradedPersona" : "practicePersona");
  const { text } = await adapter.chat({
    model,
    system: systemPrompt,
    maxTokens: MAX_PERSONA_TOKENS,
    messages,
  });

  if (!text) throw new Error("Persona returned an empty reply");
  return text;
}
