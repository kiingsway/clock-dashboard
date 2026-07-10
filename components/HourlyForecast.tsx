import type { FC } from "react";
import type { IHourly, IHourlyUnits } from "../types/weather.types";
import { formatHourLabel, getHourlyStartThreshold } from "../helpers/dateTime";
import { getWeatherIcon } from "../helpers/weatherIcons";
import styles from "./HourlyForecast.module.css";

/** Hourly cards never show more than a day ahead. */
const MAX_HOURS = 24;

export interface HourlyForecastProps {
  hourly: IHourly;
  units: IHourlyUnits;
  /** Current time, used to find where the visible window starts. */
  now: Date;
}

/**
 * Normalizes the columnar IHourly arrays into one row per hour. The API
 * response returns parallel arrays; the rest of the component tree only
 * ever deals with this row-shaped version.
 */
function toRows(hourly: IHourly) {
  return hourly.time.map((time, index) => ({
    time,
    temperature: hourly.temperature_2m[index],
    apparentTemperature: hourly.apparent_temperature[index],
    precipitation: hourly.precipitation[index],
    weatherCode: hourly.weather_code[index],
  }));
}

export const HourlyForecast: FC<HourlyForecastProps> = ({
  hourly,
  units,
  now,
}) => {
  const threshold = getHourlyStartThreshold(now);
  const rows = toRows(hourly)
    .filter((row) => new Date(row.time) >= threshold)
    .slice(0, MAX_HOURS);

  if (rows.length === 0) {
    return (
      <section className={styles.section} aria-label="Previsão por hora">
        <h2 className={styles.heading}>Próximas horas</h2>
        <p className={styles.empty}>Sem dados por hora no momento.</p>
      </section>
    );
  }

  return (
    <section className={styles.section} aria-label="Previsão por hora">
      <ul className={styles.list}>
        {rows.map((row) => (
          <li key={row.time} className={styles.card}>
            <span className={styles.hour}>{formatHourLabel(row.time)}</span>
            <span className={styles.icon}>{getWeatherIcon(row.weatherCode)}</span>
            <span className={styles.temp}>
              {Math.round(row.temperature)}
              {units.temperature_2m}
            </span>
            <span className={styles.feelsLike}>
              Sensação {Math.round(row.apparentTemperature)}
              {units.apparent_temperature}
            </span>
            <span className={styles.precipitation}>
              {row.precipitation}
              {units.precipitation}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
};
