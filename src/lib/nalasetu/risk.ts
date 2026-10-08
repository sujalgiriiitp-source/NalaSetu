import type { DrainBase, RiskBand, Slope } from "./types";

export const WEIGHTS = { R: 0.4, H: 0.25, S: 0.2, C: 0.15 } as const;
const SLOPE_FACTOR: Record<Slope, number> = { Low: 100, Medium: 55, High: 20 };

export function riskFactors(d: Pick<DrainBase, "historicalChokes" | "slope" | "citizenReports">, forecastMm72: number) {
  const R = Math.min(100, (forecastMm72 / 60) * 100);
  const H = Math.min(100, (d.historicalChokes / 5) * 100);
  const S = SLOPE_FACTOR[d.slope];
  const C = Math.min(100, (d.citizenReports / 6) * 100);
  return { R, H, S, C };
}

export function scoreRisk(d: Pick<DrainBase, "historicalChokes" | "slope" | "citizenReports">, forecastMm72: number) {
  const f = riskFactors(d, forecastMm72);
  const contrib = {
    rainfall: WEIGHTS.R * f.R,
    history: WEIGHTS.H * f.H,
    terrain: WEIGHTS.S * f.S,
    citizen: WEIGHTS.C * f.C,
  };
  const raw = contrib.rainfall + contrib.history + contrib.terrain + contrib.citizen;
  const score = Math.round(raw);
  return { raw, score, band: bandFor(score), factors: f, contrib };
}

export function bandFor(score: number): RiskBand {
  if (score >= 70) return "HIGH";
  if (score >= 40) return "MEDIUM";
  return "LOW";
}

export function reasons(d: DrainBase, forecastMm72: number): string[] {
  const out = [`${Math.round(forecastMm72)}mm rainfall forecast in next 72h`];
  out.push(`${d.historicalChokes} historical choke incident${d.historicalChokes === 1 ? "" : "s"}`);
  out.push(d.lowLying ? "Low-lying location" : `${d.slope} slope terrain`);
  out.push(`${d.citizenReports} citizen report${d.citizenReports === 1 ? "" : "s"} in last 30 days`);
  return out;
}

export function recommendation(band: RiskBand) {
  return band === "HIGH" ? "Clean before rain window start - 2h" : band === "MEDIUM" ? "Clean if crew-hours remain" : "Monitor";
}

export function explanation(d: DrainBase, forecastMm72: number, band: RiskBand) {
  const parts: string[] = [];
  const hi: string[] = [];
  if (forecastMm72 >= 40) { parts.push("heavy forecast rainfall"); hi.push("baarish ka forecast zyada hai"); }
  if (d.historicalChokes >= 3) { parts.push("repeated choke history"); hi.push("drain pe pehle choke hua hai"); }
  if (d.slope === "Low") { parts.push("low-lying terrain"); hi.push("location low-lying hai"); }
  if (d.citizenReports >= 3) { parts.push("multiple citizen reports"); hi.push("logon ne complaint ki hai"); }
  const label = band === "HIGH" ? "High" : band === "MEDIUM" ? "Medium" : "Low";
  const en = parts.length ? `${label} risk due to ${joinList(parts)}.` : `${label} risk; no dominant factor.`;
  const hin = hi.length ? `Risk ${label.toLowerCase()} hai kyunki ${hi.join(", ")}.` : `Risk ${label.toLowerCase()} hai.`;
  return { en, hin };
}

function joinList(a: string[]) {
  return a.length <= 1 ? a.join("") : a.slice(0, -1).join(", ") + " and " + a[a.length - 1];
}
