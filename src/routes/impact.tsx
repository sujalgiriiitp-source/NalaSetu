import { createFileRoute } from "@tanstack/react-router";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { AppShell, Kpi, Panel } from "@/components/nala/AppShell";
import { Tag } from "@/components/nala/badges";
import { useNala } from "@/lib/nalasetu/store";
import { impactStats } from "@/lib/nalasetu/impact";
import { fmtMin } from "@/lib/nalasetu/dispatch";

export const Route = createFileRoute("/impact")({
  head: () => ({ meta: [
    { title: "Impact — NalaSetu" },
    { name: "description", content: "Projected waterlogging exposure reduction and estimated crew effort from verified cleaning." },
    { property: "og:title", content: "Impact — NalaSetu" },
    { property: "og:description", content: "Projected impact of verified drain cleaning." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: ImpactPage,
});

function ImpactPage() {
  const n = useNala();
  const s = impactStats(n.drains);
  const km = n.plan?.crews.reduce((a, c) => a + c.distanceKm, 0) ?? 0;
  const data = (["HIGH", "MEDIUM", "LOW"] as const).map((b) => ({ band: b, total: n.drains.filter((d) => d.riskBand === b).length, verified: n.drains.filter((d) => d.riskBand === b && d.status === "VERIFIED").length }));
  return (
    <AppShell title="Impact" subtitle="All figures are PROJECTED or ESTIMATED — not measured real-world impact.">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3 xl:grid-cols-5">
          <Kpi label="Completed" value={`${s.completed} / ${s.total}`} hint="human verified / dispatched" />
          <Kpi label="High-risk coverage" value={`${s.highCoveragePct}%`} hint={`${s.highDone} / ${s.highTotal} HIGH · ESTIMATED`} />
          <Kpi label="Crew-hours used" value={fmtMin(s.crewMinutes)} hint="cleaning time · ESTIMATED" />
          <Kpi label="Est. travel" value={`${km.toFixed(1)} km`} hint="planned route · ESTIMATED" />
          <Kpi label="Projected impact" value={`${s.exposurePct}%`} tone="ok" hint="exposure reduction · PROJECTED" />
        </div>
        <Panel title="Projected exposure reduction — formula" right={<Tag tone="demo">Projected</Tag>}>
          <p className="font-mono text-sm">Σ population weight (cleaned HIGH drains) ÷ Σ population weight (all HIGH drains) × 100</p>
          <p className="mt-2 text-xs text-muted-foreground">Returns 0 when there are no HIGH drains. Population weights are synthetic.</p>
        </Panel>
        <Panel title="Verified vs total by risk band" subtitle="Compared against all monitored drain segments">
          <div className="h-72" role="img" aria-label="Bar chart comparing total drains and human-verified drains by risk band">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="band" fontSize={12} />
                <YAxis allowDecimals={false} fontSize={12} width={36} />
                <Tooltip />
                <Legend />
                <Bar dataKey="total" name="Total drains" fill="var(--st-muted)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="verified" name="Human verified" fill="var(--risk-low)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>
    </AppShell>
  );
}
