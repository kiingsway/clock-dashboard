import { IWeather } from "@/types/weather.types";
import styles from "./HourlyForecast.module.css";
import { useTranslation } from "react-i18next";
import HourlyList from "@/components/ui/weather/HourlyList";
import HourlyTemperatureChart from "@/components/ui/weather/HourlyTemperatureChart";
import ErrorBoundary from "@/components/ui/ErrorBoundary";
import { useNow } from "@/contexts/NowContext";
import useAppSettings from "@/contexts/AppSettingsContext";

export interface HourlyForecastProps {
  weather: IWeather
  /** How many upcoming hours to render. Defaults to 24. */
  hoursToShow?: number;
}

/**
 * Compact hour-by-hour strip. Scrolls horizontally instead of listing every
 * hour on screen, per the brief — there can be dozens of entries in
 * `hourly`, so only a handful are ever visible at once.
 *
 * Shows cards or the temperature chart depending on the `hourlyForecastView`
 * setting; double-click switches between them (and saves the choice).
 */
export default function HourlyForecast({ weather }: HourlyForecastProps) {
  const { t } = useTranslation();
  const { now } = useNow();
  const { get: { hourlyForecastView }, set } = useAppSettings();

  const toggleView = () => set.hourlyForecastView(hourlyForecastView === 'chart' ? 'cards' : 'chart');

  return (
    <section className={styles.section} aria-label={t('nextHours')} onDoubleClick={toggleView}>
      {hourlyForecastView === 'chart' ?
        <ErrorBoundary>
          <HourlyTemperatureChart weather={weather} />
        </ErrorBoundary>
        :
        <HourlyList date={now} weather={weather} hoursAhead={72} kind="now" />
      }
    </section>
  );
}
