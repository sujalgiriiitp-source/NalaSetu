import { o as __toESM } from "../_runtime.mjs";
import { b as useNavigate, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { L as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { a as useAuth, i as cn, n as ROLE_HOME, r as ROLE_LABEL } from "./utils-P7bOhUvR.mjs";
import { u as useNala } from "./store-DM6PPzvT.mjs";
import { $ as ChevronRight, A as LoaderCircle, E as Map, I as HardHat, J as ClipboardCheck, K as CloudRain, M as ListChecks, N as LayoutDashboard, P as Info, R as FlaskConical, T as MessageSquareWarning, U as Droplets, Y as Circle, at as Bell, c as UserRound, h as Settings, j as ListOrdered, k as LogOut, nt as ChartColumn, tt as Check, v as Route } from "../_libs/lucide-react.mjs";
import { a as DropdownMenuItemIndicator, c as DropdownMenuRadioItem$1, d as DropdownMenuSubTrigger$1, f as DropdownMenuTrigger$1, i as DropdownMenuItem$1, l as DropdownMenuSeparator$1, n as DropdownMenuCheckboxItem$1, o as DropdownMenuLabel$1, r as DropdownMenuContent$1, s as DropdownMenuPortal, t as DropdownMenu$1, u as DropdownMenuSubContent$1 } from "../_libs/@radix-ui/react-dropdown-menu+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/AppShell-DhLdAZ0I.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/** Client-side demo gate: sends visitors without a session to /login and wrong roles to their own home. */
function RequireRole({ roles, children }) {
	const { ready, session } = useAuth();
	const nav = useNavigate();
	const allowed = !!session && roles.includes(session.role);
	(0, import_react.useEffect)(() => {
		if (!ready || allowed) return;
		nav({
			to: session ? ROLE_HOME[session.role] : "/login",
			replace: true
		});
	}, [
		ready,
		allowed,
		session,
		nav
	]);
	if (!ready || !allowed) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid min-h-screen place-items-center bg-background text-sm text-muted-foreground",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "inline-flex items-center gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }), "Checking access…"]
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
var DropdownMenu = DropdownMenu$1;
var DropdownMenuTrigger = DropdownMenuTrigger$1;
var DropdownMenuSubTrigger = import_react.forwardRef(({ className, inset, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuSubTrigger$1, {
	ref,
	className: cn("flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", inset && "pl-8", className),
	...props,
	children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "ml-auto" })]
}));
DropdownMenuSubTrigger.displayName = DropdownMenuSubTrigger$1.displayName;
var DropdownMenuSubContent = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSubContent$1, {
	ref,
	className: cn("z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-dropdown-menu-content-transform-origin)", className),
	...props
}));
DropdownMenuSubContent.displayName = DropdownMenuSubContent$1.displayName;
var DropdownMenuContent = import_react.forwardRef(({ className, sideOffset = 4, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuPortal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuContent$1, {
	ref,
	sideOffset,
	className: cn("z-50 max-h-[var(--radix-dropdown-menu-content-available-height)] min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md", "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-dropdown-menu-content-transform-origin)", className),
	...props
}) }));
DropdownMenuContent.displayName = DropdownMenuContent$1.displayName;
var DropdownMenuItem = import_react.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem$1, {
	ref,
	className: cn("relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0", inset && "pl-8", className),
	...props
}));
DropdownMenuItem.displayName = DropdownMenuItem$1.displayName;
var DropdownMenuCheckboxItem = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuCheckboxItem$1, {
	ref,
	className: cn("relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className),
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItemIndicator, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4" }) })
	}), children]
}));
DropdownMenuCheckboxItem.displayName = DropdownMenuCheckboxItem$1.displayName;
var DropdownMenuRadioItem = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuRadioItem$1, {
	ref,
	className: cn("relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className),
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItemIndicator, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Circle, { className: "h-2 w-2 fill-current" }) })
	}), children]
}));
DropdownMenuRadioItem.displayName = DropdownMenuRadioItem$1.displayName;
var DropdownMenuLabel = import_react.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuLabel$1, {
	ref,
	className: cn("px-2 py-1.5 text-sm font-semibold", inset && "pl-8", className),
	...props
}));
DropdownMenuLabel.displayName = DropdownMenuLabel$1.displayName;
var DropdownMenuSeparator = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSeparator$1, {
	ref,
	className: cn("-mx-1 my-1 h-px bg-muted", className),
	...props
}));
DropdownMenuSeparator.displayName = DropdownMenuSeparator$1.displayName;
var DropdownMenuShortcut = ({ className, ...props }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("ml-auto text-xs tracking-widest opacity-60", className),
		...props
	});
};
DropdownMenuShortcut.displayName = "DropdownMenuShortcut";
var GROUPS = [
	{
		label: "Operations",
		items: [
			{
				to: "/dashboard",
				label: "Dashboard",
				icon: LayoutDashboard
			},
			{
				to: "/map",
				label: "Risk Map",
				icon: Map
			},
			{
				to: "/drains",
				label: "Drains",
				icon: ListOrdered
			},
			{
				to: "/dispatch",
				label: "Dispatch",
				icon: Route
			},
			{
				to: "/tasks",
				label: "Tasks",
				icon: ListChecks
			}
		]
	},
	{
		label: "Field",
		items: [{
			to: "/crew",
			label: "Crew App",
			icon: HardHat
		}, {
			to: "/reports",
			label: "Citizen Reports",
			icon: MessageSquareWarning
		}]
	},
	{
		label: "Analytics",
		items: [
			{
				to: "/tasks",
				label: "Verification",
				icon: ClipboardCheck,
				hash: "verify"
			},
			{
				to: "/verification-lab",
				label: "Test Lab",
				icon: FlaskConical
			},
			{
				to: "/impact",
				label: "Impact",
				icon: ChartColumn
			}
		]
	},
	{
		label: "System",
		items: [{
			to: "/settings",
			label: "Settings",
			icon: Settings
		}]
	}
];
var CREW_NAV = /* @__PURE__ */ new Set(["/crew", "/tasks"]);
function navFor(role) {
	if (role === "OFFICER") return GROUPS;
	return GROUPS.map((g) => ({
		...g,
		items: g.items.filter((n) => role === "CREW" && CREW_NAV.has(n.to) && !n.hash)
	})).filter((g) => g.items.length);
}
function UserMenu() {
	const { session, signOut, provider } = useAuth();
	const nav = useNavigate();
	if (!session) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuTrigger, {
		className: "inline-flex items-center gap-1.5 rounded-md border bg-card px-2 py-1 text-xs font-medium transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
		"aria-label": "Account menu",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserRound, {
			className: "h-3.5 w-3.5 text-muted-foreground",
			"aria-hidden": true
		}), ROLE_LABEL[session.role]]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuContent, {
		align: "end",
		className: "w-56",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuLabel, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-sm",
				children: session.name
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-xs font-normal text-muted-foreground",
				children: ["Role: ", ROLE_LABEL[session.role]]
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSeparator, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "px-2 py-1.5 text-xs text-muted-foreground",
				children: [
					"Sign-in provider: ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-semibold text-foreground",
						children: provider.label
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
					"Demo Mode — synthetic prototype access"
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSeparator, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
				onSelect: () => {
					signOut();
					nav({
						to: "/login",
						replace: true
					});
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "h-4 w-4" }), "Sign out"]
			})
		]
	})] });
}
function DemoBanner() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		role: "note",
		className: "flex items-center gap-2 border-b border-risk-medium/30 bg-demo px-4 py-1 text-[11px] font-medium text-demo-foreground",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, {
			className: "h-3.5 w-3.5 shrink-0",
			"aria-hidden": true
		}), "Demo Dataset — synthetic prototype data, not real municipal data."]
	});
}
function HeaderStatus() {
	const n = useNala();
	const t = new Date(n.weather.fetchedAt);
	const time = isNaN(t.getTime()) ? "—" : t.toLocaleTimeString("en-GB", {
		hour: "2-digit",
		minute: "2-digit"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-wrap items-center gap-2 text-xs",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "inline-flex items-center gap-1.5 rounded-md border bg-card px-2 py-1 font-medium tabular-nums",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CloudRain, {
						className: "h-3.5 w-3.5 text-info",
						"aria-hidden": true
					}),
					n.forecastMm,
					" mm · 72h"
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "rounded-md border border-risk-medium/40 bg-demo px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-demo-foreground",
				children: "Demo"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "hidden text-muted-foreground sm:inline",
				suppressHydrationWarning: true,
				children: ["Last updated ", time]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "grid h-7 w-7 place-items-center rounded-md border bg-card text-muted-foreground",
				"aria-label": "Notifications",
				title: "Notifications",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "h-3.5 w-3.5" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserMenu, {})
		]
	});
}
function AppShell(props) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RequireRole, {
		roles: props.roles ?? ["OFFICER"],
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, { ...props })
	});
}
function Shell({ title, subtitle, actions, children }) {
	const { session } = useAuth();
	const groups = navFor(session?.role);
	const flat = groups.flatMap((g) => g.items).filter((n) => !n.hash);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-screen bg-background",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
			className: "sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r bg-sidebar text-sidebar-foreground lg:flex",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2.5 px-5 py-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Droplets, {
							className: "h-4 w-4",
							"aria-hidden": true
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-sm font-semibold text-foreground",
						children: "NalaSetu"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[11px] text-muted-foreground",
						children: "Municipal Operations"
					})] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
					className: "flex-1 space-y-5 overflow-y-auto px-3 pb-4",
					children: groups.map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "px-3 pb-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground/80",
						children: g.label
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-0.5",
						children: g.items.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: n.to,
							activeOptions: { exact: true },
							className: "relative flex items-center gap-2.5 rounded-md px-3 py-1.5 text-[13px] transition-colors duration-150 hover:bg-sidebar-accent hover:text-foreground",
							activeProps: n.hash ? {} : { className: "bg-sidebar-accent font-semibold text-foreground before:absolute before:left-0 before:top-1.5 before:bottom-1.5 before:w-0.5 before:rounded-full before:bg-foreground" },
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(n.icon, {
								className: "h-4 w-4",
								"aria-hidden": true
							}), n.label]
						}, n.label))
					})] }, g.label))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "m-3 rounded-lg border border-risk-medium/30 bg-demo px-3 py-2.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[10px] font-bold uppercase tracking-wide text-demo-foreground",
						children: "Demo mode"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[11px] text-demo-foreground/80",
						children: "Synthetic prototype data"
					})]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex min-w-0 flex-1 flex-col",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DemoBanner, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
					className: "flex gap-1 overflow-x-auto border-b bg-card px-2 py-1.5 lg:hidden",
					children: flat.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: n.to,
						className: "flex shrink-0 items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs text-muted-foreground",
						activeProps: { className: "bg-accent font-semibold text-foreground" },
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(n.icon, {
							className: "h-3.5 w-3.5",
							"aria-hidden": true
						}), n.label]
					}, n.label))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "flex flex-wrap items-center justify-between gap-3 border-b bg-card px-4 py-3 md:px-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-base font-semibold tracking-tight",
						children: title
					}), subtitle && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: subtitle
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeaderStatus, {})]
				}),
				actions && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-wrap gap-2 border-b bg-card px-4 py-2 md:px-6",
					children: actions
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
					className: "flex-1 p-4 md:p-6",
					children
				})
			]
		})]
	});
}
function Panel({ title, right, children, className = "", subtitle }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: `rounded-xl border bg-card shadow-card ${className}`,
		children: [title && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-start justify-between gap-2 border-b px-4 py-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-sm font-semibold",
				children: title
			}), subtitle && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-0.5 text-xs text-muted-foreground",
				children: subtitle
			})] }), right]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "p-4",
			children
		})]
	});
}
function Kpi({ label, value, hint, tone }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl border bg-card px-4 py-3 shadow-card",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-[11px] font-medium uppercase tracking-wide text-muted-foreground",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: `mt-1 text-2xl font-semibold tabular-nums ${tone === "high" ? "text-risk-high" : tone === "ok" ? "text-risk-low" : ""}`,
				children: value
			}),
			hint && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-0.5 text-xs text-muted-foreground",
				children: hint
			})
		]
	});
}
//#endregion
export { RequireRole as a, Panel as i, DemoBanner as n, UserMenu as o, Kpi as r, AppShell as t };
