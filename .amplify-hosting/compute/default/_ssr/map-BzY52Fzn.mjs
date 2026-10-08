import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { L as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { n as STATUS_LABEL, u as useNala } from "./store-DM6PPzvT.mjs";
import { t as AppShell } from "./AppShell-DhLdAZ0I.mjs";
import { t as Input } from "./input-2821DMN6.mjs";
import { r as StatusBadge, t as RiskBadge } from "./badges-CBrcW0l3.mjs";
import { t as LazyMap } from "./LazyMap-DCELCNoD.mjs";
import { t as DrainDetailBody } from "./DrainDetail-CsHXmcnU.mjs";
import { t as Route } from "./map-DBDWqfEo.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/map-BzY52Fzn.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var STATUSES = [
	"UNASSIGNED",
	"ASSIGNED",
	"EN_ROUTE",
	"CLEANING",
	"PROOF_SUBMITTED",
	"VERIFIED"
];
function MapPage() {
	const { drains } = useNala();
	const search = Route.useSearch();
	const [sel, setSel] = (0, import_react.useState)(search.drain);
	const [risk, setRisk] = (0, import_react.useState)("ALL");
	const [status, setStatus] = (0, import_react.useState)("ALL");
	const [q, setQ] = (0, import_react.useState)("");
	const list = (0, import_react.useMemo)(() => drains.filter((d) => (risk === "ALL" || d.riskBand === risk) && (status === "ALL" || d.status === status) && `${d.id} ${d.name}`.toLowerCase().includes(q.toLowerCase())).sort((a, b) => b.riskScore - a.riskScore), [
		drains,
		risk,
		status,
		q
	]);
	const selected = drains.find((d) => d.id === sel);
	const onSelect = (0, import_react.useCallback)((id) => setSel(id), []);
	const sel_ = "h-8 rounded border bg-card px-2 text-xs";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		title: "Risk Map",
		subtitle: "Marker colour = risk band. Click a marker for details.",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-4 lg:h-[calc(100vh-170px)] lg:grid-cols-[260px_1fr_360px] lg:grid-rows-1",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex min-h-0 flex-col overflow-hidden rounded-md border bg-card",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2 border-b p-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								placeholder: "Search drain name / ID",
								value: q,
								onChange: (e) => setQ(e.target.value),
								className: "h-8 text-xs",
								"aria-label": "Search drains"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									className: sel_,
									value: risk,
									onChange: (e) => setRisk(e.target.value),
									"aria-label": "Risk filter",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "ALL",
											children: "All risk"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "HIGH",
											children: "High"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "MEDIUM",
											children: "Medium"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "LOW",
											children: "Low"
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									className: sel_,
									value: status,
									onChange: (e) => setStatus(e.target.value),
									"aria-label": "Status filter",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "ALL",
										children: "All status"
									}), STATUSES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: s,
										children: STATUS_LABEL[s]
									}, s))]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-[11px] text-muted-foreground",
								children: [list.length, " drains"]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "max-h-72 flex-1 overflow-y-auto lg:max-h-none",
						children: list.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setSel(d.id),
							className: `w-full border-b px-3 py-2 text-left text-xs hover:bg-muted ${sel === d.id ? "bg-accent" : ""}`,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono text-muted-foreground",
										children: d.id
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RiskBadge, {
										band: d.riskBand,
										score: d.riskScore
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-0.5 truncate font-medium",
									children: d.name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-1",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: d.status })
								})
							]
						}) }, d.id))
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-[420px] min-h-0 lg:h-full",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LazyMap, {
						drains: list,
						selected: sel,
						onSelect
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-y-auto rounded-md border bg-card p-4",
					children: selected ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
						className: "mb-3 font-semibold",
						children: [
							selected.id,
							" · ",
							selected.name
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DrainDetailBody, { drain: selected })] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "Select a drain on the map or list to see its risk breakdown."
					})
				})
			]
		})
	});
}
//#endregion
export { MapPage as component };
