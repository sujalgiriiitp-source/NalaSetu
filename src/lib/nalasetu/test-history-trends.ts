export type TrendScale = "day" | "week" | "month";
export type TrendMetric = "confidence" | "location" | "officer";
export const TREND_OUTCOMES = [
  { key: "pass", label: "AI pass", color: "var(--risk-low)", dash: undefined },
  { key: "review", label: "Officer review", color: "var(--st-review)", dash: "5 3" },
  { key: "unexpected", label: "Unexpected", color: "var(--primary)", dash: "2 3" },
] as const;
type OutcomeMetrics = { runCount: number; confidence: number | null; location: number | null; officer: number | null };
type TrendRun = { at: string; actual: { confidence: number; sameLocation: boolean; verdict: string }; fails?: string[] | null };
export type TrendBucket = {
  t: string; dateRange: string; runCount: number;
  confidence: number; location: number; officer: number;
  locationCount: number; officerCount: number;
  passCount: number; unexpectedCount: number;
  outcomes: Record<(typeof TREND_OUTCOMES)[number]["key"], OutcomeMetrics>;
};

export type TrendChange = {
  metric: TrendMetric;
  delta: number;
  from: string;
  to: string;
};

export type OutcomeTrendSummary = {
  key: (typeof TREND_OUTCOMES)[number]["key"];
  changes: Record<TrendMetric, TrendChange | null>;
};

// Largest adjacent change between populated buckets for each outcome and metric.
export function summarizeTrendChanges(buckets: TrendBucket[]): OutcomeTrendSummary[] {
  const metrics: TrendMetric[] = ["confidence", "location", "officer"];
  return TREND_OUTCOMES.map(({ key }) => {
    const changes = Object.fromEntries(metrics.map((metric) => {
      const populated = buckets.flatMap((bucket) => {
        const value = bucket.outcomes[key][metric];
        return value === null ? [] : [{ value, label: bucket.t }];
      });
      let largest: TrendChange | null = null;
      for (let i = 1; i < populated.length; i += 1) {
        const previous = populated[i - 1];
        const current = populated[i];
        if (!previous || !current) continue;
        const candidate = { metric, delta: current.value - previous.value, from: previous.label, to: current.label };
        if (!largest || Math.abs(candidate.delta) > Math.abs(largest.delta)) largest = candidate;
      }
      return [metric, largest];
    })) as Record<TrendMetric, TrendChange | null>;
    return { key, changes };
  });
}

// Local calendar buckets, with Monday-start weeks, shared by charts and reports.
export function groupTestTrends(runs: TrendRun[], scale: TrendScale): TrendBucket[] {
  const buckets = new Map<number, { start: Date; end: Date; runs: TrendRun[] }>();
  for (const run of runs) {
    const start = new Date(run.at);
    if (!Number.isFinite(start.getTime())) continue;
    start.setHours(0, 0, 0, 0);
    if (scale === "week") start.setDate(start.getDate() - ((start.getDay() + 6) % 7));
    if (scale === "month") start.setDate(1);
    const end = new Date(start);
    if (scale === "week") end.setDate(end.getDate() + 6);
    if (scale === "month") { end.setMonth(end.getMonth() + 1); end.setDate(0); }
    const bucket = buckets.get(start.getTime()) ?? { start, end, runs: [] };
    bucket.runs.push(run);
    buckets.set(start.getTime(), bucket);
  }
  const fullDate = (d: Date) => d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  return [...buckets.entries()].sort(([a], [b]) => a - b).map(([, b]) => {
    const runCount = b.runs.length;
    const locationCount = b.runs.filter((r) => r.actual.sameLocation).length;
    const officerCount = b.runs.filter((r) => r.actual.verdict === "REVIEW").length;
    const passCount = b.runs.filter((r) => r.actual.verdict === "PASS").length;
    const unexpectedCount = b.runs.filter((r) => (r.fails?.length ?? 0) > 0).length;
    const metrics = (runs: TrendRun[]): OutcomeMetrics => ({
      runCount: runs.length,
      confidence: runs.length ? Math.round(runs.reduce((sum, r) => sum + r.actual.confidence, 0) / runs.length) : null,
      location: runs.length ? Math.round(runs.filter((r) => r.actual.sameLocation).length / runs.length * 100) : null,
      officer: runs.length ? Math.round(runs.filter((r) => r.actual.verdict === "REVIEW").length / runs.length * 100) : null,
    });
    const short = b.start.toLocaleDateString("en-GB", scale === "month" ? { month: "short", year: "numeric" } : { month: "short", day: "numeric" });
    return {
      t: scale === "week" ? `Wk of ${short}` : short,
      dateRange: scale === "day" ? fullDate(b.start) : `${fullDate(b.start)} – ${fullDate(b.end)}`,
      runCount, locationCount, officerCount, passCount, unexpectedCount,
      outcomes: {
        pass: metrics(b.runs.filter((r) => r.actual.verdict === "PASS")),
        review: metrics(b.runs.filter((r) => r.actual.verdict === "REVIEW")),
        unexpected: metrics(b.runs.filter((r) => (r.fails?.length ?? 0) > 0)),
      },
      confidence: Math.round(b.runs.reduce((s, r) => s + r.actual.confidence, 0) / runCount),
      location: Math.round(locationCount / runCount * 100),
      officer: Math.round(officerCount / runCount * 100),
    };
  });
}
