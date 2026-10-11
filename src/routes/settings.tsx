import { createFileRoute } from "@tanstack/react-router";
import {
  RefreshCw,
  RotateCcw,
  Loader2,
  Database,
  Cloud,
  Boxes,
  BrainCircuit,
  BellRing,
  Activity,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { AppShell, Panel } from "@/components/nala/AppShell";
import { SourceBadge, Tag } from "@/components/nala/badges";
import { useNala } from "@/lib/nalasetu/store";
import {
  getIntegrationHealth,
  type IntegrationHealthResponse,
  type IntegrationStatus,
} from "@/lib/nalasetu/aws-api";
import { WEIGHTS } from "@/lib/nalasetu/risk";
import { seedDemoDrains } from "@/lib/nalasetu/seed-drains.server";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — NalaSetu" },
      {
        name: "description",
        content: "Demo scenario, weather source, AI provider and integration status.",
      },
      { property: "og:title", content: "Settings — NalaSetu" },
      { property: "og:description", content: "Demo scenario and integration settings." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const n = useNala();
  const [seeding, setSeeding] = useState(false);
  const [integrationHealth, setIntegrationHealth] = useState<IntegrationHealthResponse | null>(null);
  const [healthCheckError, setHealthCheckError] = useState<string | null>(null);
  const [checkingHealth, setCheckingHealth] = useState(false);
  const refreshHealth = useCallback(async () => {
    setCheckingHealth(true);
    setHealthCheckError(null);
    try {
      const [result] = await Promise.all([getIntegrationHealth(), n.refreshAwsConnection()]);
      if (result.ok) setIntegrationHealth(result.data);
      else setHealthCheckError(result.error);
    } catch (error) {
      setHealthCheckError(error instanceof Error ? error.message : String(error));
    } finally {
      setCheckingHealth(false);
    }
  }, [n.refreshAwsConnection]);
  useEffect(() => {
    void refreshHealth();
  }, [refreshHealth]);
  const Opt = ({
    on,
    onClick,
    children,
  }: {
    on: boolean;
    onClick: () => void;
    children: React.ReactNode;
  }) => (
    <Button size="sm" variant={on ? "default" : "outline"} onClick={onClick}>
      {children}
    </Button>
  );

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

  const bedrockStatus = n.bedrockVerification.status;
  const statusText = (status: IntegrationStatus | "CHECKING") =>
    status === "CHECKING" ? "CHECKING" : status.replaceAll("_", " ");
  const serviceCheck = (
    service: keyof IntegrationHealthResponse["services"],
  ): { status: IntegrationStatus | "CHECKING"; message: string } => {
    if (service === "bedrock") {
      return {
        status: n.bedrockVerification.status,
        message: n.bedrockVerification.message,
      };
    }
    if (checkingHealth) return { status: "CHECKING", message: "Check is running." };
    if (n.awsStatus === "connected" && service === "apiGateway") {
      return {
        status: "CONNECTED",
        message: "GET /api/drains succeeded through the configured API Gateway endpoint.",
      };
    }
    if (n.awsStatus === "connected" && service === "lambda") {
      return {
        status: "CONNECTED",
        message: "The nalasetu-api Lambda returned the drain-list response.",
      };
    }
    if (n.awsStatus === "connected" && service === "dynamodb") {
      return {
        status: "CONNECTED",
        message: n.awsDrainSource === "dynamodb"
          ? "Drain records were retrieved from the configured DynamoDB table."
          : "DynamoDB query succeeded; no stored drains were returned, so labelled demo data is shown.",
      };
    }
    if (healthCheckError) return { status: "NOT_VERIFIED", message: healthCheckError };
    return integrationHealth?.services[service] ?? {
      status: "NOT_VERIFIED",
      message: "No successful backend health check has been recorded.",
    };
  };

  return (
    <AppShell title="Settings">
      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="Demo scenario" right={<Tag tone="demo">Demo</Tag>}>
          <div className="flex gap-2">
            <Opt on={n.scenario === "heavy"} onClick={() => n.setScenario("heavy")}>
              Heavy Rain · 55mm
            </Opt>
            <Opt on={n.scenario === "light"} onClick={() => n.setScenario("light")}>
              Light Rain · 18mm
            </Opt>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Risk scores recalculate immediately. Applies when weather source is Demo.
          </p>
        </Panel>
        <Panel title="Weather source" right={<SourceBadge source={n.weather.source} />}>
          <div className="flex flex-wrap gap-2">
            <Opt on={n.weatherMode === "demo"} onClick={() => n.setWeatherMode("demo")}>
              Demo
            </Opt>
            <Opt on={n.weatherMode === "live"} onClick={() => n.setWeatherMode("live")}>
              Live (Open-Meteo)
            </Opt>
            {n.weatherMode === "live" && (
              <Button size="sm" variant="ghost" onClick={n.refreshWeather}>
                <RefreshCw className="h-4 w-4" />
                Refresh
              </Button>
            )}
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Live failures fall back to Cached, then Demo — always labelled. Current: {n.forecastMm}{" "}
            mm / 72h.
          </p>
        </Panel>
        <Panel title="AI provider">
          <div className="flex gap-2 items-center">
            <Button size="sm" variant="outline" disabled>
              Amazon Bedrock — Nova Lite
            </Button>
            <Tag
              tone={bedrockStatus === "CONNECTED" ? "ok" : "muted"}
            >
              {statusText(bedrockStatus)}
            </Tag>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            {n.bedrockVerification.message}
            {n.bedrockVerification.checkedAt
              ? ` Checked ${new Date(n.bedrockVerification.checkedAt).toLocaleString()}.`
              : ""}{" "}
            Officers make the final call.
          </p>
        </Panel>
        <Panel
          title="AWS infrastructure health"
          subtitle="Read-only backend checks; unavailable checks remain unverified"
          right={
            <Button
              size="sm"
              variant="outline"
              onClick={() => void refreshHealth()}
              disabled={checkingHealth}
            >
              {checkingHealth ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              {checkingHealth ? "Checking…" : "Check again"}
            </Button>
          }
        >
          <div className="flex items-center gap-2 mb-3">
            {checkingHealth ? (
              <Loader2 className="h-4 w-4 animate-spin text-info" />
            ) : (
              <Activity className="h-4 w-4 text-muted-foreground" />
            )}
            <span className="text-sm font-medium">
              {checkingHealth ? "CHECKING" : integrationHealth ? "Checks complete" : "NOT VERIFIED"}
            </span>
            {integrationHealth && (
              <span className="text-xs text-muted-foreground">
                Checked {new Date(integrationHealth.checkedAt).toLocaleString()}
              </span>
            )}
          </div>
          <ul className="mb-4 grid gap-2 sm:grid-cols-2">
            {(
              [
                ["API Gateway", "Public API edge", Cloud, "apiGateway"],
                ["Lambda", "nalasetu-api", Activity, "lambda"],
                ["DynamoDB", "NalaSetu table", Boxes, "dynamodb"],
                ["S3", "Proof photo storage", Database, "s3"],
                ["Amazon Bedrock", "Nova Lite verification", BrainCircuit, "bedrock"],
                ["EventBridge", "NalaSetu-weather-Refresh schedule", BellRing, "eventBridge"],
                ["CloudWatch", "nalasetu-api log group", Activity, "cloudWatch"],
              ] as const
            ).map(([s, detail, Icon, service]) => {
              const check = serviceCheck(service);
              const status = checkingHealth && service !== "bedrock" ? "CHECKING" : check.status;
              return (
                <li
                  key={s}
                  className="flex items-start justify-between gap-2 rounded-md border bg-muted/30 px-3 py-2"
                >
                  <span className="flex min-w-0 items-start gap-2">
                    <Icon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-info" />
                    <span className="min-w-0">
                      <span className="block text-xs font-semibold">{s}</span>
                      <span className="block truncate text-[10px] text-muted-foreground">
                        {detail}
                      </span>
                      <span className="mt-1 block text-[10px] text-muted-foreground">
                        {checkingHealth && service !== "bedrock"
                          ? "Running backend check."
                          : check.message}
                      </span>
                    </span>
                  </span>
                  <Tag
                    tone={status === "CONNECTED" ? "ok" : "muted"}
                  >
                    {statusText(status)}
                  </Tag>
                </li>
              );
            })}
          </ul>
          {n.awsMode && (
            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant="outline" onClick={handleSeedDrains} disabled={seeding}>
                {seeding ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Database className="h-4 w-4" />
                )}
                {seeding ? "Seeding…" : "Seed Demo Data → DynamoDB"}
              </Button>
            </div>
          )}
          {!n.awsMode && (
            <p className="text-xs text-muted-foreground">
              Set <code className="font-mono">VITE_NALASETU_API_URL</code> to enable AWS backend.
              Demo mode remains fully functional.
            </p>
          )}
        </Panel>
        <Panel title="Risk weights" right={<Tag>Read-only</Tag>}>
          <ul className="space-y-1.5 text-sm">
            {(
              [
                ["Rainfall", WEIGHTS.R],
                ["History", WEIGHTS.H],
                ["Terrain", WEIGHTS.S],
                ["Citizen", WEIGHTS.C],
              ] as const
            ).map(([k, v]) => (
              <li key={k} className="flex justify-between">
                <span>{k}</span>
                <span className="font-semibold tabular-nums">{v * 100}%</span>
              </li>
            ))}
          </ul>
        </Panel>
        <Panel title="Demo data">
          <Button variant="outline" onClick={n.resetDemo}>
            <RotateCcw className="h-4 w-4" />
            Reset demo data
          </Button>
          <p className="mt-2 text-xs text-muted-foreground">
            Demo drains, locations, crew availability, and citizen-report counts are synthetic
            prototype data, not real municipal records. Live Open-Meteo weather is labelled
            separately by its source. Reset clears plans, tasks, photos, reports, and the audit log
            stored in this browser. Map tiles © OpenStreetMap contributors.
          </p>
        </Panel>
      </div>
    </AppShell>
  );
}
