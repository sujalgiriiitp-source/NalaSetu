//#region node_modules/.nitro/vite/services/ssr/assets/__23tanstack-start-server-fn-resolver-BBdeP6_0.js
var manifest = {
	"a9ec5dbf513f02f0a3f7113dfb5d883dc59fe8b28ead9ed8527d5a7131427701": {
		functionName: "seedDemoDrains_createServerFn_handler",
		importer: () => import("./_ssr/seed-drains.server-D3b8fl2D.mjs")
	},
	"bed83f21ed3d6c8a73a2f81dfb76d52458a072fcc2eb2edeed801adf285a3990": {
		functionName: "verifyProof_createServerFn_handler",
		importer: () => import("./_ssr/ai-verify.functions-DJARo3qL.mjs")
	}
};
async function getServerFnById(id, access) {
	const serverFnInfo = manifest[id];
	if (!serverFnInfo) throw new Error("Server function info not found for " + id);
	const fnModule = serverFnInfo.module ??= await serverFnInfo.importer();
	if (!fnModule) throw new Error("Server function module not resolved for " + id);
	const action = fnModule[serverFnInfo.functionName];
	if (!action) throw new Error("Server function module export not resolved for serverFn ID: " + id);
	return action;
}
//#endregion
export { getServerFnById as t };
