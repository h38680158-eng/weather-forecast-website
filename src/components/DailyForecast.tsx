import { motion } from "framer-motion";
import GlassCard from "./GlassCard";
import WeatherIcon from "./WeatherIcon";
import type { DailyItem, Unit } from "../types/weather";
import { toUnit, fmtDay } from "../utils/format";

interface Props {
  daily: DailyItem[];
  unit: Unit;
}

export default function DailyForecast({ daily, unit }: Props) {
  const allMin = Math.min(...daily.map((d) => d.min));
  const allMax = Math.max(...daily.map((d) => d.max));
  const span = allMax - allMin || 1;

  return (
    <GlassCard ariaLabel="7 day forecast">
      <h3 className="font-display text-lg font-semibold">7-day forecast</h3>
      <ul className="mt-3 space-y-1.5">
        {daily.map((d, i) => {
          const left = ((d.min - allMin) / span) * 100;
          const width = ((d.max - d.min) / span) * 100;
          return (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
              className="grid grid-cols-[52px_32px_1fr] items-center gap-3 rounded-2xl px-2 py-2 transition hover:bg-white/10 sm:grid-cols-[70px_40px_46px_1fr_44px]"
            >
              <span className="font-medium">{fmtDay(d.date, i)}</span>
              <WeatherIcon condition={d.info.condition} className="text-2xl" />
              <span className="hidden text-xs text-sky-300 sm:block">{d.precip > 5 ? `💧${d.precip}%` : ""}</span>
              <div className="flex items-center gap-2">
                <span className="w-7 text-right text-sm opacity-70">{toUnit(d.min, unit)}°</span>
                <div className="relative h-1.5 flex-1 rounded-full bg-black/20">
                  <div className="absolute h-1.5 rounded-full bg-gradient-to-r from-sky-400 to-amber-300" style={{ left: `${left}%`, width: `${Math.max(width, 8)}%` }} />
                </div>
                <span className="w-7 text-sm font-semibold">{toUnit(d.max, unit)}°</span>
              </div>
            </motion.li>
          );
        })}
      </ul>
    </GlassCard>
  );
}
