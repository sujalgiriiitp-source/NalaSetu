import { o as __toESM } from "../_runtime.mjs";
import { a as stringType, i as objectType } from "../_libs/zod.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { L as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as Button } from "./button-BP29gmjJ.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { u as useNala } from "./store-DM6PPzvT.mjs";
import { U as Droplets, Z as CircleCheck, ot as Ban, p as Trash2, s as Waves, tt as Check } from "../_libs/lucide-react.mjs";
import { t as Input } from "./input-2821DMN6.mjs";
import { t as processPhoto } from "./verify-BR5JF3IR.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/CitizenReportForm-Q5ZBw-i0.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var ISSUES = [
	{
		label: "Blocked drain",
		icon: Ban
	},
	{
		label: "Garbage",
		icon: Trash2
	},
	{
		label: "Water accumulation",
		icon: Waves
	},
	{
		label: "Overflow",
		icon: Droplets
	}
];
var schema = objectType({
	drainId: stringType().min(1, "Choose the nearest drain"),
	issue: stringType().min(1, "Choose a problem"),
	location: stringType().trim().min(2, "Describe the location").max(120)
});
function StepLabel({ n, title, done }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-2 flex items-center gap-2 text-sm font-semibold",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: `grid h-6 w-6 place-items-center rounded-full border text-xs tabular-nums ${done ? "border-risk-low bg-risk-low text-primary-foreground" : "bg-card"}`,
			children: done ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3 w-3" }) : n
		}), title]
	});
}
function CitizenReportForm({ showImpact = true }) {
	const n = useNala();
	const [form, setForm] = (0, import_react.useState)({
		drainId: "",
		issue: "",
		location: ""
	});
	const [photo, setPhoto] = (0, import_react.useState)(false);
	const [doneId, setDoneId] = (0, import_react.useState)(null);
	const submit = (e) => {
		e.preventDefault();
		const r = schema.safeParse(form);
		if (!r.success) {
			toast.error(r.error.issues[0]?.message ?? "Invalid report");
			return;
		}
		const before = n.drains.find((d) => d.id === form.drainId);
		const id = n.addReport(r.data);
		setDoneId(id);
		if (showImpact) toast.success(`${before.id} citizen reports: ${before.citizenReports} → ${before.citizenReports + 1}`);
	};
	const reset = () => {
		setForm({
			drainId: "",
			issue: "",
			location: ""
		});
		setPhoto(false);
		setDoneId(null);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: doneId ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "py-6 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "mx-auto h-10 w-10 text-risk-low" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-lg font-semibold",
				children: "Report submitted."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Report ID"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-mono text-base font-semibold",
				children: doneId
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "outline",
				className: "mt-4",
				onClick: reset,
				children: "Report another problem"
			})
		]
	}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		onSubmit: submit,
		className: "space-y-5 text-sm",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StepLabel, {
					n: 1,
					title: "Location",
					done: !!form.drainId && form.location.trim().length >= 2
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
					"aria-label": "Nearest drain",
					className: "h-11 w-full rounded-md border bg-card px-3 text-sm",
					value: form.drainId,
					onChange: (e) => setForm({
						...form,
						drainId: e.target.value
					}),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "",
						children: "Nearest drain…"
					}), n.drains.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
						value: d.id,
						children: [
							d.id,
							" · ",
							d.name
						]
					}, d.id))]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					"aria-label": "Location details",
					className: "mt-2 h-11",
					value: form.location,
					onChange: (e) => setForm({
						...form,
						location: e.target.value
					}),
					placeholder: "Landmark, e.g. near bus stop"
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StepLabel, {
				n: 2,
				title: "Problem",
				done: !!form.issue
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 gap-2",
				role: "radiogroup",
				"aria-label": "Problem",
				children: ISSUES.map(({ label, icon: I }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					role: "radio",
					"aria-checked": form.issue === label,
					onClick: () => setForm({
						...form,
						issue: label
					}),
					className: `flex h-16 flex-col items-center justify-center gap-1 rounded-lg border text-xs font-medium transition-colors ${form.issue === label ? "border-primary bg-accent text-foreground ring-1 ring-primary" : "bg-card text-muted-foreground hover:text-foreground"}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(I, {
						className: "h-5 w-5",
						"aria-hidden": true
					}), label]
				}, label))
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StepLabel, {
				n: 3,
				title: "Photo (optional)",
				done: photo
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				type: "file",
				className: "h-11 py-2",
				accept: "image/jpeg,image/png,image/webp",
				onChange: async (e) => {
					const f = e.target.files?.[0];
					if (f) try {
						await processPhoto(f);
						setPhoto(true);
						toast.success("Photo attached (demo, not stored).");
					} catch (er) {
						toast.error(er.message);
						e.target.value = "";
					}
				}
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StepLabel, {
				n: 4,
				title: "Submit",
				done: false
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				type: "submit",
				className: "h-11 w-full",
				children: "Submit report"
			})] })
		]
	}) });
}
//#endregion
export { CitizenReportForm as t };
