/**
 * POST /api/nalasetu/seed-drains
 *
 * Server-only route (TanStack Start server function) that seeds the 40
 * synthetic demo drain records into AWS DynamoDB through the Lambda API.
 * Never runs in the browser — credentials (if any) stay server-side.
 *
 * The Lambda endpoint POST /api/drains/seed is expected to accept:
 *   { drains: DrainBase[] }
 * and respond with:
 *   { seeded: number, skipped?: number }
 *
 * Security:
 *   - The AWS API Gateway URL is read from NALASETU_API_URL (server env)
 *     OR VITE_NALASETU_API_URL (shared). No secret keys are used here.
 *   - Lambda itself uses its execution role for DynamoDB access.
 */

import { createServerFn } from "@tanstack/react-start";
import { buildDemoDrains } from "@/lib/nalasetu/data";

const SERVER_API_URL =
  process.env["NALASETU_API_URL"] ??
  process.env["VITE_NALASETU_API_URL"] ??
  "";

async function lambdaFetch<T>(path: string, body: unknown, timeoutMs = 30_000): Promise<T> {
  if (!SERVER_API_URL) throw new Error("VITE_NALASETU_API_URL is not configured.");
  const url = `${SERVER_API_URL.replace(/\/$/, "")}${path}`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    clearTimeout(timer);
    const text = await res.text();
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${text}`);
    return JSON.parse(text) as T;
  } finally {
    clearTimeout(timer);
  }
}

export type SeedResult =
  | { ok: true; seeded: number; skipped?: number }
  | { ok: false; error: string };

/**
 * Seed the 40 synthetic NalaSetu demo drains into DynamoDB.
 * Can be called once during first deploy or reset.
 */
export const seedDemoDrains = createServerFn({ method: "POST" }).handler(
  async (): Promise<SeedResult> => {
    try {
      const drains = buildDemoDrains();
      const raw = await lambdaFetch<{ seeded: number; skipped?: number }>(
        "/api/drains/seed",
        { drains },
      );
      const out: SeedResult = { ok: true, seeded: raw.seeded };
      if (raw.skipped !== undefined) (out as { ok: true; seeded: number; skipped?: number }).skipped = raw.skipped;
      return out;
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      console.error("[seed-drains] Failed:", msg);
      return { ok: false, error: msg };
    }
  },
);
