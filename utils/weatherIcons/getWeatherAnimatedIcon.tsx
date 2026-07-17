import { WeatherCategory } from "@/types/weather.types";
import ICON_FILES, { ICON_BASE_URI } from "./iconFiles";
import type { ReactNode } from "react";
import getWeatherCategory from "./getWeatherCategory";


export function getWeatherIconFile(
  category: WeatherCategory,
  isDay: boolean
) {
  const unknownIcon = ICON_FILES.unknown

  const map: Record<WeatherCategory, string> = {
    clear: isDay ? ICON_FILES.clearDay : ICON_FILES.clearNight,
    partlyCloudy: isDay
      ? ICON_FILES.partlyCloudyDay
      : ICON_FILES.partlyCloudyNight,
    smoke: isDay ?
      ICON_FILES.smokeDay :
      ICON_FILES.smokeNight,
    cloudy: ICON_FILES.cloudy,
    haze: isDay
      ? ICON_FILES.hazeDay
      : ICON_FILES.hazeNight,
    fog: ICON_FILES.fog,
    lightFog: isDay ? ICON_FILES.fogDay : ICON_FILES.fogNight,
    drizzle: ICON_FILES.drizzle,
    freezingDrizzle: ICON_FILES.freezingDrizzle,
    rain: ICON_FILES.rain,
    freezingRain: ICON_FILES.freezingRain,
    snow: ICON_FILES.snow,
    snowShowers: isDay
      ? ICON_FILES.snowShowersDay
      : ICON_FILES.snowShowersNight,
    showers: ICON_FILES.showers,
    thunderstorm: ICON_FILES.thunderstorm,
    hail: ICON_FILES.hail,
    moderateHail: ICON_FILES.moderateHail,
    heavyHail: ICON_FILES.heavyHail,
    heavyRain: ICON_FILES.heavyRain,
    heavySnow: ICON_FILES.heavySnow,
    sleet: isDay ? ICON_FILES.sleetDay : ICON_FILES.sleetNight,
    heavySleet: isDay ? ICON_FILES.heavySleetDay : ICON_FILES.heavySleetNight,
    error: ICON_FILES.error,
    loading: ICON_FILES.loading,
    unknown: unknownIcon
  };

  return category ? map[category] : unknownIcon;
}

/**
 * Resolves a WMO weather code (+ day/night flag) to an animated Meteocons icon.
 * `category` is optional and only used for the alt/title text — pass it if you
 * already computed it upstream (e.g. for the accent color) to avoid recomputing.
 */
export default function getWeatherAnimatedIcon(
  weatherCode: number,
  isDay: boolean,
  size: number,
): { img: ReactNode, category: WeatherCategory } {
  const category = getWeatherCategory(weatherCode);

  const src = getWeatherIconFile(category, isDay)

  const img = (
    <img
      src={`${ICON_BASE_URI}${src}.svg`}
      alt={category}
      loading="lazy"
      style={{ width: `${size / 16}em`, height: `${size / 16}em`, display: "block" }}
    />
  )

  return { img, category }
}