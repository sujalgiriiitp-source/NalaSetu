import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useMemo, useState } from "react";
import { CloudRain, MapPinned, SlidersHorizontal } from "lucide-react";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { AppShell } from "@/components/nala/AppShell";
import { LazyMap } from "@/components/nala/LazyMap";
import { RiskBadge, StatusBadge } from "@/components/nala/badges";
import { DrainDetailBody } from "@/components/nala/DrainDetail";
import { useNala } from "@/lib/nalasetu/store";
import { STATUS_LABEL } from "@/lib/nalasetu/state-machine";
import type { TaskStatus } from "@/lib/nalasetu/types";

export const Route = createFileRoute("/map")({
  validateSearch: z.object({ drain: z.string().optional() }),
  head: () => ({
    meta: [
      { title: "Risk Map — NalaSetu" },
      {
        name: "description",
        content: "OpenStreetMap view of drain choke risk with filters and explainable detail.",
      },
      { property: "og:title", content: "Risk Map — NalaSetu" },
      { property: "og:description", content: "Map of drain choke risk across the demo ward." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MapPage,
});

const STATUSES: TaskStatus[] = [
  "UNASSIGNED",
  "ASSIGNED",
  "EN_ROUTE",
  "CLEANING",
  "PROOF_SUBMITTED",
  "VERIFIED",
];

function MapPage() {
  const n = useNala();
  const { drains } = n;
  const search = Route.useSearch();
  const [sel, setSel] = useState<string | undefined>(search.drain);
  const [risk, setRisk] = useState("ALL");
  const [status, setStatus] = useState("ALL");
  const [q, setQ] = useState("");
  const list = useMemo(
    () =>
      drains
        .filter(
          (d) =>
            (risk === "ALL" || d.riskBand === risk) &&
            (status === "ALL" || d.status === status) &&
            `${d.id} ${d.name}`.toLowerCase().includes(q.toLowerCase()),
        )
        .sort((a, b) => b.riskScore - a.riskScore),
    [drains, risk, status, q],
  );
  const selected = drains.find((d) => d.id === sel);
  const onSelect = useCallback((id: string) => setSel(id), []);
  const sel_ = "h-8 rounded border bg-card px-2 text-xs";
  return (
    <AppShell title="Risk Map" subtitle="Marker colour = risk band. Click a marker for details.">
      <div className="mb-4 grid gap-3 sm:grid-cols-3">
        <div className="rounded-md border bg-card px-4 py-3 shadow-card">
          <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            Monitored drains
          </div>
          <div className="mt-1 text-2xl font-semibold tabular-nums">{drains.length}</div>
        </div>
        <div className="rounded-md border bg-card px-4 py-3 shadow-card">
          <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            <CloudRain className="h-3.5 w-3.5 text-info" />
            72h rainfall
          </div>
          <div className="mt-1 text-2xl font-semibold tabular-nums">
            {n.forecastMm} <span className="text-sm font-normal text-muted-foreground">mm</span>
          </div>
        </div>
        <div className="rounded-md border bg-card px-4 py-3 shadow-card">
          <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            Map mode
          </div>
          <div className="mt-1 flex items-center gap-2 text-sm font-semibold">
            <MapPinned className="h-4 w-4 text-info" />
            Risk + status layers
          </div>
        </div>
      </div>
      <div className="grid gap-4 lg:h-[calc(100vh-270px)] lg:grid-cols-[280px_1fr_380px] lg:grid-rows-1">
        <div className="flex min-h-0 flex-col overflow-hidden rounded-md border bg-card shadow-card">
          <div className="space-y-3 border-b p-4">
            <div className="flex items-center justify-between">
              <div className="text-xs font-semibold uppercase tracking-[0.12em]">Filters</div>
              <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
            </div>
            <Input
              placeholder="Search drain name / ID"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="h-8 text-xs"
              aria-label="Search drains"
            />
            <div className="grid grid-cols-2 gap-2">
              <select
                className={sel_}
                value={risk}
                onChange={(e) => setRisk(e.target.value)}
                aria-label="Risk filter"
              >
                <option value="ALL">All risk</option>
                <option value="HIGH">High</option>
                <option value="MEDIUM">Medium</option>
                <option value="LOW">Low</option>
              </select>
              <select
                className={sel_}
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                aria-label="Status filter"
              >
                <option value="ALL">All status</option>
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {STATUS_LABEL[s]}
                  </option>
                ))}
              </select>
            </div>
            <div className="text-[11px] text-muted-foreground">{list.length} drains</div>
          </div>
          <ul className="max-h-72 flex-1 overflow-y-auto lg:max-h-none">
            {list.map((d) => (
              <li key={d.id}>
                <button
                  onClick={() => setSel(d.id)}
                  className={`w-full border-b px-3 py-2 text-left text-xs hover:bg-muted ${sel === d.id ? "bg-accent" : ""}`}
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-mono text-muted-foreground">{d.id}</span>
                    <RiskBadge band={d.riskBand} score={d.riskScore} />
                  </div>
                  <div className="mt-0.5 truncate font-medium">{d.name}</div>
                  <div className="mt-1">
                    <StatusBadge status={d.status} />
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="relative h-[420px] min-h-0 overflow-hidden rounded-md border bg-card shadow-card lg:h-full">
          <div className="pointer-events-none absolute left-3 top-3 z-[500] flex gap-2 rounded-md border bg-card/95 px-2.5 py-2 text-[10px] font-semibold shadow-card">
            <span className="text-risk-high">HIGH</span>
            <span className="text-demo-foreground">MEDIUM</span>
            <span className="text-risk-low">LOW</span>
          </div>
          <LazyMap drains={list} selected={sel} onSelect={onSelect} />
        </div>
        <div className="overflow-y-auto rounded-md border bg-card p-5 shadow-card">
          {selected ? (
            <>
              <h2 className="mb-3 font-semibold">
                {selected.id} · {selected.name}
              </h2>
              <DrainDetailBody drain={selected} />
            </>
          ) : (
            <p className="text-sm text-muted-foreground">
              Select a drain on the map or list to see its risk breakdown.
            </p>
          )}
        </div>
      </div>
    </AppShell>
  );
}
