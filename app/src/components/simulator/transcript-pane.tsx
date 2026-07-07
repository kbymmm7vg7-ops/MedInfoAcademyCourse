"use client";

import type { TranscriptTurn } from "@/lib/simulator/types";

export function TranscriptPane({
  transcript,
  hasScriptedTranscript,
  openBook,
  onToggleOpenBook,
}: {
  transcript: TranscriptTurn[];
  hasScriptedTranscript: boolean;
  openBook: boolean;
  onToggleOpenBook: () => void;
}) {
  return (
    <div className="flex h-full flex-col border-r border-slate-200">
      <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
        <h2 className="text-sm font-semibold text-slate-900">Call transcript</h2>
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

      <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
        {!hasScriptedTranscript ? (
          <p className="text-sm text-slate-500">
            No scripted call for this case yet — documentation practice only.
          </p>
        ) : transcript.length === 0 ? (
          <p className="text-sm text-slate-500">Transcript is empty.</p>
        ) : (
          transcript.map((turn, i) => (
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
          ))
        )}
      </div>
    </div>
  );
}
