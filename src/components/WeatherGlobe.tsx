import { useEffect, useState } from "react";
import GlassCard from "./GlassCard";
import WeatherIcon from "./WeatherIcon";
import { fetchWeather } from "../services/weatherApi";
import { useT } from "../hooks/useT";
import { toUnit } from "../utils/format";
import type { Place, Unit, WeatherBundle } from "../types/weather";

const CITIES: Place[] = [
  { name: "New York", country: "US", latitude: 40.71, longitude: -74.0 },
  { name: "London", country: "UK", latitude: 51.51, longitude: -0.13 },
  { name: "Tokyo", country: "JP", latitude: 35.68, longitude: 139.69 },
  { name: "Sydney", country: "AU", latitude: -33.87, longitude: 151.21 },
  { name: "Dubai", country: "AE", latitude: 25.2, longitude: 55.27 },
  { name: "Cairo", country: "EG", latitude: 30.04, longitude: 31.24 },
  { name: "Rio", country: "BR", latitude: -22.91, longitude: -43.17 },
  { name: "Moscow", country: "RU", latitude: 55.75, longitude: 37.62 },
];

interface Props {
  unit: Unit;
  onSelect: (p: Place) => void;
}

/**
 * Interactive rotating globe. Longitude/latitude are projected onto a spinning
 * sphere; each city pin shows live weather fetched from the API.
 */
export default function WeatherGlobe({ unit, onSelect }: Props) {
  const t = useT();
  const [rot, setRot] = useState(0);
  const [spin, setSpin] = useState(true);
  const [data, setData] = useState<Record<string, WeatherBundle>>({});
  const [hover, setHover] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    Promise.all(CITIES.map((c) => fetchWeather(c).then((b) => [c.name, b] as const).catch(() => null))).then((res) => {
      if (!alive) return;
      const map: Record<string, WeatherBundle> = {};
      res.forEach((r) => r && (map[r[0]] = r[1]));
      setData(map);
    });
    return () => { alive = false; };
  }, []);

  useEffect(() => {
    if (!spin) return;
    const id = setInterval(() => setRot((r) => (r + 0.4) % 360), 40);
    return () => clearInterval(id);
  }, [spin]);

  const R = 120;

  return (
    <GlassCard ariaLabel="Interactive weather globe">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg font-semibold">🌐 {t("globe")}</h3>
        <button
          onClick={() => setSpin((s) => !s)}
          className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs transition hover:bg-white/20"
        >
          {spin ? "⏸ Pause" : "▶ Spin"}
        </button>
      </div>

      <div className="relative mx-auto mt-4 flex h-[280px] w-full items-center justify-center" style={{ perspective: 800 }}>
        {/* sphere */}
        <div
          className="relative rounded-full"
          style={{
            width: R * 2, height: R * 2,
            background: "radial-gradient(circle at 32% 28%, #4aa3ff, #0b3d91 60%, #041f4d)",
            boxShadow: "inset -18px -18px 50px rgba(0,0,0,0.55), 0 0 60px rgba(74,163,255,0.35)",
          }}
        >
          {/* grid meridians */}
          <div className="absolute inset-0 animate-spin-slow rounded-full opacity-30"
            style={{ background: "repeating-conic-gradient(from 0deg, transparent 0 28deg, rgba(255,255,255,0.15) 28deg 29deg)" }} />

          {CITIES.map((c) => {
            // project lon/lat onto rotating sphere
            const lon = (c.longitude + rot) * (Math.PI / 180);
            const lat = c.latitude * (Math.PI / 180);
            const x = R * Math.cos(lat) * Math.sin(lon);
            const z = R * Math.cos(lat) * Math.cos(lon);
            const y = -R * Math.sin(lat);
            const front = z >= 0;
            const scale = 0.6 + ((z + R) / (2 * R)) * 0.6;
            const b = data[c.name];
            return (
              <button
                key={c.name}
                onClick={() => onSelect(c)}
                onMouseEnter={() => setHover(c.name)}
                onMouseLeave={() => setHover(null)}
                aria-label={`${c.name} weather`}
                className="absolute left-1/2 top-1/2 flex flex-col items-center"
                style={{
                  transform: `translate(-50%,-50%) translate(${x}px, ${y}px) scale(${scale})`,
                  opacity: front ? 1 : 0.25,
                  zIndex: front ? 10 : 1,
                  pointerEvents: front ? "auto" : "none",
                  transition: "opacity 0.2s",
                }}
              >
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-amber-300 opacity-70" style={{ animation: "ripple 1.8s ease-out infinite" }} />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-amber-400" />
                </span>
                {(hover === c.name || front) && b && (
                  <span className="mt-0.5 flex items-center gap-0.5 whitespace-nowrap rounded-full bg-slate-900/70 px-1.5 py-0.5 text-[10px] text-white backdrop-blur">
                    <WeatherIcon condition={b.current.info.condition} isDay={b.current.isDay} className="text-sm" />
                    {toUnit(b.current.temp, unit)}°
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <p className="mt-2 text-center text-xs opacity-60">Tap a city to load its full forecast.</p>
    </GlassCard>
  );
}
