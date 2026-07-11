"use client";

import { useRef, useState, useTransition } from "react";
import { uploadRoster, type RosterUploadResult } from "@/lib/manager/cohort-actions";

export function RosterUploadForm({ cohortId }: { cohortId: string }) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<RosterUploadResult | null>(null);

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5">
      <p className="text-sm font-medium text-slate-900">Upload roster</p>
      <p className="mt-1 text-xs text-slate-500">
        Paste one email per line, or choose a CSV file with an{" "}
        <span className="font-mono">email</span> column. Emails are matched against people
        who have already signed up in your organization — there is no invite system yet, so
        unmatched emails are reported back and no accounts are created.
      </p>

      <form
        className="mt-3"
        action={() => {
          setResult(null);
          startTransition(async () => {
            let text = textareaRef.current?.value ?? "";
            const file = fileRef.current?.files?.[0];
            if (file) {
              try {
                text = `${text}\n${await file.text()}`;
              } catch {
                setResult({ ok: false, error: "Could not read the selected file." });
                return;
              }
            }
            const res = await uploadRoster(cohortId, text);
            setResult(res);
            if (res.ok) {
              if (textareaRef.current) textareaRef.current.value = "";
              if (fileRef.current) fileRef.current.value = "";
            }
          });
        }}
      >
        <textarea
          ref={textareaRef}
          name="emails"
          rows={4}
          placeholder={"trainee.one@example.com\ntrainee.two@example.com"}
          className="w-full rounded-md border border-slate-300 px-3 py-2 font-mono text-xs text-slate-900 placeholder:text-slate-400"
        />
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <input
            ref={fileRef}
            type="file"
            name="csv"
            accept=".csv,text/csv,text/plain"
            className="text-xs text-slate-600 file:mr-3 file:rounded-md file:border file:border-slate-300 file:bg-white file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-slate-700 hover:file:bg-slate-50"
          />
          <button
            type="submit"
            disabled={isPending}
            className="ml-auto rounded-md bg-blue-700 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-blue-600 disabled:opacity-60"
          >
            {isPending ? "Uploading…" : "Add to cohort"}
          </button>
        </div>
      </form>

      {result && !result.ok && (
        <div className="mt-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
          {result.error}
        </div>
      )}
      {result && result.ok && (
        <div className="mt-3 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700">
          <p>
            <span className="font-medium text-slate-900">{result.added}</span> added
            {result.alreadyMembers > 0 && (
              <>
                {" · "}
                <span className="font-medium text-slate-900">{result.alreadyMembers}</span>{" "}
                already in this cohort
              </>
            )}
            {result.notRegistered.length > 0 && (
              <>
                {" · "}
                <span className="font-medium text-slate-900">
                  {result.notRegistered.length}
                </span>{" "}
                not registered yet
              </>
            )}
          </p>
          {result.notRegistered.length > 0 && (
            <div className="mt-2">
              <p className="font-medium text-amber-800">
                Not registered yet (ask them to sign up first — uploads never create
                accounts):
              </p>
              <ul className="mt-1 list-disc pl-4 font-mono">
                {result.notRegistered.map((email) => (
                  <li key={email}>{email}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
