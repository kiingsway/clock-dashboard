import { IDaily, IWeather, IWeatherCurrent, IWeatherUnits } from "@/types/weather.types"
import { useTranslation } from "react-i18next"
import styles from './CurrentWeather.module.css'
import getWeatherCategory from "@/utils/weather/getWeatherCategory"
import { getSunWindow } from "@/utils/weather/getSunWindow"
import CurrentWeatherIcon from "@/components/ui/weather/CurrentWeatherIcon"
import CurrentFeelsLike from "@/components/ui/weather/CurrentFeelsLike"
import CurrentTemperature from "@/components/ui/weather/CurrentTemperature"
import WeatherAlerts from "@/components/layout/weather/WeatherAlerts"
import { getCurrentIndex } from "@/utils/formatters/getValueByArray"
import { useAutoToggle } from "@/hooks/useAutoToggle"
import SunProgressBar from "@/components/ui/weather/SunProgressBar"
import { useNow } from "@/contexts/NowContext"
import { UseWeatherAlerts } from "@/hooks/useWeatherAlerts"
import { JSX } from "react"
import InfoPill, { InfoPillProps } from "@/components/ui/weather/InfoPill"

interface Props {
  weather: IWeather | undefined
  loading: boolean
  error: unknown
  alerts: UseWeatherAlerts['data']
}

/**
 * The hero section: an ambient glow halo behind the animated weather icon,
 * the current temperature, feels-like, a compact max/min + precipitation
 * row, and a sunrise→sunset track with a marker for how far today has
 * gotten. Values and units are rendered exactly as given — no conversion
 * happens in this component.
 */
export function CurrentWeather({ weather, loading, error, alerts }: Props): JSX.Element {
  const { t } = useTranslation();
  const { now } = useNow();

  const timezone = weather?.timezone ?? "UTC";

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
    time: [now.toISO()],
    sunrise: [now.toISO()],
    sunset: [now.toISO()],
    temperature_2m_max: [0],
    temperature_2m_min: [0],
  } as IDaily;

  const isDay = current.is_day === 1;

  const todayIndex = getCurrentIndex({ date: now, time: daily.time });
  const todayMin = daily.temperature_2m_min[todayIndex];
  const todayMax = daily.temperature_2m_max[todayIndex];

  const weatherCategory = getWeatherCategory(current.weather_code)

  const precipUnit = currentUnits.precipitation;
  const hasPrecipitation = current.precipitation > 0;

  const [showPrecip, toggleWeatherInfoMode] = useAutoToggle({
    intervalMs: hasPrecipitation ? 4000 : 0,
    pauseDurationMs: 8000,
    initialValue: true
  });

  const sunWindow = getSunWindow({
    includeNight: true,
    sunriseTimes: daily.sunrise,
    sunsetTimes: daily.sunset,
    timezone,
    date: now,
  });

  const onDebugClick = (): void => console.info('Current Weather:', { weather, sunWindow });

  const infoPillProps = ((): InfoPillProps => {
    if (loading || error) return {
      info1: {
        label: t('status'),
        value: loading ? 'Loading...' : error ? String(error) : 'Unknwon status (no loading, no errors)'
      }
    }

    return {
      info1: {
        label: t('maxMin'),
        value: `${todayMax ? Math.round(todayMax) : '-'}° / ${todayMin ? Math.round(todayMin) : '-'}°`
      },
      info2: showPrecip ? {
        label: t('weather'),
        value: weatherCategory.title,
        onClick: () => toggleWeatherInfoMode()
      } : {
        label: t('precipitation'),
        value: hasPrecipitation ? `${current.precipitation}${precipUnit}` : t('noPrecipitation'),
        onClick: () => toggleWeatherInfoMode()
      }
    }
  })();

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

      <WeatherAlerts alerts={alerts} />

      <InfoPill {...infoPillProps} />

      {sunWindow && <SunProgressBar sunWindow={sunWindow} includeNight />}

    </section>
  );
}