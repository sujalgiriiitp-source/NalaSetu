import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { L as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as Button } from "./button-BP29gmjJ.mjs";
import { n as STATUS_LABEL, u as useNala } from "./store-DM6PPzvT.mjs";
import { $ as ChevronRight, _ as Search, st as ArrowUpDown } from "../_libs/lucide-react.mjs";
import { t as AppShell } from "./AppShell-DhLdAZ0I.mjs";
import { t as Input } from "./input-2821DMN6.mjs";
import { r as StatusBadge, t as RiskBadge } from "./badges-CBrcW0l3.mjs";
import { n as DrainSheet } from "./DrainDetail-CsHXmcnU.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/drains-BKWhlEMM.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function DrainsPage() {
	const { drains, drainRain } = useNala();
	const [q, setQ] = (0, import_react.useState)("");
	const [risk, setRisk] = (0, import_react.useState)("ALL");
	const [status, setStatus] = (0, import_react.useState)("ALL");
	const [sort, setSort] = (0, import_react.useState)({
		k: "riskScore",
		dir: -1
	});
	const [open, setOpen] = (0, import_react.useState)(null);
	const rows = (0, import_react.useMemo)(() => drains.filter((d) => (risk === "ALL" || d.riskBand === risk) && (status === "ALL" || d.status === status) && `${d.id} ${d.name}`.toLowerCase().includes(q.toLowerCase())).sort((a, b) => (a[sort.k] > b[sort.k] ? 1 : a[sort.k] < b[sort.k] ? -1 : 0) * sort.dir), [
		drains,
		q,
		risk,
		status,
		sort
	]);
	const H = ({ k, children, right }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
		className: `px-3 py-2.5 font-medium ${right ? "text-right" : "text-left"}`,
		"aria-sort": sort.k === k ? sort.dir === 1 ? "ascending" : "descending" : "none",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			className: `inline-flex items-center gap-1 hover:text-foreground ${sort.k === k ? "text-foreground" : ""}`,
			onClick: () => setSort((s) => ({
				k,
				dir: s.k === k ? s.dir === 1 ? -1 : 1 : -1
			})),
			children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpDown, { className: "h-3 w-3 opacity-60" })]
		})
	});
	const sel = "h-9 rounded-md border bg-card px-2.5 text-sm shadow-card";
	const drain = drains.find((d) => d.id === open) ?? null;
	const counts = {
		ALL: drains.length,
		HIGH: drains.filter((d) => d.riskBand === "HIGH").length,
		MEDIUM: drains.filter((d) => d.riskBand === "MEDIUM").length,
		LOW: drains.filter((d) => d.riskBand === "LOW").length
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: "Drains",
		subtitle: `${drains.length} synthetic drain segments · click a row for details`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-3 flex flex-wrap items-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, {
							className: "pointer-events-none absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground",
							"aria-hidden": true
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							className: "h-9 w-64 pl-8 shadow-card",
							placeholder: "Search name or ID",
							value: q,
							onChange: (e) => setQ(e.target.value),
							"aria-label": "Search"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "inline-flex rounded-md border bg-card p-0.5 shadow-card",
						role: "group",
						"aria-label": "Risk filter",
						children: [
							"ALL",
							"HIGH",
							"MEDIUM",
							"LOW"
						].map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							"aria-pressed": risk === b,
							onClick: () => setRisk(b),
							className: `flex items-center gap-1.5 rounded px-2.5 py-1 text-xs font-medium transition-colors ${risk === b ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`,
							children: [
								b !== "ALL" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: `h-2 w-2 rounded-full ${b === "HIGH" ? "bg-risk-high" : b === "MEDIUM" ? "bg-risk-medium" : "bg-risk-low"}`,
									"aria-hidden": true
								}),
								b === "ALL" ? "All" : b[0] + b.slice(1).toLowerCase(),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "tabular-nums opacity-70",
									children: counts[b]
								})
							]
						}, b))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						className: sel,
						value: status,
						onChange: (e) => setStatus(e.target.value),
						"aria-label": "Status",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "ALL",
							children: "All status"
						}), Object.entries(STATUS_LABEL).map(([k, v]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: k,
							children: v
						}, k))]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "ml-auto text-xs text-muted-foreground tabular-nums",
						children: [
							rows.length,
							" of ",
							drains.length,
							" shown"
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "max-h-[calc(100vh-220px)] overflow-auto rounded-xl border bg-card shadow-card",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
						className: "sticky top-0 z-10 border-b bg-muted/95 text-[11px] uppercase tracking-wide text-muted-foreground backdrop-blur",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(H, {
								k: "id",
								children: "ID"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(H, {
								k: "name",
								children: "Drain"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 text-left font-medium",
								children: "Risk"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(H, {
								k: "riskScore",
								right: true,
								children: "Score"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 text-right font-medium",
								children: "Rainfall"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(H, {
								k: "historicalChokes",
								right: true,
								children: "Chokes"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(H, {
								k: "citizenReports",
								right: true,
								children: "Reports"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 text-left font-medium",
								children: "Terrain"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(H, {
								k: "cleaningTimeMin",
								right: true,
								children: "Clean time"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 text-left font-medium",
								children: "Status"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 text-right font-medium",
								children: "Action"
							})
						] })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", { children: [rows.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						tabIndex: 0,
						className: `cursor-pointer border-b transition-colors last:border-0 hover:bg-muted/60 focus-visible:bg-muted/60 focus-visible:outline-none ${d.riskBand === "HIGH" ? "shadow-[inset_3px_0_0_var(--risk-high)]" : ""}`,
						onClick: () => setOpen(d.id),
						onKeyDown: (e) => e.key === "Enter" && setOpen(d.id),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "whitespace-nowrap px-3 py-2 font-mono text-xs text-muted-foreground",
								children: d.id
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "min-w-[200px] px-3 font-medium",
								children: d.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RiskBadge, { band: d.riskBand })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 text-right",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-end gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "hidden h-1.5 w-12 rounded-full bg-muted md:block",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: `h-1.5 rounded-full ${d.riskBand === "HIGH" ? "bg-risk-high" : d.riskBand === "MEDIUM" ? "bg-risk-medium" : "bg-risk-low"}`,
											style: { width: `${d.riskScore}%` }
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "w-6 font-semibold tabular-nums",
										children: d.riskScore
									})]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: "px-3 text-right tabular-nums",
								children: [drainRain(d), " mm"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 text-right tabular-nums",
								children: d.historicalChokes
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 text-right tabular-nums",
								children: d.citizenReports
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 capitalize text-muted-foreground",
								children: d.slope
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: "px-3 text-right tabular-nums",
								children: [d.cleaningTimeMin, " min"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: d.status })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 text-right",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									size: "sm",
									variant: "ghost",
									className: "h-7 text-xs",
									children: ["Details", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-3 w-3" })]
								})
							})
						]
					}, d.id)), !rows.length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
						colSpan: 11,
						className: "p-10 text-center text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-medium text-foreground",
							children: "No drains match these filters"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "mt-1 text-xs underline",
							onClick: () => {
								setQ("");
								setRisk("ALL");
								setStatus("ALL");
							},
							children: "Clear filters"
						})]
					}) })] })]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DrainSheet, {
				drain,
				onOpenChange: (o) => !o && setOpen(null)
			})
		]
	});
}
//#endregion
export { DrainsPage as component };
