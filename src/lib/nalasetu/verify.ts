import type { Drain, Verification } from "./types";

/** Adapter interface. Production: Amazon Bedrock (not configured in demo). */
export interface VerificationAdapter {
  verify(before: string, after: string, drain: Drain): Promise<Verification>;
}

function hash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i += Math.max(1, Math.floor(s.length / 4000))) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}

/** Deterministic simulated verification — clearly labelled as demo. */
export const demoVerifier: VerificationAdapter = {
  async verify(before, after, drain) {
    await new Promise((r) => setTimeout(r, 900));
    if (!before || !after) return { verdict: "REVIEW", confidence: 0, reason: "Missing before or after photo.", mode: "demo" };
    if (before === after) return { verdict: "REVIEW", confidence: 22, reason: "Before and after images are identical — no visible change.", mode: "demo" };
    const sizeDelta = Math.abs(before.length - after.length) / Math.max(before.length, after.length);
    const base = 60 + (hash(before + after + drain.id) % 36);
    const confidence = Math.min(97, Math.round(base + sizeDelta * 20));
    const verdict = confidence >= 70 ? "PASS" : "REVIEW";
    return {
      verdict,
      confidence,
      reason: verdict === "PASS" ? "Visible change between before and after image; obstruction appears reduced." : "Change between images is unclear; manual inspection recommended.",
      mode: "demo",
    };
  },
};

export const ACCEPTED = ["image/jpeg", "image/png", "image/webp"];
export const MAX_BYTES = 8 * 1024 * 1024;

/** Validate & compress to JPEG data URL (max 900px). */
export async function processPhoto(file: File): Promise<string> {
  if (!ACCEPTED.includes(file.type)) throw new Error("Only JPG, PNG or WEBP images are allowed.");
  if (file.size > MAX_BYTES) throw new Error("Image is larger than 8 MB.");
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = () => rej(new Error("Could not read image.")); i.src = url; });
    const scale = Math.min(1, 900 / Math.max(img.width, img.height));
    const c = document.createElement("canvas");
    c.width = Math.round(img.width * scale); c.height = Math.round(img.height * scale);
    c.getContext("2d")!.drawImage(img, 0, 0, c.width, c.height);
    return c.toDataURL("image/jpeg", 0.7);
  } finally { URL.revokeObjectURL(url); }
}
