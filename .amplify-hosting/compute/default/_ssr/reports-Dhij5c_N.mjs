import { L as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { u as useNala } from "./store-DM6PPzvT.mjs";
import { i as Panel, t as AppShell } from "./AppShell-DhLdAZ0I.mjs";
import { t as CitizenReportForm } from "./CitizenReportForm-Q5ZBw-i0.mjs";
import { t as RiskBadge } from "./badges-CBrcW0l3.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/reports-Dhij5c_N.js
var import_jsx_runtime = require_jsx_runtime();
function ReportsPage() {
	const n = useNala();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		title: "Citizen Reports",
		subtitle: "Each report raises the citizen factor (C) in that drain's risk score.",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-4 lg:grid-cols-[400px_1fr]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
				title: "Report drain problem",
				subtitle: "Simple 4-step form for residents",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CitizenReportForm, {})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
				title: `Recent reports (${n.reports.length})`,
				subtitle: "Officer view",
				children: !n.reports.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "py-6 text-center text-sm text-muted-foreground",
					children: "No reports submitted this session."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "divide-y text-sm",
					children: n.reports.map((r) => {
						const d = n.drains.find((x) => x.id === r.drainId);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex flex-wrap items-center justify-between gap-2 py-2.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "font-medium",
								children: [
									r.issue,
									" · ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono text-xs",
										children: d.id
									}),
									" ",
									d.name
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-xs text-muted-foreground",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono",
										children: r.id
									}),
									" · ",
									r.location,
									" · ",
									new Date(r.createdAt).toLocaleString()
								]
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RiskBadge, {
								band: d.riskBand,
								score: d.riskScore
							})]
						}, r.id);
					})
				})
			})]
		})
	});
}
//#endregion
export { ReportsPage as component };
