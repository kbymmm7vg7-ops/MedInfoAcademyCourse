"use client";

import { useState, useTransition } from "react";
import type { CaseBrief, DocumentationFormState } from "@/lib/simulator/types";
import { saveDraft, submitCase } from "@/lib/simulator/actions";
import { TranscriptPane } from "@/components/simulator/transcript-pane";
import { IntakeTab } from "@/components/simulator/intake-tab";
import { InquiryTab } from "@/components/simulator/inquiry-tab";
import { SafetyTab } from "@/components/simulator/safety-tab";
import { ResponseTab } from "@/components/simulator/response-tab";
import { ClosureTab } from "@/components/simulator/closure-tab";

const TABS = ["Intake", "Inquiry", "Safety", "Response", "Closure"] as const;
type Tab = (typeof TABS)[number];

export function CaseWorkspace({
  instanceId,
  brief,
  initialFormState,
  readOnly = false,
}: {
  instanceId: string;
  brief: CaseBrief;
  initialFormState: DocumentationFormState;
  readOnly?: boolean;
}) {
  const [activeTab, setActiveTab] = useState<Tab>("Intake");
  const [formState, setFormState] = useState<DocumentationFormState>(initialFormState);
  const [openBook, setOpenBook] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [submitError, setSubmitError] = useState<string | null>(null);

  function persist() {
    if (readOnly) return;
    const snapshot = formState;
    setSaveStatus("saving");
    startTransition(async () => {
      const result = await saveDraft(instanceId, snapshot);
      setSaveStatus(result.ok ? "saved" : "error");
    });
  }

  function handleTabChange(tab: Tab) {
    if (tab === activeTab) return;
    persist();
    setActiveTab(tab);
  }

  function patchIntake(patch: Partial<DocumentationFormState["intake"]>) {
    setFormState((prev) => ({ ...prev, intake: { ...prev.intake, ...patch } }));
  }
  function patchInquiry(patch: Partial<DocumentationFormState["inquiry"]>) {
    setFormState((prev) => ({ ...prev, inquiry: { ...prev.inquiry, ...patch } }));
  }
  function patchSafety(patch: Partial<DocumentationFormState["safety"]>) {
    setFormState((prev) => ({ ...prev, safety: { ...prev.safety, ...patch } }));
  }
  function patchResponse(patch: Partial<DocumentationFormState["response"]>) {
    setFormState((prev) => ({ ...prev, response: { ...prev.response, ...patch } }));
  }
  function patchClosure(patch: Partial<DocumentationFormState["closure"]>) {
    setFormState((prev) => ({ ...prev, closure: { ...prev.closure, ...patch } }));
  }

  function handleSubmit() {
    setSubmitError(null);
    if (!formState.closure.qc_self_check) {
      setSubmitError("Complete the QC self-check before submitting.");
      return;
    }
    startTransition(async () => {
      const result = await submitCase(instanceId, formState);
      // submitCase redirects on success; if we get a result back, it failed.
      if (result && !result.ok) {
        setSubmitError(result.error);
      }
    });
  }

  return (
    <div className="grid h-[calc(100vh-3.5rem)] grid-cols-2">
      <TranscriptPane
        transcript={brief.transcript}
        hasScriptedTranscript={brief.hasScriptedTranscript}
        openBook={openBook}
        onToggleOpenBook={() => setOpenBook((v) => !v)}
      />

      <div className="flex h-full flex-col overflow-hidden">
        <div className="border-b border-slate-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400">
                {brief.case_code ?? "Case"} · {brief.title}
              </p>
            </div>
            {!readOnly && (
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-400">
                  {saveStatus === "saving" && "Saving…"}
                  {saveStatus === "saved" && "Draft saved"}
                  {saveStatus === "error" && "Save failed"}
                </span>
                <button
                  type="button"
                  disabled={isPending}
                  onClick={persist}
                  className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
                >
                  Save draft
                </button>
              </div>
            )}
          </div>

          <div role="tablist" aria-label="Case record sections" className="mt-3 flex gap-1">
            {TABS.map((tab) => (
              <button
                key={tab}
                type="button"
                role="tab"
                aria-selected={activeTab === tab}
                tabIndex={activeTab === tab ? 0 : -1}
                onClick={() => handleTabChange(tab)}
                onKeyDown={(e) => {
                  if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
                    e.preventDefault();
                    const idx = TABS.indexOf(activeTab);
                    const nextIdx =
                      e.key === "ArrowRight"
                        ? (idx + 1) % TABS.length
                        : (idx - 1 + TABS.length) % TABS.length;
                    handleTabChange(TABS[nextIdx]);
                  }
                }}
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? "bg-blue-700 text-white"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4">
          <div
            role="tabpanel"
            hidden={activeTab !== "Intake"}
            aria-label="Intake"
          >
            {activeTab === "Intake" && (
              <IntakeTab
                intake={formState.intake}
                safety={formState.safety}
                onChange={patchIntake}
                disabled={readOnly}
              />
            )}
          </div>

          <div role="tabpanel" hidden={activeTab !== "Inquiry"} aria-label="Inquiry">
            {activeTab === "Inquiry" && (
              <InquiryTab
                inquiry={formState.inquiry}
                onChange={patchInquiry}
                disabled={readOnly}
              />
            )}
          </div>

          <div role="tabpanel" hidden={activeTab !== "Safety"} aria-label="Safety">
            {activeTab === "Safety" && (
              <SafetyTab safety={formState.safety} onChange={patchSafety} disabled={readOnly} />
            )}
          </div>

          <div role="tabpanel" hidden={activeTab !== "Response"} aria-label="Response">
            {activeTab === "Response" && (
              <ResponseTab
                response={formState.response}
                srlCandidates={brief.srl_candidates}
                openBook={openBook}
                onChange={patchResponse}
                disabled={readOnly}
              />
            )}
          </div>

          <div role="tabpanel" hidden={activeTab !== "Closure"} aria-label="Closure">
            {activeTab === "Closure" && (
              <>
                <ClosureTab
                  closure={formState.closure}
                  onChange={patchClosure}
                  disabled={readOnly}
                />
                {!readOnly && (
                  <div className="mt-6 border-t border-slate-200 pt-4">
                    {submitError && (
                      <p className="mb-2 text-sm text-red-600">{submitError}</p>
                    )}
                    <button
                      type="button"
                      disabled={isPending || !formState.closure.qc_self_check}
                      onClick={handleSubmit}
                      className="rounded-md bg-blue-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Submit for Review
                    </button>
                    {!formState.closure.qc_self_check && (
                      <p className="mt-2 text-xs text-slate-400">
                        Complete the QC self-check above to enable submission.
                      </p>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
