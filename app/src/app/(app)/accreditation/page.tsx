import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { loadAccreditationOverview } from "@/lib/cert/actions";
import { templateCertState } from "@/lib/cert/logic";
import { SittingButtons } from "@/components/cert/sitting-buttons";

type TemplateRow = {
  id: string;
  case_code: string | null;
  title: string;
  difficulty: number;
};

const STATE_CHIP: Record<string, { label: string; className: string; title?: string }> = {
  available: { label: "Available", className: "bg-blue-100 text-blue-800" },
  pending: { label: "Awaiting evaluation", className: "bg-amber-100 text-amber-800" },
  passed_first_try: { label: "Passed (first try)", className: "bg-green-100 text-green-800" },
  burned: {
    label: "Burned",
    className: "bg-red-100 text-red-800",
    title:
      "Failed on its first certification attempt — permanently unavailable for certification. Practice remains unlimited.",
  },
};

export default async function AccreditationPage({
  searchParams,
}: {
  searchParams: Promise<{ blocked?: string }>;
}) {
  const { blocked } = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const overview = await loadAccreditationOverview();
  if (!overview) redirect("/login");

  if (!overview.trainingComplete) {
    return (
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-4 text-2xl font-semibold text-slate-900">Accreditation Center</h1>
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-6">
          <p className="text-sm text-amber-900">
            Complete <span className="font-semibold">Training &amp; Orientation</span> to unlock
            certification sittings.
          </p>
          <Link
            href="/training"
            className="mt-3 inline-block rounded-md bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600"
          >
            Go to training
          </Link>
        </div>
      </div>
    );
  }

  const { data } = await supabase
    .from("case_templates")
    .select("id, case_code, title, difficulty")
    .is("org_id", null)
    .order("case_code", { ascending: true });
  const templates = (data ?? []) as TemplateRow[];
  const passes = 3 - overview.progress.passesRemaining;

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="mb-1 text-2xl font-semibold text-slate-900">Accreditation Center</h1>
      <p className="mb-6 text-sm text-slate-600">
        Certification requires three first-try passes on fresh case variants, played closed-book.
      </p>

      {blocked && (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {blocked}
        </div>
      )}

      {overview.locked ? (
        <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-6">
          <p className="text-base font-semibold text-green-900">
            Certification locked in — congratulations.
          </p>
          <p className="mt-1 text-sm text-green-800">
            {overview.lockedAt
              ? `Locked ${new Date(overview.lockedAt).toLocaleString()}. `
              : "Evaluation of your third pass will finalize the evidence packet. "}
            Further practice never affects your certification.
          </p>
        </div>
      ) : (
        <div className="mb-6 rounded-lg border border-slate-200 bg-white p-6">
          <div className="mb-2 flex items-baseline justify-between">
            <p className="text-sm font-medium text-slate-900">
              {passes} of 3 first-try passes
            </p>
            <p className="text-xs text-slate-500">
              {overview.progress.burnedTemplateIds.length} burned ·{" "}
              {overview.progress.pendingTemplateIds.length} awaiting evaluation
            </p>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-blue-600 transition-all"
              style={{ width: `${(passes / 3) * 100}%` }}
            />
          </div>
        </div>
      )}

      <div className="mb-6 overflow-hidden rounded-lg border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Case</th>
              <th className="px-4 py-3">Tier</th>
              <th className="px-4 py-3">Certification status</th>
              <th className="px-4 py-3 text-right">Sittings</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {templates.map((t) => {
              const state = templateCertState(overview.attempts, t.id);
              const chip = STATE_CHIP[state];
              return (
                <tr key={t.id}>
                  <td className="px-4 py-3">
                    <span className="font-medium text-slate-900">{t.case_code}</span>{" "}
                    <span className="text-slate-600">{t.title}</span>
                  </td>
                  <td className="px-4 py-3 text-slate-600">Tier {t.difficulty}</td>
                  <td className="px-4 py-3">
                    <span
                      title={chip.title}
                      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${chip.className}`}
                    >
                      {chip.label}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end">
                      <SittingButtons
                        templateId={t.id}
                        certAvailable={state === "available" && !overview.locked}
                      />
                    </div>
                  </td>
                </tr>
              );
            })}
            {templates.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-slate-500">
                  No cases available yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="rounded-lg border border-slate-200 bg-slate-50 p-5 text-sm text-slate-700">
        <p className="mb-2 font-medium text-slate-900">How certification works</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            Every sitting — practice or certification — plays a <em>fresh variant</em> of the case:
            new caller identity and delivery, same underlying scenario. Drilling builds skill, not
            answer keys.
          </li>
          <li>
            A <span className="font-medium">certification sitting</span> is closed-book and counts
            only on your first attempt for that case. Pass three different cases first-try and
            certification locks in immediately.
          </li>
          <li>
            Failing a first certification attempt <span className="font-medium">burns</span> that
            case for certification — pick a different case for your next credit. Practice on burned
            cases remains unlimited and never affects certification.
          </li>
        </ul>
      </div>
    </div>
  );
}
