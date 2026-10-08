import { a as stringType, i as objectType, n as enumType, r as numberType, t as booleanType } from "../_libs/zod.mjs";
import { t as createOpenAI } from "../_libs/ai-sdk__openai+zod.mjs";
import { n as output_exports, r as streamText, t as NoObjectGeneratedError } from "../_libs/ai.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ai-verify.server-3QM1s6We.js
var MODEL = "openai/gpt-6-astra";
var BASE = "https://ai.gateway.lovable.dev/v1";
var schema = objectType({
	verdict: enumType(["PASS", "REVIEW"]),
	confidence: numberType(),
	reason: stringType(),
	obstructionBefore: booleanType(),
	obstructionAfter: booleanType(),
	sameLocation: booleanType()
});
var GatewayError = class extends Error {
	status;
	constructor(status, message) {
		super(message);
		this.status = status;
	}
};
var INSTRUCTIONS = `You verify municipal drain-cleaning proof. You receive a BEFORE photo and an AFTER photo submitted by a field crew.
Judge whether the evidence credibly shows the same drain location and a visible reduction in obstruction (silt, garbage, debris, standing water).
Return PASS only if both photos plausibly show a drain, appear to be the same place, and the after photo shows clear improvement.
Return REVIEW if photos are identical, unrelated, not a drain, too dark/blurry, show no improvement, or look staged/reused.
confidence is 0-100 (your certainty that cleaning genuinely happened). reason: one concise sentence under 30 words for an officer.`;
async function verifyWithAi(before, after, ctx, signal) {
	const apiKey = process.env["LOVABLE_API_KEY"];
	if (!apiKey) throw new GatewayError(401, "AI is not configured.");
	const provider = createOpenAI({
		baseURL: BASE,
		apiKey,
		headers: {
			"Lovable-API-Key": apiKey,
			"X-Lovable-AIG-SDK": "vercel-ai-sdk"
		}
	});
	const result = streamText({
		model: provider.responses(MODEL),
		instructions: INSTRUCTIONS,
		output: output_exports.object({ schema }),
		messages: [{
			role: "user",
			content: [
				{
					type: "text",
					text: `Drain ${ctx.id} — ${ctx.name}. Image 1 = BEFORE, image 2 = AFTER.`
				},
				{
					type: "image",
					image: new URL(before)
				},
				{
					type: "image",
					image: new URL(after)
				}
			]
		}],
		...signal ? { abortSignal: signal } : {},
		providerOptions: { openai: {
			store: false,
			forceReasoning: true,
			reasoningEffort: "low",
			reasoningSummary: "auto",
			include: ["reasoning.encrypted_content"]
		} }
	});
	let out;
	try {
		out = await result.output;
	} catch (e) {
		const status = e.statusCode ?? e.cause?.statusCode;
		if (status) throw new GatewayError(status, status === 402 ? "AI credits exhausted — add credits in Settings → Plans & credits." : status === 429 ? "AI is rate limited — try again shortly." : "AI verification unavailable.");
		if (NoObjectGeneratedError.isInstance(e) && e.text) try {
			out = schema.parse(JSON.parse(e.text));
		} catch {
			throw new GatewayError(500, "AI returned an unreadable result.");
		}
		else throw new GatewayError(500, "AI verification unavailable.");
	}
	const confidence = Math.max(0, Math.min(100, Math.round(out.confidence)));
	const flags = [];
	if (!out.sameLocation) flags.push("location mismatch");
	if (out.obstructionAfter) flags.push("obstruction still visible");
	return {
		verdict: out.verdict === "PASS" && confidence >= 70 && !flags.length ? "PASS" : "REVIEW",
		confidence,
		sameLocation: out.sameLocation,
		obstructionBefore: out.obstructionBefore,
		obstructionAfter: out.obstructionAfter,
		reason: out.reason + (flags.length && out.verdict === "PASS" ? ` Flagged: ${flags.join(", ")}.` : "")
	};
}
//#endregion
export { GatewayError, verifyWithAi };
