import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

type HistoryInstanceRow = {
  id: string;
  status: string;
  closed_at: string | null;
  case_templates: { title: string; case_code: string | null } | null;
};

export default async function HistoryPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data } = await supabase
    .from("case_instances")
    .select("id, status, closed_at, case_templates(title, case_code)")
    .eq("user_id", user.id)
    .in("status", ["submitted", "evaluated", "closed"])
    .order("closed_at", { ascending: false });

  const rows = (data ?? []) as unknown as HistoryInstanceRow[];

  return (
    <div className="px-8 py-10">
      <h1 className="text-2xl font-semibold text-slate-900">Case History</h1>
      <p className="mt-2 text-sm text-slate-500">
        Cases you&apos;ve submitted for review, with their current status.
      </p>

      {rows.length === 0 ? (
        <div className="mt-8 rounded-lg border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
          <p className="text-sm font-medium text-slate-700">No submitted cases yet</p>
          <p className="mt-1 text-sm text-slate-500">
            Submit a case from the Simulator to see it appear here.
          </p>
        </div>
      ) : (
        <div className="mt-8 overflow-hidden rounded-lg border border-slate-200">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-slate-500">Case</th>
                <th className="px-4 py-3 text-left font-medium text-slate-500">Submitted</th>
                <th className="px-4 py-3 text-left font-medium text-slate-500">Status</th>
                <th className="px-4 py-3 text-right font-medium text-slate-500">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {rows.map((row) => (
                <tr key={row.id}>
                  <td className="px-4 py-3 text-slate-900">
                    {row.case_templates?.case_code ? `${row.case_templates.case_code} — ` : ""}
                    {row.case_templates?.title ?? "Untitled case"}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {row.closed_at ? new Date(row.closed_at).toLocaleDateString() : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800">
                      Awaiting evaluation
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/history/${row.id}`}
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
