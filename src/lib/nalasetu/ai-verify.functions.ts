import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const dataUrl = z.string().max(3_000_000).regex(/^data:image\/(jpeg|png|webp);base64,/);

export const verifyProof = createServerFn({ method: "POST" })
  .inputValidator((d) => z.object({ before: dataUrl, after: dataUrl, drainId: z.string().max(20), drainName: z.string().max(120) }).parse(d))
  .handler(async ({ data }) => {
    if (data.before === data.after) return { ok: true as const, verdict: "REVIEW" as const, confidence: 0, reason: "Before and after images are identical.", sameLocation: true, obstructionBefore: true, obstructionAfter: true, mode: "demo" as const };

    // Route through the AWS Lambda API (which internally calls Bedrock)
    const apiUrl = process.env["VITE_NALASETU_API_URL"];
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
          return {
            ok: true as const,
            verdict: (v.verdict === "PASS" ? "PASS" : "REVIEW") as "PASS" | "REVIEW",
            confidence: typeof v.confidence === "number" ? v.confidence : 0,
            reason: v.reason ?? "No reason provided.",
            sameLocation: v.sameLocation ?? true,
            obstructionBefore: v.obstructionBefore ?? true,
            obstructionAfter: v.obstructionAfter ?? false,
            mode: v.mode ?? "bedrock",
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
