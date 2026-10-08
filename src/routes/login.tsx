import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, CloudRain, Droplets, Eye, EyeOff, Gauge, HardHat, Loader2, MapPinned, MessageSquareWarning, Route as RouteIcon, ShieldCheck, Building2, Info } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ROLE_HOME, ROLE_LABEL, useAuth, type Role } from "@/lib/nalasetu/auth";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [
    { title: "Sign in — NalaSetu Municipal Operations" },
    { name: "description", content: "Sign in to NalaSetu to predict drain risk, plan pre-rain cleaning and verify field work." },
    { property: "og:title", content: "Sign in — NalaSetu Municipal Operations" },
    { property: "og:description", content: "Municipal drain operations platform: predict risk, prioritize cleaning, verify field work." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: LoginPage,
});

const ROLES: { role: Role; icon: typeof Building2; hint: string }[] = [
  { role: "OFFICER", icon: Building2, hint: "Dashboard access" },
  { role: "CREW", icon: HardHat, hint: "Field task access" },
  { role: "CITIZEN", icon: MessageSquareWarning, hint: "Report issue access" },
];
const FLOW = [
  { label: "Rain", icon: CloudRain },
  { label: "Risk", icon: Gauge },
  { label: "Plan", icon: MapPinned },
  { label: "Dispatch", icon: RouteIcon },
  { label: "Verify", icon: ShieldCheck },
];

function DrainGrid() {
  // Subtle abstract drain-network motif, drawn with theme tokens.
  return (
    <svg viewBox="0 0 320 160" className="h-auto w-full text-border" aria-hidden>
      <g stroke="currentColor" strokeWidth="1" fill="none">
        {[20, 60, 100, 140].map((y) => <line key={y} x1="0" y1={y} x2="320" y2={y} />)}
        {[40, 110, 180, 250].map((x) => <line key={x} x1={x} y1="0" x2={x} y2="160" />)}
      </g>
      <path d="M0 100 H110 V60 H250 V20 H320" stroke="var(--info)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      {[[110, 100, "var(--risk-high)"], [180, 60, "var(--risk-medium)"], [250, 20, "var(--risk-low)"], [40, 140, "var(--risk-low)"], [250, 140, "var(--risk-medium)"]].map(([x, y, c]) => (
        <circle key={`${x}-${y}`} cx={x as number} cy={y as number} r="5" fill={c as string} stroke="var(--card)" strokeWidth="2" />
      ))}
    </svg>
  );
}

