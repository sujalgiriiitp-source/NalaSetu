import { l as createServerFn } from "./createServerFn-DDDJMFWM.mjs";
import { t as createServerRpc } from "./createServerRpc-CxD4EZ5P.mjs";
import { r as buildDemoDrains } from "./data-BhlzLgUJ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/seed-drains.server-D3b8fl2D.js
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
var SERVER_API_URL = process.env["NALASETU_API_URL"] ?? process.env["VITE_NALASETU_API_URL"] ?? "";
async function lambdaFetch(path, body, timeoutMs = 3e4) {
	if (!SERVER_API_URL) throw new Error("VITE_NALASETU_API_URL is not configured.");
	const url = `${SERVER_API_URL.replace(/\/$/, "")}${path}`;
	const controller = new AbortController();
	const timer = setTimeout(() => controller.abort(), timeoutMs);
	try {
		const res = await fetch(url, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"Accept": "application/json"
			},
			body: JSON.stringify(body),
			signal: controller.signal
		});
		clearTimeout(timer);
		const text = await res.text();
		if (!res.ok) throw new Error(`HTTP ${res.status}: ${text}`);
		return JSON.parse(text);
	} finally {
		clearTimeout(timer);
	}
}
var seedDemoDrains_createServerFn_handler = createServerRpc({
	id: "a9ec5dbf513f02f0a3f7113dfb5d883dc59fe8b28ead9ed8527d5a7131427701",
	name: "seedDemoDrains",
	filename: "src/lib/nalasetu/seed-drains.server.ts"
}, (opts) => seedDemoDrains.__executeServer(opts));
var seedDemoDrains = createServerFn({ method: "POST" }).handler(seedDemoDrains_createServerFn_handler, async () => {
	try {
		const raw = await lambdaFetch("/api/drains/seed", { drains: buildDemoDrains() });
		const out = {
			ok: true,
			seeded: raw.seeded
		};
		if (raw.skipped !== void 0) out.skipped = raw.skipped;
		return out;
	} catch (e) {
		const msg = e instanceof Error ? e.message : String(e);
		console.error("[seed-drains] Failed:", msg);
		return {
			ok: false,
			error: msg
		};
	}
});
//#endregion
export { seedDemoDrains_createServerFn_handler };
