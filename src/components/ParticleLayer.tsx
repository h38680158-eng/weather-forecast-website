import { useMemo } from "react";
import Particles, { useParticlesProvider } from "@tsparticles/react";
import type { Condition } from "../types/weather";

interface Props {
  condition: Condition;
  isDay: boolean;
}

/**
 * tsparticles overlay tuned per weather condition. Relies on ParticlesProvider
 * (mounted at the app root) to load the slim engine bundle.
 */
export default function ParticleLayer({ condition, isDay }: Props) {
  const { loaded } = useParticlesProvider();

  const options = useMemo(() => {
    const base = { fullScreen: { enable: false }, detectRetina: true, fpsLimit: 60 };

    if (condition === "rain" || condition === "drizzle" || condition === "thunder") {
      return {
        ...base,
        particles: {
          number: { value: 120 },
          color: { value: "#bcd8ff" },
          shape: { type: "line" },
          opacity: { value: 0.4 },
          size: { value: { min: 1, max: 2 } },
          move: { enable: true, direction: "bottom", speed: { min: 18, max: 28 }, straight: true },
          rotate: { value: 8 },
        },
      };
    }
    if (condition === "snow") {
      return {
        ...base,
        particles: {
          number: { value: 90 },
          color: { value: "#ffffff" },
          shape: { type: "circle" },
          opacity: { value: { min: 0.4, max: 0.9 } },
          size: { value: { min: 2, max: 5 } },
          move: { enable: true, direction: "bottom", speed: { min: 1, max: 3 }, straight: false },
          wobble: { enable: true, distance: 10, speed: 5 },
        },
      };
    }
    if (!isDay) {
      return {
        ...base,
        particles: {
          number: { value: 90 },
          color: { value: "#ffffff" },
          shape: { type: "circle" },
          opacity: { value: { min: 0.1, max: 0.9 }, animation: { enable: true, speed: 0.6, sync: false } },
          size: { value: { min: 0.5, max: 2 } },
          move: { enable: true, speed: 0.15 },
        },
      };
    }
    return {
      ...base,
      particles: {
        number: { value: 40 },
        color: { value: "#ffffff" },
        shape: { type: "circle" },
        opacity: { value: { min: 0.05, max: 0.25 } },
        size: { value: { min: 1, max: 3 } },
        move: { enable: true, speed: 0.4, direction: "top", outModes: "out" },
      },
    };
  }, [condition, isDay]);

  if (!loaded) return null;

  return (
    <Particles
      id="wx-particles"
      className="pointer-events-none fixed inset-0 -z-[5]"
      options={options as never}
    />
  );
}
