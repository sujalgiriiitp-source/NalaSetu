import { o as __toESM } from "../_runtime.mjs";
import { G as isRedirect, x as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { L as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as Button } from "./button-BP29gmjJ.mjs";
import { d as verifyProof } from "./store-DM6PPzvT.mjs";
import { $ as ChevronRight, A as LoaderCircle, B as FileDown, R as FlaskConical, W as Download, X as CircleX, Z as CircleCheck, et as ChevronLeft, p as Trash2, r as X, t as ZoomIn, u as Upload, z as FileText } from "../_libs/lucide-react.mjs";
import { r as Kpi, t as AppShell } from "./AppShell-DhLdAZ0I.mjs";
import { i as Tag } from "./badges-CBrcW0l3.mjs";
import { a as Line, c as ResponsiveContainer, i as XAxis, l as Tooltip, n as LineChart, o as CartesianGrid, r as YAxis } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/verification-lab-CAkM0RBz.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function useServerFn(serverFn) {
	const router = useRouter();
	return import_react.useCallback(async (...args) => {
		try {
			const res = await serverFn(...args);
			if (isRedirect(res)) throw res;
			return res;
		} catch (err) {
			if (isRedirect(err)) {
				err.options._fromLocation = router.stores.location.get();
				return router.navigate(router.resolveRedirect(err).options);
			}
			throw err;
		}
	}, [router, serverFn]);
}
var test_before_default = "/assets/test-before-CGLeLOME.jpg";
/** Repeatable proof-verification scenarios. Photos are realistic sample images, not field data. */
var FIXTURES = [
	{
		id: "genuine",
		title: "Genuine cleaning",
		description: "Same drain, blockage removed.",
		before: test_before_default,
		after: "/assets/test-after-clean-CLhLXWBq.jpg",
		expect: {
			verdict: "PASS",
			minConfidence: 70,
			sameLocation: true,
			obstructionAfter: false
		}
	},
	{
		id: "not-cleaned",
		title: "Still blocked",
		description: "Same drain, garbage still present.",
		before: test_before_default,
		after: "/assets/test-after-dirty-CDJfz6EV.jpg",
		expect: {
			verdict: "REVIEW",
			sameLocation: true,
			obstructionAfter: true
		}
	},
	{
		id: "wrong-location",
		title: "Different location",
		description: "After photo taken at another site.",
		before: test_before_default,
		after: "/assets/test-other-location-C7EBCQX9.jpg",
		expect: {
			verdict: "REVIEW",
			sameLocation: false
		}
	},
	{
		id: "reused",
		title: "Reused photo",
		description: "Same image submitted twice.",
		before: test_before_default,
		after: test_before_default,
		expect: {
			verdict: "REVIEW",
			maxConfidence: 10
		}
	}
];
async function urlToJpegDataUrl(url) {
	const img = await new Promise((res, rej) => {
		const i = new Image();
		i.crossOrigin = "anonymous";
		i.onload = () => res(i);
		i.onerror = () => rej(/* @__PURE__ */ new Error("Could not load test photo."));
		i.src = url;
	});
	const scale = Math.min(1, 900 / Math.max(img.width, img.height));
	const c = document.createElement("canvas");
	c.width = Math.round(img.width * scale);
	c.height = Math.round(img.height * scale);
	c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
	return c.toDataURL("image/jpeg", .75);
}
function checkExpectation(e, a) {
	const fails = [];
	if (a.verdict !== e.verdict) fails.push(`verdict ${a.verdict} ≠ ${e.verdict}`);
	if (e.minConfidence !== void 0 && a.confidence < e.minConfidence) fails.push(`confidence ${a.confidence} < ${e.minConfidence}`);
	if (e.maxConfidence !== void 0 && a.confidence > e.maxConfidence) fails.push(`confidence ${a.confidence} > ${e.maxConfidence}`);
	if (e.sameLocation !== void 0 && a.sameLocation !== e.sameLocation) fails.push(`location match ${a.sameLocation} ≠ ${e.sameLocation}`);
	if (e.obstructionAfter !== void 0 && a.obstructionAfter !== e.obstructionAfter) fails.push(`still blocked ${a.obstructionAfter} ≠ ${e.obstructionAfter}`);
	return fails;
}
var TREND_OUTCOMES = [
	{
		key: "pass",
		label: "AI pass",
		color: "var(--risk-low)",
		dash: void 0
	},
	{
		key: "review",
		label: "Officer review",
		color: "var(--st-review)",
		dash: "5 3"
	},
	{
		key: "unexpected",
		label: "Unexpected",
		color: "var(--primary)",
		dash: "2 3"
	}
];
function summarizeTrendChanges(buckets) {
	const metrics = [
		"confidence",
		"location",
		"officer"
	];
	return TREND_OUTCOMES.map(({ key }) => {
		return {
			key,
			changes: Object.fromEntries(metrics.map((metric) => {
				const populated = buckets.flatMap((bucket) => {
					const value = bucket.outcomes[key][metric];
					return value === null ? [] : [{
						value,
						label: bucket.t
					}];
				});
				let largest = null;
				for (let i = 1; i < populated.length; i += 1) {
					const previous = populated[i - 1];
					const current = populated[i];
					if (!previous || !current) continue;
					const candidate = {
						metric,
						delta: current.value - previous.value,
						from: previous.label,
						to: current.label
					};
					if (!largest || Math.abs(candidate.delta) > Math.abs(largest.delta)) largest = candidate;
				}
				return [metric, largest];
			}))
		};
	});
}
function groupTestTrends(runs, scale) {
	const buckets = /* @__PURE__ */ new Map();
	for (const run of runs) {
		const start = new Date(run.at);
		if (!Number.isFinite(start.getTime())) continue;
		start.setHours(0, 0, 0, 0);
		if (scale === "week") start.setDate(start.getDate() - (start.getDay() + 6) % 7);
		if (scale === "month") start.setDate(1);
		const end = new Date(start);
		if (scale === "week") end.setDate(end.getDate() + 6);
		if (scale === "month") {
			end.setMonth(end.getMonth() + 1);
			end.setDate(0);
		}
		const bucket = buckets.get(start.getTime()) ?? {
			start,
			end,
			runs: []
		};
		bucket.runs.push(run);
		buckets.set(start.getTime(), bucket);
	}
	const fullDate = (d) => d.toLocaleDateString("en-GB", {
		day: "numeric",
		month: "short",
		year: "numeric"
	});
	return [...buckets.entries()].sort(([a], [b]) => a - b).map(([, b]) => {
		const runCount = b.runs.length;
		const locationCount = b.runs.filter((r) => r.actual.sameLocation).length;
		const officerCount = b.runs.filter((r) => r.actual.verdict === "REVIEW").length;
		const passCount = b.runs.filter((r) => r.actual.verdict === "PASS").length;
		const unexpectedCount = b.runs.filter((r) => (r.fails?.length ?? 0) > 0).length;
		const metrics = (runs) => ({
			runCount: runs.length,
			confidence: runs.length ? Math.round(runs.reduce((sum, r) => sum + r.actual.confidence, 0) / runs.length) : null,
			location: runs.length ? Math.round(runs.filter((r) => r.actual.sameLocation).length / runs.length * 100) : null,
			officer: runs.length ? Math.round(runs.filter((r) => r.actual.verdict === "REVIEW").length / runs.length * 100) : null
		});
		const short = b.start.toLocaleDateString("en-GB", scale === "month" ? {
			month: "short",
			year: "numeric"
		} : {
			month: "short",
			day: "numeric"
		});
		return {
			t: scale === "week" ? `Wk of ${short}` : short,
			dateRange: scale === "day" ? fullDate(b.start) : `${fullDate(b.start)} – ${fullDate(b.end)}`,
			runCount,
			locationCount,
			officerCount,
			passCount,
			unexpectedCount,
			outcomes: {
				pass: metrics(b.runs.filter((r) => r.actual.verdict === "PASS")),
				review: metrics(b.runs.filter((r) => r.actual.verdict === "REVIEW")),
				unexpected: metrics(b.runs.filter((r) => (r.fails?.length ?? 0) > 0))
			},
			confidence: Math.round(b.runs.reduce((s, r) => s + r.actual.confidence, 0) / runCount),
			location: Math.round(locationCount / runCount * 100),
			officer: Math.round(officerCount / runCount * 100)
		};
	});
}
var EXPECTS = {
	none: {
		label: "No expectation — just show result",
		e: null
	},
	clean: {
		label: "Should pass (same drain, cleared)",
		e: {
			verdict: "PASS",
			minConfidence: 70,
			sameLocation: true,
			obstructionAfter: false
		}
	},
	dirty: {
		label: "Should flag (still blocked)",
		e: {
			verdict: "REVIEW",
			sameLocation: true,
			obstructionAfter: true
		}
	},
	place: {
		label: "Should flag (different place)",
		e: {
			verdict: "REVIEW",
			sameLocation: false
		}
	}
};
var KEY = "nalasetu.uploadTestHistory";
async function thumb(url) {
	const img = new Image();
	img.src = url;
	await img.decode();
	const c = document.createElement("canvas");
	const w = 160;
	c.width = w;
	c.height = Math.round(img.height / img.width * w);
	const ctx = c.getContext("2d");
	if (!ctx) throw new Error("Could not prepare the photo.");
	ctx.drawImage(img, 0, 0, c.width, c.height);
	return c.toDataURL("image/jpeg", .6);
}
var esc = (v) => v.replace(/[&<>"]/g, (c) => ({
	"&": "&amp;",
	"<": "&lt;",
	">": "&gt;",
	"\"": "&quot;"
})[c] ?? c);
function download(name, body, type) {
	const a = document.createElement("a");
	a.href = URL.createObjectURL(new Blob([body], { type }));
	a.download = name;
	a.click();
	URL.revokeObjectURL(a.href);
}
var outcome = (r) => r.fails ? r.fails.length ? "Unexpected" : "As expected" : "—";
function exportCsv(h) {
	const q = (v) => `"${String(v).replace(/"/g, "\"\"")}"`;
	download("nalasetu-photo-tests.csv", [[
		"Time",
		"Expected",
		"AI verdict",
		"Confidence %",
		"Same location",
		"Still blocked",
		"Officer review",
		"Outcome",
		"AI reason"
	], ...h.map((r) => [
		r.at,
		EXPECTS[r.expect]?.label ?? r.expect,
		r.actual.verdict,
		r.actual.confidence,
		r.actual.sameLocation ? "Yes" : "No",
		r.actual.obstructionAfter ? "Yes" : "No",
		r.actual.verdict === "REVIEW" ? "Yes" : "No",
		outcome(r),
		r.reason
	])].map((r) => r.map(q).join(",")).join("\n"), "text/csv");
}
function exportHtml(h) {
	const n = h.length, pass = h.filter((r) => r.actual.verdict === "PASS").length, same = h.filter((r) => r.actual.sameLocation).length;
	const avg = n ? Math.round(h.reduce((s, r) => s + r.actual.confidence, 0) / n) : 0;
	const rows = h.map((r) => `<tr><td>${esc(new Date(r.at).toLocaleString())}</td><td><img src="${r.before}"><img src="${r.after}"></td><td>${r.actual.verdict === "REVIEW" ? "Officer review" : "Pass"}</td><td>${r.actual.confidence}%</td><td>${r.actual.sameLocation ? "Same" : "Different"}</td><td>${r.actual.obstructionAfter ? "Still blocked" : "Cleared"}</td><td>${esc(outcome(r))}</td><td>${esc(r.reason)}</td></tr>`).join("");
	download("nalasetu-photo-test-report.html", `<!doctype html><meta charset="utf-8"><title>NalaSetu photo test report</title><style>body{font:13px Arial;margin:24px}table{border-collapse:collapse;width:100%}td,th{border:1px solid #ccc;padding:6px;vertical-align:top;text-align:left}img{width:80px;margin-right:4px}</style><h1>NalaSetu — uploaded photo test report</h1><p>Generated ${esc((/* @__PURE__ */ new Date()).toLocaleString())}. Runs: ${n} · Passed: ${pass} · Sent to officer: ${n - pass} · Same location: ${same}/${n} · Average confidence: ${avg}%</p><table><tr><th>Time</th><th>Before / After</th><th>Result</th><th>Confidence</th><th>Location</th><th>Drain</th><th>Vs expected</th><th>AI reason</th></tr>${rows}</table>`, "text/html");
}
async function chartImage(container) {
	const svg = container?.querySelector("svg.recharts-surface");
	if (!svg) throw new Error("Charts are not ready yet. Please try again.");
	const clone = svg.cloneNode(true);
	const originals = [svg, ...svg.querySelectorAll("*")];
	const copies = [clone, ...clone.querySelectorAll("*")];
	originals.forEach((node, i) => {
		const copy = copies[i];
		if (!copy) return;
		const computed = getComputedStyle(node);
		for (const prop of [
			"fill",
			"stroke",
			"stroke-width",
			"stroke-dasharray",
			"font-family",
			"font-size",
			"font-weight",
			"opacity"
		]) copy.style.setProperty(prop, computed.getPropertyValue(prop));
	});
	const { width, height } = svg.getBoundingClientRect();
	clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
	clone.setAttribute("width", String(width));
	clone.setAttribute("height", String(height));
	const url = URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(clone)], { type: "image/svg+xml;charset=utf-8" }));
	try {
		const img = new Image();
		img.src = url;
		await img.decode();
		const canvas = document.createElement("canvas");
		canvas.width = width * 3;
		canvas.height = height * 3;
		const ctx = canvas.getContext("2d");
		if (!ctx) throw new Error("Could not prepare report charts.");
		ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue("--card");
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
		return canvas.toDataURL("image/png");
	} finally {
		URL.revokeObjectURL(url);
	}
}
function TrendTooltip({ active, payload }) {
	const bucket = payload?.[0]?.payload;
	if (!active || !bucket) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		role: "tooltip",
		className: "rounded-md border bg-popover p-3 text-xs text-popover-foreground shadow-md",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "font-semibold",
				children: bucket.dateRange
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-2 text-muted-foreground",
				children: [
					bucket.runCount,
					" ",
					bucket.runCount === 1 ? "run" : "runs"
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: ["Average confidence: ", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("b", { children: [bucket.confidence, "%"] })] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				"Same location: ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("b", { children: [bucket.location, "%"] }),
				" (",
				bucket.locationCount,
				"/",
				bucket.runCount,
				")"
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				"Officer review: ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("b", { children: [bucket.officer, "%"] }),
				" (",
				bucket.officerCount,
				"/",
				bucket.runCount,
				")"
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: ["AI pass: ", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("b", { children: [
				bucket.passCount,
				"/",
				bucket.runCount
			] })] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: ["Unexpected vs expectation: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: bucket.unexpectedCount })] }),
			TREND_OUTCOMES.map(({ key, label }) => {
				const m = bucket.outcomes[key];
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-2 border-t pt-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "font-semibold",
						children: [
							label,
							" · ",
							m.runCount,
							" runs"
						]
					}), m.runCount ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						"Confidence ",
						m.confidence,
						"% · Location ",
						m.location,
						"% · Review ",
						m.officer,
						"%"
					] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: "No runs" })]
				}, key);
			})
		]
	});
}
var OUTCOME_CLASSES = {
	pass: "text-risk-low",
	review: "text-st-review",
	unexpected: "text-primary"
};
var COUNT_KEYS = {
	pass: "passCount",
	review: "officerCount",
	unexpected: "unexpectedCount"
};
var METRIC_LABELS = {
	confidence: "Confidence",
	location: "Location match",
	officer: "Officer review"
};
function ChangeSummary({ buckets }) {
	const summaries = summarizeTrendChanges(buckets);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		"aria-labelledby": "trend-change-heading",
		className: "mb-2 border-y bg-muted/30 p-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			id: "trend-change-heading",
			className: "mb-2 text-xs font-semibold",
			children: "Largest changes in selected range"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-3 sm:grid-cols-3 sm:divide-x",
			children: summaries.map(({ key, changes }) => {
				const meta = TREND_OUTCOMES.find((item) => item.key === key);
				if (!meta) return null;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0 sm:pl-3 first:pl-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: `mb-1.5 text-xs font-semibold ${OUTCOME_CLASSES[key]}`,
						children: meta.label
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", {
						className: "space-y-1.5 text-[11px]",
						children: Object.keys(METRIC_LABELS).map((metric) => {
							const change = changes[metric];
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "text-muted-foreground",
								children: METRIC_LABELS[metric]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "font-medium",
								children: change ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
									change.delta > 0 ? "+" : "",
									change.delta,
									" points ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-normal text-muted-foreground",
										children: [
											"· ",
											change.from,
											" → ",
											change.to
										]
									})
								] }) : "Not enough buckets"
							})] }, metric);
						})
					})]
				}, key);
			})
		})]
	});
}
function exportTrendsCsv(buckets, scale) {
	const esc = (v) => /[",\n]/.test(String(v)) ? `"${String(v).replace(/"/g, "\"\"")}"` : String(v);
	const rows = [[
		"bucket",
		"date_range",
		"run_count",
		"avg_confidence_pct",
		"same_location_pct",
		"same_location_count",
		"officer_review_pct",
		"officer_review_count",
		"ai_pass_count",
		"unexpected_count"
	], ...buckets.map((b) => [
		b.t,
		b.dateRange,
		b.runCount,
		b.confidence,
		b.location,
		b.locationCount,
		b.officer,
		b.officerCount,
		b.passCount,
		b.unexpectedCount
	])];
	const blob = new Blob([rows.map((r) => r.map(esc).join(",")).join("\n")], { type: "text/csv" });
	const a = document.createElement("a");
	a.href = URL.createObjectURL(blob);
	a.download = `nalasetu-trend-data-${scale}.csv`;
	a.click();
	URL.revokeObjectURL(a.href);
}
async function exportPdf(h, scale, charts) {
	const { jsPDF } = await import("../_libs/jspdf.mjs").then((n) => /* @__PURE__ */ __toESM(n.t()));
	const doc = new jsPDF({
		unit: "mm",
		format: "a4"
	}), M = 12, CW = 186;
	const n = h.length, pass = h.filter((r) => r.actual.verdict === "PASS").length, same = h.filter((r) => r.actual.sameLocation).length;
	const avg = n ? Math.round(h.reduce((s, r) => s + r.actual.confidence, 0) / n) : 0;
	let y = M;
	doc.setFontSize(15);
	doc.text("NalaSetu — uploaded photo test report", M, y);
	y += 6;
	doc.setFontSize(9);
	doc.setTextColor(90);
	const summary = doc.splitTextToSize(`Generated ${(/* @__PURE__ */ new Date()).toLocaleString()} | Runs: ${n} | AI pass: ${pass} | Officer review: ${n - pass} | Same location: ${same}/${n} | Avg confidence: ${avg}%`, CW);
	doc.text(summary, M, y);
	y += summary.length * 4 + 6;
	doc.setTextColor(0);
	doc.setFontSize(11);
	doc.text(`Trends — ${scale[0]?.toUpperCase()}${scale.slice(1)} grouping`, M, y);
	y += 5;
	doc.setFontSize(8);
	const notes = doc.splitTextToSize(`Current filtered history: ${n} runs, ${groupTestTrends(h, scale).length} time buckets. Local calendar dates; weeks start Monday. AI pass is not officer approval.`, CW);
	doc.text(notes, M, y);
	y += notes.length * 4 + 6;
	const labels = [
		"Confidence by outcome (%)",
		"Location match by outcome (%)",
		"Officer-review rate by outcome (%)",
		"Runs by outcome (count)"
	];
	for (const [i, chart] of charts.entries()) {
		if (y + 68 > 280) {
			doc.addPage();
			y = M;
		}
		doc.setFontSize(10);
		doc.text(labels[i] ?? `Chart ${i + 1}`, M, y);
		y += 3;
		doc.addImage(chart, "PNG", M, y, CW, 58);
		y += 65;
	}
	doc.setFontSize(8);
	const seriesNote = doc.splitTextToSize("Outcomes: AI pass = solid green; officer review = dashed red; unexpected = dotted dark (solid in count chart). Unexpected means a mismatch with the chosen expectation and may overlap pass or review.", CW);
	doc.text(seriesNote, M, y);
	y += seriesNote.length * 4 + 4;
	const legend = doc.splitTextToSize("Confidence is the mean within each outcome per bucket. Location and review rates use that outcome’s run count. Missing outcomes are gaps, not zero. AI pass is not officer approval.", CW);
	doc.text(legend, M, y);
	doc.addPage();
	y = M;
	doc.setFontSize(12);
	doc.text("Uploaded-photo test results", M, y);
	y += 8;
	const imgW = 22, imgH = 16, rowH = 24;
	for (const r of h) {
		if (y + rowH > 285) {
			doc.addPage();
			y = M;
		}
		try {
			doc.addImage(r.before, "JPEG", M, y, imgW, imgH);
			doc.addImage(r.after, "JPEG", 35.5, y, imgW, imgH);
		} catch {}
		doc.setFontSize(7);
		doc.text("Before", M, y + imgH + 3);
		doc.text("After", 35.5, y + imgH + 3);
		const x = 61, tw = 137;
		doc.setFontSize(10);
		doc.text(`${r.actual.verdict === "REVIEW" ? "Officer review" : "Pass"} · ${r.actual.confidence}% confidence`, x, y + 4);
		doc.setFontSize(8);
		doc.setTextColor(90);
		doc.text(`Location: ${r.actual.sameLocation ? "same place" : "different place"} · Drain: ${r.actual.obstructionAfter ? "still blocked" : "cleared"}${r.fails ? ` · ${outcome(r)}` : ""}`, x, y + 9);
		doc.text(new Date(r.at).toLocaleString(), x, y + 13);
		const reason = doc.splitTextToSize(`AI: ${r.reason}`, tw);
		doc.text(reason.slice(0, 2), x, y + 17);
		doc.setTextColor(0);
		doc.setDrawColor(220);
		doc.line(M, y + rowH - 2, 198, y + rowH - 2);
		y += rowH;
	}
	doc.save("nalasetu-photo-test-report.pdf");
}
var FILTER_OPTS = {
	date: {
		all: "Any date",
		today: "Today",
		week: "Last 7 days"
	},
	conf: {
		all: "Any confidence",
		low: "Below 50%",
		mid: "50–79%",
		high: "80%+"
	},
	loc: {
		all: "Any location",
		same: "Same place",
		diff: "Different place"
	},
	review: {
		all: "Any result",
		review: "Officer review",
		pass: "Passed"
	}
};
function applyFilters(h, f, from, to) {
	const now = Date.now(), day = 864e5;
	const fromT = from ? (/* @__PURE__ */ new Date(`${from}T00:00:00`)).getTime() : void 0;
	const toT = to ? (/* @__PURE__ */ new Date(`${to}T23:59:59.999`)).getTime() : void 0;
	return h.filter((r) => {
		const t = new Date(r.at).getTime();
		if (fromT !== void 0 && t < fromT) return false;
		if (toT !== void 0 && t > toT) return false;
		if (f.date === "today" && new Date(r.at).toDateString() !== (/* @__PURE__ */ new Date()).toDateString()) return false;
		if (f.date === "week" && now - new Date(r.at).getTime() > 7 * day) return false;
		if (f.conf === "low" && r.actual.confidence >= 50) return false;
		if (f.conf === "mid" && (r.actual.confidence < 50 || r.actual.confidence >= 80)) return false;
		if (f.conf === "high" && r.actual.confidence < 80) return false;
		if (f.loc === "same" && !r.actual.sameLocation) return false;
		if (f.loc === "diff" && r.actual.sameLocation) return false;
		if (f.review === "review" && r.actual.verdict !== "REVIEW") return false;
		if (f.review === "pass" && r.actual.verdict !== "PASS") return false;
		return true;
	});
}
var TIPS = [
	"Stand in the same spot for both photos and frame the same landmark (wall, pole, culvert mouth, signboard).",
	"Keep the drain filling most of the frame; show the inlet or channel clearly.",
	"Shoot in daylight, no flash glare; avoid blurry or very dark photos.",
	"Before: show the silt, garbage or standing water. After: show the same stretch with the bed visible.",
	"Same angle and zoom in both — don't switch between wide and close-up.",
	"Avoid people or vehicles blocking the view, and don't reuse the same photo twice."
];
function UploadTest() {
	const verify = useServerFn(verifyProof);
	const [before, setBefore] = (0, import_react.useState)();
	const [after, setAfter] = (0, import_react.useState)();
	const [exp, setExp] = (0, import_react.useState)("none");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [out, setOut] = (0, import_react.useState)();
	const [err, setErr] = (0, import_react.useState)();
	const [hist, setHist] = (0, import_react.useState)([]);
	const [filters, setFilters] = (0, import_react.useState)({
		date: "all",
		conf: "all",
		loc: "all",
		review: "all"
	});
	const [fromDate, setFromDate] = (0, import_react.useState)("");
	const [toDate, setToDate] = (0, import_react.useState)("");
	const filtered = (0, import_react.useMemo)(() => applyFilters(hist, filters, fromDate || void 0, toDate || void 0), [
		hist,
		filters,
		fromDate,
		toDate
	]);
	const [pdfBusy, setPdfBusy] = (0, import_react.useState)(false);
	const confidenceChart = (0, import_react.useRef)(null);
	const locationChart = (0, import_react.useRef)(null);
	const officerChart = (0, import_react.useRef)(null);
	const outcomeChart = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		try {
			setHist(JSON.parse(localStorage.getItem(KEY) ?? "[]"));
		} catch {}
	}, []);
	const save = (h) => {
		setHist(h);
		try {
			localStorage.setItem(KEY, JSON.stringify(h));
		} catch {}
	};
	const runPdf = async () => {
		setPdfBusy(true);
		setErr(void 0);
		try {
			const charts = await Promise.all([
				chartImage(confidenceChart.current),
				chartImage(locationChart.current),
				chartImage(officerChart.current),
				chartImage(outcomeChart.current)
			]);
			await exportPdf(filtered, scale, charts);
		} catch (e) {
			setErr(e instanceof Error ? e.message : "Could not export the report. Please try again.");
		} finally {
			setPdfBusy(false);
		}
	};
	const [viewerIdx, setViewerIdx] = (0, import_react.useState)();
	const viewer = viewerIdx !== void 0 ? filtered[viewerIdx] : void 0;
	const [zoom, setZoom] = (0, import_react.useState)(1);
	const [scale, setScale] = (0, import_react.useState)("day");
	const [visibleOutcomes, setVisibleOutcomes] = (0, import_react.useState)({
		pass: true,
		review: true,
		unexpected: true
	});
	const chartData = (0, import_react.useMemo)(() => groupTestTrends(filtered, scale), [filtered, scale]);
	(0, import_react.useEffect)(() => {
		if (viewerIdx === void 0) return;
		const onKey = (e) => {
			if (e.key === "Escape") setViewerIdx(void 0);
			else if (e.key === "ArrowLeft") setViewerIdx((i) => i === void 0 ? i : Math.max(0, i - 1));
			else if (e.key === "ArrowRight") setViewerIdx((i) => i === void 0 ? i : Math.min(filtered.length - 1, i + 1));
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [viewerIdx, filtered.length]);
	const pick = (set) => (ev) => {
		const f = ev.target.files?.[0];
		if (!f) return;
		if (!f.type.startsWith("image/")) {
			setErr("Please choose a JPG or PNG photo.");
			return;
		}
		setErr(void 0);
		setOut(void 0);
		set(URL.createObjectURL(f));
	};
	const run = async () => {
		if (!before || !after) return;
		setBusy(true);
		setErr(void 0);
		setOut(void 0);
		try {
			const [b, a] = await Promise.all([urlToJpegDataUrl(before), urlToJpegDataUrl(after)]);
			const res = await verify({ data: {
				before: b,
				after: a,
				drainId: "TEST-UPLOAD",
				drainName: "Uploaded test"
			} });
			if (!res.ok) {
				setErr(res.error);
				return;
			}
			const actual = {
				verdict: res.verdict,
				confidence: res.confidence,
				sameLocation: res.sameLocation,
				obstructionAfter: res.obstructionAfter
			};
			const e = EXPECTS[exp]?.e;
			const o = {
				actual,
				reason: res.reason,
				fails: e ? checkExpectation(e, actual) : null
			};
			setOut(o);
			const [tb, ta] = await Promise.all([thumb(before), thumb(after)]);
			save([{
				...o,
				id: crypto.randomUUID(),
				at: (/* @__PURE__ */ new Date()).toISOString(),
				expect: exp,
				before: tb,
				after: ta
			}, ...hist].slice(0, 30));
		} catch (e) {
			setErr(e.message);
		} finally {
			setBusy(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "rounded-md border bg-card",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "border-b px-3 py-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-sm font-semibold",
					children: "Test your own photos"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-xs text-muted-foreground",
					children: "Upload a real before and after photo. Runs the same AI check crews use; nothing is saved to tasks."
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
				className: "border-b px-3 py-2 text-xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("summary", {
					className: "cursor-pointer font-medium",
					children: "How to take photos the AI can match confidently"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-1.5 list-disc space-y-0.5 pl-4 text-muted-foreground",
					children: TIPS.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: t }, t))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 gap-2 p-2",
				children: [[
					"Before",
					before,
					setBefore
				], [
					"After",
					after,
					setAfter
				]].map(([l, src, set]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "flex aspect-[4/3] cursor-pointer flex-col items-center justify-center overflow-hidden rounded border border-dashed bg-muted text-xs text-muted-foreground",
					children: [src ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src,
						alt: `${l} upload`,
						className: "h-full w-full object-cover"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "mb-1 h-5 w-5" }),
						"Choose ",
						l.toLowerCase(),
						" photo"
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "file",
						accept: "image/*",
						className: "sr-only",
						"aria-label": `${l} photo`,
						onChange: pick(set)
					})]
				}, l))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center gap-2 px-3 pb-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
					"aria-label": "Expected result",
					value: exp,
					onChange: (e) => setExp(e.target.value),
					className: "h-9 rounded-md border bg-background px-2 text-xs",
					children: Object.entries(EXPECTS).map(([k, v]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: k,
						children: v.label
					}, k))
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					size: "sm",
					onClick: run,
					disabled: !before || !after || busy,
					children: [busy && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }), "Run check"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-1.5 px-3 pb-3 text-xs",
				children: [err && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-medium text-st-review",
					children: err
				}), out && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					out.fails && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: `flex items-center gap-1 font-semibold ${out.fails.length ? "text-st-review" : "text-risk-low"}`,
						children: [out.fails.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4" }), out.fails.length ? "Unexpected result" : "As expected"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						"AI: ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: out.actual.verdict === "REVIEW" ? "REVIEW — sent to officer" : "PASS" }),
						" · ",
						out.actual.confidence,
						"% · ",
						out.actual.sameLocation ? "same place" : "different place",
						" · ",
						out.actual.obstructionAfter ? "still blocked" : "cleared"
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-muted-foreground",
						children: out.reason
					}),
					out.fails?.map((x) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-st-review",
						children: ["✗ ", x]
					}, x))
				] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "border-t px-3 py-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mr-auto text-sm font-semibold",
								children: [
									"My test runs (",
									filtered.length,
									filtered.length !== hist.length ? ` of ${hist.length}` : "",
									")"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "sm",
								variant: "outline",
								disabled: !filtered.length || pdfBusy,
								onClick: runPdf,
								children: [pdfBusy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileDown, { className: "h-4 w-4" }), "PDF"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "sm",
								variant: "outline",
								disabled: !filtered.length,
								onClick: () => exportHtml(filtered),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-4 w-4" }), "Report"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "sm",
								variant: "outline",
								disabled: !filtered.length,
								onClick: () => exportCsv(filtered),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-4 w-4" }), "Runs CSV"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "ghost",
								disabled: !hist.length,
								onClick: () => confirm("Clear test history?") && save([]),
								"aria-label": "Clear history",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
							})
						]
					}),
					hist.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-2 flex flex-wrap items-center gap-1.5",
						children: [
							Object.keys(FILTER_OPTS).map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
								"aria-label": `Filter by ${k}`,
								value: filters[k],
								onChange: (e) => setFilters({
									...filters,
									[k]: e.target.value
								}),
								className: "h-7 rounded-md border bg-background px-1.5 text-[11px]",
								children: Object.entries(FILTER_OPTS[k]).map(([v, l]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: v,
									children: l
								}, v))
							}, k)),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex items-center gap-1 text-[11px] text-muted-foreground",
								children: ["From", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "date",
									"aria-label": "From date",
									value: fromDate,
									max: toDate || void 0,
									onChange: (e) => setFromDate(e.target.value),
									className: "h-7 rounded-md border bg-background px-1 text-[11px]"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex items-center gap-1 text-[11px] text-muted-foreground",
								children: ["To", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "date",
									"aria-label": "To date",
									value: toDate,
									min: fromDate || void 0,
									onChange: (e) => setToDate(e.target.value),
									className: "h-7 rounded-md border bg-background px-1 text-[11px]"
								})]
							}),
							(fromDate || toDate) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "ghost",
								className: "h-7 px-1.5 text-[11px]",
								onClick: () => {
									setFromDate("");
									setToDate("");
								},
								children: "Clear dates"
							})
						]
					}),
					!hist.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "py-2 text-xs text-muted-foreground",
						children: "No runs yet. Results appear here after each check."
					}) : !filtered.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "py-2 text-xs text-muted-foreground",
						children: "No runs match these filters."
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [chartData.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mb-2 flex items-center gap-1.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[11px] text-muted-foreground",
										children: "Group by"
									}),
									[
										"day",
										"week",
										"month"
									].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										type: "button",
										size: "sm",
										variant: scale === s ? "default" : "outline",
										onClick: () => setScale(s),
										"aria-pressed": scale === s,
										className: "h-7 px-2 text-[11px] capitalize",
										children: s
									}, s)),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										type: "button",
										size: "sm",
										variant: "outline",
										className: "ml-auto h-7 px-2 text-[11px]",
										onClick: () => exportTrendsCsv(chartData, scale),
										"aria-label": "Export trend data as CSV",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-3.5 w-3.5" }), "Trends CSV"]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mb-2 flex flex-wrap items-center gap-1.5",
								"aria-label": "Visible outcome series",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "mr-1 text-[11px] text-muted-foreground",
									children: "Show outcomes"
								}), TREND_OUTCOMES.map(({ key, label, dash }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									type: "button",
									size: "sm",
									variant: visibleOutcomes[key] ? "outline" : "ghost",
									className: `h-7 px-2 text-[11px] ${visibleOutcomes[key] ? "" : "opacity-50"}`,
									"aria-pressed": visibleOutcomes[key],
									onClick: () => setVisibleOutcomes((current) => ({
										...current,
										[key]: !current[key]
									})),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										"aria-hidden": "true",
										className: `w-5 border-t-2 ${dash ? "border-dashed" : "border-solid"} ${OUTCOME_CLASSES[key]}`
									}), label]
								}, key))]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChangeSummary, { buckets: chartData }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-2 sm:grid-cols-2",
								children: [[
									{
										metric: "confidence",
										title: `Confidence by outcome per ${scale} (avg %)`,
										ref: confidenceChart
									},
									{
										metric: "location",
										title: `Location match by outcome per ${scale} (%)`,
										ref: locationChart
									},
									{
										metric: "officer",
										title: `Officer-review rate by outcome per ${scale} (%)`,
										ref: officerChart
									}
								].map(({ metric, title, ref }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									ref,
									className: "rounded border p-2",
									role: "figure",
									"aria-label": title,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mb-1 text-[11px] font-medium text-muted-foreground",
										children: title
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
										width: "100%",
										height: 180,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LineChart, {
											data: chartData,
											margin: {
												top: 4,
												right: 8,
												bottom: 0,
												left: -24
											},
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
													strokeDasharray: "3 3",
													className: "stroke-border"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
													dataKey: "t",
													tick: { fontSize: 9 },
													interval: "preserveStartEnd"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
													domain: [0, 100],
													tick: { fontSize: 9 }
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { content: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendTooltip, {}) }),
												TREND_OUTCOMES.map(({ key, label, color, dash }) => visibleOutcomes[key] && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
													type: "linear",
													dataKey: `outcomes.${key}.${metric}`,
													name: label,
													stroke: color,
													strokeWidth: 2,
													strokeDasharray: dash,
													connectNulls: false,
													dot: { r: 3 },
													isAnimationActive: false
												}, key))
											]
										})
									})]
								}, metric)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									ref: outcomeChart,
									className: "rounded border p-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mb-1 text-[11px] font-medium text-muted-foreground",
										children: [
											"Runs by outcome per ",
											scale,
											" (count)"
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
										width: "100%",
										height: 140,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LineChart, {
											data: chartData,
											margin: {
												top: 4,
												right: 8,
												bottom: 0,
												left: -24
											},
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
													strokeDasharray: "3 3",
													className: "stroke-border"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
													dataKey: "t",
													tick: { fontSize: 9 },
													interval: "preserveStartEnd"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
													allowDecimals: false,
													tick: { fontSize: 9 }
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { content: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendTooltip, {}) }),
												TREND_OUTCOMES.map(({ key, label, color, dash }) => visibleOutcomes[key] && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
													type: "monotone",
													dataKey: COUNT_KEYS[key],
													name: label,
													stroke: color,
													strokeWidth: 2,
													strokeDasharray: dash,
													dot: { r: 2 },
													isAnimationActive: false
												}, key))
											]
										})
									})]
								})]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-2 divide-y text-xs",
						children: filtered.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex gap-2 py-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => {
									setViewerIdx(filtered.indexOf(r));
									setZoom(1);
								},
								className: "group relative flex shrink-0 gap-0.5",
								"aria-label": "Compare photos side by side",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: r.before,
										alt: "before",
										className: "h-10 w-14 rounded object-cover"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: r.after,
										alt: "after",
										className: "h-10 w-14 rounded object-cover"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "absolute inset-0 flex items-center justify-center rounded bg-black/0 text-white opacity-0 transition group-hover:bg-black/40 group-hover:opacity-100",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ZoomIn, { className: "h-4 w-4" })
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", {
										className: r.actual.verdict === "REVIEW" ? "text-st-review" : "text-risk-low",
										children: r.actual.verdict === "REVIEW" ? "Officer review" : "Pass"
									}),
									" · ",
									r.actual.confidence,
									"% · ",
									r.actual.sameLocation ? "same place" : "different place",
									" · ",
									r.actual.obstructionAfter ? "still blocked" : "cleared",
									r.fails && ` · ${outcome(r)}`
								] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "truncate text-muted-foreground",
									children: [
										new Date(r.at).toLocaleString(),
										" — ",
										r.reason
									]
								})]
							})]
						}, r.id))
					})] })
				]
			}),
			viewer && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "fixed inset-0 z-50 flex flex-col bg-black/80 p-4",
				role: "dialog",
				"aria-label": "Photo comparison",
				onClick: () => setViewerIdx(void 0),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex w-full max-w-4xl items-center gap-2 text-white",
					onClick: (e) => e.stopPropagation(),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "ghost",
							className: "text-white hover:bg-white/20",
							onClick: () => setViewerIdx((i) => i === void 0 ? i : Math.max(0, i - 1)),
							disabled: viewerIdx === 0,
							"aria-label": "Previous run",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "h-5 w-5" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mr-auto min-w-0 text-sm font-medium",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "mr-2 rounded bg-white/15 px-1.5 py-0.5 text-xs",
									children: [
										(viewerIdx ?? 0) + 1,
										" of ",
										filtered.length
									]
								}),
								new Date(viewer.at).toLocaleString(),
								" · ",
								viewer.actual.verdict === "REVIEW" ? "Officer review" : "Pass",
								" · ",
								viewer.actual.confidence,
								"%"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex items-center gap-2 text-xs",
							children: [
								"Zoom",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "range",
									min: 1,
									max: 4,
									step: .25,
									value: zoom,
									onChange: (e) => setZoom(Number(e.target.value)),
									"aria-label": "Zoom level",
									className: "w-32"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "w-10",
									children: [Math.round(zoom * 100), "%"]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "ghost",
							className: "text-white hover:bg-white/20",
							onClick: () => setViewerIdx((i) => i === void 0 ? i : Math.min(filtered.length - 1, i + 1)),
							disabled: viewerIdx === filtered.length - 1,
							"aria-label": "Next run",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-5 w-5" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "ghost",
							className: "text-white hover:bg-white/20",
							onClick: () => setViewerIdx(void 0),
							"aria-label": "Close viewer",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-5 w-5" })
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mx-auto mt-3 grid w-full max-w-4xl flex-1 grid-cols-2 gap-2 overflow-auto",
					onClick: (e) => e.stopPropagation(),
					children: [["Before", viewer.before], ["After", viewer.after]].map(([l, src]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figure", {
						className: "flex min-h-0 flex-col",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("figcaption", {
							className: "mb-1 text-center text-xs font-semibold uppercase tracking-wide text-white/80",
							children: l
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex-1 overflow-auto rounded bg-black/40",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src,
								alt: `${l} photo`,
								style: { width: `${zoom * 100}%` },
								className: "max-w-none"
							})
						})]
					}, l))
				})]
			})
		]
	});
}
function LabPage() {
	const verify = useServerFn(verifyProof);
	const [results, setResults] = (0, import_react.useState)({});
	const [running, setRunning] = (0, import_react.useState)(false);
	const runOne = async (f) => {
		setResults((r) => ({
			...r,
			[f.id]: { state: "running" }
		}));
		const t0 = performance.now();
		try {
			const [b, a] = await Promise.all([urlToJpegDataUrl(f.before), urlToJpegDataUrl(f.after)]);
			const res = await verify({ data: {
				before: b,
				after: f.after === f.before ? b : a,
				drainId: "TEST",
				drainName: f.title
			} });
			if (!res.ok) {
				setResults((r) => ({
					...r,
					[f.id]: {
						state: "error",
						error: res.error
					}
				}));
				return false;
			}
			const actual = {
				verdict: res.verdict,
				confidence: res.confidence,
				sameLocation: res.sameLocation,
				obstructionAfter: res.obstructionAfter
			};
			setResults((r) => ({
				...r,
				[f.id]: {
					state: "done",
					actual,
					reason: res.reason,
					fails: checkExpectation(f.expect, actual),
					ms: Math.round(performance.now() - t0)
				}
			}));
			return true;
		} catch (e) {
			setResults((r) => ({
				...r,
				[f.id]: {
					state: "error",
					error: e.message
				}
			}));
			return false;
		}
	};
	const runAll = async () => {
		setRunning(true);
		for (const f of FIXTURES) if (!await runOne(f)) break;
		setRunning(false);
	};
	const done = Object.values(results).filter((r) => r.state === "done");
	const passed = done.filter((r) => !r.fails.length).length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		title: "Verification Test Lab",
		subtitle: "Repeatable before/after scenarios. Each run makes real AI calls and uses credits.",
		actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
			onClick: runAll,
			disabled: running,
			children: [running ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FlaskConical, { className: "h-4 w-4" }), "Run all scenarios"]
		}),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-3 gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
							label: "Scenarios",
							value: FIXTURES.length
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
							label: "Passed",
							value: `${passed} / ${done.length}`,
							tone: done.length && passed === done.length ? "ok" : void 0
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
							label: "Flagged for review",
							value: done.filter((r) => r.actual.verdict === "REVIEW").length,
							hint: "sent to officer"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground",
					children: "Sample photos are realistic generated images for testing, not field data. Results run through the same check crews use — nothing is saved to tasks."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UploadTest, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CrashTest, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-4 lg:grid-cols-2",
					children: FIXTURES.map((f) => {
						const r = results[f.id];
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
							className: "rounded-md border bg-card",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between border-b px-3 py-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-sm font-semibold",
										children: f.title
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs text-muted-foreground",
										children: f.description
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "sm",
										variant: "outline",
										disabled: running || r?.state === "running",
										onClick: () => runOne(f),
										children: "Run"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid grid-cols-2 gap-1 p-2",
									children: [["Before", f.before], ["After", f.after]].map(([l, s]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figure", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: s,
										alt: `${f.title} ${l}`,
										loading: "lazy",
										width: 944,
										height: 704,
										className: "aspect-[4/3] w-full rounded object-cover"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("figcaption", {
										className: "text-center text-[10px] font-semibold uppercase text-muted-foreground",
										children: l
									})] }, l))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5 px-3 pb-3 text-xs",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex flex-wrap gap-1",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tag, { children: ["Expect ", f.expect.verdict] }),
												f.expect.minConfidence !== void 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tag, { children: ["conf ≥ ", f.expect.minConfidence] }),
												f.expect.maxConfidence !== void 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tag, { children: ["conf ≤ ", f.expect.maxConfidence] }),
												f.expect.sameLocation !== void 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, { children: f.expect.sameLocation ? "same place" : "different place" }),
												f.expect.obstructionAfter !== void 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, { children: f.expect.obstructionAfter ? "still blocked" : "cleared" })
											]
										}),
										!r && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-muted-foreground",
											children: "Not run yet."
										}),
										r?.state === "running" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "flex items-center gap-1 text-muted-foreground",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-3 w-3 animate-spin" }), "Assessing photos…"]
										}),
										r?.state === "error" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-medium text-st-review",
											children: r.error
										}),
										r?.state === "done" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: `flex items-center gap-1 font-semibold ${r.fails.length ? "text-st-review" : "text-risk-low"}`,
												children: [
													r.fails.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4" }),
													r.fails.length ? "Unexpected result" : "As expected",
													" · ",
													r.ms,
													" ms"
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
												"AI: ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: r.actual.verdict }),
												" · ",
												r.actual.confidence,
												"% · ",
												r.actual.sameLocation ? "same place" : "different place",
												" · ",
												r.actual.obstructionAfter ? "still blocked" : "cleared"
											] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-muted-foreground",
												children: r.reason
											}),
											r.fails.map((x) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "text-st-review",
												children: ["✗ ", x]
											}, x))
										] })
									]
								})
							]
						}, f.id);
					})
				})
			]
		})
	});
}
function Bomb() {
	throw new Error("Test error triggered from Test Lab (safe — no data was changed).");
}
function CrashTest() {
	const [armed, setArmed] = (0, import_react.useState)(false);
	if (armed) Bomb();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "flex flex-wrap items-center justify-between gap-2 rounded-md border bg-card px-3 py-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-sm font-semibold",
			children: "Recovery screen test"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-xs text-muted-foreground",
			children: "Triggers a harmless error to show the recovery screen. \"Try again\" returns here; \"Dashboard\" leaves."
		})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			size: "sm",
			variant: "outline",
			onClick: () => setArmed(true),
			children: "Trigger test error"
		})]
	});
}
//#endregion
export { LabPage as component };
