import type { FC } from "react";
import type { IWeatherCurrent, IWeatherUnits } from "../types/weather.types";
import { getWeatherAnimatedIcon, getWeatherCategory, getWeatherIcon } from "../helpers/weatherIcons";
import styles from "./CurrentWeatherCard.module.css";

export interface CurrentWeatherCardProps {
  current: IWeatherCurrent;
  units: IWeatherUnits;
  min: number;
  max: number;
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
  min,
  max
}) => {
  const category = getWeatherCategory(current.weather_code);

  const onDebugClick = () => console.log('Current Weather', { ...current, category });

  return (
    <section className={styles.card} aria-label="Condições atuais" onClick={onDebugClick}>

      <div className={styles.cardTop}>

        <div className={styles.temp}>

          {getWeatherAnimatedIcon(current.weather_code, Boolean(current.is_day), 100, category)}

          <p className={styles.temperature}>
            {Math.round(current.temperature_2m)}
            <span className={styles.unit}>{units.temperature_2m}</span>
          </p>

          <div className={styles.minmax}>
            <p><span style={{ color: '#22577A' }}>↑</span> {Math.round(max)}ªC</p>
            <p><span style={{ color: '#611531' }}>↓</span> {Math.round(min)}ªC</p>
          </div>

        </div>

        <div className={styles.feels}>
          <p>
            FEELS <span>{Math.round(current.apparent_temperature)} {units.apparent_temperature}</span>
          </p>
          <p>
            PREC. <span>{Math.round(current.precipitation)} {units.precipitation}</span>
          </p>
        </div>
      </div>

    </section>
  );
};
