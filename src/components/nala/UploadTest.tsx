import { useServerFn } from "@tanstack/react-start";
import { useEffect, useMemo, useRef, useState } from "react";
import { CheckCircle2, ChevronLeft, ChevronRight, Download, FileDown, FileText, Loader2, Trash2, Upload, X, XCircle, ZoomIn } from "lucide-react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Button } from "@/components/ui/button";
import { verifyProof } from "@/lib/nalasetu/ai-verify.functions";
import { checkExpectation, urlToJpegDataUrl, type Actual, type Expectation } from "@/lib/nalasetu/verification-fixtures";
import { groupTestTrends, summarizeTrendChanges, TREND_OUTCOMES, type TrendBucket, type TrendMetric, type TrendScale } from "@/lib/nalasetu/test-history-trends";

const EXPECTS: Record<string, { label: string; e: Expectation | null }> = {
  none: { label: "No expectation — just show result", e: null },
  clean: { label: "Should pass (same drain, cleared)", e: { verdict: "PASS", minConfidence: 70, sameLocation: true, obstructionAfter: false } },
  dirty: { label: "Should flag (still blocked)", e: { verdict: "REVIEW", sameLocation: true, obstructionAfter: true } },
  place: { label: "Should flag (different place)", e: { verdict: "REVIEW", sameLocation: false } },
};

type Out = { actual: Actual; reason: string; fails: string[] | null };
type Run = Out & { id: string; at: string; expect: string; before: string; after: string };
const KEY = "nalasetu.uploadTestHistory";

async function thumb(url: string): Promise<string> {
  const img = new Image(); img.src = url; await img.decode();
  const c = document.createElement("canvas"); const w = 160; c.width = w; c.height = Math.round((img.height / img.width) * w);
  const ctx = c.getContext("2d");
  if (!ctx) throw new Error("Could not prepare the photo.");
  ctx.drawImage(img, 0, 0, c.width, c.height); return c.toDataURL("image/jpeg", 0.6);
}
const esc = (v: string) => v.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c] ?? c);
function download(name: string, body: string, type: string) {
  const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([body], { type })); a.download = name; a.click(); URL.revokeObjectURL(a.href);
}
const outcome = (r: Run) => (r.fails ? (r.fails.length ? "Unexpected" : "As expected") : "—");
function exportCsv(h: Run[]) {
  const q = (v: string | number) => `"${String(v).replace(/"/g, '""')}"`;
  const rows = [["Time", "Expected", "AI verdict", "Confidence %", "Same location", "Still blocked", "Officer review", "Outcome", "AI reason"],
    ...h.map((r) => [r.at, EXPECTS[r.expect]?.label ?? r.expect, r.actual.verdict, r.actual.confidence, r.actual.sameLocation ? "Yes" : "No", r.actual.obstructionAfter ? "Yes" : "No", r.actual.verdict === "REVIEW" ? "Yes" : "No", outcome(r), r.reason])];
  download("nalasetu-photo-tests.csv", rows.map((r) => r.map(q).join(",")).join("\n"), "text/csv");
}
function exportHtml(h: Run[]) {
  const n = h.length, pass = h.filter((r) => r.actual.verdict === "PASS").length, same = h.filter((r) => r.actual.sameLocation).length;
  const avg = n ? Math.round(h.reduce((s, r) => s + r.actual.confidence, 0) / n) : 0;
  const rows = h.map((r) => `<tr><td>${esc(new Date(r.at).toLocaleString())}</td><td><img src="${r.before}"><img src="${r.after}"></td><td>${r.actual.verdict === "REVIEW" ? "Officer review" : "Pass"}</td><td>${r.actual.confidence}%</td><td>${r.actual.sameLocation ? "Same" : "Different"}</td><td>${r.actual.obstructionAfter ? "Still blocked" : "Cleared"}</td><td>${esc(outcome(r))}</td><td>${esc(r.reason)}</td></tr>`).join("");
  download("nalasetu-photo-test-report.html", `<!doctype html><meta charset="utf-8"><title>NalaSetu photo test report</title><style>body{font:13px Arial;margin:24px}table{border-collapse:collapse;width:100%}td,th{border:1px solid #ccc;padding:6px;vertical-align:top;text-align:left}img{width:80px;margin-right:4px}</style><h1>NalaSetu — uploaded photo test report</h1><p>Generated ${esc(new Date().toLocaleString())}. Runs: ${n} · Passed: ${pass} · Sent to officer: ${n - pass} · Same location: ${same}/${n} · Average confidence: ${avg}%</p><table><tr><th>Time</th><th>Before / After</th><th>Result</th><th>Confidence</th><th>Location</th><th>Drain</th><th>Vs expected</th><th>AI reason</th></tr>${rows}</table>`, "text/html");
}
async function chartImage(container: HTMLDivElement | null): Promise<string> {
  const svg = container?.querySelector("svg.recharts-surface");
  if (!svg) throw new Error("Charts are not ready yet. Please try again.");
  const clone = svg.cloneNode(true) as SVGElement;
  const originals = [svg, ...svg.querySelectorAll("*")];
  const copies = [clone, ...clone.querySelectorAll("*")];
  originals.forEach((node, i) => {
    const copy = copies[i];
    if (!copy) return;
    const computed = getComputedStyle(node);
    for (const prop of ["fill", "stroke", "stroke-width", "stroke-dasharray", "font-family", "font-size", "font-weight", "opacity"]) {
      (copy as SVGElement).style.setProperty(prop, computed.getPropertyValue(prop));
    }
  });
  const { width, height } = svg.getBoundingClientRect();
  clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  clone.setAttribute("width", String(width)); clone.setAttribute("height", String(height));
  const url = URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(clone)], { type: "image/svg+xml;charset=utf-8" }));
  try {
    const img = new Image(); img.src = url; await img.decode();
    const canvas = document.createElement("canvas"); canvas.width = width * 3; canvas.height = height * 3;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Could not prepare report charts.");
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue("--card");
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/png");
  } finally { URL.revokeObjectURL(url); }
}

