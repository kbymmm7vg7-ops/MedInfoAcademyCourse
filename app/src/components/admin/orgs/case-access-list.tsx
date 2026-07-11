"use client";

import { useState, useTransition } from "react";
import { setOrgCaseAccess } from "@/lib/admin/org-actions";

export type CaseAccessEntry = {
  templateId: string;
  caseCode: string | null;
  title: string;
  /** true only when an org_case_access row exists with enabled = true */
  enabled: boolean;
};

export function CaseAccessList({
  orgId,
  entries,
}: {
  orgId: string;
  entries: CaseAccessEntry[];
}) {
  const [state, setState] = useState<Record<string, boolean>>(
    Object.fromEntries(entries.map((e) => [e.templateId, e.enabled]))
  );
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  // Subset mode is live whenever ANY shared case is enabled; with none
  // enabled, RLS (org_case_allows) falls back to showing the whole bank.
  const anyEnabled = Object.values(state).some(Boolean);

  return (
    <div>
      <p className="text-xs text-slate-500">
        {anyEnabled
          ? "Subset mode: this org's trainees see only the checked shared cases (plus the org's own cases)."
          : "No subset configured: this org currently sees the entire shared bank. Checking the first case switches it to subset mode."}
      </p>
      <ul className="mt-3 divide-y divide-slate-100 rounded-lg border border-slate-200 bg-white">
        {entries.map((entry) => (
          <li key={entry.templateId} className="flex items-center gap-3 px-4 py-2.5">
            <input
              id={`case-access-${entry.templateId}`}
              type="checkbox"
              checked={state[entry.templateId] ?? false}
              disabled={isPending}
              onChange={(e) => {
                const next = e.target.checked;
                const previous = state[entry.templateId] ?? false;
                setState((s) => ({ ...s, [entry.templateId]: next }));
                setPendingId(entry.templateId);
                setError(null);
                startTransition(async () => {
                  const result = await setOrgCaseAccess(orgId, entry.templateId, next);
                  setPendingId(null);
                  if (!result.ok) {
                    setState((s) => ({ ...s, [entry.templateId]: previous }));
                    setError(result.error);
                  }
                });
              }}
              className="h-4 w-4 rounded border-slate-300"
            />
            <label
              htmlFor={`case-access-${entry.templateId}`}
              className="flex-1 cursor-pointer text-sm text-slate-700"
            >
              {entry.caseCode && (
                <span className="mr-2 font-mono text-xs text-slate-500">{entry.caseCode}</span>
              )}
              {entry.title}
            </label>
            {pendingId === entry.templateId && (
              <span className="text-xs text-slate-400">Saving…</span>
            )}
          </li>
        ))}
      </ul>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}
