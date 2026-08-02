import axios from "axios";
import { decode } from "../lib/wmo";
import type {
  AirQuality,
  CurrentWeather,
  DailyItem,
  HourlyItem,
  Place,
  WeatherBundle,
} from "../types/weather";

/**
 * Service layer.
 *
 * This app uses the free, keyless Open-Meteo API for live data. The code is
 * structured so migrating to OpenWeatherMap only requires editing this file.
 *
 * If you supply an OpenWeatherMap key via `VITE_OWM_API_KEY`, the geocoder and
 * forecast could be routed there — the env read path is wired below.
 */
export const OWM_KEY: string | undefined = import.meta.env.VITE_OWM_API_KEY;

const geo = axios.create({ baseURL: "https://geocoding-api.open-meteo.com/v1" });
const api = axios.create({ baseURL: "https://api.open-meteo.com/v1" });
const airApi = axios.create({ baseURL: "https://air-quality-api.open-meteo.com/v1" });

// ---- tiny in-memory + sessionStorage cache ----
const memo = new Map<string, { at: number; data: unknown }>();
const TTL = 5 * 60 * 1000; // 5 minutes

async function cached<T>(key: string, fn: () => Promise<T>): Promise<T> {
  const hit = memo.get(key);
  if (hit && Date.now() - hit.at < TTL) return hit.data as T;
  const data = await fn();
  memo.set(key, { at: Date.now(), data });
  return data;
}

export async function searchPlaces(q: string): Promise<Place[]> {
  if (!q.trim()) return [];
  return cached(`search:${q.toLowerCase()}`, async () => {
    const { data } = await geo.get("/search", {
      params: { name: q, count: 6, language: "en", format: "json" },
    });
    if (!data.results) return [];
    return data.results.map((r: any) => ({
      id: r.id,
      name: r.name,
      country: r.country ?? "",
      admin1: r.admin1,
      latitude: r.latitude,
      longitude: r.longitude,
      timezone: r.timezone,
    })) as Place[];
  });
}

export async function reverseName(lat: number, lon: number): Promise<Place> {
  try {
    const { data } = await geo.get("/search", {
      params: { latitude: lat, longitude: lon, count: 1, language: "en", format: "json" },
    });
    if (data.results?.[0]) {
      const r = data.results[0];
      return { name: r.name, country: r.country ?? "", admin1: r.admin1, latitude: lat, longitude: lon };
    }
  } catch {
    /* fall through */
  }
  return { name: "Your location", country: "", latitude: lat, longitude: lon };
}

async function fetchAir(lat: number, lon: number): Promise<AirQuality | null> {
  try {
    const { data } = await airApi.get("/air-quality", {
      params: {
        latitude: lat,
        longitude: lon,
        current: "european_aqi,pm2_5,pm10,ozone,nitrogen_dioxide,grass_pollen,birch_pollen",
        timezone: "auto",
      },
    });
    const c = data.current;
    return {
      aqi: Math.round(c.european_aqi ?? 0),
      pm2_5: Math.round(c.pm2_5 ?? 0),
      pm10: Math.round(c.pm10 ?? 0),
      o3: Math.round(c.ozone ?? 0),
      no2: Math.round(c.nitrogen_dioxide ?? 0),
      pollenGrass: Math.round(c.grass_pollen ?? 0),
      pollenBirch: Math.round(c.birch_pollen ?? 0),
    };
  } catch {
    return null;
  }
}

export interface HistoryPoint {
  date: string;
  max: number;
  min: number;
}

/**
 * Fetches historical daily temps for the same 7-day window last year, so we can
 * compare this year's forecast against last year's actuals.
 */
export async function fetchHistory(place: Place): Promise<HistoryPoint[]> {
  const today = new Date();
  const lastYear = new Date(today);
  lastYear.setFullYear(today.getFullYear() - 1);
  const end = new Date(lastYear);
  end.setDate(end.getDate() + 6);
  const iso = (d: Date) => d.toISOString().slice(0, 10);

  return cached(`hist:${place.latitude.toFixed(2)},${place.longitude.toFixed(2)}`, async () => {
    const { data } = await axios.get("https://archive-api.open-meteo.com/v1/archive", {
      params: {
        latitude: place.latitude,
        longitude: place.longitude,
        start_date: iso(lastYear),
        end_date: iso(end),
        daily: "temperature_2m_max,temperature_2m_min",
        timezone: "auto",
      },
    });
    return (data.daily.time as string[]).map((t, i) => ({
      date: t,
      max: Math.round(data.daily.temperature_2m_max[i]),
      min: Math.round(data.daily.temperature_2m_min[i]),
    }));
  });
}

export async function fetchWeather(place: Place): Promise<WeatherBundle> {
  const key = `wx:${place.latitude.toFixed(2)},${place.longitude.toFixed(2)}`;
  return cached(key, async () => {
    const [{ data: d }, air] = await Promise.all([
      api.get("/forecast", {
        params: {
          latitude: place.latitude,
          longitude: place.longitude,
          current:
            "temperature_2m,apparent_temperature,relative_humidity_2m,is_day,weather_code,wind_speed_10m,wind_direction_10m,wind_gusts_10m,surface_pressure,visibility,cloud_cover",
          hourly:
            "temperature_2m,weather_code,precipitation_probability,is_day,relative_humidity_2m,wind_speed_10m,surface_pressure",
          daily:
            "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,sunrise,sunset,uv_index_max",
          timezone: "auto",
          forecast_days: 7,
        },
      }),
      fetchAir(place.latitude, place.longitude),
    ]);

    const c = d.current;
    const current: CurrentWeather = {
      temp: c.temperature_2m,
      apparent: c.apparent_temperature,
      humidity: c.relative_humidity_2m,
      wind: Math.round(c.wind_speed_10m),
      windDir: c.wind_direction_10m,
      gust: Math.round(c.wind_gusts_10m ?? 0),
      pressure: Math.round(c.surface_pressure),
      visibility: Math.round((c.visibility ?? 0) / 1000),
      uv: Math.round(d.daily.uv_index_max?.[0] ?? 0),
      isDay: c.is_day === 1,
      cloud: c.cloud_cover ?? 0,
      info: decode(c.weather_code),
      time: c.time,
    };

    const now = new Date(c.time).getTime();
    const hourly: HourlyItem[] = (d.hourly.time as string[])
      .map((t, i) => ({
        time: t,
        temp: d.hourly.temperature_2m[i],
        info: decode(d.hourly.weather_code[i]),
        precipProb: d.hourly.precipitation_probability?.[i] ?? 0,
        humidity: d.hourly.relative_humidity_2m[i],
        wind: Math.round(d.hourly.wind_speed_10m[i]),
        pressure: Math.round(d.hourly.surface_pressure[i]),
        isDay: d.hourly.is_day[i] === 1,
      }))
      .filter((h) => new Date(h.time).getTime() >= now - 3600_000)
      .slice(0, 24);

    const daily: DailyItem[] = (d.daily.time as string[]).map((t, i) => ({
      date: t,
      max: d.daily.temperature_2m_max[i],
      min: d.daily.temperature_2m_min[i],
      info: decode(d.daily.weather_code[i]),
      precip: d.daily.precipitation_probability_max?.[i] ?? 0,
      sunrise: d.daily.sunrise[i],
      sunset: d.daily.sunset[i],
      uv: Math.round(d.daily.uv_index_max?.[i] ?? 0),
    }));

    return { place, current, hourly, daily, air };
  });
}