function TrendTooltip({ active, payload }: { active?: boolean; payload?: readonly { payload?: TrendBucket }[] }) {
  const bucket = payload?.[0]?.payload;
  if (!active || !bucket) return null;
  return <div role="tooltip" className="rounded-md border bg-popover p-3 text-xs text-popover-foreground shadow-md">
    <div className="font-semibold">{bucket.dateRange}</div>
    <div className="mb-2 text-muted-foreground">{bucket.runCount} {bucket.runCount === 1 ? "run" : "runs"}</div>
    <div>Average confidence: <b>{bucket.confidence}%</b></div>
    <div>Same location: <b>{bucket.location}%</b> ({bucket.locationCount}/{bucket.runCount})</div>
    <div>Officer review: <b>{bucket.officer}%</b> ({bucket.officerCount}/{bucket.runCount})</div>
    <div>AI pass: <b>{bucket.passCount}/{bucket.runCount}</b></div>
    <div>Unexpected vs expectation: <b>{bucket.unexpectedCount}</b></div>
    {TREND_OUTCOMES.map(({ key, label }) => {
      const m = bucket.outcomes[key];
      return <div key={key} className="mt-2 border-t pt-1">
        <div className="font-semibold">{label} · {m.runCount} runs</div>
        {m.runCount ? <div>Confidence {m.confidence}% · Location {m.location}% · Review {m.officer}%</div> : <div>No runs</div>}
      </div>;
    })}
  </div>;
}

type OutcomeKey = (typeof TREND_OUTCOMES)[number]["key"];
const OUTCOME_CLASSES: Record<OutcomeKey, string> = {
  pass: "text-risk-low",
  review: "text-st-review",
  unexpected: "text-primary",
};
const COUNT_KEYS: Record<OutcomeKey, "passCount" | "officerCount" | "unexpectedCount"> = {
  pass: "passCount",
  review: "officerCount",
  unexpected: "unexpectedCount",
};
const METRIC_LABELS: Record<TrendMetric, string> = {
  confidence: "Confidence",
  location: "Location match",
  officer: "Officer review",
};

