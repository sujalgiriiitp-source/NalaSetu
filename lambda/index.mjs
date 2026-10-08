/**
 * NalaSetu API — AWS Lambda Handler (index.mjs)
 *
 * HTTP API router for all NalaSetu endpoints.
 * Uses AWS SDK v3 DynamoDB DocumentClient.
 * Lambda execution role provides DynamoDB access — no credentials in code.
 *
 * DynamoDB table: NalaSetu  pk (String)  sk (String)
 *
 * Key schema:
 *   Drains:   pk=DRAIN        sk=<drainId>          e.g. D-104
 *   Plans:    pk=PLAN         sk=<planId>
 *   Tasks:    pk=TASK         sk=<taskId>
 *   Proofs:   pk=PROOF        sk=<proofId>
 *   Settings: pk=SETTINGS     sk=DEFAULT
 */

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  QueryCommand,
  UpdateCommand,
  BatchWriteCommand,
  ScanCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

// ─── DynamoDB client ──────────────────────────────────────────────────────────
const TABLE = process.env.DYNAMODB_TABLE ?? "NalaSetu";
const REGION = process.env.AWS_REGION ?? "us-east-1";
const raw = new DynamoDBClient({ region: REGION });
const db = DynamoDBDocumentClient.from(raw, {
  marshallOptions: { removeUndefinedValues: true },
});

// ─── S3 client ────────────────────────────────────────────────────────────────
const S3_BUCKET = process.env.S3_BUCKET;
const s3Client = new S3Client({ region: REGION });

// ─── CORS headers ────────────────────────────────────────────────────────────
// Allow calls from any Vercel/Lovable/localhost origin in the demo environment.
const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,PATCH,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type,Accept",
  "Content-Type": "application/json",
};

// ─── Response helpers ─────────────────────────────────────────────────────────
const ok = (body) => ({ statusCode: 200, headers: CORS, body: JSON.stringify(body) });
const created = (body) => ({ statusCode: 201, headers: CORS, body: JSON.stringify(body) });
const notFound = (msg) => ({ statusCode: 404, headers: CORS, body: JSON.stringify({ error: msg }) });
const badRequest = (msg) => ({ statusCode: 400, headers: CORS, body: JSON.stringify({ error: msg }) });
const serverError = (msg) => ({ statusCode: 500, headers: CORS, body: JSON.stringify({ error: msg }) });
const options = () => ({ statusCode: 200, headers: CORS, body: "" });

// ─── Risk formula (matches frontend src/lib/nalasetu/risk.ts exactly) ─────────
const WEIGHTS = { R: 0.4, H: 0.25, S: 0.2, C: 0.15 };
const SLOPE_FACTOR = { Low: 100, Medium: 55, High: 20 };

function riskFactors(drain, forecastMm72) {
  const R = Math.min(100, (forecastMm72 / 60) * 100);
  const H = Math.min(100, (drain.historicalChokes / 5) * 100);
  const S = SLOPE_FACTOR[drain.slope] ?? 55;
  const C = Math.min(100, (drain.citizenReports / 6) * 100);
  return { R, H, S, C };
}

function scoreRisk(drain, forecastMm72) {
  const f = riskFactors(drain, forecastMm72);
  const contrib = {
    rainfall: WEIGHTS.R * f.R,
    history: WEIGHTS.H * f.H,
    terrain: WEIGHTS.S * f.S,
    citizen: WEIGHTS.C * f.C,
  };
  const raw = contrib.rainfall + contrib.history + contrib.terrain + contrib.citizen;
  const score = Math.round(raw);
  const band = score >= 70 ? "HIGH" : score >= 40 ? "MEDIUM" : "LOW";
  return { score, band, factors: f, contrib };
}

function riskReasons(drain, forecastMm72) {
  const out = [`${Math.round(forecastMm72)}mm rainfall forecast in next 72h`];
  out.push(`${drain.historicalChokes} historical choke incident${drain.historicalChokes === 1 ? "" : "s"}`);
  out.push(drain.lowLying ? "Low-lying location" : `${drain.slope} slope terrain`);
  out.push(`${drain.citizenReports} citizen report${drain.citizenReports === 1 ? "" : "s"} in last 30 days`);
  return out;
}

function recommendation(band) {
  return band === "HIGH"
    ? "Clean before rain window start - 2h"
    : band === "MEDIUM"
    ? "Clean if crew-hours remain"
    : "Monitor";
}

