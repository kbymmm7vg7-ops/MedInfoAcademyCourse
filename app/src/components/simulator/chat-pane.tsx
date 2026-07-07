"use client";

import { useRef, useState } from "react";
import type { TranscriptTurn } from "@/lib/simulator/types";

type ChatMessage = TranscriptTurn & { id: string };

let idCounter = 0;
function nextId(): string {
  idCounter += 1;
  return `turn-${idCounter}`;
}

function toChatMessages(turns: TranscriptTurn[]): ChatMessage[] {
  return turns.map((t) => ({ ...t, id: nextId() }));
}

/**
 * Live persona chat — phone-call style. Trainee speaks first (the trainee is
 * the one answering the line), then each sent message round-trips through
 * POST /api/persona/turn.
 */
export function ChatPane({
  instanceId,
  initialTurns,
  disabled = false,
  productLabel,
}: {
  instanceId: string;
  initialTurns: TranscriptTurn[];
  disabled?: boolean;
  productLabel: string | null;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>(() => toChatMessages(initialTurns));
  const [draft, setDraft] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  function scrollToBottom() {
    requestAnimationFrame(() => {
      const el = scrollRef.current;
      if (el) el.scrollTop = el.scrollHeight;
    });
  }

  async function send() {
    const text = draft.trim();
    if (!text || isSending || disabled) return;

    setError(null);
    const optimistic: ChatMessage = { id: nextId(), speaker: "trainee", content: text };
    setMessages((prev) => [...prev, optimistic]);
    setDraft("");
    setIsSending(true);
    scrollToBottom();

    try {
      const res = await fetch("/api/persona/turn", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ instanceId, message: text }),
      });
      const data = (await res.json().catch(() => ({}))) as { reply?: string; error?: string };

      if (!res.ok || data.error) {
        setError(data.error ?? "The caller connection dropped — try again.");
        return;
      }

      setMessages((prev) => [
        ...prev,
        { id: nextId(), speaker: "persona", content: data.reply ?? "" },
      ]);
      scrollToBottom();
    } catch {
      setError("The caller connection dropped — try again.");
    } finally {
      setIsSending(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void send();
    }
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 border-b border-slate-200 bg-emerald-50 px-4 py-2.5">
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-600" />
        </span>
        <p className="text-sm font-medium text-emerald-900">
          Live call — {productLabel ?? "product"} inquiry
        </p>
      </div>

      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
        {messages.length === 0 ? (
          <p className="text-sm text-slate-500">
            Answer the line — greet the caller to begin.
          </p>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.speaker === "trainee" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                  msg.speaker === "trainee"
                    ? "bg-blue-700 text-white"
                    : "bg-slate-100 text-slate-800"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))
        )}

        {isSending && (
          <div className="flex justify-start">
            <div className="flex items-center gap-1 rounded-lg bg-slate-100 px-3 py-2 text-sm text-slate-500">
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.2s]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.1s]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400" />
            </div>
          </div>
        )}

        {error && (
          <div className="flex items-center justify-between gap-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
            <span>{error}</span>
            <button
              type="button"
              onClick={() => setError(null)}
              aria-label="Dismiss error"
              className="text-red-500 hover:text-red-800"
            >
              ×
            </button>
          </div>
        )}
      </div>

      {!disabled && (
        <div className="border-t border-slate-200 px-4 py-3">
          <div className="flex items-end gap-2">
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isSending}
              rows={2}
              placeholder="Type your response… (Enter to send, Shift+Enter for a new line)"
              className="flex-1 resize-none rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none disabled:opacity-60"
            />
            <button
              type="button"
              disabled={isSending || !draft.trim()}
              onClick={() => void send()}
              className="rounded-md bg-blue-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
