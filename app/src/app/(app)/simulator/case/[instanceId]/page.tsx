import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { loadCaseInstance } from "@/lib/simulator/instance";
import { CaseWorkspace } from "@/components/simulator/case-workspace";

export default async function CaseInstancePage({
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

  // Open-book vs closed-book is chosen client-side after load; the initial
  // server load fetches closed-book (titles only) and the client toggles
  // reveal locally from what it already has. Since SRL bodies for decoys are
  // small case-content (not the answer key itself), we fetch open-book data
  // up front so the toggle is instant without a round trip.
  const loaded = await loadCaseInstance(supabase, instanceId, user.id, { openBook: true });

  if (!loaded) {
    notFound();
  }

  if (loaded.status === "submitted" || loaded.submittedAt) {
    redirect(`/simulator/case/${instanceId}/submitted`);
  }

  return (
    <div>
      <div className="flex items-center justify-between border-b border-slate-200 px-4 py-2">
        <Link href="/simulator" className="text-xs font-medium text-slate-500 hover:text-slate-800">
          ← Back to queue
        </Link>
      </div>
      <CaseWorkspace
        instanceId={loaded.instanceId}
        brief={loaded.brief}
        initialFormState={loaded.formState}
      />
    </div>
  );
}
