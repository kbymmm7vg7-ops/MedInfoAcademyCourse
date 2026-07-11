import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getUserRole } from "@/lib/auth/get-user-role";
import {
  NewModuleForm,
} from "@/components/admin/training/new-module-form";
import {
  OrgCopyButton,
  ReorderButtons,
  RequiredToggle,
} from "@/components/admin/training/row-controls";

// Training module management (spec §4.1). RLS scopes the read: platform_admin
// sees the shared bank plus every org's rows; an org admin sees the shared
// bank (read-only for them) plus their own org's rows. Org rows shadow shared
// rows by slug for that org's trainees (lib/training/modules.ts).
type AdminModuleRow = {
  id: string;
  org_id: string | null;
  slug: string | null;
  title: string;
  required: boolean;
  est_minutes: number | null;
  order_index: number;
  organizations: { name: string } | null;
};

function ModuleTable({
  rows,
  orgLabel,
  editable,
  copyableSlugs,
}: {
  rows: AdminModuleRow[];
  orgLabel: string;
  editable: boolean;
  /** For org admins on the shared table: slugs their org has NOT copied yet map to a copy button. */
  copyableSlugs: Set<string> | null;
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200">
      <table className="min-w-full divide-y divide-slate-200 text-sm">
        <thead className="bg-slate-50">
          <tr>
            <th className="w-24 px-4 py-3 text-left font-medium text-slate-500">Order</th>
            <th className="px-4 py-3 text-left font-medium text-slate-500">Title</th>
            <th className="px-4 py-3 text-left font-medium text-slate-500">Slug</th>
            <th className="px-4 py-3 text-left font-medium text-slate-500">Org</th>
            <th className="px-4 py-3 text-left font-medium text-slate-500">Required</th>
            <th className="px-4 py-3 text-left font-medium text-slate-500">Est. minutes</th>
            {copyableSlugs !== null && (
              <th className="px-4 py-3 text-left font-medium text-slate-500">Tailor</th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {rows.map((row, index) => (
            <tr key={row.id} className="hover:bg-slate-50">
              <td className="px-4 py-3">
                {editable ? (
                  <div className="flex items-center gap-2">
                    <span className="w-4 text-xs text-slate-400">{row.order_index}</span>
                    <ReorderButtons
                      moduleId={row.id}
                      isFirst={index === 0}
                      isLast={index === rows.length - 1}
                    />
                  </div>
                ) : (
                  <span className="text-xs text-slate-400">{row.order_index}</span>
                )}
              </td>
              <td className="px-4 py-3">
                <Link
                  href={`/admin/training/${row.id}`}
                  className="font-medium text-slate-900 hover:underline"
                >
                  {row.title}
                </Link>
              </td>
              <td className="px-4 py-3 font-mono text-xs text-slate-600">{row.slug ?? "—"}</td>
              <td className="px-4 py-3">
                {row.org_id ? (
                  <span className="inline-flex rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-800">
                    {orgLabel}
                  </span>
                ) : (
                  <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                    Shared
                  </span>
                )}
              </td>
              <td className="px-4 py-3">
                {editable ? (
                  <RequiredToggle moduleId={row.id} initialRequired={row.required} />
                ) : (
                  <span
                    className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      row.required
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {row.required ? "Required" : "Optional"}
                  </span>
                )}
              </td>
              <td className="px-4 py-3 text-slate-600">{row.est_minutes ?? "—"}</td>
              {copyableSlugs !== null && (
                <td className="px-4 py-3">
                  {row.slug ? (
                    <OrgCopyButton
                      moduleId={row.id}
                      alreadyCopied={!copyableSlugs.has(row.slug)}
                    />
                  ) : (
                    <span className="text-xs text-slate-400">—</span>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default async function AdminTrainingPage() {
  const supabase = await createClient();
  const [role, { data: { user } }] = await Promise.all([
    getUserRole(),
    supabase.auth.getUser(),
  ]);

  const { data: viewer } = user
    ? await supabase
        .from("users")
        .select("org_id")
        .eq("id", user.id)
        .maybeSingle<{ org_id: string | null }>()
    : { data: null };
  const viewerOrgId = viewer?.org_id ?? null;

  const { data, error } = await supabase
    .from("training_modules")
    .select("id, org_id, slug, title, required, est_minutes, order_index, organizations(name)")
    .order("order_index", { ascending: true })
    .returns<AdminModuleRow[]>();

  const rows = data ?? [];
  const shared = rows.filter((r) => r.org_id === null);

  // Group org rows by org (platform_admin can see several orgs; an org admin
  // only ever sees their own thanks to RLS).
  const orgGroups = new Map<string, { name: string; rows: AdminModuleRow[] }>();
  for (const row of rows) {
    if (!row.org_id) continue;
    const group = orgGroups.get(row.org_id) ?? {
      name: row.organizations?.name ?? "Organization",
      rows: [],
    };
    group.rows.push(row);
    orgGroups.set(row.org_id, group);
  }

  const isOrgAdmin = role === "admin";
  // Slugs the org admin's org has NOT yet copied — those shared rows offer
  // "Create org copy"; the rest read "Org copy exists".
  const ownOrgSlugs = new Set(
    (viewerOrgId ? orgGroups.get(viewerOrgId)?.rows ?? [] : [])
      .map((r) => r.slug)
      .filter((s): s is string => s !== null)
  );
  const copyableSlugs = isOrgAdmin
    ? new Set(
        shared.map((r) => r.slug).filter((s): s is string => s !== null && !ownOrgSlugs.has(s))
      )
    : null;

  return (
    <div className="px-6 py-8">
      <Link href="/admin" className="text-sm text-slate-500 hover:text-slate-700">
        &larr; Admin
      </Link>
      <div className="mt-2 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Training modules</h1>
          <p className="mt-1 text-sm text-slate-600">
            {role === "platform_admin"
              ? "Shared bank plus every org's tailored copies. All changes are audited."
              : "Shared bank (read-only) plus your organization's modules. An org copy shadows the shared module for your trainees. All changes are audited."}
          </p>
        </div>
        <NewModuleForm
          scopeLabel={
            role === "platform_admin" ? "a shared module (all orgs)" : "a module for your organization"
          }
        />
      </div>

      {error && (
        <div className="mt-6 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          Could not load training modules: {error.message}
        </div>
      )}

      <h2 className="mt-8 text-sm font-semibold text-slate-900">Shared modules</h2>
      {shared.length === 0 ? (
        <div className="mt-3 rounded-lg border border-dashed border-slate-300 bg-slate-50 px-6 py-8 text-center text-sm text-slate-500">
          No shared modules yet.
        </div>
      ) : (
        <div className="mt-3">
          <ModuleTable
            rows={shared}
            orgLabel="Shared"
            editable={role === "platform_admin"}
            copyableSlugs={copyableSlugs}
          />
        </div>
      )}

      {[...orgGroups.entries()].map(([orgId, group]) => (
        <div key={orgId}>
          <h2 className="mt-8 text-sm font-semibold text-slate-900">
            {group.name} — tailored modules
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            A row with the same slug as a shared module replaces it for this org&apos;s
            trainees; new slugs are appended after the shared bank.
          </p>
          <div className="mt-3">
            <ModuleTable
              rows={group.rows}
              orgLabel={group.name}
              editable={role === "platform_admin" || (isOrgAdmin && orgId === viewerOrgId)}
              copyableSlugs={null}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
