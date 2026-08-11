import { IDaily, IWeather, IWeatherCurrent, IWeatherUnits, WeatherCategory } from "@/types/weather.types"
import { useTranslation } from "react-i18next"
import styles from './CurrentWeather.module.css'
import { DateTime } from "luxon"
import SunProgress from "./SunProgress"
import getWeatherCategory from "@/utils/weather/getWeatherCategory"
import { getSunWindow } from "@/utils/weather/getSunWindow"
import { IWeatherAlertCanada } from "@/types/weatherAlerts.types"
import CurrentWeatherIcon from "@/components/ui/weather/CurrentWeatherIcon"
import CurrentFeelsLike from "@/components/ui/weather/CurrentFeelsLike"
import CurrentTemperature from "@/components/ui/weather/CurrentTemperature"
import WeatherAlerts from "@/components/layout/weather/WeatherAlerts"
import { getDailyValue } from "@/utils/formatters/getValueByArray"
import { useAutoToggle } from "@/hooks/useAutoToggle"

interface Props {
  weather: IWeather | undefined
  loading: boolean
  error: unknown
  weatherCategory: WeatherCategory
  alerts: IWeatherAlertCanada[]
}

/**
 * The hero section: an ambient glow halo behind the animated weather icon,
 * the current temperature, feels-like, a compact max/min + precipitation
 * row, and a sunrise→sunset track with a marker for how far today has
 * gotten. Values and units are rendered exactly as given — no conversion
 * happens in this component.
 */
export function CurrentWeather({ weather, loading, error, alerts }: Props) {
  const { t, i18n: { language: locale } } = useTranslation();

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
  
  const todayMin = getDailyValue(daily.time, daily.temperature_2m_min, timezone);
  const todayMax = getDailyValue(daily.time, daily.temperature_2m_max, timezone);

  const weatherCategory = getWeatherCategory(current.weather_code)

  const precipUnit = currentUnits.precipitation;
  const hasPrecipitation = current.precipitation > 0;

  const [showPrecip, toggleWeatherInfoMode] = useAutoToggle({ intervalMs: hasPrecipitation ? 4000 : 0, pauseDurationMs: 8000 });

  const sunWindow = getSunWindow(daily.sunrise, daily.sunset, timezone);

  const onDebugClick = (): void => console.info('Current Weather:', weather)

  return (
    <section className={styles.current} aria-label="Clima atual" onDoubleClick={onDebugClick}>
      <CurrentWeatherIcon
        current={current}
        now={now.toJSDate()}
        isDay={isDay}
        sunWindow={sunWindow}
        weather={weather}
      />

      <div>
        <CurrentTemperature temp={current.temperature_2m} unit={weather?.current_units.temperature_2m || "ºC"} />
        <CurrentFeelsLike temp={current.apparent_temperature} unit={weather?.current_units.apparent_temperature || "ºC"} />
      </div>

      <WeatherAlerts alerts={alerts} locale={locale} />

      <dl className={styles.statRow}>
        {weather?.current ? (
          <>
            <div className={styles.stat}>
              <dt>{t('maxMin')}</dt>
              <dd>
                {todayMax ? Math.round(todayMax) : '-'}° / {todayMin ? Math.round(todayMin) : '-'}°
              </dd>
            </div>
            <div className={styles.statDivider} aria-hidden="true" />
            <div className={styles.stat} id="prec-weather" onClick={() => toggleWeatherInfoMode()}>
              {showPrecip ? (
                <>
                  <dt>{t('weather')}</dt>
                  <dd title={`Weather Code (WMO): #${weather.current.weather_code}`}>{weatherCategory.title}</dd>
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

      <SunProgress sunWindow={sunWindow} />

    </section>
  );
}
