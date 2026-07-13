
import { IWeather, IWeatherCurrent, IWeatherUnits, SupportedLocale } from "@/types/weather.types";
import styles from "./CurrentWeather.module.css";
import { getWeatherCategory, getWeatherAnimatedIcon, getSunIcon } from "@/utils/weatherIcons";
import { formatClockTime, getSunWindow } from "@/utils/formatters";
import { CSSProperties } from "react";
import { useTranslation } from "react-i18next";

export interface CurrentWeatherProps {
  weather: IWeather | undefined
  loading: boolean
  error: any
}

/**
 * The hero section: an ambient glow halo behind the animated weather icon,
 * the current temperature, feels-like, a compact max/min + precipitation
 * row, and a sunrise→sunset track with a marker for how far today has
 * gotten. Values and units are rendered exactly as given — no conversion
 * happens in this component.
 */
export function CurrentWeather({ weather, loading, error }: CurrentWeatherProps) {
  const { t } = useTranslation();

  const current = weather?.current ?? {
    temperature_2m: 0,
    apparent_temperature: 0,
    precipitation: 0,
    weather_code: loading ? -2 : -1,
    is_day: 1,
    time: new Date().toISOString(),
  };

  const currentUnits = weather?.current_units ?? {
    temperature_2m: "°C",
    precipitation: "mm",
  };

  const daily = weather?.daily ?? {
    sunrise: [new Date().toISOString()],
    sunset: [new Date().toISOString()],
    temperature_2m_max: [0],
    temperature_2m_min: [0],
  };

  const timezone = weather?.timezone ?? "UTC";

  const isDay = current.is_day !== 0;
  const category = getWeatherCategory(current.weather_code);

  const tempUnit = currentUnits.temperature_2m;
  const precipUnit = currentUnits.precipitation;
  const hasPrecipitation = current.precipitation > 0;

  const sunWindow = getSunWindow(current.time, daily.sunrise, daily.sunset);
  const startLabel = formatClockTime(sunWindow.start, timezone);
  const endLabel = formatClockTime(sunWindow.end, timezone);

  const sunTrackColor = isDay ? "#F4B860" : "#2944bd";
  const sunTrackStyle = {
    "--wc-accent": sunTrackColor,
  } as CSSProperties;

  const todayMax = daily.temperature_2m_max[0] ?? current.temperature_2m;
  const todayMin = daily.temperature_2m_min[0] ?? current.temperature_2m;

  const weatherIcon = getWeatherAnimatedIcon(current.weather_code, isDay, 108, category);

  return (
    <section className={styles.current} aria-label="Clima atual">
      <div className={styles.iconStage}>
        <div className={styles.glow} aria-hidden="true" />
        <div className={styles.icon}>{weatherIcon}</div>
      </div>

      <p className={styles.temp}>
        {weather?.current ? (
          <>
            {Math.round(current.temperature_2m)}
            <span className={styles.tempUnit}>{tempUnit}</span>
          </>
        ) : '-'}
      </p>

      <p className={styles.feelsLike}>
        {weather?.current ? (
          <>
            {t('feelsLike')} {Math.round(current.apparent_temperature)}
            {tempUnit}
          </>
        ) : '-'}
      </p>

      <dl className={styles.statRow}>
        {weather?.current ? (
          <>
            <div className={styles.stat}>
              <dt>{t('maxMin')}</dt>
              <dd>
                {Math.round(todayMax)}° / {Math.round(todayMin)}°
              </dd>
            </div>
            <div className={styles.statDivider} aria-hidden="true" />
            <div className={styles.stat}>
              <dt>{t('precipitation')}</dt>
              <dd>{hasPrecipitation ? `${current.precipitation}${precipUnit}` : t('noPrecipitation')}</dd>
            </div>
          </>
        ) : (
          <>
            <div className={styles.stat}>
              <dt>{t('status')}</dt>
              <dd style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                {loading && <>Loading... {error && <><br /><br /></>}</>}{JSON.stringify(error)}
              </dd>
            </div>
          </>
        )}
      </dl>

      {weather?.current && (
        <div className={styles.sunArc} aria-label={`${t(sunWindow.startKind)} ${startLabel}, ${t(sunWindow.endKind)} ${endLabel}`}>
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
      )}
    </section>
  );
}