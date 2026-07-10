"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { createOrgScenario, type CreateOrgScenarioInput } from "@/lib/admin/answer-keys";

type OrgSrlDraft = {
  srlCode: string;
  title: string;
  therapeuticArea: string;
  body: string;
};

const EMPTY_SRL: OrgSrlDraft = { srlCode: "", title: "", therapeuticArea: "", body: "" };

const ANSWER_KEY_PLACEHOLDER = `{
  "case_id": "SC-01",
  "difficulty_tier": 1,
  "channel": "text",
  "requester": { "type": "hcp", "solicited": true },
  "safety": {
    "ae_present": false,
    "pc_present": false,
    "pregnancy_or_lactation": false,
    "special_situations": ["none"]
  },
  "compliance": { "off_label_involved": false },
  "correct_srl": "SRL-EXAMPLE-001",
  "documentation": {}
}`;

const PERSONA_BRIEF_PLACEHOLDER = `{
  "scenario_premise": "...",
  "persona_profile": "...",
  "beat_sheet": ["..."]
}`;

export function ScenarioIntakeForm() {
  const [title, setTitle] = useState("");
  const [caseCode, setCaseCode] = useState("");
  const [difficulty, setDifficulty] = useState("1");
  const [therapeuticArea, setTherapeuticArea] = useState("");
  const [productRef, setProductRef] = useState("");
  const [isFictionalProduct, setIsFictionalProduct] = useState(true);
  const [answerKeyJson, setAnswerKeyJson] = useState("");
  const [personaBriefJson, setPersonaBriefJson] = useState("");
  const [orgSrls, setOrgSrls] = useState<OrgSrlDraft[]>([{ ...EMPTY_SRL }]);

  const [isPending, startTransition] = useTransition();
  const [errors, setErrors] = useState<string[] | null>(null);
  const [success, setSuccess] = useState<{ templateId: string } | null>(null);

  function updateSrl(index: number, patch: Partial<OrgSrlDraft>) {
    setOrgSrls((prev) => prev.map((srl, i) => (i === index ? { ...srl, ...patch } : srl)));
  }

  function addSrl() {
    setOrgSrls((prev) => [...prev, { ...EMPTY_SRL }]);
  }

  function removeSrl(index: number) {
    setOrgSrls((prev) => prev.filter((_, i) => i !== index));
  }

  function handleSubmit() {
    setErrors(null);
    setSuccess(null);

    const localErrors: string[] = [];
    if (!title.trim()) localErrors.push("Title is required.");
    if (!caseCode.trim()) localErrors.push("Case code is required.");
    const difficultyNum = Number(difficulty);
    if (!Number.isInteger(difficultyNum) || difficultyNum < 1 || difficultyNum > 5) {
      localErrors.push("Difficulty must be a whole number between 1 and 5.");
    }
    if (!answerKeyJson.trim()) localErrors.push("Answer-key JSON is required.");
    const filledSrls = orgSrls.filter(
      (s) => s.srlCode.trim() || s.title.trim() || s.body.trim()
    );
    for (const srl of filledSrls) {
      if (!srl.srlCode.trim() || !srl.title.trim() || !srl.body.trim()) {
        localErrors.push("Each SRL block needs at least a code, title, and body (or remove it).");
        break;
      }
    }
    if (localErrors.length > 0) {
      setErrors(localErrors);
      return;
    }

    const input: CreateOrgScenarioInput = {
      title: title.trim(),
      caseCode: caseCode.trim(),
      difficulty: difficultyNum,
      therapeuticArea: therapeuticArea.trim() || null,
      productRef: productRef.trim() || null,
      isFictionalProduct,
      answerKeyJson,
      personaBriefJson: personaBriefJson.trim() || null,
      orgSrls: filledSrls.map((s) => ({
        srlCode: s.srlCode.trim(),
        title: s.title.trim(),
        therapeuticArea: s.therapeuticArea.trim() || null,
        body: s.body,
      })),
    };

    startTransition(async () => {
      const result = await createOrgScenario(input);
      if (!result.ok) {
        setErrors(result.errors);
        return;
      }
      setSuccess({ templateId: result.templateId });
    });
  }

  if (success) {
    return (
      <div className="rounded-lg border border-emerald-300 bg-emerald-50 p-6">
        <h2 className="text-sm font-semibold text-emerald-900">Case created</h2>
        <p className="mt-2 text-sm text-emerald-800">
          This case starts <strong>drafted</strong> and <strong>unapproved</strong>. It is
          invisible to trainee queues and accreditation eligibility until it is reviewed and
          Nathan approves the rubric from the case editor.
        </p>
        <div className="mt-4 flex gap-3">
          <Link
            href={`/admin/cases/${success.templateId}`}
            className="rounded-md bg-blue-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-600"
          >
            Open case editor
          </Link>
          <Link
            href="/admin/cases"
            className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
          >
            Back to case bank
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-slate-200 p-5">
        <h2 className="text-sm font-semibold text-slate-900">Case brief</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-xs font-medium text-slate-700">Title</span>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            />
          </label>

          <label className="block">
            <span className="text-xs font-medium text-slate-700">Case code</span>
            <input
              type="text"
              placeholder="e.g. ACME-01"
              value={caseCode}
              onChange={(e) => setCaseCode(e.target.value)}
              className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            />
          </label>

          <label className="block">
            <span className="text-xs font-medium text-slate-700">Difficulty tier (1–5)</span>
            <input
              type="number"
              min={1}
              max={5}
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            />
          </label>

          <label className="block">
            <span className="text-xs font-medium text-slate-700">Therapeutic area</span>
            <input
              type="text"
              value={therapeuticArea}
              onChange={(e) => setTherapeuticArea(e.target.value)}
              className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            />
          </label>

          <label className="block">
            <span className="text-xs font-medium text-slate-700">Product reference</span>
            <input
              type="text"
              value={productRef}
              onChange={(e) => setProductRef(e.target.value)}
              className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            />
          </label>

          <label className="mt-6 flex items-center gap-2">
            <input
              type="checkbox"
              checked={isFictionalProduct}
              onChange={(e) => setIsFictionalProduct(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300"
            />
            <span className="text-sm text-slate-700">Product is fictional</span>
          </label>
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 p-5">
        <h2 className="text-sm font-semibold text-slate-900">Answer key</h2>
        <p className="mt-1 text-xs text-slate-500">
          Full ground-truth JSON matching the seed-case schema. Validated server-side on
          submit; errors are shown below if it doesn&apos;t validate.
        </p>
        <textarea
          value={answerKeyJson}
          onChange={(e) => setAnswerKeyJson(e.target.value)}
          rows={14}
          placeholder={ANSWER_KEY_PLACEHOLDER}
          spellCheck={false}
          className="mt-3 block w-full rounded-md border border-slate-300 px-3 py-2 font-mono text-xs leading-relaxed focus:border-blue-500 focus:outline-none"
        />
      </div>

      <div className="rounded-lg border border-slate-200 p-5">
        <h2 className="text-sm font-semibold text-slate-900">Persona brief (optional)</h2>
        <p className="mt-1 text-xs text-slate-500">
          Shape: <code className="font-mono">{"{ scenario_premise, persona_profile, beat_sheet }"}</code>.
          Leave blank for a documentation-only case.
        </p>
        <textarea
          value={personaBriefJson}
          onChange={(e) => setPersonaBriefJson(e.target.value)}
          rows={8}
          placeholder={PERSONA_BRIEF_PLACEHOLDER}
          spellCheck={false}
          className="mt-3 block w-full rounded-md border border-slate-300 px-3 py-2 font-mono text-xs leading-relaxed focus:border-blue-500 focus:outline-none"
        />
      </div>

      <div className="rounded-lg border border-slate-200 p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-900">Org SRLs (Standard Response Letters)</h2>
          <button
            type="button"
            onClick={addSrl}
            className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50"
          >
            + Add SRL
          </button>
        </div>
        <p className="mt-1 text-xs text-slate-500">
          Org-scoped standard response documents this case can draw on, including decoys.
        </p>

        <div className="mt-4 space-y-4">
          {orgSrls.map((srl, i) => (
            <div key={i} className="rounded-md border border-slate-200 p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500">SRL #{i + 1}</span>
                {orgSrls.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeSrl(i)}
                    className="text-xs font-medium text-red-600 hover:text-red-700"
                  >
                    Remove
                  </button>
                )}
              </div>
              <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <label className="block">
                  <span className="text-xs font-medium text-slate-700">SRL code</span>
                  <input
                    type="text"
                    value={srl.srlCode}
                    onChange={(e) => updateSrl(i, { srlCode: e.target.value })}
                    className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  />
                </label>
                <label className="block">
                  <span className="text-xs font-medium text-slate-700">Title</span>
                  <input
                    type="text"
                    value={srl.title}
                    onChange={(e) => updateSrl(i, { title: e.target.value })}
                    className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  />
                </label>
                <label className="block">
                  <span className="text-xs font-medium text-slate-700">Therapeutic area</span>
                  <input
                    type="text"
                    value={srl.therapeuticArea}
                    onChange={(e) => updateSrl(i, { therapeuticArea: e.target.value })}
                    className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  />
                </label>
              </div>
              <label className="mt-3 block">
                <span className="text-xs font-medium text-slate-700">Body</span>
                <textarea
                  value={srl.body}
                  onChange={(e) => updateSrl(i, { body: e.target.value })}
                  rows={4}
                  className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                />
              </label>
            </div>
          ))}
        </div>
      </div>

      {errors && errors.length > 0 && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <p className="font-medium">Could not create case:</p>
          <ul className="mt-1 list-disc pl-5">
            {errors.map((err, i) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="rounded-md border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-700">
        This case will be created <strong>drafted</strong> and <strong>unapproved</strong> —
        invisible to trainee queues and accreditation until it is reviewed and approved from
        the case editor.
      </div>

      <button
        type="button"
        disabled={isPending}
        onClick={handleSubmit}
        className="rounded-md bg-blue-700 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Creating…" : "Create custom scenario"}
      </button>
    </div>
  );
}
