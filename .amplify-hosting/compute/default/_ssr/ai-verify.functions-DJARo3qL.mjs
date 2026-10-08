import { l as createServerFn } from "./createServerFn-DDDJMFWM.mjs";
import { t as createServerRpc } from "./createServerRpc-CxD4EZ5P.mjs";
import { a as stringType, i as objectType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ai-verify.functions-DJARo3qL.js
var dataUrl = stringType().max(3e6).regex(/^data:image\/(jpeg|png|webp);base64,/);
var verifyProof_createServerFn_handler = createServerRpc({
	id: "bed83f21ed3d6c8a73a2f81dfb76d52458a072fcc2eb2edeed801adf285a3990",
	name: "verifyProof",
	filename: "src/lib/nalasetu/ai-verify.functions.ts"
}, (opts) => verifyProof.__executeServer(opts));
var verifyProof = createServerFn({ method: "POST" }).inputValidator((d) => objectType({
	before: dataUrl,
	after: dataUrl,
	drainId: stringType().max(20),
	drainName: stringType().max(120)
}).parse(d)).handler(verifyProof_createServerFn_handler, async ({ data }) => {
	const { verifyWithAi, GatewayError } = await import("./ai-verify.server-3QM1s6We.mjs");
	if (data.before === data.after) return {
		ok: true,
		verdict: "REVIEW",
		confidence: 0,
		reason: "Before and after images are identical.",
		sameLocation: true,
		obstructionBefore: true,
		obstructionAfter: true
	};
	try {
		return {
			ok: true,
			...await verifyWithAi(data.before, data.after, {
				id: data.drainId,
				name: data.drainName
			})
		};
	} catch (e) {
		console.error("AI verification failed", e);
		return {
			ok: false,
			status: e instanceof GatewayError ? e.status : 500,
			error: e instanceof GatewayError ? e.message : "AI verification unavailable."
		};
	}
});
//#endregion
export { verifyProof_createServerFn_handler };
