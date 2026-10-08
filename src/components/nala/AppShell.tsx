import { Link, useNavigate } from "@tanstack/react-router";
import { LayoutDashboard, Map, ListOrdered, Route as RouteIcon, HardHat, ClipboardCheck, BarChart3, Settings, MessageSquareWarning, FlaskConical, Droplets, Info, CloudRain, Bell, UserRound, ListChecks } from "lucide-react";
import type { ReactNode } from "react";
import { useNala } from "@/lib/nalasetu/store";
import { ROLE_LABEL, useAuth, type Role } from "@/lib/nalasetu/auth";
import { RequireRole } from "./RequireRole";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { LogOut } from "lucide-react";

type NavItem = { to: "/dashboard" | "/map" | "/drains" | "/dispatch" | "/tasks" | "/crew" | "/reports" | "/verification-lab" | "/impact" | "/settings"; label: string; icon: typeof Map; hash?: string };
const GROUPS: { label: string; items: NavItem[] }[] = [
  { label: "Operations", items: [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/map", label: "Risk Map", icon: Map },
    { to: "/drains", label: "Drains", icon: ListOrdered },
    { to: "/dispatch", label: "Dispatch", icon: RouteIcon },
    { to: "/tasks", label: "Tasks", icon: ListChecks },
  ] },
  { label: "Field", items: [
    { to: "/crew", label: "Crew App", icon: HardHat },
    { to: "/reports", label: "Citizen Reports", icon: MessageSquareWarning },
  ] },
  { label: "Analytics", items: [
    { to: "/tasks", label: "Verification", icon: ClipboardCheck, hash: "verify" },
    { to: "/verification-lab", label: "Test Lab", icon: FlaskConical },
    { to: "/impact", label: "Impact", icon: BarChart3 },
  ] },
  { label: "System", items: [
    { to: "/settings", label: "Settings", icon: Settings },
  ] },
];

const CREW_NAV = new Set(["/crew", "/tasks"]);
function navFor(role: Role | undefined) {
  if (role === "OFFICER") return GROUPS;
  return GROUPS.map((g) => ({ ...g, items: g.items.filter((n) => role === "CREW" && CREW_NAV.has(n.to) && !n.hash) })).filter((g) => g.items.length);
}

export function UserMenu() {
  const { session, signOut, provider } = useAuth();
  const nav = useNavigate();
  if (!session) return null;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="inline-flex items-center gap-1.5 rounded-md border bg-card px-2 py-1 text-xs font-medium transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" aria-label="Account menu">
        <UserRound className="h-3.5 w-3.5 text-muted-foreground" aria-hidden />{ROLE_LABEL[session.role]}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel><div className="text-sm">{session.name}</div><div className="text-xs font-normal text-muted-foreground">Role: {ROLE_LABEL[session.role]}</div></DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="px-2 py-1.5 text-xs text-muted-foreground">Sign-in provider: <span className="font-semibold text-foreground">{provider.label}</span><br />Demo Mode — synthetic prototype access</div>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => { signOut(); nav({ to: "/login", replace: true }); }}><LogOut className="h-4 w-4" />Sign out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function DemoBanner() {
  return (
    <div role="note" className="flex items-center gap-2 border-b border-risk-medium/30 bg-demo px-4 py-1 text-[11px] font-medium text-demo-foreground">
      <Info className="h-3.5 w-3.5 shrink-0" aria-hidden />
      Demo Dataset — synthetic prototype data, not real municipal data.
    </div>
  );
}

function HeaderStatus() {
  const n = useNala();
  const t = new Date(n.weather.fetchedAt);
  const time = isNaN(t.getTime()) ? "—" : t.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
  return (
    <div className="flex flex-wrap items-center gap-2 text-xs">
      <span className="inline-flex items-center gap-1.5 rounded-md border bg-card px-2 py-1 font-medium tabular-nums"><CloudRain className="h-3.5 w-3.5 text-info" aria-hidden />{n.forecastMm} mm · 72h</span>
      <span className="rounded-md border border-risk-medium/40 bg-demo px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-demo-foreground">Demo</span>
      <span className="hidden text-muted-foreground sm:inline" suppressHydrationWarning>Last updated {time}</span>
      <span className="grid h-7 w-7 place-items-center rounded-md border bg-card text-muted-foreground" aria-label="Notifications" title="Notifications"><Bell className="h-3.5 w-3.5" /></span>
      <UserMenu />
    </div>
  );
}

