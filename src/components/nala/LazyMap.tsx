import { lazy, Suspense, type ComponentProps } from "react";
import { ClientOnly } from "@tanstack/react-router";
import { Skeleton } from "@/components/ui/skeleton";

const RiskMap = lazy(() => import("./RiskMap"));

export function LazyMap(props: ComponentProps<typeof RiskMap>) {
  const fb = <Skeleton className="h-full min-h-[360px] w-full" />;
  return <ClientOnly fallback={fb}><Suspense fallback={fb}><RiskMap {...props} /></Suspense></ClientOnly>;
}
