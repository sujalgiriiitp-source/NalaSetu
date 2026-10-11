import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { toast } from "sonner";
import { buildDemoDrains, crewName, DEMO_CREWS, SCENARIO_MM } from "./data";
import { scoreRisk } from "./risk";
import { naivePlan, optimizePlan } from "./dispatch";
import { canTransition, STATUS_LABEL } from "./state-machine";
import { verifyProof } from "./ai-verify.functions";
import type { Verification } from "./types";
import type { AuditEntry, CitizenReport, Crew, Drain, DrainBase, Plan, Scenario, Task, TaskStatus } from "./types";
import {
  AWS_CONFIGURED,
  listDrains,
  generatePlanAws,
  dispatchPlan as dispatchPlanAws,
  patchTask,
  submitProofAws,
  reviewProofAws,
  patchSettings,
  type AwsDrain,
  type IntegrationStatus,
  type VerificationMode,
} from "./aws-api";

export type WeatherMode = "demo" | "live";
export type AwsConnStatus = "idle" | "checking" | "connected" | "error" | "unconfigured";
export interface WeatherInfo { forecastMm72h: number; source: "live" | "cached" | "demo"; fetchedAt: string; hourly?: { time: string; mm: number }[] }
export interface BedrockVerificationStatus {
  status: IntegrationStatus | "CHECKING";
  checkedAt: string | null;
  message: string;
}

interface Persisted {
  scenario: Scenario;
  weatherMode: WeatherMode;
  bases: DrainBase[];
  statuses: Record<string, TaskStatus>;
  tasks: Task[];
  plan: Plan | null;
  audit: AuditEntry[];
  reports: CitizenReport[];
  weatherCache: WeatherInfo | null;
}

const KEY = "nalasetu.demo.v1";
const fresh = (): Persisted => ({ scenario: "heavy", weatherMode: "demo", bases: buildDemoDrains(), statuses: {}, tasks: [], plan: null, audit: [], reports: [], weatherCache: null });
const uid = (p: string) => `${p}-${Date.now().toString(36)}${Math.floor(Math.random() * 1e4).toString(36)}`.toUpperCase();

interface Ctx {
  ready: boolean;
  /** true when AWS API Gateway is configured (VITE_NALASETU_API_URL is set) */
  awsMode: boolean;
  awsStatus: AwsConnStatus;
  awsDrainSource: "dynamodb" | "demo" | null;
  refreshAwsConnection: () => Promise<void>;
  bedrockVerification: BedrockVerificationStatus;
  scenario: Scenario;
  weatherMode: WeatherMode;
  weather: WeatherInfo;
  forecastMm: number;
  drains: Drain[];
  crews: Crew[];
  tasks: Task[];
  plan: Plan | null;
  audit: AuditEntry[];
  reports: CitizenReport[];
  drainRain: (d: DrainBase) => number;
  setScenario: (s: Scenario) => void;
  setWeatherMode: (m: WeatherMode) => void;
  refreshWeather: () => Promise<void>;
  generatePlan: () => Plan;
  removeFromPlan: (crewId: string, drainId: string) => void;
  reassign: (fromCrew: string, drainId: string, toCrew: string) => void;
  addToPlan: (drainId: string) => void;
  dispatchAll: () => void;
  transition: (drainId: string, to: TaskStatus, actor: string, reason: string) => boolean;
  setPhoto: (taskId: string, kind: "before" | "after", data: string) => void;
  submitProof: (taskId: string) => Promise<void>;
  review: (taskId: string, decision: "APPROVED" | "REJECTED") => void;
  addReport: (r: Omit<CitizenReport, "id" | "createdAt">) => string;
  beginBedrockVerification: () => void;
  recordVerificationMode: (mode: VerificationMode) => void;
  recordVerificationUnavailable: (message: string) => void;
  resetDemo: () => void;
}

const C = createContext<Ctx | null>(null);

/** Map an AWS drain record to a local DrainBase (handles any field name differences). */
function awsDrainToBase(d: AwsDrain): DrainBase {
  return {
    id: d.id,
    name: d.name,
    lat: d.lat,
    lng: d.lng,
    slope: d.slope as DrainBase["slope"],
    lowLying: d.lowLying,
    historicalChokes: d.historicalChokes,
    lastCleaned: d.lastCleaned,
    citizenReports: d.citizenReports,
    rainfallForecastMm: d.rainfallForecastMm,
    cleaningTimeMin: d.cleaningTimeMin,
    adjacentPopulationWeight: d.adjacentPopulationWeight,
    ward: d.ward,
  };
}

