"use server";

// Certification/practice sitting actions (spec_certification-logic.md).
// The pure gate logic lives in ./logic.ts; these actions only fetch rows,
// call the pure functions, and write the outcome.

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getTrainingGate } from "@/lib/training/gate";
import { generateVariant } from "@/lib/cert/variant-engine";
import {
  canStartCertAttempt,
  nextVariantOrdinal,
  certProgress,
  type AttemptRow,
} from "@/lib/cert/logic";

export type SittingType = "practice" | "certification";

async function loadAttempts(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string
): Promise<AttemptRow[]> {
  const { data } = await supabase
    .from("accreditation_attempts")
    .select("case_template_id, attempt_type, is_first_attempt_on_case, pass_bool, variant_ref, completed_at")
    .eq("user_id", userId);
  return (data ?? []) as AttemptRow[];
}

export async function startSitting(templateId: string, type: SittingType): Promise<never> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const gate = await getTrainingGate(supabase, user.id);
  if (!gate.complete) redirect("/training?locked=1");

  const attempts = await loadAttempts(supabase, user.id);

  if (type === "certification") {
    const check = canStartCertAttempt(attempts, templateId);
    if (!check.ok) redirect(`/accreditation?blocked=${encodeURIComponent(check.reason ?? "")}`);
  }

  const { data: template } = await supabase
    .from("case_templates")
    .select("id")
    .eq("id", templateId)
    .maybeSingle<{ id: string }>();
  if (!template) redirect("/accreditation?blocked=Case%20not%20found");

  // Requester type steers the variant's address format; read it server-side
  // via the queue-safe path (ground truth requester type never reaches the
  // client — here it stays server-side inside the variant generator inputs).
  const { data: gtRow } = await supabase
    .from("case_templates")
    .select("ground_truth_json")
    .eq("id", templateId)
    .maybeSingle<{ ground_truth_json: { requester?: { type?: string } } | null }>();
  const requesterType = gtRow?.ground_truth_json?.requester?.type;

  const ordinal = nextVariantOrdinal(attempts, templateId);
  const variant = generateVariant({
    userId: user.id,
    templateId,
    ordinal,
    requesterType,
    closedBook: type === "certification",
  });

  const { data: userRow } = await supabase
    .from("users")
    .select("org_id")
    .eq("id", user.id)
    .maybeSingle<{ org_id: string | null }>();

  const { data: instance, error: instanceError } = await supabase
    .from("case_instances")
    .insert({
      template_id: templateId,
      user_id: user.id,
      org_id: userRow?.org_id ?? null,
      status: "in_progress",
      channel: "chat",
      variant_snapshot_json: variant,
      started_at: new Date().toISOString(),
    })
    .select("id")
    .single<{ id: string }>();
  if (instanceError || !instance) redirect("/accreditation?blocked=Could%20not%20start%20sitting");

  const isFirstCertAttempt =
    type === "certification" &&
    !attempts.some((a) => a.attempt_type === "certification" && a.case_template_id === templateId);

  const { error: attemptError } = await supabase.from("accreditation_attempts").insert({
    user_id: user.id,
    case_template_id: templateId,
    attempt_type: type,
    is_first_attempt_on_case: isFirstCertAttempt,
    variant_ref: variant.seed,
  });
  if (attemptError) redirect("/accreditation?blocked=Could%20not%20record%20attempt");

  redirect(`/simulator/case/${instance.id}`);
}

export type AccreditationOverview = {
  progress: ReturnType<typeof certProgress>;
  attempts: AttemptRow[];
  trainingComplete: boolean;
  locked: boolean;
  lockedAt: string | null;
};

export async function loadAccreditationOverview(): Promise<AccreditationOverview | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const [attempts, gate, lockRow] = await Promise.all([
    loadAttempts(supabase, user.id),
    getTrainingGate(supabase, user.id),
    supabase
      .from("certification_locks")
      .select("locked_at")
      .eq("user_id", user.id)
      .maybeSingle<{ locked_at: string }>()
      .then((r) => r.data),
  ]);

  const progress = certProgress(attempts);
  return {
    progress,
    attempts,
    trainingComplete: gate.complete,
    locked: progress.locked || lockRow != null,
    lockedAt: lockRow?.locked_at ?? null,
  };
}
