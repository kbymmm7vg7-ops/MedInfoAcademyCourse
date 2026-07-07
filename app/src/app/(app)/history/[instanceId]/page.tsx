import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { loadCaseInstance } from "@/lib/simulator/instance";
import { CaseWorkspace } from "@/components/simulator/case-workspace";

export default async function HistoryDetailPage({
  params,
}: {
  params: Promise<{ instanceId: string }>;
}) {
  const { instanceId } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const loaded = await loadCaseInstance(supabase, instanceId, user.id, { openBook: true });

  if (!loaded) {
    notFound();
  }

  return (
    <div>
      <div className="flex items-center justify-between border-b border-slate-200 px-4 py-2">
        <Link href="/history" className="text-xs font-medium text-slate-500 hover:text-slate-800">
          ← Back to history
        </Link>
        <span className="text-xs font-medium text-amber-700">Read-only — awaiting evaluation</span>
      </div>
      <CaseWorkspace
        instanceId={loaded.instanceId}
        brief={loaded.brief}
        initialFormState={loaded.formState}
        initialConversationTurns={loaded.conversationTurns}
        readOnly
      />
    </div>
  );
}
