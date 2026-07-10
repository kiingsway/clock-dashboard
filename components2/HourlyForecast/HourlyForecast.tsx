import { IHourly, IHourlyUnits, SupportedLocale } from "@/types2/weather.types";
import styles from "./HourlyForecast.module.css";
import { getDictionary } from "@/utils/i18n";
import { formatHourLabel, inferIsDayFromHour, isSameHour } from "@/utils/formatters";
import { getWeatherAnimatedIcon } from "@/utils/weatherIcons";

export interface HourlyForecastProps {
  hourly: IHourly;
  hourlyUnits: IHourlyUnits;
  /** `current.time` from the payload — used to start the strip at "now". */
  currentTime: string;
  timeZone?: string;
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
  hourly,
  hourlyUnits,
  currentTime,
  timeZone,
  locale,
  hoursToShow = 24,
}: HourlyForecastProps) {
  const t = getDictionary(locale);
  const now = new Date(currentTime);

  const startIndex = Math.max(
    0,
    hourly.time.findIndex((iso) => new Date(iso).getTime() >= now.getTime())
  );
  const endIndex = Math.min(hourly.time.length, startIndex + hoursToShow);
  const indices = Array.from({ length: Math.max(0, endIndex - startIndex) }, (_, i) => startIndex + i);

  if (indices.length === 0) return null;

  return (
    <section className={styles.section} aria-label={t.nextHours}>
      {/* <h2 className={styles.heading}>{t.nextHours}</h2> */}
      <ul className={styles.scroller}>
        {indices.map((i) => {
          const date = new Date(hourly.time[i]);
          const isNow = isSameHour(date, now, timeZone);
          const isDay = inferIsDayFromHour(date, timeZone);
          const precip = hourly.precipitation[i];

          return (
            <li key={hourly.time[i]} className={styles.card}>
              <span className={styles.hour}>{isNow ? t.now : formatHourLabel(date, locale, timeZone)}</span>
              <span className={styles.icon}>{getWeatherAnimatedIcon(hourly.weather_code[i], isDay, 34)}</span>
              <span className={styles.temp}>
                {Math.round(hourly.temperature_2m[i])}
                {hourlyUnits.temperature_2m}
              </span>
              <span className={styles.feels}>
                {Math.round(hourly.apparent_temperature[i])}
                {hourlyUnits.apparent_temperature}
              </span>
              <span className={styles.precip} data-active={precip > 0}>
                {precip > 0 ? `${precip}${hourlyUnits.precipitation}` : "—"}
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
