import { useNavigate } from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { ROLE_HOME, useAuth, type Role } from "@/lib/nalasetu/auth";

/** Client-side demo gate: sends visitors without a session to /login and wrong roles to their own home. */
export function RequireRole({ roles, children }: { roles: Role[]; children: ReactNode }) {
  const { ready, session } = useAuth();
  const nav = useNavigate();
  const allowed = !!session && roles.includes(session.role);
  useEffect(() => {
    if (!ready || allowed) return;
    nav({ to: session ? ROLE_HOME[session.role] : "/login", replace: true });
  }, [ready, allowed, session, nav]);
  if (!ready || !allowed) {
    return <div className="grid min-h-screen place-items-center bg-background text-sm text-muted-foreground"><span className="inline-flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" />Checking access…</span></div>;
  }
  return <>{children}</>;
}
