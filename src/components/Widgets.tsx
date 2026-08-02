import { motion } from "framer-motion";
import GlassCard from "./GlassCard";
import type { WeatherBundle } from "../types/weather";
import { aqiBand, uvWord, windLabel, pollenWord, moonPhase, fmtTime } from "../utils/format";

export function AirQualityWidget({ bundle }: { bundle: WeatherBundle }) {
  const air = bundle.air;
  if (!air) return null;
  const band = aqiBand(air.aqi);
  const pct = Math.min((air.aqi / 120) * 100, 100);
  return (
    <GlassCard ariaLabel="Air quality index">
      <h3 className="font-display text-lg font-semibold">Air Quality</h3>
      <div className="mt-3 flex items-end gap-2">
        <span className="text-4xl font-bold" style={{ color: band.color }}>{air.aqi}</span>
        <span className="mb-1 text-sm opacity-80">{band.label}</span>
      </div>
      <div className="mt-2 h-2 w-full rounded-full bg-black/20">
        <div className="h-2 rounded-full" style={{ width: `${pct}%`, background: band.color }} />
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2 text-xs opacity-80">
        <span>PM2.5: {air.pm2_5}</span>
        <span>PM10: {air.pm10}</span>
        <span>O₃: {air.o3}</span>
        <span>NO₂: {air.no2}</span>
      </div>
    </GlassCard>
  );
}

export function UvWidget({ bundle }: { bundle: WeatherBundle }) {
  const uv = bundle.current.uv;
  const pct = Math.min((uv / 11) * 100, 100);
  return (
    <GlassCard ariaLabel="UV index">
      <h3 className="font-display text-lg font-semibold">UV Index</h3>
      <div className="mt-3 text-4xl font-bold">{uv}</div>
      <p className="text-sm opacity-80">{uvWord(uv)}</p>
      <div className="mt-3 h-2 w-full rounded-full bg-gradient-to-r from-green-400 via-yellow-400 to-red-500">
        <div className="relative h-2">
          <div className="absolute -top-1 h-4 w-1 rounded-full bg-white shadow" style={{ left: `calc(${pct}% - 2px)` }} />
        </div>
      </div>
    </GlassCard>
  );
}

export function WindCompass({ bundle }: { bundle: WeatherBundle }) {
  const { windDir, wind, gust } = bundle.current;
  return (
    <GlassCard ariaLabel="Wind direction compass">
      <h3 className="font-display text-lg font-semibold">Wind</h3>
      <div className="mt-3 flex items-center gap-4">
        <div className="relative h-24 w-24 rounded-full border border-white/25">
          {["N", "E", "S", "W"].map((d, i) => (
            <span key={d} className="absolute text-[10px] opacity-70" style={{
              top: i === 0 ? 2 : i === 2 ? "auto" : "50%", bottom: i === 2 ? 2 : "auto",
              left: i === 3 ? 4 : i === 1 ? "auto" : "50%", right: i === 1 ? 4 : "auto",
              transform: "translate(-50%,-50%)",
            }}>{d}</span>
          ))}
          <motion.div
            initial={{ rotate: 0 }} animate={{ rotate: windDir }} transition={{ type: "spring", stiffness: 60 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="h-16 w-0.5 bg-gradient-to-t from-transparent via-white to-rose-400" />
          </motion.div>
          <div className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white" />
        </div>
        <div>
          <div className="text-2xl font-bold">{wind} <span className="text-sm font-normal opacity-70">km/h</span></div>
          <p className="text-sm opacity-80">From {windLabel(windDir)} ({windDir}°)</p>
          <p className="text-xs opacity-60">Gusts {gust} km/h</p>
        </div>
      </div>
    </GlassCard>
  );
}

export function SunWidget({ bundle }: { bundle: WeatherBundle }) {
  const day = bundle.daily[0];
  const now = Date.now();
  const rise = new Date(day.sunrise).getTime();
  const set = new Date(day.sunset).getTime();
  const progress = Math.max(0, Math.min(1, (now - rise) / (set - rise)));
  const x = progress * 100;
  const y = Math.sin(progress * Math.PI) * 100;
  return (
    <GlassCard ariaLabel="Sunrise and sunset">
      <h3 className="font-display text-lg font-semibold">Sun</h3>
      <div className="relative mt-3 h-20">
        <svg viewBox="0 0 100 40" className="h-full w-full overflow-visible">
          <path d="M0,40 Q50,-25 100,40" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1" strokeDasharray="3 3" />
          <circle cx={x} cy={40 - y * 0.55} r="3.5" fill="#fbbf24" />
        </svg>
      </div>
      <div className="flex justify-between text-sm">
        <div><div className="opacity-60 text-xs">Sunrise</div><div className="font-semibold">🌅 {fmtTime(day.sunrise)}</div></div>
        <div className="text-right"><div className="opacity-60 text-xs">Sunset</div><div className="font-semibold">🌇 {fmtTime(day.sunset)}</div></div>
      </div>
    </GlassCard>
  );
}

export function MoonWidget() {
  const m = moonPhase(new Date());
  return (
    <GlassCard ariaLabel="Moon phase">
      <h3 className="font-display text-lg font-semibold">Moon Phase</h3>
      <div className="mt-3 flex items-center gap-4">
        <span className="text-5xl">{m.icon}</span>
        <div>
          <div className="font-semibold">{m.name}</div>
          <p className="text-xs opacity-70">{Math.round(m.phase * 100)}% of cycle</p>
        </div>
      </div>
    </GlassCard>
  );
}

export function PollenWidget({ bundle }: { bundle: WeatherBundle }) {
  const air = bundle.air;
  const grass = air?.pollenGrass ?? 0;
  const birch = air?.pollenBirch ?? 0;
  return (
    <GlassCard ariaLabel="Pollen index">
      <h3 className="font-display text-lg font-semibold">Pollen</h3>
      <div className="mt-3 space-y-2 text-sm">
        <Row label="🌾 Grass" v={grass} />
        <Row label="🌳 Birch" v={birch} />
      </div>
    </GlassCard>
  );
}

function Row({ label, v }: { label: string; v: number }) {
  return (
    <div className="flex items-center justify-between">
      <span className="opacity-80">{label}</span>
      <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs">{pollenWord(v)}</span>
    </div>
  );
}
