import { IWeather } from "@/types/weather.types";
import styles from './CurrentWeather.module.css';
import CurrentWeatherIcon from "@/components/ui/weather/CurrentWeatherIcon";
import WeatherAlerts from "@/components/layout/weather/WeatherAlerts";
import { useNow } from "@/contexts/NowContext";
import { UseWeatherAlerts } from "@/hooks/useWeatherAlerts";
import { JSX } from "react";
import { WeatherNow } from "@/components/ui/weather/WeatherNow";
import { ensureWeather } from "@/utils/weather/ensureWeather";
import PrecipitationChart from "@/components/ui/weather/PrecipitationChart";
import ErrorBoundary from "@/components/ui/ErrorBoundary";
import SunProgressBar from "@/components/ui/weather/SunProgressBar";
import Alert from "@/components/ui/Alert";

interface Props {
  weather: IWeather | undefined;
  loading: boolean;
  error: unknown;
  alerts: UseWeatherAlerts['data'];
  isFocused: boolean
}

/**
 * The hero section: an ambient glow halo behind the animated weather icon,
 * the current temperature, feels-like, a compact max/min + precipitation
 * row, and a sunrise→sunset track with a marker for how far today has
 * gotten. Values and units are rendered exactly as given — no conversion
 * happens in this component.
 */
export default function CurrentWeather({ weather, loading, alerts, isFocused, error }: Props): JSX.Element {
  const { now } = useNow();

  const {
    current, currentUnits, isDay,
    tempMin, tempMax, sunWindow
  } = ensureWeather(weather, now, loading);

  const onDebugClick = (): void => console.info('Current Weather:', { weather, sunWindow });;

  return (
    <ErrorBoundary>
      <section
        className={styles.current}
        aria-label="Clima atual"
        onDoubleClick={onDebugClick}>

        <CurrentWeatherIcon
          weatherCode={current.weather_code}
          isDay={isDay}
          sunWindow={sunWindow}
          weather={weather}
        />

        {Boolean(error) ? <Alert
          style={{ width: '100%' }}
          title="Weather Error"
          message={String(error)}
          variant="danger"
        /> : <WeatherNow
          temperature={current.temperature_2m}
          feelsLike={current.apparent_temperature}
          maxTemp={Math.round(tempMax)}
          minTemp={Math.round(tempMin)}
          unit={currentUnits.temperature_2m}
        />}

        {weather && <PrecipitationChart weather={weather} />}

        <WeatherAlerts alerts={alerts} />

        <SunProgressBar
          sunWindow={sunWindow}
          isFocused={isFocused}
          loading={loading}
          includeNight
          disableEffects={!isDay || current.weather_code < 0 || current.weather_code >= 2}
        />

      </section>
    </ErrorBoundary>
  );
}