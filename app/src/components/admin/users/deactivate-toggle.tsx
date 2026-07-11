"use client";

import { useState, useTransition } from "react";
import { deactivateUser, reactivateUser } from "@/lib/admin/user-actions";

export function DeactivateToggle({
  userId,
  deactivated: initialDeactivated,
}: {
  userId: string;
  deactivated: boolean;
}) {
  const [deactivated, setDeactivated] = useState(initialDeactivated);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const onClick = () => {
    setError(null);
    startTransition(async () => {
      const result = deactivated ? await reactivateUser(userId) : await deactivateUser(userId);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setDeactivated(!deactivated);
    });
  };

  return (
    <div>
      <button
        type="button"
        onClick={onClick}
        disabled={isPending}
        className={
          deactivated
            ? "rounded-md border border-emerald-300 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 hover:bg-emerald-100 disabled:opacity-60"
            : "rounded-md border border-red-300 bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700 hover:bg-red-100 disabled:opacity-60"
        }
      >
        {isPending ? "Saving…" : deactivated ? "Reactivate" : "Deactivate"}
      </button>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