function LoginPage() {
  const { ready, session, signIn, demoSignIn, provider } = useAuth();
  const nav = useNavigate();
  const [role, setRole] = useState<Role>("OFFICER");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [remember, setRemember] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { if (ready && session) nav({ to: ROLE_HOME[session.role], replace: true }); }, [ready, session, nav]);

  const go = (r: Role) => { const s = demoSignIn(r, remember); nav({ to: ROLE_HOME[s.role], replace: true }); };
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email.trim() || !password) { setError("Enter your work email or demo ID and password."); return; }
    setBusy(true);
    try { const s = await signIn(email.trim(), password, role, remember); nav({ to: ROLE_HOME[s.role], replace: true }); }
    catch (er) { setError((er as Error).message || "Unable to sign in. Check your credentials."); }
    finally { setBusy(false); }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <main className="mx-auto grid w-full max-w-6xl flex-1 items-center gap-8 px-4 py-8 md:px-8 lg:grid-cols-[1.1fr_1fr] lg:gap-16 lg:py-12">
        <section aria-labelledby="brand" className="space-y-6">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-primary text-primary-foreground"><Droplets className="h-5 w-5" aria-hidden /></span>
            <div>
              <div id="brand" className="text-lg font-semibold tracking-tight">NalaSetu</div>
              <div className="text-xs text-muted-foreground">Municipal Drain Operations Platform</div>
            </div>
          </div>
          <h1 className="max-w-md text-2xl font-semibold leading-tight tracking-tight md:text-3xl">Predict risk. Prioritize cleaning. Verify field work.</h1>
          <p className="max-w-md text-sm text-muted-foreground">Decide which drains to clean before heavy rain, dispatch crews within their hours, and confirm every job with photo proof and officer review.</p>
          <ol className="flex flex-wrap items-center gap-1.5" aria-label="Operational flow">
            {FLOW.map((f, i) => (
              <li key={f.label} className="flex items-center gap-1.5">
                <span className="inline-flex items-center gap-1.5 rounded-md border bg-card px-2.5 py-1.5 text-xs font-semibold uppercase tracking-wide shadow-card"><f.icon className="h-3.5 w-3.5 text-info" aria-hidden />{f.label}</span>
                {i < FLOW.length - 1 && <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" aria-hidden />}
              </li>
            ))}
          </ol>
          <div className="hidden max-w-md rounded-xl border bg-card p-4 shadow-card lg:block">
            <div className="mb-2 flex items-center justify-between text-[11px] font-semibold uppercase tracking-wide text-muted-foreground"><span>Demo Ward 7 · drain network</span><span className="flex items-center gap-2"><i className="h-2 w-2 rounded-full bg-risk-high" />High<i className="h-2 w-2 rounded-full bg-risk-medium" />Med<i className="h-2 w-2 rounded-full bg-risk-low" />Low</span></div>
            <DrainGrid />
          </div>
        </section>

        <section aria-labelledby="signin" className="w-full rounded-xl border bg-card p-6 shadow-raised md:p-8">
          <h2 id="signin" className="text-lg font-semibold tracking-tight">Sign in to Municipal Operations</h2>
          <p className="mt-1 text-sm text-muted-foreground">Access your operational dashboard.</p>

          <fieldset className="mt-6">
            <legend className="mb-2 text-xs font-medium">Role</legend>
            <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Role">
              {ROLES.map(({ role: r, icon: I, hint }) => (
                <button key={r} type="button" role="radio" aria-checked={role === r} onClick={() => setRole(r)}
                  className={`flex min-h-[76px] flex-col items-center justify-center gap-1 rounded-lg border px-2 py-2 text-center transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${role === r ? "border-primary bg-accent ring-1 ring-primary" : "hover:bg-muted"}`}>
                  <I className={`h-4 w-4 ${role === r ? "text-foreground" : "text-muted-foreground"}`} aria-hidden />
                  <span className="text-xs font-semibold leading-tight">{ROLE_LABEL[r]}</span>
                  <span className="text-[10px] text-muted-foreground">{hint}</span>
                </button>
              ))}
            </div>
          </fieldset>

          <form onSubmit={submit} className="mt-5 space-y-4" noValidate>
            <div className="space-y-1.5">
              <Label htmlFor="email">Work Email / Demo ID</Label>
              <Input id="email" autoComplete="username" className="h-11" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@municipality.gov" aria-invalid={!!error} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input id="password" type={show ? "text" : "password"} autoComplete="current-password" className="h-11 pr-10" value={password} onChange={(e) => setPassword(e.target.value)} aria-invalid={!!error} />
                <button type="button" onClick={() => setShow((v) => !v)} aria-label={show ? "Hide password" : "Show password"} className="absolute right-1 top-1 grid h-9 w-9 place-items-center rounded-md text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm"><Checkbox checked={remember} onCheckedChange={(v) => setRemember(v === true)} />Remember me</label>
              <button type="button" className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline" onClick={() => toast.info("Password recovery is disabled in Demo Mode.")}>Forgot password?</button>
            </div>
            {error && <p role="alert" className="rounded-md border border-risk-high/30 bg-risk-high/5 px-3 py-2 text-sm text-risk-high">{error}</p>}
            <Button type="submit" className="h-11 w-full transition-colors duration-150" disabled={busy}>
              {busy ? <><Loader2 className="h-4 w-4 animate-spin" />Signing in…</> : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 rounded-lg border border-risk-medium/30 bg-demo/60 p-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wide text-demo-foreground">Demo access</span>
              <span className="text-[11px] text-demo-foreground/80">Demo Mode · synthetic prototype access</span>
            </div>
            <div className="mt-3 grid gap-2">
              <Button variant="outline" className="h-11 bg-card" onClick={() => go("OFFICER")}><Building2 className="h-4 w-4" />Continue as Officer</Button>
              <Button variant="outline" className="h-11 bg-card" onClick={() => go("CREW")}><HardHat className="h-4 w-4" />Continue as Crew</Button>
              <Button variant="outline" className="h-11 bg-card" onClick={() => go("CITIZEN")}><MessageSquareWarning className="h-4 w-4" />Report as Citizen</Button>
            </div>
          </div>
          <p className="mt-4 text-center text-[11px] text-muted-foreground">Authentication provider: <span className="font-semibold">{provider.label}</span></p>
        </section>
      </main>
      <footer className="border-t px-4 py-3 text-center text-[11px] text-muted-foreground"><Info className="mr-1 inline h-3 w-3 align-[-2px]" /><span className="font-semibold">DEMO MODE</span> — Synthetic prototype environment — not a real municipal system.</footer>
    </div>
  );
}
