import { IWeather, SupportedLocale } from "@/types/weather.types";
import "../styles/tokens.css";
import styles from "./WeatherClockApp.module.css";
import { CurrentWeather } from "@/components/CurrentWeather/CurrentWeather";
import { Clock } from "@/components/Clock/Clock";
import { HourlyForecast } from "@/components/HourlyForecast/HourlyForecast";
import { DailyForecast } from "@/components/DailyForecast/DailyForecast";
import { useWeather } from "@/hooks/useWeather";
import { useState, type JSX } from "react";
import classNames from "classnames";
import { useAppSettings } from "@/hooks/useAppSettings";
import { useTranslation } from "react-i18next";
import { LocationBadge } from "@/components/LocationBadge/LocationBadge";
import { useAutoScrollToTop } from "@/hooks/useAutoScrollToTop";
import getAccentColor, { getAccent } from "@/utils/weatherIcons/getAccentColor";
import getWeatherCategory from "@/utils/weatherIcons/getWeatherCategory";
import useWeatherAlerts from "@/hooks/useWeatherAlerts";

/**
 * Mobile, always-dark clock + weather screen. Designed to be read at a
 * glance from ~30cm, in a dark room, without hurting your eyes: no pure
 * white or pure black, and the only animation is a slow, dim glow behind
 * the weather icon whose color follows the current sky condition.
 */
export function WeatherClockApp() {
  const appSettings = useAppSettings();
  const { i18n } = useTranslation();
  const { weather, isLoading, error } = useWeather(appSettings.weatherLocation);
  const { alerts, isLoading: alertsLoading, error: alertsError } = useWeatherAlerts(appSettings.weatherLocation);
  useAutoScrollToTop(12000);

  console.log('Alerts:', { alerts, alertsLoading, alertsError })

  const [focus, setFocus] = useState(false)
  const toggleFocus = (): void => setFocus(prev => !prev)

  const locale = i18n.language as SupportedLocale;
  const accent = getAccent(weather?.current.weather_code, weather?.current.is_day);

  return (
    <div
      className={classNames(styles.root, "weather-clock-root")}
      style={{ ["--wc-accent" as string]: accent }}
    >
      <div className={classNames(styles.group, { [styles.focus]: focus })}>
        <Clock timezone={appSettings.location} onClockClick={toggleFocus} />

        <LocationBadge settings={appSettings} weather={weather} />

        <CurrentWeather
          weather={weather}
          alerts={alerts}
          locale={locale}
          loading={isLoading}
          error={error} />
      </div>

      {weather && (
        <>
          <HourlyForecast weather={weather} locale={locale} />

          <DailyForecast weather={weather} locale={locale} />
        </>
      )}
    </div>
  );
}


