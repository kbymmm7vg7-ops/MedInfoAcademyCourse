import Link from "next/link";
import { getUserRole } from "@/lib/auth/get-user-role";

const MODULES: { href: string; title: string; blurb: string; platformOnly?: boolean }[] = [
  {
    href: "/admin/training",
    title: "Training modules",
    blurb: "Edit self-study content, reorder, toggle required, create per-org tailored copies.",
  },
  {
    href: "/admin/cases",
    title: "Case bank & content status",
    blurb: "Scenario surface edits, content-status board, gated ground-truth editing.",
  },
  {
    href: "/admin/cases/new",
    title: "Custom scenario intake",
    blurb: "Draft an org-scoped case with answer key, persona brief, and org SRLs.",
  },
  {
    href: "/admin/users",
    title: "Users & roster",
    blurb: "Deactivate users, assign trainee/trainer/qa roles.",
  },
  {
    href: "/admin/evaluations",
    title: "Pending evaluations",
    blurb: "Submitted-but-unevaluated cases, with retry.",
  },
  {
    href: "/admin/orgs",
    title: "Organizations",
    blurb: "Org case access and confidentiality tier.",
    platformOnly: true,
  },
];

export default async function AdminHome() {
  const role = await getUserRole(); // layout already gated; this only scopes the module list
  const modules = MODULES.filter((m) => !m.platformOnly || role === "platform_admin");
  return (
    <div className="px-6 py-8">
      <h1 className="mb-1 text-2xl font-semibold text-slate-900">Admin</h1>
      <p className="mb-6 text-sm text-slate-600">
        Every change made here is written to the audit log.
      </p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {modules.map((m) => (
          <Link
            key={m.href}
            href={m.href}
            className="rounded-lg border border-slate-200 p-4 transition-colors hover:border-slate-400"
          >
            <h2 className="font-medium text-slate-900">{m.title}</h2>
            <p className="mt-1 text-sm text-slate-600">{m.blurb}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
