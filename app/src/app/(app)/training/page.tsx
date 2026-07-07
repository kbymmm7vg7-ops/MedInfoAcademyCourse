import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { loadTrainingModules } from "@/lib/training/modules";

export default async function TrainingPage({
  searchParams,
}: {
  searchParams: Promise<{ locked?: string }>;
}) {
  const { locked } = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const modules = await loadTrainingModules(supabase, user.id);
  const requiredModules = modules.filter((m) => m.required);
  const completedRequired = requiredModules.filter((m) => m.completedAt != null);
  const requiredCount = requiredModules.length;
  const completedCount = completedRequired.length;
  const progressPct = requiredCount > 0 ? Math.round((completedCount / requiredCount) * 100) : 0;

  return (
    <div className="px-8 py-10">
      <h1 className="text-2xl font-semibold text-slate-900">Training &amp; Orientation</h1>
      <p className="mt-2 text-sm text-slate-500">
        Complete every required module to unlock the Case Simulator and the
        Accreditation Center.
      </p>

      {locked === "1" && (
        <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Complete Training &amp; Orientation to unlock the Case Simulator.
        </div>
      )}

      {requiredCount > 0 && (
        <div className="mt-8">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-slate-700">
              {completedCount} of {requiredCount} complete
            </span>
            <span className="text-slate-500">{progressPct}%</span>
          </div>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-blue-600 transition-all"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      )}

      {modules.length === 0 ? (
        <div className="mt-8 rounded-lg border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
          <p className="text-sm font-medium text-slate-700">No training modules available yet</p>
          <p className="mt-1 text-sm text-slate-500">
            Training content hasn&apos;t been seeded for your account yet. Check
            back soon, or contact your administrator if this persists.
          </p>
        </div>
      ) : (
        <div className="mt-8 overflow-hidden rounded-lg border border-slate-200">
          <ul className="divide-y divide-slate-100 bg-white">
            {modules.map((mod) => {
              const isComplete = mod.completedAt != null;
              return (
                <li key={mod.id}>
                  <Link
                    href={`/training/${mod.slug}`}
                    className="flex items-center justify-between gap-4 px-4 py-4 transition-colors hover:bg-slate-50"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="truncate text-sm font-medium text-slate-900">{mod.title}</p>
                        {mod.required && (
                          <span className="inline-flex flex-shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                            Required
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-xs text-slate-500">
                        {mod.estMinutes != null ? `${mod.estMinutes} min read` : "Self-paced"}
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      {isComplete ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-800">
                          <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
                            <path
                              fillRule="evenodd"
                              d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Complete
                        </span>
                      ) : (
                        <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                          Not started
                        </span>
                      )}
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
