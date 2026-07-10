import { getWeatherCategory, getWeatherAnimatedIcon } from "@/utils/weatherIcons";
import { IWeatherCurrent, IWeatherUnits } from "@/types2/weather.types";
import { SupportedLocale } from "@/types2/weather.types";
import { getDictionary } from "@/utils/i18n";
import styles from "./CurrentWeather.module.css";

export interface CurrentWeatherProps {
  current: IWeatherCurrent;
  currentUnits: IWeatherUnits;
  /** Today's high, taken from `daily.temperature_2m_max[0]`. */
  todayMax: number;
  /** Today's low, taken from `daily.temperature_2m_min[0]`. */
  todayMin: number;
  locale: SupportedLocale;
}

/**
 * The hero section: an ambient glow halo behind the animated weather icon,
 * the current temperature, feels-like, and a compact stat row for today's
 * high / low / precipitation. Values and units are rendered exactly as
 * given — no conversion happens in this component.
 */
export function CurrentWeather({ current, currentUnits, todayMax, todayMin, locale }: CurrentWeatherProps) {
  const t = getDictionary(locale);
  const isDay = current.is_day !== 0;
  const category = getWeatherCategory(current.weather_code);

  const tempUnit = currentUnits.temperature_2m;
  const precipUnit = currentUnits.precipitation;
  const hasPrecipitation = current.precipitation > 0;

  return (
    <section className={styles.current} aria-label="Clima atual">
      <div className={styles.iconStage}>
        <div className={styles.glow} aria-hidden="true" />
        <div className={styles.icon}>{getWeatherAnimatedIcon(current.weather_code, isDay, 108, category)}</div>
      </div>

      <p className={styles.temp}>
        {Math.round(current.temperature_2m)}
        <span className={styles.tempUnit}>{tempUnit}</span>
      </p>

      <p className={styles.feelsLike}>
        {t.feelsLike} {Math.round(current.apparent_temperature)}
        {tempUnit}
      </p>

      <dl className={styles.statRow}>
        <div className={styles.stat}>
          <dt>{t.max}</dt>
          <dd>
            {Math.round(todayMax)}
            {tempUnit}
          </dd>
        </div>
        <div className={styles.statDivider} aria-hidden="true" />
        <div className={styles.stat}>
          <dt>{t.min}</dt>
          <dd>
            {Math.round(todayMin)}
            {tempUnit}
          </dd>
        </div>
        <div className={styles.statDivider} aria-hidden="true" />
        <div className={styles.stat}>
          <dt>{t.precipitation}</dt>
          <dd>{hasPrecipitation ? `${current.precipitation}${precipUnit}` : t.noPrecipitation}</dd>
        </div>
      </dl>
    </section>
  );
}
