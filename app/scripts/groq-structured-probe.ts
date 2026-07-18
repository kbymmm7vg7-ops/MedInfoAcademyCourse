// =============================================================================
// GROQ STRUCTURED-OUTPUT PROBE (paid, pennies)
// =============================================================================
// Sends an evaluator-style request (real system prompt + stub user prompt) to
// the configured Groq evaluator model 3x in json_schema mode and 3x in forced
// tool-call mode, then reports which mode returns well-formed verdicts
// reliably. Pin the winner as GROQ_STRUCTURED_MODE in src/lib/llm/groq.ts.
// Re-run whenever the evaluator model changes (e.g. kimi-k2 escalation).
//
// Usage: cd app && npx tsx scripts/groq-structured-probe.ts
// =============================================================================

import { readFileSync, existsSync } from "fs";
import { join } from "path";

const envPath = join(__dirname, "../.env.local");
if (existsSync(envPath)) {
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim();
  }
}

import { createGroqLlm, type GroqStructuredMode } from "../src/lib/llm/groq";
import { buildEvaluatorSystemPrompt, EVALUATOR_TOOL_SCHEMA } from "../src/lib/evaluator/prompt";
import { MODEL_POLICY } from "../src/lib/config/models";

const RUNS_PER_MODE = 3;

// Deliberately minimal: the probe measures structured-output plumbing (does the
// mode return parseable, schema-shaped verdicts), not grading accuracy — the
// calibration harness owns accuracy.
const STUB_USER_PROMPT = `## Case channel
text (a live conversation; vocal-delivery criteria are na)

## Section applicability (pre-computed — return NO criteria for inapplicable sections)
S1: true · S2: false · S3: false · S4: true · S5: true
Do not return any S2, S3 criteria.

## Ground-truth answer key (authoritative)
\`\`\`json
{ "case_id": "PROBE-01", "requester": { "type": "patient" }, "correct_srl": "none",
  "safety": { "ae_present": false, "pc_present": false, "special_situations": [] },
  "correct_routes": [] }
\`\`\`

## Fixed validator findings (return these criteria EXACTLY as stated)
(none)

## Call transcript
[1] TRAINEE: Medical Information, this is Alex. How can I help you today?
[2] PERSONA: Hi, I just wanted to check whether I can take my tablet with food.
[3] TRAINEE: Yes — per the label it may be taken with or without food. Anything else I can help with?
[4] PERSONA: No, that's all. Thanks!

## Submitted documentation record
\`\`\`json
{ "intake": { "inquiry_category": "Pharmacokinetics" }, "response": { "delivery_method": "verbal", "verbal_answer_given": true } }
\`\`\`

Evaluate now. Return every applicable criterion exactly once.`;

type Verdict = { id?: unknown; result?: unknown };

function validate(json: unknown): string | null {
  if (!json || typeof json !== "object") return "not an object";
  const o = json as { verdicts?: unknown; coaching_summary?: unknown };
  if (!Array.isArray(o.verdicts) || o.verdicts.length === 0) return "verdicts missing/empty";
  for (const v of o.verdicts as Verdict[]) {
    if (typeof v.id !== "string" || !/^S[1-5]\.[0-9]{1,2}$/.test(v.id)) return `bad id: ${v.id}`;
    if (v.result !== "pass" && v.result !== "fail" && v.result !== "na") return `bad result: ${v.result}`;
  }
  if (typeof o.coaching_summary !== "string") return "coaching_summary missing";
  return null;
}

async function probeMode(mode: GroqStructuredMode): Promise<number> {
  const adapter = createGroqLlm(mode);
  const system = buildEvaluatorSystemPrompt();
  let ok = 0;
  for (let i = 0; i < RUNS_PER_MODE; i++) {
    try {
      const { json } = await adapter.structured({
        model: MODEL_POLICY.evaluator.groq,
        system,
        messages: [{ role: "user", content: STUB_USER_PROMPT }],
        maxTokens: 8000,
        tool: {
          name: EVALUATOR_TOOL_SCHEMA.name,
          description: EVALUATOR_TOOL_SCHEMA.description,
          inputSchema: EVALUATOR_TOOL_SCHEMA.input_schema,
        },
      });
      const problem = validate(json);
      if (problem) {
        console.log(`  ${mode} run ${i + 1}: INVALID — ${problem}`);
      } else {
        ok++;
        console.log(
          `  ${mode} run ${i + 1}: OK (${(json as { verdicts: unknown[] }).verdicts.length} verdicts)`
        );
      }
    } catch (e) {
      console.log(`  ${mode} run ${i + 1}: ERROR — ${e instanceof Error ? e.message : e}`);
    }
  }
  return ok;
}

async function main() {
  if (!process.env.GROQ_API_KEY) {
    console.error("GROQ_API_KEY is not set. Aborting.");
    process.exit(2);
  }
  console.log(`Probing ${MODEL_POLICY.evaluator.groq} structured-output modes (${RUNS_PER_MODE} runs each)…\n`);
  const jsonSchemaOk = await probeMode("json_schema");
  const toolOk = await probeMode("tool");

  console.log(`\njson_schema: ${jsonSchemaOk}/${RUNS_PER_MODE}   tool: ${toolOk}/${RUNS_PER_MODE}`);
  if (jsonSchemaOk === RUNS_PER_MODE) {
    console.log("RECOMMENDATION: json_schema (keep GROQ_STRUCTURED_MODE = \"json_schema\").");
  } else if (toolOk === RUNS_PER_MODE) {
    console.log("RECOMMENDATION: tool (set GROQ_STRUCTURED_MODE = \"tool\" in src/lib/llm/groq.ts).");
  } else {
    console.log("NEITHER mode is fully reliable — investigate before running paid calibration.");
  }
  process.exit(jsonSchemaOk === RUNS_PER_MODE || toolOk === RUNS_PER_MODE ? 0 : 1);
}

main().catch((err) => {
  console.error(err);
  process.exit(2);
});
