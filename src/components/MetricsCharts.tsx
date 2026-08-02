import { useState } from "react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import GlassCard from "./GlassCard";
import type { HourlyItem } from "../types/weather";
import { fmtHour } from "../utils/format";

type Metric = "humidity" | "wind" | "pressure";

const META: Record<Metric, { label: string; color: string; suffix: string; kind: "line" | "bar" }> = {
  humidity: { label: "Humidity", color: "#38bdf8", suffix: "%", kind: "bar" },
  wind: { label: "Wind speed", color: "#34d399", suffix: " km/h", kind: "line" },
  pressure: { label: "Pressure", color: "#f472b6", suffix: " hPa", kind: "line" },
};

export default function MetricsCharts({ hourly }: { hourly: HourlyItem[] }) {
  const [metric, setMetric] = useState<Metric>("humidity");
  const m = META[metric];
  const data = hourly.map((h, i) => ({
    time: i === 0 ? "Now" : fmtHour(h.time),
    value: metric === "humidity" ? h.humidity : metric === "wind" ? h.wind : h.pressure,
  }));

  return (
    <GlassCard ariaLabel="Detailed weather charts">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="font-display text-lg font-semibold">Trends</h3>
        <div className="flex gap-1 rounded-full border border-white/15 bg-white/5 p-1" role="tablist">
          {(Object.keys(META) as Metric[]).map((k) => (
            <button
              key={k}
              role="tab"
              aria-selected={metric === k}
              onClick={() => setMetric(k)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition ${metric === k ? "bg-white/25" : "hover:bg-white/10"}`}
            >
              {META[k].label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 h-52 w-full">
        <ResponsiveContainer width="100%" height="100%">
          {m.kind === "bar" ? (
            <BarChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" vertical={false} />
              <XAxis dataKey="time" tick={{ fill: "currentColor", fontSize: 11, opacity: 0.6 }} interval={3} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "currentColor", fontSize: 11, opacity: 0.6 }} axisLine={false} tickLine={false} width={36} />
              <Tooltip contentStyle={{ background: "rgba(15,20,40,0.9)", border: "none", borderRadius: 12, color: "#fff" }} formatter={(v) => [`${v}${m.suffix}`, m.label]} />
              <Bar dataKey="value" fill={m.color} radius={[4, 4, 0, 0]} />
            </BarChart>
          ) : (
            <LineChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" vertical={false} />
              <XAxis dataKey="time" tick={{ fill: "currentColor", fontSize: 11, opacity: 0.6 }} interval={3} axisLine={false} tickLine={false} />
              <YAxis domain={["dataMin - 2", "dataMax + 2"]} tick={{ fill: "currentColor", fontSize: 11, opacity: 0.6 }} axisLine={false} tickLine={false} width={36} />
              <Tooltip contentStyle={{ background: "rgba(15,20,40,0.9)", border: "none", borderRadius: 12, color: "#fff" }} formatter={(v) => [`${v}${m.suffix}`, m.label]} />
              <Line type="monotone" dataKey="value" stroke={m.color} strokeWidth={2.5} dot={false} />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    </GlassCard>
  );
}
