import { useCallback } from "react";
import { translate } from "../lib/i18n";
import { useWeatherStore } from "../store/useWeatherStore";

/** Translation hook — returns a t(key) function bound to the active language. */
export function useT() {
  const lang = useWeatherStore((s) => s.lang);
  return useCallback((key: string) => translate(lang, key), [lang]);
}
