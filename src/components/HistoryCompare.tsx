import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from "recharts";
import GlassCard from "./GlassCard";
import { fetchHistory } from "../services/weatherApi";
import { useT } from "../hooks/useT";
import { toUnit, fmtDay } from "../utils/format";
import type { Place, Unit, WeatherBundle } from "../types/weather";

interface Props {
  bundle: WeatherBundle;
  place: Place;
  unit: Unit;
}

/** Compares this year's 7-day forecast highs vs last year's actual highs. */
export default function HistoryCompare({ bundle, place, unit }: Props) {
  const t = useT();
  const [history, setHistory] = useState<{ date: string; max: number; min: number }[] | null>(null);
  const [err, setErr] = useState(false);

  useEffect(() => {
    let alive = true;
    setHistory(null);
    setErr(false);
    fetchHistory(place)
      .then((h) => alive && setHistory(h))
      .catch(() => alive && setErr(true));
    return () => { alive = false; };
  }, [place]);

  const data = bundle.daily.map((d, i) => ({
    day: fmtDay(d.date, i),
    forecast: toUnit(d.max, unit),
    lastYear: history?.[i] ? toUnit(history[i].max, unit) : null,
  }));

  return (
    <GlassCard ariaLabel="Weather history comparison">
      <h3 className="font-display text-lg font-semibold">📈 {t("history")}</h3>
      <p className="mt-1 text-xs opacity-70">This year's forecast highs vs the same week last year.</p>

      {err ? (
        <p className="mt-6 text-center text-sm opacity-70">Historical data unavailable for this location.</p>
      ) : !history ? (
        <div className="skeleton mt-4 h-52 rounded-2xl" />
      ) : (
        <div className="mt-4 h-52 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" vertical={false} />
              <XAxis dataKey="day" tick={{ fill: "currentColor", fontSize: 11, opacity: 0.6 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "currentColor", fontSize: 11, opacity: 0.6 }} axisLine={false} tickLine={false} width={34} />
              <Tooltip contentStyle={{ background: "rgba(15,20,40,0.9)", border: "none", borderRadius: 12, color: "#fff" }} formatter={(v) => [`${v}°`, ""]} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Line type="monotone" name="This year" dataKey="forecast" stroke="#fbbf24" strokeWidth={2.5} dot={{ r: 3 }} />
              <Line type="monotone" name="Last year" dataKey="lastYear" stroke="#38bdf8" strokeWidth={2.5} strokeDasharray="5 4" dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </GlassCard>
  );
}
