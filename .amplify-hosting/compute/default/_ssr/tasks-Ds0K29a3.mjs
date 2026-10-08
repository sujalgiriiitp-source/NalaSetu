import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { L as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { a as useAuth } from "./utils-P7bOhUvR.mjs";
import { t as Button } from "./button-BP29gmjJ.mjs";
import { i as crewName } from "./data-BhlzLgUJ.mjs";
import { n as STATUS_LABEL, u as useNala } from "./store-DM6PPzvT.mjs";
import { $ as ChevronRight, J as ClipboardCheck, f as TriangleAlert, l as UserCheck, m as ShieldCheck, r as X, tt as Check } from "../_libs/lucide-react.mjs";
import { i as Panel, t as AppShell } from "./AppShell-DhLdAZ0I.mjs";
import { i as Tag, r as StatusBadge, t as RiskBadge } from "./badges-CBrcW0l3.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tasks-Ds0K29a3.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var FILTERS = [
	"All",
	"AI PASS",
	"Needs Review",
	"Human Verified",
	"Rejected"
];
function TasksPage() {
	const n = useNala();
	const officer = useAuth().session?.role === "OFFICER";
	const [f, setF] = (0, import_react.useState)("All");
	const proofs = n.tasks.filter((t) => t.verification).filter((t) => f === "All" ? true : f === "AI PASS" ? t.verification.verdict === "PASS" && !t.officerDecision : f === "Needs Review" ? t.verification.verdict === "REVIEW" && !t.officerDecision : f === "Human Verified" ? t.officerDecision === "APPROVED" : t.officerDecision === "REJECTED");
	const active = n.tasks.filter((t) => !t.verification);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		roles: ["OFFICER", "CREW"],
		title: "AI Proof Verification",
		subtitle: "Crew → Before/After → AI Verification → Officer Review. AI PASS is not final — an officer confirms every proof.",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "inline-flex flex-wrap gap-0.5 rounded-md border bg-card p-0.5 shadow-card",
					role: "group",
					"aria-label": "Filter proofs",
					children: FILTERS.map((x) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						"aria-pressed": f === x,
						onClick: () => setF(x),
						className: `rounded px-2.5 py-1 text-xs font-medium transition-colors ${f === x ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`,
						children: x
					}, x))
				}),
				!proofs.length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "py-8 text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClipboardCheck, { className: "mx-auto h-6 w-6 text-muted-foreground" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 font-medium",
							children: "No proofs here yet"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: "Crews submit before/after proof from the Crew App."
						})
					]
				}) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-4 md:grid-cols-2 xl:grid-cols-3",
					children: proofs.map((t) => {
						const d = n.drains.find((x) => x.id === t.drainId);
						const v = t.verification;
						const pass = v.verdict === "PASS";
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
							className: "overflow-hidden rounded-xl border bg-card shadow-card",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-start justify-between gap-2 border-b px-3 py-2.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "truncate text-sm font-semibold",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-mono",
													children: d.id
												}),
												" · ",
												d.name
											]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-xs text-muted-foreground",
											children: [
												crewName(t.crewId),
												" · ",
												t.submittedAt && new Date(t.submittedAt).toLocaleString()
											]
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RiskBadge, { band: d.riskBand })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid grid-cols-2 gap-1 p-2",
									children: [["Before", t.beforePhoto], ["After", t.afterPhoto]].map(([l, s]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figure", {
										className: "relative",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
											src: s,
											alt: `${l} cleaning`,
											className: "aspect-[4/3] w-full rounded-md object-cover"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("figcaption", {
											className: "absolute left-1.5 top-1.5 rounded bg-card/90 px-1.5 py-0.5 text-[10px] font-semibold uppercase",
											children: l
										})]
									}, l))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2.5 px-3 pb-3 text-xs",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: `rounded-md border p-2.5 ${pass ? "border-risk-low/30 bg-risk-low/5" : "border-st-review/30 bg-st-review/5"}`,
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center justify-between gap-2",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-[10px] font-semibold uppercase tracking-wide text-muted-foreground",
														children: "AI verdict"
													}), v.mode === "demo" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
														tone: "demo",
														children: "Demo AI — simulated"
													}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, { children: "AI-assisted" })]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "mt-1 flex items-baseline gap-2",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: `text-lg font-bold ${pass ? "text-risk-low" : "text-st-review"}`,
														children: v.verdict
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "font-semibold tabular-nums",
														children: [v.confidence, "% confidence"]
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "mt-1.5 h-1 rounded-full bg-muted",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: `h-1 rounded-full ${pass ? "bg-risk-low" : "bg-st-review"}`,
														style: { width: `${v.confidence}%` }
													})
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
													className: "mt-1.5 text-muted-foreground",
													children: [
														"“",
														v.reason,
														"”"
													]
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", {
											className: "flex items-center gap-2 text-[11px] font-medium",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
													className: `inline-flex items-center gap-1 ${pass ? "text-risk-low" : "text-st-review"}`,
													children: [pass ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-3.5 w-3.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-3.5 w-3.5" }), pass ? "AI Verified" : "AI flagged"]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-3 w-3 text-muted-foreground" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
													className: `inline-flex items-center gap-1 ${t.officerDecision === "APPROVED" ? "text-risk-low" : t.officerDecision === "REJECTED" ? "text-st-review" : "text-muted-foreground"}`,
													children: t.officerDecision === "APPROVED" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserCheck, { className: "h-3.5 w-3.5" }), "Human Verified"] }) : t.officerDecision === "REJECTED" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-3.5 w-3.5" }), "Rejected by officer"] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserCheck, { className: "h-3.5 w-3.5" }), "Awaiting officer"] })
												})
											]
										}),
										!t.officerDecision && officer && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
												size: "sm",
												className: "flex-1",
												onClick: () => n.review(t.id, "APPROVED"),
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4" }), "Approve"]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
												size: "sm",
												variant: "outline",
												className: "flex-1",
												onClick: () => n.review(t.id, "REJECTED"),
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" }), "Reject"]
											})]
										}),
										!pass && !t.officerDecision && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-medium text-st-review",
											children: "Low confidence — inspect photos manually before deciding."
										})
									]
								})
							]
						}, t.id);
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
					title: "Active tasks",
					children: active.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "divide-y text-sm",
						children: active.map((t) => {
							const d = n.drains.find((x) => x.id === t.drainId);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between py-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono text-xs",
										children: d.id
									}),
									" ",
									d.name,
									" · ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground",
										children: crewName(t.crewId)
									})
								] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: d.status })]
							}, t.id);
						})
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "None."
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
					title: "Audit history",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "max-h-96 overflow-y-auto",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
							className: "w-full text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
								className: "text-left text-muted-foreground",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-1",
										children: "Time"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Actor" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Drain" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Change" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Reason" })
								] })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: n.audit.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "border-t",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-1 tabular-nums",
										children: new Date(a.timestamp).toLocaleTimeString()
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: a.actor }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "font-mono",
										children: a.drainId
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: a.oldStatus && a.newStatus ? `${STATUS_LABEL[a.oldStatus]} → ${STATUS_LABEL[a.newStatus]}` : "—" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: a.reason })
								]
							}, a.id)) })]
						}), !n.audit.length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "py-3 text-sm text-muted-foreground",
							children: "No events yet."
						})]
					})
				})
			]
		})
	});
}
//#endregion
export { TasksPage as component };
