import { useFocusMode } from "@/hooks/useFocusMode";
import classNames from "classnames";
import styles from './WeatherTab.module.scss';
import { useWeather } from "@/hooks/useWeather";
import { DateHeader } from "@/components/layout/weather/DateHeader";
import Location from '@/components/layout/weather/Location';
import { CurrentWeather } from "@/components/layout/weather/CurrentWeather";
import useWeatherAlerts from "@/hooks/useWeatherAlerts";
import { HourlyForecast } from "@/components/layout/weather/HourlyForecast";
import { DailyForecast } from "@/components/layout/weather/DailyForecast";
import WeatherWidgets from "@/components/layout/weather/WeatherWidgets";
import { SettingsSheet } from "@/components/overlays/SettingsSheet";
import useBoolean from "@/hooks/useBoolean";
import { getAccent } from "@/utils/weather/getAccentColor";

export default function WeatherTab() {
  const { weather, isLoading, error: weatherError } = useWeather();
  const { data: alerts, error: alertsError } = useWeatherAlerts();
  const { focus, toggleFocus } = useFocusMode({ onFocus: 12000, offFocus: 60000 });
  const [isSettingsOpen, { setTrue: openSettings, setFalse: closeSettings }] = useBoolean();

  const accent = getAccent({ weatherCode: weather?.current.weather_code ?? -1, isDay: weather?.current.is_day === 1 });

  return (
    <>
      <SettingsSheet
        open={isSettingsOpen}
        onClose={closeSettings}
        updatedAt={weather?.current.time}
        alertsError={alertsError}
      />

      <div style={{ ["--wc-accent" as string]: accent }}>
        <div className={classNames(styles.group, { [styles.focus]: focus })}>
          <DateHeader onClick={toggleFocus} />

          <Location onClick={openSettings} showAlert={Boolean(alertsError)} />

          <CurrentWeather
            weather={weather}
            alerts={alerts}
            loading={isLoading}
            error={weatherError || alertsError}
          />
        </div>

        {weather && (
          <div className={styles.weatherInfo}>
            <HourlyForecast weather={weather} />

            <DailyForecast weather={weather} />

            <WeatherWidgets weather={weather} />
          </div>
        )}
      </div>
    </>
  )
}