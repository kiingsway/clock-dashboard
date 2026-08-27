import { useMemo } from "react";
import styles from "./WeatherNow.module.scss";
import { useTranslation } from "react-i18next";
import { useAppSettings } from "@/contexts/AppSettingsContext";
import MinMaxProgress from "./MinMaxProgress";

const r = (n: number) => Math.round(n);

interface Props {
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
}: Props) {
  const { t } = useTranslation();
  const { get: { showFeelsLikeWhenEqual } } = useAppSettings();

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

  const hideFeelsLike = !showFeelsLikeWhenEqual && r(feelsLike) === temp;

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

      <MinMaxProgress
        temp={hasNoTemp ? undefined : r(temperature)}
        min={noMinTemp ? undefined : minTemp}
        max={noMaxTemp ? undefined : maxTemp}
        unit="º"
        progress={rangePosition}
      />

    </div>
  );
}