
import { IDaily, IWeather, IWeatherAlert, IWeatherCurrent, IWeatherUnits, SupportedLocale } from "@/types/weather.types";
import styles from "./CurrentWeather.module.css";
import { splitCamelCase } from "@/utils/formatters";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import getWeatherAnimatedIcon from "@/utils/weatherIcons/getWeatherAnimatedIcon";
import SunProgress from "./SunProgress";
import { DateTime } from "luxon";
import { WeatherAlertCard } from "../WeatherAlertCard/WeatherAlertCard";
import WeatherAlerts from "../WeatherAlerts";
import getMoonPhase from "@/utils/weatherIcons/getMoonPhase";
import WeatherIcon from "../WeatherIcon";
import getWeatherCategory from "@/utils/weatherIcons/getWeatherCategory";

type WeatherInfoMode = "precipitation" | "weather" | "moon";

export interface CurrentWeatherProps {
  weather: IWeather | undefined
  loading: boolean
  error: any
  locale: SupportedLocale
  alerts: IWeatherAlert[]
}

/**
 * The hero section: an ambient glow halo behind the animated weather icon,
 * the current temperature, feels-like, a compact max/min + precipitation
 * row, and a sunrise→sunset track with a marker for how far today has
 * gotten. Values and units are rendered exactly as given — no conversion
 * happens in this component.
 */
export function CurrentWeather({ weather, locale, alerts, loading, error }: CurrentWeatherProps) {
  const { t } = useTranslation();
  const [lat, lon] = [weather?.latitude, weather?.longitude];
  const [moonPhase, setMoonPhase] = useState(() => getMoonPhase({ size: 130, lat, lon }));

  useEffect(() => {
    const interval = setInterval(() => {
      setMoonPhase(getMoonPhase({ size: 130, lat, lon }));
    }, 10 * 60 * 1000); // atualiza a cada 10min

    return () => clearInterval(interval);
  }, []);

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
        // case "precipitation":
        // return "moon";
        default:
          return "weather";
      }
    });
  };

  const onDebugClick = (): void => console.info('Current Weather:', weather)

  return (
    <section className={styles.current} aria-label="Clima atual" onDoubleClick={onDebugClick}>
      <div className={styles.iconStage}>
        <div className={styles.glow} aria-hidden="true" />

        <WeatherIcon
          weatherCode={current.weather_code}
          date={DateTime.now()}
          isDay={isDay}
          lat={lat}
          lon={lon}
          size={100}
        />
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