// ─── 40 synthetic NalaSetu demo drains (identical to frontend data.ts) ────────
const WARD = "Demo Ward 7 (synthetic)";
const STREETS = [
  "Janpath","Tolstoy Marg","Kasturba Gandhi Marg","Bahadur Shah Zafar Marg",
  "Mandi House","Bengali Market","Pragati Maidan","Tilak Bridge","Sikandra Road",
  "Firozshah Road","Ashoka Road","Ferozshah Kotla","Daryaganj","Asaf Ali Road",
  "Delhi Gate","Ajmeri Gate","Paharganj Link","Gole Market","Baba Kharak Singh Marg",
  "Bhagwan Das Road","Copernicus Marg","Mathura Road","Vikas Marg Spur",
  "Rajghat Service","Shanti Path","Raisina Spur","Pandara Road","Barakhamba Lane",
  "Hailey Road","Babar Road","Curzon Road","Kamla Market","Turkman Gate",
  "Chitragupta Road","Deen Dayal Marg","Lodhi Estate Link",
];
const KIND = ["Drain","Storm Drain","Culvert","Nala Segment","Side Drain"];

function rng(seed) {
  let s = seed;
  return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
}

function buildDemoDrains() {
  const FIXED = [
    { id:"D-104",name:"Minto Road Underpass Drain",lat:28.632,lng:77.222,slope:"Low",lowLying:true,historicalChokes:5,lastCleaned:"2026-09-02",citizenReports:6,rainfallForecastMm:55,cleaningTimeMin:35,adjacentPopulationWeight:9,ward:WARD },
    { id:"D-072",name:"ITO Junction East Drain",lat:28.628,lng:77.241,slope:"Low",lowLying:true,historicalChokes:4,lastCleaned:"2026-08-21",citizenReports:5,rainfallForecastMm:48,cleaningTimeMin:30,adjacentPopulationWeight:8,ward:WARD },
    { id:"D-031",name:"Connaught Outer Circle Drain",lat:28.634,lng:77.218,slope:"Medium",lowLying:false,historicalChokes:3,lastCleaned:"2026-08-10",citizenReports:3,rainfallForecastMm:35,cleaningTimeMin:25,adjacentPopulationWeight:6,ward:WARD },
    { id:"D-018",name:"Barakhamba Slope Drain",lat:28.629,lng:77.226,slope:"High",lowLying:false,historicalChokes:1,lastCleaned:"2026-09-15",citizenReports:1,rainfallForecastMm:18,cleaningTimeMin:20,adjacentPopulationWeight:3,ward:WARD },
  ];
  const HIGH_P = [["Low",4,4,55],["Low",5,3,55],["Low",3,5,55],["Medium",5,6,55],["Low",4,2,55],["Low",3,4,55],["Low",5,5,55],["Medium",4,6,55]];
  const MED_P  = [["Medium",2,2,55],["Medium",3,1,55],["Low",1,1,55],["Medium",2,3,55],["High",4,3,55],["Medium",1,2,55],["Low",2,0,55],["High",3,4,55],["Medium",2,1,55],["Medium",3,2,55],["High",4,2,55],["Low",1,2,55],["Medium",2,2,55]];
  const LOW_P  = [["High",0,0,20],["High",1,0,25],["High",1,1,15],["Medium",0,0,20],["High",0,1,30],["High",2,0,20],["Medium",1,0,15],["High",0,0,25],["High",1,1,20],["Medium",0,1,18],["High",2,1,15],["High",0,0,22],["High",1,0,30],["Medium",1,0,12],["High",0,2,20],["High",1,0,18]];
  const r = rng(42);
  const out = [...FIXED];
  const profiles = [...HIGH_P,...MED_P,...LOW_P];
  profiles.splice(profiles.length - 1, 1);
  profiles.forEach((p, i) => {
    const [slope, chokes, reports, rain] = p;
    const n = 100 + i * 7 + 3;
    const id_candidate = `D-${String((n % 190) + 2).padStart(3,"0")}`;
    const month = 6 + Math.floor(r() * 4);
    const day   = 1 + Math.floor(r() * 27);
    out.push({
      id: out.some(d => d.id === id_candidate) ? `D-${200 + i}` : id_candidate,
      name: `${STREETS[i % STREETS.length]} ${KIND[i % KIND.length]}`,
      lat: +(28.61 + r() * 0.04).toFixed(4),
      lng: +(77.2  + r() * 0.05).toFixed(4),
      slope,
      lowLying: slope === "Low",
      historicalChokes: chokes,
      lastCleaned: `2026-${String(month).padStart(2,"0")}-${String(day).padStart(2,"0")}`,
      citizenReports: reports,
      rainfallForecastMm: rain,
      cleaningTimeMin: 15 + Math.floor(r() * 5) * 5,
      adjacentPopulationWeight: 1 + Math.floor(r() * 9),
      ward: WARD,
    });
  });
  return out;
}

const DEMO_DRAINS = buildDemoDrains();

