import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getUserRole } from "@/lib/auth/get-user-role";
import { ConfidentialityTierSelect } from "@/components/admin/orgs/confidentiality-tier-select";
import { CaseAccessList, type CaseAccessEntry } from "@/components/admin/orgs/case-access-list";
import type { ConfidentialityTier } from "@/lib/admin/org-actions";

// Organizations config (spec §4.5) — platform_admin ONLY. The /admin layout
// gates admin+; this page additionally 404s for org admins. The server
// actions in lib/admin/org-actions.ts re-check the role independently.

type OrgRow = {
  id: string;
  name: string;
  tier: "b2c" | "enterprise_lite" | "enterprise";
  confidentiality_tier: ConfidentialityTier;
  created_at: string;
};

type SharedCaseRow = {
  id: string;
  case_code: string | null;
  title: string;
};

type AccessRow = {
  case_template_id: string;
  enabled: boolean;
};

const ORG_TIER_LABELS: Record<OrgRow["tier"], string> = {
  b2c: "B2C",
  enterprise_lite: "Enterprise Lite",
  enterprise: "Enterprise",
};

export default async function AdminOrgsPage({
  searchParams,
}: {
  searchParams: Promise<{ org?: string }>;
}) {
  const role = await getUserRole();
  if (role !== "platform_admin") {
    notFound();
  }

  const { org: selectedOrgId } = await searchParams;
  const supabase = await createClient();

  const { data: orgData, error } = await supabase
    .from("organizations")
    .select("id, name, tier, confidentiality_tier, created_at")
    .order("name", { ascending: true })
    .returns<OrgRow[]>();

  const orgs = orgData ?? [];
  const selectedOrg = selectedOrgId ? (orgs.find((o) => o.id === selectedOrgId) ?? null) : null;

  let accessEntries: CaseAccessEntry[] = [];
  if (selectedOrg) {
    const [{ data: sharedCases }, { data: accessRows }] = await Promise.all([
      supabase
        .from("case_templates")
        .select("id, case_code, title")
        .is("org_id", null)
        .order("case_code", { ascending: true, nullsFirst: false })
        .returns<SharedCaseRow[]>(),
      supabase
        .from("org_case_access")
        .select("case_template_id, enabled")
        .eq("org_id", selectedOrg.id)
        .returns<AccessRow[]>(),
    ]);

    const enabledByTemplate = new Map(
      (accessRows ?? []).map((r) => [r.case_template_id, r.enabled])
    );
    accessEntries = (sharedCases ?? []).map((c) => ({
      templateId: c.id,
      caseCode: c.case_code,
      title: c.title,
      enabled: enabledByTemplate.get(c.id) ?? false,
    }));
  }

  return (
    <div className="px-6 py-8">
      <Link href="/admin" className="text-sm text-slate-500 hover:text-slate-700">
        &larr; Admin
      </Link>
      <h1 className="mt-2 mb-1 text-2xl font-semibold text-slate-900">Organizations</h1>
      <p className="mb-6 text-sm text-slate-600">
        Confidentiality tier and shared-case access per org. Every change is written to the
        audit log.
      </p>

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          Could not load organizations: {error.message}
        </div>
      )}

      {!error && orgs.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
          <p className="text-sm font-medium text-slate-700">No organizations yet</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-slate-200">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-slate-500">ID</th>
                <th className="px-4 py-3 text-left font-medium text-slate-500">Name</th>
                <th className="px-4 py-3 text-left font-medium text-slate-500">Tier</th>
                <th className="px-4 py-3 text-left font-medium text-slate-500">
                  Confidentiality
                </th>
                <th className="px-4 py-3 text-right font-medium text-slate-500">Case access</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {orgs.map((org) => (
                <tr key={org.id} className={org.id === selectedOrg?.id ? "bg-blue-50/50" : "hover:bg-slate-50"}>
                  <td className="px-4 py-3 font-mono text-xs text-slate-500" title={org.id}>
                    {org.id.slice(0, 8)}
                  </td>
                  <td className="px-4 py-3 text-slate-900">{org.name}</td>
                  <td className="px-4 py-3 text-slate-600">{ORG_TIER_LABELS[org.tier] ?? org.tier}</td>
                  <td className="px-4 py-3">
                    <ConfidentialityTierSelect
                      orgId={org.id}
                      currentTier={org.confidentiality_tier}
                    />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/orgs?org=${org.id}`}
                      className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                    >
                      Manage
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedOrg && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-slate-900">
            Shared-case access — {selectedOrg.name}
          </h2>
          <p className="mt-1 mb-4 text-sm text-slate-600">
            Which shared-bank cases this org&apos;s trainees can see. The org&apos;s own
            org-scoped cases are always visible to it and are not listed here.
          </p>
          {accessEntries.length === 0 ? (
            <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 px-6 py-8 text-center">
              <p className="text-sm text-slate-600">No shared-bank cases exist yet.</p>
            </div>
          ) : (
            <CaseAccessList orgId={selectedOrg.id} entries={accessEntries} />
          )}
        </div>
      )}
    </div>
  );
}
