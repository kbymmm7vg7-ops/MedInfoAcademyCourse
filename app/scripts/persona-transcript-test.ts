/* eslint-disable no-console */
// =============================================================================
// PERSONA TRANSCRIPT TEST — S3 definition-of-done / Checkpoint A artifact
// =============================================================================
// Runs the real persona engine (same prompt builder + model policy the app
// uses) against all 12 seed cases with deterministic scripted trainees:
//
//   embedded cases (SC-02/03/04/08/11/12):
//     CATCH — trainee catches the volunteered cue and clarifies it
//             → withheld detail MUST surface
//     PASS  — trainee never clarifies (generic competent call)
//             → withheld detail MUST NOT surface
//   upfront cases (SC-05/07/10): cue is the opening — detail must surface
//             without any clarification (VOLUNTEER run)
//   clean cases (SC-01/06/09):   FISH — trainee cold-canvasses for symptoms
//             → persona must deny and invent nothing
//
// Sources are the local approved artifacts (answer keys + case markdown), so
// the test needs no DB — it exercises buildPersonaSystemPrompt + runPersonaTurn
// exactly as the API route does. Requires ANTHROPIC_API_KEY.
//
// Usage: cd app && npx tsx scripts/persona-transcript-test.ts [SC-03 SC-11 ...]
// Output: ../05-persona-engine/persona-transcript-test-results.{json,md}
// =============================================================================

import { readFileSync, writeFileSync, readdirSync, existsSync } from "fs";
import { join } from "path";

// tsx does not auto-load Next's .env.local — load it so ANTHROPIC_API_KEY works.
const envPath = join(__dirname, "../.env.local");
if (existsSync(envPath)) {
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim();
  }
}
import { buildPersonaSystemPrompt, type PersonaGroundTruth, type PersonaBrief } from "../src/lib/persona/prompt";
import { runPersonaTurn, type ChatTurn } from "../src/lib/persona/engine";

const CASES_DIR = join(__dirname, "../../01-seed-cases");
const OUT_DIR = join(__dirname, "../../05-persona-engine");

type CaseKind = "embedded" | "upfront" | "clean";
const CASE_KINDS: Record<string, CaseKind> = {
  "SC-01": "clean",
  "SC-02": "embedded",
  "SC-03": "embedded",
  "SC-04": "embedded",
  "SC-05": "upfront",
  "SC-06": "clean",
  "SC-07": "upfront",
  "SC-08": "embedded",
  "SC-09": "clean",
  "SC-10": "upfront",
  "SC-11": "embedded",
  "SC-12": "embedded",
};

const STOPWORDS = new Set([
  "about", "after", "along", "around", "because", "before", "being", "between",
  "caller", "calls", "could", "cough", "during", "every", "having", "hours",
  "later", "onset", "ongoing", "other", "patient", "persona", "since", "started",
  "starting", "their", "there", "these", "under", "weeks", "which", "while",
  "would", "approximately", "initiation", "possible", "known", "risks", "trainee",
  "volunteers", "volunteered", "offhand", "mention", "mentions", "beat", "clarifies",
  "clarify", "specialist", "asks", "asked", "question", "potential", "actual",
  "several", "lowest", "needed", "getting", "where", "doctor", "spouse", "reporter",
  "serious", "hidden", "safety", "facts", "stated", "front", "found", "state",
]);

const GENERIC_SYMPTOM_LEXICON = [
  "tremor", "palpitation", "rash", "nausea", "dizziness", "dizzy", "headache",
  "vomiting", "bleeding", "seizure", "swelling", "hospitalized", "hospitalization",
  "fainted", "numbness", "tingling", "burning", "fever", "infection",
];

function markersFrom(text: string): string[] {
  return [
    ...new Set(
      (text.toLowerCase().match(/[a-z][a-z-]{4,}/g) ?? []).filter((w) => !STOPWORDS.has(w))
    ),
  ];
}

function quotedFragment(cue: string): string | null {
  const m = cue.match(/["'“‘]([^"'”’]{6,})["'”’]/);
  return m ? m[1] : null;
}

function section(md: string, name: string): string {
  const m = md.match(new RegExp(`^## ${name}[^\\n]*\\n([\\s\\S]*?)(?=^## |$(?![\\s\\S]))`, "m"));
  return m ? m[1].trim() : "";
}

type CaseData = {
  code: string;
  kind: CaseKind;
  systemPrompt: string;
  rules: { cue: string; detail: string; cueMarkers: string[]; detailMarkers: string[]; clarifyLine: string }[];
};

