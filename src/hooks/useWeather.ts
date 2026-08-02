import { useCallback, useEffect, useRef, useState } from "react";
import { fetchWeather, reverseName } from "../services/weatherApi";
import type { Place, WeatherBundle } from "../types/weather";
import { useWeatherStore } from "../store/useWeatherStore";

type Status = "idle" | "loading" | "success" | "error";

export function useWeather(initial: Place) {
  const [bundle, setBundle] = useState<WeatherBundle | null>(null);
  const [status, setStatus] = useState<Status>("loading");
  const [error, setError] = useState<string | null>(null);
  const addRecent = useWeatherStore((s) => s.addRecent);
  const started = useRef(false);

  const load = useCallback(
    async (place: Place, remember = true) => {
      setStatus("loading");
      setError(null);
      try {
        const b = await fetchWeather(place);
        setBundle(b);
        setStatus("success");
        if (remember) addRecent(place);
      } catch (e) {
        setStatus("error");
        setError(navigator.onLine ? "Something went wrong fetching the forecast." : "You appear to be offline.");
      }
    },
    [addRecent],
  );

  const locate = useCallback(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }
    setStatus("loading");
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const place = await reverseName(pos.coords.latitude, pos.coords.longitude);
        load(place);
      },
      () => {
        setStatus("error");
        setError("Location permission denied.");
      },
    );
  }, [load]);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    load(initial, false);
  }, [initial, load]);

  return { bundle, status, error, load, locate };
}
