
import { IDaily, IWeather, IWeatherAlert, IWeatherCurrent, IWeatherUnits, SupportedLocale } from "@/types/weather.types";
import styles from "./CurrentWeather.module.css";
import { getSunWindow, isXMinBefore, splitCamelCase } from "@/utils/formatters";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import SunProgress from "./SunProgress";
import { DateTime } from "luxon";
import WeatherAlerts from "../WeatherAlerts";
import WeatherIcon from "../WeatherIcon";
import getWeatherCategory from "@/utils/weatherIcons/getWeatherCategory";

type WeatherInfoMode = "precipitation" | "weather";

interface Props {
  weather: IWeather | undefined
  loading: boolean
  error: any
  locale: string
  alerts: IWeatherAlert[]
}

/**
 * The hero section: an ambient glow halo behind the animated weather icon,
 * the current temperature, feels-like, a compact max/min + precipitation
 * row, and a sunrise→sunset track with a marker for how far today has
 * gotten. Values and units are rendered exactly as given — no conversion
 * happens in this component.
 */
export function CurrentWeather({ weather, locale, alerts, loading, error }: Props) {
  const { t } = useTranslation();

  const now = DateTime.now();

  const current = weather?.current ?? {
    temperature_2m: 0,
    apparent_temperature: 0,
    precipitation: 0,
    weather_code: loading ? -2 : -1,
    is_day: 1,
    time: now.toISO(),
  } as IWeatherCurrent;

  const currentUnits = weather?.current_units ?? {
    temperature_2m: "°C",
    precipitation: "mm",
  } as IWeatherUnits;

  const daily = weather?.daily ?? {
    sunrise: [now.toISO()],
    sunset: [now.toISO()],
    temperature_2m_max: [0],
    temperature_2m_min: [0],
  } as IDaily;

  const timezone = weather?.timezone ?? "UTC";

  const isDay = current.is_day !== 0;

  const todayMax = daily.temperature_2m_max[0] ?? current.temperature_2m;
  const todayMin = daily.temperature_2m_min[0] ?? current.temperature_2m;

  const weatherCategory = getWeatherCategory(current.weather_code)

  const tempUnit = currentUnits.temperature_2m;
  const precipUnit = currentUnits.precipitation;
  const hasPrecipitation = current.precipitation > 0;

  const [weatherInfoMode, setWeatherInfoMode] = useState<WeatherInfoMode>(hasPrecipitation ? "precipitation" : "weather");

  const toggleWeatherInfo = (): void => {
    setWeatherInfoMode(prev => {
      switch (prev) {
        case "weather":
          return "precipitation";
        default:
          return "weather";
      }
    });
  };

  const sunWindow = getSunWindow(current.time, daily.sunrise, daily.sunset, timezone);
  const isBeforeSunRiseSet = isXMinBefore(now, sunWindow.end, 30);

  const onDebugClick = (): void => console.info('Current Weather:', weather)

  return (
    <section className={styles.current} aria-label="Clima atual" onDoubleClick={onDebugClick}>

      <div className={styles.iconStage}>
        <div className={styles.glow} aria-hidden="true" />

        {weatherCategory === 'clear' && isBeforeSunRiseSet ? (
          <WeatherIcon
            category={sunWindow.endKind}
            size={160}
          />
        ) : (
          <WeatherIcon
            weatherCode={current.weather_code}
            date={DateTime.now()}
            isDay={isDay}
            lat={weather?.latitude}
            lon={weather?.longitude}
            size={160}
          />
        )}
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
              {t('feelsLike')} <span>{Math.round(current.apparent_temperature)}</span>
              <small>{tempUnit}</small>
            </>
          ) : '-'}
        </p>
      </div>

      <WeatherAlerts alerts={alerts} locale={locale} />

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
            <div className={styles.stat} id="prec-weather" onClick={toggleWeatherInfo}>
              {weatherInfoMode === 'weather' ? (
                <>
                  <dt>{t('weather')}</dt>
                  <dd title={`Weather Code (WMO): #${weather.current.weather_code}`}>{splitCamelCase(weatherCategory)}</dd>
                </>
              ) : weatherInfoMode === 'precipitation' ? (
                <>
                  <dt>{t('precipitation')}</dt>
                  <dd>{hasPrecipitation ? `${current.precipitation}${precipUnit}` : t('noPrecipitation')}</dd>
                </>
              ) : <></>}
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