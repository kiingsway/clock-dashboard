import { useFocusMode } from "@/hooks/useFocusMode";
import { UseAppSettings } from "@/types/app.types";
import classNames from "classnames";
import { useTranslation } from "react-i18next";
import styles from './WeatherTab.module.scss';
import { useWeather } from "@/hooks/useWeather";
import { DateHeader } from "@/components/layout/weather/DateHeader";
import Location from '@/components/layout/weather/Location';
import { CurrentWeather } from "@/components/layout/weather/CurrentWeather";
import useWeatherAlerts from "@/hooks/useWeatherAlerts";
import { HourlyForecast } from "@/components/layout/weather/HourlyForecast";
import { DailyForecast } from "@/components/layout/weather/DailyForecast";
import WeatherWidgets from "@/components/layout/weather/WeatherWidgets";

interface Props {
  appSettings: UseAppSettings;
}

export default function WeatherTab({ appSettings }: Props) {
  const { i18n: { language: locale } } = useTranslation();
  const { focus, toggleFocus } = useFocusMode({ onFocus: 12000, offFocus: 60000 });

  const { data, isLoading, error: weatherError } = useWeather(appSettings.weatherLocation, locale);
  const { accent, category, weather } = data;

  const { alerts, error: alertsError } = useWeatherAlerts(appSettings);
  return (

    <div style={{ ["--wc-accent" as string]: accent }}>
      <div className={classNames(styles.group, { [styles.focus]: focus })}>
        <DateHeader timezone={appSettings.get.location} onClockClick={toggleFocus} />

        <Location settings={appSettings} updatedAt={weather?.current.time} />

        <CurrentWeather
          weather={weather}
          weatherCategory={category}
          alerts={alerts}
          locale={locale}
          loading={isLoading}
          error={weatherError || alertsError}
        />
      </div>

      {weather && (
        <>
          <HourlyForecast weather={weather} locale={locale} />

          <DailyForecast weather={weather} locale={locale} />

          <WeatherWidgets data={data} />
        </>
      )}
    </div>
  )
}