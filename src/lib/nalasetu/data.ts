import type { Crew, DrainBase, Slope } from "./types";

/** Synthetic demo dataset — NOT real municipal data. Deterministic. */
const WARD = "Demo Ward 7 (synthetic)";

const FIXED: DrainBase[] = [
  { id: "D-104", name: "Minto Road Underpass Drain", lat: 28.632, lng: 77.222, slope: "Low", lowLying: true, historicalChokes: 5, lastCleaned: "2026-09-02", citizenReports: 6, rainfallForecastMm: 55, cleaningTimeMin: 35, adjacentPopulationWeight: 9, ward: WARD },
  { id: "D-072", name: "ITO Junction East Drain", lat: 28.628, lng: 77.241, slope: "Low", lowLying: true, historicalChokes: 4, lastCleaned: "2026-08-21", citizenReports: 5, rainfallForecastMm: 48, cleaningTimeMin: 30, adjacentPopulationWeight: 8, ward: WARD },
  { id: "D-031", name: "Connaught Outer Circle Drain", lat: 28.634, lng: 77.218, slope: "Medium", lowLying: false, historicalChokes: 3, lastCleaned: "2026-08-10", citizenReports: 3, rainfallForecastMm: 35, cleaningTimeMin: 25, adjacentPopulationWeight: 6, ward: WARD },
  { id: "D-018", name: "Barakhamba Slope Drain", lat: 28.629, lng: 77.226, slope: "High", lowLying: false, historicalChokes: 1, lastCleaned: "2026-09-15", citizenReports: 1, rainfallForecastMm: 18, cleaningTimeMin: 20, adjacentPopulationWeight: 3, ward: WARD },
];

const STREETS = ["Janpath", "Tolstoy Marg", "Kasturba Gandhi Marg", "Bahadur Shah Zafar Marg", "Mandi House", "Bengali Market", "Pragati Maidan", "Tilak Bridge", "Sikandra Road", "Firozshah Road", "Ashoka Road", "Ferozshah Kotla", "Daryaganj", "Asaf Ali Road", "Delhi Gate", "Ajmeri Gate", "Paharganj Link", "Gole Market", "Baba Kharak Singh Marg", "Bhagwan Das Road", "Copernicus Marg", "Mathura Road", "Vikas Marg Spur", "Rajghat Service", "Shanti Path", "Raisina Spur", "Pandara Road", "Barakhamba Lane", "Hailey Road", "Babar Road", "Curzon Road", "Kamla Market", "Turkman Gate", "Chitragupta Road", "Deen Dayal Marg", "Lodhi Estate Link"];
const KIND = ["Drain", "Storm Drain", "Culvert", "Nala Segment", "Side Drain"];

// Profiles: [slope, chokes, reports, rain] chosen so the dataset lands at 10 HIGH / 14 MEDIUM / 16 LOW under heavy scenario.
type P = [Slope, number, number, number];
const HIGH_P: P[] = [["Low", 4, 4, 55], ["Low", 5, 3, 55], ["Low", 3, 5, 55], ["Medium", 5, 6, 55], ["Low", 4, 2, 55], ["Low", 3, 4, 55], ["Low", 5, 5, 55], ["Medium", 4, 6, 55]];
const MED_P: P[] = [["Medium", 2, 2, 55], ["Medium", 3, 1, 55], ["Low", 1, 1, 55], ["Medium", 2, 3, 55], ["High", 4, 3, 55], ["Medium", 1, 2, 55], ["Low", 2, 0, 55], ["High", 3, 4, 55], ["Medium", 2, 1, 55], ["Medium", 3, 2, 55], ["High", 4, 2, 55], ["Low", 1, 2, 55], ["Medium", 2, 2, 55]];
const LOW_P: P[] = [["High", 0, 0, 20], ["High", 1, 0, 25], ["High", 1, 1, 15], ["Medium", 0, 0, 20], ["High", 0, 1, 30], ["High", 2, 0, 20], ["Medium", 1, 0, 15], ["High", 0, 0, 25], ["High", 1, 1, 20], ["Medium", 0, 1, 18], ["High", 2, 1, 15], ["High", 0, 0, 22], ["High", 1, 0, 30], ["Medium", 1, 0, 12], ["High", 0, 2, 20], ["High", 1, 0, 18]];

function rng(seed: number) {
  let s = seed;
  return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
}

export function buildDemoDrains(): DrainBase[] {
  const r = rng(42);
  const out: DrainBase[] = [...FIXED];
  const profiles = [...HIGH_P, ...MED_P, ...LOW_P];
  // D-031 counts as MEDIUM, D-018 as LOW, D-104 & D-072 HIGH → 8+13+15 generated? adjust: profiles = 8 H, 13 M, 16 L → total 10H/14M/17L-1
  profiles.splice(profiles.length - 1, 1);
  profiles.forEach((p, i) => {
    const [slope, chokes, reports, rain] = p;
    const n = 100 + i * 7 + 3;
    const id = `D-${String((n % 190) + 2).padStart(3, "0")}`;
    const month = 6 + Math.floor(r() * 4);
    const day = 1 + Math.floor(r() * 27);
    out.push({
      id: out.some((d) => d.id === id) ? `D-${200 + i}` : id,
      name: `${STREETS[i % STREETS.length]} ${KIND[i % KIND.length]}`,
      lat: +(28.61 + r() * 0.04).toFixed(4),
      lng: +(77.2 + r() * 0.05).toFixed(4),
      slope,
      lowLying: slope === "Low",
      historicalChokes: chokes,
      lastCleaned: `2026-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
      citizenReports: reports,
      rainfallForecastMm: rain,
      cleaningTimeMin: 15 + Math.floor(r() * 5) * 5,
      adjacentPopulationWeight: 1 + Math.floor(r() * 9),
      ward: WARD,
    });
  });
  return out;
}

export const DEMO_CREWS: Crew[] = [
  { id: "C-A", name: "Team Alpha", availableHours: 6, homeBaseLat: 28.625, homeBaseLng: 77.215, status: "Available" },
  { id: "C-B", name: "Team Bravo", availableHours: 5, homeBaseLat: 28.64, homeBaseLng: 77.235, status: "Available" },
  { id: "C-C", name: "Team Charlie", availableHours: 4, homeBaseLat: 28.618, homeBaseLng: 77.245, status: "Available" },
];

export const SCENARIO_MM = { heavy: 55, light: 18 } as const;

export const crewName = (id: string) => DEMO_CREWS.find((c) => c.id === id)?.name ?? id;
