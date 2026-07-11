import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getUserRole } from "@/lib/auth/get-user-role";
import { ModuleEditor } from "@/components/admin/training/module-editor";

// Training module editor (spec §4.1): metadata + content_md textarea with a
// live preview through the escaping renderer (lib/training/markdown.ts).
// Shared rows are read-only for org admins — they tailor via an org copy
// from the list page instead; the server actions enforce the same rule.
type ModuleRow = {
  id: string;
  org_id: string | null;
  slug: string | null;
  title: string;
  content_md: string | null;
  required: boolean;
  est_minutes: number | null;
  order_index: number;
  organizations: { name: string } | null;
};

export default async function AdminTrainingModulePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [role, { data: { user } }, { data: mod }] = await Promise.all([
    getUserRole(),
    supabase.auth.getUser(),
    supabase
      .from("training_modules")
      .select(
        "id, org_id, slug, title, content_md, required, est_minutes, order_index, organizations(name)"
      )
      .eq("id", id)
      .maybeSingle<ModuleRow>(),
  ]);

  if (!mod) notFound();

  const { data: viewer } = user
    ? await supabase
        .from("users")
        .select("org_id")
        .eq("id", user.id)
        .maybeSingle<{ org_id: string | null }>()
    : { data: null };
  const viewerOrgId = viewer?.org_id ?? null;

  const editable =
    role === "platform_admin" ||
    (role === "admin" && mod.org_id !== null && mod.org_id === viewerOrgId);

  const scope = mod.org_id
    ? `${mod.organizations?.name ?? "Org"} module`
    : "Shared module";

  return (
    <div className="px-6 py-8">
      <Link
        href="/admin/training"
        className="text-xs font-medium text-slate-500 hover:text-slate-800"
      >
        ← Back to training modules
      </Link>

      <div className="mt-2 mb-6">
        <h1 className="text-2xl font-semibold text-slate-900">{mod.title}</h1>
        <p className="mt-1 text-sm text-slate-500">
          {scope} · <span className="font-mono text-xs">{mod.slug ?? mod.id.slice(0, 8)}</span>
        </p>
        {!editable && (
          <div className="mt-3 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            Read-only: shared modules are edited by platform admins. Use “Create org copy”
            on the module list to tailor this content for your organization.
          </div>
        )}
      </div>

      <ModuleEditor
        moduleId={mod.id}
        initialTitle={mod.title}
        initialSlug={mod.slug ?? ""}
        initialEstMinutes={mod.est_minutes}
        initialRequired={mod.required}
        initialContentMd={mod.content_md ?? ""}
        readOnly={!editable}
      />
    </div>
  );
}