export function AppShell(props: { title: string; subtitle?: string; actions?: ReactNode; children: ReactNode; roles?: Role[] }) {
  return <RequireRole roles={props.roles ?? ["OFFICER"]}><Shell {...props} /></RequireRole>;
}

function Shell({ title, subtitle, actions, children }: { title: string; subtitle?: string; actions?: ReactNode; children: ReactNode }) {
  const { session } = useAuth();
  const groups = navFor(session?.role);
  const flat = groups.flatMap((g) => g.items).filter((n) => !n.hash);
  return (
    <div className="flex min-h-screen bg-background">
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r bg-sidebar text-sidebar-foreground lg:flex">
        <div className="flex items-center gap-2.5 px-5 py-5">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground"><Droplets className="h-4 w-4" aria-hidden /></span>
          <div>
            <div className="text-sm font-semibold text-foreground">NalaSetu</div>
            <div className="text-[11px] text-muted-foreground">Municipal Operations</div>
          </div>
        </div>
        <nav className="flex-1 space-y-5 overflow-y-auto px-3 pb-4">
          {groups.map((g) => (
            <div key={g.label}>
              <div className="px-3 pb-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground/80">{g.label}</div>
              <div className="space-y-0.5">
                {g.items.map((n) => (
                  <Link key={n.label} to={n.to} activeOptions={{ exact: true }}
                    className="relative flex items-center gap-2.5 rounded-md px-3 py-1.5 text-[13px] transition-colors duration-150 hover:bg-sidebar-accent hover:text-foreground"
                    activeProps={n.hash ? {} : { className: "bg-sidebar-accent font-semibold text-foreground before:absolute before:left-0 before:top-1.5 before:bottom-1.5 before:w-0.5 before:rounded-full before:bg-foreground" }}>
                    <n.icon className="h-4 w-4" aria-hidden />{n.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>
        <div className="m-3 rounded-lg border border-risk-medium/30 bg-demo px-3 py-2.5">
          <div className="text-[10px] font-bold uppercase tracking-wide text-demo-foreground">Demo mode</div>
          <div className="text-[11px] text-demo-foreground/80">Synthetic prototype data</div>
        </div>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <DemoBanner />
        <nav className="flex gap-1 overflow-x-auto border-b bg-card px-2 py-1.5 lg:hidden">
          {flat.map((n) => (
            <Link key={n.label} to={n.to} className="flex shrink-0 items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs text-muted-foreground" activeProps={{ className: "bg-accent font-semibold text-foreground" }}>
              <n.icon className="h-3.5 w-3.5" aria-hidden />{n.label}
            </Link>
          ))}
        </nav>
        <header className="flex flex-wrap items-center justify-between gap-3 border-b bg-card px-4 py-3 md:px-6">
          <div>
            <h1 className="text-base font-semibold tracking-tight">{title}</h1>
            {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
          </div>
          <HeaderStatus />
        </header>
        {actions && <div className="flex flex-wrap gap-2 border-b bg-card px-4 py-2 md:px-6">{actions}</div>}
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}

export function Panel({ title, right, children, className = "", subtitle }: { title?: ReactNode; subtitle?: ReactNode; right?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={`rounded-xl border bg-card shadow-card ${className}`}>
      {title && <div className="flex items-start justify-between gap-2 border-b px-4 py-3"><div><h2 className="text-sm font-semibold">{title}</h2>{subtitle && <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>}</div>{right}</div>}
      <div className="p-4">{children}</div>
    </section>
  );
}

export function Kpi({ label, value, hint, tone }: { label: string; value: ReactNode; hint?: ReactNode; tone?: "high" | "ok" | undefined }) {
  return (
    <div className="rounded-xl border bg-card px-4 py-3 shadow-card">
      <div className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className={`mt-1 text-2xl font-semibold tabular-nums ${tone === "high" ? "text-risk-high" : tone === "ok" ? "text-risk-low" : ""}`}>{value}</div>
      {hint && <div className="mt-0.5 text-xs text-muted-foreground">{hint}</div>}
    </div>
  );
}
