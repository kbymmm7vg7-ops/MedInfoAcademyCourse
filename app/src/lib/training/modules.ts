import type { SupabaseClient } from "@supabase/supabase-js";

// Client-safe row shapes for training module listing/reading.
//
// Org shadowing (spec §4.1): trainees see the shared bank (org_id is null)
// plus their own org's tailored rows. An org row REPLACES the shared row
// with the same slug (an org-tailored copy shadows the shared original, in
// the shared row's position); an org row with a slug that doesn't match any
// shared module is a net-new module, appended after the shared bank in the
// org's own order_index order. This merged/shadowed list is the one true set
// trainees train against and the one the training gate (lib/training/gate.ts)
// counts required modules from — do not read training_modules directly for
// trainee-facing or gating purposes; use these loaders.

export type TrainingModuleRow = {
  id: string;
  slug: string;
  title: string;
  estMinutes: number | null;
  required: boolean;
  orderIndex: number;
  contentMd: string;
  completedAt: string | null;
};

type ModuleDbRow = {
  id: string;
  slug: string | null;
  title: string;
  content_md: string | null;
  required: boolean;
  est_minutes: number | null;
  order_index: number;
};

type ProgressDbRow = {
  module_id: string;
  completed_at: string;
};

const MODULE_COLUMNS = "id, slug, title, content_md, required, est_minutes, order_index";

/**
 * Merges the shared bank with a user's org rows: an org row shadows the
 * shared row with the same slug (replacing it in place, in the shared row's
 * position); an org row with a new slug is appended after the shared bank,
 * ordered by its own order_index among other net-new org rows.
 */
async function loadShadowedModuleRows(
  supabase: SupabaseClient,
  userId: string
): Promise<ModuleDbRow[]> {
  const { data: userRow } = await supabase
    .from("users")
    .select("org_id")
    .eq("id", userId)
    .maybeSingle<{ org_id: string | null }>();
  const orgId = userRow?.org_id ?? null;

  const { data: sharedModules } = await supabase
    .from("training_modules")
    .select(MODULE_COLUMNS)
    .is("org_id", null)
    .order("order_index", { ascending: true });
  const shared = (sharedModules ?? []) as ModuleDbRow[];

  let orgModules: ModuleDbRow[] = [];
  if (orgId) {
    const { data } = await supabase
      .from("training_modules")
      .select(MODULE_COLUMNS)
      .eq("org_id", orgId)
      .order("order_index", { ascending: true });
    orgModules = (data ?? []) as ModuleDbRow[];
  }

  if (orgModules.length === 0) return shared;

  const orgBySlug = new Map<string, ModuleDbRow>();
  for (const m of orgModules) {
    if (m.slug) orgBySlug.set(m.slug, m);
  }

  const shadowedOrgIds = new Set<string>();
  const merged = shared.map((sharedRow) => {
    const shadow = sharedRow.slug ? orgBySlug.get(sharedRow.slug) : undefined;
    if (shadow) {
      shadowedOrgIds.add(shadow.id);
      return shadow;
    }
    return sharedRow;
  });

  const newOrgModules = orgModules
    .filter((m) => !shadowedOrgIds.has(m.id))
    .sort((a, b) => a.order_index - b.order_index);

  return [...merged, ...newOrgModules];
}

/**
 * All training modules visible to this user — the shared bank, with any of
 * the user's org's tailored copies shadowed in and net-new org modules
 * appended — ordered and with this user's completion state.
 */
export async function loadTrainingModules(
  supabase: SupabaseClient,
  userId: string
): Promise<TrainingModuleRow[]> {
  const rows = await loadShadowedModuleRows(supabase, userId);

  const { data: progress } = await supabase
    .from("user_training_progress")
    .select("module_id, completed_at")
    .eq("user_id", userId);

  const completedByModule = new Map<string, string>();
  for (const p of (progress ?? []) as ProgressDbRow[]) {
    completedByModule.set(p.module_id, p.completed_at);
  }

  return rows.map((row) => ({
    id: row.id,
    slug: row.slug ?? row.id,
    title: row.title,
    estMinutes: row.est_minutes,
    required: row.required,
    orderIndex: row.order_index,
    contentMd: row.content_md ?? "",
    completedAt: completedByModule.get(row.id) ?? null,
  }));
}

/** Single module by slug (post-shadowing), with this user's completion state. */
export async function loadTrainingModuleBySlug(
  supabase: SupabaseClient,
  userId: string,
  slug: string
): Promise<TrainingModuleRow | null> {
  const modules = await loadTrainingModules(supabase, userId);
  return modules.find((m) => m.slug === slug) ?? null;
}
