import { useMemo } from "react";
import type { Condition, Palette } from "../types/weather";

interface Props {
  condition: Condition;
  isDay: boolean;
  palette: Palette;
}

/** Full-viewport animated background that changes with the weather. */
export default function DynamicBackground({ condition, isDay, palette }: Props) {
  const drops = useMemo(
    () => Array.from({ length: 70 }, () => ({ left: Math.random() * 100, delay: Math.random() * 2, dur: 0.5 + Math.random() * 0.6, h: 12 + Math.random() * 18 })),
    [],
  );
  const flakes = useMemo(
    () => Array.from({ length: 45 }, () => ({ left: Math.random() * 100, delay: Math.random() * 6, dur: 6 + Math.random() * 7, size: 3 + Math.random() * 6 })),
    [],
  );
  const stars = useMemo(
    () => Array.from({ length: 80 }, () => ({ left: Math.random() * 100, top: Math.random() * 78, size: 1 + Math.random() * 2.2, delay: Math.random() * 4, dur: 2 + Math.random() * 3 })),
    [],
  );
  const clouds = useMemo(
    () => Array.from({ length: 6 }, (_, i) => ({ top: 5 + i * 11 + Math.random() * 5, dur: 45 + Math.random() * 60, delay: -Math.random() * 60, scale: 0.6 + Math.random() * 0.9, opacity: 0.4 + Math.random() * 0.4 })),
    [],
  );

  const isRain = condition === "rain" || condition === "drizzle" || condition === "thunder";
  const isSnow = condition === "snow";
  const cloudy = ["cloudy", "overcast", "fog", "rain", "drizzle", "thunder", "snow"].includes(condition);

  return (
    <div
      className="fixed inset-0 -z-10 overflow-hidden transition-[background] duration-1000"
      aria-hidden="true"
      style={{ background: `linear-gradient(165deg, ${palette.from} 0%, ${palette.via} 48%, ${palette.to} 100%)` }}
    >
      {isDay && (condition === "clear" || condition === "cloudy") && (
        <div className="animate-sun absolute rounded-full" style={{ top: "10%", right: "14%", width: 150, height: 150, background: "radial-gradient(circle at 35% 35%, #fff8d6, #ffd166 55%, #ffb020)" }} />
      )}
      {!isDay && (
        <div className="absolute rounded-full" style={{ top: "10%", right: "14%", width: 100, height: 100, background: "radial-gradient(circle at 38% 34%, #f6f7ff, #c9d0f0 60%, #9aa4d8)", boxShadow: "0 0 80px 10px rgba(200,210,255,0.4)" }} />
      )}

      {!isDay &&
        stars.map((s, i) => (
          <span key={i} className="absolute rounded-full bg-white" style={{ left: `${s.left}%`, top: `${s.top}%`, width: s.size, height: s.size, animation: `twinkle ${s.dur}s ease-in-out ${s.delay}s infinite` }} />
        ))}

      {cloudy &&
        clouds.map((c, i) => (
          <div key={i} className="absolute" style={{ top: `${c.top}%`, left: 0, transform: `scale(${c.scale})`, opacity: isDay ? c.opacity : c.opacity * 0.5, animation: `driftSlow ${c.dur}s linear ${c.delay}s infinite` }}>
            <svg width="240" height="96" viewBox="0 0 240 96" fill="none">
              <g fill={isDay ? "#ffffff" : "#c8cee8"}>
                <ellipse cx="64" cy="62" rx="56" ry="30" />
                <ellipse cx="120" cy="48" rx="50" ry="36" />
                <ellipse cx="172" cy="64" rx="50" ry="28" />
                <rect x="44" y="60" width="152" height="28" rx="14" />
              </g>
            </svg>
          </div>
        ))}

      {isRain &&
        drops.map((d, i) => (
          <span key={i} className="absolute top-[-10%] w-[2px] rounded-full" style={{ left: `${d.left}%`, height: d.h, background: "linear-gradient(to bottom, rgba(255,255,255,0), rgba(200,225,255,0.8))", animation: `fall ${d.dur}s linear ${d.delay}s infinite` }} />
        ))}

      {isSnow &&
        flakes.map((f, i) => (
          <span key={i} className="absolute top-[-6%] rounded-full bg-white" style={{ left: `${f.left}%`, width: f.size, height: f.size, opacity: 0.9, animation: `fall ${f.dur}s linear ${f.delay}s infinite` }} />
        ))}

      {condition === "thunder" && (
        <div className="absolute inset-0 bg-white" style={{ animation: "blink 6s steps(1) infinite", opacity: 0 }} />
      )}
      {condition === "fog" && (
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(255,255,255,0.45), rgba(255,255,255,0) 60%)" }} />
      )}

      <div className="absolute inset-0" style={{ background: "radial-gradient(circle at 50% 0%, transparent 55%, rgba(0,0,0,0.28))" }} />
    </div>
  );
}
