"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { saveGroundTruth } from "@/lib/admin/answer-keys";

export function GroundTruthEditor({
  templateId,
  initialJson,
}: {
  templateId: string;
  initialJson: string;
}) {
  const [json, setJson] = useState(initialJson);
  const [isPending, startTransition] = useTransition();
  const [errors, setErrors] = useState<string[] | null>(null);
  const [saved, setSaved] = useState(false);
  const router = useRouter();

  return (
    <div className="rounded-lg border border-slate-200 p-5">
      <h2 className="text-sm font-semibold text-slate-900">Ground-truth answer key</h2>

      <div className="mt-3 rounded-md border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
        <p className="font-medium">This is Nathan&apos;s personal sign-off artifact.</p>
        <p className="mt-1">
          Answer keys are validated against the seed-case schema. Saving an edit here
          automatically <strong>de-approves this case</strong> (rubric approval flips to
          false), which removes it from trainee queues and accreditation eligibility until
          Nathan explicitly re-approves it below.
        </p>
      </div>

      <label className="mt-4 block">
        <span className="text-xs font-medium text-slate-700">Ground-truth JSON</span>
        <textarea
          value={json}
          onChange={(e) => setJson(e.target.value)}
          rows={20}
          spellCheck={false}
          className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 font-mono text-xs leading-relaxed focus:border-blue-500 focus:outline-none"
        />
      </label>

      <div className="mt-4 flex items-center gap-3">
        <button
          type="button"
          disabled={isPending}
          onClick={() => {
            setErrors(null);
            setSaved(false);
            startTransition(async () => {
              const result = await saveGroundTruth(templateId, json);
              if (!result.ok) {
                setErrors(result.errors);
                return;
              }
              setSaved(true);
              router.refresh();
            });
          }}
          className="rounded-md bg-amber-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? "Validating & saving…" : "Save ground-truth key (de-approves case)"}
        </button>
        {saved && !isPending && (
          <span className="text-sm text-emerald-700">Saved — case is now unapproved.</span>
        )}
      </div>

      {errors && errors.length > 0 && (
        <div className="mt-3 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <p className="font-medium">Save failed — fix these and try again:</p>
          <ul className="mt-1 list-disc pl-5">
            {errors.map((err, i) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
