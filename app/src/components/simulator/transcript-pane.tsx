"use client";

import type { TranscriptTurn } from "@/lib/simulator/types";
import { ChatPane } from "@/components/simulator/chat-pane";

function ScriptedTurns({ transcript }: { transcript: TranscriptTurn[] }) {
  return (
    <div className="space-y-3">
      {transcript.map((turn, i) => (
        <div
          key={i}
          className={`flex ${turn.speaker === "trainee" ? "justify-end" : "justify-start"}`}
        >
          <div
            className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
              turn.speaker === "trainee"
                ? "bg-blue-700 text-white"
                : "bg-slate-100 text-slate-800"
            }`}
          >
            {turn.content}
          </div>
        </div>
      ))}
    </div>
  );
}

export function TranscriptPane({
  instanceId,
  transcript,
  hasScriptedTranscript,
  hasLivePersona,
  conversationTurns,
  productLabel,
  openBook,
  onToggleOpenBook,
  readOnly = false,
}: {
  instanceId: string;
  transcript: TranscriptTurn[];
  hasScriptedTranscript: boolean;
  hasLivePersona: boolean;
  conversationTurns: TranscriptTurn[];
  productLabel: string | null;
  openBook: boolean;
  onToggleOpenBook: () => void;
  readOnly?: boolean;
}) {
  return (
    <div className="flex h-full flex-col border-r border-slate-200">
      <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
        <h2 className="text-sm font-semibold text-slate-900">
          {hasLivePersona ? "Call" : "Call transcript"}
        </h2>
        <label className="flex items-center gap-2 text-xs font-medium text-slate-600">
          <span>{openBook ? "Open-book" : "Closed-book"}</span>
          <button
            type="button"
            role="switch"
            aria-checked={openBook}
            onClick={onToggleOpenBook}
            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
              openBook ? "bg-blue-700" : "bg-slate-300"
            }`}
          >
            <span
              className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                openBook ? "translate-x-4.5" : "translate-x-1"
              }`}
            />
          </button>
        </label>
      </div>

      {hasLivePersona ? (
        <div className="flex flex-1 flex-col overflow-hidden">
          <div className="flex-1 overflow-hidden">
            <ChatPane
              instanceId={instanceId}
              initialTurns={conversationTurns}
              disabled={readOnly}
              productLabel={productLabel}
            />
          </div>

          {hasScriptedTranscript && (
            <details className="border-t border-slate-200 px-4 py-3">
              <summary className="cursor-pointer text-xs font-medium text-slate-500 hover:text-slate-800">
                View example call (scripted)
              </summary>
              <div className="mt-3 max-h-64 overflow-y-auto">
                <ScriptedTurns transcript={transcript} />
              </div>
            </details>
          )}
        </div>
      ) : (
        <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
          {!hasScriptedTranscript ? (
            <p className="text-sm text-slate-500">
              No scripted call for this case yet — documentation practice only.
            </p>
          ) : transcript.length === 0 ? (
            <p className="text-sm text-slate-500">Transcript is empty.</p>
          ) : (
            <ScriptedTurns transcript={transcript} />
          )}
        </div>
      )}
    </div>
  );
}
