"use client";

import { useTransition } from "react";
import { startSitting } from "@/lib/cert/actions";

export function SittingButtons({
  templateId,
  certAvailable,
}: {
  templateId: string;
  certAvailable: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        disabled={isPending}
        onClick={() => startTransition(() => startSitting(templateId, "practice"))}
        className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-60"
      >
        Practice sitting
      </button>
      {certAvailable && (
        <button
          type="button"
          disabled={isPending}
          onClick={() => {
            const confirmed = window.confirm(
              "This is a first-attempt certification sitting on a fresh variant, played closed-book. A fail burns this case for certification permanently (practice on it stays unlimited). Continue?"
            );
            if (confirmed) startTransition(() => startSitting(templateId, "certification"));
          }}
          className="rounded-md bg-blue-700 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-blue-600 disabled:opacity-60"
        >
          Certification sitting
        </button>
      )}
    </div>
  );
}
