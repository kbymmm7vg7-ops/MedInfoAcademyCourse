import Link from "next/link";
import { notFound } from "next/navigation";
import { getManagerContext, listCohortsWithCounts } from "@/lib/manager/cohort-data";
import { CreateCohortForm } from "@/components/manager/create-cohort-form";

function formatDate(d: string | null): string {
  return d ? new Date(`${d}T00:00:00`).toLocaleDateString() : "—";
}

export default async function ManagerPage() {
  // The sidebar already hides this link for non-manager roles, but hiding is
  // cosmetic — the server-side check is the gate (404 for a direct visit).
  const ctx = await getManagerContext();
  if (!ctx) {
    notFound();
  }

  if (!ctx.orgId) {
    return (
      <div className="px-6 py-8">
        <h1 className="mb-1 text-2xl font-semibold text-slate-900">Manager Dashboard</h1>
        <p className="mb-6 text-sm text-slate-600">Cohorts and trainee progress.</p>
        <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
          <p className="text-sm font-medium text-slate-700">No organization assigned</p>
          <p className="mx-auto mt-1 max-w-md text-sm text-slate-500">
            Cohorts are scoped to an organization, and your account isn&apos;t part of one
            yet. Ask a platform admin to assign you to your organization, then reload this
            page.
          </p>
        </div>
      </div>
    );
  }

  const cohorts = await listCohortsWithCounts(ctx.orgId);

  return (
    <div className="px-6 py-8">
      <h1 className="mb-1 text-2xl font-semibold text-slate-900">Manager Dashboard</h1>
      <p className="mb-6 text-sm text-slate-600">
        Create cohorts, upload rosters, and check each trainee&apos;s cases completed and
        average score.
      </p>

      <div className="mb-6">
        <CreateCohortForm />
      </div>

      {cohorts.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
          <p className="text-sm font-medium text-slate-700">No cohorts yet</p>
          <p className="mt-1 text-sm text-slate-500">
            Create your first cohort above, then upload its roster.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-slate-200">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-slate-500">Cohort</th>
                <th className="px-4 py-3 text-left font-medium text-slate-500">Start</th>
                <th className="px-4 py-3 text-left font-medium text-slate-500">End</th>
                <th className="px-4 py-3 text-left font-medium text-slate-500">Members</th>
                <th className="px-4 py-3 text-right font-medium text-slate-500">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {cohorts.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-900">{c.name}</td>
                  <td className="px-4 py-3 text-slate-600">{formatDate(c.start_date)}</td>
                  <td className="px-4 py-3 text-slate-600">{formatDate(c.end_date)}</td>
                  <td className="px-4 py-3 text-slate-600">{c.memberCount}</td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/manager/cohorts/${c.id}`}
                      className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
