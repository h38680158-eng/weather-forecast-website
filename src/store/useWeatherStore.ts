import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Lang, Place, Skin, Theme, Unit } from "../types/weather";

interface WeatherState {
  unit: Unit;
  theme: Theme;
  skin: Skin;
  lang: Lang;
  highContrast: boolean;
  notifications: boolean;
  recents: Place[];
  favorites: Place[];
  toggleUnit: () => void;
  toggleTheme: () => void;
  toggleContrast: () => void;
  setSkin: (s: Skin) => void;
  setLang: (l: Lang) => void;
  setNotifications: (v: boolean) => void;
  addRecent: (p: Place) => void;
  toggleFavorite: (p: Place) => void;
  isFavorite: (p: Place) => boolean;
}

const sameId = (a: Place, b: Place) =>
  a.name === b.name && a.country === b.country && Math.abs(a.latitude - b.latitude) < 0.01;

export const useWeatherStore = create<WeatherState>()(
  persist(
    (set, get) => ({
      unit: "C",
      theme: "dark",
      skin: "glass",
      lang: "en",
      highContrast: false,
      notifications: false,
      recents: [],
      favorites: [],
      toggleUnit: () => set((s) => ({ unit: s.unit === "C" ? "F" : "C" })),
      toggleTheme: () => set((s) => ({ theme: s.theme === "dark" ? "light" : "dark" })),
      toggleContrast: () => set((s) => ({ highContrast: !s.highContrast })),
      setSkin: (skin) => set({ skin }),
      setLang: (lang) => set({ lang }),
      setNotifications: (notifications) => set({ notifications }),
      addRecent: (p) =>
        set((s) => ({ recents: [p, ...s.recents.filter((r) => !sameId(r, p))].slice(0, 5) })),
      toggleFavorite: (p) =>
        set((s) => ({
          favorites: s.favorites.some((f) => sameId(f, p))
            ? s.favorites.filter((f) => !sameId(f, p))
            : [...s.favorites, p],
        })),
      isFavorite: (p) => get().favorites.some((f) => sameId(f, p)),
    }),
    { name: "skyward-store" },
  ),
);
