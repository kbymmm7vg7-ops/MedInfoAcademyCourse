"use server";

// Training & Orientation server actions. The gate itself (getTrainingGate)
// lives in ./gate.ts and is not modified here — this file only handles
// marking a module complete for the current user.

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type MarkCompleteResult = { ok: true } | { ok: false; error: string };

/**
 * Marks a training module complete for the current user. Idempotent: a
 * unique(user_id, module_id) constraint backs this, so a repeat submission
 * (e.g. "Read again") is a harmless no-op rather than an error.
 */
export async function markModuleComplete(moduleId: string, slug: string): Promise<MarkCompleteResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { error } = await supabase
    .from("user_training_progress")
    .upsert(
      { user_id: user.id, module_id: moduleId, completed_at: new Date().toISOString() },
      { onConflict: "user_id,module_id", ignoreDuplicates: true }
    );

  if (error) {
    return { ok: false, error: error.message };
  }

  revalidatePath("/training");
  revalidatePath(`/training/${slug}`);
  return { ok: true };
}
