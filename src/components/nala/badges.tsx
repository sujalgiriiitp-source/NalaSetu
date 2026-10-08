import { AlertTriangle, CheckCircle2, Circle, Clock, Camera, Truck, Wrench, XCircle, ShieldCheck, Database } from "lucide-react";
import { cn } from "@/lib/utils";
import { STATUS_LABEL } from "@/lib/nalasetu/state-machine";
import type { RiskBand, TaskStatus } from "@/lib/nalasetu/types";

const RISK: Record<RiskBand, string> = {
  HIGH: "bg-risk-high/10 text-risk-high border-risk-high/30",
  MEDIUM: "bg-risk-medium/15 text-demo-foreground border-risk-medium/40",
  LOW: "bg-risk-low/10 text-risk-low border-risk-low/30",
};
export function RiskBadge({ band, score, className }: { band: RiskBand; score?: number; className?: string }) {
  const Icon = band === "HIGH" ? AlertTriangle : band === "MEDIUM" ? Clock : CheckCircle2;
  return (
    <span className={cn("inline-flex items-center gap-1 rounded border px-1.5 py-0.5 text-xs font-semibold", RISK[band], className)}>
      <Icon className="h-3 w-3" aria-hidden />
      {score !== undefined && <span className="tabular-nums">{score}</span>}
      {band}
    </span>
  );
}

const ST: Record<TaskStatus, [string, typeof Circle]> = {
  UNASSIGNED: ["text-st-muted border-border bg-muted", Circle],
  ASSIGNED: ["text-st-assigned border-st-assigned/30 bg-st-assigned/10", Clock],
  EN_ROUTE: ["text-st-enroute border-st-enroute/30 bg-st-enroute/10", Truck],
  CLEANING: ["text-st-cleaning border-st-cleaning/40 bg-st-cleaning/10", Wrench],
  PROOF_SUBMITTED: ["text-st-proof border-st-proof/30 bg-st-proof/10", Camera],
  VERIFIED: ["text-st-verified border-st-verified/30 bg-st-verified/10", ShieldCheck],
  NEEDS_REVIEW: ["text-st-review border-st-review/30 bg-st-review/10", AlertTriangle],
  REJECTED: ["text-st-review border-st-review/30 bg-st-review/10", XCircle],
};
export function StatusBadge({ status }: { status: TaskStatus }) {
  const [c, Icon] = ST[status];
  return (
    <span className={cn("inline-flex items-center gap-1 whitespace-nowrap rounded border px-1.5 py-0.5 text-xs font-medium", c)}>
      <Icon className="h-3 w-3" aria-hidden />
      {STATUS_LABEL[status]}
    </span>
  );
}

export function SourceBadge({ source }: { source: "live" | "cached" | "demo" }) {
  const c = source === "live" ? "bg-risk-low/10 text-risk-low border-risk-low/30" : source === "cached" ? "bg-st-proof/10 text-st-proof border-st-proof/30" : "bg-demo text-demo-foreground border-risk-medium/40";
  return <span className={cn("inline-flex items-center gap-1 rounded border px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide", c)}><Database className="h-3 w-3" aria-hidden />{source}</span>;
}

export function Tag({ children, tone = "muted" }: { children: React.ReactNode; tone?: "muted" | "demo" | "ok" }) {
  const c = tone === "demo" ? "bg-demo text-demo-foreground border-risk-medium/40" : tone === "ok" ? "bg-risk-low/10 text-risk-low border-risk-low/30" : "bg-muted text-muted-foreground border-border";
  return <span className={cn("inline-flex items-center rounded border px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide", c)}>{children}</span>;
}
