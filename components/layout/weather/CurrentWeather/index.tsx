import { IWeather, WeatherCategoryName } from "@/types/weather.types";
import styles from './CurrentWeather.module.css';
import CurrentWeatherIcon from "@/components/ui/weather/CurrentWeatherIcon";
import WeatherAlerts from "@/components/layout/weather/WeatherAlerts";
import { useNow } from "@/contexts/NowContext";
import { UseWeatherAlerts } from "@/hooks/useWeatherAlerts";
import { CSSProperties, JSX } from "react";
import { WeatherNow } from "@/components/ui/weather/WeatherNow";
import { ensureWeather } from "@/utils/weather/ensureWeather";
import PrecipitationChart from "@/components/ui/weather/PrecipitationChart";
import ErrorBoundary from "@/components/ui/ErrorBoundary";
import EventProgress from "@/components/ui/weather/EventProgress";

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
export function CurrentWeather({ weather, loading, alerts, isFocused }: Props): JSX.Element {
  const { now } = useNow();

  const {
    current, currentUnits, isDay,
    tempMin, tempMax, sunWindow
  } = ensureWeather(weather, now, loading);

  const onDebugClick = (): void => console.info('Current Weather:', { weather, sunWindow });

  const icons = (() => {
    let rise: WeatherCategoryName = 'error';
    let set: WeatherCategoryName = 'error';

    if (sunWindow) {
      rise = sunWindow.startKind;
      set = sunWindow.endKind;
    }

    if (loading) {
      rise = 'loading';
      set = 'loading';
    }

    return { rise, set };
  })();

  return (
    <ErrorBoundary>
      <section
        style={{ '--is-focused': +isFocused } as CSSProperties}
        className={styles.current}
        aria-label="Clima atual"
        onDoubleClick={onDebugClick}>
          
        <CurrentWeatherIcon
          weatherCode={current.weather_code}
          isDay={isDay}
          sunWindow={sunWindow}
          weather={weather}
        />

        <WeatherNow
          temperature={current.temperature_2m}
          feelsLike={current.apparent_temperature}
          maxTemp={Math.round(tempMax)}
          minTemp={Math.round(tempMin)}
          unit={currentUnits.temperature_2m}
        />

        {weather && <PrecipitationChart weather={weather} />}

        <WeatherAlerts alerts={alerts} />

        <EventProgress
          start={sunWindow?.start}
          end={sunWindow?.end}
          startIcon={{ category: icons.rise, size: isFocused ? 50 : 20 }}
          endIcon={{ category: icons.set, size: isFocused ? 50 : 20 }}
          hideDate
        />

      </section>
    </ErrorBoundary>
  );
}