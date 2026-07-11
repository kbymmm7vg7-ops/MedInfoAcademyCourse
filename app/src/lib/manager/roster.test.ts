import { describe, expect, it } from "vitest";
import { parseRosterEmails } from "./roster";

describe("parseRosterEmails", () => {
  it("parses one email per line, lowercased and de-duplicated", () => {
    expect(
      parseRosterEmails("Alice@Example.com\n\n bob@example.com \nalice@example.com\n")
    ).toEqual(["alice@example.com", "bob@example.com"]);
  });

  it("uses the email column when a CSV header names one", () => {
    const csv = [
      "full_name,Email,cohort",
      "Alice A,alice@example.com,spring",
      '"Bob B","bob@example.com",spring',
      "No Email Here,,spring",
    ].join("\n");
    expect(parseRosterEmails(csv)).toEqual(["alice@example.com", "bob@example.com"]);
  });

  it("falls back to the first email-shaped cell for headerless CSV rows", () => {
    expect(parseRosterEmails("Alice A,alice@example.com\nbob@example.com,Bob B")).toEqual([
      "alice@example.com",
      "bob@example.com",
    ]);
  });

  it("does not treat a lone email on the first line as a header", () => {
    expect(parseRosterEmails("alice@example.com\nbob@example.com")).toEqual([
      "alice@example.com",
      "bob@example.com",
    ]);
  });

  it("skips lines with nothing email-shaped and handles empty input", () => {
    expect(parseRosterEmails("")).toEqual([]);
    expect(parseRosterEmails("not an email\n---\n@nope\n")).toEqual([]);
  });
});
