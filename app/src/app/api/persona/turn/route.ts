import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { buildPersonaSystemPromptForTemplate } from "@/lib/simulator/case-brief";
import type { VariantSnapshot } from "@/lib/cert/variant-engine";
import { runPersonaTurn, MAX_TURNS_PER_INSTANCE, type ChatTurn } from "@/lib/persona/engine";
import { isDeactivated, fetchDeactivatedAt, DEACTIVATED_MESSAGE } from "@/lib/auth/deactivation";

// POST /api/persona/turn — one live persona exchange.
// Body: { instanceId: string, message: string }
// Persists both turns to conversation_turns; returns { reply }.
export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  // The proxy already blocks deactivated users on the middleware pass, but
  // this route is re-checked directly too — same defense-in-depth posture
  // as the (app) layout — so it fails closed even if invoked in a context
  // that bypassed the proxy.
  if (isDeactivated(await fetchDeactivatedAt(supabase, user.id))) {
    return NextResponse.json({ error: DEACTIVATED_MESSAGE }, { status: 403 });
  }

  let body: { instanceId?: unknown; message?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const instanceId = typeof body.instanceId === "string" ? body.instanceId : null;
  const message = typeof body.message === "string" ? body.message.trim() : "";
  if (!instanceId || !message) {
    return NextResponse.json({ error: "instanceId and message are required" }, { status: 400 });
  }
  if (message.length > 2000) {
    return NextResponse.json({ error: "Message too long" }, { status: 400 });
  }

  const { data: instance } = await supabase
    .from("case_instances")
    .select("id, template_id, user_id, status, variant_snapshot_json")
    .eq("id", instanceId)
    .maybeSingle<{
      id: string;
      template_id: string;
      user_id: string;
      status: string;
      variant_snapshot_json: unknown;
    }>();

  if (!instance || instance.user_id !== user.id) {
    return NextResponse.json({ error: "Case not found" }, { status: 404 });
  }
  if (instance.status !== "in_progress" && instance.status !== "documenting") {
    return NextResponse.json({ error: "Case is not active" }, { status: 409 });
  }

  const { data: turns } = await supabase
    .from("conversation_turns")
    .select("speaker, content")
    .eq("case_instance_id", instanceId)
    .order("ts", { ascending: true });

  const history: ChatTurn[] = (turns ?? []) as ChatTurn[];
  if (history.length >= MAX_TURNS_PER_INSTANCE) {
    return NextResponse.json(
      { error: "Turn limit reached for this case — submit your documentation." },
      { status: 429 }
    );
  }

  const systemPrompt = await buildPersonaSystemPromptForTemplate(
    supabase,
    instance.template_id,
    (instance.variant_snapshot_json as VariantSnapshot | null) ?? null
  );
  if (!systemPrompt) {
    return NextResponse.json({ error: "This case has no live persona" }, { status: 422 });
  }

  let reply: string;
  try {
    reply = await runPersonaTurn({ systemPrompt, history, traineeMessage: message, graded: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Persona engine error";
    // Surface the missing-key case clearly in dev; keep generic otherwise.
    const isConfig = msg.includes("ANTHROPIC_API_KEY");
    return NextResponse.json(
      { error: isConfig ? msg : "The caller connection dropped — try again." },
      { status: isConfig ? 503 : 502 }
    );
  }

  const { error: insertError } = await supabase.from("conversation_turns").insert([
    { case_instance_id: instanceId, speaker: "trainee", content: message },
    { case_instance_id: instanceId, speaker: "persona", content: reply },
  ]);
  if (insertError) {
    return NextResponse.json({ error: "Failed to record the exchange" }, { status: 500 });
  }

  return NextResponse.json({ reply });
}
