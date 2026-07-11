import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { authorizeVoiceRequest } from "@/lib/voice/guard";
import { getTts, resolveTtsVendor, voiceForBackground } from "@/lib/voice/config";

// POST /api/voice/tts — persona reply text → audio. The CC strip renders the
// exact text sent here (spec §Captions: no separate transcription pass).
// Body: { instanceId, text, background?, vendor? }
//  - background: client-safe contact_prefill.background, selects the voiceId
//  - vendor: "elevenlabs" honored only for the one-shot A/B (key must be set)
const MAX_TTS_CHARS = 1500;

export async function POST(request: Request) {
  const supabase = await createClient();

  let body: { instanceId?: unknown; text?: unknown; background?: unknown; vendor?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const instanceId = typeof body.instanceId === "string" ? body.instanceId : null;
  const guard = await authorizeVoiceRequest(supabase, instanceId);
  if (!guard.ok) return NextResponse.json({ error: guard.error }, { status: guard.status });

  const text = typeof body.text === "string" ? body.text.trim() : "";
  if (!text) return NextResponse.json({ error: "text is required" }, { status: 400 });
  if (text.length > MAX_TTS_CHARS) {
    return NextResponse.json({ error: "Text too long for a single utterance" }, { status: 400 });
  }

  const vendor = resolveTtsVendor(typeof body.vendor === "string" ? body.vendor : null);
  const background = typeof body.background === "string" ? body.background : null;
  const voiceId = voiceForBackground(vendor, background);

  try {
    const tts = getTts(vendor);
    const result = await tts.synthesize(text, voiceId);
    console.log(
      `[voice] tts instance=${instanceId} vendor=${result.vendor} voice=${result.voiceId} ms=${result.ms} chars=${text.length}`
    );
    return new NextResponse(result.audio, {
      status: 200,
      headers: {
        "Content-Type": result.mimeType,
        "Cache-Control": "no-store",
        "X-Voice-Vendor": result.vendor,
        "X-Voice-Id": result.voiceId,
        "X-Voice-Ms": String(result.ms),
      },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "TTS error";
    const isConfig = msg.includes("API_KEY");
    console.error(`[voice] tts error instance=${instanceId}: ${msg}`);
    return NextResponse.json(
      { error: isConfig ? msg : "Could not synthesize audio — captions remain available." },
      { status: isConfig ? 503 : 502 }
    );
  }
}
