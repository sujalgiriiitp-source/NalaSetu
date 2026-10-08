import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type Role = "OFFICER" | "CREW" | "CITIZEN";
export type Session = { role: Role; name: string; provider: "demo"; startedAt: string };

export const ROLE_LABEL: Record<Role, string> = { OFFICER: "Municipal Officer", CREW: "Crew Member", CITIZEN: "Citizen" };
export const ROLE_HOME = { OFFICER: "/dashboard", CREW: "/crew", CITIZEN: "/citizen/report" } as const;

/** Swap-in point for a real identity provider (e.g. Amazon Cognito). */
export interface AuthAdapter {
  readonly id: "demo" | "cognito";
  readonly label: string;
  signIn(email: string, password: string, role: Role): Promise<Session>;
  demoSignIn(role: Role): Session;
  load(): Session | null;
  save(s: Session, remember: boolean): void;
  clear(): void;
}

const KEY = "nalasetu.session.v1";

export const DemoAuthAdapter: AuthAdapter = {
  id: "demo",
  label: "Demo",
  async signIn() {
    // No real identity provider is configured, so credential sign-in never succeeds.
    await new Promise((r) => setTimeout(r, 500));
    throw new Error("Unable to sign in. Check your credentials.");
  },
  demoSignIn(role) {
    return { role, name: `Demo ${ROLE_LABEL[role]}`, provider: "demo", startedAt: new Date().toISOString() };
  },
  load() {
    try {
      const raw = sessionStorage.getItem(KEY) ?? localStorage.getItem(KEY);
      const s = raw ? (JSON.parse(raw) as Session) : null;
      return s && s.role in ROLE_LABEL ? s : null;
    } catch { return null; }
  },
  save(s, remember) {
    this.clear();
    (remember ? localStorage : sessionStorage).setItem(KEY, JSON.stringify(s));
  },
  clear() {
    try { sessionStorage.removeItem(KEY); localStorage.removeItem(KEY); } catch { /* ignore */ }
  },
};

type Ctx = {
  ready: boolean;
  session: Session | null;
  provider: AuthAdapter;
  signIn: (email: string, password: string, role: Role, remember: boolean) => Promise<Session>;
  demoSignIn: (role: Role, remember?: boolean) => Session;
  signOut: () => void;
};
const AuthCtx = createContext<Ctx | null>(null);

export function AuthProvider({ children, adapter = DemoAuthAdapter }: { children: ReactNode; adapter?: AuthAdapter }) {
  const [ready, setReady] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  useEffect(() => { setSession(adapter.load()); setReady(true); }, [adapter]);
  const value = useMemo<Ctx>(() => ({
    ready, session, provider: adapter,
    async signIn(email, password, role, remember) { const s = await adapter.signIn(email, password, role); adapter.save(s, remember); setSession(s); return s; },
    demoSignIn(role, remember = false) { const s = adapter.demoSignIn(role); adapter.save(s, remember); setSession(s); return s; },
    signOut() { adapter.clear(); setSession(null); },
  }), [ready, session, adapter]);
  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
  const c = useContext(AuthCtx);
  if (!c) throw new Error("useAuth must be used inside AuthProvider");
  return c;
}
