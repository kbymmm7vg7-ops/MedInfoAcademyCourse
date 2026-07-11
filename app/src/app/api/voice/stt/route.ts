import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { authorizeVoiceRequest } from "@/lib/voice/guard";
import { getStt } from "@/lib/voice/config";

// POST /api/voice/stt — one VAD-chunked utterance → transcript text.
// multipart/form-data: { instanceId: string, audio: File }
// Returns { text, ms } (ms = vendor call latency, for the <3s budget).
const MAX_AUDIO_BYTES = 6 * 1024 * 1024; // ~60s of opus at voice bitrates

export async function POST(request: Request) {
  const supabase = await createClient();

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "Expected multipart form data" }, { status: 400 });
  }

  const instanceId = typeof form.get("instanceId") === "string" ? (form.get("instanceId") as string) : null;
  const guard = await authorizeVoiceRequest(supabase, instanceId);
  if (!guard.ok) return NextResponse.json({ error: guard.error }, { status: guard.status });

  const audio = form.get("audio");
  if (!(audio instanceof File) || audio.size === 0) {
    return NextResponse.json({ error: "audio file is required" }, { status: 400 });
  }
  if (audio.size > MAX_AUDIO_BYTES) {
    return NextResponse.json({ error: "Audio segment too large" }, { status: 413 });
  }

  try {
    const stt = getStt();
    const result = await stt.transcribe({
      data: await audio.arrayBuffer(),
      mimeType: audio.type || "audio/webm",
      filename: audio.name || "utterance.webm",
    });
    console.log(
      `[voice] stt instance=${instanceId} vendor=${result.vendor} ms=${result.ms} chars=${result.text.length}`
    );
    return NextResponse.json({ text: result.text, ms: result.ms });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "STT error";
    const isConfig = msg.includes("GROQ_API_KEY");
    console.error(`[voice] stt error instance=${instanceId}: ${msg}`);
    return NextResponse.json(
      { error: isConfig ? msg : "Could not transcribe that — try again." },
      { status: isConfig ? 503 : 502 }
    );
  }
}
