import type { Unit, WeatherBundle } from "../types/weather";
import { toUnit } from "./format";

/** Dynamically updates document title, meta description, OG tags & JSON-LD. */
export function updateSeo(b: WeatherBundle, unit: Unit) {
  const title = `${b.place.name} Weather — ${toUnit(b.current.temp, unit)}°${unit}, ${b.current.info.label} | Skyward`;
  const desc = `Live weather for ${b.place.name}${b.place.country ? ", " + b.place.country : ""}: ${toUnit(b.current.temp, unit)}°${unit}, ${b.current.info.label.toLowerCase()}, humidity ${b.current.humidity}%, wind ${b.current.wind} km/h. Hourly & 7-day forecast.`;

  document.title = title;
  setMeta("description", desc);
  setMeta("og:title", title, true);
  setMeta("og:description", desc, true);
  setMeta("og:type", "website", true);
  setMeta("twitter:card", "summary_large_image");
  setMeta("twitter:title", title);
  setMeta("twitter:description", desc);

  // Structured data (schema.org WeatherForecast-ish via Dataset)
  const ld = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Skyward Weather",
    applicationCategory: "Weather",
    about: { "@type": "Place", name: `${b.place.name}, ${b.place.country}` },
    description: desc,
  };
  let script = document.getElementById("ld-json") as HTMLScriptElement | null;
  if (!script) {
    script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = "ld-json";
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(ld);
}

function setMeta(name: string, content: string, property = false) {
  const attr = property ? "property" : "name";
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}
