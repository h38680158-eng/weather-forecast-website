import type { CurrentWeather } from "../types/weather";

export interface Outfit {
  headline: string;
  items: { icon: string; label: string }[];
  tips: string[];
}

/**
 * A compact "AI" recommendation engine. It reasons over temperature, feels-like,
 * wind, UV, precipitation and condition to synthesize natural-language outfit
 * advice — mimicking an LLM stylist without a paid API dependency.
 */
export function recommendOutfit(c: CurrentWeather, rainChance: number): Outfit {
  const t = c.apparent; // reason on feels-like
  const items: { icon: string; label: string }[] = [];
  const tips: string[] = [];
  let headline = "";

  if (t >= 30) {
    headline = "Scorching — dress light and stay hydrated.";
    items.push({ icon: "👕", label: "Breathable t-shirt" }, { icon: "🩳", label: "Shorts" }, { icon: "🕶️", label: "Sunglasses" }, { icon: "🧴", label: "SPF 50" });
  } else if (t >= 23) {
    headline = "Warm and pleasant — summer wear works great.";
    items.push({ icon: "👕", label: "Light shirt" }, { icon: "👖", label: "Light trousers" }, { icon: "🕶️", label: "Sunglasses" });
  } else if (t >= 16) {
    headline = "Mild — a light layer will keep you comfy.";
    items.push({ icon: "👔", label: "Long sleeve" }, { icon: "🧥", label: "Light jacket" }, { icon: "👖", label: "Jeans" });
  } else if (t >= 8) {
    headline = "Cool — layer up before heading out.";
    items.push({ icon: "🧥", label: "Warm jacket" }, { icon: "🧶", label: "Sweater" }, { icon: "👖", label: "Long pants" });
  } else if (t >= 0) {
    headline = "Cold — bundle up properly.";
    items.push({ icon: "🧥", label: "Heavy coat" }, { icon: "🧣", label: "Scarf" }, { icon: "🧤", label: "Gloves" }, { icon: "👖", label: "Thermal layer" });
  } else {
    headline = "Freezing — full winter armor required.";
    items.push({ icon: "🧥", label: "Insulated parka" }, { icon: "🧣", label: "Scarf" }, { icon: "🧤", label: "Gloves" }, { icon: "🧦", label: "Thermal socks" }, { icon: "👢", label: "Boots" });
  }

  if (rainChance >= 40 || ["rain", "drizzle", "thunder"].includes(c.info.condition)) {
    items.push({ icon: "☂️", label: "Umbrella" }, { icon: "🥾", label: "Waterproof shoes" });
    tips.push(`Rain likely (${rainChance}% chance) — take a waterproof layer.`);
  }
  if (c.info.condition === "snow") {
    items.push({ icon: "👢", label: "Snow boots" });
    tips.push("Snow on the way — waterproof, grippy footwear helps.");
  }
  if (c.wind >= 30) tips.push(`Windy at ${c.wind} km/h — a windbreaker will help.`);
  if (c.uv >= 6 && c.isDay) tips.push(`High UV (${c.uv}) — sunscreen and a hat recommended.`);
  if (t < 5) tips.push("Cover extremities — most heat is lost from head and hands.");
  if (Math.abs(c.temp - c.apparent) >= 4) tips.push(`It feels ${c.apparent}° though it's ${c.temp}° — dress for the feel.`);

  return { headline, items, tips };
}
