import { describe, expect, it } from "vitest";
import { canChangeActiveStatus, type DeactivationActor, type DeactivationTarget } from "./user-deactivation";

const platformAdmin: DeactivationActor = { id: "pa-1", role: "platform_admin", orgId: null };
const orgAdminA: DeactivationActor = { id: "admin-a", role: "admin", orgId: "org-a" };
const orgAdminB: DeactivationActor = { id: "admin-b", role: "admin", orgId: "org-b" };
const trainer: DeactivationActor = { id: "trainer-1", role: "trainer", orgId: "org-a" };
const qa: DeactivationActor = { id: "qa-1", role: "qa", orgId: "org-a" };
const trainee: DeactivationActor = { id: "trainee-1", role: "trainee", orgId: "org-a" };

const userInOrgA: DeactivationTarget = { id: "u-1", orgId: "org-a" };
const userInOrgB: DeactivationTarget = { id: "u-2", orgId: "org-b" };
const b2cUser: DeactivationTarget = { id: "u-3", orgId: null };

describe("canChangeActiveStatus", () => {
  it("denies self-deactivation for every role, including platform_admin", () => {
    expect(canChangeActiveStatus(platformAdmin, { id: platformAdmin.id, orgId: null })).toBe(false);
    expect(canChangeActiveStatus(orgAdminA, { id: orgAdminA.id, orgId: "org-a" })).toBe(false);
  });

  it("platform_admin may change any other user, in or out of an org", () => {
    expect(canChangeActiveStatus(platformAdmin, userInOrgA)).toBe(true);
    expect(canChangeActiveStatus(platformAdmin, userInOrgB)).toBe(true);
    expect(canChangeActiveStatus(platformAdmin, b2cUser)).toBe(true);
  });

  it("org admin may change users within their own org only", () => {
    expect(canChangeActiveStatus(orgAdminA, userInOrgA)).toBe(true);
    expect(canChangeActiveStatus(orgAdminA, userInOrgB)).toBe(false);
  });

  it("org admin may not change a B2C (org-less) user", () => {
    expect(canChangeActiveStatus(orgAdminA, b2cUser)).toBe(false);
  });

  it("an org admin from a different org cannot reach into another org", () => {
    expect(canChangeActiveStatus(orgAdminB, userInOrgA)).toBe(false);
  });

  it("trainer, qa, and trainee may never change anyone's active status", () => {
    expect(canChangeActiveStatus(trainer, userInOrgA)).toBe(false);
    expect(canChangeActiveStatus(qa, userInOrgA)).toBe(false);
    expect(canChangeActiveStatus(trainee, userInOrgA)).toBe(false);
  });
});
