import { IWeather } from "@/types/weather.types";
import styles from "./HourlyForecast.module.css";
import { useTranslation } from "react-i18next";
import { DateTime } from "luxon";
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
export function HourlyForecast({ weather, hoursToShow = 24 * 3 }: HourlyForecastProps) {
  const { t } = useTranslation();
    const { now } = useNow();

  const startIndex = Math.max(
    0,
    (weather.hourly.time || []).findIndex((iso) => {
      const hourlyTime = DateTime.fromISO(iso, { zone: weather.timezone });
      return hourlyTime >= now;
    })
  );

  const endIndex = Math.min(weather.hourly.time.length, startIndex + hoursToShow);
  const indices = Array.from({ length: Math.max(0, endIndex - startIndex) }, (_, i) => startIndex + i);

  if (indices.length === 0) return null;

  return (
    <section className={styles.section} aria-label={t('nextHours')}>
      <HourlyList
        startIndex={startIndex}
        times={weather.hourly.time}
        weatherCodes={weather.hourly.weather_code}
        temps={weather.hourly.temperature_2m}
        tempUnit={weather.hourly_units.temperature_2m}
        feelsLikes={weather.hourly.apparent_temperature}
        feelsLikeUnit={weather.hourly_units.apparent_temperature}
        precipitations={weather.hourly.precipitation}
        isDays={weather.hourly.is_day}
        latitude={weather.latitude}
        longitude={weather.longitude}
        timezone={weather.timezone}
        hoursToShow={72}
      />
    </section>
  );
}