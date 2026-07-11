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
  readOnly = false,
  onStartVoice,
  voiceError = null,
}: {
  instanceId: string;
  transcript: TranscriptTurn[];
  hasScriptedTranscript: boolean;
  hasLivePersona: boolean;
  conversationTurns: TranscriptTurn[];
  productLabel: string | null;
  readOnly?: boolean;
  /** present when this case supports voice mode — mic permission is requested
   *  inside this handler (at the Start click, per the voice spec) */
  onStartVoice?: () => void;
  voiceError?: string | null;
}) {
  return (
    <div className="flex h-full flex-col border-r border-slate-200">
      <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
        <div className="flex items-center gap-3">
          <h2 className="text-sm font-semibold text-slate-900">
            {hasLivePersona ? "Call" : "Call transcript"}
          </h2>
          {onStartVoice && (
            <button
              type="button"
              onClick={onStartVoice}
              className="flex items-center gap-1.5 rounded-md bg-emerald-700 px-3 py-1 text-xs font-medium text-white transition-colors hover:bg-emerald-600"
            >
              <svg aria-hidden viewBox="0 0 16 16" className="h-3 w-3 fill-current">
                <path d="M8 1a2.5 2.5 0 0 0-2.5 2.5v4a2.5 2.5 0 0 0 5 0v-4A2.5 2.5 0 0 0 8 1Z" />
                <path d="M3.5 7.5a.5.5 0 0 1 1 0 3.5 3.5 0 0 0 7 0 .5.5 0 0 1 1 0 4.5 4.5 0 0 1-4 4.473V14h2a.5.5 0 0 1 0 1h-5a.5.5 0 0 1 0-1h2v-2.027a4.5 4.5 0 0 1-4-4.473Z" />
              </svg>
              Start voice call
            </button>
          )}
        </div>
      </div>

      {voiceError && (
        <p className="border-b border-amber-200 bg-amber-50 px-4 py-2 text-xs text-amber-800">
          {voiceError}
        </p>
      )}

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
