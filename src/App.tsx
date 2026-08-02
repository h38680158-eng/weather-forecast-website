import { Suspense, lazy, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ParticlesProvider } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import type { Engine } from "@tsparticles/engine";

import Header from "./components/Header";
import DynamicBackground from "./components/DynamicBackground";
import CurrentWeather from "./components/CurrentWeather";
import HourlyForecast from "./components/HourlyForecast";
import DailyForecast from "./components/DailyForecast";
import OutfitAdvisor from "./components/OutfitAdvisor";
import SettingsPanel from "./components/SettingsPanel";
import { AirQualityWidget, UvWidget, WindCompass, SunWidget, MoonWidget, PollenWidget } from "./components/Widgets";
import { AlertsWidget, NewsWidget } from "./components/AlertsNews";
import { LoadingSkeleton, ErrorState } from "./components/States";

import { useWeather } from "./hooks/useWeather";
import { useWeatherStore } from "./store/useWeatherStore";
import { useWeatherAlerts } from "./hooks/useWeatherAlerts";
import { usePWA } from "./hooks/usePWA";
import { useT } from "./hooks/useT";

import { paletteFor } from "./lib/theme";
import { applySkin } from "./lib/skins";
import { updateSeo } from "./utils/seo";
import { shareWeather, downloadReport } from "./utils/share";
import type { Place } from "./types/weather";

// Lazy-load heavy, below-the-fold modules.
const MetricsCharts = lazy(() => import("./components/MetricsCharts"));
const WeatherMap = lazy(() => import("./components/WeatherMap"));
const ParticleLayer = lazy(() => import("./components/ParticleLayer"));
const TravelPlanner = lazy(() => import("./components/TravelPlanner"));
const WeatherGlobe = lazy(() => import("./components/WeatherGlobe"));
const HistoryCompare = lazy(() => import("./components/HistoryCompare"));

const DEFAULT: Place = { name: "Reykjavík", country: "Iceland", latitude: 64.1466, longitude: -21.9426 };

const initEngine = async (engine: Engine) => {
  await loadSlim(engine);
};

export default function App() {
  const { bundle, status, error, load, locate } = useWeather(DEFAULT);
  const { unit, theme, skin, highContrast } = useWeatherStore();
  const t = useT();
  const [settingsOpen, setSettingsOpen] = useState(false);

  const { enabled: notifyEnabled, requestPermission, supported: notifySupported } = useWeatherAlerts(bundle);
  const { canInstall, install, offline } = usePWA();

  const palette = useMemo(
    () => paletteFor(bundle?.current.info.condition ?? "clear", bundle?.current.isDay ?? true, theme),
    [bundle, theme],
  );

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    root.classList.toggle("hc", highContrast);
  }, [theme, highContrast]);

  useEffect(() => { applySkin(skin); }, [skin]);

  useEffect(() => { if (bundle) updateSeo(bundle, unit); }, [bundle, unit]);

  return (
    <ParticlesProvider init={initEngine}>
      <div
        className="min-h-screen transition-colors"
        style={{ color: theme === "light" ? "#0f172a" : "#f8fafc" }}
      >
        <DynamicBackground
          condition={bundle?.current.info.condition ?? "clear"}
          isDay={bundle?.current.isDay ?? true}
          palette={palette}
        />
        <Suspense fallback={null}>
          <ParticleLayer condition={bundle?.current.info.condition ?? "clear"} isDay={bundle?.current.isDay ?? true} />
        </Suspense>

        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:text-slate-900">
          Skip to content
        </a>

        <Header
          onSelect={(p) => load(p)}
          onLocate={locate}
          onDownload={() => bundle && downloadReport(bundle, unit)}
          canDownload={!!bundle}
          onOpenSettings={() => setSettingsOpen(true)}
          offline={offline}
        />

        <SettingsPanel
          open={settingsOpen}
          onClose={() => setSettingsOpen(false)}
          onToggleNotify={requestPermission}
          notifyEnabled={notifyEnabled}
          notifySupported={notifySupported}
          canInstall={canInstall}
          onInstall={install}
        />

        <main id="main" className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}
            className="mb-8 text-center"
          >
            <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">{t("tagline")}</h1>
            <p className="mt-2 text-sm opacity-75">{t("subtagline")}</p>
          </motion.div>

          {status === "loading" && !bundle && <LoadingSkeleton />}
          {status === "error" && !bundle && (
            <ErrorState message={error ?? "Unknown error."} onRetry={() => load(DEFAULT)} />
          )}

          {bundle && (
            <div className="grid gap-5 lg:grid-cols-3">
              {/* Main column */}
              <div className="space-y-5 lg:col-span-2">
                <CurrentWeather bundle={bundle} unit={unit} onShare={() => shareWeather(bundle, unit)} />
                <AlertsWidget bundle={bundle} />
                <OutfitAdvisor bundle={bundle} />
                <HourlyForecast hourly={bundle.hourly} unit={unit} />
                <Suspense fallback={<div className="skeleton h-64 rounded-3xl" />}>
                  <MetricsCharts hourly={bundle.hourly} />
                </Suspense>
                <Suspense fallback={<div className="skeleton h-64 rounded-3xl" />}>
                  <HistoryCompare bundle={bundle} place={bundle.place} unit={unit} />
                </Suspense>
                <Suspense fallback={<div className="skeleton h-80 rounded-3xl" />}>
                  <WeatherMap place={bundle.place} />
                </Suspense>
                <Suspense fallback={<div className="skeleton h-72 rounded-3xl" />}>
                  <TravelPlanner unit={unit} seed={bundle} />
                </Suspense>
              </div>

              {/* Side column */}
              <div className="space-y-5">
                <DailyForecast daily={bundle.daily} unit={unit} />
                <div className="grid grid-cols-2 gap-5">
                  <AirQualityWidget bundle={bundle} />
                  <UvWidget bundle={bundle} />
                </div>
                <WindCompass bundle={bundle} />
                <SunWidget bundle={bundle} />
                <div className="grid grid-cols-2 gap-5">
                  <MoonWidget />
                  <PollenWidget bundle={bundle} />
                </div>
                <Suspense fallback={<div className="skeleton h-96 rounded-3xl" />}>
                  <WeatherGlobe unit={unit} onSelect={(p) => load(p)} />
                </Suspense>
                <NewsWidget bundle={bundle} />
              </div>
            </div>
          )}
        </main>

        <footer className="mx-auto max-w-6xl px-4 py-10 text-center text-xs opacity-70">
          <p className="font-display text-base">Skyward</p>
          <p className="mt-1">React · TypeScript · Tailwind · Framer Motion · Recharts · Zustand · tsParticles · PWA</p>
          <p className="mt-1">Live data from Open-Meteo (keyless) · Works offline once installed</p>
        </footer>
      </div>
    </ParticlesProvider>
  );
}
