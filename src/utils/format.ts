import type { Unit } from "../types/weather";

export const toUnit = (c: number, unit: Unit) => (unit === "C" ? Math.round(c) : Math.round((c * 9) / 5 + 32));

export function windLabel(deg: number): string {
  const dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  return dirs[Math.round(deg / 45) % 8];
}

export const fmtHour = (iso: string) => new Date(iso).toLocaleTimeString([], { hour: "numeric" });
export const fmtDay = (iso: string, idx: number) =>
  idx === 0 ? "Today" : new Date(iso).toLocaleDateString([], { weekday: "short" });
export const fmtTime = (iso: string) =>
  new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

export function uvWord(uv: number): string {
  if (uv <= 2) return "Low";
  if (uv <= 5) return "Moderate";
  if (uv <= 7) return "High";
  if (uv <= 10) return "Very high";
  return "Extreme";
}

// European AQI banding.
export function aqiBand(aqi: number): { label: string; color: string } {
  if (aqi <= 20) return { label: "Good", color: "#4ade80" };
  if (aqi <= 40) return { label: "Fair", color: "#a3e635" };
  if (aqi <= 60) return { label: "Moderate", color: "#facc15" };
  if (aqi <= 80) return { label: "Poor", color: "#fb923c" };
  if (aqi <= 100) return { label: "Very poor", color: "#f87171" };
  return { label: "Extremely poor", color: "#c084fc" };
}

export function pollenWord(v: number): string {
  if (v < 1) return "None";
  if (v < 20) return "Low";
  if (v < 50) return "Moderate";
  if (v < 100) return "High";
  return "Very high";
}

// ---- Moon phase (0..1) from a date ----
export function moonPhase(date: Date): { phase: number; name: string; icon: string } {
  const synodic = 29.53058867;
  const known = Date.UTC(2000, 0, 6, 18, 14); // known new moon
  const days = (date.getTime() - known) / 86400000;
  const phase = ((days % synodic) + synodic) % synodic / synodic;
  const idx = Math.round(phase * 8) % 8;
  const names = [
    "New Moon", "Waxing Crescent", "First Quarter", "Waxing Gibbous",
    "Full Moon", "Waning Gibbous", "Last Quarter", "Waning Crescent",
  ];
  const icons = ["🌑", "🌒", "🌓", "🌔", "🌕", "🌖", "🌗", "🌘"];
  return { phase, name: names[idx], icon: icons[idx] };
}
