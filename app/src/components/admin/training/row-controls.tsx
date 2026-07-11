"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  createOrgCopy,
  reorderModule,
  setModuleRequired,
} from "@/lib/admin/training-actions";

/** Up/down arrows persisting order_index within the row's scope. */
export function ReorderButtons({
  moduleId,
  isFirst,
  isLast,
}: {
  moduleId: string;
  isFirst: boolean;
  isLast: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const move = (direction: "up" | "down") => {
    setError(null);
    startTransition(async () => {
      const result = await reorderModule(moduleId, direction);
      if (!result.ok) setError(result.error);
    });
  };

  const buttonClass =
    "rounded border border-slate-300 px-1.5 py-0.5 text-xs text-slate-600 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40";

  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        aria-label="Move up"
        disabled={isPending || isFirst}
        onClick={() => move("up")}
        className={buttonClass}
      >
        ↑
      </button>
      <button
        type="button"
        aria-label="Move down"
        disabled={isPending || isLast}
        onClick={() => move("down")}
        className={buttonClass}
      >
        ↓
      </button>
      {error && <span className="ml-1 text-xs text-red-600">{error}</span>}
    </div>
  );
}

/** Required on/off toggle, persisted immediately. */
export function RequiredToggle({
  moduleId,
  initialRequired,
}: {
  moduleId: string;
  initialRequired: boolean;
}) {
  const [required, setRequired] = useState(initialRequired);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <div>
      <button
        type="button"
        role="switch"
        aria-checked={required}
        disabled={isPending}
        onClick={() => {
          const next = !required;
          setError(null);
          startTransition(async () => {
            const result = await setModuleRequired(moduleId, next);
            if (!result.ok) {
              setError(result.error);
              return;
            }
            setRequired(next);
          });
        }}
        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors disabled:opacity-60 ${
          required
            ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
        }`}
      >
        {required ? "Required" : "Optional"}
      </button>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}

/**
 * Org admin only: duplicates a shared module for their org (same slug) so it
 * shadows the shared original for their trainees, then opens the copy.
 */
export function OrgCopyButton({
  moduleId,
  alreadyCopied,
}: {
  moduleId: string;
  alreadyCopied: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  if (alreadyCopied) {
    return <span className="text-xs text-slate-400">Org copy exists</span>;
  }

  return (
    <div>
      <button
        type="button"
        disabled={isPending}
        onClick={() => {
          setError(null);
          startTransition(async () => {
            const result = await createOrgCopy(moduleId);
            if (!result.ok) {
              setError(result.error);
              return;
            }
            router.push(`/admin/training/${result.id}`);
          });
        }}
        className="rounded-md border border-slate-300 px-2.5 py-1 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Copying…" : "Create org copy"}
      </button>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
