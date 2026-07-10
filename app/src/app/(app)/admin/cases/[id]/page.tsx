import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getUserRole } from "@/lib/auth/get-user-role";
import { loadAnswerKeyForAdmin } from "@/lib/admin/answer-keys";
import { SurfaceEditForm } from "@/components/admin/cases/surface-edit-form";
import { SttTtsToggle } from "@/components/admin/cases/stt-tts-toggle";
import { GroundTruthEditor } from "@/components/admin/cases/ground-truth-editor";
import { ApproveRubricToggle } from "@/components/admin/cases/approve-rubric-toggle";

type CaseSurfaceRow = {
  id: string;
  case_code: string | null;
  title: string;
  difficulty: number;
  therapeutic_area: string | null;
  product_ref: string | null;
  org_id: string | null;
  outline_status: string;
  stt_tts_verified: boolean;
  rubric_approved: boolean;
};

export default async function AdminCaseEditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await createClient();
  const [{ data: surface }, role, answerKey] = await Promise.all([
    supabase
      .from("case_templates")
      .select(
        "id, case_code, title, difficulty, therapeutic_area, product_ref, org_id, outline_status, stt_tts_verified, rubric_approved"
      )
      .eq("id", id)
      .maybeSingle<CaseSurfaceRow>(),
    getUserRole(),
    loadAnswerKeyForAdmin(id),
  ]);

  if (!surface) {
    notFound();
  }

  const initialGroundTruthJson = answerKey?.groundTruthJson
    ? JSON.stringify(answerKey.groundTruthJson, null, 2)
    : "{}";

  return (
    <div className="px-6 py-8">
      <Link href="/admin/cases" className="text-xs font-medium text-slate-500 hover:text-slate-800">
        ← Back to case bank
      </Link>

      <div className="mt-2 flex items-baseline justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">{surface.title}</h1>
          <p className="mt-1 text-sm text-slate-500">
            {surface.case_code ?? surface.id.slice(0, 8)} ·{" "}
            {surface.org_id ? "Org-scoped case" : "Shared bank case"}
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-6">
        <SurfaceEditForm
          templateId={surface.id}
          initialTitle={surface.title}
          initialDifficulty={surface.difficulty}
          initialTherapeuticArea={surface.therapeutic_area}
          initialProductRef={surface.product_ref}
        />

        <SttTtsToggle templateId={surface.id} initialVerified={surface.stt_tts_verified} />

        <ApproveRubricToggle
          templateId={surface.id}
          initialApproved={surface.rubric_approved}
          canApprove={role === "platform_admin"}
        />

        <GroundTruthEditor templateId={surface.id} initialJson={initialGroundTruthJson} />
      </div>
    </div>
  );
}
