"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createModule } from "@/lib/admin/training-actions";

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * "New module" button that expands into a small title+slug form; on create it
 * navigates straight to the editor. Platform admins create shared modules,
 * org admins create modules for their own org (decided server-side).
 */
export function NewModuleForm({ scopeLabel }: { scopeLabel: string }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="shrink-0 rounded-md bg-blue-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-600"
      >
        New module
      </button>
    );
  }

  return (
    <div className="w-full rounded-lg border border-slate-200 bg-white p-4 sm:max-w-md">
      <h2 className="text-sm font-semibold text-slate-900">New training module</h2>
      <p className="mt-1 text-xs text-slate-500">Creates {scopeLabel}. Content is written in the editor.</p>

      <label className="mt-3 block">
        <span className="text-xs font-medium text-slate-700">Title</span>
        <input
          type="text"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (!slugTouched) setSlug(slugify(e.target.value));
          }}
          className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
        />
      </label>

      <label className="mt-3 block">
        <span className="text-xs font-medium text-slate-700">Slug</span>
        <input
          type="text"
          value={slug}
          onChange={(e) => {
            setSlugTouched(true);
            setSlug(e.target.value);
          }}
          className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 font-mono text-sm focus:border-blue-500 focus:outline-none"
        />
      </label>

      <div className="mt-4 flex items-center gap-3">
        <button
          type="button"
          disabled={isPending}
          onClick={() => {
            setError(null);
            startTransition(async () => {
              const result = await createModule({ title, slug });
              if (!result.ok) {
                setError(result.error);
                return;
              }
              router.push(`/admin/training/${result.id}`);
            });
          }}
          className="rounded-md bg-blue-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? "Creating…" : "Create"}
        </button>
        <button
          type="button"
          disabled={isPending}
          onClick={() => {
            setOpen(false);
            setError(null);
          }}
          className="text-sm text-slate-500 hover:text-slate-700"
        >
          Cancel
        </button>
      </div>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}