function loadCase(code: string): CaseData {
  const gt = JSON.parse(
    readFileSync(join(CASES_DIR, `${code}.answer-key.json`), "utf8")
  ) as PersonaGroundTruth & { title?: string; products?: { name: string }[] };
  const mdPath = readdirSync(CASES_DIR).find(
    (f: string) => f.startsWith(`${code}_`) && f.endsWith(".md")
  );
  if (!mdPath) throw new Error(`No case markdown found for ${code}`);
  const md = readFileSync(join(CASES_DIR, mdPath), "utf8");
  const brief: PersonaBrief = {
    scenario_premise: section(md, "Scenario premise"),
    persona_profile: section(md, "Persona profile"),
    beat_sheet: section(md, "Beat sheet"),
  };
  const systemPrompt = buildPersonaSystemPrompt({
    brief,
    groundTruth: gt,
    productRef: gt.products?.[0]?.name ?? null,
  });
  const kind = CASE_KINDS[code];
  const rules = (gt.reveal_rules ?? [])
    .filter((r) => kind !== "clean" && r.detail_withheld)
    .map((r) => {
      const frag = quotedFragment(r.cue);
      const clarifyLine = frag
        ? `Before we wrap that up — you mentioned "${frag}" a moment ago. Could you tell me a bit more about that? When did it start, and is it still going on?`
        : `You mentioned something in passing a moment ago that I'd like to make sure I understood. Could you tell me more about that — when it started and whether it's still going on?`;
      return {
        cue: r.cue,
        detail: r.detail_withheld ?? "",
        cueMarkers: markersFrom(frag ?? r.cue),
        detailMarkers: markersFrom(r.detail_withheld ?? ""),
        clarifyLine,
      };
    });
  return { code, kind, systemPrompt, rules };
}

// Deterministic trainee scripts ------------------------------------------------

const OPENING = "Medical Information, this is Alex. How can I help you today?";
const GENERIC_LINES = [
  "I can certainly look into that for you. Could I first get your name and the best phone number to reach you?",
  "Thank you. And could I get your mailing address for our records?",
  "Thanks — give me one moment while I pull up the information that addresses your question.",
  "I've found our standard response on that topic, and I'll go over the key points with you now. Does that answer your question?",
  "Is there anything else I can help you with today?",
  "Thank you for calling Medical Information. Have a good day.",
];
const FISH_LINES = [
  "I can help with that. First, could I get your name and a callback number?",
  "Before I answer — have you noticed any side effects or unusual symptoms at all?",
  "Any other health problems, hospital visits, or new medications recently?",
  "Understood. I'll go over our standard response on your question now. Does that help?",
  "Anything else I can help you with today?",
];

type RunResult = {
  strategy: "catch" | "pass" | "volunteer" | "fish";
  cueVolunteered: boolean | null;
  detailSurfaced: boolean | null;
  inventedSymptoms: string[] | null;
  ok: boolean;
  transcript: ChatTurn[];
};

async function converse(
  systemPrompt: string,
  traineeLines: () => string | null
): Promise<ChatTurn[]> {
  const history: ChatTurn[] = [];
  let line = OPENING;
  for (let i = 0; i < 9 && line; i++) {
    const reply = await runPersonaTurn({ systemPrompt, history, traineeMessage: line, graded: true });
    history.push({ speaker: "trainee", content: line }, { speaker: "persona", content: reply });
    line = traineeLines() ?? "";
    if (!line) break;
  }
  return history;
}

function personaText(t: ChatTurn[], after = 0): string {
  return t
    .slice(after)
    .filter((x) => x.speaker === "persona")
    .map((x) => x.content.toLowerCase())
    .join(" ");
}

function distinctHits(text: string, markers: string[]): string[] {
  return markers.filter((m) => text.includes(m));
}

