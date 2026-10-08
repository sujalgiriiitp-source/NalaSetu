import { o as __toESM } from "../_runtime.mjs";
import { y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { L as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { a as useAuth } from "./utils-P7bOhUvR.mjs";
import { t as Button } from "./button-BP29gmjJ.mjs";
import { i as crewName } from "./data-BhlzLgUJ.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { u as useNala } from "./store-DM6PPzvT.mjs";
import { A as LoaderCircle, C as Play, U as Droplets, f as TriangleAlert, i as Wrench, lt as ArrowLeft, m as ShieldCheck, q as Clock, rt as Camera, tt as Check, u as Upload, w as Navigation, y as RotateCw } from "../_libs/lucide-react.mjs";
import { a as RequireRole, n as DemoBanner, o as UserMenu } from "./AppShell-DhLdAZ0I.mjs";
import { t as processPhoto } from "./verify-BR5JF3IR.mjs";
import { i as Tag, r as StatusBadge, t as RiskBadge } from "./badges-CBrcW0l3.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/crew-uRZb2MFi.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var DONE = [
	"PROOF_SUBMITTED",
	"VERIFIED",
	"NEEDS_REVIEW",
	"REJECTED"
];
function CrewPage() {
	const n = useNala();
	const { session } = useAuth();
	const [crewId, setCrewId] = (0, import_react.useState)("C-A");
	const tasks = n.tasks.filter((t) => t.crewId === crewId).sort((a, b) => a.order - b.order);
	const status = (t) => n.drains.find((d) => d.id === t.drainId)?.status;
	const current = tasks.find((t) => !DONE.includes(status(t)));
	const rest = tasks.filter((t) => t !== current);
	const doneCount = tasks.filter((t) => DONE.includes(status(t))).length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DemoBanner, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
				className: "sticky top-0 z-10 border-b bg-card/95 px-4 py-3 backdrop-blur",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex max-w-md items-center justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "grid h-9 w-9 place-items-center rounded-lg bg-primary text-primary-foreground",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Droplets, {
								className: "h-4 w-4",
								"aria-hidden": true
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-sm font-semibold",
							children: "NalaSetu Crew"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-[11px] text-muted-foreground tabular-nums",
							children: [
								doneCount,
								" of ",
								tasks.length,
								" done today"
							]
						})] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
						"aria-label": "Crew",
						className: "h-10 rounded-md border bg-card px-2 text-sm font-medium",
						value: crewId,
						onChange: (e) => setCrewId(e.target.value),
						children: n.crews.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: c.id,
							children: c.name
						}, c.id))
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "mx-auto max-w-md space-y-4 p-4 pb-10",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [session?.role === "OFFICER" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/dashboard",
							className: "inline-flex items-center gap-1 text-xs text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-3 w-3" }), "Officer view"]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/tasks",
							className: "text-xs text-muted-foreground underline-offset-4 hover:underline",
							children: "Verification status"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserMenu, {})]
					}),
					!tasks.length && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border bg-card p-8 text-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "mx-auto h-6 w-6 text-muted-foreground" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 font-semibold",
								children: "No tasks yet"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-sm text-muted-foreground",
								children: [crewName(crewId), " has nothing assigned. An officer must dispatch a plan first."]
							})
						]
					}),
					current && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground",
						children: "Today's task"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TaskCard, {
						task: current,
						hero: true
					}, current.id)] }),
					!current && tasks.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "rounded-xl border border-risk-low/30 bg-risk-low/10 p-4 text-sm font-medium text-risk-low",
						children: "All assigned tasks have proof submitted. Good work."
					}),
					rest.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "pt-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground",
						children: "Other tasks"
					}),
					rest.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TaskCard, { task: t }, t.id))
				]
			})
		]
	});
}
var STEPS = [
	"Location",
	"Before",
	"Cleaning",
	"After",
	"Submit"
];
function stepOf(status, t) {
	if (status === "ASSIGNED" || status === "EN_ROUTE") return 0;
	if (status === "CLEANING") return !t.beforePhoto ? 1 : !t.afterPhoto ? 3 : 4;
	return 5;
}
function Stepper({ step }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
		className: "flex items-center gap-1",
		"aria-label": "Task progress",
		children: STEPS.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
			className: "flex flex-1 flex-col items-center gap-1",
			"aria-current": i === step ? "step" : void 0,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: `grid h-6 w-6 place-items-center rounded-full border text-[11px] font-bold tabular-nums transition-colors ${i < step ? "border-risk-low bg-risk-low text-primary-foreground" : i === step ? "border-primary bg-primary text-primary-foreground" : "bg-card text-muted-foreground"}`,
				children: i < step ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3 w-3" }) : i + 1
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: `text-[10px] ${i === step ? "font-semibold text-foreground" : "text-muted-foreground"}`,
				children: s
			})]
		}, s))
	});
}
function TaskCard({ task, hero }) {
	const n = useNala();
	const d = n.drains.find((x) => x.id === task.drainId);
	const [busy, setBusy] = (0, import_react.useState)(null);
	const [failed, setFailed] = (0, import_react.useState)(false);
	const actor = crewName(task.crewId);
	const step = stepOf(d.status, task);
	const big = "h-14 w-full text-base font-semibold";
	const onPhoto = async (kind, f) => {
		if (!f) return;
		setBusy(kind);
		try {
			n.setPhoto(task.id, kind, await processPhoto(f));
			toast.success(kind === "before" ? "Before photo saved. Clean the drain, then take the after photo." : "After photo saved. Ready to submit.");
		} catch (e) {
			toast.error(e.message);
		} finally {
			setBusy(null);
		}
	};
	const submit = async () => {
		setBusy("submit");
		setFailed(false);
		try {
			await n.submitProof(task.id);
			toast.success("Proof submitted for verification.");
		} catch (e) {
			setFailed(true);
			toast.error(e.message);
		} finally {
			setBusy(null);
		}
	};
	const PhotoBtn = ({ kind, disabled }) => {
		const img = kind === "before" ? task.beforePhoto : task.afterPhoto;
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
			className: `relative flex aspect-[4/3] flex-col items-center justify-center gap-1 overflow-hidden rounded-lg border-2 border-dashed text-xs font-semibold ${disabled ? "cursor-not-allowed bg-muted/50 text-muted-foreground/60" : "cursor-pointer bg-muted text-muted-foreground active:scale-[0.98]"} transition-transform`,
			children: [img ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: img,
				alt: `${kind} photo`,
				className: "h-full w-full object-cover"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "absolute left-1.5 top-1.5 rounded bg-card/90 px-1.5 py-0.5 text-[10px] uppercase text-foreground",
				children: [kind, " ✓"]
			})] }) : busy === kind ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-6 w-6 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, { className: "h-7 w-7" }), disabled ? "Before photo first" : `Take ${kind} photo`] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				type: "file",
				disabled,
				accept: "image/jpeg,image/png,image/webp",
				capture: "environment",
				className: "sr-only",
				onChange: (e) => onPhoto(kind, e.target.files?.[0])
			})]
		});
	};
	if (!hero) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "flex items-center justify-between gap-3 rounded-xl border bg-card p-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-w-0",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-xs text-muted-foreground",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-mono",
						children: d.id
					}),
					" · #",
					task.order
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "truncate font-medium",
				children: d.name
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex shrink-0 flex-col items-end gap-1",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: d.status }), task.verification && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "text-[10px] text-muted-foreground tabular-nums",
				children: [
					"AI ",
					task.verification.verdict,
					" · ",
					task.verification.confidence,
					"%"
				]
			})]
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "overflow-hidden rounded-xl border bg-card shadow-raised",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `h-1 ${d.riskBand === "HIGH" ? "bg-risk-high" : d.riskBand === "MEDIUM" ? "bg-risk-medium" : "bg-risk-low"}` }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-3 p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono text-sm font-semibold",
							children: d.id
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: d.status })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-xl font-semibold leading-tight",
						children: d.name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-2 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RiskBadge, {
							band: d.riskBand,
							score: d.riskScore,
							className: "text-sm"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "inline-flex items-center gap-1 text-muted-foreground",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-4 w-4" }),
								"~",
								d.cleaningTimeMin,
								" min"
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stepper, { step })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-2.5 border-t bg-muted/30 p-4",
				children: [
					d.status === "ASSIGNED" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						className: big,
						onClick: () => n.transition(d.id, "EN_ROUTE", actor, "Crew started task"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "h-5 w-5" }), "Start Task"]
					}),
					d.status === "EN_ROUTE" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex items-center justify-center gap-2 rounded-md bg-st-enroute/10 py-2 text-sm font-semibold text-st-enroute",
						children: "En route to site"
					}),
					[
						"ASSIGNED",
						"EN_ROUTE",
						"CLEANING"
					].includes(d.status) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						className: big,
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
							href: `https://www.google.com/maps/dir/?api=1&destination=${d.lat},${d.lng}`,
							target: "_blank",
							rel: "noreferrer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigation, { className: "h-5 w-5" }), "Open Navigation"]
						})
					}),
					d.status === "EN_ROUTE" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						className: big,
						onClick: () => n.transition(d.id, "CLEANING", actor, "Crew on site, cleaning"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wrench, { className: "h-5 w-5" }), "Start Cleaning"]
					}),
					d.status === "CLEANING" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PhotoBtn, { kind: "before" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PhotoBtn, {
								kind: "after",
								disabled: !task.beforePhoto
							})]
						}),
						failed && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "rounded-md border border-st-review/30 bg-st-review/10 p-2 text-sm font-semibold text-st-review",
							children: "Proof Pending — Retry"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							className: big,
							disabled: !task.beforePhoto || !task.afterPhoto || busy === "submit",
							onClick: submit,
							children: [busy === "submit" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-5 w-5 animate-spin" }) : failed ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCw, { className: "h-5 w-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "h-5 w-5" }), busy === "submit" ? "Uploading & verifying…" : failed ? "Retry Submit" : "Submit Proof"]
						})
					] }),
					task.verification && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VerdictBox, {
						task,
						status: d.status
					})
				]
			})
		]
	});
}
function VerdictBox({ task, status }) {
	const v = task.verification;
	const pass = v.verdict === "PASS";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-lg border bg-card p-3 text-sm",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: `inline-flex items-center gap-1 font-semibold ${pass ? "text-risk-low" : "text-st-review"}`,
					children: [
						pass ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-4 w-4" }),
						"AI ",
						v.verdict,
						" · ",
						v.confidence,
						"%"
					]
				}), v.mode === "demo" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
					tone: "demo",
					children: "Demo AI — simulated"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, { children: "AI-assisted" })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-muted-foreground",
				children: v.reason
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-xs font-medium",
				children: status === "VERIFIED" ? "Officer approved — Human Verified." : status === "REJECTED" ? "Officer rejected — awaiting reassignment." : "Waiting for officer review. AI result is not final."
			})
		]
	});
}
var SplitComponent = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RequireRole, {
	roles: ["CREW", "OFFICER"],
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CrewPage, {})
});
//#endregion
export { SplitComponent as component };
