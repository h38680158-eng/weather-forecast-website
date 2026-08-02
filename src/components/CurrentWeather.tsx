import { motion } from "framer-motion";
import { FiStar, FiShare2, FiDroplet, FiWind, FiEye, FiSun } from "react-icons/fi";
import { WiBarometer, WiThermometer } from "react-icons/wi";
import WeatherIcon from "./WeatherIcon";
import GlassCard from "./GlassCard";
import type { WeatherBundle, Unit } from "../types/weather";
import { toUnit, windLabel, uvWord } from "../utils/format";
import { useWeatherStore } from "../store/useWeatherStore";
import { useT } from "../hooks/useT";

interface Props {
  bundle: WeatherBundle;
  unit: Unit;
  onShare: () => void;
}

export default function CurrentWeather({ bundle, unit, onShare }: Props) {
  const { place, current } = bundle;
  const t = useT();
  const toggleFav = useWeatherStore((s) => s.toggleFavorite);
  const isFav = useWeatherStore((s) => s.isFavorite(place));

  const stats = [
    { icon: <WiThermometer />, label: t("feelsLike"), value: `${toUnit(current.apparent, unit)}°` },
    { icon: <FiDroplet />, label: t("humidity"), value: `${current.humidity}%` },
    { icon: <FiWind />, label: t("wind"), value: `${current.wind} km/h ${windLabel(current.windDir)}` },
    { icon: <WiBarometer />, label: t("pressure"), value: `${current.pressure} hPa` },
    { icon: <FiEye />, label: t("visibility"), value: `${current.visibility} km` },
    { icon: <FiSun />, label: t("uvIndex"), value: `${current.uv} · ${uvWord(current.uv)}` },
  ];

  return (
    <GlassCard className="overflow-hidden" ariaLabel="Current weather">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-display text-2xl font-semibold">{place.name}</h2>
            <button
              onClick={() => toggleFav(place)}
              aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
              aria-pressed={isFav}
              className="rounded-full p-1.5 transition hover:bg-white/20"
            >
              <FiStar className={isFav ? "fill-amber-300 text-amber-300" : ""} />
            </button>
          </div>
          <p className="text-sm opacity-70">
            {place.admin1 ? `${place.admin1}, ` : ""}{place.country}
          </p>
        </div>
        <button
          onClick={onShare}
          aria-label="Share this weather"
          className="flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3.5 py-1.5 text-sm transition hover:bg-white/20"
        >
          <FiShare2 /> {t("share")}
        </button>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-4">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 120 }}>
          <WeatherIcon condition={current.info.condition} isDay={current.isDay} className="text-8xl drop-shadow-lg" />
        </motion.div>
        <div className="flex items-start">
          <span className="font-display text-7xl font-semibold leading-none sm:text-8xl">{toUnit(current.temp, unit)}</span>
          <span className="mt-3 text-3xl opacity-70">°{unit}</span>
        </div>
        <p className="font-display text-xl">{current.info.label}</p>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {stats.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * i }}
            className="rounded-2xl border border-white/15 bg-white/5 px-3 py-2.5"
          >
            <div className="flex items-center gap-1.5 text-xs opacity-70"><span className="text-base">{s.icon}</span>{s.label}</div>
            <div className="mt-0.5 font-semibold">{s.value}</div>
          </motion.div>
        ))}
      </div>
    </GlassCard>
  );
}