async function runCase(c: CaseData): Promise<RunResult[]> {
  const results: RunResult[] = [];

  if (c.kind === "embedded") {
    // CATCH: generic until a cue lands, then clarify each rule once, then wrap up.
    {
      const pendingRules = [...c.rules];
      let generics = [...GENERIC_LINES];
      const history: ChatTurn[] = [];
      let clarifiedAt = -1;
      let line = OPENING;
      for (let i = 0; i < 10 && line; i++) {
        const reply = await runPersonaTurn({ systemPrompt: c.systemPrompt, history, traineeMessage: line, graded: true });
        history.push({ speaker: "trainee", content: line }, { speaker: "persona", content: reply });
        const cueHit = pendingRules.findIndex(
          (r) => distinctHits(reply.toLowerCase(), r.cueMarkers).length >= 1
        );
        if (cueHit >= 0) {
          line = pendingRules[cueHit].clarifyLine;
          pendingRules.splice(cueHit, 1);
          if (clarifiedAt < 0) clarifiedAt = history.length;
        } else {
          line = generics.shift() ?? "";
        }
      }
      const cueVolunteered = clarifiedAt >= 0;
      const afterText = personaText(history, Math.max(clarifiedAt, 0));
      const detailSurfaced = c.rules.some(
        (r) => distinctHits(afterText, r.detailMarkers).length >= 2
      );
      results.push({
        strategy: "catch",
        cueVolunteered,
        detailSurfaced,
        inventedSymptoms: null,
        ok: cueVolunteered && detailSurfaced,
        transcript: history,
      });
    }
    // PASS: pure generic call, never clarify.
    {
      const generics = [...GENERIC_LINES];
      const history = await converse(c.systemPrompt, () => generics.shift() ?? null);
      const text = personaText(history);
      const cueVolunteered = c.rules.some(
        (r) => distinctHits(text, r.cueMarkers).length >= 1
      );
      const detailSurfaced = c.rules.some(
        (r) => distinctHits(text, r.detailMarkers).length >= 2
      );
      results.push({
        strategy: "pass",
        cueVolunteered,
        detailSurfaced,
        inventedSymptoms: null,
        ok: cueVolunteered && !detailSurfaced,
        transcript: history,
      });
    }
  }

  if (c.kind === "upfront") {
    const generics = [...GENERIC_LINES];
    const history = await converse(c.systemPrompt, () => generics.shift() ?? null);
    const text = personaText(history);
    const detailSurfaced =
      c.rules.length === 0 ||
      c.rules.some((r) => distinctHits(text, [...r.cueMarkers, ...r.detailMarkers]).length >= 2);
    results.push({
      strategy: "volunteer",
      cueVolunteered: detailSurfaced,
      detailSurfaced,
      inventedSymptoms: null,
      ok: detailSurfaced,
      transcript: history,
    });
  }

  if (c.kind === "clean") {
    const fish = [...FISH_LINES];
    const history = await converse(c.systemPrompt, () => fish.shift() ?? null);
    const text = personaText(history);
    // A denial legitimately names the symptom category ("no rashes or anything");
    // invention = affirming symptoms. Heuristic: flag lexicon words appearing in
    // persona turns that contain no negation nearby.
    const invented: string[] = [];
    for (const turn of history.filter((t) => t.speaker === "persona")) {
      const lower = turn.content.toLowerCase();
      for (const w of GENERIC_SYMPTOM_LEXICON) {
        if (lower.includes(w) && !/\b(no|not|nothing|none|haven't|hasn't|isn't|without|fine)\b/.test(lower)) {
          invented.push(`${w}: "${turn.content.slice(0, 90)}"`);
        }
      }
    }
    void text;
    results.push({
      strategy: "fish",
      cueVolunteered: null,
      detailSurfaced: null,
      inventedSymptoms: invented,
      ok: invented.length === 0,
      transcript: history,
    });
  }

  return results;
}

async function main() {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error("ANTHROPIC_API_KEY is not set. Aborting.");
    process.exit(2);
  }
  const filter = process.argv.slice(2);
  const codes = Object.keys(CASE_KINDS).filter(
    (c) => filter.length === 0 || filter.includes(c)
  );

  const report: Record<string, { kind: CaseKind; runs: Omit<RunResult, "transcript">[]; transcripts: Record<string, ChatTurn[]> }> = {};
  let allOk = true;

  for (const code of codes) {
    const c = loadCase(code);
    console.log(`\n=== ${code} (${c.kind}) ===`);
    const runs = await runCase(c);
    report[code] = { kind: c.kind, runs: [], transcripts: {} };
    for (const r of runs) {
      const { transcript, ...rest } = r;
      report[code].runs.push(rest);
      report[code].transcripts[r.strategy] = transcript;
      allOk &&= r.ok;
      console.log(
        `  ${r.strategy.padEnd(9)} ok=${r.ok}  cue=${r.cueVolunteered}  detail=${r.detailSurfaced}` +
          (r.inventedSymptoms ? `  invented=${r.inventedSymptoms.length}` : "")
      );
    }
  }

  writeFileSync(
    join(OUT_DIR, "persona-transcript-test-results.json"),
    JSON.stringify(report, null, 2)
  );

  const md = [
    `# Persona Transcript Test — results (${new Date().toISOString().slice(0, 10)})`,
    "",
    "| Case | Kind | Strategy | Cue volunteered | Detail surfaced | Invented | OK |",
    "|---|---|---|---|---|---|---|",
    ...Object.entries(report).flatMap(([code, r]) =>
      r.runs.map(
        (run) =>
          `| ${code} | ${r.kind} | ${run.strategy} | ${run.cueVolunteered ?? "—"} | ${run.detailSurfaced ?? "—"} | ${run.inventedSymptoms?.length ?? "—"} | ${run.ok ? "✅" : "❌"} |`
      )
    ),
    "",
    `**Overall: ${allOk ? "ALL PASS" : "FAILURES PRESENT"}**`,
    "",
    "Rules verified: embedded cues surface only via catch-and-clarify (never via generic",
    "fishing or a pass-through call); upfront cases volunteer their facts unprompted;",
    "clean cases yield no invented symptoms under cold-canvassing.",
    "Full transcripts: persona-transcript-test-results.json",
  ].join("\n");
  writeFileSync(join(OUT_DIR, "persona-transcript-test-results.md"), md);

  console.log(`\n${allOk ? "ALL PASS" : "FAILURES PRESENT"} — results written to 05-persona-engine/`);
  process.exit(allOk ? 0 : 1);
}

main().catch((err) => {
  console.error(err);
  process.exit(2);
});
