import { IWeather, SupportedLocale } from "@/types/weather.types";
import styles from "./HourlyForecast.module.css";
import { formatHourLabel, splitCamelCase } from "@/utils/formatters";
import { useTranslation } from "react-i18next";
import getWeatherAnimatedIcon from "@/utils/weatherIcons/getWeatherAnimatedIcon";
import { DateTime } from "luxon";
import { getAccent } from "@/utils/weatherIcons/getAccentColor";
import getMoonPhase from "@/utils/weatherIcons/getMoonPhase";
import { getMoonPosition } from "suncalc";
import getWeatherIcon from "@/utils/weatherIcons/getWeatherIcon";
import Image from "next/image";
import WeatherIcon from "../WeatherIcon";

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
  hoursToShow = 24 * 2,
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

  return (
    <section className={styles.section} aria-label={t('nextHours')}>
      <ul className={styles.scroller}>
        {indices.map((i) => {
          const isoString = weather.hourly.time[i];
          const date = DateTime.fromISO(isoString, { zone: weather.timezone });
          const isNow = date.hasSame(now, "hour");
          const isDay = weather.hourly.is_day[i] === 1;
          const precip = weather.hourly.precipitation[i];
          const weatherCode = weather.hourly.weather_code[i]

          const [lat, lon] = [weather.latitude, weather.longitude];

          const accent = getAccent(weatherCode, isDay);

          return (
            <li key={isoString} className={styles.card} style={{ ["--wc-accent" as string]: accent }}>
              <span className={styles.hour} title={date.toFormat('dd/LL/yyyy HH:mm')}>
                {isNow ? t('now') : formatHourLabel(date, locale)}
              </span>

              <WeatherIcon
                weatherCode={weatherCode}
                date={date}
                isDay={isDay}
                lat={lat}
                lon={lon}
                size={34}
              />

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
