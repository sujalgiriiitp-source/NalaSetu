import { L as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { i as cn } from "./utils-P7bOhUvR.mjs";
import { n as STATUS_LABEL } from "./store-DM6PPzvT.mjs";
import { G as Database, X as CircleX, Y as Circle, Z as CircleCheck, d as Truck, f as TriangleAlert, i as Wrench, m as ShieldCheck, q as Clock, rt as Camera } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/badges-CBrcW0l3.js
var import_jsx_runtime = require_jsx_runtime();
var RISK = {
	HIGH: "bg-risk-high/10 text-risk-high border-risk-high/30",
	MEDIUM: "bg-risk-medium/15 text-demo-foreground border-risk-medium/40",
	LOW: "bg-risk-low/10 text-risk-low border-risk-low/30"
};
function RiskBadge({ band, score, className }) {
	const Icon = band === "HIGH" ? TriangleAlert : band === "MEDIUM" ? Clock : CircleCheck;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: cn("inline-flex items-center gap-1 rounded border px-1.5 py-0.5 text-xs font-semibold", RISK[band], className),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
				className: "h-3 w-3",
				"aria-hidden": true
			}),
			score !== void 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "tabular-nums",
				children: score
			}),
			band
		]
	});
}
var ST = {
	UNASSIGNED: ["text-st-muted border-border bg-muted", Circle],
	ASSIGNED: ["text-st-assigned border-st-assigned/30 bg-st-assigned/10", Clock],
	EN_ROUTE: ["text-st-enroute border-st-enroute/30 bg-st-enroute/10", Truck],
	CLEANING: ["text-st-cleaning border-st-cleaning/40 bg-st-cleaning/10", Wrench],
	PROOF_SUBMITTED: ["text-st-proof border-st-proof/30 bg-st-proof/10", Camera],
	VERIFIED: ["text-st-verified border-st-verified/30 bg-st-verified/10", ShieldCheck],
	NEEDS_REVIEW: ["text-st-review border-st-review/30 bg-st-review/10", TriangleAlert],
	REJECTED: ["text-st-review border-st-review/30 bg-st-review/10", CircleX]
};
function StatusBadge({ status }) {
	const [c, Icon] = ST[status];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: cn("inline-flex items-center gap-1 whitespace-nowrap rounded border px-1.5 py-0.5 text-xs font-medium", c),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
			className: "h-3 w-3",
			"aria-hidden": true
		}), STATUS_LABEL[status]]
	});
}
function SourceBadge({ source }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: cn("inline-flex items-center gap-1 rounded border px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide", source === "live" ? "bg-risk-low/10 text-risk-low border-risk-low/30" : source === "cached" ? "bg-st-proof/10 text-st-proof border-st-proof/30" : "bg-demo text-demo-foreground border-risk-medium/40"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Database, {
			className: "h-3 w-3",
			"aria-hidden": true
		}), source]
	});
}
function Tag({ children, tone = "muted" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("inline-flex items-center rounded border px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide", tone === "demo" ? "bg-demo text-demo-foreground border-risk-medium/40" : tone === "ok" ? "bg-risk-low/10 text-risk-low border-risk-low/30" : "bg-muted text-muted-foreground border-border"),
		children
	});
}
//#endregion
export { Tag as i, SourceBadge as n, StatusBadge as r, RiskBadge as t };
