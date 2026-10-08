/**
 * NalaSetu AWS API Client
 *
 * Thin typed wrapper around the AWS API Gateway (nalasetu-api Lambda).
 * All calls go through this module — no raw fetch elsewhere.
 *
 * Security: The base URL is read from VITE_NALASETU_API_URL (env var set
 * server-side and injected at build time by Vite). No AWS credentials or
 * secret keys are ever present in frontend code.
 *
 * Demo fallback: every exported function returns { ok: false, demo: true }
 * when the env var is unset or the request fails, so the app always works.
 */

import type { DrainBase, Task, Plan, TaskStatus, CitizenReport } from "./types";

// ─── base URL ────────────────────────────────────────────────────────────────

const BASE_URL =
  typeof import.meta !== "undefined"
    ? (import.meta.env?.["VITE_NALASETU_API_URL"] as string | undefined) ?? ""
    : "";

export const AWS_CONFIGURED = BASE_URL.trim().length > 0;

// ─── helpers ─────────────────────────────────────────────────────────────────

type Ok<T> = { ok: true; data: T; demo?: false };
type Err = { ok: false; error: string; demo?: boolean };
type Result<T> = Ok<T> | Err;

async function apiFetch<T>(
  path: string,
  init?: RequestInit,
  timeoutMs = 8000,
): Promise<Result<T>> {
  if (!AWS_CONFIGURED) {
    return { ok: false, error: "AWS API URL not configured.", demo: true };
  }
  const url = `${BASE_URL.replace(/\/$/, "")}${path}`;
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    const res = await fetch(url, {
      ...init,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        ...(init?.headers ?? {}),
      },
    });
    clearTimeout(timer);
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      return { ok: false, error: `HTTP ${res.status}: ${text || res.statusText}` };
    }
    const data = (await res.json()) as T;
    return { ok: true, data };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return { ok: false, error: msg.includes("abort") ? "Request timed out." : msg };
  }
}

// ─── Shape of what the Lambda returns ────────────────────────────────────────
// These match the expected Lambda/DynamoDB schema. Adjust if Lambda returns
// different field names.

export interface AwsDrain {
  id: string;
  name: string;
  lat: number;
  lng: number;
  slope: string;
  lowLying: boolean;
  historicalChokes: number;
  lastCleaned: string;
  citizenReports: number;
  rainfallForecastMm: number;
  cleaningTimeMin: number;
  adjacentPopulationWeight: number;
  ward: string;
}

export interface AwsTask {
  id: string;
  drainId: string;
  crewId: string;
  order: number;
  status: TaskStatus;
  beforePhoto?: string;
  afterPhoto?: string;
  submittedAt?: string;
  verification?: {
    verdict: "PASS" | "REVIEW";
    confidence: number;
    reason: string;
    mode: "lovable-ai" | "bedrock" | "demo" | "fallback";
  };
  officerDecision?: "APPROVED" | "REJECTED";
  officerAt?: string;
}

export interface AwsPlan {
  id: string;
  createdAt: string;
  crews: Array<{
    crewId: string;
    drainIds: string[];
    cleaningMin: number;
    travelMin: number;
    totalMin: number;
    distanceKm: number;
  }>;
  hoursAvailable: number;
  hoursPlanned: number;
  highCoverage: number;
  naiveHighCoverage: number;
  dispatched: boolean;
}

export interface AwsImpact {
  completed: number;
  total: number;
  highCoveragePct: number;
  highDone: number;
  highTotal: number;
  exposurePct: number;
  crewMinutes: number;
}

export interface AwsSettings {
  scenario: "heavy" | "light";
  weatherMode: "demo" | "live";
  riskWeights?: { R: number; H: number; S: number; C: number };
}

export interface AwsVerification {
  verdict: "PASS" | "REVIEW";
  confidence: number;
  reason: string;
  sameLocation?: boolean;
  obstructionBefore?: boolean;
  obstructionAfter?: boolean;
  mode: "lovable-ai" | "bedrock" | "demo" | "fallback";
}

// ─── API endpoints ────────────────────────────────────────────────────────────

/** GET /api/drains — list all drain base records */
export async function listDrains(): Promise<Result<AwsDrain[]>> {
  return apiFetch<AwsDrain[]>("/api/drains");
}

