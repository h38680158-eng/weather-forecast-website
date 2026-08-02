import { useCallback, useRef, useState } from "react";
import { useWeatherStore } from "../store/useWeatherStore";

const LOCALE: Record<string, string> = {
  en: "en-US", es: "es-ES", fr: "fr-FR", de: "de-DE", hi: "hi-IN",
};

/** Web Speech API voice recognition for hands-free city search. */
export function useVoiceSearch(onResult: (text: string) => void) {
  const [listening, setListening] = useState(false);
  const [supported] = useState(
    () => typeof window !== "undefined" && ("SpeechRecognition" in window || "webkitSpeechRecognition" in window),
  );
  const recRef = useRef<any>(null);
  const lang = useWeatherStore((s) => s.lang);

  const start = useCallback(() => {
    if (!supported) return;
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const rec = new SR();
    rec.lang = LOCALE[lang] ?? "en-US";
    rec.interimResults = false;
    rec.maxAlternatives = 1;
    rec.onstart = () => setListening(true);
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);
    rec.onresult = (e: any) => {
      const text = e.results?.[0]?.[0]?.transcript ?? "";
      if (text) onResult(text.trim());
    };
    recRef.current = rec;
    rec.start();
  }, [supported, lang, onResult]);

  const stop = useCallback(() => {
    recRef.current?.stop();
    setListening(false);
  }, []);

  return { listening, supported, start, stop };
}
