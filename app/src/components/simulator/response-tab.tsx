"use client";

import { useMemo, useState } from "react";
import { DELIVERY_METHODS, type ResponseData, type SrlCandidate } from "@/lib/simulator/types";
import { Field, Select, TextArea } from "@/components/simulator/field";

export function ResponseTab({
  response,
  srlCandidates,
  openBook,
  onChange,
  disabled,
}: {
  response: ResponseData;
  srlCandidates: SrlCandidate[];
  openBook: boolean;
  onChange: (patch: Partial<ResponseData>) => void;
  disabled?: boolean;
}) {
  const [query, setQuery] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return srlCandidates;
    return srlCandidates.filter(
      (c) =>
        c.title.toLowerCase().includes(q) || (c.srl_code ?? "").toLowerCase().includes(q)
    );
  }, [query, srlCandidates]);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-medium text-slate-700">
          Standard Response Letter (SRL) search
        </p>
        <p className="mt-1 text-xs text-slate-400">
          {openBook
            ? "Open-book: expand any SRL to read its full body before choosing."
            : "Closed-book: titles only. Select based on what you recall from the call."}
        </p>

        <input
          type="text"
          placeholder="Search by title or SRL code…"
          disabled={disabled}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="mt-2 w-full rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />

        <ul className="mt-3 divide-y divide-slate-100 rounded-md border border-slate-200">
          {filtered.length === 0 && (
            <li className="px-3 py-4 text-sm text-slate-400">No matching SRLs.</li>
          )}
          {filtered.map((c) => {
            const selected = response.selected_srl_id === c.id;
            const expanded = expandedId === c.id;
            return (
              <li key={c.id} className={selected ? "bg-blue-50" : ""}>
                <div className="flex items-center justify-between gap-2 px-3 py-2">
                  <button
                    type="button"
                    disabled={disabled}
                    onClick={() => onChange({ selected_srl_id: c.id })}
                    className="flex-1 text-left"
                  >
                    <span className="text-sm font-medium text-slate-900">{c.title}</span>
                    {c.srl_code && (
                      <span className="ml-2 font-mono text-xs text-slate-400">{c.srl_code}</span>
                    )}
                    {selected && (
                      <span className="ml-2 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
                        Selected
                      </span>
                    )}
                  </button>
                  {openBook && c.body && (
                    <button
                      type="button"
                      onClick={() => setExpandedId(expanded ? null : c.id)}
                      className="shrink-0 text-xs text-slate-500 hover:text-slate-800"
                    >
                      {expanded ? "Collapse" : "Expand"}
                    </button>
                  )}
                </div>
                {openBook && expanded && c.body && (
                  <div className="border-t border-slate-100 bg-slate-50 px-3 py-3 text-sm whitespace-pre-wrap text-slate-700">
                    {c.body}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      <Field label="Delivery method">
        <Select
          disabled={disabled}
          value={response.delivery_method}
          onChange={(e) =>
            onChange({ delivery_method: e.target.value as ResponseData["delivery_method"] })
          }
        >
          <option value="">Select…</option>
          {DELIVERY_METHODS.map((d) => (
            <option key={d.value} value={d.value}>
              {d.label}
            </option>
          ))}
        </Select>
      </Field>

      <Field label="Verbal answer given (summary)">
        <TextArea
          disabled={disabled}
          rows={3}
          value={response.verbal_answer_given}
          onChange={(e) => onChange({ verbal_answer_given: e.target.value })}
        />
      </Field>
    </div>
  );
}
