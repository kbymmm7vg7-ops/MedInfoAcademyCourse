import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { loadQueueRows } from "@/lib/simulator/queue";
import { StartCaseButton } from "@/components/simulator/start-case-button";

const DIFFICULTY_LABELS: Record<number, string> = {
  1: "Tier 1 — Foundational",
  2: "Tier 2",
  3: "Tier 3",
  4: "Tier 4",
  5: "Tier 5",
  6: "Tier 6 — Advanced",
};

const STATUS_LABELS: Record<string, { label: string; className: string }> = {
  not_started: { label: "Not started", className: "bg-slate-100 text-slate-700" },
  in_progress: { label: "In progress", className: "bg-amber-100 text-amber-800" },
  submitted: { label: "Submitted", className: "bg-emerald-100 text-emerald-800" },
};

export default async function SimulatorQueuePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const rows = await loadQueueRows(supabase, user.id);

  return (
    <div className="px-8 py-10">
      <h1 className="text-2xl font-semibold text-slate-900">Case Simulator</h1>
      <p className="mt-2 text-sm text-slate-500">
        Practice documenting medical information inquiries end to end. Start a
        new case or resume one already in progress.
      </p>

      {rows.length === 0 ? (
        <div className="mt-8 rounded-lg border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
          <p className="text-sm font-medium text-slate-700">No cases available yet</p>
          <p className="mt-1 text-sm text-slate-500">
            The case bank hasn&apos;t been seeded for your account yet. Check back
            soon, or contact your administrator if this persists.
          </p>
        </div>
      ) : (
        <div className="mt-8 overflow-hidden rounded-lg border border-slate-200">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-slate-500">Case</th>
                <th className="px-4 py-3 text-left font-medium text-slate-500">Title</th>
                <th className="px-4 py-3 text-left font-medium text-slate-500">Difficulty</th>
                <th className="px-4 py-3 text-left font-medium text-slate-500">Product</th>
                <th className="px-4 py-3 text-left font-medium text-slate-500">Status</th>
                <th className="px-4 py-3 text-left font-medium text-slate-500">SLA</th>
                <th className="px-4 py-3 text-right font-medium text-slate-500">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {rows.map((row) => {
                const status = STATUS_LABELS[row.status];
                return (
                  <tr key={row.templateId}>
                    <td className="px-4 py-3 font-mono text-xs text-slate-600">
                      {row.caseCode ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-slate-900">{row.title}</td>
                    <td className="px-4 py-3 text-slate-600">
                      {DIFFICULTY_LABELS[row.difficulty] ?? `Tier ${row.difficulty}`}
                    </td>
                    <td className="px-4 py-3 text-slate-600">{row.productRef ?? "—"}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${status.className}`}
                      >
                        {status.label}
                      </span>
                      {!row.hasScriptedTranscript && (
                        <span className="ml-2 inline-flex rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-500">
                          Documentation only
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {row.sopTimeframeBusinessDays != null
                        ? `${row.sopTimeframeBusinessDays} business days`
                        : "—"}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <StartCaseButton
                        templateId={row.templateId}
                        instanceId={row.instanceId}
                        label={
                          row.instanceId
                            ? row.status === "submitted"
                              ? "View"
                              : "Resume"
                            : "Start case"
                        }
                      />
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
