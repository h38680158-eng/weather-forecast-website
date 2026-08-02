import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiPlus, FiX, FiSearch } from "react-icons/fi";
import GlassCard from "./GlassCard";
import WeatherIcon from "./WeatherIcon";
import { searchPlaces, fetchWeather } from "../services/weatherApi";
import { useT } from "../hooks/useT";
import { toUnit, fmtDay } from "../utils/format";
import type { Place, Unit, WeatherBundle } from "../types/weather";

interface Props {
  unit: Unit;
  seed: WeatherBundle;
}

interface Trip {
  place: Place;
  bundle: WeatherBundle;
}

/** Plan a trip by adding destinations and comparing their week-ahead weather. */
export default function TravelPlanner({ unit, seed }: Props) {
  const t = useT();
  const [trips, setTrips] = useState<Trip[]>([{ place: seed.place, bundle: seed }]);
  const [q, setQ] = useState("");
  const [results, setResults] = useState<Place[]>([]);
  const [busy, setBusy] = useState(false);

  const onSearch = async (val: string) => {
    setQ(val);
    if (val.trim()) setResults(await searchPlaces(val));
    else setResults([]);
  };

  const add = async (p: Place) => {
    if (trips.some((tr) => tr.place.name === p.name)) return;
    setBusy(true);
    try {
      const bundle = await fetchWeather(p);
      setTrips((prev) => [...prev, { place: p, bundle }]);
    } finally {
      setBusy(false);
      setQ("");
      setResults([]);
    }
  };

  const remove = (name: string) => setTrips((prev) => prev.filter((tr) => tr.place.name !== name));

  // "Best day to travel" = highest score (warm-ish, low rain).
  const bestDayIndex = (b: WeatherBundle) => {
    let best = 0;
    let bestScore = -Infinity;
    b.daily.forEach((d, i) => {
      const score = 100 - d.precip - Math.abs(22 - (d.max + d.min) / 2) * 2;
      if (score > bestScore) { bestScore = score; best = i; }
    });
    return best;
  };

  return (
    <GlassCard ariaLabel="Travel weather planner">
      <h3 className="font-display text-lg font-semibold">✈️ {t("travelPlanner")}</h3>
      <p className="mt-1 text-xs opacity-70">Add destinations to compare the week ahead and find the best day to go.</p>

      <div className="relative mt-3">
        <div className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-2">
          <FiSearch className="opacity-70" />
          <input
            value={q}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Add a destination…"
            aria-label="Add a travel destination"
            className="w-full bg-transparent text-sm outline-none placeholder:opacity-60"
          />
          {busy && <span className="text-xs opacity-70">…</span>}
        </div>
        <AnimatePresence>
          {results.length > 0 && (
            <motion.ul
              initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="absolute z-30 mt-2 w-full overflow-hidden rounded-2xl border border-white/15 bg-slate-900/90 text-white backdrop-blur-xl"
            >
              {results.map((p, i) => (
                <li key={i}>
                  <button onClick={() => add(p)} className="flex w-full items-center justify-between px-4 py-2 text-left text-sm hover:bg-white/10">
                    <span>{p.name}{p.admin1 ? `, ${p.admin1}` : ""}</span>
                    <span className="flex items-center gap-1 text-xs opacity-60"><FiPlus /> {p.country}</span>
                  </button>
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-4 space-y-3">
        {trips.map((tr) => {
          const best = bestDayIndex(tr.bundle);
          return (
            <div key={tr.place.name} className="rounded-2xl border border-white/15 bg-white/5 p-3">
              <div className="flex items-center justify-between">
                <span className="font-semibold">{tr.place.name} <span className="text-xs font-normal opacity-60">{tr.place.country}</span></span>
                {trips.length > 1 && (
                  <button onClick={() => remove(tr.place.name)} aria-label={`Remove ${tr.place.name}`} className="rounded-full p-1 hover:bg-white/15">
                    <FiX />
                  </button>
                )}
              </div>
              <div className="mt-2 flex gap-1.5 overflow-x-auto hide-scroll">
                {tr.bundle.daily.map((d, i) => (
                  <div
                    key={i}
                    className={`flex min-w-[52px] flex-col items-center rounded-xl px-2 py-2 text-center ${i === best ? "ring-2 ring-emerald-300" : ""}`}
                    style={{ background: i === best ? "rgba(52,211,153,0.15)" : "rgba(255,255,255,0.04)" }}
                    title={i === best ? "Best day to travel" : undefined}
                  >
                    <span className="text-[10px] opacity-70">{fmtDay(d.date, i)}</span>
                    <WeatherIcon condition={d.info.condition} className="text-lg" />
                    <span className="text-xs font-semibold">{toUnit(d.max, unit)}°</span>
                    <span className="text-[9px] text-sky-300">💧{d.precip}%</span>
                  </div>
                ))}
              </div>
              <p className="mt-1.5 text-[11px] text-emerald-300">
                ⭐ Best day: {fmtDay(tr.bundle.daily[best].date, best)} ({toUnit(tr.bundle.daily[best].max, unit)}°, {tr.bundle.daily[best].precip}% rain)
              </p>
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
}
