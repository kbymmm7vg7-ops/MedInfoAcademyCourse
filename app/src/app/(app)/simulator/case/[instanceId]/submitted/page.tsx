import Link from "next/link";

export default function CaseSubmittedPage() {
  return (
    <div className="px-8 py-10">
      <h1 className="text-2xl font-semibold text-slate-900">Submitted for review</h1>
      <p className="mt-2 max-w-xl text-sm text-slate-500">
        Your documentation has been submitted. The AI Evaluator arrives in S4 —
        for now, your submission is recorded and will show up in Case History
        as &quot;Awaiting evaluation&quot;.
      </p>
      <Link
        href="/simulator"
        className="mt-6 inline-block rounded-md bg-blue-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-600"
      >
        Back to case queue
      </Link>
    </div>
  );
}
