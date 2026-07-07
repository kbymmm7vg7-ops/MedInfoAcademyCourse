import Link from "next/link";
import { SignupForm } from "./signup-form";

export default function SignupPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-xl font-semibold text-slate-900">
            MedInfo Academy
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Create your training account.
          </p>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <SignupForm />
        </div>

        <p className="mt-6 text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-blue-700 hover:text-blue-800"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
