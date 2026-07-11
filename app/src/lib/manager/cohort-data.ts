// Cohort Lite read layer (spec_admin-dashboard.md §4.7) — server-component
// loaders. Deliberately NOT a "use server" module: these are reads called
// during render, not POST-able mutation endpoints (those live in
// cohort-actions.ts).
//
// Every query runs on the caller's own RLS-scoped client AND is explicitly
// filtered to the manager's org, so a platform_admin (whom RLS lets see
// everything) still only sees their own org's cohorts here.

import { createClient } from "@/lib/supabase/server";
import { getUserRole, isManagerRole, type AppRole } from "@/lib/auth/get-user-role";

export type ManagerContext = {
  userId: string;
  role: AppRole;
  /** users.org_id — null means the manager has no org and gets an empty state */
  orgId: string | null;
};

/** Returns null when there is no signed-in manager (page should notFound()). */
export async function getManagerContext(): Promise<ManagerContext | null> {
  const role = await getUserRole();
  if (!isManagerRole(role)) return null;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("users")
    .select("org_id")
    .eq("id", user.id)
    .maybeSingle<{ org_id: string | null }>();

  return { userId: user.id, role, orgId: data?.org_id ?? null };
}

export type CohortSummary = {
  id: string;
  name: string;
  start_date: string | null;
  end_date: string | null;
  memberCount: number;
};

export async function listCohortsWithCounts(orgId: string): Promise<CohortSummary[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("cohorts")
    .select("id, name, start_date, end_date")
    .eq("org_id", orgId)
    .order("start_date", { ascending: false, nullsFirst: false })
    .order("name", { ascending: true });
  const cohorts = (data ?? []) as Omit<CohortSummary, "memberCount">[];
  if (cohorts.length === 0) return [];

  // One batched membership read for all cohorts, counted in memory — no
  // per-cohort query.
  const { data: memberRows } = await supabase
    .from("cohort_members")
    .select("cohort_id")
    .in(
      "cohort_id",
      cohorts.map((c) => c.id)
    );
  const counts = new Map<string, number>();
  for (const row of (memberRows ?? []) as { cohort_id: string }[]) {
    counts.set(row.cohort_id, (counts.get(row.cohort_id) ?? 0) + 1);
  }

  return cohorts.map((c) => ({ ...c, memberCount: counts.get(c.id) ?? 0 }));
}

export type CohortLiteRow = {
  userId: string;
  fullName: string | null;
  email: string | null;
  casesCompleted: number;
  /** Average of evaluation_scores.score where dimension='overall'; null = no evaluated cases yet */
  averageScore: number | null;
};

export type CohortLite = {
  id: string;
  name: string;
  start_date: string | null;
  end_date: string | null;
  rows: CohortLiteRow[];
};

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function chunk<T>(items: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < items.length; i += size) out.push(items.slice(i, i + size));
  return out;
}

/**
 * Loads one cohort's roster with per-member completion stats.
 * Three batched query sets (members, instances, scores) — never N+1 per member.
 * Returns null when the cohort doesn't exist in the manager's org.
 */
export async function loadCohortLite(
  cohortId: string,
  orgId: string
): Promise<CohortLite | null> {
  if (!UUID_RE.test(cohortId)) return null;
  const supabase = await createClient();

  const { data: cohort } = await supabase
    .from("cohorts")
    .select("id, name, start_date, end_date")
    .eq("id", cohortId)
    .eq("org_id", orgId)
    .maybeSingle<Omit<CohortLite, "rows">>();
  if (!cohort) return null;

  const { data: memberData } = await supabase
    .from("cohort_members")
    .select("user_id, users(full_name, email)")
    .eq("cohort_id", cohortId);
  const members = (memberData ?? []) as unknown as {
    user_id: string;
    users: { full_name: string | null; email: string | null } | null;
  }[];
  if (members.length === 0) return { ...cohort, rows: [] };

  const memberIds = members.map((m) => m.user_id);

  // Completed = submitted / evaluated / closed. org filter is belt-and-braces
  // on top of RLS (case_instances.org_id is denormalized from the user).
  const instanceOwner = new Map<string, string>(); // instance id -> user id
  const completedCount = new Map<string, number>();
  for (const ids of chunk(memberIds, 100)) {
    const { data: instanceData } = await supabase
      .from("case_instances")
      .select("id, user_id")
      .in("user_id", ids)
      .eq("org_id", orgId)
      .in("status", ["submitted", "evaluated", "closed"]);
    for (const inst of (instanceData ?? []) as { id: string; user_id: string }[]) {
      instanceOwner.set(inst.id, inst.user_id);
      completedCount.set(inst.user_id, (completedCount.get(inst.user_id) ?? 0) + 1);
    }
  }

  // Overall scores for those instances, averaged per member in memory.
  const scoreSum = new Map<string, { sum: number; n: number }>();
  for (const ids of chunk([...instanceOwner.keys()], 100)) {
    const { data: scoreData } = await supabase
      .from("evaluation_scores")
      .select("case_instance_id, score")
      .eq("dimension", "overall")
      .in("case_instance_id", ids);
    for (const row of (scoreData ?? []) as { case_instance_id: string; score: number | null }[]) {
      if (row.score == null) continue;
      const owner = instanceOwner.get(row.case_instance_id);
      if (!owner) continue;
      const acc = scoreSum.get(owner) ?? { sum: 0, n: 0 };
      acc.sum += Number(row.score);
      acc.n += 1;
      scoreSum.set(owner, acc);
    }
  }

  const rows: CohortLiteRow[] = members
    .map((m) => {
      const acc = scoreSum.get(m.user_id);
      return {
        userId: m.user_id,
        fullName: m.users?.full_name ?? null,
        email: m.users?.email ?? null,
        casesCompleted: completedCount.get(m.user_id) ?? 0,
        averageScore: acc && acc.n > 0 ? acc.sum / acc.n : null,
      };
    })
    .sort((a, b) =>
      (a.fullName ?? a.email ?? "").localeCompare(b.fullName ?? b.email ?? "")
    );

  return { ...cohort, rows };
}
