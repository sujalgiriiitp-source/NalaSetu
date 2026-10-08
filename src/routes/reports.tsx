import { createFileRoute } from "@tanstack/react-router";
import { AppShell, Panel } from "@/components/nala/AppShell";
import { RiskBadge } from "@/components/nala/badges";
import { useNala } from "@/lib/nalasetu/store";
import { CitizenReportForm } from "@/components/nala/CitizenReportForm";

export const Route = createFileRoute("/reports")({
  head: () => ({ meta: [
    { title: "Citizen Reports — NalaSetu" },
    { name: "description", content: "Log citizen drain complaints that feed directly into risk scores." },
    { property: "og:title", content: "Citizen Reports — NalaSetu" },
    { property: "og:description", content: "Citizen drain complaints feeding into risk scoring." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: ReportsPage,
});

function ReportsPage() {
  const n = useNala();
  return (
    <AppShell title="Citizen Reports" subtitle="Each report raises the citizen factor (C) in that drain's risk score.">
      <div className="grid gap-4 lg:grid-cols-[400px_1fr]">
        <Panel title="Report drain problem" subtitle="Simple 4-step form for residents">
          <CitizenReportForm />
        </Panel>
        <Panel title={`Recent reports (${n.reports.length})`} subtitle="Officer view">
          {!n.reports.length ? <p className="py-6 text-center text-sm text-muted-foreground">No reports submitted this session.</p> : (
            <ul className="divide-y text-sm">{n.reports.map((r) => { const d = n.drains.find((x) => x.id === r.drainId)!; return (
              <li key={r.id} className="flex flex-wrap items-center justify-between gap-2 py-2.5"><div><div className="font-medium">{r.issue} · <span className="font-mono text-xs">{d.id}</span> {d.name}</div><div className="text-xs text-muted-foreground"><span className="font-mono">{r.id}</span> · {r.location} · {new Date(r.createdAt).toLocaleString()}</div></div><RiskBadge band={d.riskBand} score={d.riskScore} /></li>); })}</ul>
          )}
        </Panel>
      </div>
    </AppShell>
  );
}
