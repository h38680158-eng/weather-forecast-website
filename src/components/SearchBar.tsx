import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiSearch, FiMapPin, FiClock, FiStar, FiMic } from "react-icons/fi";
import { searchPlaces } from "../services/weatherApi";
import { useDebounce } from "../hooks/useDebounce";
import { useWeatherStore } from "../store/useWeatherStore";
import { useVoiceSearch } from "../hooks/useVoiceSearch";
import type { Place } from "../types/weather";

interface Props {
  onSelect: (p: Place) => void;
  onLocate: () => void;
}

export default function SearchBar({ onSelect, onLocate }: Props) {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<Place[]>([]);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const debounced = useDebounce(q);
  const ref = useRef<HTMLDivElement>(null);
  const recents = useWeatherStore((s) => s.recents);
  const favorites = useWeatherStore((s) => s.favorites);

  // Voice search: on transcript, run a search and auto-pick the top result.
  const { listening, supported, start } = useVoiceSearch(async (text) => {
    setQ(text);
    setOpen(true);
    const r = await searchPlaces(text);
    setResults(r);
    if (r[0]) pick(r[0]);
  });

  useEffect(() => {
    let alive = true;
    if (!debounced.trim()) {
      setResults([]);
      return;
    }
    searchPlaces(debounced).then((r) => alive && setResults(r)).catch(() => {});
    return () => {
      alive = false;
    };
  }, [debounced]);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  function pick(p: Place) {
    onSelect(p);
    setOpen(false);
    setQ("");
    setResults([]);
    setActive(-1);
  }

  const list = q.trim() ? results : [];
  const showEmpty = !q.trim() && open;

  const onKey = (e: React.KeyboardEvent) => {
    if (!open) return;
    if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(a + 1, list.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
    else if (e.key === "Enter" && active >= 0 && list[active]) pick(list[active]);
    else if (e.key === "Escape") setOpen(false);
  };

  return (
    <div className="relative w-full max-w-md" ref={ref}>
      <div className="flex items-center gap-2 rounded-full border border-white/25 bg-white/15 px-4 py-2.5 backdrop-blur-xl focus-within:ring-2 focus-within:ring-white/40">
        <FiSearch aria-hidden className="shrink-0 opacity-80" />
        <input
          value={q}
          onChange={(e) => { setQ(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKey}
          role="combobox"
          aria-expanded={open}
          aria-controls="search-list"
          aria-label="Search for a city"
          placeholder="Search any city…"
          className="w-full bg-transparent text-sm outline-none placeholder:opacity-60"
        />
        {supported && (
          <button
            onClick={start}
            aria-label="Voice search"
            title="Voice search"
            className={`shrink-0 rounded-full p-1.5 transition hover:bg-white/20 ${listening ? "animate-pulse text-rose-300" : ""}`}
          >
            <FiMic />
          </button>
        )}
        <button
          onClick={onLocate}
          aria-label="Use my current location"
          className="shrink-0 rounded-full p-1.5 transition hover:bg-white/20"
        >
          <FiMapPin />
        </button>
      </div>

      <AnimatePresence>
        {open && (list.length > 0 || showEmpty) && (
          <motion.ul
            id="search-list"
            role="listbox"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="absolute z-50 mt-2 w-full overflow-hidden rounded-2xl border border-white/15 bg-slate-900/85 text-white shadow-2xl backdrop-blur-2xl"
          >
            {list.map((p, i) => (
              <li key={`${p.name}-${i}`} role="option" aria-selected={active === i}>
                <button
                  onMouseEnter={() => setActive(i)}
                  onClick={() => pick(p)}
                  className={`flex w-full items-center justify-between px-4 py-2.5 text-left text-sm transition ${active === i ? "bg-white/15" : "hover:bg-white/10"}`}
                >
                  <span>{p.name}{p.admin1 ? <span className="opacity-60">, {p.admin1}</span> : ""}</span>
                  <span className="text-xs opacity-50">{p.country}</span>
                </button>
              </li>
            ))}

            {showEmpty && favorites.length > 0 && (
              <>
                <li className="flex items-center gap-2 px-4 pt-3 pb-1 text-[11px] uppercase tracking-wider opacity-50"><FiStar /> Favorites</li>
                {favorites.map((p, i) => (
                  <li key={`f-${i}`}><SuggestionRow p={p} onClick={() => pick(p)} /></li>
                ))}
              </>
            )}

            {showEmpty && recents.length > 0 && (
              <>
                <li className="flex items-center gap-2 px-4 pt-3 pb-1 text-[11px] uppercase tracking-wider opacity-50"><FiClock /> Recent</li>
                {recents.map((p, i) => (
                  <li key={`r-${i}`}><SuggestionRow p={p} onClick={() => pick(p)} /></li>
                ))}
              </>
            )}

            {showEmpty && recents.length === 0 && favorites.length === 0 && (
              <li className="px-4 py-4 text-center text-sm opacity-60">Start typing to search cities 🌍</li>
            )}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

function SuggestionRow({ p, onClick }: { p: Place; onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex w-full items-center justify-between px-4 py-2 text-left text-sm transition hover:bg-white/10">
      <span>{p.name}{p.admin1 ? <span className="opacity-60">, {p.admin1}</span> : ""}</span>
      <span className="text-xs opacity-50">{p.country}</span>
    </button>
  );
}
7428621
536