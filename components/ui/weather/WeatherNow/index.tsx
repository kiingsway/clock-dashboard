import { useMemo } from "react";
import styles from "./WeatherNow.module.scss";
import { useTranslation } from "react-i18next";

export interface WeatherNowProps {
  /** Current temperature, in the app's active unit */
  temperature: number;
  /** "Feels like" temperature */
  feelsLike: number;
  /** Today's max temperature */
  maxTemp: number;
  /** Today's min temperature */
  minTemp: number;
  /** Unit symbol, e.g. "C" or "F" */
  unit?: string;
  /** Meteocons (or similar) icon element for the current condition */
  icon?: React.ReactNode;
}

export function WeatherNow({
  temperature,
  feelsLike,
  maxTemp,
  minTemp,
  unit = "C",
  icon,
}: WeatherNowProps) {
  const { t } = useTranslation();
  const r = (n: number) => Math.round(n);

  // Where the current temp sits between today's min/max, clamped 0–100.
  const rangePosition = useMemo(() => {
    if ((maxTemp === minTemp) || (maxTemp === -999 || minTemp === -999)) return 50;
    const pct = ((r(temperature) - minTemp) / (maxTemp - minTemp)) * 100;
    return Math.min(100, Math.max(0, pct));
  }, [temperature, minTemp, maxTemp]);

  const hasNoTemp = temperature === -999;
  const hasNoFLike = feelsLike === -999;
  const noMaxTemp = maxTemp === -999;
  const noMinTemp = minTemp === -999;

  const temp = hasNoTemp ? '-' : r(temperature);
  const feelsLikeTemp = hasNoFLike ? '-' : `${r(feelsLike)}°`;
  const max = noMaxTemp ? '-' : `${r(maxTemp)}°`;
  const min = noMinTemp ? '-' : `${r(minTemp)}°`;

  console.log({ feelsLike: r(feelsLike), temp });

  const hideFeelsLike = r(feelsLike) === temp;

  return (
    <div className={styles.root}>
      {icon && <div className={styles.icon}>{icon}</div>}

      <div className={styles.tempRow}>
        <span className={styles.temp}>{temp}</span>
        {!hasNoTemp && <span className={styles.unit}>{unit}</span>}
      </div>

      {!hideFeelsLike && <div className={styles.feelsLike}>
        {t('feelsLike')} <span className={styles.feelsLikeValue}>{feelsLikeTemp}</span>
      </div>}

      <div className={styles.rangeCard}>
        <span className={styles.rangeMin}>{r(temperature) === minTemp ? t('min').toUpperCase() : min}</span>
        <div className={styles.rangeTrack}>
          <div className={styles.rangeDot} style={{ left: `${rangePosition}%` }} />
        </div>
        <span className={styles.rangeMax}>{r(temperature) === maxTemp ? t('max').toUpperCase() : max}</span>
      </div>
    </div>
  );
}