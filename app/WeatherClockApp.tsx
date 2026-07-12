import { IWeather, SupportedLocale } from "@/types/weather.types";
import "../styles/tokens.css";
import styles from "./WeatherClockApp.module.css";
import { CurrentWeather } from "@/components/CurrentWeather/CurrentWeather";
import { getAccentColor, getWeatherCategory } from "@/utils/weatherIcons";
import { Clock } from "@/components/Clock/Clock";
import { HourlyForecast } from "@/components/HourlyForecast/HourlyForecast";
import { DailyForecast } from "@/components/DailyForecast/DailyForecast";
import { useWeather } from "@/hooks/useWeather";
import { type JSX } from "react";
import classNames from "classnames";
import { useAppSettings } from "@/hooks/useAppSettings";
import { useTranslation } from "react-i18next";
import { LocationBadge } from "@/components/LocationBadge/LocationBadge";
import { useAutoScrollToTop } from "@/hooks/useAutoScrollToTop";

/**
 * Mobile, always-dark clock + weather screen. Designed to be read at a
 * glance from ~30cm, in a dark room, without hurting your eyes: no pure
 * white or pure black, and the only animation is a slow, dim glow behind
 * the weather icon whose color follows the current sky condition.
 */
export function WeatherClockApp() {
  const appSettings = useAppSettings();
  const { i18n } = useTranslation();
  const { weather, isLoading, error } = useWeather(appSettings.weatherLocation.lat, appSettings.weatherLocation.lon);
  useAutoScrollToTop(30000);

  const accent = getAccent(weather);

  const WithWeather = ({ weather }: { weather: IWeather }): JSX.Element => {

    const { current, hourly, hourly_units, daily, daily_units, timezone } = weather;

    return (
      <>
        <HourlyForecast
          hourly={hourly}
          hourlyUnits={hourly_units}
          currentTime={current.time}
          timeZone={timezone}
          sunrises={daily.sunrise}
          sunsets={daily.sunset}
          locale={i18n.language as SupportedLocale}
        />

        <DailyForecast daily={daily} dailyUnits={daily_units} timeZone={timezone} locale={i18n.language as SupportedLocale} />
      </>
    )
  }

  return (
    <div
      className={classNames(styles.root, "weather-clock-root")}
      style={{ ["--wc-accent" as string]: accent }}
    >
      <Clock timezone={appSettings.location} />
      <LocationBadge settings={appSettings} timezone={appSettings.location} updatedAt={weather?.current.time} />
      <CurrentWeather weather={weather} loading={isLoading} error={error} />
      {weather && <WithWeather weather={weather} />}
    </div>
  );
}


function getAccent(weather?: IWeather): string {
  if (!weather) return "#6b7280";
  const category = getWeatherCategory(weather.current.weather_code);
  const isDay = weather.current.is_day !== 0;
  return getAccentColor(category, isDay);
}