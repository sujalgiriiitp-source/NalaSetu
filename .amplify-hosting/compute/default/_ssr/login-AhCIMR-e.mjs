import { o as __toESM } from "../_runtime.mjs";
import { b as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { L as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { a as useAuth, i as cn, n as ROLE_HOME, r as ROLE_LABEL } from "./utils-P7bOhUvR.mjs";
import { t as Button } from "./button-BP29gmjJ.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { A as LoaderCircle, D as MapPinned, H as EyeOff, I as HardHat, K as CloudRain, L as Gauge, P as Info, T as MessageSquareWarning, U as Droplets, V as Eye, ct as ArrowRight, it as Building2, m as ShieldCheck, tt as Check, v as Route } from "../_libs/lucide-react.mjs";
import { n as CheckboxIndicator, t as Checkbox$1 } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { t as Input } from "./input-2821DMN6.mjs";
import { t as Label$1 } from "../_libs/radix-ui__react-label.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login-AhCIMR-e.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var labelVariants = cva("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70");
var Label = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label$1, {
	ref,
	className: cn(labelVariants(), className),
	...props
}));
Label.displayName = Label$1.displayName;
var Checkbox = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox$1, {
	ref,
	className: cn("grid place-content-center peer h-4 w-4 shrink-0 rounded-sm border border-primary shadow cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground", className),
	...props,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CheckboxIndicator, {
		className: cn("grid place-content-center text-current"),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4" })
	})
}));
Checkbox.displayName = Checkbox$1.displayName;
var ROLES = [
	{
		role: "OFFICER",
		icon: Building2,
		hint: "Dashboard access"
	},
	{
		role: "CREW",
		icon: HardHat,
		hint: "Field task access"
	},
	{
		role: "CITIZEN",
		icon: MessageSquareWarning,
		hint: "Report issue access"
	}
];
var FLOW = [
	{
		label: "Rain",
		icon: CloudRain
	},
	{
		label: "Risk",
		icon: Gauge
	},
	{
		label: "Plan",
		icon: MapPinned
	},
	{
		label: "Dispatch",
		icon: Route
	},
	{
		label: "Verify",
		icon: ShieldCheck
	}
];
function DrainGrid() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 320 160",
		className: "h-auto w-full text-border",
		"aria-hidden": true,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
				stroke: "currentColor",
				strokeWidth: "1",
				fill: "none",
				children: [[
					20,
					60,
					100,
					140
				].map((y) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
					x1: "0",
					y1: y,
					x2: "320",
					y2: y
				}, y)), [
					40,
					110,
					180,
					250
				].map((x) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
					x1: x,
					y1: "0",
					x2: x,
					y2: "160"
				}, x))]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M0 100 H110 V60 H250 V20 H320",
				stroke: "var(--info)",
				strokeWidth: "2.5",
				fill: "none",
				strokeLinecap: "round"
			}),
			[
				[
					110,
					100,
					"var(--risk-high)"
				],
				[
					180,
					60,
					"var(--risk-medium)"
				],
				[
					250,
					20,
					"var(--risk-low)"
				],
				[
					40,
					140,
					"var(--risk-low)"
				],
				[
					250,
					140,
					"var(--risk-medium)"
				]
			].map(([x, y, c]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: x,
				cy: y,
				r: "5",
				fill: c,
				stroke: "var(--card)",
				strokeWidth: "2"
			}, `${x}-${y}`))
		]
	});
}
function LoginPage() {
	const { ready, session, signIn, demoSignIn, provider } = useAuth();
	const nav = useNavigate();
	const [role, setRole] = (0, import_react.useState)("OFFICER");
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [show, setShow] = (0, import_react.useState)(false);
	const [remember, setRemember] = (0, import_react.useState)(false);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		if (ready && session) nav({
			to: ROLE_HOME[session.role],
			replace: true
		});
	}, [
		ready,
		session,
		nav
	]);
	const go = (r) => {
		const s = demoSignIn(r, remember);
		nav({
			to: ROLE_HOME[s.role],
			replace: true
		});
	};
	const submit = async (e) => {
		e.preventDefault();
		setError(null);
		if (!email.trim() || !password) {
			setError("Enter your work email or demo ID and password.");
			return;
		}
		setBusy(true);
		try {
			const s = await signIn(email.trim(), password, role, remember);
			nav({
				to: ROLE_HOME[s.role],
				replace: true
			});
		} catch (er) {
			setError(er.message || "Unable to sign in. Check your credentials.");
		} finally {
			setBusy(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-screen flex-col bg-background",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "mx-auto grid w-full max-w-6xl flex-1 items-center gap-8 px-4 py-8 md:px-8 lg:grid-cols-[1.1fr_1fr] lg:gap-16 lg:py-12",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				"aria-labelledby": "brand",
				className: "space-y-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "grid h-10 w-10 place-items-center rounded-lg bg-primary text-primary-foreground",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Droplets, {
								className: "h-5 w-5",
								"aria-hidden": true
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							id: "brand",
							className: "text-lg font-semibold tracking-tight",
							children: "NalaSetu"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs text-muted-foreground",
							children: "Municipal Drain Operations Platform"
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "max-w-md text-2xl font-semibold leading-tight tracking-tight md:text-3xl",
						children: "Predict risk. Prioritize cleaning. Verify field work."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "max-w-md text-sm text-muted-foreground",
						children: "Decide which drains to clean before heavy rain, dispatch crews within their hours, and confirm every job with photo proof and officer review."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
						className: "flex flex-wrap items-center gap-1.5",
						"aria-label": "Operational flow",
						children: FLOW.map((f, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex items-center gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "inline-flex items-center gap-1.5 rounded-md border bg-card px-2.5 py-1.5 text-xs font-semibold uppercase tracking-wide shadow-card",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(f.icon, {
									className: "h-3.5 w-3.5 text-info",
									"aria-hidden": true
								}), f.label]
							}), i < FLOW.length - 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, {
								className: "h-3.5 w-3.5 text-muted-foreground",
								"aria-hidden": true
							})]
						}, f.label))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "hidden max-w-md rounded-xl border bg-card p-4 shadow-card lg:block",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-2 flex items-center justify-between text-[11px] font-semibold uppercase tracking-wide text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Demo Ward 7 · drain network" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex items-center gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "h-2 w-2 rounded-full bg-risk-high" }),
									"High",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "h-2 w-2 rounded-full bg-risk-medium" }),
									"Med",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "h-2 w-2 rounded-full bg-risk-low" }),
									"Low"
								]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DrainGrid, {})]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				"aria-labelledby": "signin",
				className: "w-full rounded-xl border bg-card p-6 shadow-raised md:p-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						id: "signin",
						className: "text-lg font-semibold tracking-tight",
						children: "Sign in to Municipal Operations"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: "Access your operational dashboard."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", {
						className: "mt-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("legend", {
							className: "mb-2 text-xs font-medium",
							children: "Role"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid grid-cols-3 gap-2",
							role: "radiogroup",
							"aria-label": "Role",
							children: ROLES.map(({ role: r, icon: I, hint }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								role: "radio",
								"aria-checked": role === r,
								onClick: () => setRole(r),
								className: `flex min-h-[76px] flex-col items-center justify-center gap-1 rounded-lg border px-2 py-2 text-center transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${role === r ? "border-primary bg-accent ring-1 ring-primary" : "hover:bg-muted"}`,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(I, {
										className: `h-4 w-4 ${role === r ? "text-foreground" : "text-muted-foreground"}`,
										"aria-hidden": true
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs font-semibold leading-tight",
										children: ROLE_LABEL[r]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] text-muted-foreground",
										children: hint
									})
								]
							}, r))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: submit,
						className: "mt-5 space-y-4",
						noValidate: true,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "email",
									children: "Work Email / Demo ID"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "email",
									autoComplete: "username",
									className: "h-11",
									value: email,
									onChange: (e) => setEmail(e.target.value),
									placeholder: "name@municipality.gov",
									"aria-invalid": !!error
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "password",
									children: "Password"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "password",
										type: show ? "text" : "password",
										autoComplete: "current-password",
										className: "h-11 pr-10",
										value: password,
										onChange: (e) => setPassword(e.target.value),
										"aria-invalid": !!error
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => setShow((v) => !v),
										"aria-label": show ? "Hide password" : "Show password",
										className: "absolute right-1 top-1 grid h-9 w-9 place-items-center rounded-md text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
										children: show ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-4 w-4" })
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "flex items-center gap-2 text-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
										checked: remember,
										onCheckedChange: (v) => setRemember(v === true)
									}), "Remember me"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline",
									onClick: () => toast.info("Password recovery is disabled in Demo Mode."),
									children: "Forgot password?"
								})]
							}),
							error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								role: "alert",
								className: "rounded-md border border-risk-high/30 bg-risk-high/5 px-3 py-2 text-sm text-risk-high",
								children: error
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "submit",
								className: "h-11 w-full transition-colors duration-150",
								disabled: busy,
								children: busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }), "Signing in…"] }) : "Sign In"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 rounded-lg border border-risk-medium/30 bg-demo/60 p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[11px] font-bold uppercase tracking-wide text-demo-foreground",
								children: "Demo access"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[11px] text-demo-foreground/80",
								children: "Demo Mode · synthetic prototype access"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 grid gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "outline",
									className: "h-11 bg-card",
									onClick: () => go("OFFICER"),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "h-4 w-4" }), "Continue as Officer"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "outline",
									className: "h-11 bg-card",
									onClick: () => go("CREW"),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HardHat, { className: "h-4 w-4" }), "Continue as Crew"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "outline",
									className: "h-11 bg-card",
									onClick: () => go("CITIZEN"),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquareWarning, { className: "h-4 w-4" }), "Report as Citizen"]
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-4 text-center text-[11px] text-muted-foreground",
						children: ["Authentication provider: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-semibold",
							children: provider.label
						})]
					})
				]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
			className: "border-t px-4 py-3 text-center text-[11px] text-muted-foreground",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, { className: "mr-1 inline h-3 w-3 align-[-2px]" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-semibold",
					children: "DEMO MODE"
				}),
				" — Synthetic prototype environment — not a real municipal system."
			]
		})]
	});
}
//#endregion
export { LoginPage as component };