// ─── Crew data (matches frontend data.ts) ─────────────────────────────────────
const DEMO_CREWS = [
  { id:"C-A",name:"Team Alpha",availableHours:6,homeBaseLat:28.625,homeBaseLng:77.215,status:"Available" },
  { id:"C-B",name:"Team Bravo",availableHours:5,homeBaseLat:28.640,homeBaseLng:77.235,status:"Available" },
  { id:"C-C",name:"Team Charlie",availableHours:4,homeBaseLat:28.618,homeBaseLng:77.245,status:"Available" },
];
const SCENARIO_MM = { heavy:55, light:18 };

// ─── Dispatch / planning helpers (mirrors frontend dispatch.ts) ───────────────
const AVG_SPEED_KMH = 15;
const ROAD_FACTOR   = 1.3;

function haversineKm(aLat,aLng,bLat,bLng) {
  const R = 6371;
  const dLat = (bLat-aLat)*Math.PI/180;
  const dLng = (bLng-aLng)*Math.PI/180;
  const x = Math.sin(dLat/2)**2 + Math.cos(aLat*Math.PI/180)*Math.cos(bLat*Math.PI/180)*Math.sin(dLng/2)**2;
  return 2*R*Math.asin(Math.sqrt(x));
}
const travelMin = (km) => (km*ROAD_FACTOR/AVG_SPEED_KMH)*60;
const cellOf = (lat,lng,size=0.01) => `${Math.floor(lat/size)}:${Math.floor(lng/size)}`;

function nearestNeighbour(start, stops) {
  const left=[...stops], out=[];
  let cur=start;
  while(left.length) {
    let bi=0,bd=Infinity;
    left.forEach((d,i)=>{ const k=haversineKm(cur.lat,cur.lng,d.lat,d.lng); if(k<bd){bd=k;bi=i;} });
    const n=left.splice(bi,1)[0]; out.push(n); cur=n;
  }
  return out;
}

function routeKm(start, stops) {
  let km=0,cur=start;
  for(const s of stops){ km+=haversineKm(cur.lat,cur.lng,s.lat,s.lng)*ROAD_FACTOR; cur=s; }
  return km;
}

function summarizeCrew(crew, stops) {
  const home={lat:crew.homeBaseLat,lng:crew.homeBaseLng};
  const km=routeKm(home,stops);
  const cleaning=stops.reduce((a,d)=>a+d.cleaningTimeMin,0);
  const travel=(km/AVG_SPEED_KMH)*60;
  return { crewId:crew.id, drainIds:stops.map(d=>d.id), cleaningMin:cleaning, travelMin:Math.round(travel), totalMin:Math.round(cleaning+travel), distanceKm:+km.toFixed(2) };
}

