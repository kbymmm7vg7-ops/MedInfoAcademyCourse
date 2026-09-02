// =============================================================================
// CI INVARIANTS — deterministic, offline, no API spend
// =============================================================================
// The checks CI runs beyond lint/typecheck/test/build. Runnable locally with
// exactly the same command CI uses:
//
//   cd app && npx tsx scripts/ci-invariants.ts
//
// Exit 0 = all invariants hold. Exit 1 = at least one failed (details printed).
//
//   A. Every 01-seed-cases/SC-*.answer-key.json validates against
//      01-seed-cases/answer-key.schema.json.
//   B. The schema copies vendored into app/src (Turbopack cannot import
//      outside the app root) have not drifted from their sources.
//   C. scripts/evaluator-calibration.ts --fixtures-only is green.
// =============================================================================

import { readFileSync, readdirSync } from "fs";
import { join } from "path";
import { spawnSync } from "child_process";
import { Ajv } from "ajv";
import addFormats from "ajv-formats";

const APP_DIR = join(__dirname, "..");
const ROOT = join(APP_DIR, "..");
const CASES_DIR = join(ROOT, "01-seed-cases");
const RUBRIC_DIR = join(ROOT, "02-rubric-schema");

let failures = 0;
function ok(msg: string) {
  console.log(`  ✓ ${msg}`);
}
function bad(msg: string) {
  failures++;
  console.log(`  ✗ ${msg}`);
}

// ---------------------------------------------------------------------------
// A. Answer keys validate against their schema
// ---------------------------------------------------------------------------
function checkAnswerKeys(): void {
  console.log("\nA. Answer keys vs 01-seed-cases/answer-key.schema.json");
  const schema = JSON.parse(readFileSync(join(CASES_DIR, "answer-key.schema.json"), "utf8"));
  const ajv = new Ajv({ allErrors: true, strict: false });
  addFormats(ajv);
  const validate = ajv.compile(schema);

  const files = readdirSync(CASES_DIR)
    .filter((f) => /^SC-\d+\.answer-key\.json$/.test(f))
    .sort();
  if (files.length === 0) {
    bad("no SC-*.answer-key.json files found — the glob or the directory moved");
    return;
  }
  for (const f of files) {
    const doc = JSON.parse(readFileSync(join(CASES_DIR, f), "utf8"));
    if (validate(doc)) ok(f);
    else bad(`${f}: ${ajv.errorsText(validate.errors, { separator: "; " })}`);
  }
  console.log(`  (${files.length} answer keys checked)`);
}

// ---------------------------------------------------------------------------
// B. Vendored schema copies have not drifted from their sources
// ---------------------------------------------------------------------------
type Json = unknown;

function deepEqual(a: Json, b: Json): boolean {
  if (a === b) return true;
  if (Array.isArray(a) || Array.isArray(b)) {
    if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) return false;
    return a.every((v, i) => deepEqual(v, b[i]));
  }
  if (a && b && typeof a === "object" && typeof b === "object") {
    const ka = Object.keys(a as Record<string, Json>).sort();
    const kb = Object.keys(b as Record<string, Json>).sort();
    if (ka.length !== kb.length || ka.some((k, i) => k !== kb[i])) return false;
    return ka.every((k) =>
      deepEqual((a as Record<string, Json>)[k], (b as Record<string, Json>)[k])
    );
  }
  return false;
}

function checkVendoredSchemas(): void {
  console.log("\nB. Vendored schema copies vs their sources");

  // The admin answer-key schema is vendored byte-for-byte.
  const akSrc = readFileSync(join(CASES_DIR, "answer-key.schema.json"));
  const akVendored = readFileSync(join(APP_DIR, "src/lib/admin/answer-key.schema.json"));
  if (akSrc.equals(akVendored)) {
    ok("src/lib/admin/answer-key.schema.json is byte-identical to 01-seed-cases/answer-key.schema.json");
  } else {
    bad(
      "src/lib/admin/answer-key.schema.json has drifted from 01-seed-cases/answer-key.schema.json — " +
        "re-copy the source file (the source is authoritative)"
    );
  }

  // The rubric schema copy is reformatted and carries an appended
  // "[VENDORED COPY ...]" note in its top-level `description`, so it is not
  // byte-identical by design. What must hold is that it is the SAME SCHEMA:
  // deep-equal once the top-level description is set aside, and the vendored
  // description must still start with the source's. Neither file is edited
  // here — the rubric schema is sign-off-gated (see 00-build/DECISIONS.md).
  const rubricSrc = JSON.parse(readFileSync(join(RUBRIC_DIR, "rubric.schema.json"), "utf8")) as Record<
    string,
    Json
  >;
  const rubricVendored = JSON.parse(
    readFileSync(join(APP_DIR, "src/lib/evaluator/rubric.schema.json"), "utf8")
  ) as Record<string, Json>;

  const srcDesc = rubricSrc.description;
  const vendoredDesc = rubricVendored.description;
  const { description: _srcOmit, ...srcRest } = rubricSrc;
  const { description: _vendoredOmit, ...vendoredRest } = rubricVendored;
  void _srcOmit;
  void _vendoredOmit;

  if (!deepEqual(srcRest, vendoredRest)) {
    bad(
      "src/lib/evaluator/rubric.schema.json has drifted from 02-rubric-schema/rubric.schema.json — " +
        "the two schemas are not equivalent (ignoring the top-level description)"
    );
  } else if (typeof srcDesc !== "string" || typeof vendoredDesc !== "string") {
    bad("rubric schema: expected a string `description` on both copies");
  } else if (!vendoredDesc.startsWith(srcDesc)) {
    bad(
      "rubric schema: the vendored copy's description no longer starts with the source's — " +
        "the source description changed without the copy being refreshed"
    );
  } else {
    ok(
      "src/lib/evaluator/rubric.schema.json is equivalent to 02-rubric-schema/rubric.schema.json " +
        "(formatting + appended vendoring note only)"
    );
  }
}

// ---------------------------------------------------------------------------
// C. Deterministic calibration fixtures
// ---------------------------------------------------------------------------
function checkCalibrationFixtures(): void {
  console.log("\nC. evaluator-calibration --fixtures-only (deterministic, no API)");
  // Spawned rather than imported: the calibration script calls process.exit()
  // and writes its own report. `npx` picks up the local tsx devDependency.
  const res = spawnSync(
    process.platform === "win32" ? "npx.cmd" : "npx",
    ["tsx", join(APP_DIR, "scripts/evaluator-calibration.ts"), "--fixtures-only"],
    { cwd: APP_DIR, encoding: "utf8" }
  );
  const output = `${res.stdout ?? ""}${res.stderr ?? ""}`;
  if (res.status === 0) {
    // Echo only the verdict line; the full report is written to 07-evaluator/.
    const verdict = output.split("\n").find((l) => l.includes("fixtures-only:"));
    ok(verdict?.trim() ?? "fixtures-only exited 0");
  } else {
    bad(`fixtures-only exited ${res.status}`);
    console.log(output);
  }
}

function main(): void {
  console.log("CI invariants (deterministic, no API spend)");
  checkAnswerKeys();
  checkVendoredSchemas();
  checkCalibrationFixtures();
  console.log(
    `\n${failures === 0 ? "✅" : "❌"} ci-invariants: ${failures} failure(s).`
  );
  process.exit(failures === 0 ? 0 : 1);
}

main();
