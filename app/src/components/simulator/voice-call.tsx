"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { TranscriptTurn } from "@/lib/simulator/types";
import { advanceVad, createVadState, type VadState } from "@/lib/voice/vad";
import { splitForTts } from "@/lib/voice/sentences";

// Voice call strip (PRD §5.1a layout: large documentation panel + small
// caption strip — the full transcript pane is not shown during a call).
// Pipeline per utterance: VAD end-of-utterance → /api/voice/stt →
// /api/persona/turn → /api/voice/tts → audio out + CC. Half-duplex: the mic
// is not analyzed while the persona is thinking/speaking, so speaker output
// cannot re-enter the pipeline.

type Phase = "connecting" | "listening" | "transcribing" | "thinking" | "speaking" | "ended";

type TurnLatency = {
  sttMs: number;
  personaMs: number;
  ttsMs: number;
  totalMs: number; // utterance end → persona audio playback start
};

type Caption = { id: number; speaker: "trainee" | "persona"; text: string };

const VAD_TICK_MS = 50;
/** restart the recorder if nobody has spoken for this long, so a long silence
 *  never accumulates into the next utterance's upload */
const SILENCE_RECYCLE_MS = 20_000;

function pickRecorderMime(): string | undefined {
  if (typeof MediaRecorder === "undefined") return undefined;
  for (const t of ["audio/webm;codecs=opus", "audio/webm", "audio/mp4"]) {
    if (MediaRecorder.isTypeSupported(t)) return t;
  }
  return undefined;
}

