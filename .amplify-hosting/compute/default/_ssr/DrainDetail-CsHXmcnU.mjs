import { o as __toESM } from "../_runtime.mjs";
import { b as useNavigate, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { L as require_jsx_runtime, d as DialogClose, f as DialogContent, g as DialogTitle, h as DialogPortal, m as DialogOverlay, p as DialogDescription, u as Dialog } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { i as cn } from "./utils-P7bOhUvR.mjs";
import { t as Button } from "./button-BP29gmjJ.mjs";
import { i as crewName } from "./data-BhlzLgUJ.mjs";
import { a as explanation, c as recommendation, l as scoreRisk, r as WEIGHTS, s as reasons, u as useNala } from "./store-DM6PPzvT.mjs";
import { O as MapPin, S as Plus, g as Send, r as X } from "../_libs/lucide-react.mjs";
import { i as Tag, r as StatusBadge, t as RiskBadge } from "./badges-CBrcW0l3.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/DrainDetail-CsHXmcnU.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Sheet = Dialog;
var SheetPortal = DialogPortal;
var SheetOverlay = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, {
	className: cn("fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
	...props,
	ref
}));
SheetOverlay.displayName = DialogOverlay.displayName;
var sheetVariants = cva("fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500 data-[state=open]:animate-in data-[state=closed]:animate-out", {
	variants: { side: {
		top: "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
		bottom: "inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
		left: "inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
		right: "inset-y-0 right-0 h-full w-3/4 border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm"
	} },
	defaultVariants: { side: "right" }
});
var SheetContent = import_react.forwardRef(({ side = "right", className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
	ref,
	className: cn(sheetVariants({ side }), className),
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogClose, {
		className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background cursor-pointer transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "sr-only",
			children: "Close"
		})]
	}), children]
})] }));
SheetContent.displayName = DialogContent.displayName;
var SheetHeader = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col space-y-2 text-center sm:text-left", className),
	...props
});
SheetHeader.displayName = "SheetHeader";
var SheetFooter = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
	...props
});
SheetFooter.displayName = "SheetFooter";
var SheetTitle = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
	ref,
	className: cn("text-lg font-semibold text-foreground", className),
	...props
}));
SheetTitle.displayName = DialogTitle.displayName;
var SheetDescription = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
	ref,
	className: cn("text-sm text-muted-foreground", className),
	...props
}));
SheetDescription.displayName = DialogDescription.displayName;
var MOBILE_BREAKPOINT = 768;
function useIsMobile() {
	const [isMobile, setIsMobile] = import_react.useState(void 0);
	import_react.useEffect(() => {
		const mql = window.matchMedia(`(max-width: 767px)`);
		const onChange = () => {
			setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
		};
		mql.addEventListener("change", onChange);
		setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
		return () => mql.removeEventListener("change", onChange);
	}, []);
	return !!isMobile;
}
function Section({ title, children, right }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "border-t pt-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-2 flex items-center justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground",
				children: title
			}), right]
		}), children]
	});
}
function DrainDetailBody({ drain, onClose }) {
	const { drainRain, addToPlan, audit, plan, reports, tasks } = useNala();
	const nav = useNavigate();
	const rain = drainRain(drain);
	const r = scoreRisk(drain, rain);
	const ex = explanation(drain, rain, r.band);
	const hist = audit.filter((a) => a.drainId === drain.id).slice(0, 6);
	const drainReports = reports.filter((x) => x.drainId === drain.id).slice(0, 4);
	const task = tasks.find((t) => t.drainId === drain.id);
	const plannedCrew = plan?.crews.find((c) => c.drainIds.includes(drain.id))?.crewId;
	const bar = r.band === "HIGH" ? "bg-risk-high" : r.band === "MEDIUM" ? "bg-risk-medium" : "bg-risk-low";
	const rows = [
		[
			"Rainfall",
			"R",
			r.factors.R,
			WEIGHTS.R,
			r.contrib.rainfall,
			`min(100, ${rain}/60×100)`
		],
		[
			"History",
			"H",
			r.factors.H,
			WEIGHTS.H,
			r.contrib.history,
			`min(100, ${drain.historicalChokes}/5×100)`
		],
		[
			"Terrain",
			"S",
			r.factors.S,
			WEIGHTS.S,
			r.contrib.terrain,
			`${drain.slope} slope`
		],
		[
			"Citizen",
			"C",
			r.factors.C,
			WEIGHTS.C,
			r.contrib.citizen,
			`min(100, ${drain.citizenReports}/6×100)`
		]
	];
	const maxC = Math.max(...rows.map((x) => x[4]), 1);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4 text-sm",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-lg border bg-muted/40 p-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-end justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[11px] font-semibold uppercase tracking-wide text-muted-foreground",
						children: "Risk score"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-baseline gap-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-3xl font-semibold tabular-nums",
							children: r.score
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-muted-foreground",
							children: "/ 100"
						})]
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col items-end gap-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RiskBadge, { band: r.band }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: drain.status })]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-2 h-1.5 rounded-full bg-muted",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: `h-1.5 rounded-full ${bar}`,
						style: { width: `${r.score}%` }
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
				title: "Overview",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", {
					className: "grid grid-cols-2 gap-x-4 gap-y-2",
					children: [
						["Forecast (72h)", `${rain} mm`],
						["Historical chokes", drain.historicalChokes],
						["Citizen reports (30d)", drain.citizenReports],
						["Terrain", drain.slope],
						["Low-lying", drain.lowLying ? "Yes" : "No"],
						["Last cleaned", drain.lastCleaned],
						["Cleaning time", `${drain.cleaningTimeMin} min`],
						["Population weight", drain.adjacentPopulationWeight],
						["Ward", drain.ward],
						["Coords", `${drain.lat}, ${drain.lng}`]
					].map(([k, v]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
						className: "text-[11px] text-muted-foreground",
						children: k
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
						className: `font-medium tabular-nums ${k === "Terrain" ? "capitalize" : ""}`,
						children: v
					})] }, k))
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
				title: "Risk breakdown",
				right: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-mono text-[10px] text-muted-foreground",
					children: "0.40R + 0.25H + 0.20S + 0.15C"
				}),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "space-y-2",
					children: rows.map(([n, k, v, w, c, f]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-medium",
								children: [
									n,
									" (",
									k,
									") ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-muted-foreground",
										children: [
											"· ",
											v.toFixed(0),
											" × ",
											w
										]
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-semibold tabular-nums",
								children: [c.toFixed(1), " pts"]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-1 h-1.5 rounded-full bg-muted",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-1.5 rounded-full bg-primary/70",
								style: { width: `${c / maxC * 100}%` }
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-0.5 text-[10px] text-muted-foreground",
							children: f
						})
					] }, k))
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-2 flex justify-between rounded-md bg-muted px-2 py-1 text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Total" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "font-bold tabular-nums",
						children: [
							r.raw.toFixed(2),
							" → ",
							r.score
						]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
				title: "Why this drain?",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "list-disc space-y-0.5 pl-5",
					children: reasons(drain, rain).map((x) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: x }, x))
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
				title: "History",
				children: hist.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
					className: "space-y-1.5 border-l pl-3 text-xs",
					children: hist.map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "relative before:absolute before:-left-[15px] before:top-1.5 before:h-1.5 before:w-1.5 before:rounded-full before:bg-muted-foreground",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "tabular-nums text-muted-foreground",
								children: new Date(h.timestamp).toLocaleString()
							}),
							" · ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-medium",
								children: h.actor
							}),
							" · ",
							h.reason
						]
					}, h.id))
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs text-muted-foreground",
					children: [
						"Last cleaned ",
						drain.lastCleaned,
						". No activity this session."
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
				title: "Citizen reports",
				children: drainReports.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "space-y-1 text-xs",
					children: drainReports.map((x) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-medium",
							children: x.issue
						}),
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-muted-foreground",
							children: [
								"· ",
								x.location,
								" · ",
								new Date(x.createdAt).toLocaleDateString()
							]
						})
					] }, x.id))
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs text-muted-foreground",
					children: [drain.citizenReports, " synthetic reports in the last 30 days; none added this session."]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
				title: "Recommendation",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-md border-l-4 border-primary bg-accent px-3 py-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs font-semibold",
							children: recommendation(r.band)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1",
							children: ex.en
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs italic text-muted-foreground",
							lang: "hi-Latn",
							children: ex.hin
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
				title: "Crew assignment",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs",
					children: task ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						"Assigned to ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-semibold",
							children: crewName(task.crewId)
						}),
						" · task #",
						task.order
					] }) : plannedCrew ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						"In current plan for ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-semibold",
							children: crewName(plannedCrew)
						}),
						" · ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, { children: "not dispatched" })
					] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-muted-foreground",
						children: "Not in a plan yet."
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "sticky bottom-0 -mx-4 flex flex-wrap gap-2 border-t bg-background px-4 py-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						variant: "outline",
						disabled: !plan || plan.dispatched || drain.status !== "UNASSIGNED" || !!plannedCrew,
						onClick: () => addToPlan(drain.id),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), "Add to Plan"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						onClick: () => {
							onClose?.();
							nav({ to: "/dispatch" });
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "h-4 w-4" }), "Dispatch"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: "ghost",
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/map",
							search: { drain: drain.id },
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "h-4 w-4" }), "Map"]
						})
					})
				]
			})
		]
	});
}
function DrainSheet({ drain, onOpenChange }) {
	const mobile = useIsMobile();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sheet, {
		open: !!drain,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetContent, {
			side: mobile ? "bottom" : "right",
			className: mobile ? "h-[100dvh] overflow-y-auto px-4" : "w-full overflow-y-auto px-4 sm:max-w-md",
			children: drain && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetHeader, {
				className: "p-0 pb-3 pt-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-mono text-xs text-muted-foreground",
						children: drain.id
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetTitle, {
						className: "text-lg",
						children: drain.name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetDescription, { children: ["Synthetic demo drain segment · ", drain.ward] })
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DrainDetailBody, {
				drain,
				onClose: () => onOpenChange(false)
			})] })
		})
	});
}
//#endregion
export { DrainSheet as n, DrainDetailBody as t };
