"use client";

import { useState, useTransition } from "react";
import { updateUserRole, type RosterRole } from "@/lib/admin/user-actions";

const ROLE_OPTIONS: { value: RosterRole; label: string }[] = [
  { value: "trainee", label: "Trainee" },
  { value: "trainer", label: "Trainer" },
  { value: "qa", label: "QA" },
];

export function RoleSelect({
  userId,
  currentRole,
}: {
  userId: string;
  currentRole: RosterRole;
}) {
  const [role, setRole] = useState<RosterRole>(currentRole);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <div>
      <select
        value={role}
        disabled={isPending}
        onChange={(e) => {
          const next = e.target.value as RosterRole;
          const previous = role;
          setRole(next);
          setError(null);
          startTransition(async () => {
            const result = await updateUserRole(userId, next);
            if (!result.ok) {
              setRole(previous);
              setError(result.error);
            }
          });
        }}
        className="rounded-md border border-slate-300 bg-white px-2 py-1.5 text-sm text-slate-700 disabled:opacity-60"
      >
        {ROLE_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