function ChangeSummary({ buckets }: { buckets: TrendBucket[] }) {
  const summaries = summarizeTrendChanges(buckets);
  return <section aria-labelledby="trend-change-heading" className="mb-2 border-y bg-muted/30 p-3">
    <div id="trend-change-heading" className="mb-2 text-xs font-semibold">Largest changes in selected range</div>
    <div className="grid gap-3 sm:grid-cols-3 sm:divide-x">
      {summaries.map(({ key, changes }) => {
        const meta = TREND_OUTCOMES.find((item) => item.key === key);
        if (!meta) return null;
        return <div key={key} className="min-w-0 sm:pl-3 first:pl-0">
          <div className={`mb-1.5 text-xs font-semibold ${OUTCOME_CLASSES[key]}`}>{meta.label}</div>
          <dl className="space-y-1.5 text-[11px]">
            {(Object.keys(METRIC_LABELS) as TrendMetric[]).map((metric) => {
              const change = changes[metric];
              return <div key={metric}>
                <dt className="text-muted-foreground">{METRIC_LABELS[metric]}</dt>
                <dd className="font-medium">
                  {change ? <>{change.delta > 0 ? "+" : ""}{change.delta} points <span className="font-normal text-muted-foreground">· {change.from} → {change.to}</span></> : "Not enough buckets"}
                </dd>
              </div>;
            })}
          </dl>
        </div>;
      })}
    </div>
  </section>;
}

