import { b as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { L as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { a as useAuth } from "./utils-P7bOhUvR.mjs";
import { t as Button } from "./button-BP29gmjJ.mjs";
import { U as Droplets, k as LogOut } from "../_libs/lucide-react.mjs";
import { a as RequireRole, n as DemoBanner } from "./AppShell-DhLdAZ0I.mjs";
import { t as CitizenReportForm } from "./CitizenReportForm-Q5ZBw-i0.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/citizen.report-D5mYAipQ.js
var import_jsx_runtime = require_jsx_runtime();
function CitizenPage() {
	const { signOut } = useAuth();
	const nav = useNavigate();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DemoBanner, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
				className: "border-b bg-card px-4 py-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex max-w-md items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Droplets, {
								className: "h-4 w-4",
								"aria-hidden": true
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-sm font-semibold",
							children: "Report Drain Problem"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[11px] text-muted-foreground",
							children: "NalaSetu · Citizen"
						})] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "ghost",
						size: "sm",
						onClick: () => {
							signOut();
							nav({
								to: "/login",
								replace: true
							});
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "h-4 w-4" }), "Sign out"]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "mx-auto max-w-md p-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "rounded-xl border bg-card p-4 shadow-card",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CitizenReportForm, { showImpact: false })
				})
			})
		]
	});
}
var SplitComponent = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RequireRole, {
	roles: ["CITIZEN"],
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CitizenPage, {})
});
//#endregion
export { SplitComponent as component };
