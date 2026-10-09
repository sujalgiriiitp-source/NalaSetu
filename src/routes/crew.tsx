import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Camera, Navigation, Play, Wrench, Upload, Loader2, RotateCw, ArrowLeft, Droplets, Check, Clock, ShieldCheck, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DemoBanner, UserMenu } from "@/components/nala/AppShell";
import { RequireRole } from "@/components/nala/RequireRole";
import { useAuth } from "@/lib/nalasetu/auth";
import { RiskBadge, StatusBadge, Tag } from "@/components/nala/badges";
import { useNala } from "@/lib/nalasetu/store";
import { crewName } from "@/lib/nalasetu/data";
import { processPhoto } from "@/lib/nalasetu/verify";
import { FIXTURES, urlToJpegDataUrl } from "@/lib/nalasetu/verification-fixtures";
import type { Task, TaskStatus } from "@/lib/nalasetu/types";

export const Route = createFileRoute("/crew")({
  head: () => ({ meta: [
    { title: "Crew App — NalaSetu" },
    { name: "description", content: "Mobile task list for drain cleaning crews with before/after photo proof." },
    { property: "og:title", content: "Crew App — NalaSetu" },
    { property: "og:description", content: "Crew task list with before/after photo proof." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: () => <RequireRole roles={["CREW", "OFFICER"]}><CrewPage /></RequireRole>,
});

const DONE: TaskStatus[] = ["PROOF_SUBMITTED", "VERIFIED", "NEEDS_REVIEW", "REJECTED"];

function CrewPage() {
  const n = useNala();
  const { session } = useAuth();
  const [crewId, setCrewId] = useState("C-A");
  const tasks = n.tasks.filter((t) => t.crewId === crewId).sort((a, b) => a.order - b.order);
  const status = (t: Task) => n.drains.find((d) => d.id === t.drainId)?.status;
  const current = tasks.find((t) => !DONE.includes(status(t)!));
  const rest = tasks.filter((t) => t !== current);
  const doneCount = tasks.filter((t) => DONE.includes(status(t)!)).length;
  return (
    <div className="min-h-screen bg-background">
      <DemoBanner />
      <header className="sticky top-0 z-10 border-b bg-card/95 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-md items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-primary-foreground"><Droplets className="h-4 w-4" aria-hidden /></span>
            <div><div className="text-sm font-semibold">NalaSetu Crew</div><div className="text-[11px] text-muted-foreground tabular-nums">{doneCount} of {tasks.length} done today</div></div>
          </div>
          <select aria-label="Crew" className="h-10 rounded-md border bg-card px-2 text-sm font-medium" value={crewId} onChange={(e) => setCrewId(e.target.value)}>
            {n.crews.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
      </header>
      <main className="mx-auto max-w-md space-y-4 p-4 pb-10">
        <div className="flex items-center justify-between">
          {session?.role === "OFFICER" ? <Link to="/dashboard" className="inline-flex items-center gap-1 text-xs text-muted-foreground"><ArrowLeft className="h-3 w-3" />Officer view</Link> : <Link to="/tasks" className="text-xs text-muted-foreground underline-offset-4 hover:underline">Verification status</Link>}
          <UserMenu />
        </div>
        {!tasks.length && <div className="rounded-xl border bg-card p-8 text-center"><Clock className="mx-auto h-6 w-6 text-muted-foreground" /><p className="mt-2 font-semibold">No tasks yet</p><p className="text-sm text-muted-foreground">{crewName(crewId)} has nothing assigned. An officer must dispatch a plan first.</p></div>}
        {current && <><div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">Today's task</div><TaskCard key={current.id} task={current} hero /></>}
        {!current && tasks.length > 0 && <div className="rounded-xl border border-risk-low/30 bg-risk-low/10 p-4 text-sm font-medium text-risk-low">All assigned tasks have proof submitted. Good work.</div>}
        {rest.length > 0 && <div className="pt-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">Other tasks</div>}
        {rest.map((t) => <TaskCard key={t.id} task={t} />)}
      </main>
    </div>
  );
}

const STEPS = ["Location", "Before", "Cleaning", "After", "Submit"];
function stepOf(status: TaskStatus, t: Task) {
  if (status === "ASSIGNED" || status === "EN_ROUTE") return 0;
  if (status === "CLEANING") return !t.beforePhoto ? 1 : !t.afterPhoto ? 3 : 4;
  return 5;
}

function Stepper({ step }: { step: number }) {
  return (
    <ol className="flex items-center gap-1" aria-label="Task progress">
      {STEPS.map((s, i) => (
        <li key={s} className="flex flex-1 flex-col items-center gap-1" aria-current={i === step ? "step" : undefined}>
          <span className={`grid h-6 w-6 place-items-center rounded-full border text-[11px] font-bold tabular-nums transition-colors ${i < step ? "border-risk-low bg-risk-low text-primary-foreground" : i === step ? "border-primary bg-primary text-primary-foreground" : "bg-card text-muted-foreground"}`}>{i < step ? <Check className="h-3 w-3" /> : i + 1}</span>
          <span className={`text-[10px] ${i === step ? "font-semibold text-foreground" : "text-muted-foreground"}`}>{s}</span>
        </li>
      ))}
    </ol>
  );
}

function TaskCard({ task, hero }: { task: Task; hero?: boolean }) {
  const n = useNala();
  const d = n.drains.find((x) => x.id === task.drainId)!;
  const [busy, setBusy] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);
  const actor = crewName(task.crewId);
  const step = stepOf(d.status, task);
  const big = "h-14 w-full text-base font-semibold";

  const onPhoto = async (kind: "before" | "after", f?: File) => {
    if (!f) return;
    setBusy(kind);
    try { n.setPhoto(task.id, kind, await processPhoto(f)); toast.success(kind === "before" ? "Before photo saved. Clean the drain, then take the after photo." : "After photo saved. Ready to submit."); }
    catch (e) { toast.error((e as Error).message); }
    finally { setBusy(null); }
  };
  const useSamplePhotos = async () => {
    const fx = FIXTURES.find((f) => f.id === "genuine") ?? FIXTURES[0];
    setBusy("sample");
    try {
      const [b, a] = await Promise.all([urlToJpegDataUrl(fx.before), urlToJpegDataUrl(fx.after)]);
      n.setPhoto(task.id, "before", b);
      n.setPhoto(task.id, "after", a);
      toast.success("Demo sample photos attached (synthetic, not field photos).");
    } catch (e) { toast.error((e as Error).message); }
    finally { setBusy(null); }
  };
  const submit = async () => {
    setBusy("submit"); setFailed(false);
    try { await n.submitProof(task.id); toast.success("Proof submitted for verification."); }
    catch (e) { setFailed(true); toast.error((e as Error).message); }
    finally { setBusy(null); }
  };
  const PhotoBtn = ({ kind, disabled }: { kind: "before" | "after"; disabled?: boolean }) => {
    const img = kind === "before" ? task.beforePhoto : task.afterPhoto;
    return (
      <label className={`relative flex aspect-[4/3] flex-col items-center justify-center gap-1 overflow-hidden rounded-lg border-2 border-dashed text-xs font-semibold ${disabled ? "cursor-not-allowed bg-muted/50 text-muted-foreground/60" : "cursor-pointer bg-muted text-muted-foreground active:scale-[0.98]"} transition-transform`}>
        {img ? <><img src={img} alt={`${kind} photo`} className="h-full w-full object-cover" /><span className="absolute left-1.5 top-1.5 rounded bg-card/90 px-1.5 py-0.5 text-[10px] uppercase text-foreground">{kind} ✓</span></> : busy === kind ? <Loader2 className="h-6 w-6 animate-spin" /> : <><Camera className="h-7 w-7" />{disabled ? "Before photo first" : `Take ${kind} photo`}</>}
        <input type="file" disabled={disabled} accept="image/jpeg,image/png,image/webp" capture="environment" className="sr-only" onChange={(e) => onPhoto(kind, e.target.files?.[0])} />
      </label>
    );
  };

  if (!hero) {
    return (
      <article className="flex items-center justify-between gap-3 rounded-xl border bg-card p-3">
        <div className="min-w-0"><div className="text-xs text-muted-foreground"><span className="font-mono">{d.id}</span> · #{task.order}</div><div className="truncate font-medium">{d.name}</div></div>
        <div className="flex shrink-0 flex-col items-end gap-1"><StatusBadge status={d.status} />{task.verification && <span className="text-[10px] text-muted-foreground tabular-nums">AI {task.verification.verdict} · {task.verification.confidence}%</span>}</div>
      </article>
    );
  }

  return (
    <article className="overflow-hidden rounded-xl border bg-card shadow-raised">
      <div className={`h-1 ${d.riskBand === "HIGH" ? "bg-risk-high" : d.riskBand === "MEDIUM" ? "bg-risk-medium" : "bg-risk-low"}`} />
      <div className="space-y-3 p-4">
        <div className="flex items-center justify-between"><span className="font-mono text-sm font-semibold">{d.id}</span><StatusBadge status={d.status} /></div>
        <h2 className="text-xl font-semibold leading-tight">{d.name}</h2>
        <div className="flex flex-wrap items-center gap-2 text-sm"><RiskBadge band={d.riskBand} score={d.riskScore} className="text-sm" /><span className="inline-flex items-center gap-1 text-muted-foreground"><Clock className="h-4 w-4" />~{d.cleaningTimeMin} min</span></div>
        <Stepper step={step} />
      </div>
      <div className="space-y-2.5 border-t bg-muted/30 p-4">
        {d.status === "ASSIGNED" && <Button className={big} onClick={() => n.transition(d.id, "EN_ROUTE", actor, "Crew started task")}><Play className="h-5 w-5" />Start Task</Button>}
        {d.status === "EN_ROUTE" && <div className="flex items-center justify-center gap-2 rounded-md bg-st-enroute/10 py-2 text-sm font-semibold text-st-enroute">En route to site</div>}
        {["ASSIGNED", "EN_ROUTE", "CLEANING"].includes(d.status) && (
          <Button variant="outline" className={big} asChild><a href={`https://www.google.com/maps/dir/?api=1&destination=${d.lat},${d.lng}`} target="_blank" rel="noreferrer"><Navigation className="h-5 w-5" />Open Navigation</a></Button>
        )}
        {d.status === "EN_ROUTE" && <Button className={big} onClick={() => n.transition(d.id, "CLEANING", actor, "Crew on site, cleaning")}><Wrench className="h-5 w-5" />Start Cleaning</Button>}
        {d.status === "CLEANING" && (<>
          <div className="grid grid-cols-2 gap-2"><PhotoBtn kind="before" /><PhotoBtn kind="after" disabled={!task.beforePhoto} /></div>
          <Button variant="ghost" className="w-full text-xs text-muted-foreground" disabled={busy === "sample"} onClick={useSamplePhotos}>{busy === "sample" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}Use sample demo photos (synthetic)</Button>
          <p className="-mt-1 text-center text-[11px] text-muted-foreground">Demo only — sample images, not real field photos.</p>
          {failed && <div className="rounded-md border border-st-review/30 bg-st-review/10 p-2 text-sm font-semibold text-st-review">Proof Pending — Retry</div>}
          <Button className={big} disabled={!task.beforePhoto || !task.afterPhoto || busy === "submit"} onClick={submit}>
            {busy === "submit" ? <Loader2 className="h-5 w-5 animate-spin" /> : failed ? <RotateCw className="h-5 w-5" /> : <Upload className="h-5 w-5" />}
            {busy === "submit" ? "Uploading & verifying…" : failed ? "Retry Submit" : "Submit Proof"}
          </Button>
        </>)}
        {task.verification && <VerdictBox task={task} status={d.status} />}
      </div>
    </article>
  );
}

function VerdictBox({ task, status }: { task: Task; status: TaskStatus }) {
  const v = task.verification!;
  const pass = v.verdict === "PASS";
  return (
    <div className="rounded-lg border bg-card p-3 text-sm">
      <div className="flex items-center justify-between gap-2">
        <span className={`inline-flex items-center gap-1 font-semibold ${pass ? "text-risk-low" : "text-st-review"}`}>{pass ? <ShieldCheck className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}AI {v.verdict} · {v.confidence}%</span>
        {v.mode === "demo" ? <Tag tone="demo">Demo AI — simulated</Tag> : <Tag>AI-assisted</Tag>}
      </div>
      <p className="mt-1 text-muted-foreground">{v.reason}</p>
      <p className="mt-2 text-xs font-medium">{status === "VERIFIED" ? "Officer approved — Human Verified." : status === "REJECTED" ? "Officer rejected — awaiting reassignment." : "Waiting for officer review. AI result is not final."}</p>
    </div>
  );
}
