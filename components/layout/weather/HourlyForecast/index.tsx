import { IWeather } from "@/types/weather.types";
import styles from "./HourlyForecast.module.css";
import { useTranslation } from "react-i18next";
import { DateTime } from "luxon";
import { getAccent } from "@/utils/weather/getAccentColor";
import getWeatherCategory from "@/utils/weather/getWeatherCategory";
import { RainGauge } from "@/components/ui/weather/RainGauge";
import WeatherIcon from "@/components/ui/weather/WeatherIcon";
import { formatHourLabel } from "@/utils/formatters/dateFormatters";
import { getRainColor } from "@/utils/weather/getRainIntensityLabel";
import HourlyCard from "@/components/ui/weather/HourlyCard";

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
  const { t, i18n: { language: locale } } = useTranslation();

  const now = DateTime.fromISO(weather.current.time, { zone: weather.timezone });

  const startIndex = Math.max(
    0,
    (weather.hourly.time || []).findIndex((iso) => {
      const hourlyTime = DateTime.fromISO(iso, { zone: weather.timezone });
      return hourlyTime >= now;
    })
  );

  const endIndex = Math.min(weather.hourly.time.length, startIndex + hoursToShow);
  const indices = Array.from({ length: Math.max(0, endIndex - startIndex) }, (_, i) => startIndex + i);

  const precipitations: number[] = weather.hourly.precipitation;

  const maxPrecip = Math.max(...precipitations.slice(startIndex, startIndex + hoursToShow));

  if (indices.length === 0) return null;

  return (
    <section className={styles.section} aria-label={t('nextHours')}>
      <ul className={styles.scroller}>
        {indices.map((i) => {
          const isoString = weather.hourly.time[i];
          const date = DateTime.fromISO(isoString, { zone: weather.timezone });
          const isNow = Math.abs(date.diff(now, "minutes").minutes) <= 15;
          const isDay = weather.hourly.is_day[i] === 1;
          const precip = precipitations[i];
          const weatherCode = weather.hourly.weather_code[i];

          const temp = Math.round(weather.hourly.temperature_2m[i]) + weather.hourly_units.temperature_2m
          const feelsLike = Math.round(weather.hourly.apparent_temperature[i]) + weather.hourly_units.apparent_temperature;

          const category = getWeatherCategory(weatherCode);
          const accent = getAccent({ category, isDay });
          const accentPeak = getRainColor(maxPrecip);

          return (
            <HourlyCard
              key={isoString}
              as="li"
              hour={isNow ? t('now') : formatHourLabel(date, locale)}
              hourTooltip={date.toFormat('dd/LL/yyyy HH:mm')}
              temp={temp}
              feels={feelsLike}
              accent={accent}
              accentPeak={accentPeak}
              desc={<RainGauge mm={precip} max={10} />}
              icon={<WeatherIcon
                weatherCode={weatherCode}
                date={date}
                isDay={isDay}
                lat={weather.latitude}
                lon={weather.longitude}
                size={34}
              />}
            />
          );
        })}
      </ul>
    </section>
  );
}