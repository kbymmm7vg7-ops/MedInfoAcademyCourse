/* eslint-disable no-console */
// =============================================================================
// EVALUATOR CALIBRATION HARNESS — S4 definition-of-done (RUNBOOK S4, HANDOFF §6.4)
// =============================================================================
// Drives the REAL evaluator (lib/evaluator/evaluate.ts — same validator +
// applicability + Sonnet prompt + scoring math the app uses) over deterministic
// fixtures built from the 12 Nathan-approved seed answer keys:
//
//   GOLD    — a competent, complete handling of each case → MUST score `pass`.
//   FAILURE — each answer key's `common_failures[]`, mechanically injected into
//             the gold fixture → each NON-EMPTY `expected_critical_fail` MUST
//             trip exactly those Critical criteria (empty [] = documented
//             deduction, reported but not gated — see HANDOFF §7 note).
//
// Ground truth fed to the evaluator is the on-disk approved answer key; the
// evaluator prompt strips `expected_outcome` (the grading key) via
// sanitizeGroundTruthForEvaluator, so the LLM judges blind. The on-disk key is
// verified equal to the DB (`--verify-db`) so calibration == production.
//
// MODES
//   --verify-db       compare on-disk answer keys to case_templates.ground_truth
//                     (canonical JSON); no API. Proves calibration == runtime.
//   --fixtures-only   deterministic: validator-clean gold + applicability +
//                     failure-differs checks; NO API spend. Run this FIRST.
//   (default)         paid: run the Sonnet evaluator on gold + failures.
//
// FILTERS  [SC-03 SC-11 ...] positional case codes · --gold-only · --failures-only
//          --concurrency=N (default 4)
//
// Usage:  cd app && npx tsx scripts/evaluator-calibration.ts --fixtures-only
//         cd app && npx tsx scripts/evaluator-calibration.ts            (paid)
// Output: ../07-evaluator/calibration-report.{json,md}
//         ../07-evaluator/calibration-fixtures-report.{json,md}  (fixtures-only)
// =============================================================================

import { readFileSync, writeFileSync, readdirSync, existsSync } from "fs";
import { join } from "path";

// tsx does not auto-load Next's .env.local — load it so the LLM provider key /
// SUPABASE_SERVICE_ROLE_KEY work (same pattern as persona-transcript-test.ts).
const envPath = join(__dirname, "../.env.local");
if (existsSync(envPath)) {
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim();
  }
}

import {
  buildGoldDocFromCase,
  buildGoldTranscript,
  buildFailureFixtures,
  type AnswerKey,
  type FailureFixture,
} from "./calibration/fixtures";
import { evaluateCase } from "../src/lib/evaluator/evaluate";
import { runValidator, type SpellCheckFn } from "../src/lib/validator/validator";
import { buildSpellChecker } from "../src/lib/validator/spelling";
import { computeApplicability } from "../src/lib/evaluator/applicability";
import { EVALUATOR_VERSION } from "../src/lib/evaluator/prompt";
import { RUBRIC_VERSION } from "../src/lib/evaluator/criteria";
import { modelFor, requiredKeyFor, resolveLlmVendor } from "../src/lib/llm/config";
import type { DocumentationFormState, TranscriptTurn } from "../src/lib/simulator/types";

const CASES_DIR = join(__dirname, "../../01-seed-cases");
const OUT_DIR = join(__dirname, "../../07-evaluator");
const ALL_CODES = Array.from({ length: 12 }, (_, i) => `SC-${String(i + 1).padStart(2, "0")}`);

// Fixed, deterministic "received" moment. 2026-07-06 is a Monday, and every
// fixture is "submitted" the same day (SUBMITTED_AT = RECEIVED_AT), so the
// submission-time S2.2/S3.2 check is trivially within any SOP window.
const RECEIVED_DATE = "2026-07-06";
const RECEIVED_AT = "2026-07-06T14:30:00.000Z";
const SUBMITTED_AT = RECEIVED_AT;

