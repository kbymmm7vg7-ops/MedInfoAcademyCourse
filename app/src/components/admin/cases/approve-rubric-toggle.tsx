"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { setRubricApproved } from "@/lib/admin/answer-keys";

export function ApproveRubricToggle({
  templateId,
  initialApproved,
  canApprove,
}: {
  templateId: string;
  initialApproved: boolean;
  canApprove: boolean;
}) {
  const [approved, setApproved] = useState(initialApproved);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  function handleApprove() {
    const confirmed = window.confirm(
      "Approving this rubric is Nathan's personal sign-off that this case's answer key is " +
        "correct and ready for trainees. Continue as Nathan's sign-off action?"
    );
    if (!confirmed) return;
    setError(null);
    startTransition(async () => {
      const result = await setRubricApproved(templateId, true);
      if (!result.ok) {
        setError(result.error ?? "Approval failed.");
        return;
      }
      setApproved(true);
      router.refresh();
    });
  }

  function handleRevoke() {
    setError(null);
    startTransition(async () => {
      const result = await setRubricApproved(templateId, false);
      if (!result.ok) {
        setError(result.error ?? "Failed to revoke approval.");
        return;
      }
      setApproved(false);
      router.refresh();
    });
  }

  return (
    <div className="rounded-lg border border-slate-200 p-5">
      <h2 className="text-sm font-semibold text-slate-900">Rubric approval</h2>
      <p className="mt-1 text-xs text-slate-500">
        {approved
          ? "This case is approved and visible in trainee queues and accreditation eligibility."
          : "This case is unapproved — excluded from trainee queues and accreditation eligibility until re-approved."}
      </p>
      {!canApprove && !approved && (
        <p className="mt-2 text-xs text-amber-700">
          Only platform_admin may approve a rubric (Nathan&apos;s sign-off gate). You may
          still edit surface fields and the ground-truth key above.
        </p>
      )}

      <div className="mt-4 flex gap-3">
        {!approved ? (
          <button
            type="button"
            disabled={isPending}
            onClick={handleApprove}
            className="rounded-md bg-emerald-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending ? "Approving…" : "Approve rubric (Nathan's sign-off)"}
          </button>
        ) : (
          <button
            type="button"
            disabled={isPending}
            onClick={handleRevoke}
            className="rounded-md border border-red-300 px-4 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending ? "Revoking…" : "Revoke approval"}
          </button>
        )}
      </div>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}
