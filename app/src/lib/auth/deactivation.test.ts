import { describe, expect, it } from "vitest";
import { isDeactivated } from "./deactivation";

describe("isDeactivated", () => {
  it("is false when there is no deactivated_at value", () => {
    expect(isDeactivated(null)).toBe(false);
    expect(isDeactivated(undefined)).toBe(false);
  });

  it("is true for any timestamp value, regardless of when it was set", () => {
    expect(isDeactivated("2026-07-11T00:00:00.000Z")).toBe(true);
    expect(isDeactivated("2099-01-01T00:00:00.000Z")).toBe(true);
    expect(isDeactivated("2000-01-01T00:00:00.000Z")).toBe(true);
  });

  it("is true even for an empty string (only null/undefined mean active)", () => {
    // A defensive case: the DB column is nullable, not an empty-string default,
    // but the guard should not accidentally treat a falsy-but-present value
    // as "active".
    expect(isDeactivated("")).toBe(true);
  });
});
