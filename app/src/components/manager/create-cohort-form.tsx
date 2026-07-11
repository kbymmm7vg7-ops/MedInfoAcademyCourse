"use client";

import { useRef, useState, useTransition } from "react";
import { createCohort } from "@/lib/manager/cohort-actions";

export function CreateCohortForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <form
      ref={formRef}
      className="rounded-lg border border-slate-200 bg-white p-5"
      action={(formData: FormData) => {
        setError(null);
        startTransition(async () => {
          const result = await createCohort({
            name: String(formData.get("name") ?? ""),
            startDate: String(formData.get("start_date") ?? "") || null,
            endDate: String(formData.get("end_date") ?? "") || null,
          });
          if (!result.ok) {
            setError(result.error);
          } else {
            formRef.current?.reset();
          }
        });
      }}
    >
      <p className="mb-3 text-sm font-medium text-slate-900">New cohort</p>
      <div className="flex flex-wrap items-end gap-3">
        <label className="flex-1 min-w-48">
          <span className="mb-1 block text-xs font-medium text-slate-500">Name</span>
          <input
            name="name"
            required
            maxLength={200}
            placeholder="e.g. Spring onboarding"
            className="w-full rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-900 placeholder:text-slate-400"
          />
        </label>
        <label>
          <span className="mb-1 block text-xs font-medium text-slate-500">Start date</span>
          <input
            type="date"
            name="start_date"
            className="rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700"
          />
        </label>
        <label>
          <span className="mb-1 block text-xs font-medium text-slate-500">End date</span>
          <input
            type="date"
            name="end_date"
            className="rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700"
          />
        </label>
        <button
          type="submit"
          disabled={isPending}
          className="rounded-md bg-blue-700 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-blue-600 disabled:opacity-60"
        >
          {isPending ? "Creating…" : "Create cohort"}
        </button>
      </div>
      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
    </form>
  );
}
