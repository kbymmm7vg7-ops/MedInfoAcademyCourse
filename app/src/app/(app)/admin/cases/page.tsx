import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

// Case bank list + content-status board (spec §4.2). RLS-scoped read only —
// selects the surface columns plus the three status flags. Never selects a
// ground-truth/persona-brief column (SEC-9 firewall).
type CaseRow = {
  id: string;
  case_code: string | null;
  title: string;
  difficulty: number;
  therapeutic_area: string | null;
  product_ref: string | null;
  org_id: string | null;
  outline_status: "not_started" | "drafted" | "reviewed" | "approved";
  stt_tts_verified: boolean;
  rubric_approved: boolean;
};

const OUTLINE_LABELS: Record<CaseRow["outline_status"], { label: string; className: string }> = {
  not_started: { label: "Not started", className: "bg-slate-100 text-slate-600" },
  drafted: { label: "Drafted", className: "bg-amber-100 text-amber-800" },
  reviewed: { label: "Reviewed", className: "bg-blue-100 text-blue-800" },
  approved: { label: "Approved", className: "bg-emerald-100 text-emerald-800" },
};

function Badge({ ok, trueLabel, falseLabel }: { ok: boolean; trueLabel: string; falseLabel: string }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
        ok ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-600"
      }`}
    >
      {ok ? trueLabel : falseLabel}
    </span>
  );
}

export default async function AdminCasesPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("case_templates")
    .select(
      "id, case_code, title, difficulty, therapeutic_area, product_ref, org_id, outline_status, stt_tts_verified, rubric_approved"
    )
    .order("case_code", { ascending: true, nullsFirst: false })
    .returns<CaseRow[]>();

  const rows = data ?? [];

  return (
    <div className="px-6 py-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Case bank &amp; content status</h1>
          <p className="mt-1 text-sm text-slate-600">
            Every row shows the PRD §4 content-status board: outline progress, voice
            verification, and rubric sign-off. Click a case to edit surface fields or the
            gated ground-truth key.
          </p>
        </div>
        <Link
          href="/admin/cases/new"
          className="shrink-0 rounded-md bg-blue-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-600"
        >
          New custom scenario
        </Link>
      </div>

      {error && (
        <div className="mt-6 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          Could not load case bank: {error.message}
        </div>
      )}

      {!error && rows.length === 0 ? (
        <div className="mt-8 rounded-lg border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
          <p className="text-sm font-medium text-slate-700">No cases visible to this account</p>
          <p className="mt-1 text-sm text-slate-500">
            Platform admins see the shared bank; org admins see their org&apos;s cases.
          </p>
        </div>
      ) : (
        <div className="mt-8 overflow-hidden rounded-lg border border-slate-200">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-slate-500">Case</th>
                <th className="px-4 py-3 text-left font-medium text-slate-500">Title</th>
                <th className="px-4 py-3 text-left font-medium text-slate-500">Tier</th>
                <th className="px-4 py-3 text-left font-medium text-slate-500">Therapeutic area</th>
                <th className="px-4 py-3 text-left font-medium text-slate-500">Product</th>
                <th className="px-4 py-3 text-left font-medium text-slate-500">Scope</th>
                <th className="px-4 py-3 text-left font-medium text-slate-500">Outline</th>
                <th className="px-4 py-3 text-left font-medium text-slate-500">STT/TTS</th>
                <th className="px-4 py-3 text-left font-medium text-slate-500">Rubric</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {rows.map((row) => {
                const outline = OUTLINE_LABELS[row.outline_status] ?? OUTLINE_LABELS.not_started;
                return (
                  <tr key={row.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-mono text-xs text-slate-600">
                      <Link href={`/admin/cases/${row.id}`} className="hover:underline">
                        {row.case_code ?? row.id.slice(0, 8)}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <Link href={`/admin/cases/${row.id}`} className="text-slate-900 hover:underline">
                        {row.title}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-slate-600">Tier {row.difficulty}</td>
                    <td className="px-4 py-3 text-slate-600">{row.therapeutic_area ?? "—"}</td>
                    <td className="px-4 py-3 text-slate-600">{row.product_ref ?? "—"}</td>
                    <td className="px-4 py-3 text-slate-600">
                      {row.org_id ? (
                        <span className="inline-flex rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-800">
                          Org-scoped
                        </span>
                      ) : (
                        <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                          Shared
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${outline.className}`}>
                        {outline.label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Badge ok={row.stt_tts_verified} trueLabel="Verified" falseLabel="Unverified" />
                    </td>
                    <td className="px-4 py-3">
                      <Badge ok={row.rubric_approved} trueLabel="Approved" falseLabel="Unapproved" />
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
