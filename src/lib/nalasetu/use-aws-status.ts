/**
 * useAwsStatus — React hook
 *
 * Pings the AWS API Gateway and reports connectivity status.
 * Used by the Settings page "AWS status" panel.
 * Never exposes credentials — only reads from the client-visible env var.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { pingAws, AWS_CONFIGURED } from "./aws-api";

export type AwsStatus = "idle" | "checking" | "connected" | "error" | "unconfigured";

export interface AwsStatusInfo {
  status: AwsStatus;
  latencyMs: number | null;
  error: string | null;
  lastChecked: string | null;
  check: () => void;
}

const POLL_INTERVAL_MS = 60_000; // Re-check every minute

export function useAwsStatus(): AwsStatusInfo {
  const [status, setStatus] = useState<AwsStatus>(
    AWS_CONFIGURED ? "idle" : "unconfigured",
  );
  const [latencyMs, setLatencyMs] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastChecked, setLastChecked] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const check = useCallback(async () => {
    if (!AWS_CONFIGURED) { setStatus("unconfigured"); return; }
    setStatus("checking");
    const result = await pingAws();
    setLastChecked(new Date().toISOString());
    if (result.ok) {
      setStatus("connected");
      setLatencyMs(result.latencyMs);
      setError(null);
    } else {
      setStatus("error");
      setError(result.error ?? "Unknown error");
    }
    // Schedule next check
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => void check(), POLL_INTERVAL_MS);
  }, []);

  useEffect(() => {
    void check();
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [check]);

  return { status, latencyMs, error, lastChecked, check };
}
