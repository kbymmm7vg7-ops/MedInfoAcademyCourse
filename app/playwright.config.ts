import { defineConfig, devices } from "@playwright/test";
import fs from "fs";

// The E2E suite (app/e2e) has exactly one spec, and it self-skips unless all
// four E2E_SUPABASE_URL / E2E_SUPABASE_ANON_KEY / E2E_TRAINEE_EMAIL /
// E2E_TRAINEE_PASSWORD env vars are set — see e2e/simulator-case.spec.ts.
// That means `npx playwright test` is green-by-skip on a fresh clone / in CI
// with no env configured.

// Some machines have a normally-installed Playwright browser (via
// `npx playwright install`); others rely on the Chromium preinstalled at a
// fixed path outside node_modules. Only pin `executablePath` when that path
// actually exists, so this config never breaks the "normal install" case.
// PLAYWRIGHT_CHROMIUM_EXECUTABLE lets an operator override the path.
const chromiumExecutablePath =
  process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE ?? "/opt/pw-browsers/chromium";
const hasPreinstalledChromium = fs.existsSync(chromiumExecutablePath);

const baseURL = process.env.E2E_BASE_URL ?? "http://localhost:3000";
const baseURLPort = Number(new URL(baseURL).port) || 3000;

export default defineConfig({
  testDir: "./e2e",
  timeout: 60_000,
  expect: { timeout: 10_000 },
  fullyParallel: false,
  retries: 0,
  reporter: "list",
  use: {
    baseURL,
    trace: "retain-on-failure",
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        ...(hasPreinstalledChromium
          ? { launchOptions: { executablePath: chromiumExecutablePath } }
          : {}),
      },
    },
  ],
  // Only start a dev server ourselves when the operator hasn't pointed the
  // run at an already-running one via E2E_BASE_URL.
  ...(process.env.E2E_BASE_URL
    ? {}
    : {
        webServer: {
          command: "npm run dev",
          // Port-based readiness (not `url`) on purpose: `next dev` opens the
          // port well before the app can serve real 2xx responses — e.g. an
          // unconfigured Supabase client makes every route 500 — and this
          // spec is skip-only unless all four E2E_* vars are set anyway, so
          // "the dev server process is up" is all a bare `npx playwright
          // test` run (no env configured) needs from this check.
          port: baseURLPort,
          reuseExistingServer: true,
          timeout: 120_000,
        },
      }),
});
