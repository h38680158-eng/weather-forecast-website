import type { Condition, Palette } from "../types/weather";

// Weather-driven gradient palettes for light and dark modes.
export function paletteFor(condition: Condition, isDay: boolean, theme: "light" | "dark"): Palette {
  if (theme === "dark" || !isDay) {
    switch (condition) {
      case "thunder":
        return { from: "#1a1030", via: "#2a1f4d", to: "#0d0820" };
      case "rain":
      case "drizzle":
        return { from: "#0d1b2a", via: "#1b3a5b", to: "#0a1420" };
      case "snow":
        return { from: "#1a2740", via: "#2d3e5c", to: "#101828" };
      default:
        return { from: "#0b1026", via: "#141a3a", to: "#0a0f22" };
    }
  }
  switch (condition) {
    case "clear":
      return { from: "#2a7fd4", via: "#5eb0e6", to: "#a9def0" };
    case "cloudy":
      return { from: "#5b83a8", via: "#8fa9c2", to: "#c3d3df" };
    case "overcast":
    case "fog":
      return { from: "#6b7482", via: "#94a0ad", to: "#c1c8cf" };
    case "drizzle":
    case "rain":
      return { from: "#3a4a63", via: "#5a6f8c", to: "#8fa2b8" };
    case "snow":
      return { from: "#7d95b0", via: "#b6c6d8", to: "#e8f0f7" };
    case "thunder":
      return { from: "#2b2d42", via: "#3f4266", to: "#6b6f9e" };
    default:
      return { from: "#2a7fd4", via: "#5eb0e6", to: "#a9def0" };
  }
}
