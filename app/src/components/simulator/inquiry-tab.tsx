"use client";

import { useState } from "react";
import type { InquiryData } from "@/lib/simulator/types";
import { Field, TextArea, TextInput } from "@/components/simulator/field";

export function InquiryTab({
  inquiry,
  onChange,
  disabled,
}: {
  inquiry: InquiryData;
  onChange: (patch: Partial<InquiryData>) => void;
  disabled?: boolean;
}) {
  const [newProbe, setNewProbe] = useState("");

  function addProbe() {
    const trimmed = newProbe.trim();
    if (!trimmed) return;
    onChange({ probing_questions: [...inquiry.probing_questions, trimmed] });
    setNewProbe("");
  }

  function removeProbe(index: number) {
    onChange({
      probing_questions: inquiry.probing_questions.filter((_, i) => i !== index),
    });
  }

  return (
    <div className="space-y-6">
      <Field label="Inquiry summary" required>
        <TextArea
          disabled={disabled}
          rows={3}
          value={inquiry.summary}
          onChange={(e) => onChange({ summary: e.target.value })}
        />
      </Field>

      <Field label="Verbatim question" required>
        <TextArea
          disabled={disabled}
          rows={3}
          value={inquiry.verbatim_question}
          placeholder="Capture the requester's question in their own words"
          onChange={(e) => onChange({ verbatim_question: e.target.value })}
        />
      </Field>

      <div>
        <p className="text-xs font-medium text-slate-700">Probing / clarifying questions asked</p>
        <ul className="mt-2 space-y-2">
          {inquiry.probing_questions.map((q, i) => (
            <li
              key={i}
              className="flex items-start justify-between gap-2 rounded-md bg-slate-50 px-3 py-2 text-sm text-slate-700"
            >
              <span>{q}</span>
              {!disabled && (
                <button
                  type="button"
                  onClick={() => removeProbe(i)}
                  className="shrink-0 text-xs text-slate-400 hover:text-red-600"
                >
                  Remove
                </button>
              )}
            </li>
          ))}
          {inquiry.probing_questions.length === 0 && (
            <li className="text-sm text-slate-400">No probing questions logged yet.</li>
          )}
        </ul>

        {!disabled && (
          <div className="mt-3 flex gap-2">
            <TextInput
              value={newProbe}
              placeholder="Add a probing question…"
              onChange={(e) => setNewProbe(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addProbe();
                }
              }}
            />
            <button
              type="button"
              onClick={addProbe}
              className="shrink-0 rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Add
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
