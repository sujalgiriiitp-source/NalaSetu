import { o as __toESM } from "../_runtime.mjs";
import { l as createServerFn } from "./createServerFn-DDDJMFWM.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { L as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as Button } from "./button-BP29gmjJ.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { i as createSsrRpc, r as WEIGHTS, u as useNala } from "./store-DM6PPzvT.mjs";
import { A as LoaderCircle, G as Database, Q as CircleAlert, Z as CircleCheck, a as Wifi, b as RotateCcw, o as WifiOff, x as RefreshCw } from "../_libs/lucide-react.mjs";
import { i as Panel, t as AppShell } from "./AppShell-DhLdAZ0I.mjs";
import { i as Tag, n as SourceBadge } from "./badges-CBrcW0l3.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/settings-DJT9BLEq.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/**
* POST /api/nalasetu/seed-drains
*
* Server-only route (TanStack Start server function) that seeds the 40
* synthetic demo drain records into AWS DynamoDB through the Lambda API.
* Never runs in the browser — credentials (if any) stay server-side.
*
* The Lambda endpoint POST /api/drains/seed is expected to accept:
*   { drains: DrainBase[] }
* and respond with:
*   { seeded: number, skipped?: number }
*
* Security:
*   - The AWS API Gateway URL is read from NALASETU_API_URL (server env)
*     OR VITE_NALASETU_API_URL (shared). No secret keys are used here.
*   - Lambda itself uses its execution role for DynamoDB access.
*/
/**
* Seed the 40 synthetic NalaSetu demo drains into DynamoDB.
* Can be called once during first deploy or reset.
*/
var seedDemoDrains = createServerFn({ method: "POST" }).handler(createSsrRpc("a9ec5dbf513f02f0a3f7113dfb5d883dc59fe8b28ead9ed8527d5a7131427701"));
function SettingsPage() {
	const n = useNala();
	const [seeding, setSeeding] = (0, import_react.useState)(false);
	const Opt = ({ on, onClick, children }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
		size: "sm",
		variant: on ? "default" : "outline",
		onClick,
		children
	});
	const handleSeedDrains = async () => {
		setSeeding(true);
		try {
			const res = await seedDemoDrains();
			if (res.ok) toast.success(`Seeded ${res.seeded} demo drain records into DynamoDB.`);
			else toast.error(`Seed failed: ${res.error}`);
		} catch (e) {
			toast.error(`Seed failed: ${e instanceof Error ? e.message : String(e)}`);
		} finally {
			setSeeding(false);
		}
	};
	const awsCfg = {
		idle: {
			icon: Wifi,
			label: "Idle",
			tone: "text-muted-foreground"
		},
		checking: {
			icon: LoaderCircle,
			label: "Checking…",
			tone: "text-info animate-spin"
		},
		connected: {
			icon: CircleCheck,
			label: "Connected",
			tone: "text-risk-low"
		},
		error: {
			icon: CircleAlert,
			label: "Unreachable",
			tone: "text-risk-high"
		},
		unconfigured: {
			icon: WifiOff,
			label: "Not configured",
			tone: "text-muted-foreground"
		}
	}[n.awsStatus];
	const AwsIcon = awsCfg.icon;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		title: "Settings",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-4 lg:grid-cols-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
					title: "Demo scenario",
					right: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
						tone: "demo",
						children: "Demo"
					}),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Opt, {
							on: n.scenario === "heavy",
							onClick: () => n.setScenario("heavy"),
							children: "Heavy Rain · 55mm"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Opt, {
							on: n.scenario === "light",
							onClick: () => n.setScenario("light"),
							children: "Light Rain · 18mm"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-xs text-muted-foreground",
						children: "Risk scores recalculate immediately. Applies when weather source is Demo."
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
					title: "Weather source",
					right: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SourceBadge, { source: n.weather.source }),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Opt, {
								on: n.weatherMode === "demo",
								onClick: () => n.setWeatherMode("demo"),
								children: "Demo"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Opt, {
								on: n.weatherMode === "live",
								onClick: () => n.setWeatherMode("live"),
								children: "Live (Open-Meteo)"
							}),
							n.weatherMode === "live" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "sm",
								variant: "ghost",
								onClick: n.refreshWeather,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-4 w-4" }), "Refresh"]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 text-xs text-muted-foreground",
						children: [
							"Live failures fall back to Cached, then Demo — always labelled. Current: ",
							n.forecastMm,
							" mm / 72h."
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
					title: "AI provider",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Opt, {
							on: true,
							onClick: () => {},
							children: "Lovable AI"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "outline",
							disabled: true,
							children: "Bedrock (not configured)"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-xs text-muted-foreground",
						children: "Photos are assessed by an AI model for same location and reduced obstruction. Confidence < 70, any red flag, or AI unavailable → Needs Review. Officers always make the final call."
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
					title: "AWS status",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 mb-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AwsIcon, { className: `h-4 w-4 ${awsCfg.tone}` }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-sm font-medium",
									children: awsCfg.label
								}),
								n.awsMode && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
									tone: n.awsStatus === "connected" ? "ok" : "demo",
									children: n.awsMode ? "AWS API Gateway" : "Demo fallback"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "space-y-1.5 text-sm mb-3",
							children: [
								"DynamoDB (NalaSetu table)",
								"Lambda (nalasetu-api)",
								"API Gateway (us-east-1)"
							].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: s }), n.awsStatus === "connected" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
									tone: "ok",
									children: "Live"
								}) : n.awsStatus === "unconfigured" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
									tone: "demo",
									children: "Demo fallback"
								}) : n.awsStatus === "checking" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, { children: "Checking…" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
									tone: "demo",
									children: "Demo fallback"
								})]
							}, s))
						}),
						n.awsMode && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-wrap gap-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "sm",
								variant: "outline",
								onClick: handleSeedDrains,
								disabled: seeding,
								children: [seeding ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Database, { className: "h-4 w-4" }), seeding ? "Seeding…" : "Seed Demo Data → DynamoDB"]
							})
						}),
						!n.awsMode && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-muted-foreground",
							children: [
								"Set ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
									className: "font-mono",
									children: "VITE_NALASETU_API_URL"
								}),
								" to enable AWS backend. Demo mode remains fully functional."
							]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
					title: "Risk weights",
					right: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, { children: "Read-only" }),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "space-y-1.5 text-sm",
						children: [
							["Rainfall", WEIGHTS.R],
							["History", WEIGHTS.H],
							["Terrain", WEIGHTS.S],
							["Citizen", WEIGHTS.C]
						].map(([k, v]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: k }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-semibold tabular-nums",
								children: [v * 100, "%"]
							})]
						}, k))
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
					title: "Demo data",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						onClick: n.resetDemo,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "h-4 w-4" }), "Reset demo data"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-xs text-muted-foreground",
						children: "Clears plans, tasks, photos, reports and audit log stored in this browser. Map tiles © OpenStreetMap contributors."
					})]
				})
			]
		})
	});
}
//#endregion
export { SettingsPage as component };
