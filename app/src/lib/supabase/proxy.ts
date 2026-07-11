import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { isDeactivated, fetchDeactivatedAt, DEACTIVATED_MESSAGE } from "@/lib/auth/deactivation";

// Routes that do not require an authenticated session.
const PUBLIC_ROUTE_PREFIXES = ["/login", "/signup", "/auth"];

function isPublicRoute(pathname: string) {
  return PUBLIC_ROUTE_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

/**
 * Refreshes the Supabase auth session on every request and redirects
 * unauthenticated users away from protected routes to /login.
 *
 * Called from src/proxy.ts (Next.js 16's renamed Middleware).
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // IMPORTANT: Avoid writing logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to
  // debug issues with users being randomly logged out.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  if (!user && !isPublicRoute(pathname)) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/login";
    redirectUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Sign-in ban: a deactivated user must not be able to use the app,
  // including API routes (e.g. /api/persona/turn). This runs on every
  // request that reached here with a session, covering both page
  // navigations and fetch calls — the same middleware pass already does
  // the getUser() call above, so this adds one more query on that path.
  if (user && !isPublicRoute(pathname)) {
    const deactivatedAt = await fetchDeactivatedAt(supabase, user.id);
    if (isDeactivated(deactivatedAt)) {
      await supabase.auth.signOut();

      const blockedResponse = pathname.startsWith("/api/")
        ? NextResponse.json({ error: DEACTIVATED_MESSAGE }, { status: 403 })
        : NextResponse.redirect(
            (() => {
              const url = request.nextUrl.clone();
              url.pathname = "/login";
              url.searchParams.set("deactivated", "1");
              return url;
            })()
          );

      // Carry over the cookies signOut() cleared via the client above (it
      // wrote them onto supabaseResponse through the setAll hook) since
      // blockedResponse is a distinct NextResponse instance.
      supabaseResponse.cookies.getAll().forEach((cookie) => {
        blockedResponse.cookies.set(cookie);
      });
      return blockedResponse;
    }
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is.
  return supabaseResponse;
}
