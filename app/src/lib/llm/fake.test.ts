import { describe, it, expect, beforeEach, afterEach } from "vitest";
import {
  createFakeLlm,
  fakePersonaReply,
  parseApplicabilityFromPrompt,
  buildFakeEvaluatorOutput,
  FAKE_PERSONA_LINES,
  FAKE_EVIDENCE_PLACEHOLDER,
} from "./fake";
import { resolveLlmVendor, getLlm, modelFor, requiredKeyFor } from "./config";
import { buildEvaluatorUserPrompt } from "@/lib/evaluator/prompt";
import { S2_CRITERIA, S3_CRITERIA, S4_CRITERIA, S5_CRITERIA } from "@/lib/evaluator/criteria";
import type { DocumentationFormState } from "@/lib/simulator/types";

const ENV_VARS = [
  "LLM_PROVIDER",
  "LLM_PROVIDER_EVALUATOR",
  "LLM_PROVIDER_GRADED_PERSONA",
  "LLM_PROVIDER_PRACTICE_PERSONA",
  "LLM_PROVIDER_COACHING",
] as const;

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

describe("fake adapter selection", () => {
  it("is selectable with LLM_PROVIDER=fake", () => {
    process.env.LLM_PROVIDER = "fake";
    expect(resolveLlmVendor("gradedPersona")).toBe("fake");
    expect(getLlm("gradedPersona").adapter.vendor).toBe("fake");
    expect(modelFor("evaluator")).toBe("fake/evaluator");
  });

  it("is selectable per role and needs no API key", () => {
    process.env.LLM_PROVIDER_EVALUATOR = "fake";
    expect(resolveLlmVendor("evaluator")).toBe("fake");
    expect(requiredKeyFor("evaluator")).toBeNull();
    // other roles keep the real default
    expect(resolveLlmVendor("gradedPersona")).toBe("groq");
    expect(requiredKeyFor("gradedPersona")).toBe("GROQ_API_KEY");
  });
});

describe("fake persona replies", () => {
  it("cycles the canned lines deterministically per turn", () => {
    expect(fakePersonaReply(0)).toBe(FAKE_PERSONA_LINES[0]);
    expect(fakePersonaReply(1)).toBe(FAKE_PERSONA_LINES[1]);
    expect(fakePersonaReply(FAKE_PERSONA_LINES.length)).toBe(FAKE_PERSONA_LINES[0]);
    expect(fakePersonaReply(3)).toBe(fakePersonaReply(3));
  });

  it("chat() advances with the number of prior persona replies", async () => {
    const adapter = createFakeLlm();
    const first = await adapter.chat({
      model: "fake/persona",
      system: "s",
      messages: [{ role: "user", content: "hello" }],
      maxTokens: 100,
    });
    const second = await adapter.chat({
      model: "fake/persona",
      system: "s",
      messages: [
        { role: "user", content: "hello" },
        { role: "assistant", content: first.text },
        { role: "user", content: "again" },
      ],
      maxTokens: 100,
    });
    expect(first.text).toBe(FAKE_PERSONA_LINES[0]);
    expect(second.text).toBe(FAKE_PERSONA_LINES[1]);
    expect(first.text).not.toBe("");
  });

  it("never returns clinical content it could have invented", () => {
    // The canned lines are fixed and content-free by construction; this pins
    // them so a future edit cannot smuggle case facts into the harness.
    for (const line of FAKE_PERSONA_LINES) {
      expect(line.length).toBeLessThan(120);
      expect(line).not.toMatch(/\b(mg|dose|dosage|symptom|rash|pain|hospital|pregnan)/i);
    }
  });
});

describe("fake evaluator output", () => {
  const doc = { intake: {}, inquiry: {}, safety: {}, response: {}, closure: {} } as
    unknown as DocumentationFormState;

  function promptFor(applicability: {
    s1: boolean;
    s2: boolean;
    s3: boolean;
    s4: boolean;
    s5: boolean;
  }) {
    return buildEvaluatorUserPrompt({
      applicability,
      groundTruthJson: { safety: {} },
      transcript: [],
      doc,
      validatorFindings: [],
      channel: "text",
    });
  }

  it("parses the applicability line the real prompt emits", () => {
    const prompt = promptFor({ s1: true, s2: false, s3: false, s4: true, s5: true });
    expect(parseApplicabilityFromPrompt(prompt)).toEqual({
      s1: true,
      s2: false,
      s3: false,
      s4: true,
      s5: true,
    });
  });

  it("defaults to applicable when the line is missing", () => {
    expect(parseApplicabilityFromPrompt("no applicability here")).toEqual({
      s1: true,
      s2: true,
      s3: true,
      s4: true,
      s5: true,
    });
  });

  it("marks every applicable criterion pass with the placeholder evidence", () => {
    const out = buildFakeEvaluatorOutput(
      promptFor({ s1: true, s2: false, s3: false, s4: true, s5: true })
    );
    const ids = out.verdicts.map((v) => v.id);
    expect(ids).toEqual(
      expect.arrayContaining([
        ...S4_CRITERIA.map((c) => c.id),
        ...S5_CRITERIA.map((c) => c.id),
      ])
    );
    // inapplicable sections contribute nothing
    expect(ids.some((id) => id.startsWith("S2."))).toBe(false);
    expect(ids.some((id) => id.startsWith("S3."))).toBe(false);
    // S1.4 is structurally N/A; everything else passes
    expect(out.verdicts.find((v) => v.id === "S1.4")?.result).toBe("na");
    for (const v of out.verdicts.filter((x) => x.id !== "S1.4")) {
      expect(v.result).toBe("pass");
      expect(v.evidence).toBe(FAKE_EVIDENCE_PLACEHOLDER);
    }
    expect(out.coaching_summary).toBe(FAKE_EVIDENCE_PLACEHOLDER);
  });

  it("covers S2/S3 when those sections are applicable", () => {
    const out = buildFakeEvaluatorOutput(
      promptFor({ s1: true, s2: true, s3: true, s4: true, s5: true })
    );
    const ids = new Set(out.verdicts.map((v) => v.id));
    for (const c of [...S2_CRITERIA, ...S3_CRITERIA]) expect(ids.has(c.id)).toBe(true);
  });

  it("structured() serves the evaluator tool and rejects unknown tools", async () => {
    const adapter = createFakeLlm();
    const { json } = await adapter.structured({
      model: "fake/evaluator",
      system: "sys",
      messages: [{ role: "user", content: promptFor({ s1: true, s2: true, s3: true, s4: true, s5: true }) }],
      maxTokens: 8000,
      tool: { name: "submit_evaluation", description: "", inputSchema: {} },
    });
    const out = json as { verdicts: unknown[]; coaching_summary: string };
    expect(out.verdicts.length).toBeGreaterThan(0);
    expect(out.coaching_summary).toBe(FAKE_EVIDENCE_PLACEHOLDER);

    await expect(
      adapter.structured({
        model: "fake/evaluator",
        system: "sys",
        messages: [{ role: "user", content: "x" }],
        maxTokens: 100,
        tool: { name: "something_else", description: "", inputSchema: {} },
      })
    ).rejects.toThrow(/no canned response/);
  });
});