/** GET /api/drains/:id — single drain detail */
export async function getDrain(id: string): Promise<Result<AwsDrain>> {
  return apiFetch<AwsDrain>(`/api/drains/${encodeURIComponent(id)}`);
}

/** POST /api/risk/recompute — re-score all drains with latest forecast */
export async function recomputeRisk(payload: {
  forecastMm72h: number;
}): Promise<Result<AwsDrain[]>> {
  return apiFetch<AwsDrain[]>("/api/risk/recompute", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/** POST /api/plans/generate — ask Lambda to generate an optimised plan */
export async function generatePlanAws(payload: {
  scenario: string;
  forecastMm72h: number;
}): Promise<Result<AwsPlan>> {
  return apiFetch<AwsPlan>("/api/plans/generate", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/** POST /api/plans/:id/dispatch — mark plan as dispatched, create tasks */
export async function dispatchPlan(planId: string): Promise<Result<{ tasks: AwsTask[] }>> {
  return apiFetch<{ tasks: AwsTask[] }>(`/api/plans/${encodeURIComponent(planId)}/dispatch`, {
    method: "POST",
    body: JSON.stringify({}),
  });
}

/** PATCH /api/tasks/:id — update a task's status */
export async function patchTask(
  taskId: string,
  patch: { status?: TaskStatus },
): Promise<Result<AwsTask>> {
  return apiFetch<AwsTask>(`/api/tasks/${encodeURIComponent(taskId)}`, {
    method: "PATCH",
    body: JSON.stringify(patch),
  });
}

/** POST /api/tasks/:id/proof — submit before/after photos */
export async function submitProofAws(
  taskId: string,
  payload: { before: string; after: string },
): Promise<Result<{ verification: AwsVerification }>> {
  return apiFetch<{ verification: AwsVerification }>(
    `/api/tasks/${encodeURIComponent(taskId)}/proof`,
    { method: "POST", body: JSON.stringify(payload) },
    30_000, // proof can take longer (AI call inside Lambda)
  );
}

/** POST /api/proofs/:id/verify — trigger AI verification for a proof */
export async function verifyProofAws(proofId: string): Promise<Result<AwsVerification>> {
  return apiFetch<AwsVerification>(`/api/proofs/${encodeURIComponent(proofId)}/verify`, {
    method: "POST",
    body: JSON.stringify({}),
  });
}

/** POST /api/proofs/:id/review — officer approve / reject */
export async function reviewProofAws(
  proofId: string,
  payload: { decision: "APPROVED" | "REJECTED"; officerName: string },
): Promise<Result<AwsTask>> {
  return apiFetch<AwsTask>(`/api/proofs/${encodeURIComponent(proofId)}/review`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/** GET /api/impact — aggregated impact stats from DynamoDB */
export async function getImpact(): Promise<Result<AwsImpact>> {
  return apiFetch<AwsImpact>("/api/impact");
}

/** GET /api/settings — fetch persisted settings */
export async function getSettings(): Promise<Result<AwsSettings>> {
  return apiFetch<AwsSettings>("/api/settings");
}

/** PATCH /api/settings — persist settings */
export async function patchSettings(
  patch: Partial<AwsSettings>,
): Promise<Result<AwsSettings>> {
  return apiFetch<AwsSettings>("/api/settings", {
    method: "PATCH",
    body: JSON.stringify(patch),
  });
}

/** Health-check — pings any fast endpoint to test connectivity */
export async function pingAws(): Promise<{ ok: boolean; latencyMs: number; error?: string }> {
  const t0 = Date.now();
  const res = await apiFetch<unknown>("/api/drains", undefined, 5000);
  const result: { ok: boolean; latencyMs: number; error?: string } = { ok: res.ok, latencyMs: Date.now() - t0 };
  if (!res.ok) result.error = (res as Err).error;
  return result;
}

/** POST /api/drains/seed — seed the 40 synthetic demo drains into DynamoDB (server-side only) */
export async function seedDrains(drains: DrainBase[]): Promise<Result<{ seeded: number }>> {
  return apiFetch<{ seeded: number }>("/api/drains/seed", {
    method: "POST",
    body: JSON.stringify({ drains }),
  });
}
