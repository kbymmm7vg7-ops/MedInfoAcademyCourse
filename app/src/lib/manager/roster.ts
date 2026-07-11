// Pure roster-input parsing for Cohort Lite (spec_admin-dashboard.md §4.7).
// Accepts either one email per line or CSV text with an "email" column.
// Kept out of cohort-actions.ts because "use server" modules may only export
// async functions, and this needs plain unit tests.

const EMAIL_RE = /^[^\s@,;"']+@[^\s@,;"']+\.[^\s@,;"']+$/;

/** Hard cap per upload — keeps `.in()` filters and audit rows sane. */
export const MAX_ROSTER_EMAILS = 500;

function splitCsvLine(line: string): string[] {
  return line
    .split(",")
    .map((cell) => cell.trim().replace(/^"(.*)"$/, "$1").trim());
}

const HEADER_NAMES = new Set(["email", "e-mail", "email address", "email_address"]);

/**
 * Extracts a de-duplicated, lowercased list of emails from pasted text or an
 * uploaded CSV. Supports:
 * - one email per line;
 * - CSV rows where a header line names an "email" column (that column wins);
 * - headerless CSV rows (the first cell that looks like an email wins).
 * Lines yielding nothing email-shaped are silently skipped — the caller
 * reports match results against real users, not parse noise.
 */
export function parseRosterEmails(raw: string): string[] {
  const lines = raw
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  if (lines.length === 0) return [];

  // Header detection: a first line with a cell literally named "email"
  // (an actual address never matches these names).
  let emailCol = -1;
  let startIdx = 0;
  const headerCells = splitCsvLine(lines[0]).map((c) => c.toLowerCase());
  const headerIdx = headerCells.findIndex((c) => HEADER_NAMES.has(c));
  if (headerIdx !== -1) {
    emailCol = headerIdx;
    startIdx = 1;
  }

  const seen = new Set<string>();
  const emails: string[] = [];
  for (let i = startIdx; i < lines.length; i++) {
    const cells = splitCsvLine(lines[i]);
    const candidate =
      emailCol !== -1
        ? cells[emailCol]
        : cells.find((c) => EMAIL_RE.test(c.toLowerCase()));
    const email = (candidate ?? "").toLowerCase();
    if (!EMAIL_RE.test(email) || seen.has(email)) continue;
    seen.add(email);
    emails.push(email);
  }
  return emails;
}
