import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { CloudRain, Map as MapIcon, Zap, ArrowRight, CheckCircle2, Circle, Loader2, ShieldCheck, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AppShell, Panel } from "@/components/nala/AppShell";
import { RiskBadge, SourceBadge, Tag } from "@/components/nala/badges";
import { LazyMap } from "@/components/nala/LazyMap";
import { DrainSheet } from "@/components/nala/DrainDetail";
import { useNala } from "@/lib/nalasetu/store";
import { impactStats } from "@/lib/nalasetu/impact";
import { reasons, scoreRisk } from "@/lib/nalasetu/risk";
import { crewName } from "@/lib/nalasetu/data";
import type { Drain, RiskBand } from "@/lib/nalasetu/types";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [
    { title: "Dashboard — NalaSetu" },
    { name: "description", content: "Rainfall forecast, drain risk and pre-rain cleaning status for the demo ward." },
    { property: "og:title", content: "Dashboard — NalaSetu" },
    { property: "og:description", content: "Rainfall forecast, drain risk and pre-rain cleaning status." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Dashboard,
});

const BAR: Record<RiskBand, string> = { HIGH: "bg-risk-high", MEDIUM: "bg-risk-medium", LOW: "bg-risk-low" };
const ACTIVE = ["ASSIGNED", "EN_ROUTE", "CLEANING", "PROOF_SUBMITTED", "NEEDS_REVIEW"];

function Strip({ label, value, hint, tone }: { label: string; value: string | number; hint: string; tone?: "high" }) {
  return (
    <div className="min-w-0 px-4 py-3">
      <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">{label}</div>
      <div className={`mt-0.5 truncate text-lg font-semibold tabular-nums ${tone === "high" ? "text-risk-high" : ""}`}>{value}</div>
      <div className="truncate text-[11px] text-muted-foreground">{hint}</div>
    </div>
  );
}

function ScoreCard({ d, rain }: { d: Drain; rain: number }) {
  const r = scoreRisk(d, rain);
  const parts = [["Rainfall", r.contrib.rainfall, 40], ["History", r.contrib.history, 25], ["Terrain", r.contrib.terrain, 20], ["Reports", r.contrib.citizen, 15]] as const;
  const C = 2 * Math.PI * 34;
  return (
    <div className="grid gap-4 sm:grid-cols-[auto_1fr]">
      <div className="flex flex-col items-center">
        <div className="relative h-24 w-24">
          <svg viewBox="0 0 80 80" className="h-24 w-24 -rotate-90" aria-hidden>
            <circle cx="40" cy="40" r="34" fill="none" stroke="var(--muted)" strokeWidth="7" />
            <circle cx="40" cy="40" r="34" fill="none" stroke={`var(--risk-${d.riskBand.toLowerCase()})`} strokeWidth="7" strokeLinecap="round" strokeDasharray={`${(d.riskScore / 100) * C} ${C}`} />
          </svg>
          <div className="absolute inset-0 grid place-items-center text-center"><div><div className="text-2xl font-semibold tabular-nums leading-none">{d.riskScore}</div><div className="mt-1 text-[9px] font-bold uppercase tracking-wide text-muted-foreground">{d.riskBand} risk</div></div></div>
        </div>
      </div>
      <div className="space-y-1.5">
        {parts.map(([k, v, max]) => (
          <div key={k} className="grid grid-cols-[64px_1fr_28px] items-center gap-2 text-xs">
            <span className="text-muted-foreground">{k}</span>
            <span className="h-1.5 overflow-hidden rounded-full bg-muted"><span className="block h-full rounded-full bg-foreground/70" style={{ width: `${(v / max) * 100}%` }} /></span>
            <span className="text-right font-medium tabular-nums">{Math.round(v)}</span>
          </div>
        ))}
        <div className="pt-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">Why this drain?</div>
        <ul className="space-y-0.5 text-xs">{reasons(d, rain).map((x) => <li key={x}>• {x}</li>)}</ul>
      </div>
    </div>
  );
}

