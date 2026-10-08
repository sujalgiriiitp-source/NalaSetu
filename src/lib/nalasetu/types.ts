export type Slope = "Low" | "Medium" | "High";
export type RiskBand = "HIGH" | "MEDIUM" | "LOW";
export type TaskStatus =
  | "UNASSIGNED"
  | "ASSIGNED"
  | "EN_ROUTE"
  | "CLEANING"
  | "PROOF_SUBMITTED"
  | "VERIFIED"
  | "NEEDS_REVIEW"
  | "REJECTED";

export interface DrainBase {
  id: string;
  name: string;
  lat: number;
  lng: number;
  slope: Slope;
  lowLying: boolean;
  historicalChokes: number;
  lastCleaned: string;
  citizenReports: number;
  /** per-drain rainfall exposure under the heavy scenario (mm/72h) */
  rainfallForecastMm: number;
  cleaningTimeMin: number;
  adjacentPopulationWeight: number;
  ward: string;
}

export interface Drain extends DrainBase {
  status: TaskStatus;
  riskScore: number;
  riskBand: RiskBand;
}

export interface Crew {
  id: string;
  name: string;
  availableHours: number;
  homeBaseLat: number;
  homeBaseLng: number;
  status: "Available" | "Dispatched";
}

export interface AuditEntry {
  id: string;
  timestamp: string;
  actor: string;
  drainId: string;
  oldStatus: TaskStatus | null;
  newStatus: TaskStatus | null;
  reason: string;
}

export interface Verification {
  verdict: "PASS" | "REVIEW";
  confidence: number;
  reason: string;
  mode: "lovable-ai" | "bedrock" | "demo";
}

export interface Task {
  id: string;
  drainId: string;
  crewId: string;
  order: number;
  status: TaskStatus;
  beforePhoto?: string;
  afterPhoto?: string;
  submittedAt?: string;
  verification?: Verification;
  officerDecision?: "APPROVED" | "REJECTED";
  officerAt?: string;
}

export interface CrewPlan {
  crewId: string;
  drainIds: string[];
  cleaningMin: number;
  travelMin: number;
  totalMin: number;
  distanceKm: number;
}

export interface Plan {
  id: string;
  createdAt: string;
  crews: CrewPlan[];
  hoursAvailable: number;
  hoursPlanned: number;
  highCoverage: number;
  naiveHighCoverage: number;
  dispatched: boolean;
}

export interface CitizenReport {
  id: string;
  drainId: string;
  issue: string;
  location: string;
  createdAt: string;
}

export type Scenario = "heavy" | "light";