// tsx cannot transform dictionary-en's top-level await, so build the SAME
// nspell checker (identical domain allowlist) from the package's raw .aff/.dic
// files and inject it into the validator / evaluateCase (S4.14 stays faithful).
function loadSpellChecker(): SpellCheckFn {
  const dir = join(__dirname, "../node_modules/dictionary-en");
  return buildSpellChecker({
    aff: readFileSync(join(dir, "index.aff")),
    dic: readFileSync(join(dir, "index.dic")),
  });
}
const SPELL: SpellCheckFn = loadSpellChecker();

// ---------------------------------------------------------------------------
// Args
// ---------------------------------------------------------------------------
const argv = process.argv.slice(2);
const flags = new Set(argv.filter((a) => a.startsWith("--")));
const concurrencyArg = argv.find((a) => a.startsWith("--concurrency="));
const CONCURRENCY = concurrencyArg ? Math.max(1, parseInt(concurrencyArg.split("=")[1], 10) || 4) : 4;
const codeFilter = argv.filter((a) => /^SC-\d{2}$/i.test(a)).map((c) => c.toUpperCase());
const CODES = codeFilter.length > 0 ? codeFilter : ALL_CODES;
const MODE_VERIFY_DB = flags.has("--verify-db");
const MODE_FIXTURES_ONLY = flags.has("--fixtures-only");
const GOLD_ONLY = flags.has("--gold-only");
const FAILURES_ONLY = flags.has("--failures-only");

// ---------------------------------------------------------------------------
// Loading
// ---------------------------------------------------------------------------
type LoadedCase = { code: string; answerKey: AnswerKey; caseMd: string };

function loadCase(code: string): LoadedCase {
  const answerKey = JSON.parse(
    readFileSync(join(CASES_DIR, `${code}.answer-key.json`), "utf8")
  ) as AnswerKey;
  const mdName = readdirSync(CASES_DIR).find((f) => f.startsWith(`${code}_`) && f.endsWith(".md"));
  if (!mdName) throw new Error(`No case markdown found for ${code}`);
  return { code, answerKey, caseMd: readFileSync(join(CASES_DIR, mdName), "utf8") };
}

type CaseFixtures = {
  code: string;
  answerKey: AnswerKey;
  gold: { doc: DocumentationFormState; transcript: TranscriptTurn[] };
  failures: FailureFixture[];
};

