import Link from "next/link";
import { LoginForm } from "./login-form";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ confirm?: string; redirectTo?: string }>;
}) {
  const params = await searchParams;
  const justSignedUp = params.confirm === "1";

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-xl font-semibold text-slate-900">
            MedInfo Academy
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Sign in to continue your training.
          </p>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          {justSignedUp && (
            <div className="mb-4 rounded-md border border-blue-200 bg-blue-50 px-3 py-2 text-sm text-blue-800">
              Account created. Check your email to confirm your address, then
              sign in below.
            </div>
          )}
          <LoginForm redirectTo={params.redirectTo} />
        </div>

        <p className="mt-6 text-center text-sm text-slate-500">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="font-medium text-blue-700 hover:text-blue-800"
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
