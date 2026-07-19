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
import { getAccent } from "@/utils/weatherIcons/getAccentColor";
import useWeatherAlerts from "@/hooks/useWeatherAlerts";
import { DetailCard } from "@/components/DetailCard/DetailCard";
import getMoonPhase from "@/utils/weatherIcons/getMoonPhase";
import { DateTime } from "luxon";
import WeatherIcon, { WeatherIconImage } from "@/components/WeatherIcon";
import getWeatherIcon from "@/utils/weatherIcons/getWeatherIcon";
import { ICON_BASE_URI } from "@/utils/weatherIcons/iconFiles";
import getUVIcon from "@/utils/weatherIcons/getUVIcon";
import getWindInfo from "@/utils/weatherIcons/getWindInfo";
import getVisibilityInfo from "@/utils/getVisibilityInfo";

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

  const [focus, setFocus] = useState(false)
  const toggleFocus = (): void => setFocus(prev => !prev)

  useAutoScrollToTop(focus ? 12000 : 60000);

  const locale = i18n.language as SupportedLocale;
  const accent = getAccent(weather?.current.weather_code, weather?.current.is_day);

  const moonPhase = getMoonPhase({ lat: weather?.latitude, lon: weather?.longitude })
  const uvIcon = getUVIcon(weather);
  const windInfo = getWindInfo(weather);
  const weatherIcon = weather && getWeatherIcon({
    weatherCode: weather?.current.weather_code,
    date: DateTime.fromISO(weather.current.time),
    isDay: weather.current.is_day === 1,
    lat: weather.latitude,
    lon: weather.longitude,
  })

  const visibility = getVisibilityInfo(weather)

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

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <DetailCard
          title="Moon"
          description={`${moonPhase.title} (${(moonPhase.phase * 100).toFixed(2)}%)`}
          icon={weatherIcon && (
            <WeatherIconImage
              src={moonPhase.iconSrc}
              title={moonPhase.title}
              alt={moonPhase.title}
              size={120}
            />
          )}
        />
        <DetailCard
          title="UV Index"
          description={uvIcon?.desc}
          icon={uvIcon && (
            <WeatherIconImage
              src={uvIcon?.src}
              title={uvIcon?.alt}
              alt={uvIcon?.alt}
              size={120}
            />
          )} />

        <DetailCard
          title="Wind Gusts Now"
          textColor={windInfo?.hourly.gustsColor}
          bigText={`${windInfo?.hourly.gusts}km/h`}
          description={`Média de ${windInfo?.daily?.gusts}km/h no dia`}
        />
        <DetailCard
          title="Wind"
          description={`${windInfo?.hourly.desc} Sentido ${windInfo?.hourly.direction.name?.toLowerCase()}.`}
          icon={windInfo?.hourly.beaufortSrc && windInfo?.hourly.direction.src && (
            <>
              <WeatherIconImage
                src={windInfo.hourly.beaufortSrc}
                title={`Vento ${windInfo?.hourly.direction.name}`}
                alt={`Vento ${windInfo?.hourly.direction.name}`}
                size={80}
              />
              <WeatherIconImage
                src={windInfo?.hourly.direction.src}
                title={`Vento ${windInfo?.hourly.direction.name}`}
                alt={`Vento ${windInfo?.hourly.direction.name}`}
                size={80}
              />
            </>
          )}
        />

        <DetailCard
          title="Visibility"
          bigText={visibility?.title}
          textColor={visibility?.color}
          description={visibility?.desc}
        />
      </div>
    </div>
  );
}


