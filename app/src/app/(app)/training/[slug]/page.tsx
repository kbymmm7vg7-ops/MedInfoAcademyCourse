import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { loadTrainingModules } from "@/lib/training/modules";
import { renderMarkdown } from "@/lib/training/markdown";
import { MarkCompleteButton } from "@/components/training/mark-complete-button";

export default async function TrainingModulePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const modules = await loadTrainingModules(supabase, user.id);
  const index = modules.findIndex((m) => m.slug === slug);
  if (index < 0) notFound();
  const mod = modules[index];
  const prev = index > 0 ? modules[index - 1] : null;
  const next = index < modules.length - 1 ? modules[index + 1] : null;

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 flex items-center justify-between">
        <Link href="/training" className="text-sm text-blue-700 hover:underline">
          ← All modules
        </Link>
        <span className="text-sm text-slate-500">
          Module {index + 1} of {modules.length}
          {mod.estMinutes ? ` · ~${mod.estMinutes} min` : ""}
        </span>
      </div>

      <h1 className="mb-2 text-2xl font-semibold text-slate-900">{mod.title}</h1>
      {mod.completedAt && (
        <p className="mb-4 inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
          Completed {new Date(mod.completedAt).toLocaleDateString()}
        </p>
      )}

      <article
        className="prose-training mb-8 rounded-lg border border-slate-200 bg-white p-8"
        dangerouslySetInnerHTML={{ __html: renderMarkdown(mod.contentMd) }}
      />

      <div className="mb-10 flex items-center justify-between gap-4">
        {prev ? (
          <Link href={`/training/${prev.slug}`} className="text-sm text-blue-700 hover:underline">
            ← {prev.title}
          </Link>
        ) : (
          <span />
        )}
        {!mod.completedAt && <MarkCompleteButton moduleId={mod.id} slug={mod.slug} />}
        {next ? (
          <Link href={`/training/${next.slug}`} className="text-sm text-blue-700 hover:underline">
            {next.title} →
          </Link>
        ) : (
          <span />
        )}
      </div>
    </div>
  );
}
