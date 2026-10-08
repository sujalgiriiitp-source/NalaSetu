import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { L as require_jsx_runtime, a as AlertDialogDescription$1, c as AlertDialogTitle$1, i as AlertDialogContent$1, l as AlertDialogTrigger$1, n as AlertDialogAction$1, o as AlertDialogOverlay$1, r as AlertDialogCancel$1, s as AlertDialogPortal$1, t as AlertDialog$1 } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { i as cn } from "./utils-P7bOhUvR.mjs";
import { n as buttonVariants, t as Button } from "./button-BP29gmjJ.mjs";
import { o as fmtMin, u as useNala } from "./store-DM6PPzvT.mjs";
import { F as House, P as Info, g as Send, n as Zap, p as Trash2, v as Route } from "../_libs/lucide-react.mjs";
import { i as Panel, r as Kpi, t as AppShell } from "./AppShell-DhLdAZ0I.mjs";
import { i as Tag, r as StatusBadge, t as RiskBadge } from "./badges-CBrcW0l3.mjs";
import { t as LazyMap } from "./LazyMap-DCELCNoD.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dispatch-vAaf7BJv.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var AlertDialog = AlertDialog$1;
var AlertDialogTrigger = AlertDialogTrigger$1;
var AlertDialogPortal = AlertDialogPortal$1;
var AlertDialogOverlay = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogOverlay$1, {
	className: cn("fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
	...props,
	ref
}));
AlertDialogOverlay.displayName = AlertDialogOverlay$1.displayName;
var AlertDialogContent = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogContent$1, {
	ref,
	className: cn("fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg", className),
	...props
})] }));
AlertDialogContent.displayName = AlertDialogContent$1.displayName;
var AlertDialogHeader = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col space-y-2 text-center sm:text-left", className),
	...props
});
AlertDialogHeader.displayName = "AlertDialogHeader";
var AlertDialogFooter = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
	...props
});
AlertDialogFooter.displayName = "AlertDialogFooter";
var AlertDialogTitle = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogTitle$1, {
	ref,
	className: cn("text-lg font-semibold", className),
	...props
}));
AlertDialogTitle.displayName = AlertDialogTitle$1.displayName;
var AlertDialogDescription = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogDescription$1, {
	ref,
	className: cn("text-sm text-muted-foreground", className),
	...props
}));
AlertDialogDescription.displayName = AlertDialogDescription$1.displayName;
var AlertDialogAction = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogAction$1, {
	ref,
	className: cn(buttonVariants(), className),
	...props
}));
AlertDialogAction.displayName = AlertDialogAction$1.displayName;
var AlertDialogCancel = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogCancel$1, {
	ref,
	className: cn(buttonVariants({ variant: "outline" }), "mt-2 sm:mt-0", className),
	...props
}));
AlertDialogCancel.displayName = AlertDialogCancel$1.displayName;
function DispatchPage() {
	const n = useNala();
	const plan = n.plan;
	const byId = (0, import_react.useMemo)(() => new Map(n.drains.map((d) => [d.id, d])), [n.drains]);
	const routes = (0, import_react.useMemo)(() => plan?.crews.map((c) => {
		const crew = n.crews.find((k) => k.id === c.crewId);
		return { latlngs: [[crew.homeBaseLat, crew.homeBaseLng], ...c.drainIds.map((id) => [byId.get(id).lat, byId.get(id).lng])] };
	}) ?? [], [
		plan,
		byId,
		n.crews
	]);
	const planned = plan?.crews.flatMap((c) => c.drainIds).map((id) => byId.get(id)).filter(Boolean) ?? [];
	const totalTasks = planned.length;
	const totalKm = plan?.crews.reduce((a, c) => a + c.distanceKm, 0) ?? 0;
	const totalMin = plan?.crews.reduce((a, c) => a + c.totalMin, 0) ?? 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		title: "Pre-Rain Cleaning Plan",
		subtitle: "Maximum high-risk coverage with limited crew-hours and minimum unnecessary travel.",
		actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
			variant: plan ? "outline" : "default",
			onClick: n.generatePlan,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { className: "h-4 w-4" }), plan ? "Regenerate Plan" : "Generate Pre-Rain Cleaning Plan"]
		}),
		children: !plan ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "py-10 text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Route, { className: "mx-auto h-6 w-6 text-muted-foreground" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 font-medium",
					children: "No plan yet"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "Generate a plan to allocate HIGH and MEDIUM drains across crews."
				})
			]
		}) }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-3 lg:grid-cols-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
							label: "High-risk coverage",
							value: `${plan.highCoverage}%`,
							tone: "ok",
							hint: `Naive score-sort baseline: ${plan.naiveHighCoverage}%`
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
							label: "Crew-hours",
							value: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [plan.hoursPlanned, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-sm font-normal text-muted-foreground",
								children: [
									" / ",
									plan.hoursAvailable,
									"h"
								]
							})] }),
							hint: "planned of available"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
							label: "Estimated distance",
							value: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [totalKm.toFixed(1), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm font-normal text-muted-foreground",
								children: " km"
							})] }),
							hint: "all crews · estimated"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
							label: "Estimated total time",
							value: fmtMin(totalMin),
							hint: `${totalTasks} tasks · plan ${plan.id}`
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start gap-2 rounded-md border bg-card px-4 py-2 text-xs text-muted-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, { className: "mt-0.5 h-3.5 w-3.5 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-bold uppercase tracking-wide text-foreground",
							children: "Estimated route"
						}),
						" — grid clustering → greedy knapsack on score ÷ (cleaning + travel) → nearest-neighbour order. Distance uses straight-line × 1.3 at ",
						15,
						" km/h — not exact road routing."
					] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-4 2xl:grid-cols-[1fr_420px]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid gap-4 md:grid-cols-3",
						children: plan.crews.map((c) => {
							const crew = n.crews.find((k) => k.id === c.crewId);
							const pct = Math.min(100, Math.round(c.totalMin / (crew.availableHours * 60) * 100));
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
								title: crew.name,
								right: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tag, { children: [crew.availableHours, "h available"] }),
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mb-2 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(House, { className: "h-3 w-3" }), "Base · estimated route sequence"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", {
										className: "relative space-y-2 border-l border-dashed pl-4",
										children: [c.drainIds.map((id, i) => {
											const d = byId.get(id);
											return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
												className: "relative rounded-md border bg-card p-2 text-xs transition-shadow hover:shadow-raised",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "absolute -left-[27px] top-2 grid h-5 w-5 place-items-center rounded-full border bg-card text-[10px] font-bold tabular-nums",
														children: i + 1
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex items-center justify-between gap-2",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "whitespace-nowrap font-mono font-semibold",
															children: id
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RiskBadge, {
															band: d.riskBand,
															score: d.riskScore,
															className: "whitespace-nowrap"
														})]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "mt-0.5 flex justify-between gap-2 text-muted-foreground",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "truncate",
															children: d.name
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
															className: "shrink-0 tabular-nums",
															children: [d.cleaningTimeMin, " min"]
														})]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "mt-1.5 flex flex-wrap items-center gap-1",
														children: plan.dispatched ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: d.status }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
															"aria-label": `Reassign ${id}`,
															className: "h-6 rounded border bg-card px-1 text-[11px]",
															value: "",
															onChange: (e) => e.target.value && n.reassign(c.crewId, id, e.target.value),
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
																value: "",
																children: "Reassign…"
															}), n.crews.filter((k) => k.id !== c.crewId).map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
																value: k.id,
																children: k.name
															}, k.id))]
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
															size: "sm",
															variant: "ghost",
															className: "h-6 px-1.5 text-[11px]",
															onClick: () => n.removeFromPlan(c.crewId, id),
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3 w-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																className: "sr-only",
																children: "Remove"
															})]
														})] })
													})
												]
											}, id);
										}), !c.drainIds.length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
											className: "text-xs text-muted-foreground",
											children: "No tasks."
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-3 space-y-1 border-t pt-2 text-xs",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex justify-between",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Cleaning" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "tabular-nums",
													children: fmtMin(c.cleaningMin)
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex justify-between",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Est. travel" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "tabular-nums",
													children: fmtMin(c.travelMin)
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex justify-between",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Estimated route distance" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "tabular-nums",
													children: [c.distanceKm, " km"]
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex justify-between font-semibold",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Estimated total" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "tabular-nums",
													children: fmtMin(c.totalMin)
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "h-1.5 rounded bg-muted",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "h-1.5 rounded bg-primary",
													style: { width: `${pct}%` }
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "text-[10px] text-muted-foreground",
												children: [pct, "% of crew-hours"]
											})
										]
									})
								]
							}, c.crewId);
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-[420px] 2xl:h-auto",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LazyMap, {
							drains: planned,
							onSelect: () => {},
							routes
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "sticky bottom-0 flex items-center justify-between gap-2 rounded-md border bg-card px-4 py-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-sm text-muted-foreground",
						children: [
							totalTasks,
							" tasks across ",
							plan.crews.filter((c) => c.drainIds.length).length,
							" crews",
							plan.dispatched && " · dispatched"
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialog, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogTrigger, {
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							disabled: plan.dispatched || !totalTasks,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "h-4 w-4" }), plan.dispatched ? "Dispatched" : "Dispatch All"]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogTitle, { children: [
						"Dispatch ",
						totalTasks,
						" tasks?"
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogDescription, { children: "Crews will see these tasks in the Crew App. Tasks become Assigned and an audit record is created." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogCancel, { children: "Cancel" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogAction, {
						onClick: n.dispatchAll,
						children: "Dispatch"
					})] })] })] })]
				})
			]
		})
	});
}
//#endregion
export { DispatchPage as component };
