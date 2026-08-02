import type { Skin } from "../types/weather";

export interface SkinTokens {
  cardBg: string;
  cardBorder: string;
  cardBlur: string;
  cardRadius: string;
  cardShadow: string;
  accent: string;
  glow: string;
  font: string;
}

// Each skin re-styles the glass cards & accents globally via CSS variables.
export const SKINS: Record<Skin, SkinTokens> = {
  glass: {
    cardBg: "rgba(255,255,255,0.10)",
    cardBorder: "rgba(255,255,255,0.20)",
    cardBlur: "blur(16px)",
    cardRadius: "1.5rem",
    cardShadow: "0 20px 40px -20px rgba(0,0,0,0.35)",
    accent: "#fbbf24",
    glow: "none",
    font: "var(--font-body)",
  },
  minimal: {
    cardBg: "rgba(255,255,255,0.85)",
    cardBorder: "rgba(0,0,0,0.08)",
    cardBlur: "blur(0px)",
    cardRadius: "1rem",
    cardShadow: "0 10px 30px -18px rgba(0,0,0,0.25)",
    accent: "#0ea5e9",
    glow: "none",
    font: "var(--font-body)",
  },
  neon: {
    cardBg: "rgba(10,10,30,0.55)",
    cardBorder: "rgba(0,255,200,0.45)",
    cardBlur: "blur(12px)",
    cardRadius: "1.25rem",
    cardShadow: "0 0 24px rgba(0,255,200,0.25), inset 0 0 12px rgba(0,255,200,0.08)",
    accent: "#22d3ee",
    glow: "0 0 12px rgba(34,211,238,0.8)",
    font: "var(--font-body)",
  },
  cyberpunk: {
    cardBg: "rgba(30,5,45,0.55)",
    cardBorder: "rgba(255,0,153,0.5)",
    cardBlur: "blur(10px)",
    cardRadius: "0.5rem",
    cardShadow: "0 0 24px rgba(255,0,153,0.35), inset 0 0 12px rgba(0,229,255,0.12)",
    accent: "#ff2d95",
    glow: "0 0 12px rgba(255,45,149,0.9)",
    font: "var(--font-body)",
  },
};

export function applySkin(skin: Skin) {
  const t = SKINS[skin];
  const r = document.documentElement.style;
  r.setProperty("--card-bg", t.cardBg);
  r.setProperty("--card-border", t.cardBorder);
  r.setProperty("--card-blur", t.cardBlur);
  r.setProperty("--card-radius", t.cardRadius);
  r.setProperty("--card-shadow", t.cardShadow);
  r.setProperty("--accent", t.accent);
  r.setProperty("--glow", t.glow);
  document.documentElement.setAttribute("data-skin", skin);
}

export const SKIN_LABELS: Record<Skin, { label: string; icon: string }> = {
  glass: { label: "Glass", icon: "🧊" },
  minimal: { label: "Minimal", icon: "⬜" },
  neon: { label: "Neon", icon: "💚" },
  cyberpunk: { label: "Cyberpunk", icon: "🌆" },
};
