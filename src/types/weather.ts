// ============================================================
// Domain types for the entire weather application.
// ============================================================

export type Condition =
  | "clear"
  | "cloudy"
  | "overcast"
  | "fog"
  | "drizzle"
  | "rain"
  | "snow"
  | "thunder";

export type Unit = "C" | "F";
export type Theme = "light" | "dark";
export type Skin = "glass" | "minimal" | "neon" | "cyberpunk";
export type Lang = "en" | "es" | "fr" | "de" | "hi";

export interface WeatherInfo {
  code: number;
  label: string;
  condition: Condition;
  icon: string; // react-icons key resolved in a component
}

export interface Place {
  id?: number;
  name: string;
  country: string;
  admin1?: string;
  latitude: number;
  longitude: number;
  timezone?: string;
}

export interface CurrentWeather {
  temp: number;
  apparent: number;
  humidity: number;
  wind: number;
  windDir: number;
  gust: number;
  pressure: number;
  visibility: number; // km
  uv: number;
  isDay: boolean;
  cloud: number;
  info: WeatherInfo;
  time: string;
}

export interface HourlyItem {
  time: string;
  temp: number;
  info: WeatherInfo;
  precipProb: number;
  humidity: number;
  wind: number;
  pressure: number;
  isDay: boolean;
}

export interface DailyItem {
  date: string;
  max: number;
  min: number;
  info: WeatherInfo;
  precip: number;
  sunrise: string;
  sunset: string;
  uv: number;
}

export interface AirQuality {
  aqi: number; // European AQI
  pm2_5: number;
  pm10: number;
  o3: number;
  no2: number;
  pollenGrass: number;
  pollenBirch: number;
}

export interface WeatherBundle {
  place: Place;
  current: CurrentWeather;
  hourly: HourlyItem[];
  daily: DailyItem[];
  air: AirQuality | null;
}

export interface Palette {
  from: string;
  via: string;
  to: string;
}
