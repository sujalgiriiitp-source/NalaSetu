import { Link, useNavigate } from "@tanstack/react-router";
import { MapPin, Plus, Send } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { RiskBadge, StatusBadge, Tag } from "./badges";
import { useNala } from "@/lib/nalasetu/store";
import { crewName } from "@/lib/nalasetu/data";
import { useIsMobile } from "@/hooks/use-mobile";
import { explanation, reasons, recommendation, scoreRisk, WEIGHTS } from "@/lib/nalasetu/risk";
import type { Drain } from "@/lib/nalasetu/types";

function Section({ title, children, right }: { title: string; children: ReactNode; right?: ReactNode }) {
  return (
    <section className="border-t pt-3">
      <div className="mb-2 flex items-center justify-between"><h3 className="text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">{title}</h3>{right}</div>
      {children}
    </section>
  );
}

export function DrainDetailBody({ drain, onClose }: { drain: Drain; onClose?: () => void }) {
  const { drainRain, addToPlan, audit, plan, reports, tasks } = useNala();
  const nav = useNavigate();
  const rain = drainRain(drain);
  const r = scoreRisk(drain, rain);
  const ex = explanation(drain, rain, r.band);
  const hist = audit.filter((a) => a.drainId === drain.id).slice(0, 6);
  const drainReports = reports.filter((x) => x.drainId === drain.id).slice(0, 4);
  const task = tasks.find((t) => t.drainId === drain.id);
  const plannedCrew = plan?.crews.find((c) => c.drainIds.includes(drain.id))?.crewId;
  const bar = r.band === "HIGH" ? "bg-risk-high" : r.band === "MEDIUM" ? "bg-risk-medium" : "bg-risk-low";
  const rows = [
    ["Rainfall", "R", r.factors.R, WEIGHTS.R, r.contrib.rainfall, `min(100, ${rain}/60×100)`],
    ["History", "H", r.factors.H, WEIGHTS.H, r.contrib.history, `min(100, ${drain.historicalChokes}/5×100)`],
    ["Terrain", "S", r.factors.S, WEIGHTS.S, r.contrib.terrain, `${drain.slope} slope`],
    ["Citizen", "C", r.factors.C, WEIGHTS.C, r.contrib.citizen, `min(100, ${drain.citizenReports}/6×100)`],
  ] as const;
  const maxC = Math.max(...rows.map((x) => x[4]), 1);
  return (
    <div className="space-y-4 text-sm">
      <div className="rounded-lg border bg-muted/40 p-3">
        <div className="flex items-end justify-between gap-3">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Risk score</div>
            <div className="flex items-baseline gap-1"><span className="text-3xl font-semibold tabular-nums">{r.score}</span><span className="text-xs text-muted-foreground">/ 100</span></div>
          </div>
          <div className="flex flex-col items-end gap-1"><RiskBadge band={r.band} /><StatusBadge status={drain.status} /></div>
        </div>
        <div className="mt-2 h-1.5 rounded-full bg-muted"><div className={`h-1.5 rounded-full ${bar}`} style={{ width: `${r.score}%` }} /></div>
      </div>

      <Section title="Overview">
        <dl className="grid grid-cols-2 gap-x-4 gap-y-2">
          {([["Forecast (72h)", `${rain} mm`], ["Historical chokes", drain.historicalChokes], ["Citizen reports (30d)", drain.citizenReports], ["Terrain", drain.slope], ["Low-lying", drain.lowLying ? "Yes" : "No"], ["Last cleaned", drain.lastCleaned], ["Cleaning time", `${drain.cleaningTimeMin} min`], ["Population weight", drain.adjacentPopulationWeight], ["Ward", drain.ward], ["Coords", `${drain.lat}, ${drain.lng}`]] as const).map(([k, v]) => (
            <div key={k}><dt className="text-[11px] text-muted-foreground">{k}</dt><dd className={`font-medium tabular-nums ${k === "Terrain" ? "capitalize" : ""}`}>{v}</dd></div>
          ))}
        </dl>
      </Section>

      <Section title="Risk breakdown" right={<span className="font-mono text-[10px] text-muted-foreground">0.40R + 0.25H + 0.20S + 0.15C</span>}>
        <ul className="space-y-2">
          {rows.map(([n, k, v, w, c, f]) => (
            <li key={k}>
              <div className="flex justify-between text-xs"><span className="font-medium">{n} ({k}) <span className="text-muted-foreground">· {v.toFixed(0)} × {w}</span></span><span className="font-semibold tabular-nums">{c.toFixed(1)} pts</span></div>
              <div className="mt-1 h-1.5 rounded-full bg-muted"><div className="h-1.5 rounded-full bg-primary/70" style={{ width: `${(c / maxC) * 100}%` }} /></div>
              <div className="mt-0.5 text-[10px] text-muted-foreground">{f}</div>
            </li>
          ))}
        </ul>
        <div className="mt-2 flex justify-between rounded-md bg-muted px-2 py-1 text-xs"><span>Total</span><span className="font-bold tabular-nums">{r.raw.toFixed(2)} → {r.score}</span></div>
      </Section>

      <Section title="Why this drain?">
        <ul className="list-disc space-y-0.5 pl-5">{reasons(drain, rain).map((x) => <li key={x}>{x}</li>)}</ul>
      </Section>

      <Section title="History">
        {hist.length ? <ol className="space-y-1.5 border-l pl-3 text-xs">{hist.map((h) => <li key={h.id} className="relative before:absolute before:-left-[15px] before:top-1.5 before:h-1.5 before:w-1.5 before:rounded-full before:bg-muted-foreground"><span className="tabular-nums text-muted-foreground">{new Date(h.timestamp).toLocaleString()}</span> · <span className="font-medium">{h.actor}</span> · {h.reason}</li>)}</ol> : <p className="text-xs text-muted-foreground">Last cleaned {drain.lastCleaned}. No activity this session.</p>}
      </Section>

      <Section title="Citizen reports">
        {drainReports.length ? <ul className="space-y-1 text-xs">{drainReports.map((x) => <li key={x.id}><span className="font-medium">{x.issue}</span> <span className="text-muted-foreground">· {x.location} · {new Date(x.createdAt).toLocaleDateString()}</span></li>)}</ul> : <p className="text-xs text-muted-foreground">{drain.citizenReports} synthetic reports in the last 30 days; none added this session.</p>}
      </Section>

      <Section title="Recommendation">
        <div className="rounded-md border-l-4 border-primary bg-accent px-3 py-2">
          <div className="text-xs font-semibold">{recommendation(r.band)}</div>
          <p className="mt-1">{ex.en}</p>
          <p className="mt-1 text-xs italic text-muted-foreground" lang="hi-Latn">{ex.hin}</p>
        </div>
      </Section>

      <Section title="Crew assignment">
        <p className="text-xs">{task ? <>Assigned to <span className="font-semibold">{crewName(task.crewId)}</span> · task #{task.order}</> : plannedCrew ? <>In current plan for <span className="font-semibold">{crewName(plannedCrew)}</span> · <Tag>not dispatched</Tag></> : <span className="text-muted-foreground">Not in a plan yet.</span>}</p>
      </Section>

      <div className="sticky bottom-0 -mx-4 flex flex-wrap gap-2 border-t bg-background px-4 py-3">
        <Button size="sm" variant="outline" disabled={!plan || plan.dispatched || drain.status !== "UNASSIGNED" || !!plannedCrew} onClick={() => addToPlan(drain.id)}><Plus className="h-4 w-4" />Add to Plan</Button>
        <Button size="sm" onClick={() => { onClose?.(); nav({ to: "/dispatch" }); }}><Send className="h-4 w-4" />Dispatch</Button>
        <Button size="sm" variant="ghost" asChild><Link to="/map" search={{ drain: drain.id }}><MapPin className="h-4 w-4" />Map</Link></Button>
      </div>
    </div>
  );
}

export function DrainSheet({ drain, onOpenChange }: { drain: Drain | null; onOpenChange: (o: boolean) => void }) {
  const mobile = useIsMobile();
  return (
    <Sheet open={!!drain} onOpenChange={onOpenChange}>
      <SheetContent side={mobile ? "bottom" : "right"} className={mobile ? "h-[100dvh] overflow-y-auto px-4" : "w-full overflow-y-auto px-4 sm:max-w-md"}>
        {drain && (<>
          <SheetHeader className="p-0 pb-3 pt-4">
            <div className="font-mono text-xs text-muted-foreground">{drain.id}</div>
            <SheetTitle className="text-lg">{drain.name}</SheetTitle>
            <SheetDescription>Synthetic demo drain segment · {drain.ward}</SheetDescription>
          </SheetHeader>
          <DrainDetailBody drain={drain} onClose={() => onOpenChange(false)} />
        </>)}
      </SheetContent>
    </Sheet>
  );
}
