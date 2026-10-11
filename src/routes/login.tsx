import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  CloudRain,
  Droplets,
  Eye,
  EyeOff,
  Gauge,
  HardHat,
  Loader2,
  MapPinned,
  MessageSquareWarning,
  Route as RouteIcon,
  ShieldCheck,
  Building2,
  Info,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ROLE_HOME, ROLE_LABEL, useAuth, type Role } from "@/lib/nalasetu/auth";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — NalaSetu Municipal Operations" },
      {
        name: "description",
        content:
          "Sign in to NalaSetu to predict drain risk, plan pre-rain cleaning and verify field work.",
      },
      { property: "og:title", content: "Sign in — NalaSetu Municipal Operations" },
      {
        property: "og:description",
        content:
          "Municipal drain operations platform: predict risk, prioritize cleaning, verify field work.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
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
        {[20, 60, 100, 140].map((y) => (
          <line key={y} x1="0" y1={y} x2="320" y2={y} />
        ))}
        {[40, 110, 180, 250].map((x) => (
          <line key={x} x1={x} y1="0" x2={x} y2="160" />
        ))}
      </g>
      <path
        d="M0 100 H110 V60 H250 V20 H320"
        stroke="var(--info)"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
      {[
        [110, 100, "var(--risk-high)"],
        [180, 60, "var(--risk-medium)"],
        [250, 20, "var(--risk-low)"],
        [40, 140, "var(--risk-low)"],
        [250, 140, "var(--risk-medium)"],
      ].map(([x, y, c]) => (
        <circle
          key={`${x}-${y}`}
          cx={x as number}
          cy={y as number}
          r="5"
          fill={c as string}
          stroke="var(--card)"
          strokeWidth="2"
        />
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

  useEffect(() => {
    if (ready && session) nav({ to: ROLE_HOME[session.role], replace: true });
  }, [ready, session, nav]);

  const go = (r: Role) => {
    const s = demoSignIn(r, remember);
    nav({ to: ROLE_HOME[s.role], replace: true });
  };
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email.trim() || !password) {
      setError("Enter your work email or demo ID and password.");
      return;
    }
    setBusy(true);
    try {
      const s = await signIn(email.trim(), password, role, remember);
      nav({ to: ROLE_HOME[s.role], replace: true });
    } catch (er) {
      setError((er as Error).message || "Unable to sign in. Check your credentials.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <main className="grid flex-1 lg:min-h-screen lg:grid-cols-[minmax(0,1.05fr)_minmax(440px,0.95fr)]">
        <section
          aria-labelledby="brand"
          className="relative isolate overflow-hidden bg-primary px-5 py-8 text-primary-foreground sm:px-8 sm:py-10 lg:flex lg:min-h-screen lg:flex-col lg:justify-center lg:px-12 lg:py-14 xl:px-16"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10 opacity-[0.08]"
            style={{
              backgroundImage:
                "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />
          <div className="mx-auto w-full max-w-xl space-y-7">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-md bg-primary-foreground text-primary">
                <Droplets className="h-5 w-5" aria-hidden />
              </span>
              <div>
                <div id="brand" className="text-lg font-semibold tracking-tight">
                  NalaSetu
                </div>
                <div className="text-xs text-primary-foreground/75">
                  Municipal Drain Operations Platform
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary-foreground/70">
                Municipal operations
              </p>
              <h1 className="max-w-lg text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
                Predict risk. Prioritize cleaning. Verify field work.
              </h1>
              <p className="max-w-lg text-sm leading-6 text-primary-foreground/80 sm:text-base">
                Help municipal teams prioritize drain cleaning before heavy rainfall, coordinate
                field crews, and review photo-based proof of completed work.
              </p>
            </div>

            <ol
              className="flex flex-wrap items-center gap-x-2 gap-y-2"
              aria-label="Operational flow"
            >
              {FLOW.map((f, i) => (
                <li key={f.label} className="flex items-center gap-2">
                  <span className="inline-flex min-h-9 items-center gap-2 rounded-md border border-primary-foreground/20 bg-primary-foreground/10 px-2.5 py-1.5 text-[11px] font-semibold uppercase tracking-wide">
                    <f.icon className="h-3.5 w-3.5 text-primary-foreground/80" aria-hidden />
                    {f.label}
                  </span>
                  {i < FLOW.length - 1 && (
                    <ArrowRight className="h-3.5 w-3.5 text-primary-foreground/50" aria-hidden />
                  )}
                </li>
              ))}
            </ol>

            <div className="hidden max-w-lg rounded-lg border border-primary-foreground/20 bg-primary-foreground/5 p-4 sm:block">
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2 text-[10px] font-semibold uppercase tracking-wide text-primary-foreground/75">
                <span>Illustrative network · Demo Ward 7</span>
                <span className="flex items-center gap-2.5">
                  <span className="inline-flex items-center gap-1.5">
                    <i className="h-2 w-2 rounded-full bg-risk-high" />
                    High
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <i className="h-2 w-2 rounded-full bg-risk-medium" />
                    Medium
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <i className="h-2 w-2 rounded-full bg-risk-low" />
                    Low
                  </span>
                </span>
              </div>
              <DrainGrid />
              <p className="mt-1 text-[10px] text-primary-foreground/65">
                Synthetic illustration, not live municipal data.
              </p>
            </div>
          </div>
        </section>

        <section
          aria-labelledby="signin"
          className="flex items-center justify-center px-4 py-8 sm:px-8 sm:py-10 lg:px-10 xl:px-16"
        >
          <div className="w-full max-w-md">
            <div className="mb-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-info">
                Operational workspace
              </p>
              <h2 id="signin" className="mt-2 text-2xl font-semibold tracking-tight">
                Sign in to NalaSetu
              </h2>
              <p className="mt-1.5 text-sm text-muted-foreground">
                Access your operational workspace.
              </p>
            </div>

            <fieldset>
              <legend className="mb-2 text-sm font-semibold">Choose your role</legend>
              <div
                className="grid grid-cols-1 gap-2 sm:grid-cols-3"
                role="radiogroup"
                aria-label="Role"
              >
                {ROLES.map(({ role: r, icon: I, hint }, index) => (
                  <button
                    key={r}
                    type="button"
                    role="radio"
                    aria-checked={role === r}
                    tabIndex={role === r ? 0 : -1}
                    onClick={() => setRole(r)}
                    onKeyDown={(event) => {
                      const direction = ["ArrowRight", "ArrowDown"].includes(event.key)
                        ? 1
                        : ["ArrowLeft", "ArrowUp"].includes(event.key)
                          ? -1
                          : 0;
                      if (direction) {
                        event.preventDefault();
                        const next = (index + direction + ROLES.length) % ROLES.length;
                        setRole(ROLES[next].role);
                        event.currentTarget.parentElement
                          ?.querySelectorAll<HTMLButtonElement>('[role="radio"]')
                          [next]?.focus();
                      }
                    }}
                    className={`flex min-h-[72px] items-center gap-3 rounded-md border px-3 py-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-info sm:min-h-[104px] sm:flex-col sm:justify-center sm:gap-1.5 sm:px-2 sm:text-center ${
                      role === r
                        ? "border-info bg-accent ring-1 ring-info"
                        : "bg-card hover:border-foreground/25 hover:bg-muted/60"
                    }`}
                  >
                    <I
                      className={`h-5 w-5 shrink-0 ${role === r ? "text-info" : "text-muted-foreground"}`}
                      aria-hidden
                    />
                    <span className="min-w-0">
                      <span className="block text-xs font-semibold leading-tight">
                        {ROLE_LABEL[r]}
                      </span>
                      <span className="mt-0.5 block text-[10px] leading-tight text-muted-foreground">
                        {hint}
                      </span>
                    </span>
                    <span className="sr-only">{role === r ? "Selected" : ""}</span>
                  </button>
                ))}
              </div>
            </fieldset>

            <form onSubmit={submit} className="mt-5 space-y-4" noValidate>
              <div className="space-y-1.5">
                <Label htmlFor="email">Work Email / Demo ID</Label>
                <Input
                  id="email"
                  autoComplete="username"
                  className="h-11 bg-card"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@municipality.gov"
                  aria-invalid={!!error}
                  aria-describedby={error ? "login-error" : undefined}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={show ? "text" : "password"}
                    autoComplete="current-password"
                    className="h-11 bg-card pr-12"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    aria-invalid={!!error}
                    aria-describedby={error ? "login-error" : undefined}
                  />
                  <button
                    type="button"
                    onClick={() => setShow((v) => !v)}
                    aria-label={show ? "Hide password" : "Show password"}
                    aria-pressed={show}
                    className="absolute right-1 top-1 grid h-9 w-9 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-info"
                  >
                    {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <Label
                  htmlFor="remember"
                  className="flex cursor-pointer items-center gap-2 text-sm"
                >
                  <Checkbox
                    id="remember"
                    checked={remember}
                    onCheckedChange={(v) => setRemember(v === true)}
                  />
                  Remember me
                </Label>
                <button
                  type="button"
                  className="rounded-sm text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-info"
                  onClick={() => toast.info("Password recovery is disabled in Demo Mode.")}
                >
                  Forgot password?
                </button>
              </div>
              {error && (
                <p
                  id="login-error"
                  role="alert"
                  aria-live="assertive"
                  className="rounded-md border border-risk-high/30 bg-risk-high/5 px-3 py-2.5 text-sm text-risk-high"
                >
                  {error}
                </p>
              )}
              <Button type="submit" className="h-11 w-full" disabled={busy}>
                {busy ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Signing in…
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

            <div className="my-6 flex items-center gap-3" aria-hidden="true">
              <span className="h-px flex-1 bg-border" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                Or use demo access
              </span>
              <span className="h-px flex-1 bg-border" />
            </div>

            <section aria-labelledby="demo-access" className="rounded-lg border bg-muted/40 p-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <h3
                  id="demo-access"
                  className="text-xs font-semibold uppercase tracking-wide text-foreground"
                >
                  Demo access
                </h3>
                <span className="text-[11px] text-muted-foreground">
                  Demo Mode — synthetic prototype access
                </span>
              </div>
              <div className="mt-3 grid gap-2 sm:grid-cols-3">
                <Button variant="outline" className="h-11 bg-card" onClick={() => go("OFFICER")}>
                  <Building2 className="h-4 w-4" />
                  Officer
                </Button>
                <Button variant="outline" className="h-11 bg-card" onClick={() => go("CREW")}>
                  <HardHat className="h-4 w-4" />
                  Crew
                </Button>
                <Button variant="outline" className="h-11 bg-card" onClick={() => go("CITIZEN")}>
                  <MessageSquareWarning className="h-4 w-4" />
                  Citizen
                </Button>
              </div>
            </section>

            <p className="mt-5 text-center text-xs text-muted-foreground">
              Authentication provider:{" "}
              <span className="font-semibold text-foreground">{provider.label}</span>
            </p>
          </div>
        </section>
      </main>
      <footer className="border-t px-4 py-3 text-center text-[11px] text-muted-foreground">
        <Info className="mr-1 inline h-3 w-3 align-[-2px]" aria-hidden />
        <span className="font-semibold">DEMO MODE</span> — Synthetic prototype environment — not a
        real municipal system.
      </footer>
    </div>
  );
}
