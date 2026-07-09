import type { FC } from "react";
import type { IWeatherCurrent, IWeatherUnits } from "../types/weather.types";
import { getWeatherCategory, getWeatherIcon } from "../helpers/weatherIcons";
import styles from "./CurrentWeatherCard.module.css";

export interface CurrentWeatherCardProps {
  current: IWeatherCurrent;
  units: IWeatherUnits;
}

const categoryLabel: Record<string, string> = {
  clear: "Céu limpo",
  cloudy: "Nublado",
  fog: "Neblina",
  drizzle: "Garoa",
  rain: "Chuva",
  snow: "Neve",
  showers: "Pancadas de chuva",
  thunderstorm: "Tempestade",
  unknown: "Sem dados",
};

export const CurrentWeatherCard: FC<CurrentWeatherCardProps> = ({
  current,
  units,
}) => {
  const category = getWeatherCategory(current.weather_code);

  return (
    <section className={styles.card} aria-label="Condições atuais">
      <div className={styles.iconRow}>
        <div className={styles.icon}>{getWeatherIcon(current.weather_code)}</div>
        <p className={styles.description}>{categoryLabel[category]}</p>
      </div>

      <p className={styles.temperature}>
        {Math.round(current.temperature_2m)}
        <span className={styles.unit}>{units.temperature_2m}</span>
      </p>

      <dl className={styles.meta}>
        <div className={styles.metaItem}>
          <dt>Sensação</dt>
          <dd>
            {Math.round(current.apparent_temperature)}
            {units.apparent_temperature}
          </dd>
        </div>
        <div className={styles.metaItem}>
          <dt>Precipitação</dt>
          <dd>
            {current.precipitation}
            {units.precipitation}
          </dd>
        </div>
      </dl>
    </section>
  );
};
