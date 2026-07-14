import { IWeather, SupportedLocale } from "@/types/weather.types";
import styles from "./HourlyForecast.module.css";
import { formatHourLabel } from "@/utils/formatters";
import { useTranslation } from "react-i18next";
import getWeatherAnimatedIcon from "@/utils/weatherIcons/getWeatherAnimatedIcon";
import { DateTime } from "luxon";
import { getAccent } from "@/utils/weatherIcons/getAccentColor";

export interface HourlyForecastProps {
  weather: IWeather
  locale: SupportedLocale;
  /** How many upcoming hours to render. Defaults to 24. */
  hoursToShow?: number;
}

/**
 * Compact hour-by-hour strip. Scrolls horizontally instead of listing every
 * hour on screen, per the brief — there can be dozens of entries in
 * `hourly`, so only a handful are ever visible at once.
 */
export function HourlyForecast({
  weather,
  locale,
  hoursToShow = 24,
}: HourlyForecastProps) {
  const { t } = useTranslation();

  const now = DateTime.fromISO(weather.current.time, { zone: weather.timezone });

  const startIndex = Math.max(
    0,
    weather.hourly.time.findIndex((iso) => {
      const hourlyTime = DateTime.fromISO(iso, { zone: weather.timezone });
      return hourlyTime >= now;
    })
  );

  const endIndex = Math.min(weather.hourly.time.length, startIndex + hoursToShow);
  const indices = Array.from({ length: Math.max(0, endIndex - startIndex) }, (_, i) => startIndex + i);

  if (indices.length === 0) return null;

  // const codes = [-3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100]

  return (
    <section className={styles.section} aria-label={t('nextHours')}>
      <ul className={styles.scroller}>
        {indices.map((i) => {
          const isoString = weather.hourly.time[i];
          const date = DateTime.fromISO(isoString, { zone: weather.timezone });
          const isNow = date.hasSame(now, "hour");
          const isDay = weather.hourly.is_day[i] === 1;
          const precip = weather.hourly.precipitation[i];
          const icon = getWeatherAnimatedIcon(weather.hourly.weather_code[i], isDay, 34).img
          // const icon = getWeatherAnimatedIcon(codes[i+10], isDay, 64).img
          const accent = getAccent(weather.hourly.weather_code[i], isDay);

          return (
            <li key={isoString} className={styles.card} style={{ ["--wc-accent" as string]: accent }}>
              <span className={styles.hour}>{isNow ? t('now') : formatHourLabel(date, locale)}</span>
              <span className={styles.icon}>{icon}</span>
              <span className={styles.temp}>
                {Math.round(weather.hourly.temperature_2m[i])}
                {weather.hourly_units.temperature_2m}
              </span>
              <span className={styles.feels}>
                {Math.round(weather.hourly.apparent_temperature[i])}
                {weather.hourly_units.apparent_temperature}
              </span>
              <span className={styles.precip} data-active={precip > 0}>
                {precip > 0 ? `${precip}${weather.hourly_units.precipitation}` : "—"}
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
