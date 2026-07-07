import { createClient } from "@/lib/supabase/server";

export type AppRole =
  | "trainee"
  | "trainer"
  | "qa"
  | "admin"
  | "platform_admin";

const MANAGER_ROLES: AppRole[] = ["trainer", "qa", "admin", "platform_admin"];

/**
 * Reads the current auth user's role from the `users` table.
 *
 * The `users` table is owned by another workstream and may not exist yet
 * (or the current user may not have a row yet). Any failure — missing
 * table, missing row, RLS rejection, network error — is treated as the
 * safe default of 'trainee' rather than thrown.
 */
export async function getUserRole(): Promise<AppRole> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return "trainee";

    const { data, error } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    if (error || !data?.role) {
      return "trainee";
    }

    const role = data.role as string;
    if ((MANAGER_ROLES as string[]).includes(role) || role === "trainee") {
      return role as AppRole;
    }

    return "trainee";
  } catch {
    return "trainee";
  }
}

export function isManagerRole(role: AppRole): boolean {
  return MANAGER_ROLES.includes(role);
}
