import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getUserRole, isManagerRole } from "@/lib/auth/get-user-role";
import { SidebarNav } from "@/components/sidebar-nav";
import { SignOutButton } from "@/components/sign-out-button";
import { ResumeCaseButton } from "@/components/resume-case-button";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // The proxy (src/proxy.ts) already redirects unauthenticated requests to
  // /login, but Server Components should never assume a request passed
  // through it, so this is checked again here.
  if (!user) {
    redirect("/login");
  }

  const role = await getUserRole();
  const showManagerNav = isManagerRole(role);

  return (
    <div className="flex min-h-screen">
      <aside className="flex w-64 flex-shrink-0 flex-col bg-slate-900">
        <div className="px-4 py-5">
          <p className="text-sm font-semibold tracking-wide text-white">
            MedInfo Academy
          </p>
        </div>

        <div className="px-3">
          <ResumeCaseButton />
        </div>

        <SidebarNav showManagerNav={showManagerNav} />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 flex-shrink-0 items-center justify-between border-b border-slate-200 bg-white px-6">
          <div />
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-600">{user.email}</span>
            <SignOutButton />
          </div>
        </header>

        <main className="flex-1 bg-white">{children}</main>
      </div>
    </div>
  );
}
