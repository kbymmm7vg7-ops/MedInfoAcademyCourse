"use client";

import { useState, useTransition } from "react";
import { updateConfidentialityTier, type ConfidentialityTier } from "@/lib/admin/org-actions";

const TIER_OPTIONS: { value: ConfidentialityTier; label: string }[] = [
  { value: "standard", label: "Standard" },
  { value: "firewall", label: "Firewall" },
];

export function ConfidentialityTierSelect({
  orgId,
  currentTier,
}: {
  orgId: string;
  currentTier: ConfidentialityTier;
}) {
  const [tier, setTier] = useState<ConfidentialityTier>(currentTier);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <div>
      <select
        value={tier}
        disabled={isPending}
        onChange={(e) => {
          const next = e.target.value as ConfidentialityTier;
          const previous = tier;
          setTier(next);
          setError(null);
          startTransition(async () => {
            const result = await updateConfidentialityTier(orgId, next);
            if (!result.ok) {
              setTier(previous);
              setError(result.error);
            }
          });
        }}
        className="rounded-md border border-slate-300 bg-white px-2 py-1.5 text-sm text-slate-700 disabled:opacity-60"
      >
        {TIER_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
