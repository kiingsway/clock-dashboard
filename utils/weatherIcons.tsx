import { WeatherCategory } from "@/types2/weather.types";
import type { ReactNode } from "react";

const ICON_BASE_URI = "https://cdn.meteocons.com/3.0.0-next.10/svg/fill/";

const ICON_FILES = {
  clearDay: "clear-day.svg",
  clearNight: "clear-night.svg",
  overcast: "overcast.svg",
  fogDay: "fog-day.svg",
  fogNight: "fog-night.svg",
  drizzle: "drizzle.svg",
  rain: "rain.svg",
  snow: "snow.svg",
  showers: "overcast-rain.svg",
  thunderstorm: "thunderstorms.svg",
  sunrise: "sunrise.svg",
  sunset: "sunset.svg",
  unknown: "uv-index-alert.svg",
  error: 'code-red.svg',
  loading: 'wind-spinner.svg',
} as const;

/**
 * Buckets a WMO weather code into a coarse category.
 * Shared by the icon picker and by `getAccentColor`, so the two always agree
 * on what a given code "means".
 */
export function getWeatherCategory(weatherCode: number): WeatherCategory {
  if (weatherCode === 0) return "clear";
  if (weatherCode >= 1 && weatherCode <= 3) return "cloudy";
  if (weatherCode === 45 || weatherCode === 48) return "fog";
  if (weatherCode >= 51 && weatherCode <= 57) return "drizzle";
  if (weatherCode >= 61 && weatherCode <= 67) return "rain";
  if (weatherCode >= 71 && weatherCode <= 77) return "snow";
  if (weatherCode >= 80 && weatherCode <= 82) return "showers";
  if (weatherCode >= 85 && weatherCode <= 86) return "snow";
  if (weatherCode >= 95 && weatherCode <= 99) return "thunderstorm";

  if (weatherCode === -1) return 'error'
  if (weatherCode === -2) return 'loading'
  return "unknown";
}

/**
 * Resolves a WMO weather code (+ day/night flag) to an animated Meteocons icon.
 * `category` is optional and only used for the alt/title text — pass it if you
 * already computed it upstream (e.g. for the accent color) to avoid recomputing.
 */
export function getWeatherAnimatedIcon(
  weatherCode: number,
  isDay: boolean,
  size: number,
  category?: WeatherCategory
): ReactNode {
  const resolvedCategory = category ?? getWeatherCategory(weatherCode);

  const src = (() => {
    switch (resolvedCategory) {
      case "clear":
        return isDay ? ICON_FILES.clearDay : ICON_FILES.clearNight;
      case "cloudy":
        return ICON_FILES.overcast;
      case "fog":
        return isDay ? ICON_FILES.fogDay : ICON_FILES.fogNight;
      case "drizzle":
        return ICON_FILES.drizzle;
      case "rain":
        return ICON_FILES.rain;
      case "snow":
        return ICON_FILES.snow;
      case "showers":
        return ICON_FILES.showers;
      case "thunderstorm":
        return ICON_FILES.thunderstorm;
      case "error":
        return ICON_FILES.error;
      case "loading":
        return ICON_FILES.loading;
      default:
        return ICON_FILES.unknown;
    }
  })();

  return (
    <img
      src={`${ICON_BASE_URI}${src}`}
      alt={resolvedCategory}
      title={`Weather code: ${weatherCode} (${resolvedCategory})`}
      loading="lazy"
      style={{ width: size, height: size, display: "block" }}
    />
  );
}

/**
 * Renders the fixed sunrise/sunset icon (not weather-code dependent, unlike
 * `getWeatherAnimatedIcon`).
 */
export function getSunIcon(kind: "sunrise" | "sunset", size: number): ReactNode {
  return (
    <img
      src={`${ICON_BASE_URI}${ICON_FILES[kind]}`}
      alt={kind}
      loading="lazy"
      style={{ width: size, height: size, display: "block" }}
    />
  );
}

/**
 * A dim, dark-room-safe accent color per weather category, used for the
 * ambient glow behind the current-weather icon. Day/night shifts a few of
 * these (clear, fog) since the mood genuinely changes; the rest stay stable.
 */
export function getAccentColor(category: WeatherCategory, isDay: boolean): string {
  switch (category) {
    case "clear":
      return isDay ? "#f4b860" : "#8695f0";
    case "cloudy":
      return "#8b93a6";
    case "fog":
      return isDay ? "#a7b8bd" : "#7c8b95";
    case "drizzle":
      return "#6fc1e0";
    case "rain":
      return "#4fa0e0";
    case "snow":
      return "#cfe3f0";
    case "showers":
      return "#57b6db";
    case "thunderstorm":
      return "#a98cf0";
    default:
      return "#6b7280";
  }
}