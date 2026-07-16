
import { IDaily, IWeather, IWeatherCurrent, IWeatherUnits } from "@/types/weather.types";
import styles from "./CurrentWeather.module.css";
import { splitCamelCase } from "@/utils/formatters";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import getWeatherAnimatedIcon from "@/utils/weatherIcons/getWeatherAnimatedIcon";
import SunProgress from "./SunProgress";
import { DateTime } from "luxon";

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
  const [showWeatherName, setWeatherName] = useState(false)
  const toggleWeatherName = (): void => setWeatherName(prev => !prev);

  const current = weather?.current ?? {
    temperature_2m: 0,
    apparent_temperature: 0,
    precipitation: 0,
    weather_code: loading ? -2 : -1,
    is_day: 1,
    time: DateTime.now().toISO(),
  } as IWeatherCurrent;

  const currentUnits = weather?.current_units ?? {
    temperature_2m: "°C",
    precipitation: "mm",
  } as IWeatherUnits;

  const daily = weather?.daily ?? {
    sunrise: [DateTime.now().toISO()],
    sunset: [DateTime.now().toISO()],
    temperature_2m_max: [0],
    temperature_2m_min: [0],
  } as IDaily;

  const timezone = weather?.timezone ?? "UTC";

  const isDay = current.is_day !== 0;

  const tempUnit = currentUnits.temperature_2m;
  const precipUnit = currentUnits.precipitation;
  const hasPrecipitation = current.precipitation > 0;


  const todayMax = daily.temperature_2m_max[0] ?? current.temperature_2m;
  const todayMin = daily.temperature_2m_min[0] ?? current.temperature_2m;

  const weatherIcon = getWeatherAnimatedIcon(current.weather_code, isDay, 130);

  const onDebugClick = (): void => console.info('Current Weather:', weather)

  return (
    <section className={styles.current} aria-label="Clima atual" onDoubleClick={onDebugClick}>
      <div className={styles.iconStage}>
        <div className={styles.glow} aria-hidden="true" />
        <div className={styles.icon}>{weatherIcon.img}</div>
      </div>

      <div>
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
      </div>

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
            <div className={styles.stat} id="prec-weather" onClick={toggleWeatherName}>
              {showWeatherName ? (
                <>
                  <dt>{t('weather')}</dt>
                  <dd>{splitCamelCase(weatherIcon.category)} <small title="Weather Code (WMO)">(#{weather.current.weather_code})</small></dd>
                </>
              ) : (
                <>
                  <dt>{t('precipitation')}</dt>
                  <dd>{hasPrecipitation ? `${current.precipitation}${precipUnit}` : t('noPrecipitation')}</dd>
                </>
              )}
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

      <SunProgress
        currentWeather={current}
        dailyWeather={daily}
        timezone={timezone} />

    </section>
  );
}