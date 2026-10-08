import { useState } from "react";
import { toast } from "sonner";
import { Ban, Check, CheckCircle2, Droplets, Trash2, Waves } from "lucide-react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNala } from "@/lib/nalasetu/store";
import { processPhoto } from "@/lib/nalasetu/verify";

const ISSUES = [
  { label: "Blocked drain", icon: Ban },
  { label: "Garbage", icon: Trash2 },
  { label: "Water accumulation", icon: Waves },
  { label: "Overflow", icon: Droplets },
] as const;
const schema = z.object({ drainId: z.string().min(1, "Choose the nearest drain"), issue: z.string().min(1, "Choose a problem"), location: z.string().trim().min(2, "Describe the location").max(120) });

function StepLabel({ n, title, done }: { n: number; title: string; done: boolean }) {
  return <div className="mb-2 flex items-center gap-2 text-sm font-semibold"><span className={`grid h-6 w-6 place-items-center rounded-full border text-xs tabular-nums ${done ? "border-risk-low bg-risk-low text-primary-foreground" : "bg-card"}`}>{done ? <Check className="h-3 w-3" /> : n}</span>{title}</div>;
}

export function CitizenReportForm({ showImpact = true }: { showImpact?: boolean }) {
  const n = useNala();
  const [form, setForm] = useState({ drainId: "", issue: "", location: "" });
  const [photo, setPhoto] = useState(false);
  const [doneId, setDoneId] = useState<string | null>(null);
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const r = schema.safeParse(form);
    if (!r.success) { toast.error(r.error.issues[0]?.message ?? "Invalid report"); return; }
    const before = n.drains.find((d) => d.id === form.drainId)!;
    const id = n.addReport(r.data);
    setDoneId(id);
    if (showImpact) toast.success(`${before.id} citizen reports: ${before.citizenReports} → ${before.citizenReports + 1}`);
  };
  const reset = () => { setForm({ drainId: "", issue: "", location: "" }); setPhoto(false); setDoneId(null); };
  const cls = "h-11 w-full rounded-md border bg-card px-3 text-sm";
  return (
    <>
          {doneId ? (
            <div className="py-6 text-center">
              <CheckCircle2 className="mx-auto h-10 w-10 text-risk-low" />
              <p className="mt-3 text-lg font-semibold">Report submitted.</p>
              <p className="text-sm text-muted-foreground">Report ID</p>
              <p className="font-mono text-base font-semibold">{doneId}</p>
              <Button variant="outline" className="mt-4" onClick={reset}>Report another problem</Button>
            </div>
          ) : (
          <form onSubmit={submit} className="space-y-5 text-sm">
            <div>
              <StepLabel n={1} title="Location" done={!!form.drainId && form.location.trim().length >= 2} />
              <select aria-label="Nearest drain" className={cls} value={form.drainId} onChange={(e) => setForm({ ...form, drainId: e.target.value })}><option value="">Nearest drain…</option>{n.drains.map((d) => <option key={d.id} value={d.id}>{d.id} · {d.name}</option>)}</select>
              <Input aria-label="Location details" className="mt-2 h-11" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Landmark, e.g. near bus stop" />
            </div>
            <div>
              <StepLabel n={2} title="Problem" done={!!form.issue} />
              <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label="Problem">
                {ISSUES.map(({ label, icon: I }) => (
                  <button type="button" role="radio" aria-checked={form.issue === label} key={label} onClick={() => setForm({ ...form, issue: label })}
                    className={`flex h-16 flex-col items-center justify-center gap-1 rounded-lg border text-xs font-medium transition-colors ${form.issue === label ? "border-primary bg-accent text-foreground ring-1 ring-primary" : "bg-card text-muted-foreground hover:text-foreground"}`}>
                    <I className="h-5 w-5" aria-hidden />{label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <StepLabel n={3} title="Photo (optional)" done={photo} />
              <Input type="file" className="h-11 py-2" accept="image/jpeg,image/png,image/webp" onChange={async (e) => { const f = e.target.files?.[0]; if (f) { try { await processPhoto(f); setPhoto(true); toast.success("Photo attached (demo, not stored)."); } catch (er) { toast.error((er as Error).message); e.target.value = ""; } } }} />
            </div>
            <div>
              <StepLabel n={4} title="Submit" done={false} />
              <Button type="submit" className="h-11 w-full">Submit report</Button>
            </div>
          </form>
          )}
    </>
  );
}
