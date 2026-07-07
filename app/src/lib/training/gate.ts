// Training & Orientation gate (PRD §5.0): the Case Simulator and the
// certification track are locked until every required training module is
// complete. Server-side check — UI hiding alone is not the gate.
import type { SupabaseClient } from "@supabase/supabase-js";

export type TrainingGate = {
  complete: boolean;
  requiredCount: number;
  completedCount: number;
  incompleteSlugs: string[];
};

export async function getTrainingGate(
  supabase: SupabaseClient,
  userId: string
): Promise<TrainingGate> {
  const { data: modules } = await supabase
    .from("training_modules")
    .select("id, slug, required")
    .is("org_id", null)
    .eq("required", true);

  const required = (modules ?? []) as { id: string; slug: string | null; required: boolean }[];
  if (required.length === 0) {
    // No seeded modules yet — do not lock trainees out of the simulator.
    return { complete: true, requiredCount: 0, completedCount: 0, incompleteSlugs: [] };
  }

  const { data: progress } = await supabase
    .from("user_training_progress")
    .select("module_id")
    .eq("user_id", userId);

  const done = new Set(((progress ?? []) as { module_id: string }[]).map((p) => p.module_id));
  const incomplete = required.filter((m) => !done.has(m.id));
  return {
    complete: incomplete.length === 0,
    requiredCount: required.length,
    completedCount: required.length - incomplete.length,
    incompleteSlugs: incomplete.map((m) => m.slug ?? m.id),
  };
}
