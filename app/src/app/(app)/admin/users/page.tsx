import Link from "next/link";
import { listUsers, type RosterRole } from "@/lib/admin/user-actions";
import { RoleSelect } from "@/components/admin/users/role-select";
import { DeactivateToggle } from "@/components/admin/users/deactivate-toggle";

const ASSIGNABLE_ROLES = new Set<string>(["trainee", "trainer", "qa"]);

function RoleBadge({ role }: { role: string }) {
  return (
    <span className="inline-flex rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-800">
      {role === "platform_admin" ? "Platform admin" : "Admin"}
    </span>
  );
}

function StatusBadge({ deactivatedAt }: { deactivatedAt: string | null }) {
  return deactivatedAt ? (
    <span className="inline-flex rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
      Deactivated
    </span>
  ) : (
    <span className="inline-flex rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800">
      Active
    </span>
  );
}

export default async function AdminUsersPage() {
  const result = await listUsers();

  return (
    <div className="px-6 py-8">
      <Link href="/admin" className="text-sm text-slate-500 hover:text-slate-700">
        &larr; Admin
      </Link>
      <h1 className="mt-2 mb-1 text-2xl font-semibold text-slate-900">Users &amp; roster</h1>
      <p className="mb-6 text-sm text-slate-600">
        {result.ok && result.viewerRole === "platform_admin"
          ? "All organizations. Role and status changes are written to the audit log."
          : "Your organization's roster. Role and status changes are written to the audit log."}
      </p>

      {!result.ok ? (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {result.error}
        </div>
      ) : result.users.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
          <p className="text-sm font-medium text-slate-700">No users found</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-slate-200">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-slate-500">ID</th>
                <th className="px-4 py-3 text-left font-medium text-slate-500">Name</th>
                <th className="px-4 py-3 text-left font-medium text-slate-500">Email</th>
                {result.viewerRole === "platform_admin" && (
                  <th className="px-4 py-3 text-left font-medium text-slate-500">Org</th>
                )}
                <th className="px-4 py-3 text-left font-medium text-slate-500">Role</th>
                <th className="px-4 py-3 text-left font-medium text-slate-500">Status</th>
                <th className="px-4 py-3 text-left font-medium text-slate-500">Created</th>
                <th className="px-4 py-3 text-left font-medium text-slate-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {result.users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-mono text-xs text-slate-500" title={u.id}>
                    {u.id.slice(0, 8)}
                  </td>
                  <td className="px-4 py-3 text-slate-900">{u.fullName || "—"}</td>
                  <td className="px-4 py-3 text-slate-600">{u.email || "—"}</td>
                  {result.viewerRole === "platform_admin" && (
                    <td className="px-4 py-3 text-slate-600">{u.orgName ?? "—"}</td>
                  )}
                  <td className="px-4 py-3">
                    {ASSIGNABLE_ROLES.has(u.role) ? (
                      <RoleSelect userId={u.id} currentRole={u.role as RosterRole} />
                    ) : (
                      <RoleBadge role={u.role} />
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge deactivatedAt={u.deactivatedAt} />
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    {u.id === result.viewerId ? (
                      <span className="text-xs text-slate-400">You</span>
                    ) : (
                      <DeactivateToggle userId={u.id} deactivated={u.deactivatedAt !== null} />
                    )}
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
