import type { Condition, WeatherInfo } from "../types/weather";

// WMO weather interpretation codes → human labels + our condition buckets.
const CODE_MAP: Record<number, { label: string; condition: Condition }> = {
  0: { label: "Clear sky", condition: "clear" },
  1: { label: "Mainly clear", condition: "clear" },
  2: { label: "Partly cloudy", condition: "cloudy" },
  3: { label: "Overcast", condition: "overcast" },
  45: { label: "Fog", condition: "fog" },
  48: { label: "Rime fog", condition: "fog" },
  51: { label: "Light drizzle", condition: "drizzle" },
  53: { label: "Drizzle", condition: "drizzle" },
  55: { label: "Dense drizzle", condition: "drizzle" },
  56: { label: "Freezing drizzle", condition: "drizzle" },
  57: { label: "Freezing drizzle", condition: "drizzle" },
  61: { label: "Light rain", condition: "rain" },
  63: { label: "Rain", condition: "rain" },
  65: { label: "Heavy rain", condition: "rain" },
  66: { label: "Freezing rain", condition: "rain" },
  67: { label: "Freezing rain", condition: "rain" },
  71: { label: "Light snow", condition: "snow" },
  73: { label: "Snow", condition: "snow" },
  75: { label: "Heavy snow", condition: "snow" },
  77: { label: "Snow grains", condition: "snow" },
  80: { label: "Rain showers", condition: "rain" },
  81: { label: "Rain showers", condition: "rain" },
  82: { label: "Violent showers", condition: "rain" },
  85: { label: "Snow showers", condition: "snow" },
  86: { label: "Snow showers", condition: "snow" },
  95: { label: "Thunderstorm", condition: "thunder" },
  96: { label: "Thunderstorm + hail", condition: "thunder" },
  99: { label: "Thunderstorm + hail", condition: "thunder" },
};

export function decode(code: number): WeatherInfo {
  const m = CODE_MAP[code] ?? { label: "Unknown", condition: "cloudy" as Condition };
  return { code, label: m.label, condition: m.condition, icon: m.condition };
}
