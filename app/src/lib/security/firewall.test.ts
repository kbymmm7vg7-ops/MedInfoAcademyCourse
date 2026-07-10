// SEC-9 — ground-truth firewall discipline as CI check.
//
// After migration 0007 the answer keys live in service-role-only tables
// (case_answer_keys, srd_document_bodies). This test enforces, by grep, that
// only the sanctioned readers ever mention the secret column/table names, so
// a future change can't quietly re-open SEC-1/SEC-2 at the app layer. If you
// legitimately need a new sanctioned reader, add it to the allowlist below in
// the same commit and say why in the PR — that's the review hook.
import { describe, expect, it } from "vitest";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const SRC_ROOT = join(__dirname, "..", "..");

// Files (relative to src/) allowed to reference answer-key columns or the
// service-role-only tables. Everything else in src/ must stay clean.
const ALLOWED = new Set<string>([
  "lib/simulator/case-brief.ts", // THE ground-truth firewall (sole full reader)
  "lib/simulator/queue.ts", // narrow read: sop timeframe + has-transcript/persona flags
  "lib/simulator/types.ts", // doc comment explaining contact_prefill provenance
  "lib/cert/actions.ts", // narrow read: requester.type for variant generation
  "lib/admin/answer-keys.ts", // S7 admin ground-truth editor data layer (server-only)
]);

const SECRET_PATTERN =
  /ground_truth_json|persona_brief_json|scripted_transcript_json|case_answer_keys|srd_document_bodies/;

function walk(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) walk(full, out);
    else if (/\.(ts|tsx)$/.test(entry) && !entry.endsWith(".test.ts")) out.push(full);
  }
  return out;
}

describe("SEC-9 ground-truth firewall grep", () => {
  it("only sanctioned files reference answer-key columns/tables", () => {
    const offenders: string[] = [];
    for (const file of walk(SRC_ROOT)) {
      const rel = relative(SRC_ROOT, file);
      if (ALLOWED.has(rel)) continue;
      if (SECRET_PATTERN.test(readFileSync(file, "utf8"))) offenders.push(rel);
    }
    expect(offenders, `Unsanctioned answer-key reference in: ${offenders.join(", ")} — route reads through lib/simulator/case-brief.ts (or extend the SEC-9 allowlist deliberately)`).toEqual([]);
  });

  it("srd_documents body column is not selected anywhere in src", () => {
    const offenders: string[] = [];
    for (const file of walk(SRC_ROOT)) {
      const rel = relative(SRC_ROOT, file);
      if (ALLOWED.has(rel)) continue;
      const text = readFileSync(file, "utf8");
      // A select on srd_documents including a bare `body` column
      if (/from\(["']srd_documents["']\)[\s\S]{0,200}?select\([^)]*\bbody\b/.test(text)) {
        offenders.push(rel);
      }
    }
    expect(offenders, `srd_documents body select outside firewall: ${offenders.join(", ")}`).toEqual([]);
  });
});
