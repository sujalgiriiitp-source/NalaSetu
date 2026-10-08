import { L as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { o as fmtMin, u as useNala } from "./store-DM6PPzvT.mjs";
import { i as Panel, r as Kpi, t as AppShell } from "./AppShell-DhLdAZ0I.mjs";
import { i as Tag } from "./badges-CBrcW0l3.mjs";
import { t as impactStats } from "./impact-DoUMrrvc.mjs";
import { c as ResponsiveContainer, i as XAxis, l as Tooltip, o as CartesianGrid, r as YAxis, s as Bar, t as BarChart } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/impact-YNHNJlEB.js
var import_jsx_runtime = require_jsx_runtime();
function ImpactPage() {
	const n = useNala();
	const s = impactStats(n.drains);
	const km = n.plan?.crews.reduce((a, c) => a + c.distanceKm, 0) ?? 0;
	const data = [
		"HIGH",
		"MEDIUM",
		"LOW"
	].map((b) => ({
		band: b,
		total: n.drains.filter((d) => d.riskBand === b).length,
		verified: n.drains.filter((d) => d.riskBand === b && d.status === "VERIFIED").length
	}));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		title: "Impact",
		subtitle: "All figures are PROJECTED or ESTIMATED — not measured real-world impact.",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-3 lg:grid-cols-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
							label: "Completed",
							value: `${s.completed} / ${s.total}`,
							hint: "human verified / dispatched"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
							label: "High-risk coverage",
							value: `${s.highCoveragePct}%`,
							hint: `${s.highDone} / ${s.highTotal} HIGH · ESTIMATED`
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
							label: "Crew-hours used",
							value: fmtMin(s.crewMinutes),
							hint: "cleaning time · ESTIMATED"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
							label: "Est. travel",
							value: `${km.toFixed(1)} km`,
							hint: "planned route · ESTIMATED"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
							label: "Projected impact",
							value: `${s.exposurePct}%`,
							tone: "ok",
							hint: "exposure reduction · PROJECTED"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
					title: "Projected exposure reduction — formula",
					right: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
						tone: "demo",
						children: "Projected"
					}),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-mono text-sm",
						children: "Σ population weight (cleaned HIGH drains) ÷ Σ population weight (all HIGH drains) × 100"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-xs text-muted-foreground",
						children: "Returns 0 when there are no HIGH drains. Population weights are synthetic."
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
					title: "Verified vs total by risk band",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-64",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
							width: "100%",
							height: "100%",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
								data,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
										strokeDasharray: "3 3",
										stroke: "var(--border)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
										dataKey: "band",
										fontSize: 12
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
										allowDecimals: false,
										fontSize: 12
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
										dataKey: "total",
										name: "Total",
										fill: "var(--st-muted)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
										dataKey: "verified",
										name: "Verified",
										fill: "var(--risk-low)"
									})
								]
							})
						})
					})
				})
			]
		})
	});
}
//#endregion
export { ImpactPage as component };
