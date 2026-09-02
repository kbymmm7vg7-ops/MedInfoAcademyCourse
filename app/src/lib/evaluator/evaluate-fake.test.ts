// End-to-end offline exercise of the evaluation pipeline: fake LLM adapter →
// evaluate.ts → validator → scoring math → ajv against rubric.schema.json.
// Persistence is deliberately NOT covered here (it needs a database); the
// Playwright spec in app/e2e covers the persisted path.
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { evaluateCase } from "./evaluate";
import { emptyFormState } from "@/lib/simulator/types";
import { FAKE_EVIDENCE_PLACEHOLDER } from "@/lib/llm/fake";

const SAVED: Record<string, string | undefined> = {};
beforeEach(() => {
  SAVED.LLM_PROVIDER = process.env.LLM_PROVIDER;
  process.env.LLM_PROVIDER = "fake";
});
afterEach(() => {
  if (SAVED.LLM_PROVIDER !== undefined) process.env.LLM_PROVIDER = SAVED.LLM_PROVIDER;
  else delete process.env.LLM_PROVIDER;
});

describe("evaluateCase against the fake adapter", () => {
  it("produces a schema-valid record without any API key", async () => {
    const doc = emptyFormState({});
    doc.intake.requester_type = "hcp";
    doc.intake.contact_channel = "phone";
    doc.inquiry.summary = "Placeholder inquiry summary for the offline harness.";

    const { record, scored } = await evaluateCase({
      caseInstanceId: "00000000-0000-4000-8000-000000000001",
      caseTemplateId: "00000000-0000-4000-8000-000000000002",
      variantRef: null,
      channel: "text",
      groundTruthJson: { safety: {} },
      transcript: [
        { speaker: "trainee", content: "Hello, how can I help?" },
        { speaker: "persona", content: "Hello? Yes, I can hear you." },
      ],
      doc,
      receivedAt: "2026-01-05T10:00:00.000Z",
      submittedAt: "2026-01-05T10:30:00.000Z",
      sopTimeframeBusinessDays: 1,
      // trivial checker: every word is "spelled correctly"
      spellCheck: () => true,
    });

    // evaluateCase throws when ajv rejects the record, so reaching here is the
    // schema assertion; these pin the shape the pipeline actually produced.
    expect(record.rubric_version).toBe("1.0");
    expect(record.evaluator.model).toBe("fake/evaluator");
    expect(record.overall.coaching_summary).toBe(FAKE_EVIDENCE_PLACEHOLDER);
    expect(["pass", "fail"]).toContain(scored.overallResult);
    expect(record.sections.s4.criteria.length).toBeGreaterThan(0);
  });
});
