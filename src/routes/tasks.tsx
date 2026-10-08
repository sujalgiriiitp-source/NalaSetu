import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Check, X, ShieldCheck, AlertTriangle, ChevronRight, UserCheck, ClipboardCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AppShell, Panel } from "@/components/nala/AppShell";
import { RiskBadge, StatusBadge, Tag } from "@/components/nala/badges";
import { useNala } from "@/lib/nalasetu/store";
import { useAuth } from "@/lib/nalasetu/auth";
import { crewName } from "@/lib/nalasetu/data";
import { STATUS_LABEL } from "@/lib/nalasetu/state-machine";

export const Route = createFileRoute("/tasks")({
  head: () => ({ meta: [
    { title: "Verification & Tasks — NalaSetu" },
    { name: "description", content: "Review before/after cleaning proof, AI verdicts and audit history." },
    { property: "og:title", content: "Verification & Tasks — NalaSetu" },
    { property: "og:description", content: "Human review of cleaning proof with audit trail." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: TasksPage,
});

const FILTERS = ["All", "AI PASS", "Needs Review", "Human Verified", "Rejected"] as const;

function TasksPage() {
  const n = useNala();
  const officer = useAuth().session?.role === "OFFICER";
  const [f, setF] = useState<(typeof FILTERS)[number]>("All");
  const proofs = n.tasks.filter((t) => t.verification).filter((t) =>
    f === "All" ? true : f === "AI PASS" ? t.verification!.verdict === "PASS" && !t.officerDecision : f === "Needs Review" ? t.verification!.verdict === "REVIEW" && !t.officerDecision : f === "Human Verified" ? t.officerDecision === "APPROVED" : t.officerDecision === "REJECTED");
  const active = n.tasks.filter((t) => !t.verification);
  return (
    <AppShell roles={["OFFICER", "CREW"]} title="AI Proof Verification" subtitle="Crew → Before/After → AI Verification → Officer Review. AI PASS is not final — an officer confirms every proof.">
      <div className="space-y-4">
        <div className="inline-flex flex-wrap gap-0.5 rounded-md border bg-card p-0.5 shadow-card" role="group" aria-label="Filter proofs">{FILTERS.map((x) => <button key={x} aria-pressed={f === x} onClick={() => setF(x)} className={`rounded px-2.5 py-1 text-xs font-medium transition-colors ${f === x ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>{x}</button>)}</div>
        {!proofs.length && <Panel><div className="py-8 text-center"><ClipboardCheck className="mx-auto h-6 w-6 text-muted-foreground" /><p className="mt-2 font-medium">No proofs here yet</p><p className="text-sm text-muted-foreground">Crews submit before/after proof from the Crew App.</p></div></Panel>}
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {proofs.map((t) => { const d = n.drains.find((x) => x.id === t.drainId)!; const v = t.verification!; const pass = v.verdict === "PASS"; return (
            <article key={t.id} className="overflow-hidden rounded-xl border bg-card shadow-card">
              <div className="flex items-start justify-between gap-2 border-b px-3 py-2.5"><div className="min-w-0"><div className="truncate text-sm font-semibold"><span className="font-mono">{d.id}</span> · {d.name}</div><div className="text-xs text-muted-foreground">{crewName(t.crewId)} · {t.submittedAt && new Date(t.submittedAt).toLocaleString()}</div></div><RiskBadge band={d.riskBand} /></div>
              <div className="grid grid-cols-2 gap-1 p-2">
                {[["Before", t.beforePhoto], ["After", t.afterPhoto]].map(([l, s]) => <figure key={l} className="relative"><img src={s} alt={`${l} cleaning`} className="aspect-[4/3] w-full rounded-md object-cover" /><figcaption className="absolute left-1.5 top-1.5 rounded bg-card/90 px-1.5 py-0.5 text-[10px] font-semibold uppercase">{l}</figcaption></figure>)}
              </div>
              <div className="space-y-2.5 px-3 pb-3 text-xs">
                <div className={`rounded-md border p-2.5 ${pass ? "border-risk-low/30 bg-risk-low/5" : "border-st-review/30 bg-st-review/5"}`}>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">AI verdict</span>
                    {v.mode === "demo" ? <Tag tone="demo">Demo AI — simulated</Tag> : <Tag>AI-assisted</Tag>}
                  </div>
                  <div className="mt-1 flex items-baseline gap-2"><span className={`text-lg font-bold ${pass ? "text-risk-low" : "text-st-review"}`}>{v.verdict}</span><span className="font-semibold tabular-nums">{v.confidence}% confidence</span></div>
                  <div className="mt-1.5 h-1 rounded-full bg-muted"><div className={`h-1 rounded-full ${pass ? "bg-risk-low" : "bg-st-review"}`} style={{ width: `${v.confidence}%` }} /></div>
                  <p className="mt-1.5 text-muted-foreground">“{v.reason}”</p>
                </div>
                <ol className="flex items-center gap-2 text-[11px] font-medium">
                  <li className={`inline-flex items-center gap-1 ${pass ? "text-risk-low" : "text-st-review"}`}>{pass ? <ShieldCheck className="h-3.5 w-3.5" /> : <AlertTriangle className="h-3.5 w-3.5" />}{pass ? "AI Verified" : "AI flagged"}</li>
                  <ChevronRight className="h-3 w-3 text-muted-foreground" />
                  <li className={`inline-flex items-center gap-1 ${t.officerDecision === "APPROVED" ? "text-risk-low" : t.officerDecision === "REJECTED" ? "text-st-review" : "text-muted-foreground"}`}>{t.officerDecision === "APPROVED" ? <><UserCheck className="h-3.5 w-3.5" />Human Verified</> : t.officerDecision === "REJECTED" ? <><X className="h-3.5 w-3.5" />Rejected by officer</> : <><UserCheck className="h-3.5 w-3.5" />Awaiting officer</>}</li>
                </ol>
                {!t.officerDecision && officer && (
                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1" onClick={() => n.review(t.id, "APPROVED")}><Check className="h-4 w-4" />Approve</Button>
                    <Button size="sm" variant="outline" className="flex-1" onClick={() => n.review(t.id, "REJECTED")}><X className="h-4 w-4" />Reject</Button>
                  </div>
                )}
                {!pass && !t.officerDecision && <p className="font-medium text-st-review">Low confidence — inspect photos manually before deciding.</p>}
              </div>
            </article>); })}
        </div>
        <Panel title="Active tasks">
          {active.length ? <div className="divide-y text-sm">{active.map((t) => { const d = n.drains.find((x) => x.id === t.drainId)!; return <div key={t.id} className="flex items-center justify-between py-1.5"><span><span className="font-mono text-xs">{d.id}</span> {d.name} · <span className="text-muted-foreground">{crewName(t.crewId)}</span></span><StatusBadge status={d.status} /></div>; })}</div> : <p className="text-sm text-muted-foreground">None.</p>}
        </Panel>
        <Panel title="Audit history">
          <div className="max-h-96 overflow-y-auto">
            <table className="w-full text-xs">
              <thead className="text-left text-muted-foreground"><tr><th className="py-1">Time</th><th>Actor</th><th>Drain</th><th>Change</th><th>Reason</th></tr></thead>
              <tbody>{n.audit.map((a) => <tr key={a.id} className="border-t"><td className="py-1 tabular-nums">{new Date(a.timestamp).toLocaleTimeString()}</td><td>{a.actor}</td><td className="font-mono">{a.drainId}</td><td>{a.oldStatus && a.newStatus ? `${STATUS_LABEL[a.oldStatus]} → ${STATUS_LABEL[a.newStatus]}` : "—"}</td><td>{a.reason}</td></tr>)}</tbody>
            </table>
            {!n.audit.length && <p className="py-3 text-sm text-muted-foreground">No events yet.</p>}
          </div>
        </Panel>
      </div>
    </AppShell>
  );
}