export function VoiceCall({
  instanceId,
  productLabel,
  background,
  onEnd,
}: {
  instanceId: string;
  productLabel: string | null;
  /** client-safe contact_prefill.background — selects the persona voice */
  background: string | null;
  /** called when the trainee ends the call, with the turns spoken during it
   *  (already persisted server-side by /api/persona/turn) */
  onEnd: (voiceTurns: TranscriptTurn[]) => void;
}) {
  const [phase, setPhase] = useState<Phase>("connecting");
  const [muted, setMuted] = useState(false);
  const [captions, setCaptions] = useState<Caption[]>([]);
  const [latency, setLatency] = useState<TurnLatency | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [level, setLevel] = useState(0);

  const streamRef = useRef<MediaStream | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const recorderMimeRef = useRef<string | undefined>(undefined);
  const vadRef = useRef<VadState>(createVadState());
  const tickerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastSpeechAtRef = useRef<number>(Date.now());
  const activeSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const endedRef = useRef(false);
  const captionIdRef = useRef(0);
  const latenciesRef = useRef<TurnLatency[]>([]);
  const committedTurnsRef = useRef<TranscriptTurn[]>([]);
  const phaseRef = useRef<Phase>("connecting");
  const mutedRef = useRef(false);

  phaseRef.current = phase;
  mutedRef.current = muted;

  const pushCaption = useCallback((speaker: "trainee" | "persona", text: string) => {
    captionIdRef.current += 1;
    const id = captionIdRef.current;
    setCaptions((prev) => [...prev.slice(-7), { id, speaker, text }]);
  }, []);

  const startRecorder = useCallback(() => {
    const stream = streamRef.current;
    if (!stream || endedRef.current) return;
    chunksRef.current = [];
    const mime = recorderMimeRef.current;
    const rec = new MediaRecorder(stream, mime ? { mimeType: mime } : undefined);
    rec.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };
    rec.start(250);
    recorderRef.current = rec;
  }, []);

  const stopRecorder = useCallback((): Promise<Blob | null> => {
    const rec = recorderRef.current;
    recorderRef.current = null;
    if (!rec || rec.state === "inactive") return Promise.resolve(null);
    return new Promise((resolve) => {
      rec.onstop = () => {
        const mime = rec.mimeType || "audio/webm";
        const blob = new Blob(chunksRef.current, { type: mime });
        chunksRef.current = [];
        resolve(blob.size > 0 ? blob : null);
      };
      rec.stop();
    });
  }, []);

  const resumeListening = useCallback(() => {
    if (endedRef.current) return;
    vadRef.current = createVadState();
    lastSpeechAtRef.current = Date.now();
    startRecorder();
    setPhase("listening");
  }, [startRecorder]);

  /** Plays one audio blob to completion via WebAudio. HTMLAudioElement.play()
   *  needs transient user activation, which LAPSES mid-call — Chrome then
   *  throws NotAllowedError on later replies (the original S5 E2E bug). The
   *  AudioContext opened at the Start click stays running and needs no
   *  per-play activation. Resolves (never rejects) so queued sentence chunks
   *  always advance even if one decode fails. */
  const playAudioBlob = useCallback(async (blob: Blob) => {
    const ctx = audioCtxRef.current;
    if (!ctx || endedRef.current) return;
    try {
      if (ctx.state === "suspended") await ctx.resume();
      const audioBuf = await ctx.decodeAudioData(await blob.arrayBuffer());
      await new Promise<void>((resolve) => {
        const src = ctx.createBufferSource();
        src.buffer = audioBuf;
        src.connect(ctx.destination);
        activeSourceRef.current = src;
        const startedAt = Date.now();
        src.onended = () => {
          if (activeSourceRef.current === src) activeSourceRef.current = null;
          console.log(
            `[voice] playback ended after ${((Date.now() - startedAt) / 1000).toFixed(1)}s ` +
              `(duration=${audioBuf.duration.toFixed(1)}s, bytes=${blob.size})`
          );
          resolve();
        };
        console.log(`[voice] playback started (duration=${audioBuf.duration.toFixed(1)}s, bytes=${blob.size})`);
        src.start();
      });
    } catch (err) {
      console.warn("[voice] playback failed:", err);
    }
  }, []);

  const processUtterance = useCallback(
    async (blob: Blob, utteranceEndedAt: number) => {
      setPhase("transcribing");
      setError(null);
      try {
        // 1. STT
        const form = new FormData();
        form.append("instanceId", instanceId);
        const ext = blob.type.includes("mp4") ? "mp4" : "webm";
        form.append("audio", new File([blob], `utterance.${ext}`, { type: blob.type }));
        const sttStarted = Date.now();
        const sttRes = await fetch("/api/voice/stt", { method: "POST", body: form });
        const sttData = (await sttRes.json().catch(() => ({}))) as { text?: string; error?: string };
        if (!sttRes.ok) throw new Error(sttData.error ?? "Transcription failed");
        const sttMs = Date.now() - sttStarted;
        const text = (sttData.text ?? "").trim();
        if (text.length < 2) {
          // Silence/noise transcribed to nothing — just keep listening.
          resumeListening();
          return;
        }
        pushCaption("trainee", text);

        // 2. Persona reasoning
        setPhase("thinking");
        const personaStarted = Date.now();
        const turnRes = await fetch("/api/persona/turn", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ instanceId, message: text }),
        });
        const turnData = (await turnRes.json().catch(() => ({}))) as {
          reply?: string;
          error?: string;
        };
        if (!turnRes.ok || !turnData.reply) {
          throw new Error(turnData.error ?? "The caller connection dropped — try again.");
        }
        const personaMs = Date.now() - personaStarted;
        const reply = turnData.reply;
        // CC strip shows the exact text sent to TTS (spec §Captions).
        pushCaption("persona", reply);
        committedTurnsRef.current.push(
          { speaker: "trainee", content: text },
          { speaker: "persona", content: reply }
        );

        // 3. TTS + playback — streamed sentence-by-sentence: perceived
        // silence ends at the FIRST sentence's audio, and later chunks are
        // fetched while earlier ones play (spec §Turn-taking, <3s budget).
        setPhase("speaking");
        const chunks = splitForTts(reply);
        let queue: Promise<void> = Promise.resolve();

        for (let i = 0; i < chunks.length; i++) {
          if (endedRef.current) return;
          const chunkStarted = Date.now();
          const ttsRes = await fetch("/api/voice/tts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ instanceId, text: chunks[i], background }),
          });
          if (!ttsRes.ok) {
            const ttsErr = (await ttsRes.json().catch(() => ({}))) as { error?: string };
            // Audio failed but the exchange happened — captions carry the turn.
            setError(ttsErr.error ?? "Audio unavailable for part of that reply — see captions.");
            break;
          }
          const audioBlob = await ttsRes.blob();
          if (i === 0) {
            const turnLatency: TurnLatency = {
              sttMs,
              personaMs,
              ttsMs: Date.now() - chunkStarted,
              totalMs: Date.now() - utteranceEndedAt,
            };
            latenciesRef.current.push(turnLatency);
            setLatency(turnLatency);
            console.log("[voice-latency]", { instanceId, ...turnLatency });
          }
          queue = queue.then(() => (endedRef.current ? undefined : playAudioBlob(audioBlob)));
        }
        await queue;
        resumeListening();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong — try again.");
        resumeListening();
      }
    },
    [background, instanceId, playAudioBlob, pushCaption, resumeListening]
  );

  const handleVadTick = useCallback(() => {
    if (endedRef.current || phaseRef.current !== "listening") return;
    const analyser = analyserRef.current;
    if (!analyser) return;

    const buf = new Float32Array(analyser.fftSize);
    analyser.getFloatTimeDomainData(buf);
    let sum = 0;
    for (let i = 0; i < buf.length; i++) sum += buf[i] * buf[i];
    const rms = Math.sqrt(sum / buf.length);
    setLevel(rms);

    if (mutedRef.current) return;

    const now = Date.now();
    const { state, event } = advanceVad(vadRef.current, rms, now);
    vadRef.current = state;

    if (event === "speech-start") {
      lastSpeechAtRef.current = now;
    } else if (event === "utterance-end") {
      void stopRecorder().then((blob) => {
        if (blob) void processUtterance(blob, now);
        else resumeListening();
      });
    } else if (event === "noise-blip") {
      // Drop the segment; restart so stray noise never pads the next upload.
      void stopRecorder().then(() => resumeListening());
    } else if (!state.speaking && now - lastSpeechAtRef.current > SILENCE_RECYCLE_MS) {
      lastSpeechAtRef.current = now;
      void stopRecorder().then(() => resumeListening());
    }
  }, [processUtterance, resumeListening, stopRecorder]);

  // Mount: acquire the mic (permission was granted at the Start click that
  // rendered this component), wire WebAudio + recorder + VAD ticker.
  useEffect(() => {
    endedRef.current = false;
    let cancelled = false;

    async function init() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
        });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        recorderMimeRef.current = pickRecorderMime();

        const ctx = new AudioContext();
        audioCtxRef.current = ctx;
        const source = ctx.createMediaStreamSource(stream);
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 1024;
        source.connect(analyser);
        analyserRef.current = analyser;

        resumeListening();
        tickerRef.current = setInterval(handleVadTick, VAD_TICK_MS);
      } catch {
        setError("Microphone unavailable — you can continue this case by text.");
        setPhase("ended");
      }
    }
    void init();

    return () => {
      cancelled = true;
      endedRef.current = true;
      if (tickerRef.current) clearInterval(tickerRef.current);
      try {
      activeSourceRef.current?.stop();
    } catch {
      // already stopped
    }
      const rec = recorderRef.current;
      if (rec && rec.state !== "inactive") rec.stop();
      streamRef.current?.getTracks().forEach((t) => t.stop());
      void audioCtxRef.current?.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function endCall() {
    endedRef.current = true;
    if (tickerRef.current) clearInterval(tickerRef.current);
    try {
      activeSourceRef.current?.stop();
    } catch {
      // already stopped
    }
    const rec = recorderRef.current;
    if (rec && rec.state !== "inactive") rec.stop();
    streamRef.current?.getTracks().forEach((t) => t.stop());
    void audioCtxRef.current?.close();
    const all = latenciesRef.current;
    if (all.length > 0) {
      const avg = Math.round(all.reduce((s, l) => s + l.totalMs, 0) / all.length);
      const max = Math.max(...all.map((l) => l.totalMs));
      console.log("[voice-latency] call summary", { instanceId, turns: all.length, avgMs: avg, maxMs: max });
    }
    setPhase("ended");
    onEnd(committedTurnsRef.current);
  }

  const phaseLabel: Record<Phase, string> = {
    connecting: "Connecting…",
    listening: muted ? "Muted" : "Listening",
    transcribing: "Transcribing…",
    thinking: "Caller is responding…",
    speaking: "Caller speaking",
    ended: "Call ended",
  };

  const lastPersona = [...captions].reverse().find((c) => c.speaker === "persona");
  const lastTrainee = [...captions].reverse().find((c) => c.speaker === "trainee");

  return (
    <div className="border-b border-slate-200 bg-slate-900 px-4 py-3 text-slate-100">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            {phase !== "ended" && (
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            )}
            <span
              className={`relative inline-flex h-2.5 w-2.5 rounded-full ${
                phase === "ended" ? "bg-slate-500" : "bg-emerald-400"
              }`}
            />
          </span>
          <span className="text-sm font-medium">
            Voice call — {productLabel ?? "product"} inquiry
          </span>
          <span className="rounded-full bg-slate-700 px-2 py-0.5 text-xs text-slate-300">
            {phaseLabel[phase]}
          </span>
          {phase === "listening" && !muted && (
            <span
              aria-hidden
              className="ml-1 inline-block h-3 w-16 overflow-hidden rounded-full bg-slate-700"
            >
              <span
                className="block h-full rounded-full bg-emerald-400 transition-[width] duration-75"
                style={{ width: `${Math.min(100, Math.round(level * 900))}%` }}
              />
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {latency && (
            <span
              className={`rounded-full px-2 py-0.5 text-xs ${
                latency.totalMs <= 3000 ? "bg-emerald-900 text-emerald-300" : "bg-amber-900 text-amber-300"
              }`}
              title={`STT ${latency.sttMs}ms · persona ${latency.personaMs}ms · TTS ${latency.ttsMs}ms`}
            >
              {(latency.totalMs / 1000).toFixed(1)}s turn
            </span>
          )}
          <button
            type="button"
            onClick={() => setMuted((m) => !m)}
            disabled={phase === "ended"}
            className="rounded-md border border-slate-600 px-3 py-1 text-xs font-medium text-slate-200 hover:bg-slate-800 disabled:opacity-50"
          >
            {muted ? "Unmute" : "Mute"}
          </button>
          <button
            type="button"
            onClick={endCall}
            className="rounded-md bg-red-600 px-3 py-1 text-xs font-medium text-white hover:bg-red-500"
          >
            End call
          </button>
        </div>
      </div>

      {/* CC strip — renders the exact text sent to TTS */}
      <div className="mt-2 space-y-1" aria-live="polite">
        {lastTrainee && (
          <p className="truncate text-xs text-slate-400">
            <span className="font-semibold text-slate-300">You:</span> {lastTrainee.text}
          </p>
        )}
        {lastPersona && (
          <p className="text-sm text-slate-100">
            <span className="font-semibold text-emerald-300">Caller:</span> {lastPersona.text}
          </p>
        )}
        {!lastTrainee && !lastPersona && phase !== "ended" && (
          <p className="text-xs text-slate-400">
            Answer the line — greet the caller to begin. Captions appear here.
          </p>
        )}
      </div>

      {error && (
        <div className="mt-2 flex items-center justify-between gap-2 rounded-md border border-red-800 bg-red-950 px-3 py-1.5 text-xs text-red-300">
          <span>{error}</span>
          <button
            type="button"
            onClick={() => setError(null)}
            aria-label="Dismiss error"
            className="text-red-400 hover:text-red-200"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}
