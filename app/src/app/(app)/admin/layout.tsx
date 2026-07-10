import { notFound } from "next/navigation";
import { getUserRole } from "@/lib/auth/get-user-role";

// THE /admin gate (spec §3): a server-side role check in the layout. Nav
// hiding elsewhere is cosmetic — this is what actually protects every
// /admin/* route, and it 404s (not redirect-to-login) so the area's existence
// isn't advertised to non-admins. getUserRole() fails safe to "trainee", so
// any lookup failure lands on notFound() too.
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const role = await getUserRole();
  if (role !== "admin" && role !== "platform_admin") {
    notFound();
  }

  return <div className="mx-auto max-w-6xl">{children}</div>;
}
