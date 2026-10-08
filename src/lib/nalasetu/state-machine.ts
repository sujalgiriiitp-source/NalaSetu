import type { TaskStatus } from "./types";

export const TRANSITIONS: Record<TaskStatus, TaskStatus[]> = {
  UNASSIGNED: ["ASSIGNED"],
  ASSIGNED: ["EN_ROUTE", "UNASSIGNED"],
  EN_ROUTE: ["CLEANING"],
  CLEANING: ["PROOF_SUBMITTED"],
  PROOF_SUBMITTED: ["VERIFIED", "NEEDS_REVIEW", "REJECTED"],
  NEEDS_REVIEW: ["VERIFIED", "REJECTED"],
  REJECTED: ["ASSIGNED"],
  VERIFIED: [],
};

export function canTransition(from: TaskStatus, to: TaskStatus) {
  return TRANSITIONS[from].includes(to);
}

export const STATUS_LABEL: Record<TaskStatus, string> = {
  UNASSIGNED: "Unassigned",
  ASSIGNED: "Assigned",
  EN_ROUTE: "En Route",
  CLEANING: "Cleaning",
  PROOF_SUBMITTED: "Proof Submitted",
  VERIFIED: "Verified",
  NEEDS_REVIEW: "Needs Review",
  REJECTED: "Rejected",
};
