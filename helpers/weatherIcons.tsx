import type { ReactNode } from "react";

/**
 * Broad weather categories, grouped from the WMO weather_code table.
 * Kept separate from the icon lookup so the category can also drive
 * copy ("Chuva forte" vs "Chuva fraca") once real content is added.
 */
export type WeatherCategory =
  | "clear"
  | "cloudy"
  | "fog"
  | "drizzle"
  | "rain"
  | "snow"
  | "showers"
  | "thunderstorm"
  | "unknown";

/**
 * Maps a WMO weather_code to a broad category.
 * https://open-meteo.com/en/docs#weathervariables (weather_code)
 */
export function getWeatherCategory(weatherCode: number): WeatherCategory {
  switch (true) {
    case weatherCode === 0:
      return "clear";
    case weatherCode >= 1 && weatherCode <= 3:
      return "cloudy";
    case weatherCode === 45 || weatherCode === 48:
      return "fog";
    case weatherCode >= 51 && weatherCode <= 57:
      return "drizzle";
    case weatherCode >= 61 && weatherCode <= 67:
      return "rain";
    case weatherCode >= 71 && weatherCode <= 77:
      return "snow";
    case weatherCode >= 80 && weatherCode <= 82:
      return "showers";
    case weatherCode >= 85 && weatherCode <= 86:
      return "snow";
    case weatherCode >= 95 && weatherCode <= 99:
      return "thunderstorm";
    default:
      return "unknown";
  }
}

/**
 * Placeholder icon lookup. Deliberately returns a labeled glyph rather
 * than real artwork — swap the JSX below for an icon set/SVG library
 * later without touching any component that calls this function.
 */
export function getWeatherIcon(weatherCode: number): ReactNode {
  const category = getWeatherCategory(weatherCode);

  const glyphByCategory: Record<WeatherCategory, string> = {
    clear: "☀",
    cloudy: "☁",
    fog: "▤",
    drizzle: "⋮",
    rain: "⋮⋮",
    snow: "❄",
    showers: "⋮⋮",
    thunderstorm: "⚡",
    unknown: "?",
  };

  return (
    <span
      className="weather-icon-placeholder"
      role="img"
      aria-label={category}
      data-weather-code={weatherCode}
      data-category={category}
    >
      {glyphByCategory[category]}
    </span>
  );
}
