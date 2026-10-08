import { Component, type ErrorInfo, type ReactNode } from "react";
import { AlertTriangle, LayoutDashboard, RotateCcw, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export function RecoveryScreen({ error, onRetry }: { error?: unknown; onRetry?: () => void }) {
  const msg = error instanceof Error ? error.message : typeof error === "string" ? error : "";
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div role="alert" className="w-full max-w-md rounded-md border bg-card p-6">
        <div className="flex items-center gap-2 text-st-review"><AlertTriangle className="h-5 w-5" /><h1 className="text-lg font-bold">This screen hit a problem</h1></div>
        <p className="mt-2 text-sm text-muted-foreground">Your plans, tasks and photos are still saved in this browser. Try again, or go back to the dashboard.</p>
        {msg && <pre className="mt-3 max-h-32 overflow-auto rounded bg-muted p-2 text-xs text-muted-foreground">{msg}</pre>}
        <div className="mt-4 flex flex-wrap gap-2">
          <Button onClick={() => (onRetry ? onRetry() : window.location.reload())}><RefreshCw className="h-4 w-4" />Try again</Button>
          <Button variant="outline" onClick={() => { window.location.href = "/dashboard"; }}><LayoutDashboard className="h-4 w-4" />Dashboard</Button>
          <Button variant="ghost" onClick={() => { if (confirm("Clear all demo data in this browser?")) { localStorage.removeItem("nalasetu.demo.v1"); window.location.href = "/dashboard"; } }}><RotateCcw className="h-4 w-4" />Reset demo data</Button>
        </div>
      </div>
    </div>
  );
}

/** Catches render errors anywhere below (including the data provider) so the app never blanks. */
export class AppErrorBoundary extends Component<{ children: ReactNode }, { error: unknown }> {
  override state = { error: null as unknown };
  static getDerivedStateFromError(error: unknown) { return { error }; }
  override componentDidCatch(error: unknown, info: ErrorInfo) { console.error("App error boundary", error, info.componentStack); }
  override render() {
    if (this.state.error) return <RecoveryScreen error={this.state.error} onRetry={() => this.setState({ error: null })} />;
    return this.props.children;
  }
}
