"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { markModuleComplete } from "@/lib/training/actions";

export function MarkCompleteButton({
  moduleId,
  slug,
}: {
  moduleId: string;
  slug: string;
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  return (
    <div>
      <button
        type="button"
        disabled={isPending}
        onClick={() => {
          setError(null);
          startTransition(async () => {
            const result = await markModuleComplete(moduleId, slug);
            if (!result.ok) {
              setError(result.error);
              return;
            }
            router.push("/training");
          });
        }}
        className="rounded-md bg-blue-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Saving…" : "Mark as complete"}
      </button>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}
