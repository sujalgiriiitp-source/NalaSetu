import { o as __toESM } from "../_runtime.mjs";
import { a as TSS_SERVER_FUNCTION, l as createServerFn } from "./createServerFn-DDDJMFWM.mjs";
import { a as stringType, i as objectType } from "../_libs/zod.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { L as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as getServerFnById } from "../__23tanstack-start-server-fn-resolver-BBdeP6_0.mjs";
import { i as crewName, n as SCENARIO_MM, r as buildDemoDrains, t as DEMO_CREWS } from "./data-BhlzLgUJ.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/store-DM6PPzvT.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var WEIGHTS = {
	R: .4,
	H: .25,
	S: .2,
	C: .15
};
var SLOPE_FACTOR = {
	Low: 100,
	Medium: 55,
	High: 20
};
function riskFactors(d, forecastMm72) {
	return {
		R: Math.min(100, forecastMm72 / 60 * 100),
		H: Math.min(100, d.historicalChokes / 5 * 100),
		S: SLOPE_FACTOR[d.slope],
		C: Math.min(100, d.citizenReports / 6 * 100)
	};
}
function scoreRisk(d, forecastMm72) {
	const f = riskFactors(d, forecastMm72);
	const contrib = {
		rainfall: WEIGHTS.R * f.R,
		history: WEIGHTS.H * f.H,
		terrain: WEIGHTS.S * f.S,
		citizen: WEIGHTS.C * f.C
	};
	const raw = contrib.rainfall + contrib.history + contrib.terrain + contrib.citizen;
	const score = Math.round(raw);
	return {
		raw,
		score,
		band: bandFor(score),
		factors: f,
		contrib
	};
}
function bandFor(score) {
	if (score >= 70) return "HIGH";
	if (score >= 40) return "MEDIUM";
	return "LOW";
}
function reasons(d, forecastMm72) {
	const out = [`${Math.round(forecastMm72)}mm rainfall forecast in next 72h`];
	out.push(`${d.historicalChokes} historical choke incident${d.historicalChokes === 1 ? "" : "s"}`);
	out.push(d.lowLying ? "Low-lying location" : `${d.slope} slope terrain`);
	out.push(`${d.citizenReports} citizen report${d.citizenReports === 1 ? "" : "s"} in last 30 days`);
	return out;
}
function recommendation(band) {
	return band === "HIGH" ? "Clean before rain window start - 2h" : band === "MEDIUM" ? "Clean if crew-hours remain" : "Monitor";
}
function explanation(d, forecastMm72, band) {
	const parts = [];
	const hi = [];
	if (forecastMm72 >= 40) {
		parts.push("heavy forecast rainfall");
		hi.push("baarish ka forecast zyada hai");
	}
	if (d.historicalChokes >= 3) {
		parts.push("repeated choke history");
		hi.push("drain pe pehle choke hua hai");
	}
	if (d.slope === "Low") {
		parts.push("low-lying terrain");
		hi.push("location low-lying hai");
	}
	if (d.citizenReports >= 3) {
		parts.push("multiple citizen reports");
		hi.push("logon ne complaint ki hai");
	}
	const label = band === "HIGH" ? "High" : band === "MEDIUM" ? "Medium" : "Low";
	return {
		en: parts.length ? `${label} risk due to ${joinList(parts)}.` : `${label} risk; no dominant factor.`,
		hin: hi.length ? `Risk ${label.toLowerCase()} hai kyunki ${hi.join(", ")}.` : `Risk ${label.toLowerCase()} hai.`
	};
}
function joinList(a) {
	return a.length <= 1 ? a.join("") : a.slice(0, -1).join(", ") + " and " + a[a.length - 1];
}
var ROAD_FACTOR = 1.3;
function haversineKm(aLat, aLng, bLat, bLng) {
	const R = 6371;
	const dLat = (bLat - aLat) * Math.PI / 180;
	const dLng = (bLng - aLng) * Math.PI / 180;
	const x = Math.sin(dLat / 2) ** 2 + Math.cos(aLat * Math.PI / 180) * Math.cos(bLat * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
	return 2 * R * Math.asin(Math.sqrt(x));
}
var travelMin = (km) => km * ROAD_FACTOR / 15 * 60;
/** Grid clustering (~1.1km cells). */
function cellOf(lat, lng, size = .01) {
	return `${Math.floor(lat / size)}:${Math.floor(lng / size)}`;
}
function routeKm(start, stops) {
	let km = 0, cur = start;
	for (const s of stops) {
		km += haversineKm(cur.lat, cur.lng, s.lat, s.lng) * ROAD_FACTOR;
		cur = s;
	}
	return km;
}
/** Nearest-neighbour ordering from a home base. */
function nearestNeighbour(start, stops) {
	const left = [...stops], out = [];
	let cur = start;
	while (left.length) {
		let bi = 0, bd = Infinity;
		left.forEach((d, i) => {
			const k = haversineKm(cur.lat, cur.lng, d.lat, d.lng);
			if (k < bd) {
				bd = k;
				bi = i;
			}
		});
		const n = left.splice(bi, 1)[0];
		out.push(n);
		cur = n;
	}
	return out;
}
function summarize(crew, stops) {
	const km = routeKm({
		lat: crew.homeBaseLat,
		lng: crew.homeBaseLng
	}, stops);
	const cleaning = stops.reduce((a, d) => a + d.cleaningTimeMin, 0);
	const travel = km / 15 * 60;
	return {
		crewId: crew.id,
		drainIds: stops.map((d) => d.id),
		cleaningMin: cleaning,
		travelMin: Math.round(travel),
		totalMin: Math.round(cleaning + travel),
		distanceKm: +km.toFixed(2)
	};
}
/**
* Optimized plan:
* 1. candidates HIGH+MEDIUM, 2. grid cluster, 3. greedy knapsack by score / (clean + marginal travel),
* 4. nearest-neighbour route per crew. Never exceeds crew-hours.
*/
function optimizePlan(drains, crews) {
	const cand = drains.filter((d) => (d.riskBand === "HIGH" || d.riskBand === "MEDIUM") && d.status === "UNASSIGNED");
	const clusters = /* @__PURE__ */ new Map();
	cand.forEach((d) => {
		const c = cellOf(d.lat, d.lng);
		clusters.set(c, [...clusters.get(c) ?? [], d]);
	});
	const clusterOf = new Map(cand.map((d) => [d.id, cellOf(d.lat, d.lng)]));
	const state = crews.map((c) => ({
		crew: c,
		stops: [],
		used: 0,
		pos: {
			lat: c.homeBaseLat,
			lng: c.homeBaseLng
		}
	}));
	const remaining = new Set(cand.map((d) => d.id));
	const byId = new Map(cand.map((d) => [d.id, d]));
	for (;;) {
		let best = null;
		for (let si = 0; si < state.length; si++) {
			const s = state[si];
			const cap = s.crew.availableHours * 60;
			for (const id of remaining) {
				const d = byId.get(id);
				const t = travelMin(haversineKm(s.pos.lat, s.pos.lng, d.lat, d.lng));
				const cost = d.cleaningTimeMin + t;
				if (s.used + cost > cap) continue;
				const last = s.stops[s.stops.length - 1];
				const affinity = last && clusterOf.get(last.id) === clusterOf.get(d.id) ? 1.15 : 1;
				const ratio = (d.riskScore + (d.riskBand === "HIGH" ? 1e3 : 0)) / cost * affinity;
				if (!best || ratio > best.ratio) best = {
					si,
					d,
					ratio,
					cost
				};
			}
		}
		if (!best) break;
		const s = state[best.si];
		s.stops.push(best.d);
		s.used += best.cost;
		s.pos = best.d;
		remaining.delete(best.d.id);
	}
	const crewPlans = state.map((s) => {
		const routed = nearestNeighbour({
			lat: s.crew.homeBaseLat,
			lng: s.crew.homeBaseLng
		}, s.stops);
		return summarize(s.crew, routed);
	});
	return {
		crews: crewPlans,
		hoursAvailable: crews.reduce((a, c) => a + c.availableHours, 0),
		hoursPlanned: +(crewPlans.reduce((a, c) => a + c.totalMin, 0) / 60).toFixed(1),
		highCoverage: coverage(drains, crewPlans.flatMap((c) => c.drainIds))
	};
}
/** Naive baseline: sort by score, round-robin crews in order, no geographic awareness. */
function naivePlan(drains, crews) {
	const sorted = drains.filter((d) => d.status === "UNASSIGNED" && d.riskBand !== "LOW").sort((a, b) => b.riskScore - a.riskScore);
	const st = crews.map((c) => ({
		c,
		used: 0,
		pos: {
			lat: c.homeBaseLat,
			lng: c.homeBaseLng
		},
		ids: []
	}));
	let ci = 0;
	for (const d of sorted) {
		let placed = false;
		for (let k = 0; k < st.length; k++) {
			const s = st[(ci + k) % st.length];
			const cost = d.cleaningTimeMin + travelMin(haversineKm(s.pos.lat, s.pos.lng, d.lat, d.lng));
			if (s.used + cost <= s.c.availableHours * 60) {
				s.used += cost;
				s.pos = d;
				s.ids.push(d.id);
				placed = true;
				break;
			}
		}
		if (!placed) break;
		ci++;
	}
	return { highCoverage: coverage(drains, st.flatMap((s) => s.ids)) };
}
function coverage(drains, ids) {
	const high = drains.filter((d) => d.riskBand === "HIGH");
	if (!high.length) return 0;
	const set = new Set(ids);
	return Math.round(high.filter((d) => set.has(d.id)).length / high.length * 100);
}
function fmtMin(m) {
	const h = Math.floor(m / 60), mm = Math.round(m % 60);
	return h ? `${h}h ${mm}m` : `${mm}m`;
}
var TRANSITIONS = {
	UNASSIGNED: ["ASSIGNED"],
	ASSIGNED: ["EN_ROUTE", "UNASSIGNED"],
	EN_ROUTE: ["CLEANING"],
	CLEANING: ["PROOF_SUBMITTED"],
	PROOF_SUBMITTED: [
		"VERIFIED",
		"NEEDS_REVIEW",
		"REJECTED"
	],
	NEEDS_REVIEW: ["VERIFIED", "REJECTED"],
	REJECTED: ["ASSIGNED"],
	VERIFIED: []
};
function canTransition(from, to) {
	return TRANSITIONS[from].includes(to);
}
var STATUS_LABEL = {
	UNASSIGNED: "Unassigned",
	ASSIGNED: "Assigned",
	EN_ROUTE: "En Route",
	CLEANING: "Cleaning",
	PROOF_SUBMITTED: "Proof Submitted",
	VERIFIED: "Verified",
	NEEDS_REVIEW: "Needs Review",
	REJECTED: "Rejected"
};
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var dataUrl = stringType().max(3e6).regex(/^data:image\/(jpeg|png|webp);base64,/);
var verifyProof = createServerFn({ method: "POST" }).inputValidator((d) => objectType({
	before: dataUrl,
	after: dataUrl,
	drainId: stringType().max(20),
	drainName: stringType().max(120)
}).parse(d)).handler(createSsrRpc("bed83f21ed3d6c8a73a2f81dfb76d52458a072fcc2eb2edeed801adf285a3990"));
var BASE_URL = typeof import.meta !== "undefined" ? {
	"BASE_URL": "/",
	"DEV": false,
	"MODE": "production",
	"PROD": true,
	"SSR": true,
	"TSS_DEV_SERVER": "false",
	"TSS_DEV_SSR_STYLES_BASEPATH": "/",
	"TSS_DEV_SSR_STYLES_ENABLED": "true",
	"TSS_DISABLE_CSRF_MIDDLEWARE_WARNING": "false",
	"TSS_INLINE_CSS_ENABLED": "false",
	"TSS_ROUTER_BASEPATH": "",
	"TSS_SERVER_FN_BASE": "/_serverFn/",
	"VITE_NALASETU_API_URL": "https://o39m3kgdyb.execute-api.us-east-1.amazonaws.com"
}["VITE_NALASETU_API_URL"] ?? "" : "";
var AWS_CONFIGURED = BASE_URL.trim().length > 0;
async function apiFetch(path, init, timeoutMs = 8e3) {
	if (!AWS_CONFIGURED) return {
		ok: false,
		error: "AWS API URL not configured.",
		demo: true
	};
	const url = `${BASE_URL.replace(/\/$/, "")}${path}`;
	try {
		const controller = new AbortController();
		const timer = setTimeout(() => controller.abort(), timeoutMs);
		const res = await fetch(url, {
			...init,
			signal: controller.signal,
			headers: {
				"Content-Type": "application/json",
				"Accept": "application/json",
				...init?.headers ?? {}
			}
		});
		clearTimeout(timer);
		if (!res.ok) {
			const text = await res.text().catch(() => "");
			return {
				ok: false,
				error: `HTTP ${res.status}: ${text || res.statusText}`
			};
		}
		return {
			ok: true,
			data: await res.json()
		};
	} catch (e) {
		const msg = e instanceof Error ? e.message : String(e);
		return {
			ok: false,
			error: msg.includes("abort") ? "Request timed out." : msg
		};
	}
}
/** GET /api/drains — list all drain base records */
async function listDrains() {
	return apiFetch("/api/drains");
}
/** POST /api/plans/generate — ask Lambda to generate an optimised plan */
async function generatePlanAws(payload) {
	return apiFetch("/api/plans/generate", {
		method: "POST",
		body: JSON.stringify(payload)
	});
}
/** POST /api/plans/:id/dispatch — mark plan as dispatched, create tasks */
async function dispatchPlan(planId) {
	return apiFetch(`/api/plans/${encodeURIComponent(planId)}/dispatch`, {
		method: "POST",
		body: JSON.stringify({})
	});
}
/** PATCH /api/tasks/:id — update a task's status */
async function patchTask(taskId, patch) {
	return apiFetch(`/api/tasks/${encodeURIComponent(taskId)}`, {
		method: "PATCH",
		body: JSON.stringify(patch)
	});
}
/** POST /api/tasks/:id/proof — submit before/after photos */
async function submitProofAws(taskId, payload) {
	return apiFetch(`/api/tasks/${encodeURIComponent(taskId)}/proof`, {
		method: "POST",
		body: JSON.stringify(payload)
	}, 3e4);
}
/** POST /api/proofs/:id/review — officer approve / reject */
async function reviewProofAws(proofId, payload) {
	return apiFetch(`/api/proofs/${encodeURIComponent(proofId)}/review`, {
		method: "POST",
		body: JSON.stringify(payload)
	});
}
/** PATCH /api/settings — persist settings */
async function patchSettings(patch) {
	return apiFetch("/api/settings", {
		method: "PATCH",
		body: JSON.stringify(patch)
	});
}
var KEY = "nalasetu.demo.v1";
var fresh = () => ({
	scenario: "heavy",
	weatherMode: "demo",
	bases: buildDemoDrains(),
	statuses: {},
	tasks: [],
	plan: null,
	audit: [],
	reports: [],
	weatherCache: null
});
var uid = (p) => `${p}-${Date.now().toString(36)}${Math.floor(Math.random() * 1e4).toString(36)}`.toUpperCase();
var C = (0, import_react.createContext)(null);
/** Map an AWS drain record to a local DrainBase (handles any field name differences). */
function awsDrainToBase(d) {
	return {
		id: d.id,
		name: d.name,
		lat: d.lat,
		lng: d.lng,
		slope: d.slope,
		lowLying: d.lowLying,
		historicalChokes: d.historicalChokes,
		lastCleaned: d.lastCleaned,
		citizenReports: d.citizenReports,
		rainfallForecastMm: d.rainfallForecastMm,
		cleaningTimeMin: d.cleaningTimeMin,
		adjacentPopulationWeight: d.adjacentPopulationWeight,
		ward: d.ward
	};
}
function NalaProvider({ children }) {
	const [s, setS] = (0, import_react.useState)(fresh);
	const [ready, setReady] = (0, import_react.useState)(false);
	const [live, setLive] = (0, import_react.useState)(null);
	const [awsStatus, setAwsStatus] = (0, import_react.useState)(AWS_CONFIGURED ? "idle" : "unconfigured");
	const sRef = (0, import_react.useRef)(s);
	sRef.current = s;
	(0, import_react.useEffect)(() => {
		try {
			const raw = localStorage.getItem(KEY);
			if (raw) setS({
				...fresh(),
				...JSON.parse(raw)
			});
		} catch {}
		setReady(true);
	}, []);
	(0, import_react.useEffect)(() => {
		if (!ready) return;
		try {
			localStorage.setItem(KEY, JSON.stringify(s));
		} catch {
			toast.error("Local storage full — some demo photos may not persist.");
		}
	}, [s, ready]);
	(0, import_react.useEffect)(() => {
		if (!ready || !AWS_CONFIGURED) return;
		setAwsStatus("checking");
		listDrains().then((res) => {
			if (res.ok && res.data.length > 0) {
				const bases = res.data.map(awsDrainToBase);
				setS((p) => ({
					...p,
					bases
				}));
				setAwsStatus("connected");
			} else setAwsStatus(res.ok ? "connected" : "error");
		});
	}, [ready]);
	const refreshWeather = (0, import_react.useCallback)(async () => {
		try {
			const r = await fetch("/api/weather");
			if (!r.ok) throw new Error();
			const w = await r.json();
			if (w.source !== "live") throw new Error();
			setLive(w);
			setS((p) => ({
				...p,
				weatherCache: w
			}));
		} catch {
			const c = sRef.current.weatherCache;
			setLive(c ? {
				...c,
				source: "cached"
			} : null);
			toast.warning(c ? "Live forecast unavailable — using cached value." : "Live forecast unavailable — using demo scenario.");
		}
	}, []);
	(0, import_react.useEffect)(() => {
		if (ready && s.weatherMode === "live") refreshWeather();
	}, [
		ready,
		s.weatherMode,
		refreshWeather
	]);
	const weather = (0, import_react.useMemo)(() => {
		if (s.weatherMode === "live" && live) return live;
		return {
			forecastMm72h: SCENARIO_MM[s.scenario],
			source: "demo",
			fetchedAt: new Date(2026, 9, 7).toISOString()
		};
	}, [
		s.weatherMode,
		s.scenario,
		live
	]);
	const forecastMm = weather.forecastMm72h;
	const drainRain = (0, import_react.useCallback)((d) => +(d.rainfallForecastMm * (forecastMm / SCENARIO_MM.heavy)).toFixed(1), [forecastMm]);
	const drains = (0, import_react.useMemo)(() => s.bases.map((b) => {
		const r = scoreRisk(b, drainRain(b));
		return {
			...b,
			riskScore: r.score,
			riskBand: r.band,
			status: s.statuses[b.id] ?? "UNASSIGNED"
		};
	}), [
		s.bases,
		s.statuses,
		drainRain
	]);
	const log = (p, e) => [{
		...e,
		id: uid("A"),
		timestamp: (/* @__PURE__ */ new Date()).toISOString()
	}, ...p.audit].slice(0, 500);
	const generatePlan = (0, import_react.useCallback)(() => {
		const plan = {
			...optimizePlan(drains, DEMO_CREWS),
			id: uid("PLAN"),
			createdAt: (/* @__PURE__ */ new Date()).toISOString(),
			naiveHighCoverage: naivePlan(drains, DEMO_CREWS).highCoverage,
			dispatched: false
		};
		setS((p) => ({
			...p,
			plan,
			audit: log(p, {
				actor: "Officer (demo)",
				drainId: "—",
				oldStatus: null,
				newStatus: null,
				reason: `Generated plan ${plan.id}`
			})
		}));
		if (AWS_CONFIGURED) generatePlanAws({
			scenario: sRef.current.scenario,
			forecastMm72h: sRef.current.weatherCache?.forecastMm72h ?? SCENARIO_MM[sRef.current.scenario]
		}).then((res) => {
			if (!res.ok) console.warn("[AWS] generatePlan failed:", res.error);
		});
		return plan;
	}, [drains]);
	const recompute = (plan, crews) => {
		const byId = new Map(drains.map((d) => [d.id, d]));
		const rebuilt = crews.map((cp) => {
			const crew = DEMO_CREWS.find((c) => c.id === cp.crewId);
			return {
				...optimizePlan(cp.drainIds.map((id) => ({
					...byId.get(id),
					status: "UNASSIGNED",
					riskBand: "HIGH"
				})), [{
					...crew,
					availableHours: 99
				}]).crews[0],
				crewId: cp.crewId
			};
		});
		return {
			...plan,
			crews: rebuilt,
			hoursPlanned: +(rebuilt.reduce((a, c) => a + c.totalMin, 0) / 60).toFixed(1),
			highCoverage: Math.round(drains.filter((d) => d.riskBand === "HIGH" && rebuilt.some((c) => c.drainIds.includes(d.id))).length / Math.max(1, drains.filter((d) => d.riskBand === "HIGH").length) * 100)
		};
	};
	const fits = (plan, crewId) => {
		const c = DEMO_CREWS.find((x) => x.id === crewId);
		return plan.crews.find((x) => x.crewId === crewId).totalMin <= c.availableHours * 60;
	};
	const removeFromPlan = (crewId, drainId) => setS((p) => {
		if (!p.plan) return p;
		return {
			...p,
			plan: recompute(p.plan, p.plan.crews.map((c) => c.crewId === crewId ? {
				...c,
				drainIds: c.drainIds.filter((d) => d !== drainId)
			} : c))
		};
	});
	const reassign = (fromCrew, drainId, toCrew) => setS((p) => {
		if (!p.plan) return p;
		const next = recompute(p.plan, p.plan.crews.map((c) => c.crewId === fromCrew ? {
			...c,
			drainIds: c.drainIds.filter((d) => d !== drainId)
		} : c.crewId === toCrew ? {
			...c,
			drainIds: [...c.drainIds, drainId]
		} : c));
		if (!fits(next, toCrew)) {
			toast.error("Reassignment would exceed that crew's available hours.");
			return p;
		}
		return {
			...p,
			plan: next
		};
	});
	const addToPlan = (drainId) => setS((p) => {
		if (!p.plan || p.plan.dispatched) {
			toast.error("Generate a new plan first, then add drains.");
			return p;
		}
		if (p.plan.crews.some((c) => c.drainIds.includes(drainId))) {
			toast.info("Already in plan.");
			return p;
		}
		for (const c of [...p.plan.crews].sort((a, b) => a.totalMin - b.totalMin)) {
			const next = recompute(p.plan, p.plan.crews.map((x) => x.crewId === c.crewId ? {
				...x,
				drainIds: [...x.drainIds, drainId]
			} : x));
			if (fits(next, c.crewId)) {
				toast.success(`Added ${drainId} to ${DEMO_CREWS.find((k) => k.id === c.crewId).name}`);
				return {
					...p,
					plan: next
				};
			}
		}
		toast.error("No crew has enough remaining hours.");
		return p;
	});
	const dispatchAll = () => {
		setS((p) => {
			if (!p.plan) return p;
			const statuses = { ...p.statuses };
			let audit = p.audit;
			const tasks = [...p.tasks];
			p.plan.crews.forEach((c) => c.drainIds.forEach((id, i) => {
				const cur = statuses[id] ?? "UNASSIGNED";
				if (!canTransition(cur, "ASSIGNED")) return;
				statuses[id] = "ASSIGNED";
				tasks.push({
					id: uid("T"),
					drainId: id,
					crewId: c.crewId,
					order: i + 1,
					status: "ASSIGNED"
				});
				audit = log({
					...p,
					audit
				}, {
					actor: "Officer (demo)",
					drainId: id,
					oldStatus: cur,
					newStatus: "ASSIGNED",
					reason: `Dispatched to ${DEMO_CREWS.find((k) => k.id === c.crewId).name}`
				});
			}));
			return {
				...p,
				statuses,
				tasks,
				audit,
				plan: {
					...p.plan,
					dispatched: true
				}
			};
		});
		const planId = sRef.current.plan?.id;
		if (AWS_CONFIGURED && planId) dispatchPlan(planId).then((res) => {
			if (!res.ok) console.warn("[AWS] dispatchPlan failed:", res.error);
		});
	};
	const transition = (drainId, to, actor, reason) => {
		const cur = sRef.current.statuses[drainId] ?? "UNASSIGNED";
		if (!canTransition(cur, to)) {
			toast.error(`Invalid transition: ${STATUS_LABEL[cur]} → ${STATUS_LABEL[to]}`);
			return false;
		}
		setS((p) => ({
			...p,
			statuses: {
				...p.statuses,
				[drainId]: to
			},
			tasks: p.tasks.map((t) => t.drainId === drainId && t.status !== "VERIFIED" && t.status !== "REJECTED" ? {
				...t,
				status: to
			} : t),
			audit: log(p, {
				actor,
				drainId,
				oldStatus: cur,
				newStatus: to,
				reason
			})
		}));
		if (AWS_CONFIGURED) {
			const task = sRef.current.tasks.find((t) => t.drainId === drainId && t.status !== "VERIFIED" && t.status !== "REJECTED");
			if (task) patchTask(task.id, { status: to }).then((res) => {
				if (!res.ok) console.warn("[AWS] patchTask failed:", res.error);
			});
		}
		return true;
	};
	const setPhoto = (taskId, kind, data) => setS((p) => ({
		...p,
		tasks: p.tasks.map((t) => t.id === taskId ? {
			...t,
			[kind === "before" ? "beforePhoto" : "afterPhoto"]: data
		} : t)
	}));
	const submitProof = async (taskId) => {
		const t = sRef.current.tasks.find((x) => x.id === taskId);
		if (!t?.beforePhoto || !t.afterPhoto) throw new Error("Both photos are required.");
		const drain = drains.find((d) => d.id === t.drainId);
		if (!transition(t.drainId, "PROOF_SUBMITTED", crewName(t.crewId), "Before/after proof submitted")) return;
		let v = {
			verdict: "REVIEW",
			confidence: 0,
			reason: "AI unavailable — routed to manual review.",
			mode: "lovable-ai"
		};
		let awsProofOk = false;
		if (AWS_CONFIGURED) try {
			const awsRes = await submitProofAws(taskId, {
				before: t.beforePhoto,
				after: t.afterPhoto
			});
			if (awsRes.ok && awsRes.data.verification) {
				const av = awsRes.data.verification;
				v = {
					verdict: av.verdict,
					confidence: av.confidence,
					reason: av.reason,
					mode: av.mode
				};
				awsProofOk = true;
			}
		} catch {}
		if (!awsProofOk) try {
			const r = await verifyProof({ data: {
				before: t.beforePhoto,
				after: t.afterPhoto,
				drainId: drain.id,
				drainName: drain.name
			} });
			if (r.ok) v = {
				verdict: r.verdict,
				confidence: r.confidence,
				reason: r.reason,
				mode: "lovable-ai"
			};
			else {
				v = {
					verdict: "REVIEW",
					confidence: 0,
					reason: `${r.error} Routed to manual review.`,
					mode: "lovable-ai"
				};
				toast.error(r.error);
			}
		} catch {
			v = {
				verdict: "REVIEW",
				confidence: 0,
				reason: "AI unavailable — routed to manual review.",
				mode: "lovable-ai"
			};
		}
		setS((p) => ({
			...p,
			tasks: p.tasks.map((x) => x.id === taskId ? {
				...x,
				submittedAt: (/* @__PURE__ */ new Date()).toISOString(),
				verification: v
			} : x),
			audit: log(p, {
				actor: awsProofOk ? "AWS Lambda" : "Lovable AI",
				drainId: t.drainId,
				oldStatus: "PROOF_SUBMITTED",
				newStatus: "PROOF_SUBMITTED",
				reason: `AI verdict ${v.verdict} @ ${v.confidence}%`
			})
		}));
		if (v.verdict === "REVIEW") setTimeout(() => transition(t.drainId, "NEEDS_REVIEW", awsProofOk ? "AWS Lambda" : "Lovable AI", "Low confidence — manual review required"), 0);
	};
	const review = (taskId, decision) => {
		const t = sRef.current.tasks.find((x) => x.id === taskId);
		if (!t) return;
		const to = decision === "APPROVED" ? "VERIFIED" : "REJECTED";
		const reason = `Officer ${decision.toLowerCase()} · AI ${t.verification?.verdict ?? "N/A"} ${t.verification?.confidence ?? 0}%`;
		if (!transition(t.drainId, to, "Officer (demo)", reason)) return;
		setS((p) => ({
			...p,
			tasks: p.tasks.map((x) => x.id === taskId ? {
				...x,
				status: to,
				officerDecision: decision,
				officerAt: (/* @__PURE__ */ new Date()).toISOString()
			} : x),
			statuses: decision === "REJECTED" ? {
				...p.statuses,
				[t.drainId]: "REJECTED"
			} : p.statuses
		}));
		if (AWS_CONFIGURED) reviewProofAws(taskId, {
			decision,
			officerName: "Officer"
		}).then((res) => {
			if (!res.ok) console.warn("[AWS] reviewProof failed:", res.error);
		});
	};
	const addReport = (r) => {
		const id = uid("R");
		setS((p) => ({
			...p,
			reports: [{
				...r,
				id,
				createdAt: (/* @__PURE__ */ new Date()).toISOString()
			}, ...p.reports],
			bases: p.bases.map((b) => b.id === r.drainId ? {
				...b,
				citizenReports: b.citizenReports + 1
			} : b),
			audit: log(p, {
				actor: "Citizen (demo)",
				drainId: r.drainId,
				oldStatus: null,
				newStatus: null,
				reason: `Report: ${r.issue}`
			})
		}));
		return id;
	};
	const setScenarioWithAwsSync = (scenario) => {
		setS((p) => ({
			...p,
			scenario
		}));
		if (AWS_CONFIGURED) patchSettings({ scenario }).then((res) => {
			if (!res.ok) console.warn("[AWS] patchSettings failed:", res.error);
		});
	};
	const setWeatherModeWithAwsSync = (weatherMode) => {
		setS((p) => ({
			...p,
			weatherMode
		}));
		if (AWS_CONFIGURED) patchSettings({ weatherMode }).then((res) => {
			if (!res.ok) console.warn("[AWS] patchSettings failed:", res.error);
		});
	};
	const value = {
		ready,
		awsMode: AWS_CONFIGURED,
		awsStatus,
		scenario: s.scenario,
		weatherMode: s.weatherMode,
		weather,
		forecastMm,
		drains,
		crews: DEMO_CREWS,
		tasks: s.tasks,
		plan: s.plan,
		audit: s.audit,
		reports: s.reports,
		drainRain,
		setScenario: setScenarioWithAwsSync,
		setWeatherMode: setWeatherModeWithAwsSync,
		refreshWeather,
		generatePlan,
		removeFromPlan,
		reassign,
		addToPlan,
		dispatchAll,
		transition,
		setPhoto,
		submitProof,
		review,
		addReport,
		resetDemo: () => {
			setS(fresh());
			setLive(null);
			toast.success("Demo data reset.");
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(C.Provider, {
		value,
		children
	});
}
function useNala() {
	const v = (0, import_react.useContext)(C);
	if (!v) throw new Error("useNala outside provider");
	return v;
}
//#endregion
export { explanation as a, recommendation as c, verifyProof as d, createSsrRpc as i, scoreRisk as l, STATUS_LABEL as n, fmtMin as o, WEIGHTS as r, reasons as s, NalaProvider as t, useNala as u };