function buildFixtures(lc: LoadedCase): CaseFixtures {
  const doc = buildGoldDocFromCase(lc.answerKey, lc.caseMd, RECEIVED_DATE);
  const transcript = buildGoldTranscript(lc.answerKey, lc.caseMd);
  const failures = buildFailureFixtures(lc.answerKey, doc, transcript);
  return { code: lc.code, answerKey: lc.answerKey, gold: { doc, transcript }, failures };
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function canonical(value: unknown): string {
  const sort = (v: unknown): unknown => {
    if (Array.isArray(v)) return v.map(sort);
    if (v && typeof v === "object") {
      return Object.keys(v as Record<string, unknown>)
        .sort()
        .reduce((acc, k) => {
          acc[k] = sort((v as Record<string, unknown>)[k]);
          return acc;
        }, {} as Record<string, unknown>);
    }
    return v;
  };
  return JSON.stringify(sort(value));
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function withRetry<T>(fn: () => Promise<T>, label: string, tries = 3): Promise<T> {
  let lastErr: unknown;
  for (let i = 0; i < tries; i++) {
    try {
      return await fn();
    } catch (e) {
      lastErr = e;
      const msg = e instanceof Error ? e.message : String(e);
      console.warn(`  ⚠ ${label} attempt ${i + 1}/${tries} failed: ${msg}`);
      if (i < tries - 1) await sleep(1500 * (i + 1));
    }
  }
  throw lastErr;
}

async function runPool<T, R>(items: T[], limit: number, worker: (item: T, i: number) => Promise<R>): Promise<R[]> {
  const results = new Array<R>(items.length);
  let idx = 0;
  async function next(): Promise<void> {
    while (idx < items.length) {
      const i = idx++;
      results[i] = await worker(items[i], i);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, next));
  return results;
}

type CriterionOut = { id: string; result: string; evidence?: string; rationale?: string; score?: number };

function flattenCriteria(record: {
  sections: Record<string, { criteria: CriterionOut[] }>;
}): CriterionOut[] {
  return Object.values(record.sections).flatMap((s) => s.criteria ?? []);
}

// ---------------------------------------------------------------------------
// MODE: --verify-db  (on-disk approved answer key  ==  DB ground_truth_json)
// ---------------------------------------------------------------------------
async function runVerifyDb(cases: LoadedCase[]): Promise<number> {
  const { createAdminClient } = await import("../src/lib/supabase/admin");
  const admin = createAdminClient();
  // Since migration 0007 (SEC-1) the answer key lives in service-role-only
  // case_answer_keys, joined back to case_templates for the case_code.
  const { data, error } = await admin
    .from("case_answer_keys")
    .select("ground_truth_json, case_templates!inner(case_code)")
    .in("case_templates.case_code", cases.map((c) => c.code));
  if (error) {
    console.error(`DB read failed: ${error.message}`);
    return 1;
  }
  type VerifyRow = { ground_truth_json: unknown; case_templates: { case_code: string } | { case_code: string }[] };
  const dbByCode = new Map(
    ((data ?? []) as VerifyRow[]).map((r) => {
      const t = Array.isArray(r.case_templates) ? r.case_templates[0] : r.case_templates;
      return [t?.case_code, r.ground_truth_json] as const;
    })
  );
  let mismatches = 0;
  for (const c of cases) {
    const db = dbByCode.get(c.code);
    if (db == null) {
      console.error(`✗ ${c.code}: no DB row`);
      mismatches++;
      continue;
    }
    if (canonical(db) === canonical(c.answerKey)) {
      console.log(`✓ ${c.code}: DB ground_truth == on-disk answer key`);
    } else {
      mismatches++;
      console.error(`✗ ${c.code}: DB ground_truth DIFFERS from on-disk answer key`);
      // Field-level diff to make it actionable.
      const a = c.answerKey as Record<string, unknown>;
      const b = db as Record<string, unknown>;
      for (const k of new Set([...Object.keys(a), ...Object.keys(b)])) {
        if (canonical(a[k]) !== canonical(b[k])) console.error(`    · ${k} differs`);
      }
    }
  }
  console.log(
    mismatches === 0
      ? `\n✅ All ${cases.length} on-disk answer keys match the DB — calibration ground truth == runtime.`
      : `\n❌ ${mismatches} case(s) differ. Re-seed before trusting calibration.`
  );
  return mismatches === 0 ? 0 : 1;
}

// ---------------------------------------------------------------------------
// MODE: --fixtures-only  (deterministic; no API)
// ---------------------------------------------------------------------------
type FixtureCheck = {
  code: string;
  goldValidatorFails: { criterion: string; evidence: string }[];
  applicability: { s1: boolean; s2: boolean; s3: boolean; s4: boolean; s5: boolean };
  expectedSections: string[];
  s2s3Match: boolean;
  failures: {
    label: string;
    expected_critical_fail: string[];
    docChanged: boolean;
    transcriptChanged: boolean;
    changed: boolean;
  }[];
};

async function runFixturesOnly(fx: CaseFixtures[]): Promise<number> {
  const spellCheck = SPELL;
  const checks: FixtureCheck[] = [];
  let problems = 0;

  for (const c of fx) {
    const findings = runValidator({
      doc: c.gold.doc,
      transcript: c.gold.transcript,
      groundTruth: c.answerKey as Parameters<typeof runValidator>[0]["groundTruth"],
      receivedAt: RECEIVED_AT,
      submittedAt: SUBMITTED_AT,
      sopTimeframeBusinessDays: c.answerKey.sop_timeframe_business_days ?? null,
      spellCheck,
    });
    const goldValidatorFails = findings
      .filter((f) => f.status === "fail")
      .map((f) => ({ criterion: f.criterion, evidence: f.evidence }));

    const applicability = computeApplicability({
      groundTruth: c.answerKey as { safety?: { ae_present?: boolean; pc_present?: boolean } },
      doc: c.gold.doc,
      liveConversation: true,
    });
    const expectedSections = c.answerKey.expected_outcome.applicable_sections;
    // Only s2/s3 are ground-truth (AE/PC) driven and load-bearing for scoring.
    // s1 intentionally diverges for text cases (runtime scores S1 for all live
    // conversations incl. chat; answer keys omit s1 for text) — informational.
    const s2s3Match =
      applicability.s2 === expectedSections.includes("s2") &&
      applicability.s3 === expectedSections.includes("s3");

    const goldDocJson = canonical(c.gold.doc);
    const goldTranscriptJson = canonical(c.gold.transcript);
    const failures = c.failures.map((f) => {
      const docChanged = canonical(f.doc) !== goldDocJson;
      const transcriptChanged = canonical(f.transcript) !== goldTranscriptJson;
      return {
        label: f.label,
        expected_critical_fail: f.expected_critical_fail,
        docChanged,
        transcriptChanged,
        changed: docChanged || transcriptChanged,
      };
    });

    if (goldValidatorFails.length > 0) problems++;
    if (!s2s3Match) problems++;
    for (const f of failures) if (!f.changed) problems++;

    checks.push({ code: c.code, goldValidatorFails, applicability, expectedSections, s2s3Match, failures });

    console.log(`\n${c.code}`);
    console.log(
      `  gold validator: ${
        goldValidatorFails.length === 0 ? "CLEAN ✓" : `${goldValidatorFails.length} FAIL(S) ✗`
      }`
    );
    for (const f of goldValidatorFails) console.log(`    ✗ ${f.criterion}: ${f.evidence}`);
    console.log(
      `  applicability s2/s3 vs key: ${s2s3Match ? "match ✓" : "MISMATCH ✗"} (key sections: ${expectedSections.join("/")})`
    );
    console.log(`  failure fixtures (${failures.length}):`);
    for (const f of failures) {
      const crit = f.expected_critical_fail.length ? f.expected_critical_fail.join(",") : "(none — deduction)";
      console.log(
        `    ${f.changed ? "✓" : "✗ NO-OP"} ${f.label}  → expects ${crit}` +
          (f.changed ? "" : "  ⚠ mutator produced no change")
      );
    }
  }

  const report = {
    generated_at: new Date().toISOString(),
    mode: "fixtures-only",
    received_at: RECEIVED_AT,
    cases: checks,
    summary: {
      cases: checks.length,
      gold_validator_clean: checks.filter((c) => c.goldValidatorFails.length === 0).length,
      applicability_s2s3_match: checks.filter((c) => c.s2s3Match).length,
      total_failure_fixtures: checks.reduce((n, c) => n + c.failures.length, 0),
      no_op_failure_fixtures: checks.reduce((n, c) => n + c.failures.filter((f) => !f.changed).length, 0),
      problems,
    },
  };
  writeFileSync(join(OUT_DIR, "calibration-fixtures-report.json"), JSON.stringify(report, null, 2));
  writeFileSync(join(OUT_DIR, "calibration-fixtures-report.md"), renderFixturesMd(report));

  console.log(
    `\n${problems === 0 ? "✅" : "❌"} fixtures-only: ${problems} problem(s). ` +
      `Gold clean ${report.summary.gold_validator_clean}/${checks.length}, ` +
      `no-op mutators ${report.summary.no_op_failure_fixtures}.`
  );
  console.log(`Report → 07-evaluator/calibration-fixtures-report.{json,md}`);
  return problems === 0 ? 0 : 1;
}

function renderFixturesMd(report: {
  generated_at: string;
  summary: Record<string, number>;
  cases: FixtureCheck[];
}): string {
  const L: string[] = [];
  L.push(`# Evaluator calibration — fixtures-only (deterministic, no API)\n`);
  L.push(`_Generated ${report.generated_at}_\n`);
  L.push(`Verifies the fixtures before any paid run: gold docs are validator-clean,`);
  L.push(`AE/PC applicability matches the answer key, and every injected failure`);
  L.push(`actually mutates the gold fixture.\n`);
  L.push(`## Summary\n`);
  L.push(`| Metric | Value |`);
  L.push(`|---|---|`);
  L.push(`| Cases | ${report.summary.cases} |`);
  L.push(`| Gold validator-clean | ${report.summary.gold_validator_clean}/${report.summary.cases} |`);
  L.push(`| Applicability s2/s3 match | ${report.summary.applicability_s2s3_match}/${report.summary.cases} |`);
  L.push(`| Failure fixtures | ${report.summary.total_failure_fixtures} |`);
  L.push(`| No-op failure fixtures | ${report.summary.no_op_failure_fixtures} |`);
  L.push(`| **Problems** | **${report.summary.problems}** |`);
  L.push(``);
  L.push(`## Per-case\n`);
  for (const c of report.cases) {
    L.push(`### ${c.code}`);
    L.push(
      `- Gold validator: ${c.goldValidatorFails.length === 0 ? "CLEAN ✓" : `${c.goldValidatorFails.length} fail(s) ✗`}`
    );
    for (const f of c.goldValidatorFails) L.push(`  - ✗ ${f.criterion}: ${f.evidence}`);
    L.push(`- Applicability s2/s3 vs key (${c.expectedSections.join("/")}): ${c.s2s3Match ? "match ✓" : "MISMATCH ✗"}`);
    for (const f of c.failures) {
      const crit = f.expected_critical_fail.length ? f.expected_critical_fail.join(", ") : "— (deduction only)";
      L.push(`  - ${f.changed ? "✓" : "✗ NO-OP"} \`${f.label}\` → expects ${crit}`);
    }
    L.push(``);
  }
  return L.join("\n");
}

// ---------------------------------------------------------------------------
// MODE: default (paid) — run the real evaluator
// ---------------------------------------------------------------------------
type EvalRun = {
  label: string;
  kind: "gold" | "failure";
  code: string;
  channel: "voice" | "text";
  expected_critical_fail?: string[];
  transcript: TranscriptTurn[];
  doc: DocumentationFormState;
  sop: number | null;
  answerKey: AnswerKey;
};

type EvalResult = EvalRun & {
  overall: "pass" | "fail" | "error";
  criteria: CriterionOut[];
  coaching_summary?: string;
  error?: string;
  // gold: pass expected. failure: every non-empty expected_critical_fail must be a fail.
  verdict: "match" | "mismatch" | "info" | "error";
  detail: string;
};

async function runOne(run: EvalRun): Promise<EvalResult> {
  try {
    const { record } = await withRetry(
      () =>
        evaluateCase({
          caseInstanceId: `calib-${run.label}`,
          caseTemplateId: `calib-${run.code}`,
          variantRef: null,
          channel: run.channel,
          groundTruthJson: run.answerKey as unknown as Record<string, unknown>,
          transcript: run.transcript,
          doc: run.doc,
          receivedAt: RECEIVED_AT,
          submittedAt: SUBMITTED_AT,
          sopTimeframeBusinessDays: run.sop,
          spellCheck: SPELL,
        }),
      run.label
    );
    const rec = record as unknown as {
      overall: { result: "pass" | "fail"; coaching_summary?: string };
      sections: Record<string, { criteria: CriterionOut[] }>;
    };
    const criteria = flattenCriteria(rec);
    const overall = rec.overall.result;
    const byId = new Map(criteria.map((c) => [c.id, c]));

    let verdict: EvalResult["verdict"];
    let detail: string;
    if (run.kind === "gold") {
      verdict = overall === "pass" ? "match" : "mismatch";
      const fails = criteria.filter((c) => c.result === "fail").map((c) => c.id);
      detail = overall === "pass" ? "gold scored pass ✓" : `gold scored FAIL — failing: ${fails.join(", ") || "(section min)"}`;
    } else {
      const want = run.expected_critical_fail ?? [];
      if (want.length === 0) {
        verdict = "info";
        const fails = criteria.filter((c) => c.result === "fail").map((c) => c.id);
        detail = `deduction fixture — overall ${overall}; failing: ${fails.join(", ") || "none"}`;
      } else {
        const missing = want.filter((id) => byId.get(id)?.result !== "fail");
        verdict = missing.length === 0 ? "match" : "mismatch";
        detail =
          missing.length === 0
            ? `tripped expected Critical(s) ${want.join(", ")} ✓ (overall ${overall})`
            : `did NOT trip ${missing.join(", ")} — actual: ${missing
                .map((id) => `${id}=${byId.get(id)?.result ?? "absent"}`)
                .join(", ")} (overall ${overall})`;
      }
    }
    return { ...run, overall, criteria, coaching_summary: rec.overall.coaching_summary, verdict, detail };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return { ...run, overall: "error", criteria: [], verdict: "error", detail: msg, error: msg };
  }
}

async function runPaid(fx: CaseFixtures[]): Promise<number> {
  const requiredKey = requiredKeyFor("evaluator");
  if (!process.env[requiredKey]) {
    console.error(
      `${requiredKey} not set (provider: ${resolveLlmVendor("evaluator")}) — required for the paid calibration run (see BLOCKERS.md).`
    );
    return 1;
  }
  const runs: EvalRun[] = [];
  for (const c of fx) {
    if (!FAILURES_ONLY) {
      runs.push({
        label: `${c.code}-gold`,
        kind: "gold",
        code: c.code,
        channel: c.answerKey.channel,
        transcript: c.gold.transcript,
        doc: c.gold.doc,
        sop: c.answerKey.sop_timeframe_business_days ?? null,
        answerKey: c.answerKey,
      });
    }
    if (!GOLD_ONLY) {
      for (const f of c.failures) {
        runs.push({
          label: f.label,
          kind: "failure",
          code: c.code,
          channel: c.answerKey.channel,
          expected_critical_fail: f.expected_critical_fail,
          transcript: f.transcript,
          doc: f.doc,
          sop: c.answerKey.sop_timeframe_business_days ?? null,
          answerKey: c.answerKey,
        });
      }
    }
  }

  console.log(
    `Running ${runs.length} evaluations (${modelFor("evaluator")}, concurrency ${CONCURRENCY})…\n`
  );
  let done = 0;
  const results = await runPool(runs, CONCURRENCY, async (run) => {
    const r = await runOne(run);
    done++;
    const mark = r.verdict === "match" ? "✓" : r.verdict === "mismatch" ? "✗" : r.verdict === "error" ? "⚠" : "·";
    console.log(`  [${done}/${runs.length}] ${mark} ${r.label}: ${r.detail}`);
    return r;
  });

  const golds = results.filter((r) => r.kind === "gold");
  const critFailures = results.filter((r) => r.kind === "failure" && (r.expected_critical_fail?.length ?? 0) > 0);
  const dedFailures = results.filter((r) => r.kind === "failure" && (r.expected_critical_fail?.length ?? 0) === 0);

  const goldPass = golds.filter((r) => r.verdict === "match").length;
  const critMatch = critFailures.filter((r) => r.verdict === "match").length;
  const errors = results.filter((r) => r.verdict === "error");

  const gateGold = golds.length === 0 || goldPass === golds.length;
  const gateCrit = critFailures.length === 0 || critMatch === critFailures.length;
  const pass = gateGold && gateCrit && errors.length === 0;

  const report = {
    generated_at: new Date().toISOString(),
    mode: "paid",
    model: modelFor("evaluator"),
    evaluator_version: EVALUATOR_VERSION,
    rubric_version: RUBRIC_VERSION,
    received_at: RECEIVED_AT,
    cases: CODES,
    summary: {
      gold_total: golds.length,
      gold_pass: goldPass,
      critical_failure_total: critFailures.length,
      critical_failure_match: critMatch,
      deduction_failure_total: dedFailures.length,
      errors: errors.length,
      gate_gold_all_pass: gateGold,
      gate_critical_all_trip: gateCrit,
      overall_gate: pass,
    },
    results: results.map((r) => ({
      label: r.label,
      code: r.code,
      kind: r.kind,
      channel: r.channel,
      expected_critical_fail: r.expected_critical_fail ?? null,
      overall: r.overall,
      verdict: r.verdict,
      detail: r.detail,
      failing_criteria: r.criteria.filter((c) => c.result === "fail").map((c) => ({
        id: c.id,
        evidence: c.evidence ?? null,
        rationale: c.rationale ?? null,
      })),
      criteria: r.criteria,
      coaching_summary: r.coaching_summary ?? null,
      transcript: r.transcript,
      doc: r.doc,
    })),
  };
  writeFileSync(join(OUT_DIR, "calibration-report.json"), JSON.stringify(report, null, 2));
  writeFileSync(join(OUT_DIR, "calibration-report.md"), renderPaidMd(report, results));

  console.log(`\n${"=".repeat(60)}`);
  console.log(`Gold: ${goldPass}/${golds.length} pass ${gateGold ? "✓" : "✗"}`);
  console.log(`Critical failures tripped: ${critMatch}/${critFailures.length} ${gateCrit ? "✓" : "✗"}`);
  console.log(`Deduction fixtures (informational): ${dedFailures.length}`);
  if (errors.length) console.log(`Errors: ${errors.length} ⚠`);
  console.log(`\n${pass ? "✅ DoD MET" : "❌ DoD NOT met"} — see 07-evaluator/calibration-report.md`);
  console.log(`Next: Nathan blind-scores ≥10 outputs (zero Critical disagreements, ≤1 Major/case) before cert goes live.`);
  return pass ? 0 : 1;
}

function docBlock(doc: DocumentationFormState): string {
  return "```json\n" + JSON.stringify(doc, null, 2) + "\n```";
}
function transcriptBlock(t: TranscriptTurn[]): string {
  return t.map((x, i) => `${i + 1}. **${x.speaker}**: ${x.content}`).join("\n");
}

function renderPaidMd(
  report: {
    generated_at: string;
    model: string;
    evaluator_version: string;
    rubric_version: string;
    summary: Record<string, number | boolean>;
  },
  results: EvalResult[]
): string {
  const L: string[] = [];
  const golds = results.filter((r) => r.kind === "gold");
  L.push(`# Evaluator calibration report (S4)\n`);
  L.push(
    `_Generated ${report.generated_at} · model ${report.model} · ${report.evaluator_version} · rubric v${report.rubric_version}_\n`
  );
  L.push(`## Definition-of-done gate\n`);
  L.push(`| Gate | Result |`);
  L.push(`|---|---|`);
  L.push(`| Gold examples → \`pass\` | ${report.summary.gold_pass}/${report.summary.gold_total} ${report.summary.gate_gold_all_pass ? "✅" : "❌"} |`);
  L.push(
    `| Non-empty \`expected_critical_fail\` → trips exact Critical(s) | ${report.summary.critical_failure_match}/${report.summary.critical_failure_total} ${report.summary.gate_critical_all_trip ? "✅" : "❌"} |`
  );
  L.push(`| Errors | ${report.summary.errors} |`);
  L.push(`| **Overall DoD** | ${report.summary.overall_gate ? "**✅ MET**" : "**❌ NOT MET**"} |`);
  L.push(``);
  L.push(`Deduction fixtures (\`expected_critical_fail: []\`) are reported below but not gated — they are documented point deductions, not mandated case failures (HANDOFF §7).\n`);

  // Mismatches front-and-center.
  const mism = results.filter((r) => r.verdict === "mismatch" || r.verdict === "error");
  L.push(`## Disagreements & errors (${mism.length})\n`);
  if (mism.length === 0) L.push(`None. Every gold passed and every mandated Critical tripped.\n`);
  for (const r of mism) {
    L.push(`### ${r.label} — ${r.verdict.toUpperCase()}`);
    L.push(`- ${r.detail}`);
    if (r.error) L.push(`- error: ${r.error}`);
    else {
      const fails = r.criteria.filter((c) => c.result === "fail");
      if (fails.length) {
        L.push(`- failing criteria:`);
        for (const f of fails) L.push(`  - **${f.id}**: ${f.evidence ?? f.rationale ?? "(no evidence)"}`);
      }
    }
    L.push(``);
  }

  // Full results table.
  L.push(`## All results\n`);
  L.push(`| Label | Kind | Expected Critical | Overall | Verdict |`);
  L.push(`|---|---|---|---|---|`);
  for (const r of results) {
    const exp = r.expected_critical_fail?.length ? r.expected_critical_fail.join(", ") : r.kind === "gold" ? "(pass)" : "—";
    L.push(`| ${r.label} | ${r.kind} | ${exp} | ${r.overall} | ${r.verdict} |`);
  }
  L.push(``);

  // Deduction fixtures detail (informational sanity for Nathan).
  const ded = results.filter((r) => r.verdict === "info");
  L.push(`## Deduction fixtures (informational)\n`);
  for (const r of ded) {
    L.push(`- \`${r.label}\`: ${r.detail}`);
  }
  L.push(``);

  // Blind-scoring appendix.
  L.push(`---\n`);
  L.push(`# Blind-scoring appendix (for Nathan)\n`);
  L.push(
    `Score each GOLD case yourself from the transcript + documentation **before** reading the evaluator's verdicts in Part B. The gate: **zero Critical-criterion disagreements, ≤1 Major disagreement per case.** ${golds.length} gold outputs below; the JSON report holds all ${results.length} outputs (incl. failure fixtures) with full per-criterion evidence.\n`
  );
  L.push(`## Part A — cases to score (verdicts hidden)\n`);
  golds.forEach((r, i) => {
    L.push(`### A${i + 1}. ${r.code} (gold · ${r.channel})\n`);
    L.push(`**Transcript**\n`);
    L.push(transcriptBlock(r.transcript));
    L.push(`\n**Submitted documentation**\n`);
    L.push(docBlock(r.doc));
    L.push(``);
  });
  L.push(`## Part B — evaluator verdicts (reveal after scoring)\n`);
  golds.forEach((r, i) => {
    L.push(`### B${i + 1}. ${r.code} — evaluator says: **${r.overall.toUpperCase()}**\n`);
    if (r.coaching_summary) L.push(`> ${r.coaching_summary}\n`);
    L.push(`| Criterion | Result | Evidence / rationale |`);
    L.push(`|---|---|---|`);
    for (const c of r.criteria) {
      const note = (c.evidence ?? c.rationale ?? "").replace(/\|/g, "\\|").slice(0, 300);
      L.push(`| ${c.id} | ${c.result}${c.score != null ? ` (${c.score})` : ""} | ${note} |`);
    }
    L.push(``);
  });
  return L.join("\n");
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  if (!existsSync(OUT_DIR)) {
    console.error(`Output dir missing: ${OUT_DIR}`);
    process.exit(1);
  }
  const loaded = CODES.map(loadCase);

  if (MODE_VERIFY_DB) {
    process.exit(await runVerifyDb(loaded));
  }
  const fx = loaded.map(buildFixtures);
  if (MODE_FIXTURES_ONLY) {
    process.exit(await runFixturesOnly(fx));
  }
  process.exit(await runPaid(fx));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
