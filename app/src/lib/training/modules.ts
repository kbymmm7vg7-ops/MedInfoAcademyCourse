import type { SupabaseClient } from "@supabase/supabase-js";

// Client-safe row shapes for training module listing/reading. org_id is
// always null (shared bank) per the PRD; these helpers don't filter on org_id
// beyond that because there is currently no org-specific training content.

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

/** All shared training modules ordered by order_index, with this user's completion state. */
export async function loadTrainingModules(
  supabase: SupabaseClient,
  userId: string
): Promise<TrainingModuleRow[]> {
  const { data: modules } = await supabase
    .from("training_modules")
    .select("id, slug, title, content_md, required, est_minutes, order_index")
    .is("org_id", null)
    .order("order_index", { ascending: true });

  const rows = (modules ?? []) as ModuleDbRow[];

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

/** Single module by slug, with this user's completion state. */
export async function loadTrainingModuleBySlug(
  supabase: SupabaseClient,
  userId: string,
  slug: string
): Promise<TrainingModuleRow | null> {
  const { data: mod } = await supabase
    .from("training_modules")
    .select("id, slug, title, content_md, required, est_minutes, order_index")
    .is("org_id", null)
    .eq("slug", slug)
    .maybeSingle<ModuleDbRow>();

  if (!mod) return null;

  const { data: progress } = await supabase
    .from("user_training_progress")
    .select("completed_at")
    .eq("user_id", userId)
    .eq("module_id", mod.id)
    .maybeSingle<{ completed_at: string }>();

  return {
    id: mod.id,
    slug: mod.slug ?? mod.id,
    title: mod.title,
    estMinutes: mod.est_minutes,
    required: mod.required,
    orderIndex: mod.order_index,
    contentMd: mod.content_md ?? "",
    completedAt: progress?.completed_at ?? null,
  };
}
