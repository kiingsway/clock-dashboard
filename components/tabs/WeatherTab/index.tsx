import useFocusMode from "@/hooks/useFocusMode";
import classNames from "classnames";
import styles from './WeatherTab.module.scss';
import useWeather from "@/hooks/useWeather";
import DateHeader from "@/components/layout/weather/DateHeader";
import Location from '@/components/layout/weather/Location';
import CurrentWeather from "@/components/layout/weather/CurrentWeather";
import useWeatherAlerts from "@/hooks/useWeatherAlerts";
import HourlyForecast from "@/components/layout/weather/HourlyForecast";
import DailyForecast from "@/components/layout/weather/DailyForecast";
import WeatherWidgets from "@/components/layout/weather/WeatherWidgets";
import SettingsSheet from "@/components/overlays/SettingsSheet";
import useBoolean from "@/hooks/useBoolean";
import ErrorBoundary from "@/components/ui/ErrorBoundary";
import { useTranslation } from "react-i18next";
import useAppSettings from "@/contexts/AppSettingsContext";
import getWeatherCodeInfo from "@/utils/weather/getWeatherCodeInfo";

export default function WeatherTab() {
  const { t } = useTranslation();
  const { weather, isLoading, error: weatherError } = useWeather();
  const { get: { focusCurrentWeatherOnLaunch } } = useAppSettings();
  const { data: alerts, error: alertsError } = useWeatherAlerts();
  const { focus, toggleFocus } = useFocusMode({ initialValue: focusCurrentWeatherOnLaunch, onFocus: 12000, offFocus: 0 });
  const [isSettingsOpen, { setTrue: openSettings, setFalse: closeSettings }] = useBoolean();

  const { accent } = getWeatherCodeInfo(weather?.current?.weather_code ?? -1, weather?.current?.is_day !== 0, t);

  console.log('weather', weather);

  return (
    <>
      <SettingsSheet
        open={isSettingsOpen}
        onClose={closeSettings}
        updatedAt={weather?.current?.time}
        alertsError={alertsError}
        accent={accent}
      />

      <div style={{ ["--wc-accent" as string]: accent }}>
        <div className={classNames(styles.group, { [styles.focus]: focus })}>

          <ErrorBoundary>
            <DateHeader onClick={toggleFocus} />
          </ErrorBoundary>

          <ErrorBoundary>
            <Location
              onClick={openSettings}
              showAlert={Boolean(alertsError)}
            />
          </ErrorBoundary>

          <ErrorBoundary>
            <CurrentWeather
              weather={weather}
              alerts={alerts}
              loading={isLoading}
              error={weatherError}
              isFocused={focus}
            />
          </ErrorBoundary>
        </div>

        {weather && (
          <div className={styles.weatherInfo}>
            <ErrorBoundary>
              <HourlyForecast weather={weather} />
            </ErrorBoundary>

            <ErrorBoundary>
              <DailyForecast weather={weather} />
            </ErrorBoundary>

            <ErrorBoundary>
              <WeatherWidgets weather={weather} />
            </ErrorBoundary>
          </div>
        )}
      </div>
    </>
  );
}