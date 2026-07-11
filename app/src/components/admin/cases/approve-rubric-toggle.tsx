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
  // Inline two-step confirm instead of window.confirm: a native modal blocks
  // the whole renderer (breaks automated E2E) and can't carry styled context.
  const [confirmingApprove, setConfirmingApprove] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  function handleApprove() {
    setError(null);
    setConfirmingApprove(false);
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
          !confirmingApprove ? (
            <button
              type="button"
              disabled={isPending}
              onClick={() => setConfirmingApprove(true)}
              className="rounded-md bg-emerald-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Approve rubric (Nathan&apos;s sign-off)
            </button>
          ) : (
            <div className="rounded-md border border-emerald-300 bg-emerald-50 p-3">
              <p className="text-xs text-emerald-900">
                Approving this rubric is <strong>Nathan&apos;s personal sign-off</strong> that
                this case&apos;s answer key is correct and ready for trainees.
              </p>
              <div className="mt-2 flex gap-2">
                <button
                  type="button"
                  disabled={isPending}
                  onClick={handleApprove}
                  className="rounded-md bg-emerald-700 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isPending ? "Approving…" : "Confirm approval as Nathan's sign-off"}
                </button>
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => setConfirmingApprove(false)}
                  className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          )
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
