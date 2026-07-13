"use client";

import { useState, useTransition } from "react";
import type { CaseBrief, DocumentationFormState, TranscriptTurn } from "@/lib/simulator/types";
import { saveDraft, submitCase } from "@/lib/simulator/actions";
import { TranscriptPane } from "@/components/simulator/transcript-pane";
import { VoiceCall } from "@/components/simulator/voice-call";
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
  initialConversationTurns = [],
  readOnly = false,
}: {
  instanceId: string;
  brief: CaseBrief;
  initialFormState: DocumentationFormState;
  initialConversationTurns?: TranscriptTurn[];
  readOnly?: boolean;
}) {
  const [activeTab, setActiveTab] = useState<Tab>("Intake");
  const [formState, setFormState] = useState<DocumentationFormState>(initialFormState);
  // Open-book is always on in the simulator (Nathan, 2026-07-11 — the toggle
  // is gone). Certification stays closed-book SERVER-side: the loader never
  // hydrates SRL bodies for a closed_book variant (case-brief.ts), so this
  // flag only controls display of bodies that were already allowed to load.
  const openBook = true;
  // Voice mode (PRD §5.1a): large doc panel + caption strip while on a call.
  const [voiceMode, setVoiceMode] = useState(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [voiceTurns, setVoiceTurns] = useState<TranscriptTurn[]>([]);
  const [chatSession, setChatSession] = useState(0);
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

  const canVoice = brief.channel === "voice" && brief.hasLivePersona && !readOnly;

  // Mic permission is requested at the Start click (spec §Mic permission);
  // denied/unsupported falls back gracefully to the text chat for this case.
  async function startVoiceCall() {
    persist();
    try {
      const probe = await navigator.mediaDevices.getUserMedia({ audio: true });
      probe.getTracks().forEach((t) => t.stop());
      setVoiceError(null);
      setVoiceMode(true);
    } catch {
      setVoiceError("Microphone permission denied or unavailable — continue the case by text.");
    }
  }

  function handleVoiceEnd(turns: TranscriptTurn[]) {
    if (turns.length > 0) {
      setVoiceTurns((prev) => [...prev, ...turns]);
      // Remount the chat pane so it re-seeds its history with the voice turns
      // (they are already persisted server-side by /api/persona/turn).
      setChatSession((s) => s + 1);
    }
    setVoiceMode(false);
  }

  const docPanel = (
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
                  safety={formState.safety}
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
  );

  if (voiceMode) {
    return (
      <div className="flex h-[calc(100vh-3.5rem)] flex-col">
        <VoiceCall
          instanceId={instanceId}
          productLabel={brief.product_ref}
          background={brief.contact_prefill.background ?? null}
          onEnd={handleVoiceEnd}
        />
        <div className="min-h-0 flex-1">{docPanel}</div>
      </div>
    );
  }

  return (
    <div className="grid h-[calc(100vh-3.5rem)] grid-cols-2">
      <TranscriptPane
        key={`chat-${chatSession}`}
        instanceId={instanceId}
        transcript={brief.transcript}
        hasScriptedTranscript={brief.hasScriptedTranscript}
        hasLivePersona={brief.hasLivePersona}
        conversationTurns={[...initialConversationTurns, ...voiceTurns]}
        productLabel={brief.product_ref}
        readOnly={readOnly}
        onStartVoice={canVoice ? startVoiceCall : undefined}
        voiceError={voiceError}
      />
      {docPanel}
    </div>
  );
}
