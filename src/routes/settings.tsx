import { createFileRoute } from "@tanstack/react-router";
import { RefreshCw, RotateCcw, Wifi, WifiOff, Loader2, Database, CheckCircle2, AlertCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { AppShell, Panel } from "@/components/nala/AppShell";
import { SourceBadge, Tag } from "@/components/nala/badges";
import { useNala } from "@/lib/nalasetu/store";
import { WEIGHTS } from "@/lib/nalasetu/risk";
import { seedDemoDrains } from "@/lib/nalasetu/seed-drains.server";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [
    { title: "Settings — NalaSetu" },
    { name: "description", content: "Demo scenario, weather source, AI provider and integration status." },
    { property: "og:title", content: "Settings — NalaSetu" },
    { property: "og:description", content: "Demo scenario and integration settings." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: SettingsPage,
});

function SettingsPage() {
  const n = useNala();
  const [seeding, setSeeding] = useState(false);
  const Opt = ({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) => <Button size="sm" variant={on ? "default" : "outline"} onClick={onClick}>{children}</Button>;

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

  const awsStatusConfig = {
    idle: { icon: Wifi, label: "Idle", tone: "text-muted-foreground" },
    checking: { icon: Loader2, label: "Checking…", tone: "text-info animate-spin" },
    connected: { icon: CheckCircle2, label: "Connected", tone: "text-risk-low" },
    error: { icon: AlertCircle, label: "Unreachable", tone: "text-risk-high" },
    unconfigured: { icon: WifiOff, label: "Not configured", tone: "text-muted-foreground" },
  } as const;
  const awsCfg = awsStatusConfig[n.awsStatus];
  const AwsIcon = awsCfg.icon;

  return (
    <AppShell title="Settings">
      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="Demo scenario" right={<Tag tone="demo">Demo</Tag>}>
          <div className="flex gap-2"><Opt on={n.scenario === "heavy"} onClick={() => n.setScenario("heavy")}>Heavy Rain · 55mm</Opt><Opt on={n.scenario === "light"} onClick={() => n.setScenario("light")}>Light Rain · 18mm</Opt></div>
          <p className="mt-2 text-xs text-muted-foreground">Risk scores recalculate immediately. Applies when weather source is Demo.</p>
        </Panel>
        <Panel title="Weather source" right={<SourceBadge source={n.weather.source} />}>
          <div className="flex flex-wrap gap-2">
            <Opt on={n.weatherMode === "demo"} onClick={() => n.setWeatherMode("demo")}>Demo</Opt>
            <Opt on={n.weatherMode === "live"} onClick={() => n.setWeatherMode("live")}>Live (Open-Meteo)</Opt>
            {n.weatherMode === "live" && <Button size="sm" variant="ghost" onClick={n.refreshWeather}><RefreshCw className="h-4 w-4" />Refresh</Button>}
          </div>
          <p className="mt-2 text-xs text-muted-foreground">Live failures fall back to Cached, then Demo — always labelled. Current: {n.forecastMm} mm / 72h.</p>
        </Panel>
        <Panel title="AI provider">
          <div className="flex gap-2"><Opt on onClick={() => {}}>Lovable AI</Opt><Button size="sm" variant="outline" disabled>Bedrock (not configured)</Button></div>
          <p className="mt-2 text-xs text-muted-foreground">Photos are assessed by an AI model for same location and reduced obstruction. Confidence &lt; 70, any red flag, or AI unavailable → Needs Review. Officers always make the final call.</p>
        </Panel>
        <Panel title="AWS status">
          <div className="flex items-center gap-2 mb-3">
            <AwsIcon className={`h-4 w-4 ${awsCfg.tone}`} />
            <span className="text-sm font-medium">{awsCfg.label}</span>
            {n.awsMode && (
              <Tag tone={n.awsStatus === "connected" ? "ok" : "demo"}>
                {n.awsMode ? "AWS API Gateway" : "Demo fallback"}
              </Tag>
            )}
          </div>
          <ul className="space-y-1.5 text-sm mb-3">
            {(["DynamoDB (NalaSetu table)", "Lambda (nalasetu-api)", "API Gateway (us-east-1)"] as const).map((s) => (
              <li key={s} className="flex justify-between">
                <span>{s}</span>
                {n.awsStatus === "connected"
                  ? <Tag tone="ok">Live</Tag>
                  : n.awsStatus === "unconfigured"
                  ? <Tag tone="demo">Demo fallback</Tag>
                  : n.awsStatus === "checking"
                  ? <Tag>Checking…</Tag>
                  : <Tag tone="demo">Demo fallback</Tag>}
              </li>
            ))}
          </ul>
          {n.awsMode && (
            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant="outline" onClick={handleSeedDrains} disabled={seeding}>
                {seeding ? <Loader2 className="h-4 w-4 animate-spin" /> : <Database className="h-4 w-4" />}
                {seeding ? "Seeding…" : "Seed Demo Data → DynamoDB"}
              </Button>
            </div>
          )}
          {!n.awsMode && (
            <p className="text-xs text-muted-foreground">Set <code className="font-mono">VITE_NALASETU_API_URL</code> to enable AWS backend. Demo mode remains fully functional.</p>
          )}
        </Panel>
        <Panel title="Risk weights" right={<Tag>Read-only</Tag>}>
          <ul className="space-y-1.5 text-sm">{([["Rainfall", WEIGHTS.R], ["History", WEIGHTS.H], ["Terrain", WEIGHTS.S], ["Citizen", WEIGHTS.C]] as const).map(([k, v]) => <li key={k} className="flex justify-between"><span>{k}</span><span className="font-semibold tabular-nums">{v * 100}%</span></li>)}</ul>
        </Panel>
        <Panel title="Demo data">
          <Button variant="outline" onClick={n.resetDemo}><RotateCcw className="h-4 w-4" />Reset demo data</Button>
          <p className="mt-2 text-xs text-muted-foreground">Clears plans, tasks, photos, reports and audit log stored in this browser. Map tiles © OpenStreetMap contributors.</p>
        </Panel>
      </div>
    </AppShell>
  );
}
