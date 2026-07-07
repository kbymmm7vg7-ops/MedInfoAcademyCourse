// SERVER-ONLY persona turn runner. Shared by the /api/persona/turn route and
// the automated transcript test harness (scripts/persona-transcript-test.mjs
// imports the compiled logic via tsx).
import Anthropic from "@anthropic-ai/sdk";
import { MODEL_POLICY } from "@/lib/config/models";

export type ChatTurn = { speaker: "persona" | "trainee"; content: string };

const MAX_PERSONA_TOKENS = 400; // phone-register turns are short
export const MAX_TURNS_PER_INSTANCE = 60; // cost guard

let client: Anthropic | null = null;
function getClient(): Anthropic {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error(
      "ANTHROPIC_API_KEY is not set — the persona engine requires it. Add it to app/.env.local."
    );
  }
  client ??= new Anthropic();
  return client;
}

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

  const messages: Anthropic.MessageParam[] = [
    ...history.map((t) => ({
      role: t.speaker === "trainee" ? ("user" as const) : ("assistant" as const),
      content: t.content,
    })),
    { role: "user" as const, content: traineeMessage },
  ];

  const response = await getClient().messages.create({
    model: graded ? MODEL_POLICY.gradedPersona : MODEL_POLICY.practicePersona,
    max_tokens: MAX_PERSONA_TOKENS,
    system: systemPrompt,
    messages,
  });

  const text = response.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("")
    .trim();

  if (!text) throw new Error("Persona returned an empty reply");
  return text;
}
