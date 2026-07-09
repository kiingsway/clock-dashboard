import type { FC } from "react";
import type { IDaily, IDailyUnits } from "../types/weather.types";
import { formatDayLabel } from "../helpers/dateTime";
import { getWeatherIcon } from "../helpers/weatherIcons";
import styles from "./DailyForecast.module.css";

export interface DailyForecastProps {
  daily: IDaily;
  units: IDailyUnits;
}

function toRows(daily: IDaily) {
  return daily.time.map((time, index) => ({
    date: time,
    temperatureMax: daily.temperature_2m_max[index],
    temperatureMin: daily.temperature_2m_min[index],
    weatherCode: daily.weather_code[index],
  }));
}

export const DailyForecast: FC<DailyForecastProps> = ({ daily, units }) => {
  const rows = toRows(daily);

  if (rows.length === 0) {
    return (
      <section className={styles.section} aria-label="Previsão dos próximos dias">
        <h2 className={styles.heading}>Próximos dias</h2>
        <p className={styles.empty}>Sem dados diários no momento.</p>
      </section>
    );
  }

  return (
    <section className={styles.section} aria-label="Previsão dos próximos dias">
      <h2 className={styles.heading}>Próximos dias</h2>
      <ul className={styles.list}>
        {rows.map((row) => (
          <li key={row.date} className={styles.card}>
            <span className={styles.day}>{formatDayLabel(row.date)}</span>
            <span className={styles.icon}>{getWeatherIcon(row.weatherCode)}</span>
            <span className={styles.temps}>
              <span className={styles.max}>
                {Math.round(row.temperatureMax)}
                {units.temperature_2m_max}
              </span>
              <span className={styles.min}>
                {Math.round(row.temperatureMin)}
                {units.temperature_2m_min}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
};
