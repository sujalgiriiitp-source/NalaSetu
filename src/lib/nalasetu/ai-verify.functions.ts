import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const dataUrl = z.string().max(3_000_000).regex(/^data:image\/(jpeg|png|webp);base64,/);
const verificationInput = z.object({
  before: dataUrl,
  after: dataUrl,
  drainId: z.string().max(20),
  drainName: z.string().max(120),
});
const lambdaVerification = z.object({
  verdict: z.enum(["PASS", "REVIEW"]),
  confidence: z.number().min(0).max(100),
  reason: z.string(),
  sameLocation: z.boolean().optional(),
  obstructionBefore: z.boolean().optional(),
  obstructionAfter: z.boolean().optional(),
  mode: z.enum(["bedrock", "demo", "fallback", "lovable-ai"]),
});
const configuredApiUrl = () =>
  (typeof process !== "undefined"
    ? process.env["NALASETU_API_URL"] ?? process.env["VITE_NALASETU_API_URL"]
    : undefined) ??
  (typeof import.meta !== "undefined"
    ? import.meta.env?.["VITE_NALASETU_API_URL"]
    : undefined);

export const verifyProof = createServerFn({ method: "POST" })
  .inputValidator((d) => verificationInput.parse(d))
  .handler(async ({ data }) => {
    if (data.before === data.after) return { ok: true as const, verdict: "REVIEW" as const, confidence: 0, reason: "Before and after images are identical.", sameLocation: true, obstructionBefore: true, obstructionAfter: true, mode: "demo" as const };

    // Route through the AWS Lambda API (which internally calls Bedrock)
    const apiUrl = configuredApiUrl();
    if (apiUrl) {
      try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 30_000);
        const res = await fetch(`${apiUrl.replace(/\/$/, "")}/api/verify`, {
          method: "POST",
          headers: { "Content-Type": "application/json", "Accept": "application/json" },
          body: JSON.stringify({ before: data.before, after: data.after }),
          signal: controller.signal,
        });
        clearTimeout(timer);

        if (res.ok) {
          const body = await res.json();
          const v = body.verification ?? body;
          const mode = ["bedrock", "demo", "fallback"].includes(v.mode) ? v.mode : "fallback";
          return {
            ok: true as const,
            verdict: (v.verdict === "PASS" ? "PASS" : "REVIEW") as "PASS" | "REVIEW",
            confidence: typeof v.confidence === "number" ? v.confidence : 0,
            reason: v.reason ?? "No reason provided.",
            sameLocation: v.sameLocation ?? true,
            obstructionBefore: v.obstructionBefore ?? true,
            obstructionAfter: v.obstructionAfter ?? false,
            mode,
          };
        }
        // Non-OK HTTP — fall through to Lovable fallback
        console.error(`AWS Lambda verify returned HTTP ${res.status}`);
      } catch (e) {
        console.error("AWS Lambda verification failed, trying Lovable fallback:", e);
      }
    }

    // Lovable AI fallback (original path)
    try {
      const { verifyWithAi, GatewayError } = await import("./ai-verify.server");
      const v = await verifyWithAi(data.before, data.after, { id: data.drainId, name: data.drainName });
      return { ok: true as const, ...v, mode: "lovable-ai" as const };
    } catch (e) {
      const { GatewayError } = await import("./ai-verify.server");
      console.error("AI verification failed", e);
      return { ok: false as const, status: e instanceof GatewayError ? e.status : 500, error: e instanceof GatewayError ? e.message : "AI verification unavailable." };
    }
  });

export const verifyProofWithLambda = createServerFn({ method: "POST" })
  .inputValidator((d) => verificationInput.parse(d))
  .handler(async ({ data }) => {
    const apiUrl = configuredApiUrl();
    if (!apiUrl) {
      return { ok: false as const, error: "AWS Lambda verification unavailable: NALASETU_API_URL or VITE_NALASETU_API_URL is not configured." };
    }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 30_000);
    try {
      const response = await fetch(`${apiUrl.replace(/\/$/, "")}/api/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ before: data.before, after: data.after }),
        signal: controller.signal,
      });
      const responseText = await response.text();
      if (!response.ok) {
        return { ok: false as const, error: `AWS Lambda verification returned HTTP ${response.status}: ${responseText || response.statusText}` };
      }

      let payload: unknown;
      try {
        payload = JSON.parse(responseText);
      } catch {
        return { ok: false as const, error: "AWS Lambda verification returned invalid JSON." };
      }
      const candidate =
        typeof payload === "object" && payload !== null && "verification" in payload
          ? payload.verification
          : payload;
      const result = lambdaVerification.safeParse(candidate);
      if (!result.success) {
        return { ok: false as const, error: `AWS Lambda verification returned an invalid response: ${result.error.message}` };
      }

      return { ok: true as const, ...result.data };
    } catch (error) {
      const message =
        error instanceof Error && error.name === "AbortError"
          ? "request timed out after 30 seconds"
          : error instanceof Error
            ? error.message
            : String(error);
      return { ok: false as const, error: `AWS Lambda verification request failed: ${message}` };
    } finally {
      clearTimeout(timer);
    }
  });