function exportTrendsCsv(buckets: TrendBucket[], scale: TrendScale) {
  const esc = (v: string | number) => (/[",\n]/.test(String(v)) ? `"${String(v).replace(/"/g, '""')}"` : String(v));
  const rows = [
    ["bucket", "date_range", "run_count", "avg_confidence_pct", "same_location_pct", "same_location_count", "officer_review_pct", "officer_review_count", "ai_pass_count", "unexpected_count"],
    ...buckets.map((b) => [b.t, b.dateRange, b.runCount, b.confidence, b.location, b.locationCount, b.officer, b.officerCount, b.passCount, b.unexpectedCount]),
  ];
  const blob = new Blob([rows.map((r) => r.map(esc).join(",")).join("\n")], { type: "text/csv" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `nalasetu-trend-data-${scale}.csv`;
  a.click();
  URL.revokeObjectURL(a.href);
}

async function exportPdf(h: Run[], scale: TrendScale, charts: string[]) {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const W = 210, M = 12, CW = W - 2 * M;
  const n = h.length, pass = h.filter((r) => r.actual.verdict === "PASS").length, same = h.filter((r) => r.actual.sameLocation).length;
  const avg = n ? Math.round(h.reduce((s, r) => s + r.actual.confidence, 0) / n) : 0;
  let y = M;
  doc.setFontSize(15); doc.text("NalaSetu — uploaded photo test report", M, y); y += 6;
  doc.setFontSize(9); doc.setTextColor(90);
  const summary = doc.splitTextToSize(`Generated ${new Date().toLocaleString()} | Runs: ${n} | AI pass: ${pass} | Officer review: ${n - pass} | Same location: ${same}/${n} | Avg confidence: ${avg}%`, CW);
  doc.text(summary, M, y);
  y += summary.length * 4 + 6; doc.setTextColor(0);
  doc.setFontSize(11); doc.text(`Trends — ${scale[0]?.toUpperCase()}${scale.slice(1)} grouping`, M, y); y += 5;
  doc.setFontSize(8);
  const notes = doc.splitTextToSize(`Current filtered history: ${n} runs, ${groupTestTrends(h, scale).length} time buckets. Local calendar dates; weeks start Monday. AI pass is not officer approval.`, CW);
  doc.text(notes, M, y); y += notes.length * 4 + 6;
  const labels = ["Confidence by outcome (%)", "Location match by outcome (%)", "Officer-review rate by outcome (%)", "Runs by outcome (count)"];
  for (const [i, chart] of charts.entries()) {
    if (y + 68 > 280) { doc.addPage(); y = M; }
    doc.setFontSize(10);
    doc.text(labels[i] ?? `Chart ${i + 1}`, M, y); y += 3;
    doc.addImage(chart, "PNG", M, y, CW, 58); y += 65;
  }
  doc.setFontSize(8);
  const seriesNote = doc.splitTextToSize("Outcomes: AI pass = solid green; officer review = dashed red; unexpected = dotted dark (solid in count chart). Unexpected means a mismatch with the chosen expectation and may overlap pass or review.", CW);
  doc.text(seriesNote, M, y); y += seriesNote.length * 4 + 4;
  const legend = doc.splitTextToSize("Confidence is the mean within each outcome per bucket. Location and review rates use that outcome’s run count. Missing outcomes are gaps, not zero. AI pass is not officer approval.", CW);
  doc.text(legend, M, y);
  doc.addPage(); y = M;
  doc.setFontSize(12); doc.text("Uploaded-photo test results", M, y); y += 8;
  const imgW = 22, imgH = 16, rowH = 24;
  for (const r of h) {
    if (y + rowH > 285) { doc.addPage(); y = M; }
    try { doc.addImage(r.before, "JPEG", M, y, imgW, imgH); doc.addImage(r.after, "JPEG", M + imgW + 1.5, y, imgW, imgH); } catch { /* skip broken thumb */ }
    doc.setFontSize(7); doc.text("Before", M, y + imgH + 3); doc.text("After", M + imgW + 1.5, y + imgH + 3);
    const x = M + 2 * imgW + 5, tw = CW - 2 * imgW - 5;
    doc.setFontSize(10);
    doc.text(`${r.actual.verdict === "REVIEW" ? "Officer review" : "Pass"} · ${r.actual.confidence}% confidence`, x, y + 4);
    doc.setFontSize(8); doc.setTextColor(90);
    doc.text(`Location: ${r.actual.sameLocation ? "same place" : "different place"} · Drain: ${r.actual.obstructionAfter ? "still blocked" : "cleared"}${r.fails ? ` · ${outcome(r)}` : ""}`, x, y + 9);
    doc.text(new Date(r.at).toLocaleString(), x, y + 13);
    const reason = doc.splitTextToSize(`AI: ${r.reason}`, tw);
    doc.text(reason.slice(0, 2), x, y + 17);
    doc.setTextColor(0);
    doc.setDrawColor(220); doc.line(M, y + rowH - 2, W - M, y + rowH - 2);
    y += rowH;
  }
  doc.save("nalasetu-photo-test-report.pdf");
}

type Filters = { date: string; conf: string; loc: string; review: string };
const FILTER_OPTS = {
  date: { all: "Any date", today: "Today", week: "Last 7 days" },
  conf: { all: "Any confidence", low: "Below 50%", mid: "50–79%", high: "80%+" },
  loc: { all: "Any location", same: "Same place", diff: "Different place" },
  review: { all: "Any result", review: "Officer review", pass: "Passed" },
} as const;
function applyFilters(h: Run[], f: Filters, from?: string, to?: string) {
  const now = Date.now(), day = 864e5;
  const fromT = from ? new Date(`${from}T00:00:00`).getTime() : undefined;
  const toT = to ? new Date(`${to}T23:59:59.999`).getTime() : undefined;
  return h.filter((r) => {
    const t = new Date(r.at).getTime();
    if (fromT !== undefined && t < fromT) return false;
    if (toT !== undefined && t > toT) return false;
    if (f.date === "today" && new Date(r.at).toDateString() !== new Date().toDateString()) return false;
    if (f.date === "week" && now - new Date(r.at).getTime() > 7 * day) return false;
    if (f.conf === "low" && r.actual.confidence >= 50) return false;
    if (f.conf === "mid" && (r.actual.confidence < 50 || r.actual.confidence >= 80)) return false;
    if (f.conf === "high" && r.actual.confidence < 80) return false;
    if (f.loc === "same" && !r.actual.sameLocation) return false;
    if (f.loc === "diff" && r.actual.sameLocation) return false;
    if (f.review === "review" && r.actual.verdict !== "REVIEW") return false;
    if (f.review === "pass" && r.actual.verdict !== "PASS") return false;
    return true;
  });
}

const TIPS = [
  "Stand in the same spot for both photos and frame the same landmark (wall, pole, culvert mouth, signboard).",
  "Keep the drain filling most of the frame; show the inlet or channel clearly.",
  "Shoot in daylight, no flash glare; avoid blurry or very dark photos.",
  "Before: show the silt, garbage or standing water. After: show the same stretch with the bed visible.",
  "Same angle and zoom in both — don't switch between wide and close-up.",
  "Avoid people or vehicles blocking the view, and don't reuse the same photo twice.",
];

export function UploadTest() {
  const verify = useServerFn(verifyProof);
  const [before, setBefore] = useState<string>();
  const [after, setAfter] = useState<string>();
  const [exp, setExp] = useState("none");
  const [busy, setBusy] = useState(false);
  const [out, setOut] = useState<Out>();
  const [err, setErr] = useState<string>();
  const [hist, setHist] = useState<Run[]>([]);
  const [filters, setFilters] = useState<Filters>({ date: "all", conf: "all", loc: "all", review: "all" });
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const filtered = useMemo(() => applyFilters(hist, filters, fromDate || undefined, toDate || undefined), [hist, filters, fromDate, toDate]);
  const [pdfBusy, setPdfBusy] = useState(false);
  const confidenceChart = useRef<HTMLDivElement>(null);
  const locationChart = useRef<HTMLDivElement>(null);
  const officerChart = useRef<HTMLDivElement>(null);
  const outcomeChart = useRef<HTMLDivElement>(null);
  useEffect(() => { try { setHist(JSON.parse(localStorage.getItem(KEY) ?? "[]")); } catch { /* ignore */ } }, []);
  const save = (h: Run[]) => { setHist(h); try { localStorage.setItem(KEY, JSON.stringify(h)); } catch { /* storage full */ } };
  const runPdf = async () => {
    setPdfBusy(true); setErr(undefined);
    try {
      const charts = await Promise.all([chartImage(confidenceChart.current), chartImage(locationChart.current), chartImage(officerChart.current), chartImage(outcomeChart.current)]);
      await exportPdf(filtered, scale, charts);
    } catch (e) { setErr(e instanceof Error ? e.message : "Could not export the report. Please try again."); }
    finally { setPdfBusy(false); }
  };
  const [viewerIdx, setViewerIdx] = useState<number>();
  const viewer = viewerIdx !== undefined ? filtered[viewerIdx] : undefined;
  const [zoom, setZoom] = useState(1);
  const [scale, setScale] = useState<TrendScale>("day");
  const [visibleOutcomes, setVisibleOutcomes] = useState<Record<OutcomeKey, boolean>>({ pass: true, review: true, unexpected: true });
  const chartData = useMemo(() => groupTestTrends(filtered, scale), [filtered, scale]);
  useEffect(() => {
    if (viewerIdx === undefined) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setViewerIdx(undefined);
      else if (e.key === "ArrowLeft") setViewerIdx((i) => (i === undefined ? i : Math.max(0, i - 1)));
      else if (e.key === "ArrowRight") setViewerIdx((i) => (i === undefined ? i : Math.min(filtered.length - 1, i + 1)));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [viewerIdx, filtered.length]);

  const pick = (set: (s: string) => void) => (ev: React.ChangeEvent<HTMLInputElement>) => {
    const f = ev.target.files?.[0]; if (!f) return;
    if (!f.type.startsWith("image/")) { setErr("Please choose a JPG or PNG photo."); return; }
    setErr(undefined); setOut(undefined); set(URL.createObjectURL(f));
  };

  const run = async () => {
    if (!before || !after) return;
    setBusy(true); setErr(undefined); setOut(undefined);
    try {
      const [b, a] = await Promise.all([urlToJpegDataUrl(before), urlToJpegDataUrl(after)]);
      const res = await verify({ data: { before: b, after: a, drainId: "TEST-UPLOAD", drainName: "Uploaded test" } });
      if (!res.ok) { setErr(res.error); return; }
      const actual: Actual = { verdict: res.verdict, confidence: res.confidence, sameLocation: res.sameLocation, obstructionAfter: res.obstructionAfter };
      const e = EXPECTS[exp]?.e;
      const o = { actual, reason: res.reason, fails: e ? checkExpectation(e, actual) : null };
      setOut(o);
      const [tb, ta] = await Promise.all([thumb(before), thumb(after)]);
      save([{ ...o, id: crypto.randomUUID(), at: new Date().toISOString(), expect: exp, before: tb, after: ta }, ...hist].slice(0, 30));
    } catch (e) { setErr((e as Error).message); } finally { setBusy(false); }
  };

  return (
    <section className="rounded-md border bg-card">
      <div className="border-b px-3 py-2"><div className="text-sm font-semibold">Test your own photos</div><div className="text-xs text-muted-foreground">Upload a real before and after photo. Runs the same AI check crews use; nothing is saved to tasks.</div></div>
      <details className="border-b px-3 py-2 text-xs">
        <summary className="cursor-pointer font-medium">How to take photos the AI can match confidently</summary>
        <ul className="mt-1.5 list-disc space-y-0.5 pl-4 text-muted-foreground">{TIPS.map((t) => <li key={t}>{t}</li>)}</ul>
      </details>
      <div className="grid grid-cols-2 gap-2 p-2">
        {([["Before", before, setBefore], ["After", after, setAfter]] as const).map(([l, src, set]) => (
          <label key={l} className="flex aspect-[4/3] cursor-pointer flex-col items-center justify-center overflow-hidden rounded border border-dashed bg-muted text-xs text-muted-foreground">
            {src ? <img src={src} alt={`${l} upload`} className="h-full w-full object-cover" /> : <><Upload className="mb-1 h-5 w-5" />Choose {l.toLowerCase()} photo</>}
            <input type="file" accept="image/*" className="sr-only" aria-label={`${l} photo`} onChange={pick(set)} />
          </label>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-2 px-3 pb-3">
        <select aria-label="Expected result" value={exp} onChange={(e) => setExp(e.target.value)} className="h-9 rounded-md border bg-background px-2 text-xs">
          {Object.entries(EXPECTS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
        <Button size="sm" onClick={run} disabled={!before || !after || busy}>{busy && <Loader2 className="h-4 w-4 animate-spin" />}Run check</Button>
      </div>
      <div className="space-y-1.5 px-3 pb-3 text-xs">
        {err && <p className="font-medium text-st-review">{err}</p>}
        {out && (<>
          {out.fails && <div className={`flex items-center gap-1 font-semibold ${out.fails.length ? "text-st-review" : "text-risk-low"}`}>{out.fails.length ? <XCircle className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}{out.fails.length ? "Unexpected result" : "As expected"}</div>}
          <div>AI: <b>{out.actual.verdict === "REVIEW" ? "REVIEW — sent to officer" : "PASS"}</b> · {out.actual.confidence}% · {out.actual.sameLocation ? "same place" : "different place"} · {out.actual.obstructionAfter ? "still blocked" : "cleared"}</div>
          <p className="text-muted-foreground">{out.reason}</p>
          {out.fails?.map((x) => <p key={x} className="text-st-review">✗ {x}</p>)}
        </>)}
      </div>
      <div className="border-t px-3 py-2">
        <div className="flex flex-wrap items-center gap-2">
          <div className="mr-auto text-sm font-semibold">My test runs ({filtered.length}{filtered.length !== hist.length ? ` of ${hist.length}` : ""})</div>
          <Button size="sm" variant="outline" disabled={!filtered.length || pdfBusy} onClick={runPdf}>{pdfBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileDown className="h-4 w-4" />}PDF</Button>
          <Button size="sm" variant="outline" disabled={!filtered.length} onClick={() => exportHtml(filtered)}><FileText className="h-4 w-4" />Report</Button>
          <Button size="sm" variant="outline" disabled={!filtered.length} onClick={() => exportCsv(filtered)}><Download className="h-4 w-4" />Runs CSV</Button>
          <Button size="sm" variant="ghost" disabled={!hist.length} onClick={() => confirm("Clear test history?") && save([])} aria-label="Clear history"><Trash2 className="h-4 w-4" /></Button>
        </div>
        {hist.length > 0 && (
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            {(Object.keys(FILTER_OPTS) as (keyof Filters)[]).map((k) => (
              <select key={k} aria-label={`Filter by ${k}`} value={filters[k]} onChange={(e) => setFilters({ ...filters, [k]: e.target.value })} className="h-7 rounded-md border bg-background px-1.5 text-[11px]">
                {Object.entries(FILTER_OPTS[k]).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            ))}
            <label className="flex items-center gap-1 text-[11px] text-muted-foreground">From
              <input type="date" aria-label="From date" value={fromDate} max={toDate || undefined} onChange={(e) => setFromDate(e.target.value)} className="h-7 rounded-md border bg-background px-1 text-[11px]" />
            </label>
            <label className="flex items-center gap-1 text-[11px] text-muted-foreground">To
              <input type="date" aria-label="To date" value={toDate} min={fromDate || undefined} onChange={(e) => setToDate(e.target.value)} className="h-7 rounded-md border bg-background px-1 text-[11px]" />
            </label>
            {(fromDate || toDate) && (
              <Button size="sm" variant="ghost" className="h-7 px-1.5 text-[11px]" onClick={() => { setFromDate(""); setToDate(""); }}>Clear dates</Button>
            )}
          </div>
        )}
        {!hist.length ? <p className="py-2 text-xs text-muted-foreground">No runs yet. Results appear here after each check.</p> : !filtered.length ? <p className="py-2 text-xs text-muted-foreground">No runs match these filters.</p> : (
          <>
            {chartData.length > 0 && (
              <div className="mt-2">
                <div className="mb-2 flex items-center gap-1.5">
                  <span className="text-[11px] text-muted-foreground">Group by</span>
                  {(["day", "week", "month"] as const).map((s) => (
                    <Button key={s} type="button" size="sm" variant={scale === s ? "default" : "outline"} onClick={() => setScale(s)} aria-pressed={scale === s}
                      className="h-7 px-2 text-[11px] capitalize">{s}</Button>
                  ))}
                  <Button type="button" size="sm" variant="outline" className="ml-auto h-7 px-2 text-[11px]" onClick={() => exportTrendsCsv(chartData, scale)} aria-label="Export trend data as CSV">
                    <Download className="h-3.5 w-3.5" />Trends CSV
                  </Button>
                </div>
                <div className="mb-2 flex flex-wrap items-center gap-1.5" aria-label="Visible outcome series">
                  <span className="mr-1 text-[11px] text-muted-foreground">Show outcomes</span>
                  {TREND_OUTCOMES.map(({ key, label, dash }) => (
                    <Button key={key} type="button" size="sm" variant={visibleOutcomes[key] ? "outline" : "ghost"}
                      className={`h-7 px-2 text-[11px] ${visibleOutcomes[key] ? "" : "opacity-50"}`}
                      aria-pressed={visibleOutcomes[key]} onClick={() => setVisibleOutcomes((current) => ({ ...current, [key]: !current[key] }))}>
                      <span aria-hidden="true" className={`w-5 border-t-2 ${dash ? "border-dashed" : "border-solid"} ${OUTCOME_CLASSES[key]}`} />
                      {label}
                    </Button>
                  ))}
                </div>
                <ChangeSummary buckets={chartData} />
                <div className="grid gap-2 sm:grid-cols-2">
                  {([
                    { metric: "confidence", title: `Confidence by outcome per ${scale} (avg %)`, ref: confidenceChart },
                    { metric: "location", title: `Location match by outcome per ${scale} (%)`, ref: locationChart },
                    { metric: "officer", title: `Officer-review rate by outcome per ${scale} (%)`, ref: officerChart },
                  ] as const).map(({ metric, title, ref }) => (
                    <div key={metric} ref={ref} className="rounded border p-2" role="figure" aria-label={title}>
                      <div className="mb-1 text-[11px] font-medium text-muted-foreground">{title}</div>
                      <ResponsiveContainer width="100%" height={180}>
                        <LineChart data={chartData} margin={{ top: 4, right: 8, bottom: 0, left: -24 }}>
                          <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                          <XAxis dataKey="t" tick={{ fontSize: 9 }} interval="preserveStartEnd" />
                          <YAxis domain={[0, 100]} tick={{ fontSize: 9 }} />
                          <Tooltip content={<TrendTooltip />} />
                          {TREND_OUTCOMES.map(({ key, label, color, dash }) => (
                            visibleOutcomes[key] && <Line key={key} type="linear" dataKey={`outcomes.${key}.${metric}`} name={label} stroke={color} strokeWidth={2} strokeDasharray={dash} connectNulls={false} dot={{ r: 3 }} isAnimationActive={false} />
                          ))}
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  ))}
                  <div ref={outcomeChart} className="rounded border p-2">
                    <div className="mb-1 text-[11px] font-medium text-muted-foreground">Runs by outcome per {scale} (count)</div>
                    <ResponsiveContainer width="100%" height={140}>
                      <LineChart data={chartData} margin={{ top: 4, right: 8, bottom: 0, left: -24 }}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                        <XAxis dataKey="t" tick={{ fontSize: 9 }} interval="preserveStartEnd" />
                        <YAxis allowDecimals={false} tick={{ fontSize: 9 }} />
                        <Tooltip content={<TrendTooltip />} />
                        {TREND_OUTCOMES.map(({ key, label, color, dash }) => (
                          visibleOutcomes[key] && <Line key={key} type="monotone" dataKey={COUNT_KEYS[key]} name={label} stroke={color} strokeWidth={2} strokeDasharray={dash} dot={{ r: 2 }} isAnimationActive={false} />
                        ))}
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}
            <ul className="mt-2 divide-y text-xs">
              {filtered.map((r) => (
                <li key={r.id} className="flex gap-2 py-2">
                  <button type="button" onClick={() => { setViewerIdx(filtered.indexOf(r)); setZoom(1); }} className="group relative flex shrink-0 gap-0.5" aria-label="Compare photos side by side">
                    <img src={r.before} alt="before" className="h-10 w-14 rounded object-cover" /><img src={r.after} alt="after" className="h-10 w-14 rounded object-cover" />
                    <span className="absolute inset-0 flex items-center justify-center rounded bg-black/0 text-white opacity-0 transition group-hover:bg-black/40 group-hover:opacity-100"><ZoomIn className="h-4 w-4" /></span>
                  </button>
                  <div className="min-w-0 flex-1">
                    <div><b className={r.actual.verdict === "REVIEW" ? "text-st-review" : "text-risk-low"}>{r.actual.verdict === "REVIEW" ? "Officer review" : "Pass"}</b> · {r.actual.confidence}% · {r.actual.sameLocation ? "same place" : "different place"} · {r.actual.obstructionAfter ? "still blocked" : "cleared"}{r.fails && ` · ${outcome(r)}`}</div>
                    <div className="truncate text-muted-foreground">{new Date(r.at).toLocaleString()} — {r.reason}</div>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
      {viewer && (
        <div className="fixed inset-0 z-50 flex flex-col bg-black/80 p-4" role="dialog" aria-label="Photo comparison" onClick={() => setViewerIdx(undefined)}>
          <div className="mx-auto flex w-full max-w-4xl items-center gap-2 text-white" onClick={(e) => e.stopPropagation()}>
            <Button size="sm" variant="ghost" className="text-white hover:bg-white/20" onClick={() => setViewerIdx((i) => (i === undefined ? i : Math.max(0, i - 1)))} disabled={viewerIdx === 0} aria-label="Previous run"><ChevronLeft className="h-5 w-5" /></Button>
            <div className="mr-auto min-w-0 text-sm font-medium">
              <span className="mr-2 rounded bg-white/15 px-1.5 py-0.5 text-xs">{(viewerIdx ?? 0) + 1} of {filtered.length}</span>
              {new Date(viewer.at).toLocaleString()} · {viewer.actual.verdict === "REVIEW" ? "Officer review" : "Pass"} · {viewer.actual.confidence}%
            </div>
            <label className="flex items-center gap-2 text-xs">Zoom
              <input type="range" min={1} max={4} step={0.25} value={zoom} onChange={(e) => setZoom(Number(e.target.value))} aria-label="Zoom level" className="w-32" />
              <span className="w-10">{Math.round(zoom * 100)}%</span>
            </label>
            <Button size="sm" variant="ghost" className="text-white hover:bg-white/20" onClick={() => setViewerIdx((i) => (i === undefined ? i : Math.min(filtered.length - 1, i + 1)))} disabled={viewerIdx === filtered.length - 1} aria-label="Next run"><ChevronRight className="h-5 w-5" /></Button>
            <Button size="sm" variant="ghost" className="text-white hover:bg-white/20" onClick={() => setViewerIdx(undefined)} aria-label="Close viewer"><X className="h-5 w-5" /></Button>
          </div>
          <div className="mx-auto mt-3 grid w-full max-w-4xl flex-1 grid-cols-2 gap-2 overflow-auto" onClick={(e) => e.stopPropagation()}>
            {([["Before", viewer.before], ["After", viewer.after]] as const).map(([l, src]) => (
              <figure key={l} className="flex min-h-0 flex-col">
                <figcaption className="mb-1 text-center text-xs font-semibold uppercase tracking-wide text-white/80">{l}</figcaption>
                <div className="flex-1 overflow-auto rounded bg-black/40">
                  <img src={src} alt={`${l} photo`} style={{ width: `${zoom * 100}%` }} className="max-w-none" />
                </div>
              </figure>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
