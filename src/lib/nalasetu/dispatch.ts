import type { Crew, CrewPlan, Drain, Plan } from "./types";

/** Configurable average urban crew-vehicle speed for travel estimates (straight-line, not road routing). */
export const AVG_SPEED_KMH = 15;
export const ROAD_FACTOR = 1.3; // straight-line → rough road estimate

export function haversineKm(aLat: number, aLng: number, bLat: number, bLng: number) {
  const R = 6371;
  const dLat = ((bLat - aLat) * Math.PI) / 180;
  const dLng = ((bLng - aLng) * Math.PI) / 180;
  const x = Math.sin(dLat / 2) ** 2 + Math.cos((aLat * Math.PI) / 180) * Math.cos((bLat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(x));
}
export const travelMin = (km: number) => ((km * ROAD_FACTOR) / AVG_SPEED_KMH) * 60;

/** Grid clustering (~1.1km cells). */
export function cellOf(lat: number, lng: number, size = 0.01) {
  return `${Math.floor(lat / size)}:${Math.floor(lng / size)}`;
}

function routeKm(start: { lat: number; lng: number }, stops: Drain[]) {
  let km = 0, cur = start;
  for (const s of stops) { km += haversineKm(cur.lat, cur.lng, s.lat, s.lng) * ROAD_FACTOR; cur = s; }
  return km;
}

/** Nearest-neighbour ordering from a home base. */
export function nearestNeighbour(start: { lat: number; lng: number }, stops: Drain[]) {
  const left = [...stops], out: Drain[] = [];
  let cur = start;
  while (left.length) {
    let bi = 0, bd = Infinity;
    left.forEach((d, i) => { const k = haversineKm(cur.lat, cur.lng, d.lat, d.lng); if (k < bd) { bd = k; bi = i; } });
    const n = left.splice(bi, 1)[0]!;
    out.push(n); cur = n;
  }
  return out;
}

function summarize(crew: Crew, stops: Drain[]): CrewPlan {
  const home = { lat: crew.homeBaseLat, lng: crew.homeBaseLng };
  const km = routeKm(home, stops);
  const cleaning = stops.reduce((a, d) => a + d.cleaningTimeMin, 0);
  const travel = (km / AVG_SPEED_KMH) * 60;
  return { crewId: crew.id, drainIds: stops.map((d) => d.id), cleaningMin: cleaning, travelMin: Math.round(travel), totalMin: Math.round(cleaning + travel), distanceKm: +km.toFixed(2) };
}

/**
 * Optimized plan:
 * 1. candidates HIGH+MEDIUM, 2. grid cluster, 3. greedy knapsack by score / (clean + marginal travel),
 * 4. nearest-neighbour route per crew. Never exceeds crew-hours.
 */
export function optimizePlan(drains: Drain[], crews: Crew[]): Omit<Plan, "id" | "createdAt" | "dispatched" | "naiveHighCoverage"> {
  const cand = drains.filter((d) => (d.riskBand === "HIGH" || d.riskBand === "MEDIUM") && d.status === "UNASSIGNED");
  const clusters = new Map<string, Drain[]>();
  cand.forEach((d) => { const c = cellOf(d.lat, d.lng); clusters.set(c, [...(clusters.get(c) ?? []), d]); });
  const clusterOf = new Map(cand.map((d) => [d.id, cellOf(d.lat, d.lng)]));

  const state = crews.map((c) => ({ crew: c, stops: [] as Drain[], used: 0, pos: { lat: c.homeBaseLat, lng: c.homeBaseLng } }));
  const remaining = new Set(cand.map((d) => d.id));
  const byId = new Map(cand.map((d) => [d.id, d]));

  for (;;) {
    let best: { si: number; d: Drain; ratio: number; cost: number } | null = null;
    for (let si = 0; si < state.length; si++) {
      const s = state[si]!;
      const cap = s.crew.availableHours * 60;
      for (const id of remaining) {
        const d = byId.get(id)!;
        const t = travelMin(haversineKm(s.pos.lat, s.pos.lng, d.lat, d.lng));
        const cost = d.cleaningTimeMin + t;
        if (s.used + cost > cap) continue;
        // band priority: HIGH strictly before MEDIUM; cluster affinity bonus
        const last = s.stops[s.stops.length - 1];
        const affinity = last && clusterOf.get(last.id) === clusterOf.get(d.id) ? 1.15 : 1;
        const ratio = ((d.riskScore + (d.riskBand === "HIGH" ? 1000 : 0)) / cost) * affinity;
        if (!best || ratio > best.ratio) best = { si, d, ratio, cost };
      }
    }
    if (!best) break;
    const s = state[best.si]!;
    s.stops.push(best.d); s.used += best.cost; s.pos = best.d; remaining.delete(best.d.id);
  }

  const crewPlans = state.map((s) => {
    const routed = nearestNeighbour({ lat: s.crew.homeBaseLat, lng: s.crew.homeBaseLng }, s.stops);
    return summarize(s.crew, routed);
  });
  const hoursAvailable = crews.reduce((a, c) => a + c.availableHours, 0);
  const hoursPlanned = +(crewPlans.reduce((a, c) => a + c.totalMin, 0) / 60).toFixed(1);
  return { crews: crewPlans, hoursAvailable, hoursPlanned, highCoverage: coverage(drains, crewPlans.flatMap((c) => c.drainIds)) };
}

/** Naive baseline: sort by score, round-robin crews in order, no geographic awareness. */
export function naivePlan(drains: Drain[], crews: Crew[]) {
  const sorted = drains.filter((d) => d.status === "UNASSIGNED" && d.riskBand !== "LOW").sort((a, b) => b.riskScore - a.riskScore);
  const st = crews.map((c) => ({ c, used: 0, pos: { lat: c.homeBaseLat, lng: c.homeBaseLng }, ids: [] as string[] }));
  let ci = 0;
  for (const d of sorted) {
    let placed = false;
    for (let k = 0; k < st.length; k++) {
      const s = st[(ci + k) % st.length]!;
      const cost = d.cleaningTimeMin + travelMin(haversineKm(s.pos.lat, s.pos.lng, d.lat, d.lng));
      if (s.used + cost <= s.c.availableHours * 60) { s.used += cost; s.pos = d; s.ids.push(d.id); placed = true; break; }
    }
    if (!placed) break; // naive stops at first item that doesn't fit
    ci++;
  }
  return { highCoverage: coverage(drains, st.flatMap((s) => s.ids)) };
}

export function coverage(drains: Drain[], ids: string[]) {
  const high = drains.filter((d) => d.riskBand === "HIGH");
  if (!high.length) return 0;
  const set = new Set(ids);
  return Math.round((high.filter((d) => set.has(d.id)).length / high.length) * 100);
}

export function fmtMin(m: number) {
  const h = Math.floor(m / 60), mm = Math.round(m % 60);
  return h ? `${h}h ${mm}m` : `${mm}m`;
}
