import { describe, expect, it } from "vitest";
import { groupTestTrends, summarizeTrendChanges } from "@/lib/nalasetu/test-history-trends";

const run = (at: string, confidence: number, sameLocation = true, verdict = "PASS", fails: string[] | null = null) => ({ at, actual: { confidence, sameLocation, verdict }, fails });
describe("Test history calendar trends", () => {
  it("computes rates within each outcome and leaves absent outcomes as gaps", () => {
    for (const scale of ["day", "week", "month"] as const) {
      const [bucket] = groupTestTrends([run("2026-10-07T09:00:00", 90), run("2026-10-07T10:00:00", 50, false, "PASS", ["unexpected"]), run("2026-10-07T11:00:00", 30, true, "REVIEW", ["unexpected"])], scale);
      expect(bucket?.outcomes.pass).toEqual({ runCount: 2, confidence: 70, location: 50, officer: 0 });
      expect(bucket?.outcomes.review).toEqual({ runCount: 1, confidence: 30, location: 100, officer: 100 });
      expect(bucket?.outcomes.unexpected).toEqual({ runCount: 2, confidence: 40, location: 50, officer: 50 });
    }
    expect(groupTestTrends([run("2026-10-07T09:00:00", 90)], "day")[0]?.outcomes.review).toEqual({ runCount: 0, confidence: null, location: null, officer: null });
  });
  it("sorts runs and computes all metric values and counts", () => {
    const data = groupTestTrends([run("2026-10-07T12:00:00", 20, false, "REVIEW"), run("2026-10-06T12:00:00", 90), run("2026-10-07T08:00:00", 80)], "day");
    expect(data.map((b) => b.runCount)).toEqual([1, 2]);
    expect(data[1]).toMatchObject({ confidence: 50, location: 50, officer: 50, locationCount: 1, officerCount: 1, passCount: 1, unexpectedCount: 0, dateRange: "7 Oct 2026" });
  });
  it("uses Monday to Sunday weeks across a year boundary", () => {
    const data = groupTestTrends([run("2027-01-03T12:00:00", 90), run("2026-12-28T12:00:00", 70), run("2027-01-04T12:00:00", 80)], "week");
    expect(data[0]).toMatchObject({ runCount: 2, dateRange: "28 Dec 2026 – 3 Jan 2027", confidence: 80 });
    expect(data).toHaveLength(2);
  });
  it("uses full month bounds including leap years and ignores invalid dates", () => {
    expect(groupTestTrends([run("2028-02-15T12:00:00", 75), run("invalid", 5)], "month")[0]?.dateRange).toBe("1 Feb 2028 – 29 Feb 2028");
    expect(groupTestTrends([], "day")).toEqual([]);
  });
  it("counts pass, officer-review and unexpected outcomes separately per bucket", () => {
    const data = groupTestTrends([run("2026-10-07T09:00:00", 85, true, "PASS", ["expected cleared but still blocked"]), run("2026-10-07T10:00:00", 90), run("2026-10-07T11:00:00", 30, false, "REVIEW")], "day");
    expect(data[0]).toMatchObject({ runCount: 3, passCount: 2, officerCount: 1, unexpectedCount: 1 });
  });
  it("finds each outcome's largest adjacent confidence and rate changes", () => {
    const buckets = groupTestTrends([
      run("2026-10-05T09:00:00", 90, true, "PASS"),
      run("2026-10-06T09:00:00", 60, false, "PASS"),
      run("2026-10-07T09:00:00", 80, true, "PASS"),
      run("2026-10-05T10:00:00", 20, false, "REVIEW"),
      run("2026-10-07T10:00:00", 50, true, "REVIEW"),
    ], "day");
    const summaries = summarizeTrendChanges(buckets);
    expect(summaries.find((summary) => summary.key === "pass")?.changes).toMatchObject({
      confidence: { delta: -30, from: "5 Oct", to: "6 Oct" },
      location: { delta: -100, from: "5 Oct", to: "6 Oct" },
      officer: { delta: 0, from: "5 Oct", to: "6 Oct" },
    });
    expect(summaries.find((summary) => summary.key === "review")?.changes.confidence).toMatchObject({ delta: 30, from: "5 Oct", to: "7 Oct" });
    expect(summaries.find((summary) => summary.key === "unexpected")?.changes.confidence).toBeNull();
  });
});
