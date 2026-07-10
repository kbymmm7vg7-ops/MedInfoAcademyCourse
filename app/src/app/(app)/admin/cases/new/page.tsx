import Link from "next/link";
import { ScenarioIntakeForm } from "@/components/admin/cases/scenario-intake-form";

// Custom scenario intake (spec §4.3): a guided form for an org-scoped case.
// All validation and persistence goes through createOrgScenario in
// lib/admin/answer-keys.ts, which audits the creation itself — this page
// does not write an audit_log row.
export default function NewCaseScenarioPage() {
  return (
    <div className="px-6 py-8">
      <Link href="/admin/cases" className="text-xs font-medium text-slate-500 hover:text-slate-800">
        ← Back to case bank
      </Link>

      <h1 className="mt-2 text-2xl font-semibold text-slate-900">Custom scenario intake</h1>
      <p className="mt-1 text-sm text-slate-600">
        Draft an org-scoped case: brief, answer key, optional persona brief, and any org SRLs
        it should reference. Org admins create cases scoped to their own organization.
      </p>

      <div className="mt-6 max-w-3xl">
        <ScenarioIntakeForm />
      </div>
    </div>
  );
}
