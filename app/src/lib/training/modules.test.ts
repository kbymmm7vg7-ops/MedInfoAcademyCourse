import { describe, expect, it } from "vitest";
import type { SupabaseClient } from "@supabase/supabase-js";
import { loadTrainingModules } from "./modules";
import { getTrainingGate } from "./gate";

// Minimal stub of the supabase query builder covering exactly the call
// shapes modules.ts/gate.ts use. Returns canned rows per table + filter.
type Row = Record<string, unknown>;

function stubClient(data: {
  userOrgId: string | null;
  shared: Row[];
  org: Row[];
  progress: Row[];
}): SupabaseClient {
  const makeBuilder = (table: string) => {
    const state = { orgFilter: null as "shared" | "org" | null };
    const rows = (): Row[] => {
      if (table === "users") return [{ org_id: data.userOrgId }];
      if (table === "user_training_progress") return data.progress;
      if (table === "training_modules") return state.orgFilter === "org" ? data.org : data.shared;
      return [];
    };
    const builder = {
      select: () => builder,
      is: (_col: string, _v: unknown) => ((state.orgFilter = "shared"), builder),
      eq: (col: string, _v: unknown) => {
        if (col === "org_id") state.orgFilter = "org";
        return builder;
      },
      order: () => Promise.resolve({ data: rows(), error: null }),
      maybeSingle: () => Promise.resolve({ data: rows()[0] ?? null, error: null }),
      then: (resolve: (v: { data: Row[]; error: null }) => unknown) =>
        resolve({ data: rows(), error: null }),
    };
    return builder;
  };
  return { from: (table: string) => makeBuilder(table) } as unknown as SupabaseClient;
}

const shared = [
  { id: "s1", slug: "01-mi-role", title: "Shared role", content_md: "a", required: true, est_minutes: 5, order_index: 1 },
  { id: "s2", slug: "02-ae", title: "Shared AE", content_md: "b", required: true, est_minutes: 5, order_index: 2 },
];

describe("training org shadowing (spec §4.1)", () => {
  it("org row with same slug replaces the shared row in place", async () => {
    const client = stubClient({
      userOrgId: "org-1",
      shared,
      org: [{ id: "o1", slug: "01-mi-role", title: "Org-tailored role", content_md: "x", required: true, est_minutes: 7, order_index: 99 }],
      progress: [],
    });
    const modules = await loadTrainingModules(client, "u1");
    expect(modules.map((m) => m.id)).toEqual(["o1", "s2"]);
    expect(modules[0].title).toBe("Org-tailored role");
  });

  it("org row with a new slug is appended; org-less users see only shared", async () => {
    const netNew = { id: "o2", slug: "90-org-sop", title: "Org SOP", content_md: "y", required: false, est_minutes: 3, order_index: 1 };
    const withOrg = await loadTrainingModules(
      stubClient({ userOrgId: "org-1", shared, org: [netNew], progress: [] }),
      "u1"
    );
    expect(withOrg.map((m) => m.id)).toEqual(["s1", "s2", "o2"]);

    const noOrg = await loadTrainingModules(
      stubClient({ userOrgId: null, shared, org: [netNew], progress: [] }),
      "u1"
    );
    expect(noOrg.map((m) => m.id)).toEqual(["s1", "s2"]);
  });

  it("gate counts the SHADOWED set: completing the org copy satisfies it", async () => {
    const orgCopy = { id: "o1", slug: "01-mi-role", title: "Org role", content_md: "x", required: true, est_minutes: 7, order_index: 1 };
    // Completed the org copy (o1) and the remaining shared module (s2) —
    // the shared original s1 is NOT completed, but it is shadowed out.
    const gate = await getTrainingGate(
      stubClient({
        userOrgId: "org-1",
        shared,
        org: [orgCopy],
        progress: [
          { module_id: "o1", completed_at: "2026-07-10T00:00:00Z" },
          { module_id: "s2", completed_at: "2026-07-10T00:00:00Z" },
        ],
      }),
      "u1"
    );
    expect(gate.complete).toBe(true);
    expect(gate.requiredCount).toBe(2);
  });

  it("gate blocks when the shadowed required copy is incomplete", async () => {
    const orgCopy = { id: "o1", slug: "01-mi-role", title: "Org role", content_md: "x", required: true, est_minutes: 7, order_index: 1 };
    // Only the SHARED original s1 is completed — but the trainee's effective
    // module is the org copy o1, which is not done.
    const gate = await getTrainingGate(
      stubClient({
        userOrgId: "org-1",
        shared,
        org: [orgCopy],
        progress: [
          { module_id: "s1", completed_at: "2026-07-10T00:00:00Z" },
          { module_id: "s2", completed_at: "2026-07-10T00:00:00Z" },
        ],
      }),
      "u1"
    );
    expect(gate.complete).toBe(false);
    expect(gate.incompleteSlugs).toEqual(["01-mi-role"]);
  });
});
