import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { UploadTest } from "@/components/nala/UploadTest";
import { CheckCircle2, FlaskConical, Loader2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AppShell, Kpi } from "@/components/nala/AppShell";
import { Tag } from "@/components/nala/badges";
import { verifyProof } from "@/lib/nalasetu/ai-verify.functions";
import type { VerificationMode } from "@/lib/nalasetu/aws-api";
import { useNala } from "@/lib/nalasetu/store";
import { checkExpectation, FIXTURES, urlToJpegDataUrl, type Actual, type Fixture } from "@/lib/nalasetu/verification-fixtures";

export const Route = createFileRoute("/verification-lab")({
  head: () => ({ meta: [
    { title: "Verification Test Lab — NalaSetu" },
    { name: "description", content: "Repeatable before/after photo scenarios to check AI confidence, location matching and review flags." },
    { property: "og:title", content: "Verification Test Lab — NalaSetu" },
    { property: "og:description", content: "Repeatable checks for AI proof verification." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: LabPage,
});

type Result = { state: "running" } | { state: "done"; actual: Actual; mode: VerificationMode; reason: string; fails: string[]; ms: number } | { state: "error"; error: string };

function LabPage() {
  const verify = useServerFn(verifyProof);
  const nala = useNala();
  const [results, setResults] = useState<Record<string, Result>>({});
  const [running, setRunning] = useState(false);

  const runOne = async (f: Fixture) => {
    setResults((r) => ({ ...r, [f.id]: { state: "running" } }));
    const t0 = performance.now();
    try {
      const [b, a] = await Promise.all([urlToJpegDataUrl(f.before), urlToJpegDataUrl(f.after)]);
      const res = await verify({ data: { before: b, after: f.after === f.before ? b : a, drainId: "TEST", drainName: f.title } });
      if (!res.ok) { setResults((r) => ({ ...r, [f.id]: { state: "error", error: res.error } })); return false; }
      nala.recordVerificationMode(res.mode);
      const actual: Actual = { verdict: res.verdict, confidence: res.confidence, sameLocation: res.sameLocation, obstructionAfter: res.obstructionAfter };
      setResults((r) => ({ ...r, [f.id]: { state: "done", actual, mode: res.mode, reason: res.reason, fails: checkExpectation(f.expect, actual), ms: Math.round(performance.now() - t0) } }));
      return true;
    } catch (e) {
      setResults((r) => ({ ...r, [f.id]: { state: "error", error: (e as Error).message } }));
      return false;
    }
  };
  // Sequential to stay within shared rate limits; stop on gateway errors (credits/limits).
  const runAll = async () => {
    setRunning(true);
    for (const f of FIXTURES) { if (!(await runOne(f))) break; }
    setRunning(false);
  };

  const done = Object.values(results).filter((r) => r.state === "done") as Extract<Result, { state: "done" }>[];
  const passed = done.filter((r) => !r.fails.length).length;

  return (
    <AppShell title="Verification Test Lab" subtitle="Repeatable before/after scenarios. Each run makes real AI calls and uses credits." actions={
      <Button onClick={runAll} disabled={running}>{running ? <Loader2 className="h-4 w-4 animate-spin" /> : <FlaskConical className="h-4 w-4" />}Run all scenarios</Button>
    }>
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <Kpi label="Scenarios" value={FIXTURES.length} />
          <Kpi label="Passed" value={`${passed} / ${done.length}`} tone={done.length && passed === done.length ? "ok" : undefined} />
          <Kpi label="Flagged for review" value={done.filter((r) => r.actual.verdict === "REVIEW").length} hint="sent to officer" />
        </div>
        <p className="text-xs text-muted-foreground">Sample photos are realistic generated images for testing, not field data. Results run through the same check crews use — nothing is saved to tasks.</p>
        <UploadTest />
        <CrashTest />
        <div className="grid gap-4 lg:grid-cols-2">
          {FIXTURES.map((f) => {
            const r = results[f.id];
            return (
              <article key={f.id} className="rounded-md border bg-card">
                <div className="flex items-center justify-between border-b px-3 py-2">
                  <div><div className="text-sm font-semibold">{f.title}</div><div className="text-xs text-muted-foreground">{f.description}</div></div>
                  <Button size="sm" variant="outline" disabled={running || r?.state === "running"} onClick={() => runOne(f)}>Run</Button>
                </div>
                <div className="grid grid-cols-2 gap-1 p-2">
                  {[["Before", f.before], ["After", f.after]].map(([l, s]) => <figure key={l}><img src={s} alt={`${f.title} ${l}`} loading="lazy" width={944} height={704} className="aspect-[4/3] w-full rounded object-cover" /><figcaption className="text-center text-[10px] font-semibold uppercase text-muted-foreground">{l}</figcaption></figure>)}
                </div>
                <div className="space-y-1.5 px-3 pb-3 text-xs">
                  <div className="flex flex-wrap gap-1"><Tag>Expect {f.expect.verdict}</Tag>{f.expect.minConfidence !== undefined && <Tag>conf ≥ {f.expect.minConfidence}</Tag>}{f.expect.maxConfidence !== undefined && <Tag>conf ≤ {f.expect.maxConfidence}</Tag>}{f.expect.sameLocation !== undefined && <Tag>{f.expect.sameLocation ? "same place" : "different place"}</Tag>}{f.expect.obstructionAfter !== undefined && <Tag>{f.expect.obstructionAfter ? "still blocked" : "cleared"}</Tag>}</div>
                  {!r && <p className="text-muted-foreground">Not run yet.</p>}
                  {r?.state === "running" && <p className="flex items-center gap-1 text-muted-foreground"><Loader2 className="h-3 w-3 animate-spin" />Assessing photos…</p>}
                  {r?.state === "error" && <p className="font-medium text-st-review">{r.error}</p>}
                  {r?.state === "done" && (<>
                    <div className={`flex items-center gap-1 font-semibold ${r.fails.length ? "text-st-review" : "text-risk-low"}`}>{r.fails.length ? <XCircle className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}{r.fails.length ? "Unexpected result" : "As expected"} · {r.ms} ms</div>
                    <div>AI: <b>{r.actual.verdict}</b> · {r.actual.confidence}% · {r.actual.sameLocation ? "same place" : "different place"} · {r.actual.obstructionAfter ? "still blocked" : "cleared"} · Mode: <b>{r.mode}</b></div>
                    <p className="text-muted-foreground">{r.reason}</p>
                    {r.fails.map((x) => <p key={x} className="text-st-review">✗ {x}</p>)}
                  </>)}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}

function Bomb(): never { throw new Error("Test error triggered from Test Lab (safe — no data was changed)."); }

function CrashTest() {
  const [armed, setArmed] = useState(false);
  if (armed) Bomb();
  return (
    <section className="flex flex-wrap items-center justify-between gap-2 rounded-md border bg-card px-3 py-2">
      <div><div className="text-sm font-semibold">Recovery screen test</div><div className="text-xs text-muted-foreground">Triggers a harmless error to show the recovery screen. "Try again" returns here; "Dashboard" leaves.</div></div>
      <Button size="sm" variant="outline" onClick={() => setArmed(true)}>Trigger test error</Button>
    </section>
  );
}
