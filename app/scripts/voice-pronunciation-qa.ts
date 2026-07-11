// Seed-case pronunciation QA (PRD §5.1a / voice spec §Captions & QA):
// synthesize each fictional branded name through the dev TTS voice and save
// the audio for Nathan's sign-off before the cases go live on voice.
//
// Run from app/:  npx tsx scripts/voice-pronunciation-qa.ts [--vendor elevenlabs]
// Output: 06-voice-layer/pronunciation-qa/<vendor>/<Name>.{wav|mp3} + README.md

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";

// tsx does not auto-load Next's .env.local — load it so GROQ_API_KEY works.
const envPath = join(__dirname, "../.env.local");
if (existsSync(envPath)) {
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim();
  }
}

import { getTts, resolveTtsVendor, voiceForBackground } from "../src/lib/voice/config";

// The seven fictional brands (voice spec §Captions & QA).
const BRAND_LINES: Record<string, string> = {
  Cardizan: "I've been taking Cardizan for about six weeks now. Cardizan.",
  Pulmonara: "My husband just started the Pulmonara inhaler. Pulmonara.",
  Neurovance: "I've been on Neurovance the whole time. Neurovance.",
  Dermelia: "How long am I supposed to use Dermelia? Dermelia.",
  Gastroquell: "Why isn't Gastroquell working right away? Gastroquell.",
  Osteveda: "It started a few hours after the Osteveda injection. Osteveda.",
  Immunexa: "She's been on Immunexa for about four months. Immunexa.",
};

async function main() {
  const vendorArg = process.argv.includes("--vendor")
    ? process.argv[process.argv.indexOf("--vendor") + 1]
    : null;
  const vendor = resolveTtsVendor(vendorArg);
  if (vendorArg === "elevenlabs" && vendor !== "elevenlabs") {
    throw new Error("--vendor elevenlabs requested but ELEVENLABS_API_KEY is not set");
  }
  const tts = getTts(vendor);
  const voiceId = voiceForBackground(vendor, "patient");
  const outDir = join(__dirname, "../../06-voice-layer/pronunciation-qa", vendor);
  mkdirSync(outDir, { recursive: true });

  const rows: string[] = [];
  for (const [name, line] of Object.entries(BRAND_LINES)) {
    const result = await tts.synthesize(line, voiceId);
    const ext = result.mimeType === "audio/mpeg" ? "mp3" : "wav";
    const file = `${name}.${ext}`;
    writeFileSync(join(outDir, file), Buffer.from(result.audio));
    rows.push(`| ${name} | ${file} | ${result.ms} ms | ☐ |`);
    console.log(`✓ ${name} → ${file} (${result.ms} ms, ${Math.round(result.audio.byteLength / 1024)} KB)`);
  }

  const readme = [
    `# Pronunciation QA — ${tts.vendor} (voice: ${voiceId})`,
    "",
    `Generated ${new Date().toISOString().slice(0, 10)} by app/scripts/voice-pronunciation-qa.ts.`,
    "Listen to each clip and tick the box when the branded name is pronounced acceptably",
    "(PRD §5.1a QA step — required before the case goes live on voice).",
    "",
    "| Brand | File | TTS latency | Nathan sign-off |",
    "|---|---|---|---|",
    ...rows,
    "",
  ].join("\n");
  writeFileSync(join(outDir, "README.md"), readme);
  console.log(`\nQA sheet → ${join(outDir, "README.md")}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
