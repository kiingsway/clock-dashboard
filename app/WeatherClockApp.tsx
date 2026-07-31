import { SupportedLocale } from "@/types/weather.types";
import "../styles/tokens.css";
import styles from "./WeatherClockApp.module.css";
import { CurrentWeather } from "@/components/CurrentWeather/CurrentWeather";
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
import useWeatherAlerts from "@/hooks/useWeatherAlerts";
import WeatherWidgets from "@/components/WeatherWidgets";
import useBoolean from "@/hooks/useBoolean";

/**
 * Mobile, always-dark clock + weather screen. Designed to be read at a
 * glance from ~30cm, in a dark room, without hurting your eyes: no pure
 * white or pure black, and the only animation is a slow, dim glow behind
 * the weather icon whose color follows the current sky condition.
 */
export function WeatherClockApp(): JSX.Element {
  const appSettings = useAppSettings();
  const { i18n: { language: locale } } = useTranslation();
  const { data, isLoading, error: weatherError } = useWeather(appSettings.weatherLocation);
  const { alerts, error: alertsError } = useWeatherAlerts(appSettings.weatherLocation);

  const [focus, { toggle: toggleFocus }] = useBoolean()

  useAutoScrollToTop(focus ? 12000 : 60000);


  return (
    <div
      className={classNames(styles.root, "weather-clock-root")}
      style={{ ["--wc-accent" as string]: data.accent }}
    >
      <div className={classNames(styles.group, { [styles.focus]: focus })}>
        <Clock timezone={appSettings.location} onClockClick={toggleFocus} />

        <LocationBadge settings={appSettings} updatedAt={data.weather?.current.time} />

        <CurrentWeather
          weather={data.weather}
          alerts={alerts}
          locale={locale}
          loading={isLoading}
          error={weatherError || alertsError} />
      </div>

      {data.weather && (
        <>
          <HourlyForecast weather={data.weather} locale={locale} />

          <DailyForecast weather={data.weather} locale={locale} />
        </>
      )}

      <WeatherWidgets data={data} />

    </div>
  );
}


