import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const dataUrl = z.string().max(3_000_000).regex(/^data:image\/(jpeg|png|webp);base64,/);

export const verifyProof = createServerFn({ method: "POST" })
  .inputValidator((d) => z.object({ before: dataUrl, after: dataUrl, drainId: z.string().max(20), drainName: z.string().max(120) }).parse(d))
  .handler(async ({ data }) => {
    const { verifyWithAi, GatewayError } = await import("./ai-verify.server");
    if (data.before === data.after) return { ok: true as const, verdict: "REVIEW" as const, confidence: 0, reason: "Before and after images are identical.", sameLocation: true, obstructionBefore: true, obstructionAfter: true };
    try {
      const v = await verifyWithAi(data.before, data.after, { id: data.drainId, name: data.drainName });
      return { ok: true as const, ...v };
    } catch (e) {
      console.error("AI verification failed", e);
      return { ok: false as const, status: e instanceof GatewayError ? e.status : 500, error: e instanceof GatewayError ? e.message : "AI verification unavailable." };
    }
  });