function Dashboard() {
  const n = useNala();
  const nav = useNavigate();
  const [busy, setBusy] = useState(false);
  const [sel, setSel] = useState<string | null>(null);
  const [focus, setFocus] = useState<string | null>(null);
  const counts = { HIGH: 0, MEDIUM: 0, LOW: 0 } as Record<RiskBand, number>;
  n.drains.forEach((d) => counts[d.riskBand]++);
  const active = n.drains.filter((d) => ACTIVE.includes(d.status)).length;
  const reviewTasks = n.tasks.filter((t) => t.submittedAt && !t.officerDecision);
  const passed = n.tasks.filter((t) => t.verification?.verdict === "PASS" && !t.officerDecision).length;
  const needs = n.tasks.filter((t) => t.verification?.verdict === "REVIEW" && !t.officerDecision).length;
  const human = n.tasks.filter((t) => t.officerDecision === "APPROVED").length;
  const imp = impactStats(n.drains);
  const top = [...n.drains].sort((a, b) => b.riskScore - a.riskScore).slice(0, 5);
  const focused = n.drains.find((d) => d.id === (focus ?? top[0]?.id));
  const totalH = n.crews.reduce((a, c) => a + c.availableHours, 0);
  const heavy = n.forecastMm >= 40;
  const anyProof = n.tasks.some((t) => t.submittedAt);
  const allDone = n.tasks.length > 0 && n.tasks.every((t) => t.officerDecision);
  const stages: [string, "done" | "now" | "wait", string][] = [
    ["Risk Assessment", "done", "Complete"],
    ["Cleaning Plan", n.plan ? "done" : "now", n.plan ? `${n.plan.hoursPlanned}h planned` : "Not generated"],
    ["Crew Dispatch", n.plan?.dispatched ? "done" : n.plan ? "now" : "wait", n.plan?.dispatched ? `${n.tasks.length} tasks sent` : "Not started"],
    ["Field Proof", anyProof ? "done" : n.plan?.dispatched ? "now" : "wait", anyProof ? `${reviewTasks.length + human} submitted` : "Waiting"],
    ["Verification", allDone ? "done" : anyProof ? "now" : "wait", human ? `${human} verified` : "Waiting"],
  ];
  const generate = () => { setBusy(true); setTimeout(() => { n.generatePlan(); nav({ to: "/dispatch" }); }, 50); };
  const crewMin = (id: string) => n.plan?.crews.find((c) => c.crewId === id)?.totalMin ?? 0;

  return (
    <AppShell title="Dashboard" subtitle="Pre-rain operations overview · Demo Ward 7 (synthetic)">
      <div className="mx-auto max-w-[1400px] space-y-4">
        {/* Command hero */}
        <section className="flex flex-wrap items-center justify-between gap-4 rounded-xl border bg-card px-5 py-4 shadow-card">
          <div className="flex items-center gap-4">
            <span className={`grid h-11 w-11 place-items-center rounded-lg ${heavy ? "bg-risk-high/10 text-risk-high" : "bg-info/10 text-info"}`}><CloudRain className="h-5 w-5" aria-hidden /></span>
            <div>
              <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">Rain / risk status <SourceBadge source={n.weather.source} /></div>
              <div className="text-base font-semibold">{heavy ? "Heavy rainfall expected" : "Light rainfall expected"}</div>
              <div className="text-xs text-muted-foreground"><span className="text-xl font-semibold tabular-nums text-foreground">{n.forecastMm} mm</span> next 72 hours · Source: {n.weather.source === "demo" ? "Demo scenario" : "Open-Meteo"} · <Link to="/settings" className="underline">change</Link></div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button size="lg" onClick={generate} disabled={busy}>{busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4" />}{busy ? "Generating plan..." : "Generate Pre-Rain Cleaning Plan"}</Button>
            <Button size="lg" variant="outline" asChild><Link to="/map"><MapIcon className="h-4 w-4" />Open Risk Map</Link></Button>
            <Button variant="link" asChild><Link to="/drains">View drains</Link></Button>
          </div>
        </section>

        {/* Status strip */}
        <section className="grid grid-cols-2 divide-x divide-y rounded-xl border bg-card shadow-card sm:grid-cols-5 sm:divide-y-0">
          <Strip label="High risk" value={counts.HIGH} hint="Priority drains" tone="high" />
          <Strip label="Plan" value={n.plan ? (n.plan.dispatched ? "Dispatched" : "Generated") : "Not generated"} hint={n.plan ? `${n.plan.highCoverage}% high-risk coverage` : "Run planner"} />
          <Strip label="Crews" value={`${totalH}h`} hint={n.plan ? `${n.plan.hoursPlanned}h planned` : "Available"} />
          <Strip label="Tasks" value={active} hint="Active in field" />
          <Strip label="Verification" value={reviewTasks.length} hint="Awaiting officer" />
        </section>

        <div className="grid gap-4 lg:grid-cols-12">
          <Panel className="lg:col-span-8" title="Risk Overview" subtitle={`${counts.HIGH} of ${n.drains.length} monitored drains require high-priority attention.`}>
            <div className="grid gap-5 md:grid-cols-[1fr_1.2fr]">
              <div className="space-y-3">
                {(["HIGH", "MEDIUM", "LOW"] as RiskBand[]).map((b) => (
                  <div key={b} className="grid grid-cols-[64px_1fr_28px] items-center gap-3 text-xs">
                    <span className="font-semibold tracking-wide text-muted-foreground">{b}</span>
                    <span className="h-2 overflow-hidden rounded-full bg-muted"><span className={`block h-full rounded-full ${BAR[b]}`} style={{ width: `${(counts[b] / Math.max(1, n.drains.length)) * 100}%` }} /></span>
                    <span className="text-right text-sm font-semibold tabular-nums">{counts[b]}</span>
                  </div>
                ))}
                <p className="pt-1 text-[11px] text-muted-foreground">Score = 0.40 rainfall + 0.25 choke history + 0.20 terrain + 0.15 citizen reports.</p>
              </div>
              {focused && <div className="border-t pt-4 md:border-l md:border-t-0 md:pl-5 md:pt-0">
                <div className="mb-2 text-xs"><span className="font-mono text-muted-foreground">{focused.id}</span> <span className="font-medium">{focused.name}</span></div>
                <ScoreCard d={focused} rain={n.drainRain(focused)} />
              </div>}
            </div>
          </Panel>

          <Panel className="lg:col-span-4" title="Pre-Rain Readiness">
            <ol className="space-y-0">
              {stages.map(([name, st, note], i) => (
                <li key={name} className="relative flex gap-3 pb-3 last:pb-0">
                  {i < stages.length - 1 && <span className="absolute left-[11px] top-6 h-[calc(100%-18px)] w-px bg-border" />}
                  <span className={`relative grid h-6 w-6 shrink-0 place-items-center rounded-full text-[10px] font-semibold ${st === "done" ? "bg-risk-low/10 text-risk-low" : st === "now" ? "bg-info/10 text-info ring-1 ring-info/40" : "bg-muted text-muted-foreground"}`}>
                    {st === "done" ? <CheckCircle2 className="h-3.5 w-3.5" /> : st === "now" ? String(i + 1).padStart(2, "0") : <Circle className="h-3 w-3" />}
                  </span>
                  <div className="min-w-0"><div className={`text-sm ${st === "wait" ? "text-muted-foreground" : "font-medium"}`}>{name}</div><div className="text-[11px] text-muted-foreground">{note}</div></div>
                </li>
              ))}
            </ol>
          </Panel>

          <Panel className="lg:col-span-7" title="Highest-Risk Drains" subtitle="Priority based on rainfall, choke history, terrain and reports." right={<Link to="/drains" className="text-xs font-medium text-muted-foreground hover:text-foreground">All drains →</Link>}>
            <div className="space-y-2">
              {top.map((d) => (
                <div key={d.id} onMouseEnter={() => setFocus(d.id)} className="group relative flex flex-wrap items-center justify-between gap-3 overflow-hidden rounded-lg border bg-card py-2.5 pl-4 pr-3 transition-all duration-150 hover:border-foreground/20 hover:shadow-raised">
                  <span className={`absolute inset-y-0 left-0 w-1 ${BAR[d.riskBand]}`} />
                  <div className="min-w-0">
                    <div className="text-sm"><span className="font-mono text-xs text-muted-foreground">{d.id}</span> <span className="font-medium">{d.name}</span></div>
                    <div className="mt-0.5 flex flex-wrap gap-x-3 text-[11px] text-muted-foreground tabular-nums">
                      <span>{n.drainRain(d)} mm</span><span>{d.historicalChokes} chokes</span><span>{d.lowLying ? "Low-lying" : `${d.slope} slope`}</span><span>{d.cleaningTimeMin} min cleaning</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2"><RiskBadge band={d.riskBand} score={d.riskScore} /><Button size="sm" variant="outline" onClick={() => setSel(d.id)}>View details</Button></div>
                </div>
              ))}
            </div>
          </Panel>

          <section className="relative overflow-hidden rounded-xl border bg-card shadow-card lg:col-span-5">
            <div className="absolute left-14 top-3 z-[500] rounded-md border bg-card/95 px-2.5 py-1 text-xs font-semibold shadow-card">Risk Map</div>
            <Link to="/map" className="absolute right-3 top-3 z-[500] rounded-md border bg-card/95 px-2.5 py-1 text-xs font-medium shadow-card hover:bg-muted">Open Full Map →</Link>
            <div className="absolute bottom-3 left-3 z-[500] flex gap-3 rounded-md border bg-card/95 px-2.5 py-1 text-[10px] font-semibold shadow-card">
              {(["HIGH", "MEDIUM", "LOW"] as RiskBand[]).map((b) => <span key={b} className="flex items-center gap-1"><span className={`h-2 w-2 rounded-full ${BAR[b]}`} />{b}</span>)}
            </div>
            <div className="h-[380px] [&>div]:rounded-none [&>div]:border-0"><LazyMap drains={n.drains} selected={sel ?? undefined} onSelect={setSel} /></div>
          </section>

          <Panel className="lg:col-span-6" title="Crew Availability" right={<span className="text-xs tabular-nums text-muted-foreground">{totalH}h total{n.plan && <> → <span className="font-semibold text-foreground">{n.plan.hoursPlanned}h planned</span></>}</span>}>
            <div className="space-y-3">
              {n.crews.map((c) => {
                const used = Math.min(c.availableHours * 60, crewMin(c.id));
                return (
                  <div key={c.id} className="grid grid-cols-[110px_1fr_auto] items-center gap-3 text-sm">
                    <span className="font-medium">{c.name}</span>
                    <span className="h-2 overflow-hidden rounded-full bg-muted"><span className="block h-full rounded-full bg-info" style={{ width: `${(used / (c.availableHours * 60)) * 100}%` }} /></span>
                    <span className="text-xs tabular-nums text-muted-foreground">{n.plan ? `${(used / 60).toFixed(1)} / ` : ""}{c.availableHours}h</span>
                  </div>
                );
              })}
              {!n.plan && <p className="text-[11px] text-muted-foreground">Bars fill once a plan is generated. The planner never exceeds crew capacity.</p>}
            </div>
          </Panel>

          <Panel className="lg:col-span-6" title="Proof Verification" right={<Link to="/tasks" className="text-xs font-medium text-muted-foreground hover:text-foreground">Open queue →</Link>}>
            <div className="mb-3 grid grid-cols-3 gap-2 text-center">
              {[["Needs review", needs, "text-risk-high"], ["AI passed", passed, "text-info"], ["Human verified", human, "text-risk-low"]].map(([l, v, c]) => (
                <div key={l as string} className="rounded-lg border px-2 py-2"><div className={`text-lg font-semibold tabular-nums ${c}`}>{v}</div><div className="text-[10px] uppercase tracking-wide text-muted-foreground">{l}</div></div>
              ))}
            </div>
            {reviewTasks.length === 0 ? (
              <div className="flex items-center gap-3 rounded-lg border border-dashed px-3 py-4 text-xs text-muted-foreground"><Camera className="h-4 w-4" />{n.plan?.dispatched ? "No proof submitted yet — crews will upload before/after photos from the field." : "No cleaning plan has been dispatched yet."}</div>
            ) : (
              <div className="space-y-2">
                {reviewTasks.slice(0, 3).map((t) => (
                  <div key={t.id} className="flex items-center gap-3 rounded-lg border p-2">
                    <div className="flex gap-1">{[t.beforePhoto, t.afterPhoto].map((p, i) => p ? <img key={i} src={p} alt={i ? "After" : "Before"} className="h-10 w-10 rounded object-cover" /> : <span key={i} className="h-10 w-10 rounded bg-muted" />)}</div>
                    <div className="min-w-0 flex-1 text-xs"><div className="font-mono font-medium">{t.drainId}</div><div className="truncate text-muted-foreground">{crewName(t.crewId)}</div></div>
                    {t.verification && <Tag tone={t.verification.verdict === "PASS" ? "ok" : "demo"}>AI {t.verification.verdict} {t.verification.confidence}%</Tag>}
                    <Button size="sm" variant="outline" asChild><Link to="/tasks">Review</Link></Button>
                  </div>
                ))}
              </div>
            )}
          </Panel>

          <Panel className="lg:col-span-12" title="Impact Summary" right={<div className="flex gap-1"><Tag tone="demo">Projected</Tag><Tag>Estimated</Tag></div>}>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {[["Completed drains", imp.completed, "Human verified"], ["High-risk coverage", `${imp.highCoveragePct}%`, `${imp.highDone} of ${imp.highTotal} HIGH`], ["Crew-hours used", `${(imp.crewMinutes / 60).toFixed(1)}h`, "Estimated"], ["Projected exposure reduction", `${imp.exposurePct}%`, "Model estimate, not measured"]].map(([l, v, h]) => (
                <div key={l as string}><div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">{l}</div><div className="text-2xl font-semibold tabular-nums">{v}</div><div className="text-[11px] text-muted-foreground">{h}</div></div>
              ))}
            </div>
            <Link to="/impact" className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground"><ShieldCheck className="h-3.5 w-3.5" />Full impact dashboard <ArrowRight className="h-3 w-3" /></Link>
          </Panel>
        </div>
      </div>
      <DrainSheet drain={n.drains.find((d) => d.id === sel) ?? null} onOpenChange={(o) => !o && setSel(null)} />
    </AppShell>
  );
}
