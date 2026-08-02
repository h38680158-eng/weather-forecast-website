import { useState } from "react";
import GlassCard from "./GlassCard";
import type { Place } from "../types/weather";

type Layer = "rain" | "temp" | "wind";

const LAYERS: Record<Layer, { label: string; icon: string; overlay: string }> = {
  rain: { label: "Rain radar", icon: "🌧️", overlay: "rain" },
  temp: { label: "Temperature", icon: "🌡️", overlay: "temp" },
  wind: { label: "Wind", icon: "🌬️", overlay: "wind" },
};

/**
 * Interactive weather map. Uses the free, keyless Windy embed which supports
 * rain radar, temperature and wind overlays out of the box.
 */
export default function WeatherMap({ place }: { place: Place }) {
  const [layer, setLayer] = useState<Layer>("rain");
  const src = `https://embed.windy.com/embed2.html?lat=${place.latitude}&lon=${place.longitude}&zoom=6&level=surface&overlay=${LAYERS[layer].overlay}&menu=&message=&marker=true&calendar=&pressure=&type=map&location=coordinates&detail=&detailLat=${place.latitude}&detailLon=${place.longitude}&metricWind=default&metricTemp=default&radarRange=-1`;

  return (
    <GlassCard ariaLabel="Interactive weather map" className="overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="font-display text-lg font-semibold">Interactive Map</h3>
        <div className="flex gap-1 rounded-full border border-white/15 bg-white/5 p-1" role="tablist">
          {(Object.keys(LAYERS) as Layer[]).map((k) => (
            <button
              key={k}
              role="tab"
              aria-selected={layer === k}
              onClick={() => setLayer(k)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition ${layer === k ? "bg-white/25" : "hover:bg-white/10"}`}
            >
              {LAYERS[k].icon} {LAYERS[k].label}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-3 overflow-hidden rounded-2xl border border-white/15">
        <iframe
          key={`${layer}-${place.latitude}`}
          title={`Weather map — ${LAYERS[layer].label}`}
          src={src}
          className="h-72 w-full"
          loading="lazy"
        />
      </div>
    </GlassCard>
  );
}
