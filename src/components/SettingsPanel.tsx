import { AnimatePresence, motion } from "framer-motion";
import { FiX, FiBell, FiDownloadCloud, FiCheck } from "react-icons/fi";
import { useWeatherStore } from "../store/useWeatherStore";
import { SKINS, SKIN_LABELS } from "../lib/skins";
import { LANG_LABELS } from "../lib/i18n";
import { useT } from "../hooks/useT";
import type { Lang, Skin } from "../types/weather";

interface Props {
  open: boolean;
  onClose: () => void;
  onToggleNotify: () => void;
  notifyEnabled: boolean;
  notifySupported: boolean;
  canInstall: boolean;
  onInstall: () => void;
}

export default function SettingsPanel({
  open, onClose, onToggleNotify, notifyEnabled, notifySupported, canInstall, onInstall,
}: Props) {
  const t = useT();
  const { skin, setSkin, lang, setLang } = useWeatherStore();

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          />
          <motion.aside
            role="dialog"
            aria-label="Settings"
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 26, stiffness: 240 }}
            className="fixed right-0 top-0 z-50 h-full w-[88%] max-w-sm overflow-y-auto border-l border-white/15 bg-slate-900/90 p-6 text-white backdrop-blur-2xl"
          >
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-semibold">Customize</h2>
              <button onClick={onClose} aria-label="Close settings" className="rounded-full p-2 hover:bg-white/15"><FiX /></button>
            </div>

            {/* Theme skins */}
            <section className="mt-6">
              <h3 className="text-xs font-semibold uppercase tracking-wider opacity-70">{t("themes")}</h3>
              <div className="mt-3 grid grid-cols-2 gap-3">
                {(Object.keys(SKINS) as Skin[]).map((s) => (
                  <button
                    key={s}
                    onClick={() => setSkin(s)}
                    aria-pressed={skin === s}
                    className="relative flex items-center gap-2 rounded-2xl border p-3 text-left text-sm transition"
                    style={{
                      background: SKINS[s].cardBg,
                      borderColor: skin === s ? "#fff" : SKINS[s].cardBorder,
                      boxShadow: skin === s ? SKINS[s].cardShadow : "none",
                    }}
                  >
                    <span className="text-lg">{SKIN_LABELS[s].icon}</span>
                    <span style={{ color: s === "minimal" ? "#0f172a" : "#fff" }}>{SKIN_LABELS[s].label}</span>
                    {skin === s && <FiCheck className="absolute right-2 top-2" />}
                  </button>
                ))}
              </div>
            </section>

            {/* Language */}
            <section className="mt-6">
              <h3 className="text-xs font-semibold uppercase tracking-wider opacity-70">{t("language")}</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {(Object.keys(LANG_LABELS) as Lang[]).map((l) => (
                  <button
                    key={l}
                    onClick={() => setLang(l)}
                    aria-pressed={lang === l}
                    className={`rounded-full border px-3 py-1.5 text-sm transition ${lang === l ? "border-white bg-white/25" : "border-white/20 bg-white/5 hover:bg-white/15"}`}
                  >
                    {LANG_LABELS[l]}
                  </button>
                ))}
              </div>
            </section>

            {/* Notifications */}
            {notifySupported && (
              <section className="mt-6">
                <h3 className="text-xs font-semibold uppercase tracking-wider opacity-70">Severe Weather Alerts</h3>
                <button
                  onClick={onToggleNotify}
                  className={`mt-3 flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-sm transition ${notifyEnabled ? "border-emerald-300/50 bg-emerald-400/15" : "border-white/20 bg-white/5 hover:bg-white/15"}`}
                >
                  <span className="flex items-center gap-2"><FiBell /> {notifyEnabled ? t("notifyOn") : t("notifyOff")}</span>
                  <span className={`h-5 w-9 rounded-full p-0.5 transition ${notifyEnabled ? "bg-emerald-400" : "bg-white/25"}`}>
                    <span className={`block h-4 w-4 rounded-full bg-white transition ${notifyEnabled ? "translate-x-4" : ""}`} />
                  </span>
                </button>
              </section>
            )}

            {/* Install PWA */}
            {canInstall && (
              <section className="mt-6">
                <h3 className="text-xs font-semibold uppercase tracking-wider opacity-70">App</h3>
                <button onClick={onInstall} className="mt-3 flex w-full items-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-slate-900 transition hover:scale-[1.02]">
                  <FiDownloadCloud /> {t("installApp")}
                </button>
              </section>
            )}

            <p className="mt-8 text-center text-[11px] opacity-50">Skyward · works offline once installed</p>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
