"use client";

import { useState, useTransition } from "react";
import { setSttTtsVerified } from "@/lib/admin/case-actions";

export function SttTtsToggle({
  templateId,
  initialVerified,
}: {
  templateId: string;
  initialVerified: boolean;
}) {
  const [verified, setVerified] = useState(initialVerified);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="rounded-lg border border-slate-200 p-5">
      <h2 className="text-sm font-semibold text-slate-900">Voice verification</h2>
      <p className="mt-1 text-xs text-slate-500">
        Marks whether this case&apos;s STT/TTS behavior has been manually checked for the
        voice channel.
      </p>
      <label className="mt-4 flex items-center gap-2">
        <input
          type="checkbox"
          checked={verified}
          disabled={isPending}
          onChange={(e) => {
            const next = e.target.checked;
            setError(null);
            startTransition(async () => {
              const result = await setSttTtsVerified(templateId, next);
              if (!result.ok) {
                setError(result.error);
                return;
              }
              setVerified(next);
            });
          }}
          className="h-4 w-4 rounded border-slate-300"
        />
        <span className="text-sm text-slate-700">STT/TTS verified</span>
      </label>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}
