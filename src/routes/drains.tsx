import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowUpDown, ChevronRight, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AppShell } from "@/components/nala/AppShell";
import { RiskBadge, StatusBadge } from "@/components/nala/badges";
import { DrainSheet } from "@/components/nala/DrainDetail";
import { useNala } from "@/lib/nalasetu/store";
import { STATUS_LABEL } from "@/lib/nalasetu/state-machine";
import type { Drain } from "@/lib/nalasetu/types";

export const Route = createFileRoute("/drains")({
  head: () => ({ meta: [
    { title: "Drains — NalaSetu" },
    { name: "description", content: "Sortable table of all demo drain segments with risk scores and status." },
    { property: "og:title", content: "Drains — NalaSetu" },
    { property: "og:description", content: "All drain segments with risk scores and status." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: DrainsPage,
});

type Key = "id" | "riskScore" | "historicalChokes" | "citizenReports" | "cleaningTimeMin" | "name";

function DrainsPage() {
  const { drains, drainRain } = useNala();
  const [q, setQ] = useState(""); const [risk, setRisk] = useState("ALL"); const [status, setStatus] = useState("ALL");
  const [sort, setSort] = useState<{ k: Key; dir: 1 | -1 }>({ k: "riskScore", dir: -1 });
  const [open, setOpen] = useState<string | null>(null);
  const rows = useMemo(() => drains.filter((d) => (risk === "ALL" || d.riskBand === risk) && (status === "ALL" || d.status === status) && `${d.id} ${d.name}`.toLowerCase().includes(q.toLowerCase()))
    .sort((a, b) => (a[sort.k] > b[sort.k] ? 1 : a[sort.k] < b[sort.k] ? -1 : 0) * sort.dir), [drains, q, risk, status, sort]);
  const H = ({ k, children, right }: { k: Key; children: React.ReactNode; right?: boolean }) => (
    <th className={`px-3 py-2.5 font-medium ${right ? "text-right" : "text-left"}`} aria-sort={sort.k === k ? (sort.dir === 1 ? "ascending" : "descending") : "none"}>
      <button className={`inline-flex items-center gap-1 hover:text-foreground ${sort.k === k ? "text-foreground" : ""}`} onClick={() => setSort((s) => ({ k, dir: s.k === k ? (s.dir === 1 ? -1 : 1) : -1 }))}>{children}<ArrowUpDown className="h-3 w-3 opacity-60" /></button>
    </th>
  );
  const sel = "h-9 rounded-md border bg-card px-2.5 text-sm shadow-card";
  const drain = drains.find((d) => d.id === open) ?? null;
  const counts = { ALL: drains.length, HIGH: drains.filter((d) => d.riskBand === "HIGH").length, MEDIUM: drains.filter((d) => d.riskBand === "MEDIUM").length, LOW: drains.filter((d) => d.riskBand === "LOW").length };
  return (
    <AppShell title="Drains" subtitle={`${drains.length} synthetic drain segments · click a row for details`}>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <div className="relative">
          <Search className="pointer-events-none absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" aria-hidden />
          <Input className="h-9 w-64 pl-8 shadow-card" placeholder="Search name or ID" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search" />
        </div>
        <div className="inline-flex rounded-md border bg-card p-0.5 shadow-card" role="group" aria-label="Risk filter">
          {(["ALL", "HIGH", "MEDIUM", "LOW"] as const).map((b) => (
            <button key={b} aria-pressed={risk === b} onClick={() => setRisk(b)} className={`flex items-center gap-1.5 rounded px-2.5 py-1 text-xs font-medium transition-colors ${risk === b ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>
              {b !== "ALL" && <span className={`h-2 w-2 rounded-full ${b === "HIGH" ? "bg-risk-high" : b === "MEDIUM" ? "bg-risk-medium" : "bg-risk-low"}`} aria-hidden />}
              {b === "ALL" ? "All" : b[0] + b.slice(1).toLowerCase()}<span className="tabular-nums opacity-70">{counts[b]}</span>
            </button>
          ))}
        </div>
        <select className={sel} value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Status"><option value="ALL">All status</option>{Object.entries(STATUS_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select>
        <span className="ml-auto text-xs text-muted-foreground tabular-nums">{rows.length} of {drains.length} shown</span>
      </div>
      <div className="max-h-[calc(100vh-220px)] overflow-auto rounded-xl border bg-card shadow-card">
        <table className="w-full text-sm">
          <thead className="sticky top-0 z-10 border-b bg-muted/95 text-[11px] uppercase tracking-wide text-muted-foreground backdrop-blur"><tr>
            <H k="id">ID</H><H k="name">Drain</H><th className="px-3 text-left font-medium">Risk</th><H k="riskScore" right>Score</H><th className="px-3 text-right font-medium">Rainfall</th><H k="historicalChokes" right>Chokes</H><H k="citizenReports" right>Reports</H><th className="px-3 text-left font-medium">Terrain</th><H k="cleaningTimeMin" right>Clean time</H><th className="px-3 text-left font-medium">Status</th><th className="px-3 text-right font-medium">Action</th>
          </tr></thead>
          <tbody>
            {rows.map((d: Drain) => (
              <tr key={d.id} tabIndex={0} className={`cursor-pointer border-b transition-colors last:border-0 hover:bg-muted/60 focus-visible:bg-muted/60 focus-visible:outline-none ${d.riskBand === "HIGH" ? "shadow-[inset_3px_0_0_var(--risk-high)]" : ""}`} onClick={() => setOpen(d.id)} onKeyDown={(e) => e.key === "Enter" && setOpen(d.id)}>
                <td className="whitespace-nowrap px-3 py-2 font-mono text-xs text-muted-foreground">{d.id}</td><td className="min-w-[200px] px-3 font-medium">{d.name}</td><td className="px-3"><RiskBadge band={d.riskBand} /></td>
                <td className="px-3 text-right"><div className="flex items-center justify-end gap-2"><div className="hidden h-1.5 w-12 rounded-full bg-muted md:block"><div className={`h-1.5 rounded-full ${d.riskBand === "HIGH" ? "bg-risk-high" : d.riskBand === "MEDIUM" ? "bg-risk-medium" : "bg-risk-low"}`} style={{ width: `${d.riskScore}%` }} /></div><span className="w-6 font-semibold tabular-nums">{d.riskScore}</span></div></td>
                <td className="px-3 text-right tabular-nums">{drainRain(d)} mm</td><td className="px-3 text-right tabular-nums">{d.historicalChokes}</td><td className="px-3 text-right tabular-nums">{d.citizenReports}</td><td className="px-3 capitalize text-muted-foreground">{d.slope}</td><td className="px-3 text-right tabular-nums">{d.cleaningTimeMin} min</td><td className="px-3"><StatusBadge status={d.status} /></td>
                <td className="px-3 text-right"><Button size="sm" variant="ghost" className="h-7 text-xs">Details<ChevronRight className="h-3 w-3" /></Button></td>
              </tr>
            ))}
            {!rows.length && <tr><td colSpan={11} className="p-10 text-center text-muted-foreground"><div className="font-medium text-foreground">No drains match these filters</div><button className="mt-1 text-xs underline" onClick={() => { setQ(""); setRisk("ALL"); setStatus("ALL"); }}>Clear filters</button></td></tr>}
          </tbody>
        </table>
      </div>
      <DrainSheet drain={drain} onOpenChange={(o) => !o && setOpen(null)} />
    </AppShell>
  );
}
