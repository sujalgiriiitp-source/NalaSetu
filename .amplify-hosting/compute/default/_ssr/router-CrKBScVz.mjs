import { o as __toESM } from "../_runtime.mjs";
import { _ as createFileRoute, d as Scripts, f as HeadContent, g as lazyRouteComponent, h as Outlet, m as createRouter, q as redirect, v as createRootRouteWithContext, x as useRouter, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { L as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as AuthProvider } from "./utils-P7bOhUvR.mjs";
import { t as Button } from "./button-BP29gmjJ.mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
import { t as NalaProvider } from "./store-DM6PPzvT.mjs";
import { N as LayoutDashboard, b as RotateCcw, f as TriangleAlert, x as RefreshCw } from "../_libs/lucide-react.mjs";
import { t as Route } from "./map-DBDWqfEo.mjs";
import { t as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-CrKBScVz.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function RecoveryScreen({ error, onRetry }) {
	const msg = error instanceof Error ? error.message : typeof error === "string" ? error : "";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background p-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			role: "alert",
			className: "w-full max-w-md rounded-md border bg-card p-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 text-st-review",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-5 w-5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-lg font-bold",
						children: "This screen hit a problem"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Your plans, tasks and photos are still saved in this browser. Try again, or go back to the dashboard."
				}),
				msg && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
					className: "mt-3 max-h-32 overflow-auto rounded bg-muted p-2 text-xs text-muted-foreground",
					children: msg
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 flex flex-wrap gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							onClick: () => onRetry ? onRetry() : window.location.reload(),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-4 w-4" }), "Try again"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							onClick: () => {
								window.location.href = "/dashboard";
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LayoutDashboard, { className: "h-4 w-4" }), "Dashboard"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "ghost",
							onClick: () => {
								if (confirm("Clear all demo data in this browser?")) {
									localStorage.removeItem("nalasetu.demo.v1");
									window.location.href = "/dashboard";
								}
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "h-4 w-4" }), "Reset demo data"]
						})
					]
				})
			]
		})
	});
}
/** Catches render errors anywhere below (including the data provider) so the app never blanks. */
var AppErrorBoundary = class extends import_react.Component {
	state = { error: null };
	static getDerivedStateFromError(error) {
		return { error };
	}
	componentDidCatch(error, info) {
		console.error("App error boundary", error, info.componentStack);
	}
	render() {
		if (this.state.error) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RecoveryScreen, {
			error: this.state.error,
			onRetry: () => this.setState({ error: null })
		});
		return this.props.children;
	}
};
var Toaster$1 = ({ ...props }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
		className: "toaster group",
		toastOptions: { classNames: {
			toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
			description: "group-[.toast]:text-muted-foreground",
			actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
			cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
		} },
		...props
	});
};
var styles_default = "/assets/styles-Dib0DNRl.css";
function reportLovableError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__lovableEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
	const message = error instanceof Response ? `Response ${error.status}${error.url ? ` at ${error.url}` : ""}` : error instanceof Error ? error.message : String(error);
	const stack = error instanceof Error ? error.stack : void 0;
	window.__lovableReportRuntimeError?.({
		message,
		...stack !== void 0 && { stack },
		filename: window.location.pathname
	});
}
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Page not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/login",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Go home"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		console.error(error);
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RecoveryScreen, {
		error,
		onRetry: () => {
			router.invalidate();
			reset();
		}
	});
}
var Route$14 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "NalaSetu — Pre-rain drain cleaning operations" },
			{
				name: "description",
				content: "Predict, prioritize and verify drain cleaning before heavy rain. Demo prototype."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			}
		],
		links: [
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
			},
			{
				rel: "icon",
				href: "/favicon.ico",
				type: "image/x-icon"
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$14.useRouteContext();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientProvider, {
		client: queryClient,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppErrorBoundary, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(NalaProvider, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppErrorBoundary, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster$1, {
			richColors: true,
			position: "top-right"
		})] }) }) })
	});
}
var Route$13 = createFileRoute("/")({
	head: () => ({ meta: [
		{ title: "NalaSetu — Municipal drain operations" },
		{
			name: "description",
			content: "Prioritize, dispatch and verify pre-rain municipal drain cleaning."
		},
		{
			property: "og:title",
			content: "NalaSetu — Municipal drain operations"
		},
		{
			property: "og:description",
			content: "Plan and verify municipal drain cleaning before rainfall."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	beforeLoad: () => {
		throw redirect({ to: "/login" });
	}
});
var $$splitComponentImporter$10 = () => import("./crew-uRZb2MFi.mjs");
var Route$12 = createFileRoute("/crew")({
	head: () => ({ meta: [
		{ title: "Crew App — NalaSetu" },
		{
			name: "description",
			content: "Mobile task list for drain cleaning crews with before/after photo proof."
		},
		{
			property: "og:title",
			content: "Crew App — NalaSetu"
		},
		{
			property: "og:description",
			content: "Crew task list with before/after photo proof."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$10, "component")
});
var $$splitComponentImporter$9 = () => import("./dashboard-BqKVCVr6.mjs");
var Route$11 = createFileRoute("/dashboard")({
	head: () => ({ meta: [
		{ title: "Dashboard — NalaSetu" },
		{
			name: "description",
			content: "Rainfall forecast, drain risk and pre-rain cleaning status for the demo ward."
		},
		{
			property: "og:title",
			content: "Dashboard — NalaSetu"
		},
		{
			property: "og:description",
			content: "Rainfall forecast, drain risk and pre-rain cleaning status."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
var $$splitComponentImporter$8 = () => import("./dispatch-vAaf7BJv.mjs");
var Route$10 = createFileRoute("/dispatch")({
	head: () => ({ meta: [
		{ title: "Dispatch — NalaSetu" },
		{
			name: "description",
			content: "Generate an optimized pre-rain cleaning plan within crew-hour limits and dispatch crews."
		},
		{
			property: "og:title",
			content: "Dispatch — NalaSetu"
		},
		{
			property: "og:description",
			content: "Optimized pre-rain cleaning plan and crew dispatch."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
var $$splitComponentImporter$7 = () => import("./drains-BKWhlEMM.mjs");
var Route$9 = createFileRoute("/drains")({
	head: () => ({ meta: [
		{ title: "Drains — NalaSetu" },
		{
			name: "description",
			content: "Sortable table of all demo drain segments with risk scores and status."
		},
		{
			property: "og:title",
			content: "Drains — NalaSetu"
		},
		{
			property: "og:description",
			content: "All drain segments with risk scores and status."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
var $$splitComponentImporter$6 = () => import("./impact-YNHNJlEB.mjs");
var Route$8 = createFileRoute("/impact")({
	head: () => ({ meta: [
		{ title: "Impact — NalaSetu" },
		{
			name: "description",
			content: "Projected waterlogging exposure reduction and estimated crew effort from verified cleaning."
		},
		{
			property: "og:title",
			content: "Impact — NalaSetu"
		},
		{
			property: "og:description",
			content: "Projected impact of verified drain cleaning."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
var $$splitComponentImporter$5 = () => import("./login-AhCIMR-e.mjs");
var Route$7 = createFileRoute("/login")({
	head: () => ({ meta: [
		{ title: "Sign in — NalaSetu Municipal Operations" },
		{
			name: "description",
			content: "Sign in to NalaSetu to predict drain risk, plan pre-rain cleaning and verify field work."
		},
		{
			property: "og:title",
			content: "Sign in — NalaSetu Municipal Operations"
		},
		{
			property: "og:description",
			content: "Municipal drain operations platform: predict risk, prioritize cleaning, verify field work."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
var $$splitComponentImporter$4 = () => import("./reports-Dhij5c_N.mjs");
var Route$6 = createFileRoute("/reports")({
	head: () => ({ meta: [
		{ title: "Citizen Reports — NalaSetu" },
		{
			name: "description",
			content: "Log citizen drain complaints that feed directly into risk scores."
		},
		{
			property: "og:title",
			content: "Citizen Reports — NalaSetu"
		},
		{
			property: "og:description",
			content: "Citizen drain complaints feeding into risk scoring."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
var $$splitComponentImporter$3 = () => import("./settings-DJT9BLEq.mjs");
var Route$5 = createFileRoute("/settings")({
	head: () => ({ meta: [
		{ title: "Settings — NalaSetu" },
		{
			name: "description",
			content: "Demo scenario, weather source, AI provider and integration status."
		},
		{
			property: "og:title",
			content: "Settings — NalaSetu"
		},
		{
			property: "og:description",
			content: "Demo scenario and integration settings."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import("./tasks-Ds0K29a3.mjs");
var Route$4 = createFileRoute("/tasks")({
	head: () => ({ meta: [
		{ title: "Verification & Tasks — NalaSetu" },
		{
			name: "description",
			content: "Review before/after cleaning proof, AI verdicts and audit history."
		},
		{
			property: "og:title",
			content: "Verification & Tasks — NalaSetu"
		},
		{
			property: "og:description",
			content: "Human review of cleaning proof with audit trail."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("./verification-lab-CAkM0RBz.mjs");
var Route$3 = createFileRoute("/verification-lab")({
	head: () => ({ meta: [
		{ title: "Verification Test Lab — NalaSetu" },
		{
			name: "description",
			content: "Repeatable before/after photo scenarios to check AI confidence, location matching and review flags."
		},
		{
			property: "og:title",
			content: "Verification Test Lab — NalaSetu"
		},
		{
			property: "og:description",
			content: "Repeatable checks for AI proof verification."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var cache = null;
var Route$2 = createFileRoute("/api/weather")({ server: { handlers: { GET: async () => {
	try {
		const r = await fetch("https://api.open-meteo.com/v1/forecast?latitude=28.63&longitude=77.22&hourly=precipitation&forecast_days=3&timezone=Asia%2FKolkata", { signal: AbortSignal.timeout(6e3) });
		if (!r.ok) throw new Error(`HTTP ${r.status}`);
		const j = await r.json();
		const hourly = j.hourly.time.slice(0, 72).map((t, i) => ({
			time: t,
			mm: j.hourly.precipitation[i] ?? 0
		}));
		cache = {
			forecastMm72h: +hourly.reduce((a, h) => a + h.mm, 0).toFixed(1),
			hourly,
			fetchedAt: (/* @__PURE__ */ new Date()).toISOString()
		};
		return Response.json({
			...cache,
			source: "live"
		});
	} catch {
		if (cache) return Response.json({
			...cache,
			source: "cached"
		});
		return Response.json({
			forecastMm72h: 55,
			hourly: [],
			fetchedAt: (/* @__PURE__ */ new Date()).toISOString(),
			source: "demo"
		});
	}
} } } });
var $$splitComponentImporter = () => import("./citizen.report-D5mYAipQ.mjs");
var Route$1 = createFileRoute("/citizen/report")({
	head: () => ({ meta: [
		{ title: "Report a drain problem — NalaSetu" },
		{
			name: "description",
			content: "Tell your municipality about a blocked, overflowing or garbage-filled drain in four quick steps."
		},
		{
			property: "og:title",
			content: "Report a drain problem — NalaSetu"
		},
		{
			property: "og:description",
			content: "Report blocked or overflowing drains in four quick steps."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var rootRouteChildren = {
	IndexRoute: Route$13.update({
		id: "/",
		path: "/",
		getParentRoute: () => Route$14
	}),
	CrewRoute: Route$12.update({
		id: "/crew",
		path: "/crew",
		getParentRoute: () => Route$14
	}),
	DashboardRoute: Route$11.update({
		id: "/dashboard",
		path: "/dashboard",
		getParentRoute: () => Route$14
	}),
	DispatchRoute: Route$10.update({
		id: "/dispatch",
		path: "/dispatch",
		getParentRoute: () => Route$14
	}),
	DrainsRoute: Route$9.update({
		id: "/drains",
		path: "/drains",
		getParentRoute: () => Route$14
	}),
	ImpactRoute: Route$8.update({
		id: "/impact",
		path: "/impact",
		getParentRoute: () => Route$14
	}),
	LoginRoute: Route$7.update({
		id: "/login",
		path: "/login",
		getParentRoute: () => Route$14
	}),
	MapRoute: Route.update({
		id: "/map",
		path: "/map",
		getParentRoute: () => Route$14
	}),
	ReportsRoute: Route$6.update({
		id: "/reports",
		path: "/reports",
		getParentRoute: () => Route$14
	}),
	SettingsRoute: Route$5.update({
		id: "/settings",
		path: "/settings",
		getParentRoute: () => Route$14
	}),
	TasksRoute: Route$4.update({
		id: "/tasks",
		path: "/tasks",
		getParentRoute: () => Route$14
	}),
	VerificationLabRoute: Route$3.update({
		id: "/verification-lab",
		path: "/verification-lab",
		getParentRoute: () => Route$14
	}),
	ApiWeatherRoute: Route$2.update({
		id: "/api/weather",
		path: "/api/weather",
		getParentRoute: () => Route$14
	}),
	CitizenReportRoute: Route$1.update({
		id: "/citizen/report",
		path: "/citizen/report",
		getParentRoute: () => Route$14
	})
};
var routeTree = Route$14._addFileChildren(rootRouteChildren)._addFileTypes();
var getRouter = () => {
	const queryClient = new QueryClient();
	return createRouter({
		routeTree,
		context: { queryClient },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0,
		defaultErrorComponent: ({ error, reset }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RecoveryScreen, {
			error,
			onRetry: reset
		})
	});
};
//#endregion
export { getRouter };
