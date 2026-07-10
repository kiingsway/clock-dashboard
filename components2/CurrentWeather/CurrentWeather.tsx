
import { IWeatherCurrent, IWeatherUnits, SupportedLocale } from "@/types2/weather.types";
import styles from "./CurrentWeather.module.css";
import { getWeatherCategory, getWeatherAnimatedIcon, getSunIcon } from "@/utils/weatherIcons";
import { formatClockTime, getSunProgress } from "@/utils/formatters";
import { getDictionary } from "@/utils/i18n";

export interface CurrentWeatherProps {
  current: IWeatherCurrent;
  currentUnits: IWeatherUnits;
  /** Today's high, taken from `daily.temperature_2m_max[0]`. */
  todayMax: number;
  /** Today's low, taken from `daily.temperature_2m_min[0]`. */
  todayMin: number;
  /** Today's sunrise, taken from `daily.sunrise[0]` (ISO 8601). */
  sunrise: string;
  /** Today's sunset, taken from `daily.sunset[0]` (ISO 8601). */
  sunset: string;
  locale: SupportedLocale;
  timeZone?: string;
}

/**
 * The hero section: an ambient glow halo behind the animated weather icon,
 * the current temperature, feels-like, a compact max/min + precipitation
 * row, and a sunrise→sunset track with a marker for how far today has
 * gotten. Values and units are rendered exactly as given — no conversion
 * happens in this component.
 */
export function CurrentWeather({
  current,
  currentUnits,
  todayMax,
  todayMin,
  sunrise,
  sunset,
  locale,
  timeZone,
}: CurrentWeatherProps) {
  const t = getDictionary(locale);
  const isDay = current.is_day !== 0;
  const category = getWeatherCategory(current.weather_code);

  const tempUnit = currentUnits.temperature_2m;
  const precipUnit = currentUnits.precipitation;
  const hasPrecipitation = current.precipitation > 0;
  const sunProgress = getSunProgress(current.time, sunrise, sunset);
  const sunriseLabel = formatClockTime(new Date(sunrise), timeZone);
  const sunsetLabel = formatClockTime(new Date(sunset), timeZone);

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
          <dt>{t.maxMin}</dt>
          <dd>
            {Math.round(todayMax)}° / {Math.round(todayMin)}°
          </dd>
        </div>
        <div className={styles.statDivider} aria-hidden="true" />
        <div className={styles.stat}>
          <dt>{t.precipitation}</dt>
          <dd>{hasPrecipitation ? `${current.precipitation}${precipUnit}` : t.noPrecipitation}</dd>
        </div>
      </dl>

      <div className={styles.sunArc} aria-label={`${t.sunrise} ${sunriseLabel}, ${t.sunset} ${sunsetLabel}`}>
        <div className={styles.sunPoint}>
          {getSunIcon("sunrise", 18)}
          <span>{sunriseLabel}</span>
        </div>

        <div className={styles.sunTrack} aria-hidden="true">
          <div className={styles.sunTrackFill} style={{ width: `${sunProgress * 100}%` }} />
          <div className={styles.sunMarker} style={{ left: `${sunProgress * 100}%` }} />
        </div>

        <div className={styles.sunPoint}>
          {getSunIcon("sunset", 18)}
          <span>{sunsetLabel}</span>
        </div>
      </div>
    </section>
  );
}