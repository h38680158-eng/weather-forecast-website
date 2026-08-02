import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import GlassCard from "./GlassCard";
import WeatherIcon from "./WeatherIcon";
import type { HourlyItem, Unit } from "../types/weather";
import { toUnit, fmtHour } from "../utils/format";

interface Props {
  hourly: HourlyItem[];
  unit: Unit;
}

export default function HourlyForecast({ hourly, unit }: Props) {
  const data = hourly.map((h, i) => ({
    time: i === 0 ? "Now" : fmtHour(h.time),
    temp: toUnit(h.temp, unit),
    precip: h.precipProb,
  }));

  return (
    <GlassCard ariaLabel="24 hour forecast">
      <h3 className="font-display text-lg font-semibold">Next 24 hours</h3>

      <div className="mt-3 h-40 w-full" aria-hidden="true">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="tempFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#fbbf24" stopOpacity={0.6} />
                <stop offset="100%" stopColor="#fbbf24" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="time" tick={{ fill: "currentColor", fontSize: 11, opacity: 0.7 }} interval={2} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "currentColor", fontSize: 11, opacity: 0.6 }} axisLine={false} tickLine={false} width={34} />
            <Tooltip contentStyle={{ background: "rgba(15,20,40,0.9)", border: "none", borderRadius: 12, color: "#fff" }} formatter={(v) => [`${v}°`, "Temp"]} />
            <Area type="monotone" dataKey="temp" stroke="#fbbf24" strokeWidth={2.5} fill="url(#tempFill)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="hide-scroll mt-3 flex gap-3 overflow-x-auto pb-1" tabIndex={0} aria-label="Hourly cards, scrollable">
        {hourly.map((h, i) => (
          <div key={i} className="flex min-w-[72px] flex-col items-center gap-1 rounded-2xl border border-white/15 bg-white/5 px-3 py-3 transition hover:-translate-y-1">
            <span className="text-xs opacity-70">{i === 0 ? "Now" : fmtHour(h.time)}</span>
            <WeatherIcon condition={h.info.condition} isDay={h.isDay} className="text-2xl" />
            <span className="font-semibold">{toUnit(h.temp, unit)}°</span>
            {h.precipProb > 5 && <span className="text-[10px] text-sky-300">💧{h.precipProb}%</span>}
          </div>
        ))}
      </div>
    </GlassCard>
  );
}
