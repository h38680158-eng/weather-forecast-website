import {
  WiDaySunny,
  WiNightClear,
  WiDayCloudy,
  WiNightAltCloudy,
  WiCloudy,
  WiFog,
  WiSprinkle,
  WiRain,
  WiSnow,
  WiThunderstorm,
} from "react-icons/wi";
import type { Condition } from "../types/weather";

interface Props {
  condition: Condition;
  isDay?: boolean;
  className?: string;
}

/** Resolves our condition buckets to weather-themed react-icons glyphs. */
export default function WeatherIcon({ condition, isDay = true, className }: Props) {
  const map: Record<Condition, React.ComponentType<{ className?: string }>> = {
    clear: isDay ? WiDaySunny : WiNightClear,
    cloudy: isDay ? WiDayCloudy : WiNightAltCloudy,
    overcast: WiCloudy,
    fog: WiFog,
    drizzle: WiSprinkle,
    rain: WiRain,
    snow: WiSnow,
    thunder: WiThunderstorm,
  };
  const Icon = map[condition];
  return <Icon className={className} />;
}
