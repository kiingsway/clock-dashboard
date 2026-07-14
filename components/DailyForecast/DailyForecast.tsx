import { getAccent } from "@/utils/weatherIcons/getAccentColor";
import styles from "./DailyForecast.module.css";
import { SupportedLocale, IDaily, IDailyUnits, IWeather } from "@/types/weather.types";
import getWeatherAnimatedIcon from "@/utils/weatherIcons/getWeatherAnimatedIcon";
import { DateTime } from "luxon";
import { useTranslation } from "react-i18next";

export interface DailyForecastProps {
  weather: IWeather
  locale: SupportedLocale;
}

/**
 * Day-by-day list in a height-capped, internally scrolling panel — so a
 * 16-day forecast doesn't push the rest of the screen off-view. Each row's
 * min–max bar is positioned relative to the coldest/warmest points across
 * the whole forecast window, so a glance at the bar shows where a day sits
 * in the week, not just its two numbers.
 */
export function DailyForecast({ weather, locale }: DailyForecastProps) {
  const { t } = useTranslation();

  if (weather.daily.time.length === 0) return null;

  const weekMin = Math.min(...weather.daily.temperature_2m_min);
  const weekMax = Math.max(...weather.daily.temperature_2m_max);
  const span = weekMax - weekMin || 1;

  const onDebugClick = () =>
    console.info("Daily forecast data:", { weather, locale });

  return (
    <section className={styles.section} aria-label={t("nextDays")} onDoubleClick={onDebugClick}>
      <ul className={styles.list}>
        {weather.daily.time.map((iso, i) => {
          const date = DateTime.fromISO(iso, { zone: weather.timezone, });
          
          const dayMin = weather.daily.temperature_2m_min[i];
          const dayMax = weather.daily.temperature_2m_max[i];

          const left = ((dayMin - weekMin) / span) * 100;
          const width = ((dayMax - dayMin) / span) * 100;
          
          const accent = getAccent(weather.daily.weather_code[i]);

          return (
            <li key={iso} className={styles.row} style={{ ["--wc-accent" as string]: accent }}>
              <span className={styles.weekday}>
                {i === 0 ? t("today") : date.setLocale(locale).toFormat("ccc")}
              </span>

              <span className={styles.icon}>
                {getWeatherAnimatedIcon(weather.daily.weather_code[i], true, 28).img}
              </span>

              <span className={styles.minLabel}>
                {Math.round(dayMin)}
                {weather.daily_units.temperature_2m_min}
              </span>

              <span className={styles.range}>
                <span
                  className={styles.rangeFill}
                  style={{
                    left: `${left}%`,
                    width: `${Math.max(width, 6)}%`,
                  }}
                />
              </span>

              <span className={styles.maxLabel}>
                {Math.round(dayMax)}
                {weather.daily_units.temperature_2m_max}
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
