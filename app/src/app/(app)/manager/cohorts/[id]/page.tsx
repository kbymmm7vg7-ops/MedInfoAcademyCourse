import Link from "next/link";
import { notFound } from "next/navigation";
import { getManagerContext, loadCohortLite } from "@/lib/manager/cohort-data";
import { RosterUploadForm } from "@/components/manager/roster-upload-form";

function formatDate(d: string | null): string {
  return d ? new Date(`${d}T00:00:00`).toLocaleDateString() : "—";
}

export default async function CohortDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Server-side gate — nav hiding is cosmetic. Managers without an org, and
  // cohorts outside the manager's org, both resolve to 404.
  const ctx = await getManagerContext();
  if (!ctx || !ctx.orgId) {
    notFound();
  }

  const cohort = await loadCohortLite(id, ctx.orgId);
  if (!cohort) {
    notFound();
  }

  const dateRange =
    cohort.start_date || cohort.end_date
      ? `${formatDate(cohort.start_date)} – ${formatDate(cohort.end_date)}`
      : null;

  return (
    <div className="px-6 py-8">
      <Link href="/manager" className="text-sm text-slate-500 hover:text-slate-700">
        &larr; Manager Dashboard
      </Link>
      <h1 className="mt-2 mb-1 text-2xl font-semibold text-slate-900">{cohort.name}</h1>
      <p className="mb-6 text-sm text-slate-600">
        {dateRange ? `${dateRange} · ` : ""}
        {cohort.rows.length} member{cohort.rows.length === 1 ? "" : "s"}
      </p>

      <div className="mb-6">
        <RosterUploadForm cohortId={cohort.id} />
      </div>

      {cohort.rows.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
          <p className="text-sm font-medium text-slate-700">No members yet</p>
          <p className="mt-1 text-sm text-slate-500">
            Upload a roster above to start tracking this cohort.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-slate-200">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-slate-500">Trainee</th>
                <th className="px-4 py-3 text-left font-medium text-slate-500">Email</th>
                <th className="px-4 py-3 text-right font-medium text-slate-500">
                  Cases completed
                </th>
                <th className="px-4 py-3 text-right font-medium text-slate-500">
                  Average score
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {cohort.rows.map((row) => (
                <tr key={row.userId} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-900">
                    {row.fullName ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-slate-600">{row.email ?? "—"}</td>
                  <td className="px-4 py-3 text-right text-slate-600">
                    {row.casesCompleted}
                  </td>
                  <td className="px-4 py-3 text-right text-slate-600">
                    {row.averageScore == null ? (
                      <span className="text-slate-400" title="No evaluated cases yet">
                        —
                      </span>
                    ) : (
                      row.averageScore.toFixed(1)
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="mt-3 text-xs text-slate-500">
        Cases completed counts submitted, evaluated, and closed case instances. Average
        score is the mean overall evaluation score across those cases; a dash means nothing
        has been evaluated yet.
      </p>
    </div>
  );
}
