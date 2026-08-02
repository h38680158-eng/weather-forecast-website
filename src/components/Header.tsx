import { FiSun, FiMoon, FiEye, FiDownload, FiSettings, FiWifiOff } from "react-icons/fi";
import SearchBar from "./SearchBar";
import { useWeatherStore } from "../store/useWeatherStore";
import type { Place } from "../types/weather";

interface Props {
  onSelect: (p: Place) => void;
  onLocate: () => void;
  onDownload: () => void;
  canDownload: boolean;
  onOpenSettings: () => void;
  offline: boolean;
}

export default function Header({ onSelect, onLocate, onDownload, canDownload, onOpenSettings, offline }: Props) {
  const { unit, theme, highContrast, toggleUnit, toggleTheme, toggleContrast } = useWeatherStore();

  return (
    <header className="sticky top-0 z-40 mx-auto mt-3 flex w-[95%] max-w-6xl flex-wrap items-center justify-between gap-3 rounded-full border border-white/20 bg-white/10 px-4 py-2.5 backdrop-blur-2xl">
      <a href="#top" className="flex shrink-0 items-center gap-2">
        <span className="text-xl">🌤️</span>
        <span className="font-display text-lg font-bold tracking-tight">Skyward</span>
      </a>

      <div className="order-3 w-full sm:order-2 sm:w-auto sm:flex-1 sm:px-4">
        <div className="mx-auto max-w-md">
          <SearchBar onSelect={onSelect} onLocate={onLocate} />
        </div>
      </div>

      <div className="order-2 flex items-center gap-1.5 sm:order-3">
        {offline && (
          <span className="flex items-center gap-1 rounded-full bg-amber-400/20 px-2 py-1 text-[11px] font-medium text-amber-200" title="Offline — showing cached data">
            <FiWifiOff /> Offline
          </span>
        )}
        <IconBtn label={`Switch to ${unit === "C" ? "Fahrenheit" : "Celsius"}`} onClick={toggleUnit}>
          <span className="text-sm font-semibold">°{unit}</span>
        </IconBtn>
        <IconBtn label="Toggle high contrast" onClick={toggleContrast} active={highContrast}>
          <FiEye />
        </IconBtn>
        <IconBtn label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`} onClick={toggleTheme}>
          {theme === "dark" ? <FiSun /> : <FiMoon />}
        </IconBtn>
        {canDownload && (
          <IconBtn label="Download weather report as PDF" onClick={onDownload}>
            <FiDownload />
          </IconBtn>
        )}
        <IconBtn label="Open settings and theme customization" onClick={onOpenSettings}>
          <FiSettings />
        </IconBtn>
      </div>
    </header>
  );
}

function IconBtn({ children, label, onClick, active }: { children: React.ReactNode; label: string; onClick: () => void; active?: boolean }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      title={label}
      className={`flex h-9 min-w-9 items-center justify-center rounded-full border border-white/20 px-2 transition hover:scale-110 ${active ? "bg-white/30" : "bg-white/10"}`}
    >
      {children}
    </button>
  );
}
