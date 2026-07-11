import Link from "next/link";
import { listPendingEvaluations } from "@/lib/admin/evaluation-actions";
import { RetryButton } from "@/components/admin/evaluations/retry-button";

// Pending evaluations (spec §4.6 — SEC-4): submitted case_instances that
// never received evaluation_scores rows (inline evaluation failed or keys
// were missing at submit time). The /admin layout gates admin+; the data
// layer re-checks the role and org-scopes org admins before its
// service-role read.

export default async function AdminEvaluationsPage() {
  const result = await listPendingEvaluations();

  return (
    <div className="px-6 py-8">
      <Link href="/admin" className="text-sm text-slate-500 hover:text-slate-700">
        &larr; Admin
      </Link>
      <h1 className="mt-2 mb-1 text-2xl font-semibold text-slate-900">Pending evaluations</h1>
      <p className="mb-6 text-sm text-slate-600">
        Submitted cases with no evaluation on record — usually an evaluator outage at submit
        time. Retry re-runs the full evaluation pipeline (one model call per retry) and is
        written to the audit log.
      </p>

      {!result.ok ? (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {result.error}
        </div>
      ) : result.pending.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
          <p className="text-sm font-medium text-slate-700">No pending evaluations</p>
          <p className="mt-1 text-sm text-slate-500">
            Every submitted case{" "}
            {result.viewerRole === "platform_admin" ? "across all orgs" : "in your org"} has
            been evaluated.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-slate-200">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-slate-500">Instance</th>
                <th className="px-4 py-3 text-left font-medium text-slate-500">Case</th>
                <th className="px-4 py-3 text-left font-medium text-slate-500">Trainee</th>
                <th className="px-4 py-3 text-left font-medium text-slate-500">Submitted</th>
                <th className="px-4 py-3 text-right font-medium text-slate-500">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {result.pending.map((row) => {
                const when = row.submittedAt ?? row.closedAt;
                return (
                  <tr key={row.instanceId} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-mono text-xs text-slate-500" title={row.instanceId}>
                      {row.instanceId.slice(0, 8)}
                    </td>
                    <td className="px-4 py-3 text-slate-900">
                      {row.caseCode ? `${row.caseCode} — ` : ""}
                      {row.caseTitle}
                    </td>
                    <td className="px-4 py-3 text-slate-600">{row.userEmail ?? "—"}</td>
                    <td className="px-4 py-3 text-slate-600">
                      {when ? new Date(when).toLocaleString() : "—"}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end">
                        <RetryButton instanceId={row.instanceId} />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
