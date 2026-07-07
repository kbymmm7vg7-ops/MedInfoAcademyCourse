import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";

// NOTE: Next.js 16 renamed the `middleware.ts` file convention to `proxy.ts`
// (exported function renamed from `middleware` to `proxy`). A `middleware.ts`
// file is no longer picked up by the framework.
export async function proxy(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     * - image/asset file extensions
     */
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
