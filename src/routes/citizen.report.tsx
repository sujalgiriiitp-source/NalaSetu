import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Droplets, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DemoBanner } from "@/components/nala/AppShell";
import { RequireRole } from "@/components/nala/RequireRole";
import { CitizenReportForm } from "@/components/nala/CitizenReportForm";
import { useAuth } from "@/lib/nalasetu/auth";

export const Route = createFileRoute("/citizen/report")({
  head: () => ({ meta: [
    { title: "Report a drain problem — NalaSetu" },
    { name: "description", content: "Tell your municipality about a blocked, overflowing or garbage-filled drain in four quick steps." },
    { property: "og:title", content: "Report a drain problem — NalaSetu" },
    { property: "og:description", content: "Report blocked or overflowing drains in four quick steps." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: () => <RequireRole roles={["CITIZEN"]}><CitizenPage /></RequireRole>,
});

function CitizenPage() {
  const { signOut } = useAuth();
  const nav = useNavigate();
  return (
    <div className="min-h-screen bg-background">
      <DemoBanner />
      <header className="border-b bg-card px-4 py-3">
        <div className="mx-auto flex max-w-md items-center justify-between">
          <div className="flex items-center gap-2.5"><span className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground"><Droplets className="h-4 w-4" aria-hidden /></span><div><div className="text-sm font-semibold">Report Drain Problem</div><div className="text-[11px] text-muted-foreground">NalaSetu · Citizen</div></div></div>
          <Button variant="ghost" size="sm" onClick={() => { signOut(); nav({ to: "/login", replace: true }); }}><LogOut className="h-4 w-4" />Sign out</Button>
        </div>
      </header>
      <main className="mx-auto max-w-md p-4">
        <div className="rounded-xl border bg-card p-4 shadow-card"><CitizenReportForm showImpact={false} /></div>
      </main>
    </div>
  );
}
