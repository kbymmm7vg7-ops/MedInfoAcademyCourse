"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { startOrResumeCase } from "@/lib/simulator/actions";

export function StartCaseButton({
  templateId,
  instanceId,
  label,
}: {
  templateId: string;
  instanceId?: string | null;
  label: string;
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          if (instanceId) {
            router.push(`/simulator/case/${instanceId}`);
            return;
          }
          await startOrResumeCase(templateId);
        });
      }}
      className="rounded-md bg-blue-700 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {isPending ? "Loading…" : label}
    </button>
  );
}
