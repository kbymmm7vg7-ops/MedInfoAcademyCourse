import { describe, it, expect } from "vitest";
import {
  personaDailyTurnBudget,
  isOverTurnBudget,
  isGradedAttempt,
  startOfUtcDay,
  DEFAULT_PERSONA_DAILY_TURN_BUDGET,
} from "./budget";

describe("personaDailyTurnBudget", () => {
  it("defaults to 150 when unset or blank", () => {
    expect(personaDailyTurnBudget({})).toBe(DEFAULT_PERSONA_DAILY_TURN_BUDGET);
    expect(personaDailyTurnBudget({ PERSONA_DAILY_TURN_BUDGET: "" })).toBe(150);
    expect(personaDailyTurnBudget({ PERSONA_DAILY_TURN_BUDGET: "   " })).toBe(150);
  });

  it("reads a valid integer", () => {
    expect(personaDailyTurnBudget({ PERSONA_DAILY_TURN_BUDGET: "40" })).toBe(40);
    expect(personaDailyTurnBudget({ PERSONA_DAILY_TURN_BUDGET: "0" })).toBe(0);
  });

  it("falls back to the default on garbage rather than disabling the cap", () => {
    for (const bad of ["abc", "-5", "12.5", "NaN", "Infinity"]) {
      expect(personaDailyTurnBudget({ PERSONA_DAILY_TURN_BUDGET: bad })).toBe(150);
    }
  });
});

describe("isOverTurnBudget", () => {
  it("is false below the budget", () => {
    expect(isOverTurnBudget(0, 150)).toBe(false);
    expect(isOverTurnBudget(149, 150)).toBe(false);
  });

  it("is true at and past the budget (the check runs before the turn is spent)", () => {
    expect(isOverTurnBudget(150, 150)).toBe(true);
    expect(isOverTurnBudget(151, 150)).toBe(true);
  });

  it("a zero budget blocks everything", () => {
    expect(isOverTurnBudget(0, 0)).toBe(true);
  });
});

describe("startOfUtcDay", () => {
  it("truncates to midnight UTC", () => {
    expect(startOfUtcDay(new Date("2026-03-04T23:59:59.999Z"))).toBe("2026-03-04T00:00:00.000Z");
    expect(startOfUtcDay(new Date("2026-03-05T00:00:00.000Z"))).toBe("2026-03-05T00:00:00.000Z");
  });
});

describe("isGradedAttempt", () => {
  it("certification sittings are graded", () => {
    expect(isGradedAttempt("certification")).toBe(true);
  });

  it("plain practice is not graded", () => {
    expect(isGradedAttempt("practice")).toBe(false);
  });

  it("an instance with no attempt row is plain practice", () => {
    expect(isGradedAttempt(null)).toBe(false);
    expect(isGradedAttempt(undefined)).toBe(false);
  });

  it("an unknown future attempt type defaults to graded, not to the cheap model", () => {
    expect(isGradedAttempt("recertification")).toBe(true);
  });
});
