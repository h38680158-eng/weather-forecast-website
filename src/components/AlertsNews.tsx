import GlassCard from "./GlassCard";
import { FiAlertTriangle } from "react-icons/fi";
import type { WeatherBundle } from "../types/weather";

// Derive sensible advisories from live conditions (no keyed alerts API needed).
function deriveAlerts(b: WeatherBundle): { level: string; text: string }[] {
  const out: { level: string; text: string }[] = [];
  const c = b.current;
  if (c.info.condition === "thunder") out.push({ level: "Severe", text: "Thunderstorms in your area — seek shelter and avoid open ground." });
  if (c.uv >= 8) out.push({ level: "High UV", text: `UV index ${c.uv}. Wear sunscreen and limit midday sun exposure.` });
  if (c.wind >= 40 || c.gust >= 60) out.push({ level: "Wind", text: `Strong winds up to ${c.gust} km/h expected. Secure loose objects.` });
  if (c.info.condition === "snow") out.push({ level: "Snow", text: "Snowfall likely — allow extra travel time and drive carefully." });
  if (b.air && b.air.aqi > 80) out.push({ level: "Air quality", text: "Poor air quality — sensitive groups should limit outdoor activity." });
  if (c.visibility > 0 && c.visibility < 2) out.push({ level: "Visibility", text: "Low visibility conditions. Use caution on the roads." });
  return out;
}

export function AlertsWidget({ bundle }: { bundle: WeatherBundle }) {
  const alerts = deriveAlerts(bundle);
  if (alerts.length === 0) return null;
  return (
    <GlassCard ariaLabel="Weather alerts" className="border-amber-300/40 bg-amber-400/10">
      <h3 className="flex items-center gap-2 font-display text-lg font-semibold"><FiAlertTriangle className="text-amber-300" /> Weather Alerts</h3>
      <ul className="mt-3 space-y-2">
        {alerts.map((a, i) => (
          <li key={i} className="rounded-2xl border border-amber-300/30 bg-amber-400/10 px-3 py-2 text-sm">
            <span className="mr-2 rounded-full bg-amber-300/25 px-2 py-0.5 text-xs font-semibold">{a.level}</span>
            {a.text}
          </li>
        ))}
      </ul>
    </GlassCard>
  );
}

export function NewsWidget({ bundle }: { bundle: WeatherBundle }) {
  const c = bundle.current;
  const items = [
    { tag: "Today", text: `${bundle.place.name}: ${c.info.label.toLowerCase()} with a high near ${Math.round(bundle.daily[0].max)}°.` },
    { tag: "Outlook", text: `Rain chance peaks at ${Math.max(...bundle.daily.map((d) => d.precip))}% this week.` },
    { tag: "Air", text: bundle.air ? `Air quality index currently ${bundle.air.aqi}.` : "Air quality data unavailable." },
  ];
  return (
    <GlassCard ariaLabel="Weather news">
      <h3 className="font-display text-lg font-semibold">Weather Briefing</h3>
      <ul className="mt-3 space-y-2 text-sm">
        {items.map((n, i) => (
          <li key={i} className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2">
            <span className="mr-2 rounded-full bg-white/15 px-2 py-0.5 text-[10px] uppercase tracking-wide">{n.tag}</span>
            {n.text}
          </li>
        ))}
      </ul>
    </GlassCard>
  );
}
