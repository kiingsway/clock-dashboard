
import { IWeatherCurrent, IWeatherUnits, SupportedLocale } from "@/types2/weather.types";
import styles from "./CurrentWeather.module.css";
import { getWeatherCategory, getWeatherAnimatedIcon, getSunIcon } from "@/utils/weatherIcons";
import { formatClockTime, getSunWindow } from "@/utils/formatters";
import { getDictionary } from "@/utils/i18n";
import { CSSProperties } from "react";

export interface CurrentWeatherProps {
  current: IWeatherCurrent;
  currentUnits: IWeatherUnits;
  /** Today's high, taken from `daily.temperature_2m_max[0]`. */
  todayMax: number;
  /** Today's low, taken from `daily.temperature_2m_min[0]`. */
  todayMin: number;
  /** Today's sunrise, taken from `daily.sunrise[0]` (ISO 8601). */
  sunrises: string[];
  /** Today's sunset, taken from `daily.sunset[0]` (ISO 8601). */
  sunsets: string[];
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
  sunrises,
  sunsets,
  locale,
  timeZone,
}: CurrentWeatherProps) {
  const t = getDictionary(locale);
  const isDay = current.is_day !== 0;
  const category = getWeatherCategory(current.weather_code);

  const tempUnit = currentUnits.temperature_2m;
  const precipUnit = currentUnits.precipitation;
  const hasPrecipitation = current.precipitation > 0;

  const sunWindow = getSunWindow(current.time, sunrises, sunsets);
  const startLabel = formatClockTime(sunWindow.start, timeZone);
  const endLabel = formatClockTime(sunWindow.end, timeZone);

  const sunTrackColor = isDay ? "#F4B860" : "#2944bd";
  const sunTrackStyle = {
    "--wc-accent": sunTrackColor,
  } as CSSProperties;

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

      <div className={styles.sunArc} aria-label={`${t[sunWindow.startKind]} ${startLabel}, ${t[sunWindow.endKind]} ${endLabel}`}>
        <div className={styles.sunPoint}>
          {getSunIcon(sunWindow.startKind, 18)}
          <span>{startLabel}</span>
        </div>

        <div
          className={styles.sunTrack}
          aria-hidden="true"
          style={sunTrackStyle}
        >
          <div className={styles.sunTrackFill} style={{ width: `${sunWindow.progress * 100}%` }} />
          <div className={styles.sunMarker} style={{ left: `${sunWindow.progress * 100}%` }} />
        </div>

        <div className={styles.sunPoint}>
          {getSunIcon(sunWindow.endKind, 18)}
          <span>{endLabel}</span>
        </div>
      </div>
    </section>
  );
}