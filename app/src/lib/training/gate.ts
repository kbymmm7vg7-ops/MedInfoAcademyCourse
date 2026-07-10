// Training & Orientation gate (PRD §5.0): the Case Simulator and the
// certification track are locked until every required training module is
// complete. Server-side check — UI hiding alone is not the gate.
//
// The gate counts the SHADOWED module set (shared bank with the user's org
// copies swapped in — lib/training/modules.ts): completion is tracked against
// the module row the trainee actually sees, so an org-tailored copy of a
// required module gates by the org copy's id, not the shared original's.
import type { SupabaseClient } from "@supabase/supabase-js";
import { loadTrainingModules } from "@/lib/training/modules";

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
  const modules = await loadTrainingModules(supabase, userId);
  const required = modules.filter((m) => m.required);
  if (required.length === 0) {
    // No seeded modules yet — do not lock trainees out of the simulator.
    return { complete: true, requiredCount: 0, completedCount: 0, incompleteSlugs: [] };
  }

  const incomplete = required.filter((m) => m.completedAt === null);
  return {
    complete: incomplete.length === 0,
    requiredCount: required.length,
    completedCount: required.length - incomplete.length,
    incompleteSlugs: incomplete.map((m) => m.slug),
  };
}
