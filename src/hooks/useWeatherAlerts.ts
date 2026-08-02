import { useEffect, useRef } from "react";
import type { WeatherBundle } from "../types/weather";
import { useWeatherStore } from "../store/useWeatherStore";

// Reuse the same derivation logic as the on-screen alerts.
function deriveSevere(b: WeatherBundle): string[] {
  const out: string[] = [];
  const c = b.current;
  if (c.info.condition === "thunder") out.push("⛈️ Thunderstorm warning — seek shelter.");
  if (c.uv >= 9) out.push(`☀️ Extreme UV (${c.uv}) — protect your skin.`);
  if (c.wind >= 50 || c.gust >= 70) out.push(`🌬️ High wind alert — gusts to ${c.gust} km/h.`);
  if (c.info.condition === "snow") out.push("❄️ Snowfall expected — travel with care.");
  if (b.air && b.air.aqi > 90) out.push(`😷 Poor air quality (AQI ${b.air.aqi}).`);
  return out;
}

/** Requests permission and pushes browser notifications for severe conditions. */
export function useWeatherAlerts(bundle: WeatherBundle | null) {
  const enabled = useWeatherStore((s) => s.notifications);
  const setEnabled = useWeatherStore((s) => s.setNotifications);
  const lastKey = useRef<string>("");

  // Sync store with actual permission on mount.
  useEffect(() => {
    if (typeof Notification !== "undefined" && Notification.permission === "granted" && enabled) return;
  }, [enabled]);

  useEffect(() => {
    if (!enabled || !bundle) return;
    if (typeof Notification === "undefined" || Notification.permission !== "granted") return;
    const alerts = deriveSevere(bundle);
    const key = `${bundle.place.name}:${alerts.join("|")}`;
    if (alerts.length === 0 || key === lastKey.current) return;
    lastKey.current = key;
    alerts.forEach((body) => {
      try {
        new Notification(`Skyward · ${bundle.place.name}`, { body, icon: "/icon-192.png" });
      } catch {
        /* ignore */
      }
    });
  }, [enabled, bundle]);

  const requestPermission = async () => {
    if (typeof Notification === "undefined") return;
    if (Notification.permission === "granted") {
      setEnabled(!enabled);
      return;
    }
    const res = await Notification.requestPermission();
    setEnabled(res === "granted");
    if (res === "granted" && bundle) {
      new Notification("Skyward alerts enabled", { body: `You'll be notified of severe weather in ${bundle.place.name}.` });
    }
  };

  return { enabled, requestPermission, supported: typeof Notification !== "undefined" };
}
