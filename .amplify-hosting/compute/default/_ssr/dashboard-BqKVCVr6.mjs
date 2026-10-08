import { o as __toESM } from "../_runtime.mjs";
import { b as useNavigate, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { L as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as Button } from "./button-BP29gmjJ.mjs";
import { i as crewName } from "./data-BhlzLgUJ.mjs";
import { l as scoreRisk, s as reasons, u as useNala } from "./store-DM6PPzvT.mjs";
import { A as LoaderCircle, E as Map, K as CloudRain, Y as Circle, Z as CircleCheck, ct as ArrowRight, m as ShieldCheck, n as Zap, rt as Camera } from "../_libs/lucide-react.mjs";
import { i as Panel, t as AppShell } from "./AppShell-DhLdAZ0I.mjs";
import { i as Tag, n as SourceBadge, t as RiskBadge } from "./badges-CBrcW0l3.mjs";
import { t as LazyMap } from "./LazyMap-DCELCNoD.mjs";
import { n as DrainSheet } from "./DrainDetail-CsHXmcnU.mjs";
import { t as impactStats } from "./impact-DoUMrrvc.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard-BqKVCVr6.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var BAR = {
	HIGH: "bg-risk-high",
	MEDIUM: "bg-risk-medium",
	LOW: "bg-risk-low"
};
var ACTIVE = [
	"ASSIGNED",
	"EN_ROUTE",
	"CLEANING",
	"PROOF_SUBMITTED",
	"NEEDS_REVIEW"
];
function Strip({ label, value, hint, tone }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-w-0 px-4 py-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: `mt-0.5 truncate text-lg font-semibold tabular-nums ${tone === "high" ? "text-risk-high" : ""}`,
				children: value
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "truncate text-[11px] text-muted-foreground",
				children: hint
			})
		]
	});
}
function ScoreCard({ d, rain }) {
	const r = scoreRisk(d, rain);
	const parts = [
		[
			"Rainfall",
			r.contrib.rainfall,
			40
		],
		[
			"History",
			r.contrib.history,
			25
		],
		[
			"Terrain",
			r.contrib.terrain,
			20
		],
		[
			"Reports",
			r.contrib.citizen,
			15
		]
	];
	const C = 2 * Math.PI * 34;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-4 sm:grid-cols-[auto_1fr]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex flex-col items-center",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative h-24 w-24",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
					viewBox: "0 0 80 80",
					className: "h-24 w-24 -rotate-90",
					"aria-hidden": true,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
						cx: "40",
						cy: "40",
						r: "34",
						fill: "none",
						stroke: "var(--muted)",
						strokeWidth: "7"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
						cx: "40",
						cy: "40",
						r: "34",
						fill: "none",
						stroke: `var(--risk-${d.riskBand.toLowerCase()})`,
						strokeWidth: "7",
						strokeLinecap: "round",
						strokeDasharray: `${d.riskScore / 100 * C} ${C}`
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "absolute inset-0 grid place-items-center text-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-2xl font-semibold tabular-nums leading-none",
						children: d.riskScore
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-1 text-[9px] font-bold uppercase tracking-wide text-muted-foreground",
						children: [d.riskBand, " risk"]
					})] })
				})]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-1.5",
			children: [
				parts.map(([k, v, max]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-[64px_1fr_28px] items-center gap-2 text-xs",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-muted-foreground",
							children: k
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "h-1.5 overflow-hidden rounded-full bg-muted",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block h-full rounded-full bg-foreground/70",
								style: { width: `${v / max * 100}%` }
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-right font-medium tabular-nums",
							children: Math.round(v)
						})
					]
				}, k)),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "pt-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground",
					children: "Why this drain?"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "space-y-0.5 text-xs",
					children: reasons(d, rain).map((x) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: ["• ", x] }, x))
				})
			]
		})]
	});
}
function Dashboard() {
	const n = useNala();
	const nav = useNavigate();
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [sel, setSel] = (0, import_react.useState)(null);
	const [focus, setFocus] = (0, import_react.useState)(null);
	const counts = {
		HIGH: 0,
		MEDIUM: 0,
		LOW: 0
	};
	n.drains.forEach((d) => counts[d.riskBand]++);
	const active = n.drains.filter((d) => ACTIVE.includes(d.status)).length;
	const reviewTasks = n.tasks.filter((t) => t.submittedAt && !t.officerDecision);
	const passed = n.tasks.filter((t) => t.verification?.verdict === "PASS" && !t.officerDecision).length;
	const needs = n.tasks.filter((t) => t.verification?.verdict === "REVIEW" && !t.officerDecision).length;
	const human = n.tasks.filter((t) => t.officerDecision === "APPROVED").length;
	const imp = impactStats(n.drains);
	const top = [...n.drains].sort((a, b) => b.riskScore - a.riskScore).slice(0, 5);
	const focused = n.drains.find((d) => d.id === (focus ?? top[0]?.id));
	const totalH = n.crews.reduce((a, c) => a + c.availableHours, 0);
	const heavy = n.forecastMm >= 40;
	const anyProof = n.tasks.some((t) => t.submittedAt);
	const allDone = n.tasks.length > 0 && n.tasks.every((t) => t.officerDecision);
	const stages = [
		[
			"Risk Assessment",
			"done",
			"Complete"
		],
		[
			"Cleaning Plan",
			n.plan ? "done" : "now",
			n.plan ? `${n.plan.hoursPlanned}h planned` : "Not generated"
		],
		[
			"Crew Dispatch",
			n.plan?.dispatched ? "done" : n.plan ? "now" : "wait",
			n.plan?.dispatched ? `${n.tasks.length} tasks sent` : "Not started"
		],
		[
			"Field Proof",
			anyProof ? "done" : n.plan?.dispatched ? "now" : "wait",
			anyProof ? `${reviewTasks.length + human} submitted` : "Waiting"
		],
		[
			"Verification",
			allDone ? "done" : anyProof ? "now" : "wait",
			human ? `${human} verified` : "Waiting"
		]
	];
	const generate = () => {
		setBusy(true);
		setTimeout(() => {
			n.generatePlan();
			nav({ to: "/dispatch" });
		}, 50);
	};
	const crewMin = (id) => n.plan?.crews.find((c) => c.crewId === id)?.totalMin ?? 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: "Dashboard",
		subtitle: "Pre-rain operations overview · Demo Ward 7 (synthetic)",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-[1400px] space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "flex flex-wrap items-center justify-between gap-4 rounded-xl border bg-card px-5 py-4 shadow-card",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: `grid h-11 w-11 place-items-center rounded-lg ${heavy ? "bg-risk-high/10 text-risk-high" : "bg-info/10 text-info"}`,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CloudRain, {
								className: "h-5 w-5",
								"aria-hidden": true
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground",
								children: ["Rain / risk status ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SourceBadge, { source: n.weather.source })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-base font-semibold",
								children: heavy ? "Heavy rainfall expected" : "Light rainfall expected"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-xs text-muted-foreground",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-xl font-semibold tabular-nums text-foreground",
										children: [n.forecastMm, " mm"]
									}),
									" next 72 hours · Source: ",
									n.weather.source === "demo" ? "Demo scenario" : "Open-Meteo",
									" · ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/settings",
										className: "underline",
										children: "change"
									})
								]
							})
						] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "lg",
								onClick: generate,
								disabled: busy,
								children: [busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { className: "h-4 w-4" }), busy ? "Generating plan..." : "Generate Pre-Rain Cleaning Plan"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "lg",
								variant: "outline",
								asChild: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/map",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Map, { className: "h-4 w-4" }), "Open Risk Map"]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "link",
								asChild: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/drains",
									children: "View drains"
								})
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "grid grid-cols-2 divide-x divide-y rounded-xl border bg-card shadow-card sm:grid-cols-5 sm:divide-y-0",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Strip, {
							label: "High risk",
							value: counts.HIGH,
							hint: "Priority drains",
							tone: "high"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Strip, {
							label: "Plan",
							value: n.plan ? n.plan.dispatched ? "Dispatched" : "Generated" : "Not generated",
							hint: n.plan ? `${n.plan.highCoverage}% high-risk coverage` : "Run planner"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Strip, {
							label: "Crews",
							value: `${totalH}h`,
							hint: n.plan ? `${n.plan.hoursPlanned}h planned` : "Available"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Strip, {
							label: "Tasks",
							value: active,
							hint: "Active in field"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Strip, {
							label: "Verification",
							value: reviewTasks.length,
							hint: "Awaiting officer"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-4 lg:grid-cols-12",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
							className: "lg:col-span-8",
							title: "Risk Overview",
							subtitle: `${counts.HIGH} of ${n.drains.length} monitored drains require high-priority attention.`,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-5 md:grid-cols-[1fr_1.2fr]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-3",
									children: [[
										"HIGH",
										"MEDIUM",
										"LOW"
									].map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid grid-cols-[64px_1fr_28px] items-center gap-3 text-xs",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-semibold tracking-wide text-muted-foreground",
												children: b
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "h-2 overflow-hidden rounded-full bg-muted",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: `block h-full rounded-full ${BAR[b]}`,
													style: { width: `${counts[b] / Math.max(1, n.drains.length) * 100}%` }
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-right text-sm font-semibold tabular-nums",
												children: counts[b]
											})
										]
									}, b)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "pt-1 text-[11px] text-muted-foreground",
										children: "Score = 0.40 rainfall + 0.25 choke history + 0.20 terrain + 0.15 citizen reports."
									})]
								}), focused && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "border-t pt-4 md:border-l md:border-t-0 md:pl-5 md:pt-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mb-2 text-xs",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-mono text-muted-foreground",
												children: focused.id
											}),
											" ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-medium",
												children: focused.name
											})
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScoreCard, {
										d: focused,
										rain: n.drainRain(focused)
									})]
								})]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
							className: "lg:col-span-4",
							title: "Pre-Rain Readiness",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
								className: "space-y-0",
								children: stages.map(([name, st, note], i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "relative flex gap-3 pb-3 last:pb-0",
									children: [
										i < stages.length - 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute left-[11px] top-6 h-[calc(100%-18px)] w-px bg-border" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: `relative grid h-6 w-6 shrink-0 place-items-center rounded-full text-[10px] font-semibold ${st === "done" ? "bg-risk-low/10 text-risk-low" : st === "now" ? "bg-info/10 text-info ring-1 ring-info/40" : "bg-muted text-muted-foreground"}`,
											children: st === "done" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-3.5 w-3.5" }) : st === "now" ? String(i + 1).padStart(2, "0") : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Circle, { className: "h-3 w-3" })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "min-w-0",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: `text-sm ${st === "wait" ? "text-muted-foreground" : "font-medium"}`,
												children: name
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-[11px] text-muted-foreground",
												children: note
											})]
										})
									]
								}, name))
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
							className: "lg:col-span-7",
							title: "Highest-Risk Drains",
							subtitle: "Priority based on rainfall, choke history, terrain and reports.",
							right: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/drains",
								className: "text-xs font-medium text-muted-foreground hover:text-foreground",
								children: "All drains →"
							}),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "space-y-2",
								children: top.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									onMouseEnter: () => setFocus(d.id),
									className: "group relative flex flex-wrap items-center justify-between gap-3 overflow-hidden rounded-lg border bg-card py-2.5 pl-4 pr-3 transition-all duration-150 hover:border-foreground/20 hover:shadow-raised",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `absolute inset-y-0 left-0 w-1 ${BAR[d.riskBand]}` }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "min-w-0",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "text-sm",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "font-mono text-xs text-muted-foreground",
														children: d.id
													}),
													" ",
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "font-medium",
														children: d.name
													})
												]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "mt-0.5 flex flex-wrap gap-x-3 text-[11px] text-muted-foreground tabular-nums",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [n.drainRain(d), " mm"] }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [d.historicalChokes, " chokes"] }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: d.lowLying ? "Low-lying" : `${d.slope} slope` }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [d.cleaningTimeMin, " min cleaning"] })
												]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RiskBadge, {
												band: d.riskBand,
												score: d.riskScore
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												size: "sm",
												variant: "outline",
												onClick: () => setSel(d.id),
												children: "View details"
											})]
										})
									]
								}, d.id))
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "relative overflow-hidden rounded-xl border bg-card shadow-card lg:col-span-5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "absolute left-14 top-3 z-[500] rounded-md border bg-card/95 px-2.5 py-1 text-xs font-semibold shadow-card",
									children: "Risk Map"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/map",
									className: "absolute right-3 top-3 z-[500] rounded-md border bg-card/95 px-2.5 py-1 text-xs font-medium shadow-card hover:bg-muted",
									children: "Open Full Map →"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "absolute bottom-3 left-3 z-[500] flex gap-3 rounded-md border bg-card/95 px-2.5 py-1 text-[10px] font-semibold shadow-card",
									children: [
										"HIGH",
										"MEDIUM",
										"LOW"
									].map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "flex items-center gap-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `h-2 w-2 rounded-full ${BAR[b]}` }), b]
									}, b))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-[380px] [&>div]:rounded-none [&>div]:border-0",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LazyMap, {
										drains: n.drains,
										selected: sel ?? void 0,
										onSelect: setSel
									})
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
							className: "lg:col-span-6",
							title: "Crew Availability",
							right: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-xs tabular-nums text-muted-foreground",
								children: [
									totalH,
									"h total",
									n.plan && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [" → ", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-semibold text-foreground",
										children: [n.plan.hoursPlanned, "h planned"]
									})] })
								]
							}),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-3",
								children: [n.crews.map((c) => {
									const used = Math.min(c.availableHours * 60, crewMin(c.id));
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid grid-cols-[110px_1fr_auto] items-center gap-3 text-sm",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-medium",
												children: c.name
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "h-2 overflow-hidden rounded-full bg-muted",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "block h-full rounded-full bg-info",
													style: { width: `${used / (c.availableHours * 60) * 100}%` }
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-xs tabular-nums text-muted-foreground",
												children: [
													n.plan ? `${(used / 60).toFixed(1)} / ` : "",
													c.availableHours,
													"h"
												]
											})
										]
									}, c.id);
								}), !n.plan && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] text-muted-foreground",
									children: "Bars fill once a plan is generated. The planner never exceeds crew capacity."
								})]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
							className: "lg:col-span-6",
							title: "Proof Verification",
							right: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/tasks",
								className: "text-xs font-medium text-muted-foreground hover:text-foreground",
								children: "Open queue →"
							}),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mb-3 grid grid-cols-3 gap-2 text-center",
								children: [
									[
										"Needs review",
										needs,
										"text-risk-high"
									],
									[
										"AI passed",
										passed,
										"text-info"
									],
									[
										"Human verified",
										human,
										"text-risk-low"
									]
								].map(([l, v, c]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-lg border px-2 py-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: `text-lg font-semibold tabular-nums ${c}`,
										children: v
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[10px] uppercase tracking-wide text-muted-foreground",
										children: l
									})]
								}, l))
							}), reviewTasks.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3 rounded-lg border border-dashed px-3 py-4 text-xs text-muted-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, { className: "h-4 w-4" }), n.plan?.dispatched ? "No proof submitted yet — crews will upload before/after photos from the field." : "No cleaning plan has been dispatched yet."]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "space-y-2",
								children: reviewTasks.slice(0, 3).map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-3 rounded-lg border p-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "flex gap-1",
											children: [t.beforePhoto, t.afterPhoto].map((p, i) => p ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
												src: p,
												alt: i ? "After" : "Before",
												className: "h-10 w-10 rounded object-cover"
											}, i) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-10 w-10 rounded bg-muted" }, i))
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "min-w-0 flex-1 text-xs",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "font-mono font-medium",
												children: t.drainId
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "truncate text-muted-foreground",
												children: crewName(t.crewId)
											})]
										}),
										t.verification && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tag, {
											tone: t.verification.verdict === "PASS" ? "ok" : "demo",
											children: [
												"AI ",
												t.verification.verdict,
												" ",
												t.verification.confidence,
												"%"
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											size: "sm",
											variant: "outline",
											asChild: true,
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
												to: "/tasks",
												children: "Review"
											})
										})
									]
								}, t.id))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
							className: "lg:col-span-12",
							title: "Impact Summary",
							right: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
									tone: "demo",
									children: "Projected"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, { children: "Estimated" })]
							}),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid grid-cols-2 gap-4 md:grid-cols-4",
								children: [
									[
										"Completed drains",
										imp.completed,
										"Human verified"
									],
									[
										"High-risk coverage",
										`${imp.highCoveragePct}%`,
										`${imp.highDone} of ${imp.highTotal} HIGH`
									],
									[
										"Crew-hours used",
										`${(imp.crewMinutes / 60).toFixed(1)}h`,
										"Estimated"
									],
									[
										"Projected exposure reduction",
										`${imp.exposurePct}%`,
										"Model estimate, not measured"
									]
								].map(([l, v, h]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground",
										children: l
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-2xl font-semibold tabular-nums",
										children: v
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[11px] text-muted-foreground",
										children: h
									})
								] }, l))
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/impact",
								className: "mt-3 inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-3.5 w-3.5" }),
									"Full impact dashboard ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-3 w-3" })
								]
							})]
						})
					]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DrainSheet, {
			drain: n.drains.find((d) => d.id === sel) ?? null,
			onOpenChange: (o) => !o && setSel(null)
		})]
	});
}
//#endregion
export { Dashboard as component };
