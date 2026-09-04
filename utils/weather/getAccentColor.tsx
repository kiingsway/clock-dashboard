import { WeatherCategoryName } from "@/types/weather.types";
import { WEATHER_ACCENT_COLORS } from "@/constants/colors";
import { IWeatherLocationItem } from "@/types/location.types";
import { SunWindow } from "@/types/sun.types";
import { DateTime } from "luxon";
import { getTimes } from "suncalc";
import { getSolarStyle } from "./getSolarStyle";

/**
 * A dim, dark-room-safe accent color per weather category, used for the
 * ambient glow behind the current-weather icon. Day/night shifts a few of
 * these (clear, fog) since the mood genuinely changes; the rest stay stable.
 */
export default function getAccentColor(categoryName: WeatherCategoryName, isDay: "" | 0 | 1 | undefined | boolean): string {
  const color = WEATHER_ACCENT_COLORS[categoryName] ?? WEATHER_ACCENT_COLORS.unknown;

  if (typeof color === "string") return color;

  return Boolean(isDay) || isDay === undefined ? color.day : color.night;
}

export function getGoldenHourAccent(now: DateTime, sunWindow: SunWindow | undefined, weatherLocation: IWeatherLocationItem, initialColor = 'var(--wc-accent)') {

  if (sunWindow) {
    const times = getTimes(
      now.toJSDate(),
      weatherLocation.lat,
      weatherLocation.lon,
    );

    if (times.goldenHour && times.goldenHourEnd) {
      const solarNoon = DateTime.fromJSDate(times.solarNoon);
      const goldenHour = DateTime.fromJSDate(times.goldenHour);
      const goldenHourEnd = DateTime.fromJSDate(times.goldenHourEnd);

      return getSolarStyle(now, sunWindow.start, sunWindow.end, solarNoon, goldenHour, goldenHourEnd, initialColor);
    }
  }

  return undefined;
}