export function NalaProvider({ children }: { children: ReactNode }) {
  const [s, setS] = useState<Persisted>(fresh);
  const [ready, setReady] = useState(false);
  const [live, setLive] = useState<WeatherInfo | null>(null);
  const [awsStatus, setAwsStatus] = useState<AwsConnStatus>(
    AWS_CONFIGURED ? "idle" : "unconfigured",
  );
  const [awsDrainSource, setAwsDrainSource] = useState<"dynamodb" | "demo" | null>(null);
  const [bedrockVerification, setBedrockVerification] = useState<BedrockVerificationStatus>({
    status: "NOT_VERIFIED",
    checkedAt: null,
    message: "Run a Test Lab scenario to verify the actual backend mode.",
  });
  const sRef = useRef(s); sRef.current = s;

  useEffect(() => {
    try { const raw = localStorage.getItem(KEY); if (raw) setS({ ...fresh(), ...JSON.parse(raw) }); } catch { /* ignore */ }
    setReady(true);
  }, []);
  useEffect(() => {
    if (!ready) return;
    try { localStorage.setItem(KEY, JSON.stringify(s)); } catch { toast.error("Local storage full — some demo photos may not persist."); }
  }, [s, ready]);

  const refreshAwsConnection = useCallback(async () => {
    if (!ready) return;
    if (!AWS_CONFIGURED) {
      setAwsDrainSource(null);
      setAwsStatus("unconfigured");
      return;
    }
    setAwsStatus("checking");
    try {
      const res = await listDrains();
      if (res.ok && Array.isArray(res.data.drains) && (res.data.source === "dynamodb" || res.data.source === "demo")) {
        if (res.data.drains.length > 0) {
          const bases = res.data.drains.map(awsDrainToBase);
          setS((p) => ({ ...p, bases }));
        }
        setAwsDrainSource(res.data.source);
        setAwsStatus("connected");
      } else {
        setAwsDrainSource(null);
        setAwsStatus("error");
      }
    } catch {
      setAwsDrainSource(null);
      setAwsStatus("error");
    }
  }, [ready]);

  // ── AWS drain sync: on mount, try to load drains from DynamoDB ──
  useEffect(() => {
    void refreshAwsConnection();
  }, [refreshAwsConnection]);

  const refreshWeather = useCallback(async () => {
    try {
      const r = await fetch("/api/weather");
      if (!r.ok) throw new Error();
      const w = (await r.json()) as WeatherInfo;
      if (w.source !== "live") throw new Error();
      setLive(w);
      setS((p) => ({ ...p, weatherCache: w }));
    } catch {
      const c = sRef.current.weatherCache;
      setLive(c ? { ...c, source: "cached" } : null);
      toast.warning(c ? "Live forecast unavailable — using cached value." : "Live forecast unavailable — using demo scenario.");
    }
  }, []);

  useEffect(() => { if (ready && s.weatherMode === "live") void refreshWeather(); }, [ready, s.weatherMode, refreshWeather]);

  const weather: WeatherInfo = useMemo(() => {
    if (s.weatherMode === "live" && live) return live;
    return { forecastMm72h: SCENARIO_MM[s.scenario], source: "demo", fetchedAt: new Date(2026, 9, 7).toISOString() };
  }, [s.weatherMode, s.scenario, live]);

  const forecastMm = weather.forecastMm72h;
  const drainRain = useCallback((d: DrainBase) => +(d.rainfallForecastMm * (forecastMm / SCENARIO_MM.heavy)).toFixed(1), [forecastMm]);

  const drains: Drain[] = useMemo(() => s.bases.map((b) => {
    const r = scoreRisk(b, drainRain(b));
    return { ...b, riskScore: r.score, riskBand: r.band, status: s.statuses[b.id] ?? "UNASSIGNED" };
  }), [s.bases, s.statuses, drainRain]);

  const log = (p: Persisted, e: Omit<AuditEntry, "id" | "timestamp">): AuditEntry[] => [{ ...e, id: uid("A"), timestamp: new Date().toISOString() }, ...p.audit].slice(0, 500);

  const generatePlan = useCallback(() => {
    const opt = optimizePlan(drains, DEMO_CREWS);
    const plan: Plan = { ...opt, id: uid("PLAN"), createdAt: new Date().toISOString(), naiveHighCoverage: naivePlan(drains, DEMO_CREWS).highCoverage, dispatched: false };
    setS((p) => ({ ...p, plan, audit: log(p, { actor: "Officer (demo)", drainId: "—", oldStatus: null, newStatus: null, reason: `Generated plan ${plan.id}` }) }));
    // Fire-and-forget: also persist to AWS if configured (non-blocking)
    if (AWS_CONFIGURED) {
      void generatePlanAws({ scenario: sRef.current.scenario, forecastMm72h: sRef.current.weatherMode === "demo" ? SCENARIO_MM[sRef.current.scenario] : (sRef.current.weatherCache?.forecastMm72h ?? SCENARIO_MM[sRef.current.scenario]) })
        .then((res) => { if (!res.ok) console.warn("[AWS] generatePlan failed:", res.error); });
    }
    return plan;
  }, [drains]);

  const recompute = (plan: Plan, crews: Plan["crews"]): Plan => {
    const byId = new Map(drains.map((d) => [d.id, d]));
    const rebuilt = crews.map((cp) => {
      const crew = DEMO_CREWS.find((c) => c.id === cp.crewId)!;
      const one = optimizePlan(cp.drainIds.map((id) => ({ ...byId.get(id)!, status: "UNASSIGNED" as const, riskBand: "HIGH" as const })), [{ ...crew, availableHours: 99 }]);
      return { ...one.crews[0]!, crewId: cp.crewId };
    });
    return { ...plan, crews: rebuilt, hoursPlanned: +(rebuilt.reduce((a, c) => a + c.totalMin, 0) / 60).toFixed(1), highCoverage: Math.round((drains.filter((d) => d.riskBand === "HIGH" && rebuilt.some((c) => c.drainIds.includes(d.id))).length / Math.max(1, drains.filter((d) => d.riskBand === "HIGH").length)) * 100) };
  };

  const fits = (plan: Plan, crewId: string) => {
    const c = DEMO_CREWS.find((x) => x.id === crewId)!;
    const cp = plan.crews.find((x) => x.crewId === crewId)!;
    return cp.totalMin <= c.availableHours * 60;
  };

  const removeFromPlan = (crewId: string, drainId: string) => setS((p) => {
    if (!p.plan) return p;
    return { ...p, plan: recompute(p.plan, p.plan.crews.map((c) => c.crewId === crewId ? { ...c, drainIds: c.drainIds.filter((d) => d !== drainId) } : c)) };
  });

  const reassign = (fromCrew: string, drainId: string, toCrew: string) => setS((p) => {
    if (!p.plan) return p;
    const next = recompute(p.plan, p.plan.crews.map((c) => c.crewId === fromCrew ? { ...c, drainIds: c.drainIds.filter((d) => d !== drainId) } : c.crewId === toCrew ? { ...c, drainIds: [...c.drainIds, drainId] } : c));
    if (!fits(next, toCrew)) { toast.error("Reassignment would exceed that crew's available hours."); return p; }
    return { ...p, plan: next };
  });

  const addToPlan = (drainId: string) => setS((p) => {
    if (!p.plan || p.plan.dispatched) { toast.error("Generate a new plan first, then add drains."); return p; }
    if (p.plan.crews.some((c) => c.drainIds.includes(drainId))) { toast.info("Already in plan."); return p; }
    for (const c of [...p.plan.crews].sort((a, b) => a.totalMin - b.totalMin)) {
      const next = recompute(p.plan, p.plan.crews.map((x) => x.crewId === c.crewId ? { ...x, drainIds: [...x.drainIds, drainId] } : x));
      if (fits(next, c.crewId)) { toast.success(`Added ${drainId} to ${DEMO_CREWS.find((k) => k.id === c.crewId)!.name}`); return { ...p, plan: next }; }
    }
    toast.error("No crew has enough remaining hours.");
    return p;
  });

  const dispatchAll = () => {
    // 1. Apply locally first (demo always works)
    setS((p) => {
      if (!p.plan) return p;
      const statuses = { ...p.statuses };
      let audit = p.audit;
      const tasks = [...p.tasks];
      p.plan.crews.forEach((c) => c.drainIds.forEach((id, i) => {
        const cur = statuses[id] ?? "UNASSIGNED";
        if (!canTransition(cur, "ASSIGNED")) return;
        statuses[id] = "ASSIGNED";
        tasks.push({ id: uid("T"), drainId: id, crewId: c.crewId, order: i + 1, status: "ASSIGNED" });
        audit = log({ ...p, audit }, { actor: "Officer (demo)", drainId: id, oldStatus: cur, newStatus: "ASSIGNED", reason: `Dispatched to ${DEMO_CREWS.find((k) => k.id === c.crewId)!.name}` });
      }));
      return { ...p, statuses, tasks, audit, plan: { ...p.plan, dispatched: true } };
    });
    // 2. Also persist to AWS (fire-and-forget, non-blocking)
    const planId = sRef.current.plan?.id;
    if (AWS_CONFIGURED && planId) {
      void dispatchPlanAws(planId).then((res) => {
        if (!res.ok) console.warn("[AWS] dispatchPlan failed:", res.error);
      });
    }
  };

  const transition = (drainId: string, to: TaskStatus, actor: string, reason: string) => {
    const cur = sRef.current.statuses[drainId] ?? "UNASSIGNED";
    if (!canTransition(cur, to)) { toast.error(`Invalid transition: ${STATUS_LABEL[cur]} → ${STATUS_LABEL[to]}`); return false; }
    setS((p) => ({ ...p, statuses: { ...p.statuses, [drainId]: to }, tasks: p.tasks.map((t) => t.drainId === drainId && t.status !== "VERIFIED" && t.status !== "REJECTED" ? { ...t, status: to } : t), audit: log(p, { actor, drainId, oldStatus: cur, newStatus: to, reason }) }));
    // Sync status change to AWS (fire-and-forget)
    if (AWS_CONFIGURED) {
      const task = sRef.current.tasks.find((t) => t.drainId === drainId && t.status !== "VERIFIED" && t.status !== "REJECTED");
      if (task) void patchTask(task.id, { status: to }).then((res) => { if (!res.ok) console.warn("[AWS] patchTask failed:", res.error); });
    }
    return true;
  };

  const setPhoto = (taskId: string, kind: "before" | "after", data: string) => setS((p) => ({ ...p, tasks: p.tasks.map((t) => t.id === taskId ? { ...t, [kind === "before" ? "beforePhoto" : "afterPhoto"]: data } : t) }));

  const submitProof = async (taskId: string) => {
    const t = sRef.current.tasks.find((x) => x.id === taskId);
    if (!t?.beforePhoto || !t.afterPhoto) throw new Error("Both photos are required.");
    const drain = drains.find((d) => d.id === t.drainId)!;
    if (!transition(t.drainId, "PROOF_SUBMITTED", crewName(t.crewId), "Before/after proof submitted")) return;
    let v: Verification = { verdict: "REVIEW", confidence: 0, reason: "AI unavailable — routed to manual review.", mode: "lovable-ai" };

    // Try AWS Lambda proof submission first, fall back to Lovable AI / demo
    let awsProofOk = false;
    if (AWS_CONFIGURED) {
      try {
        const awsRes = await submitProofAws(taskId, { before: t.beforePhoto, after: t.afterPhoto });
        if (awsRes.ok && awsRes.data.verification) {
          const av = awsRes.data.verification;
          v = { verdict: av.verdict, confidence: av.confidence, reason: av.reason, mode: av.mode };
          awsProofOk = true;
        }
      } catch { /* fall through to local AI */ }
    }

    if (!awsProofOk) {
      try {
        const r = await verifyProof({ data: { before: t.beforePhoto, after: t.afterPhoto, drainId: drain.id, drainName: drain.name } });
        if (r.ok) v = { verdict: r.verdict, confidence: r.confidence, reason: r.reason, mode: "lovable-ai" };
        else { v = { verdict: "REVIEW", confidence: 0, reason: `${r.error} Routed to manual review.`, mode: "lovable-ai" }; toast.error(r.error); }
      } catch {
        v = { verdict: "REVIEW", confidence: 0, reason: "AI unavailable — routed to manual review.", mode: "lovable-ai" };
      }
    }

    setS((p) => ({ ...p, tasks: p.tasks.map((x) => x.id === taskId ? { ...x, submittedAt: new Date().toISOString(), verification: v } : x), audit: log(p, { actor: awsProofOk ? "AWS Lambda" : "Lovable AI", drainId: t.drainId, oldStatus: "PROOF_SUBMITTED", newStatus: "PROOF_SUBMITTED", reason: `AI verdict ${v.verdict} @ ${v.confidence}%` }) }));
    if (v.verdict === "REVIEW") setTimeout(() => transition(t.drainId, "NEEDS_REVIEW", awsProofOk ? "AWS Lambda" : "Lovable AI", "Low confidence — manual review required"), 0);
  };

  const review = (taskId: string, decision: "APPROVED" | "REJECTED") => {
    const t = sRef.current.tasks.find((x) => x.id === taskId);
    if (!t) return;
    const to = decision === "APPROVED" ? "VERIFIED" : "REJECTED";
    const reason = `Officer ${decision.toLowerCase()} · AI ${t.verification?.verdict ?? "N/A"} ${t.verification?.confidence ?? 0}%`;
    if (!transition(t.drainId, to, "Officer (demo)", reason)) return;
    setS((p) => ({ ...p, tasks: p.tasks.map((x) => x.id === taskId ? { ...x, status: to, officerDecision: decision, officerAt: new Date().toISOString() } : x), statuses: decision === "REJECTED" ? { ...p.statuses, [t.drainId]: "REJECTED" } : p.statuses }));
    // Sync review decision to AWS (fire-and-forget)
    if (AWS_CONFIGURED) {
      void reviewProofAws(taskId, { decision, officerName: "Officer" })
        .then((res) => { if (!res.ok) console.warn("[AWS] reviewProof failed:", res.error); });
    }
  };

  const addReport = (r: Omit<CitizenReport, "id" | "createdAt">) => {
    const id = uid("R");
    setS((p) => ({
      ...p,
      reports: [{ ...r, id, createdAt: new Date().toISOString() }, ...p.reports],
      bases: p.bases.map((b) => b.id === r.drainId ? { ...b, citizenReports: b.citizenReports + 1 } : b),
      audit: log(p, { actor: "Citizen (demo)", drainId: r.drainId, oldStatus: null, newStatus: null, reason: `Report: ${r.issue}` }),
    }));
    return id;
  };

  const setScenarioWithAwsSync = (scenario: Scenario) => {
    setS((p) => ({ ...p, scenario }));
    if (AWS_CONFIGURED) void patchSettings({ scenario }).then((res) => { if (!res.ok) console.warn("[AWS] patchSettings failed:", res.error); });
  };
  const setWeatherModeWithAwsSync = (weatherMode: WeatherMode) => {
    setS((p) => ({ ...p, weatherMode }));
    if (AWS_CONFIGURED) void patchSettings({ weatherMode }).then((res) => { if (!res.ok) console.warn("[AWS] patchSettings failed:", res.error); });
  };

  const beginBedrockVerification = () => {
    setBedrockVerification({
      status: "CHECKING",
      checkedAt: null,
      message: "Test Lab verification request is running.",
    });
  };

  const recordVerificationMode = (mode: VerificationMode) => {
    const checkedAt = new Date().toISOString();
    if (mode === "bedrock") {
      setBedrockVerification({
        status: "CONNECTED",
        checkedAt,
        message: "Test Lab received mode=bedrock after a successful backend Bedrock invocation.",
      });
    } else if (mode === "fallback") {
      setBedrockVerification({
        status: "ERROR",
        checkedAt,
        message: "Verification used the backend fallback; Bedrock did not complete successfully.",
      });
    } else {
      setBedrockVerification({
        status: "NOT_VERIFIED",
        checkedAt,
        message: `Test Lab returned mode=${mode}; this does not verify Bedrock.`,
      });
    }
  };

  const recordVerificationUnavailable = (message: string) => {
    setBedrockVerification({
      status: "NOT_VERIFIED",
      checkedAt: new Date().toISOString(),
      message,
    });
  };

  const value: Ctx = {
    ready, awsMode: AWS_CONFIGURED, awsStatus, awsDrainSource, refreshAwsConnection, bedrockVerification, scenario: s.scenario, weatherMode: s.weatherMode, weather, forecastMm, drains, crews: DEMO_CREWS, tasks: s.tasks, plan: s.plan, audit: s.audit, reports: s.reports, drainRain,
    setScenario: setScenarioWithAwsSync,
    setWeatherMode: setWeatherModeWithAwsSync,
    refreshWeather, generatePlan, removeFromPlan, reassign, addToPlan, dispatchAll, transition, setPhoto, submitProof, review, addReport, beginBedrockVerification, recordVerificationMode, recordVerificationUnavailable,
    resetDemo: () => { setS(fresh()); setLive(null); toast.success("Demo data reset."); },
  };
  return <C.Provider value={value}>{children}</C.Provider>;
}


export function useNala() {
  const v = useContext(C);
  if (!v) throw new Error("useNala outside provider");
  return v;
}
