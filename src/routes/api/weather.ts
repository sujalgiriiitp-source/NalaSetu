import { createFileRoute } from "@tanstack/react-router";

let cache: { forecastMm72h: number; hourly: { time: string; mm: number }[]; fetchedAt: string } | null = null;

export const Route = createFileRoute("/api/weather")({
  server: {
    handlers: {
      GET: async () => {
        try {
          const url = "https://api.open-meteo.com/v1/forecast?latitude=28.63&longitude=77.22&hourly=precipitation&forecast_days=3&timezone=Asia%2FKolkata";
          const r = await fetch(url, { signal: AbortSignal.timeout(6000) });
          if (!r.ok) throw new Error(`HTTP ${r.status}`);
          const j = (await r.json()) as { hourly: { time: string[]; precipitation: number[] } };
          const hourly = j.hourly.time.slice(0, 72).map((t, i) => ({ time: t, mm: j.hourly.precipitation[i] ?? 0 }));
          const total = +hourly.reduce((a, h) => a + h.mm, 0).toFixed(1);
          cache = { forecastMm72h: total, hourly, fetchedAt: new Date().toISOString() };
          return Response.json({ ...cache, source: "live" });
        } catch {
          if (cache) return Response.json({ ...cache, source: "cached" });
          return Response.json({ forecastMm72h: 55, hourly: [], fetchedAt: new Date().toISOString(), source: "demo" });
        }
      },
    },
  },
});
