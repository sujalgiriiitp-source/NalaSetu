import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { Send, Trash2, Zap, Info, Home, Route as RouteIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { AppShell, Kpi, Panel } from "@/components/nala/AppShell";
import { LazyMap } from "@/components/nala/LazyMap";
import { RiskBadge, StatusBadge, Tag } from "@/components/nala/badges";
import { useNala } from "@/lib/nalasetu/store";
import { AVG_SPEED_KMH, fmtMin } from "@/lib/nalasetu/dispatch";

export const Route = createFileRoute("/dispatch")({
  head: () => ({ meta: [
    { title: "Dispatch — NalaSetu" },
    { name: "description", content: "Generate an optimized pre-rain cleaning plan within crew-hour limits and dispatch crews." },
    { property: "og:title", content: "Dispatch — NalaSetu" },
    { property: "og:description", content: "Optimized pre-rain cleaning plan and crew dispatch." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: DispatchPage,
});

function DispatchPage() {
  const n = useNala();
  const plan = n.plan;
  const byId = useMemo(() => new Map(n.drains.map((d) => [d.id, d])), [n.drains]);
  const routes = useMemo(() => plan?.crews.map((c) => {
    const crew = n.crews.find((k) => k.id === c.crewId)!;
    return { latlngs: [[crew.homeBaseLat, crew.homeBaseLng] as [number, number], ...c.drainIds.map((id) => [byId.get(id)!.lat, byId.get(id)!.lng] as [number, number])] };
  }) ?? [], [plan, byId, n.crews]);
  const planned = plan?.crews.flatMap((c) => c.drainIds).map((id) => byId.get(id)!).filter(Boolean) ?? [];
  const totalTasks = planned.length;
  const totalKm = plan?.crews.reduce((a, c) => a + c.distanceKm, 0) ?? 0;
  const totalMin = plan?.crews.reduce((a, c) => a + c.totalMin, 0) ?? 0;

  return (
    <AppShell title="Pre-Rain Cleaning Plan" subtitle="Maximum high-risk coverage with limited crew-hours and minimum unnecessary travel." actions={
      <Button variant={plan ? "outline" : "default"} onClick={n.generatePlan}><Zap className="h-4 w-4" />{plan ? "Regenerate Plan" : "Generate Pre-Rain Cleaning Plan"}</Button>
    }>
      {!plan ? (
        <Panel><div className="py-10 text-center"><RouteIcon className="mx-auto h-6 w-6 text-muted-foreground" /><p className="mt-2 font-medium">No plan yet</p><p className="text-sm text-muted-foreground">Generate a plan to allocate HIGH and MEDIUM drains across crews.</p></div></Panel>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <Kpi label="High-risk coverage" value={`${plan.highCoverage}%`} tone="ok" hint={`Naive score-sort baseline: ${plan.naiveHighCoverage}%`} />
            <Kpi label="Crew-hours" value={<>{plan.hoursPlanned}<span className="text-sm font-normal text-muted-foreground"> / {plan.hoursAvailable}h</span></>} hint="planned of available" />
            <Kpi label="Estimated distance" value={<>{totalKm.toFixed(1)}<span className="text-sm font-normal text-muted-foreground"> km</span></>} hint="all crews · estimated" />
            <Kpi label="Estimated total time" value={fmtMin(totalMin)} hint={`${totalTasks} tasks · plan ${plan.id}`} />
          </div>
          <div className="flex items-start gap-2 rounded-md border bg-card px-4 py-2 text-xs text-muted-foreground">
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            <span><span className="font-bold uppercase tracking-wide text-foreground">Estimated route</span> — grid clustering → greedy knapsack on score ÷ (cleaning + travel) → nearest-neighbour order. Distance uses straight-line × 1.3 at {AVG_SPEED_KMH} km/h — not exact road routing.</span>
          </div>
          <div className="grid gap-4 2xl:grid-cols-[1fr_420px]">
            <div className="grid gap-4 md:grid-cols-3">
              {plan.crews.map((c) => {
                const crew = n.crews.find((k) => k.id === c.crewId)!;
                const pct = Math.min(100, Math.round((c.totalMin / (crew.availableHours * 60)) * 100));
                return (
                  <Panel key={c.crewId} title={crew.name} right={<Tag>{crew.availableHours}h available</Tag>}>
                    <div className="mb-2 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground"><Home className="h-3 w-3" />Base · estimated route sequence</div>
                    <ol className="relative space-y-2 border-l border-dashed pl-4">
                      {c.drainIds.map((id, i) => { const d = byId.get(id)!; return (
                        <li key={id} className="relative rounded-md border bg-card p-2 text-xs transition-shadow hover:shadow-raised">
                          <span className="absolute -left-[27px] top-2 grid h-5 w-5 place-items-center rounded-full border bg-card text-[10px] font-bold tabular-nums">{i + 1}</span>
                          <div className="flex items-center justify-between gap-2"><span className="whitespace-nowrap font-mono font-semibold">{id}</span><RiskBadge band={d.riskBand} score={d.riskScore} className="whitespace-nowrap" /></div>
                          <div className="mt-0.5 flex justify-between gap-2 text-muted-foreground"><span className="truncate">{d.name}</span><span className="shrink-0 tabular-nums">{d.cleaningTimeMin} min</span></div>
                          <div className="mt-1.5 flex flex-wrap items-center gap-1">
                            {plan.dispatched ? <StatusBadge status={d.status} /> : (<>
                              <select aria-label={`Reassign ${id}`} className="h-6 rounded border bg-card px-1 text-[11px]" value="" onChange={(e) => e.target.value && n.reassign(c.crewId, id, e.target.value)}>
                                <option value="">Reassign…</option>
                                {n.crews.filter((k) => k.id !== c.crewId).map((k) => <option key={k.id} value={k.id}>{k.name}</option>)}
                              </select>
                              <Button size="sm" variant="ghost" className="h-6 px-1.5 text-[11px]" onClick={() => n.removeFromPlan(c.crewId, id)}><Trash2 className="h-3 w-3" /><span className="sr-only">Remove</span></Button>
                            </>)}
                          </div>
                        </li>); })}
                      {!c.drainIds.length && <li className="text-xs text-muted-foreground">No tasks.</li>}
                    </ol>
                    <div className="mt-3 space-y-1 border-t pt-2 text-xs">
                      <div className="flex justify-between"><span>Cleaning</span><span className="tabular-nums">{fmtMin(c.cleaningMin)}</span></div>
                      <div className="flex justify-between"><span>Est. travel</span><span className="tabular-nums">{fmtMin(c.travelMin)}</span></div>
                      <div className="flex justify-between"><span>Estimated route distance</span><span className="tabular-nums">{c.distanceKm} km</span></div>
                      <div className="flex justify-between font-semibold"><span>Estimated total</span><span className="tabular-nums">{fmtMin(c.totalMin)}</span></div>
                      <div className="h-1.5 rounded bg-muted"><div className="h-1.5 rounded bg-primary" style={{ width: `${pct}%` }} /></div>
                      <div className="text-[10px] text-muted-foreground">{pct}% of crew-hours</div>
                    </div>
                  </Panel>
                );
              })}
            </div>
            <div className="h-[420px] 2xl:h-auto"><LazyMap drains={planned} onSelect={() => {}} routes={routes} /></div>
          </div>
          <div className="sticky bottom-0 flex items-center justify-between gap-2 rounded-md border bg-card px-4 py-3">
            <span className="text-sm text-muted-foreground">{totalTasks} tasks across {plan.crews.filter((c) => c.drainIds.length).length} crews{plan.dispatched && " · dispatched"}</span>
            <AlertDialog>
              <AlertDialogTrigger asChild><Button disabled={plan.dispatched || !totalTasks}><Send className="h-4 w-4" />{plan.dispatched ? "Dispatched" : "Dispatch All"}</Button></AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader><AlertDialogTitle>Dispatch {totalTasks} tasks?</AlertDialogTitle><AlertDialogDescription>Crews will see these tasks in the Crew App. Tasks become Assigned and an audit record is created.</AlertDialogDescription></AlertDialogHeader>
                <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={n.dispatchAll}>Dispatch</AlertDialogAction></AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      )}
    </AppShell>
  );
}
