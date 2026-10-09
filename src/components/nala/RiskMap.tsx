import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Drain } from "@/lib/nalasetu/types";

/** Configurable tile provider (HTTPS OSM by default — do not bulk-prefetch). */
const TILE_URL =
  (import.meta.env["VITE_TILE_URL"] as string | undefined) ??
  "https://tile.openstreetmap.org/{z}/{x}/{y}.png";

function cssVar(n: string) {
  return getComputedStyle(document.documentElement).getPropertyValue(n).trim();
}

export default function RiskMap({
  drains,
  selected,
  onSelect,
  routes,
}: {
  drains: Drain[];
  selected?: string | undefined;
  onSelect: (id: string) => void;
  routes?: { latlngs: [number, number][] }[];
}) {
  const el = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const layer = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!el.current || map.current) return;
    map.current = L.map(el.current, { center: [28.63, 77.225], zoom: 14, zoomControl: false });
    L.control.zoom({ position: "bottomright" }).addTo(map.current);
    L.tileLayer(TILE_URL, { maxZoom: 19, attribution: "© OpenStreetMap contributors" }).addTo(
      map.current,
    );
    layer.current = L.layerGroup().addTo(map.current);
    const ro = new ResizeObserver(() => map.current?.invalidateSize());
    ro.observe(el.current);
    return () => {
      ro.disconnect();
      map.current?.remove();
      map.current = null;
    };
  }, []);

  useEffect(() => {
    const g = layer.current;
    if (!g) return;
    g.clearLayers();
    const col = {
      HIGH: cssVar("--risk-high"),
      MEDIUM: cssVar("--risk-medium"),
      LOW: cssVar("--risk-low"),
    };
    routes?.forEach((r) =>
      L.polyline(r.latlngs, { color: cssVar("--primary"), weight: 2, dashArray: "4 4" }).addTo(g),
    );
    drains.forEach((d) => {
      const m = L.circleMarker([d.lat, d.lng], {
        radius: d.id === selected ? 12 : 8,
        color: d.id === selected ? cssVar("--foreground") : "white",
        weight: 2,
        fillColor: col[d.riskBand],
        fillOpacity: 0.95,
        className: "risk-marker",
      });
      m.bindTooltip(`${d.id} · ${d.name} — ${d.riskScore} ${d.riskBand}`);
      m.on("click", () => onSelect(d.id));
      m.addTo(g);
    });
  }, [drains, selected, onSelect, routes]);

  useEffect(() => {
    const d = drains.find((x) => x.id === selected);
    if (d && map.current) map.current.panTo([d.lat, d.lng]);
  }, [selected]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      ref={el}
      className="h-full min-h-[360px] w-full rounded-md border"
      role="region"
      aria-label="Drain risk map"
    />
  );
}
