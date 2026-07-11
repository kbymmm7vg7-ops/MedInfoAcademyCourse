"use client";

import { useMemo, useState, useTransition } from "react";
import { renderMarkdown } from "@/lib/training/markdown";
import { updateModule } from "@/lib/admin/training-actions";

/**
 * Training module editor: metadata fields plus a content_md textarea with a
 * live preview. The preview goes through the SAME escaping renderer trainees
 * see (lib/training/markdown.ts — all input HTML-escaped before formatting),
 * so what the admin previews is exactly what ships, and no raw HTML can pass
 * through in either place.
 */
export function ModuleEditor({
  moduleId,
  initialTitle,
  initialSlug,
  initialEstMinutes,
  initialRequired,
  initialContentMd,
  readOnly,
}: {
  moduleId: string;
  initialTitle: string;
  initialSlug: string;
  initialEstMinutes: number | null;
  initialRequired: boolean;
  initialContentMd: string;
  readOnly: boolean;
}) {
  const [title, setTitle] = useState(initialTitle);
  const [slug, setSlug] = useState(initialSlug);
  const [estMinutes, setEstMinutes] = useState(
    initialEstMinutes === null ? "" : String(initialEstMinutes)
  );
  const [required, setRequired] = useState(initialRequired);
  const [contentMd, setContentMd] = useState(initialContentMd);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  // renderMarkdown escapes all input before applying formatting; this is the
  // one sanctioned way to turn content_md into HTML (same as /training/[slug]).
  const previewHtml = useMemo(() => renderMarkdown(contentMd), [contentMd]);

  const inputClass =
    "mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none disabled:bg-slate-50 disabled:text-slate-500";

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-slate-200 p-5">
        <h2 className="text-sm font-semibold text-slate-900">Module details</h2>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-xs font-medium text-slate-700">Title</span>
            <input
              type="text"
              value={title}
              disabled={readOnly}
              onChange={(e) => setTitle(e.target.value)}
              className={inputClass}
            />
          </label>

          <label className="block">
            <span className="text-xs font-medium text-slate-700">Slug</span>
            <input
              type="text"
              value={slug}
              disabled={readOnly}
              onChange={(e) => setSlug(e.target.value)}
              className={`${inputClass} font-mono`}
            />
          </label>

          <label className="block">
            <span className="text-xs font-medium text-slate-700">Estimated minutes</span>
            <input
              type="number"
              min={0}
              value={estMinutes}
              disabled={readOnly}
              onChange={(e) => setEstMinutes(e.target.value)}
              placeholder="Self-paced"
              className={inputClass}
            />
          </label>

          <label className="flex items-end gap-2 pb-2">
            <input
              type="checkbox"
              checked={required}
              disabled={readOnly}
              onChange={(e) => setRequired(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300"
            />
            <span className="text-sm text-slate-700">
              Required (gates the Case Simulator until complete)
            </span>
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-slate-200 p-5">
          <h2 className="text-sm font-semibold text-slate-900">Content (markdown)</h2>
          <p className="mt-1 text-xs text-slate-500">
            Headings (#, ##, ###), bold, italics, lists, and horizontal rules. Raw HTML is
            never rendered — everything is escaped by the renderer.
          </p>
          <textarea
            value={contentMd}
            disabled={readOnly}
            onChange={(e) => setContentMd(e.target.value)}
            rows={24}
            spellCheck={false}
            className="mt-3 block w-full rounded-md border border-slate-300 px-3 py-2 font-mono text-sm leading-relaxed focus:border-blue-500 focus:outline-none disabled:bg-slate-50 disabled:text-slate-500"
          />
        </div>

        <div className="rounded-lg border border-slate-200 p-5">
          <h2 className="text-sm font-semibold text-slate-900">Live preview</h2>
          <p className="mt-1 text-xs text-slate-500">
            Rendered exactly as trainees will see it.
          </p>
          <div
            className="prose-training mt-3 min-h-[24rem] rounded-md border border-slate-100 bg-white p-6"
            dangerouslySetInnerHTML={{ __html: previewHtml }}
          />
        </div>
      </div>

      {!readOnly && (
        <div className="flex items-center gap-3">
          <button
            type="button"
            disabled={isPending}
            onClick={() => {
              setError(null);
              setSaved(false);
              startTransition(async () => {
                const trimmedMinutes = estMinutes.trim();
                const result = await updateModule(moduleId, {
                  title,
                  slug,
                  estMinutes: trimmedMinutes === "" ? null : Number(trimmedMinutes),
                  required,
                  contentMd,
                });
                if (!result.ok) {
                  setError(result.error);
                  return;
                }
                setSaved(true);
              });
            }}
            className="rounded-md bg-blue-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending ? "Saving…" : "Save module"}
          </button>
          {saved && !isPending && <span className="text-sm text-emerald-700">Saved.</span>}
          {error && <span className="text-sm text-red-600">{error}</span>}
        </div>
      )}
    </div>
  );
}
