import { IWeather } from "@/types/weather.types";
import styles from "./HourlyForecast.module.css";
import { useTranslation } from "react-i18next";
import HourlyList from "@/components/ui/weather/HourlyList";
import { useNow } from "@/contexts/NowContext";

export interface HourlyForecastProps {
  weather: IWeather
  /** How many upcoming hours to render. Defaults to 24. */
  hoursToShow?: number;
}

/**
 * Compact hour-by-hour strip. Scrolls horizontally instead of listing every
 * hour on screen, per the brief — there can be dozens of entries in
 * `hourly`, so only a handful are ever visible at once.
 */
export default function HourlyForecast({ weather }: HourlyForecastProps) {
  const { t } = useTranslation();
  const { now } = useNow();

  return (
    <section className={styles.section} aria-label={t('nextHours')}>
      <HourlyList date={now} weather={weather} hoursAhead={72} kind="now" />
    </section>
  );
}