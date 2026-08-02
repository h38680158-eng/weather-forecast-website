import { motion } from "framer-motion";
import { FiCpu } from "react-icons/fi";
import GlassCard from "./GlassCard";
import { recommendOutfit } from "../lib/clothing";
import { useT } from "../hooks/useT";
import type { WeatherBundle } from "../types/weather";

export default function OutfitAdvisor({ bundle }: { bundle: WeatherBundle }) {
  const t = useT();
  const outfit = recommendOutfit(bundle.current, bundle.daily[0].precip);

  return (
    <GlassCard ariaLabel="AI clothing recommendation">
      <h3 className="flex items-center gap-2 font-display text-lg font-semibold">
        <FiCpu style={{ color: "var(--accent)" }} /> {t("whatToWear")}
        <span className="ml-1 rounded-full bg-white/15 px-2 py-0.5 text-[10px] uppercase tracking-wide">AI</span>
      </h3>
      <p className="mt-2 text-sm opacity-90">{outfit.headline}</p>

      <div className="mt-3 flex flex-wrap gap-2">
        {outfit.items.map((it, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className="flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-sm"
          >
            <span className="text-base">{it.icon}</span>
            {it.label}
          </motion.span>
        ))}
      </div>

      {outfit.tips.length > 0 && (
        <ul className="mt-3 space-y-1 text-xs opacity-80">
          {outfit.tips.map((tip, i) => (
            <li key={i}>💡 {tip}</li>
          ))}
        </ul>
      )}
    </GlassCard>
  );
}
