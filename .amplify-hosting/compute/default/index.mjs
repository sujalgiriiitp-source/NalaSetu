globalThis.__nitro_main__ = import.meta.url;
import { i as toEventHandler, n as defineHandler, o as HTTPError, r as defineLazyEventHandler, t as H3Core } from "./_libs/h3+rou3+srvx.mjs";
import { i as withoutTrailingSlash, n as joinURL, r as withLeadingSlash, t as decodePath } from "./_libs/ufo.mjs";
import { i as toNodeHandler, r as NodeResponse } from "./_libs/h3-v2+rou3+srvx.mjs";
import { Server } from "node:http";
import { promises } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
//#region #nitro-vite-setup
function lazyService(loader) {
	let promise, mod;
	return { fetch(req) {
		if (mod) return mod.fetch(req);
		if (!promise) promise = loader().then((_mod) => mod = _mod.default || _mod);
		return promise.then((mod) => mod.fetch(req));
	} };
}
var services = { ["ssr"]: lazyService(() => import("./_ssr/ssr.mjs")) };
globalThis.__nitro_vite_envs__ = services;
//#endregion
//#region node_modules/nitro/dist/runtime/internal/route-rules.mjs
var headers = ((m) => function headersRouteRule(event) {
	for (const [key, value] of Object.entries(m.options || {})) event.res.headers.set(key, value);
});
//#endregion
//#region #nitro/virtual/public-assets-data
var public_assets_data_default = {
	"/favicon.ico": {
		"type": "image/vnd.microsoft.icon",
		"etag": "\"4f95-3RXc3p2mhEAs1WBwaIvE0Y0uu0Y\"",
		"mtime": "2026-10-08T06:49:47.943Z",
		"size": 20373,
		"path": "../../static/favicon.ico"
	},
	"/robots.txt": {
		"type": "text/plain; charset=utf-8",
		"etag": "\"a0-CKGXSIe7TSsqDTmGm/nY1t/o5d0\"",
		"mtime": "2026-10-08T06:49:47.942Z",
		"size": 160,
		"path": "../../static/robots.txt"
	},
	"/assets/AppShell-BOj0PDzK.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"164bb-uG/M/Zr1MG0336uxKLis7rSyKVQ\"",
		"mtime": "2026-10-08T06:49:47.570Z",
		"size": 91323,
		"path": "../../static/assets/AppShell-BOj0PDzK.js"
	},
	"/assets/CitizenReportForm-BzzohSsS.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1154-PeH8kPiMf4GwF8uqSxPoOMl46D4\"",
		"mtime": "2026-10-08T06:49:47.570Z",
		"size": 4436,
		"path": "../../static/assets/CitizenReportForm-BzzohSsS.js"
	},
	"/assets/DrainDetail-kVXg4-VL.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"27b8-btXQ7coX4na5iJD1YdyNGtNhuVw\"",
		"mtime": "2026-10-08T06:49:47.570Z",
		"size": 10168,
		"path": "../../static/assets/DrainDetail-kVXg4-VL.js"
	},
	"/assets/LazyMap-CG7jOnnw.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"369-xfcu/oNmbMWiEO/fwHivuoYfhgg\"",
		"mtime": "2026-10-08T06:49:47.570Z",
		"size": 873,
		"path": "../../static/assets/LazyMap-CG7jOnnw.js"
	},
	"/assets/RiskMap-DzJgpQt1.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"24cb8-aV4MjhQMKwdm106M1znZKx/Afq0\"",
		"mtime": "2026-10-08T06:49:47.570Z",
		"size": 150712,
		"path": "../../static/assets/RiskMap-DzJgpQt1.js"
	},
	"/assets/RiskMap-vh-t_kPv.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"3af7-hJRdDJQQrsTdSxJ69xb7a611WZ4\"",
		"mtime": "2026-10-08T06:49:47.576Z",
		"size": 15095,
		"path": "../../static/assets/RiskMap-vh-t_kPv.css"
	},
	"/assets/arrow-right-gYq4HyhB.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"9a-hgiiYG8H3LqyGTUp5KMnfmXwLPw\"",
		"mtime": "2026-10-08T06:49:47.570Z",
		"size": 154,
		"path": "../../static/assets/arrow-right-gYq4HyhB.js"
	},
	"/assets/citizen.report-DQPvH7dh.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5a6-AMN5UMJqx8oUzET4mQdy/eW+bOo\"",
		"mtime": "2026-10-08T06:49:47.570Z",
		"size": 1446,
		"path": "../../static/assets/citizen.report-DQPvH7dh.js"
	},
	"/assets/badges-DRabFpv5.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"e9a-iUDqL4JsO/cmmiKg4G7d71jf5No\"",
		"mtime": "2026-10-08T06:49:47.570Z",
		"size": 3738,
		"path": "../../static/assets/badges-DRabFpv5.js"
	},
	"/assets/crew-DxfLaqiD.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2933-m57eMr9+hULCEAXTFC7Dx4yuAzE\"",
		"mtime": "2026-10-08T06:49:47.570Z",
		"size": 10547,
		"path": "../../static/assets/crew-DxfLaqiD.js"
	},
	"/assets/dashboard-S0nnpeyy.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3efb-ee7KhaVqyD8W500CZtPiLu3dOKg\"",
		"mtime": "2026-10-08T06:49:47.570Z",
		"size": 16123,
		"path": "../../static/assets/dashboard-S0nnpeyy.js"
	},
	"/assets/dispatch-DRIQe9uv.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2b25-IKJim2yalVSBTgaB4XPBe52wj7c\"",
		"mtime": "2026-10-08T06:49:47.570Z",
		"size": 11045,
		"path": "../../static/assets/dispatch-DRIQe9uv.js"
	},
	"/assets/dist-QSYo-oXu.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1586-oSzMQqWy7FHME0XYyjPdhaKLm/Y\"",
		"mtime": "2026-10-08T06:49:47.571Z",
		"size": 5510,
		"path": "../../static/assets/dist-QSYo-oXu.js"
	},
	"/assets/drains-DbD5j4Lz.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1a10-w8Esz4hXGqo4BWjJUzXu0kcnVOk\"",
		"mtime": "2026-10-08T06:49:47.571Z",
		"size": 6672,
		"path": "../../static/assets/drains-DbD5j4Lz.js"
	},
	"/assets/generateCategoricalChart-DQTbyZT_.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"59d6d-CTxCwaPd2UvrinPmrvInqerlaTU\"",
		"mtime": "2026-10-08T06:49:47.571Z",
		"size": 367981,
		"path": "../../static/assets/generateCategoricalChart-DQTbyZT_.js"
	},
	"/assets/dist-CtfzxWKX.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"264e-lG0UqPX/ueu7mazc6/NE47Me5og\"",
		"mtime": "2026-10-08T06:49:47.570Z",
		"size": 9806,
		"path": "../../static/assets/dist-CtfzxWKX.js"
	},
	"/assets/html2canvas-CA7kyov8.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"30b46-1bD3NUT0o78L/KUDivNJ6s7fDy4\"",
		"mtime": "2026-10-08T06:49:47.572Z",
		"size": 199494,
		"path": "../../static/assets/html2canvas-CA7kyov8.js"
	},
	"/assets/impact-BpjKsomA.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"a13-zBt6j9/D1udAtpOoFaC4mqkVM9c\"",
		"mtime": "2026-10-08T06:49:47.573Z",
		"size": 2579,
		"path": "../../static/assets/impact-BpjKsomA.js"
	},
	"/assets/impact-D-LCMJOE.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"25d-3oNi0AaxhhTMfNuBW/GjNHByGzY\"",
		"mtime": "2026-10-08T06:49:47.573Z",
		"size": 605,
		"path": "../../static/assets/impact-D-LCMJOE.js"
	},
	"/assets/index-uTWsm3QJ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4dd68-XH1onc8RpdHPV7H1E9zD8v9BIEU\"",
		"mtime": "2026-10-08T06:49:47.569Z",
		"size": 318824,
		"path": "../../static/assets/index-uTWsm3QJ.js"
	},
	"/assets/index.es-DB2pnHaV.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"24f98-WtSoKTcM4BDG7fv+uk2r+BrDsCM\"",
		"mtime": "2026-10-08T06:49:47.573Z",
		"size": 151448,
		"path": "../../static/assets/index.es-DB2pnHaV.js"
	},
	"/assets/input-D7MKperk.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"299-Fg2a8bNv84nz5lulAn4jqjnywbM\"",
		"mtime": "2026-10-08T06:49:47.573Z",
		"size": 665,
		"path": "../../static/assets/input-D7MKperk.js"
	},
	"/assets/jspdf.es.min-sfp8TFED.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"6169c-wt0cYnI4WgY5f76uKSDSl2R72HM\"",
		"mtime": "2026-10-08T06:49:47.573Z",
		"size": 399004,
		"path": "../../static/assets/jspdf.es.min-sfp8TFED.js"
	},
	"/assets/map-Tgjzq22C.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"d26-BrFMJjKEPOT0Xubb8zp5fEA6cK8\"",
		"mtime": "2026-10-08T06:49:47.574Z",
		"size": 3366,
		"path": "../../static/assets/map-Tgjzq22C.js"
	},
	"/assets/layout-dashboard-askO4BsY.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"10acb-otYduIN4nMyszJHp+x8jZxv9MNk\"",
		"mtime": "2026-10-08T06:49:47.573Z",
		"size": 68299,
		"path": "../../static/assets/layout-dashboard-askO4BsY.js"
	},
	"/assets/preload-helper-Czpn1I53.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4ac-sE+5KsaRXTMfwOfrOATQajMSGV4\"",
		"mtime": "2026-10-08T06:49:47.574Z",
		"size": 1196,
		"path": "../../static/assets/preload-helper-Czpn1I53.js"
	},
	"/assets/purify.es-ByxKKxy8.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"6db4-uR8yHa3mxAT+uGvnUvKVTdPEEME\"",
		"mtime": "2026-10-08T06:49:47.574Z",
		"size": 28084,
		"path": "../../static/assets/purify.es-ByxKKxy8.js"
	},
	"/assets/map-voqxLv5G.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"14c5-7DLbgWJsoo5+FU342EaRS8xaQ2A\"",
		"mtime": "2026-10-08T06:49:47.574Z",
		"size": 5317,
		"path": "../../static/assets/map-voqxLv5G.js"
	},
	"/assets/reports-C0tu3Wxi.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5dc-ZanL9Wwees5cEMenK99YtD4Is5Y\"",
		"mtime": "2026-10-08T06:49:47.574Z",
		"size": 1500,
		"path": "../../static/assets/reports-C0tu3Wxi.js"
	},
	"/assets/rolldown-runtime-hePW80VL.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2cc-fA8td6k29UVF6JoPfhOPkceTK1M\"",
		"mtime": "2026-10-08T06:49:47.575Z",
		"size": 716,
		"path": "../../static/assets/rolldown-runtime-hePW80VL.js"
	},
	"/assets/jsx-runtime-BNakU3Ej.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2033-47YAxgGkbm2ycQNrMAKOXRZi2a8\"",
		"mtime": "2026-10-08T06:49:47.573Z",
		"size": 8243,
		"path": "../../static/assets/jsx-runtime-BNakU3Ej.js"
	},
	"/assets/settings-WZZ4Xuac.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1796-CHX3FgN59HT+QKBDX3YTZ74isJw\"",
		"mtime": "2026-10-08T06:49:47.575Z",
		"size": 6038,
		"path": "../../static/assets/settings-WZZ4Xuac.js"
	},
	"/assets/login-HcSzGnku.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3b36-69QAL+GtC3V5+qXz0CtpxSk4fpQ\"",
		"mtime": "2026-10-08T06:49:47.573Z",
		"size": 15158,
		"path": "../../static/assets/login-HcSzGnku.js"
	},
	"/assets/shield-check-D1yV5CT7.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"135-Gb5sio3Z8bKLrYO2SH2vjOH+wP4\"",
		"mtime": "2026-10-08T06:49:47.575Z",
		"size": 309,
		"path": "../../static/assets/shield-check-D1yV5CT7.js"
	},
	"/assets/tasks-BRrrnB0E.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1d48-rZJjzWdiYWcStBnW0me4iwBi1hA\"",
		"mtime": "2026-10-08T06:49:47.575Z",
		"size": 7496,
		"path": "../../static/assets/tasks-BRrrnB0E.js"
	},
	"/assets/test-before-CGLeLOME.jpg": {
		"type": "image/jpeg",
		"etag": "\"2d2f9-l5iohiobGD6pvLiF3lEAH2MwvpU\"",
		"mtime": "2026-10-08T06:49:47.578Z",
		"size": 185081,
		"path": "../../static/assets/test-before-CGLeLOME.jpg"
	},
	"/assets/styles-Dib0DNRl.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"17734-tP901r5+NFm9uWMknCaDih0pBd0\"",
		"mtime": "2026-10-08T06:49:47.576Z",
		"size": 96052,
		"path": "../../static/assets/styles-Dib0DNRl.css"
	},
	"/assets/typeof-B5XbjTb1.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"10f-yPXEOGyFHb1Ws7OoWyWNEEBz4mQ\"",
		"mtime": "2026-10-08T06:49:47.575Z",
		"size": 271,
		"path": "../../static/assets/typeof-B5XbjTb1.js"
	},
	"/assets/trash-2-DAEEVDre.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"13d-Yqhd0MdSiwI5R70iU2yksEqsiic\"",
		"mtime": "2026-10-08T06:49:47.575Z",
		"size": 317,
		"path": "../../static/assets/trash-2-DAEEVDre.js"
	},
	"/assets/test-other-location-C7EBCQX9.jpg": {
		"type": "image/jpeg",
		"etag": "\"19688-b8VueeXDluuiRIvLxSfeydmPVPc\"",
		"mtime": "2026-10-08T06:49:47.579Z",
		"size": 104072,
		"path": "../../static/assets/test-other-location-C7EBCQX9.jpg"
	},
	"/assets/upload-autnBfFx.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"db-S9rFTOkX8VhnB6AC5YSmAEsi8rA\"",
		"mtime": "2026-10-08T06:49:47.575Z",
		"size": 219,
		"path": "../../static/assets/upload-autnBfFx.js"
	},
	"/assets/types-DKSnJpxg.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"dbdb-l3DXiPvS27ZIemys6aF3peFqnFI\"",
		"mtime": "2026-10-08T06:49:47.575Z",
		"size": 56283,
		"path": "../../static/assets/types-DKSnJpxg.js"
	},
	"/assets/verification-lab-Dnm7F5xW.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"b7fc-YzR/PtXfrJ+SRuySFQPbHcAn7DM\"",
		"mtime": "2026-10-08T06:49:47.576Z",
		"size": 47100,
		"path": "../../static/assets/verification-lab-Dnm7F5xW.js"
	},
	"/assets/utils-CwVc3eFS.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"114f6-neJOVha0VJwVudrr/2GjndugjTo\"",
		"mtime": "2026-10-08T06:49:47.575Z",
		"size": 70902,
		"path": "../../static/assets/utils-CwVc3eFS.js"
	},
	"/assets/x-C9AFBrfQ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"8f-HlVsG1EaG7GUXssOdybMNZK/iBw\"",
		"mtime": "2026-10-08T06:49:47.576Z",
		"size": 143,
		"path": "../../static/assets/x-C9AFBrfQ.js"
	},
	"/assets/verify-Cg2q1XWH.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"27c-VHt8wanih43mYeVEs88SrhTtqkc\"",
		"mtime": "2026-10-08T06:49:47.576Z",
		"size": 636,
		"path": "../../static/assets/verify-Cg2q1XWH.js"
	},
	"/assets/test-after-clean-CLhLXWBq.jpg": {
		"type": "image/jpeg",
		"etag": "\"1eb2e4-TVwFsGQ3AADc0k5HJmRizLnQ9pA\"",
		"mtime": "2026-10-08T06:49:47.577Z",
		"size": 2011876,
		"path": "../../static/assets/test-after-clean-CLhLXWBq.jpg"
	},
	"/assets/zap-cJ5LT4nz.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"fb-fgo66QmbUf30jYnAXf0qlF0WwkI\"",
		"mtime": "2026-10-08T06:49:47.576Z",
		"size": 251,
		"path": "../../static/assets/zap-cJ5LT4nz.js"
	},
	"/assets/test-after-dirty-CDJfz6EV.jpg": {
		"type": "image/jpeg",
		"etag": "\"205229-+sHO4ffQo3ZiceC+x00LXkaSelY\"",
		"mtime": "2026-10-08T06:49:47.577Z",
		"size": 2118185,
		"path": "../../static/assets/test-after-dirty-CDJfz6EV.jpg"
	}
};
//#endregion
//#region #nitro/virtual/public-assets-node
function readAsset(id) {
	const serverDir = dirname(fileURLToPath(globalThis.__nitro_main__));
	return promises.readFile(resolve(serverDir, public_assets_data_default[id].path));
}
//#endregion
//#region #nitro/virtual/public-assets
var publicAssetBases = {};
function isPublicAssetURL(id = "") {
	if (public_assets_data_default[id]) return true;
	for (const base in publicAssetBases) if (id.startsWith(base)) return true;
	return false;
}
function getAsset(id) {
	return public_assets_data_default[id];
}
//#endregion
//#region node_modules/nitro/dist/runtime/internal/static.mjs
var METHODS = /* @__PURE__ */ new Set(["HEAD", "GET"]);
var EncodingMap = {
	gzip: ".gz",
	br: ".br",
	zstd: ".zst"
};
var static_default = defineHandler((event) => {
	if (event.req.method && !METHODS.has(event.req.method)) return;
	let id = decodePath(withLeadingSlash(withoutTrailingSlash(event.url.pathname)));
	let asset;
	const encodings = [...(event.req.headers.get("accept-encoding") || "").split(",").map((e) => EncodingMap[e.trim()]).filter(Boolean).sort(), ""];
	for (const encoding of encodings) for (const _id of [id + encoding, joinURL(id, "index.html" + encoding)]) {
		const _asset = getAsset(_id);
		if (_asset) {
			asset = _asset;
			id = _id;
			break;
		}
	}
	if (!asset) {
		if (isPublicAssetURL(id)) {
			event.res.headers.delete("Cache-Control");
			throw new HTTPError({ status: 404 });
		}
		return;
	}
	if (encodings.length > 1) event.res.headers.append("Vary", "Accept-Encoding");
	if (event.req.headers.get("if-none-match") === asset.etag) {
		event.res.status = 304;
		event.res.statusText = "Not Modified";
		return "";
	}
	const ifModifiedSinceH = event.req.headers.get("if-modified-since");
	const mtimeDate = new Date(asset.mtime);
	if (ifModifiedSinceH && asset.mtime && new Date(ifModifiedSinceH) >= mtimeDate) {
		event.res.status = 304;
		event.res.statusText = "Not Modified";
		return "";
	}
	if (asset.type) event.res.headers.set("Content-Type", asset.type);
	if (asset.etag && !event.res.headers.has("ETag")) event.res.headers.set("ETag", asset.etag);
	if (asset.mtime && !event.res.headers.has("Last-Modified")) event.res.headers.set("Last-Modified", mtimeDate.toUTCString());
	if (asset.encoding && !event.res.headers.has("Content-Encoding")) event.res.headers.set("Content-Encoding", asset.encoding);
	if (asset.size > 0 && !event.res.headers.has("Content-Length")) event.res.headers.set("Content-Length", asset.size.toString());
	return readAsset(id);
});
//#endregion
//#region #nitro/virtual/routing
var findRouteRules = /* @__PURE__ */ (() => {
	const $0 = [{
		name: "headers",
		route: "/assets/**",
		handler: headers,
		options: { "cache-control": "public, max-age=31536000, immutable" }
	}];
	return (m, p) => {
		let r = [];
		if (p.charCodeAt(p.length - 1) === 47) p = p.slice(0, -1) || "/";
		let s = p.split("/");
		if (s.length > 1) {
			if (s[1] === "assets") r.unshift({
				data: $0,
				params: { "_": s.slice(2).join("/") }
			});
		}
		return r;
	};
})();
var _lazy_6prQb_ = defineLazyEventHandler(() => import("./_chunks/ssr-renderer.mjs"));
var findRoute = /* @__PURE__ */ (() => {
	const data = {
		route: "/**",
		handler: _lazy_6prQb_
	};
	return ((_m, p) => {
		return {
			data,
			params: { "_": p.slice(1) }
		};
	});
})();
var globalMiddleware = [toEventHandler(static_default)].filter(Boolean);
//#endregion
//#region node_modules/nitro/dist/runtime/internal/error/prod.mjs
var errorHandler = (error, event) => {
	const res = defaultHandler(error, event);
	return new NodeResponse(typeof res.body === "string" ? res.body : JSON.stringify(res.body, null, 2), res);
};
function defaultHandler(error, event) {
	const unhandled = error.unhandled ?? !HTTPError.isError(error);
	const { status = 500, statusText = "" } = unhandled ? {} : error;
	if (status === 404) {
		const url = event.url || new URL(event.req.url);
		const baseURL = "/";
		if (/^\/[^/]/.test(baseURL) && !url.pathname.startsWith(baseURL)) return {
			status: 302,
			headers: new Headers({ location: `${baseURL}${url.pathname.slice(1)}${url.search}` })
		};
	}
	const headers = new Headers(unhandled ? {} : error.headers);
	headers.set("content-type", "application/json; charset=utf-8");
	return {
		status,
		statusText,
		headers,
		body: {
			error: true,
			...unhandled ? {
				status,
				unhandled: true
			} : typeof error.toJSON === "function" ? error.toJSON() : {
				status,
				statusText,
				message: error.message
			}
		}
	};
}
//#endregion
//#region #nitro/virtual/error-handler
var errorHandlers = [errorHandler];
async function error_handler_default(error, event) {
	for (const handler of errorHandlers) try {
		const response = await handler(error, event, { defaultHandler });
		if (response) return response;
	} catch (error) {
		console.error(error);
	}
}
//#endregion
//#region #nitro/virtual/app
function createNitroApp() {
	const captureError = (error, errorCtx) => {
		if (errorCtx?.event) {
			const errors = errorCtx.event.req.context?.nitro?.errors;
			if (errors) errors.push({
				error,
				context: errorCtx
			});
		}
	};
	const h3App = createH3App({ onError(error, event) {
		return error_handler_default(error, event);
	} });
	let appHandler = (req) => {
		req.context ||= {};
		req.context.nitro = req.context.nitro || { errors: [] };
		return h3App.fetch(req);
	};
	return {
		fetch: appHandler,
		h3: h3App,
		hooks: void 0,
		captureError
	};
}
function createH3App(config) {
	const h3App = new H3Core(config);
	h3App["~findRoute"] = (event) => findRoute(event.req.method, event.url.pathname);
	h3App["~middleware"].push(...globalMiddleware);
	h3App["~getMiddleware"] = (event, route) => {
		const pathname = event.url.pathname;
		const method = event.req.method;
		const middleware = [];
		const routeRules = getRouteRules(method, pathname);
		event.context.routeRules = routeRules?.routeRules;
		if (routeRules?.routeRuleMiddleware.length) middleware.push(...routeRules.routeRuleMiddleware);
		middleware.push(...h3App["~middleware"]);
		if (route?.data?.middleware?.length) middleware.push(...route.data.middleware);
		return middleware;
	};
	return h3App;
}
//#endregion
//#region node_modules/nitro/dist/runtime/internal/app.mjs
var APP_ID = "default";
function useNitroApp() {
	let instance = useNitroApp._instance;
	if (instance) return instance;
	instance = useNitroApp._instance = createNitroApp();
	globalThis.__nitro__ = globalThis.__nitro__ || {};
	globalThis.__nitro__[APP_ID] = instance;
	return instance;
}
function getRouteRules(method, pathname) {
	const m = findRouteRules(method, pathname);
	if (!m?.length) return { routeRuleMiddleware: [] };
	const routeRules = {};
	for (const layer of m) for (const rule of layer.data) {
		const currentRule = routeRules[rule.name];
		if (currentRule) {
			if (rule.options === false) {
				delete routeRules[rule.name];
				continue;
			}
			if (typeof currentRule.options === "object" && typeof rule.options === "object") currentRule.options = {
				...currentRule.options,
				...rule.options
			};
			else currentRule.options = rule.options;
			currentRule.route = rule.route;
			currentRule.params = {
				...currentRule.params,
				...layer.params
			};
		} else if (rule.options !== false) routeRules[rule.name] = {
			...rule,
			params: layer.params
		};
	}
	const middleware = [];
	const orderedRules = Object.values(routeRules).sort((a, b) => (a.handler?.order || 0) - (b.handler?.order || 0));
	for (const rule of orderedRules) {
		if (rule.options === false || !rule.handler) continue;
		middleware.push(rule.handler(rule));
	}
	return {
		routeRules,
		routeRuleMiddleware: middleware
	};
}
//#endregion
//#region node_modules/nitro/dist/presets/aws-amplify/runtime/aws-amplify.mjs
var nitroApp = useNitroApp();
new Server(toNodeHandler(nitroApp.fetch)).listen(3e3, (err) => {
	if (err) console.error(err);
	else console.log(`Listening on http://localhost:3000 (AWS Amplify Hosting)`);
});
//#endregion
export {};
