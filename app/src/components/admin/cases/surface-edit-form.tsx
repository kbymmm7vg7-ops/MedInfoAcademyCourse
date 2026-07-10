"use client";

import { useState, useTransition } from "react";
import { updateSurfaceFields } from "@/lib/admin/case-actions";

export function SurfaceEditForm({
  templateId,
  initialTitle,
  initialDifficulty,
  initialTherapeuticArea,
  initialProductRef,
}: {
  templateId: string;
  initialTitle: string;
  initialDifficulty: number;
  initialTherapeuticArea: string | null;
  initialProductRef: string | null;
}) {
  const [title, setTitle] = useState(initialTitle);
  const [difficulty, setDifficulty] = useState(String(initialDifficulty));
  const [therapeuticArea, setTherapeuticArea] = useState(initialTherapeuticArea ?? "");
  const [productRef, setProductRef] = useState(initialProductRef ?? "");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  return (
    <div className="rounded-lg border border-slate-200 p-5">
      <h2 className="text-sm font-semibold text-slate-900">Surface fields</h2>
      <p className="mt-1 text-xs text-slate-500">
        Title, difficulty, therapeutic area, and product reference edit freely — these
        changes are audited but do not touch the ground-truth key or rubric approval.
      </p>

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
          <span className="text-xs font-medium text-slate-700">Difficulty tier (1–6)</span>
          <input
            type="number"
            min={1}
            max={6}
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
      </div>

      <div className="mt-4 flex items-center gap-3">
        <button
          type="button"
          disabled={isPending}
          onClick={() => {
            setError(null);
            setSaved(false);
            startTransition(async () => {
              const result = await updateSurfaceFields(templateId, {
                title,
                difficulty: Number(difficulty),
                therapeuticArea: therapeuticArea || null,
                productRef: productRef || null,
              });
              if (!result.ok) {
                setError(result.error);
                return;
              }
              setSaved(true);
            });
          }}
          className="rounded-md bg-blue-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? "Saving…" : "Save surface fields"}
        </button>
        {saved && !isPending && <span className="text-sm text-emerald-700">Saved.</span>}
      </div>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}
