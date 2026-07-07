import { notFound } from "next/navigation";
import { getUserRole, isManagerRole } from "@/lib/auth/get-user-role";
import { PageStub } from "@/components/page-stub";

export default async function ManagerPage() {
  const role = await getUserRole();

  // Defense in depth: the sidebar already hides this link for non-manager
  // roles, but the route itself must not render for a direct visit either.
  if (!isManagerRole(role)) {
    notFound();
  }

  return (
    <PageStub
      title="Manager Dashboard"
      description="Team progress, queue oversight, and QA review tools will appear here."
    />
  );
}