function optimizePlan(drains, crews) {
  const cand = drains.filter(d=>(d.riskBand==="HIGH"||d.riskBand==="MEDIUM") && d.status==="UNASSIGNED");
  const clusterOf = new Map(cand.map(d=>[d.id,cellOf(d.lat,d.lng)]));
  const state = crews.map(c=>({ crew:c, stops:[], used:0, pos:{lat:c.homeBaseLat,lng:c.homeBaseLng} }));
  const remaining = new Set(cand.map(d=>d.id));
  const byId = new Map(cand.map(d=>[d.id,d]));
  for(;;) {
    let best=null;
    for(let si=0;si<state.length;si++) {
      const s=state[si];
      const cap=s.crew.availableHours*60;
      for(const id of remaining) {
        const d=byId.get(id);
        const t=travelMin(haversineKm(s.pos.lat,s.pos.lng,d.lat,d.lng));
        const cost=d.cleaningTimeMin+t;
        if(s.used+cost>cap) continue;
        const last=s.stops[s.stops.length-1];
        const affinity=last&&clusterOf.get(last.id)===clusterOf.get(d.id)?1.15:1;
        const ratio=((d.riskScore+(d.riskBand==="HIGH"?1000:0))/cost)*affinity;
        if(!best||ratio>best.ratio) best={si,d,ratio,cost};
      }
    }
    if(!best) break;
    const s=state[best.si];
    s.stops.push(best.d); s.used+=best.cost; s.pos=best.d; remaining.delete(best.d.id);
  }
  const crewPlans=state.map(s=>{
    const routed=nearestNeighbour({lat:s.crew.homeBaseLat,lng:s.crew.homeBaseLng},s.stops);
    return summarizeCrew(s.crew,routed);
  });
  const hoursAvailable=crews.reduce((a,c)=>a+c.availableHours,0);
  const hoursPlanned=+(crewPlans.reduce((a,c)=>a+c.totalMin,0)/60).toFixed(1);
  const highIds=new Set(crewPlans.flatMap(c=>c.drainIds));
  const highTotal=drains.filter(d=>d.riskBand==="HIGH").length;
  const highCovered=drains.filter(d=>d.riskBand==="HIGH"&&highIds.has(d.id)).length;
  const highCoverage=highTotal?Math.round((highCovered/highTotal)*100):0;
  return { crews:crewPlans, hoursAvailable, hoursPlanned, highCoverage };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const uid = (prefix) => `${prefix}-${Date.now().toString(36)}${Math.floor(Math.random()*1e4).toString(36)}`.toUpperCase();

function enrichDrain(base, forecastMm72, status) {
  const risk = scoreRisk(base, forecastMm72);
  return {
    ...base,
    status: status ?? "UNASSIGNED",
    riskScore: risk.score,
    riskBand: risk.band,
    riskReasons: riskReasons(base, forecastMm72),
    recommendation: recommendation(risk.band),
  };
}

// ─── DynamoDB helpers ─────────────────────────────────────────────────────────
async function getDrainFromDb(id) {
  const res = await db.send(new GetCommand({ TableName: TABLE, Key: { pk: "DRAIN", sk: id } }));
  return res.Item ?? null;
}

async function getAllDrains() {
  const res = await db.send(new QueryCommand({
    TableName: TABLE,
    KeyConditionExpression: "pk = :pk",
    ExpressionAttributeValues: { ":pk": "DRAIN" },
  }));
  return res.Items ?? [];
}

async function getSettings() {
  const res = await db.send(new GetCommand({ TableName: TABLE, Key: { pk: "SETTINGS", sk: "DEFAULT" } }));
  return res.Item ?? { pk:"SETTINGS", sk:"DEFAULT", scenario:"heavy", weatherMode:"demo" };
}

async function getTask(id) {
  const res = await db.send(new GetCommand({ TableName: TABLE, Key: { pk: "TASK", sk: id } }));
  return res.Item ?? null;
}

async function getProof(id) {
  const res = await db.send(new GetCommand({ TableName: TABLE, Key: { pk: "PROOF", sk: id } }));
  return res.Item ?? null;
}

async function getAllTasks() {
  const res = await db.send(new QueryCommand({
    TableName: TABLE,
    KeyConditionExpression: "pk = :pk",
    ExpressionAttributeValues: { ":pk": "TASK" },
  }));
  return res.Items ?? [];
}

async function getPlan(id) {
  const res = await db.send(new GetCommand({ TableName: TABLE, Key: { pk: "PLAN", sk: id } }));
  return res.Item ?? null;
}

// Batch-write items in chunks of 25 (DynamoDB limit)
async function batchPut(items) {
  for (let i = 0; i < items.length; i += 25) {
    const chunk = items.slice(i, i + 25);
    await db.send(new BatchWriteCommand({
      RequestItems: {
        [TABLE]: chunk.map(Item => ({ PutRequest: { Item } })),
      },
    }));
  }
}

// ─── State machine (mirrors frontend state-machine.ts) ────────────────────────
const TRANSITIONS = {
  UNASSIGNED: ["ASSIGNED"],
  ASSIGNED: ["EN_ROUTE","UNASSIGNED"],
  EN_ROUTE: ["CLEANING"],
  CLEANING: ["PROOF_SUBMITTED"],
  PROOF_SUBMITTED: ["VERIFIED","NEEDS_REVIEW","REJECTED"],
  NEEDS_REVIEW: ["VERIFIED","REJECTED"],
  REJECTED: ["ASSIGNED"],
  VERIFIED: [],
};
function canTransition(from, to) {
  return (TRANSITIONS[from] ?? []).includes(to);
}

// ─── Body parser ──────────────────────────────────────────────────────────────
function parseBody(event) {
  try {
    if (!event.body) return {};
    return JSON.parse(event.body);
  } catch { return {}; }
}

// ─── Route handler ────────────────────────────────────────────────────────────
export async function handler(event) {
  const method = event.httpMethod ?? event.requestContext?.http?.method ?? "GET";
  const rawPath = event.rawPath ?? event.path ?? "/";
  const pathParts = rawPath.replace(/^\//, "").split("/");
  // pathParts: ["api", "drains"] or ["api","drains","D-104"] etc.

  // Handle CORS preflight
  if (method === "OPTIONS") return options();

  try {
    // ── GET /api/drains ───────────────────────────────────────────────────────
    if (method === "GET" && pathParts[1] === "drains" && !pathParts[2]) {
      const allDbDrains = await getAllDrains();
      const settings = await getSettings();
      const forecastMm72 = SCENARIO_MM[settings.scenario] ?? 55;
      const tasks = await getAllTasks();
      const statusMap = {};
      tasks.forEach(t => { statusMap[t.drainId] = t.status; });

      // If DynamoDB has drains, use them; otherwise return demo data shape
      const sources = allDbDrains.length > 0 ? allDbDrains : DEMO_DRAINS;
      const { band, status: statusFilter, q } = event.queryStringParameters ?? {};

      let drains = sources.map(d => enrichDrain(d, forecastMm72, statusMap[d.id] ?? d.status ?? "UNASSIGNED"));
      if (band)         drains = drains.filter(d => d.riskBand === band.toUpperCase());
      if (statusFilter) drains = drains.filter(d => d.status === statusFilter);
      if (q)            drains = drains.filter(d => d.name.toLowerCase().includes(q.toLowerCase()) || d.id.toLowerCase().includes(q.toLowerCase()));

      return ok({ drains, total: drains.length, source: allDbDrains.length > 0 ? "dynamodb" : "demo" });
    }

    // ── GET /api/drains/:id ───────────────────────────────────────────────────
    if (method === "GET" && pathParts[1] === "drains" && pathParts[2] && pathParts[2] !== "seed") {
      const id = decodeURIComponent(pathParts[2]);
      let base = await getDrainFromDb(id);
      if (!base) base = DEMO_DRAINS.find(d => d.id === id) ?? null;
      if (!base) return notFound(`Drain ${id} not found`);
      const settings = await getSettings();
      const forecastMm72 = SCENARIO_MM[settings.scenario] ?? 55;
      const tasks = await getAllTasks();
      const statusMap = {};
      tasks.forEach(t => { statusMap[t.drainId] = t.status; });
      return ok(enrichDrain(base, forecastMm72, statusMap[id] ?? "UNASSIGNED"));
    }

    // ── POST /api/drains/seed ─────────────────────────────────────────────────
    if (method === "POST" && pathParts[1] === "drains" && pathParts[2] === "seed") {
      const body = parseBody(event);
      // Use drains from request body if provided, else fall back to built-in demo data
      const drainsToSeed = (Array.isArray(body.drains) && body.drains.length > 0)
        ? body.drains
        : DEMO_DRAINS;

      const settings = await getSettings();
      const forecastMm72 = SCENARIO_MM[settings.scenario] ?? 55;

      const items = drainsToSeed.map(d => ({
        pk: "DRAIN",
        sk: d.id,
        ...d,
        status: d.status ?? "UNASSIGNED",
        seededAt: new Date().toISOString(),
      }));

      await batchPut(items);

      // Also wipe existing tasks, plans, and proofs for clean state
      const allTasks = await getAllTasks();
      const allProofs = await db.send(new ScanCommand({
        TableName: TABLE,
        FilterExpression: "pk = :pk",
        ExpressionAttributeValues: { ":pk": "PROOF" },
      })).then(r => r.Items ?? []);
      const allPlans = await db.send(new ScanCommand({
        TableName: TABLE,
        FilterExpression: "pk = :pk",
        ExpressionAttributeValues: { ":pk": "PLAN" },
      })).then(r => r.Items ?? []);

      for (const t of allTasks) await db.send(new DeleteCommand({ TableName: TABLE, Key: { pk: "TASK", sk: t.sk } }));
      for (const p of allProofs) await db.send(new DeleteCommand({ TableName: TABLE, Key: { pk: "PROOF", sk: p.sk } }));
      for (const p of allPlans) await db.send(new DeleteCommand({ TableName: TABLE, Key: { pk: "PLAN", sk: p.sk } }));

      return ok({ seeded: items.length, message: `Seeded ${items.length} drain records and wiped all tasks/proofs/plans.` });
    }

    // ── POST /api/risk/recompute ──────────────────────────────────────────────
    if (method === "POST" && pathParts[1] === "risk" && pathParts[2] === "recompute") {
      const body = parseBody(event);
      const drains = await getAllDrains();
      const settings = await getSettings();
      const forecastMm72 = body.forecastMm72h ?? SCENARIO_MM[settings.scenario] ?? 55;

      if (drains.length === 0) {
        return ok({ updated: 0, counts: { HIGH:0, MEDIUM:0, LOW:0 }, message: "No drains in DynamoDB — seed first." });
      }

      const updates = drains.map(d => {
        const risk = scoreRisk(d, forecastMm72);
        return {
          ...d,
          pk: "DRAIN",
          sk: d.id ?? d.sk,
          riskScore: risk.score,
          riskBand: risk.band,
          riskReasons: riskReasons(d, forecastMm72),
          recommendation: recommendation(risk.band),
          forecastMm72,
          recomputedAt: new Date().toISOString(),
        };
      });
      await batchPut(updates);

      const counts = { HIGH: 0, MEDIUM: 0, LOW: 0 };
      updates.forEach(d => { counts[d.riskBand] = (counts[d.riskBand] ?? 0) + 1; });
      return ok({ updated: updates.length, counts, forecastMm72 });
    }

    // ── POST /api/plans/generate ──────────────────────────────────────────────
    if (method === "POST" && pathParts[1] === "plans" && pathParts[2] === "generate") {
      const body = parseBody(event);
      const settings = await getSettings();
      const scenario = body.scenario ?? settings.scenario ?? "heavy";
      const forecastMm72 = body.forecastMm72h ?? SCENARIO_MM[scenario] ?? 55;

      const dbDrains = await getAllDrains();
      const tasks = await getAllTasks();
      const statusMap = {};
      tasks.forEach(t => { statusMap[t.drainId] = t.status; });

      const sources = dbDrains.length > 0 ? dbDrains : DEMO_DRAINS;
      const drains = sources.map(d => enrichDrain(d, forecastMm72, statusMap[d.id] ?? "UNASSIGNED"));

      const opt = optimizePlan(drains, DEMO_CREWS);
      const planId = uid("PLAN");
      const plan = {
        pk: "PLAN",
        sk: planId,
        id: planId,
        createdAt: new Date().toISOString(),
        scenario,
        forecastMm72,
        ...opt,
        dispatched: false,
      };
      await db.send(new PutCommand({ TableName: TABLE, Item: plan }));

      const { pk: _pk, sk: _sk, ...planOut } = plan;
      return ok({ plan: planOut });
    }

    // ── POST /api/plans/:id/dispatch ──────────────────────────────────────────
    if (method === "POST" && pathParts[1] === "plans" && pathParts[3] === "dispatch") {
      const planId = decodeURIComponent(pathParts[2]);
      const plan = await getPlan(planId);
      if (!plan) return notFound(`Plan ${planId} not found`);
      if (plan.dispatched) return ok({ message:"Already dispatched", tasks: [] });

      const settings = await getSettings();
      const forecastMm72 = SCENARIO_MM[settings.scenario] ?? 55;
      const dbDrains = await getAllDrains();
      const sources = dbDrains.length > 0 ? dbDrains : DEMO_DRAINS;
      const drainMap = new Map(sources.map(d => [d.id, d]));

      const tasks = [];
      const drainUpdates = [];
      for (const cp of plan.crews ?? []) {
        for (let i = 0; i < cp.drainIds.length; i++) {
          const drainId = cp.drainIds[i];
          const taskId = uid("T");
          const task = {
            pk: "TASK",
            sk: taskId,
            id: taskId,
            drainId,
            crewId: cp.crewId,
            order: i + 1,
            planId,
            status: "ASSIGNED",
            createdAt: new Date().toISOString(),
          };
          tasks.push(task);
          const drain = drainMap.get(drainId);
          if (drain) drainUpdates.push({ ...drain, pk:"DRAIN", sk:drain.id??drain.sk, status:"ASSIGNED" });
        }
      }

      await batchPut(tasks);
      if (drainUpdates.length) await batchPut(drainUpdates);
      await db.send(new PutCommand({ TableName: TABLE, Item: { ...plan, dispatched: true, dispatchedAt: new Date().toISOString() } }));

      return ok({ tasks: tasks.map(({ pk, sk, ...t }) => t), dispatched: true });
    }

    // ── PATCH /api/tasks/:id ──────────────────────────────────────────────────
    if (method === "PATCH" && pathParts[1] === "tasks" && pathParts[2] && !pathParts[3]) {
      const taskId = decodeURIComponent(pathParts[2]);
      const task = await getTask(taskId);
      if (!task) return notFound(`Task ${taskId} not found`);
      const body = parseBody(event);
      const { status: newStatus } = body;
      if (!newStatus) return badRequest("status is required");
      if (!canTransition(task.status, newStatus)) {
        return badRequest(`Invalid transition: ${task.status} → ${newStatus}`);
      }
      const updated = { ...task, status: newStatus, updatedAt: new Date().toISOString() };
      // Also update drain status in DynamoDB
      const drain = await getDrainFromDb(task.drainId) ?? DEMO_DRAINS.find(d=>d.id===task.drainId);
      if (drain) await db.send(new PutCommand({ TableName: TABLE, Item: { ...drain, pk:"DRAIN", sk:drain.id??drain.sk, status: newStatus } }));
      await db.send(new PutCommand({ TableName: TABLE, Item: updated }));
      const { pk, sk, ...taskOut } = updated;
      return ok(taskOut);
    }

    // ── POST /api/tasks/:id/proof ─────────────────────────────────────────────
    if (method === "POST" && pathParts[1] === "tasks" && pathParts[3] === "proof") {
      const taskId = decodeURIComponent(pathParts[2]);
      const task = await getTask(taskId);
      if (!task) return notFound(`Task ${taskId} not found`);
      const body = parseBody(event);
      const proofId = uid("PROOF");
      const proof = {
        pk: "PROOF",
        sk: proofId,
        id: proofId,
        taskId,
        drainId: task.drainId,
        crewId: task.crewId,
        submittedAt: new Date().toISOString(),
        status: "PENDING_VERIFICATION",
      };

      if (S3_BUCKET) {
        try {
          if (body.before) {
            const b64Data = body.before.replace(/^data:image\/\w+;base64,/, "");
            const buffer = Buffer.from(b64Data, "base64");
            const key = `proofs/${taskId}/before-${Date.now()}.jpg`;
            await s3Client.send(new PutObjectCommand({
              Bucket: S3_BUCKET,
              Key: key,
              Body: buffer,
              ContentType: "image/jpeg",
            }));
            proof.beforeS3Key = key;
          }
          if (body.after) {
            const b64Data = body.after.replace(/^data:image\/\w+;base64,/, "");
            const buffer = Buffer.from(b64Data, "base64");
            const key = `proofs/${taskId}/after-${Date.now()}.jpg`;
            await s3Client.send(new PutObjectCommand({
              Bucket: S3_BUCKET,
              Key: key,
              Body: buffer,
              ContentType: "image/jpeg",
            }));
            proof.afterS3Key = key;
          }
        } catch (err) {
          console.error("S3 upload failed:", err);
          // Failsafe: Continue without S3 keys so demo logic doesn't break
        }
      }

      // Store metadata only — not the raw base64 images (avoid DynamoDB item size limit)
      proof.beforePhotoSize = body.before ? body.before.length : 0;
      proof.afterPhotoSize = body.after ? body.after.length : 0;
      proof.hasBeforePhoto = !!body.before;
      proof.hasAfterPhoto = !!body.after;
      // Attempt AI verification inline (Lovable AI or demo fallback)
      const verification = await attemptVerification(body.before, body.after, task.drainId);
      proof.verification = verification;
      proof.status = verification.verdict === "PASS" ? "AI_PASS" : "NEEDS_REVIEW";

      await db.send(new PutCommand({ TableName: TABLE, Item: proof }));
      // Update task with submittedAt and proof reference
      await db.send(new PutCommand({ TableName: TABLE, Item: { ...task, status: "PROOF_SUBMITTED", submittedAt: proof.submittedAt, proofId, verification } }));
      // Update drain status
      const drain = await getDrainFromDb(task.drainId) ?? DEMO_DRAINS.find(d=>d.id===task.drainId);
      if (drain) await db.send(new PutCommand({ TableName: TABLE, Item: { ...drain, pk:"DRAIN", sk:drain.id??drain.sk, status:"PROOF_SUBMITTED" } }));
      if (verification.verdict === "REVIEW") {
        await db.send(new PutCommand({ TableName: TABLE, Item: { ...drain, pk:"DRAIN", sk:drain.id??drain.sk, status:"NEEDS_REVIEW" } }));
      }

      const { pk, sk, ...proofOut } = proof;
      return ok({ proof: proofOut, verification, taskId });
    }

    // ── POST /api/proofs/:id/verify ───────────────────────────────────────────
    if (method === "POST" && pathParts[1] === "proofs" && pathParts[3] === "verify") {
      const proofId = decodeURIComponent(pathParts[2]);
      const proof = await getProof(proofId);
      if (!proof) return notFound(`Proof ${proofId} not found`);
      // Re-verify using demo logic (Bedrock not configured in base Lambda)
      const verification = { verdict:"REVIEW", confidence: 0, reason:"AI verification requires Bedrock configuration. Routed to manual officer review.", mode:"demo" };
      const updated = { ...proof, verification, status:"NEEDS_REVIEW", verifiedAt: new Date().toISOString() };
      await db.send(new PutCommand({ TableName: TABLE, Item: updated }));
      const task = await getTask(proof.taskId);
      if (task) await db.send(new PutCommand({ TableName: TABLE, Item: { ...task, verification, status:"NEEDS_REVIEW" } }));
      const { pk, sk, ...proofOut } = updated;
      return ok({ proof: proofOut, verification });
    }

    // ── POST /api/proofs/:id/review ───────────────────────────────────────────
    if (method === "POST" && pathParts[1] === "proofs" && pathParts[3] === "review") {
      const proofId = decodeURIComponent(pathParts[2]);
      const proof = await getProof(proofId);
      if (!proof) return notFound(`Proof ${proofId} not found`);
      const body = parseBody(event);
      const { decision, officerName } = body;
      if (!["APPROVED","REJECTED"].includes(decision)) return badRequest("decision must be APPROVED or REJECTED");
      const newStatus = decision === "APPROVED" ? "HUMAN_VERIFIED" : "REJECTED";
      const updated = { ...proof, officerDecision: decision, officerName: officerName ?? "Officer", officerAt: new Date().toISOString(), status: newStatus };
      await db.send(new PutCommand({ TableName: TABLE, Item: updated }));
      // Update task status
      const task = await getTask(proof.taskId);
      if (task) {
        const taskStatus = decision === "APPROVED" ? "VERIFIED" : "REJECTED";
        await db.send(new PutCommand({ TableName: TABLE, Item: { ...task, status: taskStatus, officerDecision: decision, officerAt: updated.officerAt } }));
        // Update drain status
        const drain = await getDrainFromDb(task.drainId) ?? DEMO_DRAINS.find(d=>d.id===task.drainId);
        if (drain) await db.send(new PutCommand({ TableName: TABLE, Item: { ...drain, pk:"DRAIN", sk:drain.id??drain.sk, status: taskStatus } }));
      }
      const { pk, sk, ...proofOut } = updated;
      return ok({ proof: proofOut, decision });
    }

    // ── GET /api/impact ───────────────────────────────────────────────────────
    if (method === "GET" && pathParts[1] === "impact") {
      const dbDrains = await getAllDrains();
      const settings = await getSettings();
      const forecastMm72 = SCENARIO_MM[settings.scenario] ?? 55;
      const sources = dbDrains.length > 0 ? dbDrains : DEMO_DRAINS;
      const tasks = await getAllTasks();
      const statusMap = {};
      tasks.forEach(t => { statusMap[t.drainId] = t.status; });

      const drains = sources.map(d => enrichDrain(d, forecastMm72, statusMap[d.id] ?? d.status ?? "UNASSIGNED"));
      const high = drains.filter(d => d.riskBand === "HIGH");
      const done = drains.filter(d => d.status === "VERIFIED");
      const highDone = high.filter(d => d.status === "VERIFIED").length;
      const den = high.reduce((a, d) => a + d.adjacentPopulationWeight, 0);
      const num = high.filter(d => d.status === "VERIFIED").reduce((a, d) => a + d.adjacentPopulationWeight, 0);
      const exposurePct = den ? Math.round((num / den) * 100) : 0;
      const stats = {
        completed: done.length,
        total: drains.filter(d => d.status !== "UNASSIGNED").length,
        highCoveragePct: high.length ? Math.round((highDone / high.length) * 100) : 0,
        highDone,
        highTotal: high.length,
        exposurePct,
        crewMinutes: done.reduce((a, d) => a + d.cleaningTimeMin, 0),
        source: dbDrains.length > 0 ? "dynamodb" : "demo",
        note: "All figures are PROJECTED or ESTIMATED — not measured real-world impact.",
      };
      return ok(stats);
    }

    // ── GET /api/settings ─────────────────────────────────────────────────────
    if (method === "GET" && pathParts[1] === "settings") {
      const settings = await getSettings();
      const { pk, sk, ...out } = settings;
      return ok(out);
    }

    // ── PATCH /api/settings ───────────────────────────────────────────────────
    if (method === "PATCH" && pathParts[1] === "settings") {
      const body = parseBody(event);
      const current = await getSettings();
      const updated = {
        ...current,
        ...body,
        pk: "SETTINGS",
        sk: "DEFAULT",
        updatedAt: new Date().toISOString(),
      };
      // Whitelist allowed fields only — never let callers overwrite pk/sk
      const safe = {
        pk: "SETTINGS",
        sk: "DEFAULT",
        scenario: updated.scenario ?? "heavy",
        weatherMode: updated.weatherMode ?? "demo",
        updatedAt: updated.updatedAt,
      };
      await db.send(new PutCommand({ TableName: TABLE, Item: safe }));
      const { pk, sk, ...out } = safe;
      return ok(out);
    }

    // ── Health probe (catch-all for /api or /) ────────────────────────────────
    if (pathParts[1] === undefined || pathParts[0] === "api" && !pathParts[1]) {
      return ok({ status: "ok", service: "nalasetu-api", table: TABLE, region: REGION });
    }

    return notFound(`Unknown endpoint: ${method} ${rawPath}`);

  } catch (err) {
    console.error("Handler error:", err);
    return serverError(`Internal error: ${err?.message ?? "unknown"}`);
  }
}

// ─── AI Verification (demo fallback — Bedrock not required) ───────────────────
async function attemptVerification(before, after, drainId) {
  // If photos are identical or missing → REVIEW
  if (!before || !after) {
    return { verdict:"REVIEW", confidence:0, reason:"Missing before or after photo.", mode:"demo" };
  }
  if (before === after) {
    return { verdict:"REVIEW", confidence:22, reason:"Before and after images are identical — no visible change.", mode:"demo" };
  }
  // Deterministic hash-based demo verdict (matches frontend demoVerifier)
  function hash(s) {
    let h=2166136261;
    for(let i=0;i<s.length;i+=Math.max(1,Math.floor(s.length/4000))){ h^=s.charCodeAt(i); h=Math.imul(h,16777619); }
    return h>>>0;
  }
  const sizeDelta = Math.abs(before.length-after.length)/Math.max(before.length,after.length);
  const base = 60+(hash(before+after+(drainId??""))%36);
  const confidence = Math.min(97,Math.round(base+sizeDelta*20));
  const verdict = confidence>=70?"PASS":"REVIEW";
  return {
    verdict,
    confidence,
    reason: verdict==="PASS"
      ? "Visible change between before and after image; obstruction appears reduced."
      : "Change between images is unclear; manual inspection recommended.",
    mode: "demo",
  };
}
