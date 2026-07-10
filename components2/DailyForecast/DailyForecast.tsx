import { getDictionary } from "@/utils/i18n";
import styles from "./DailyForecast.module.css";
import { getWeatherAnimatedIcon } from "@/utils/weatherIcons";
import { SupportedLocale, IDaily, IDailyUnits } from "@/types2/weather.types";
import { formatWeekdayShort } from "@/utils/formatters";

export interface DailyForecastProps {
  daily: IDaily;
  dailyUnits: IDailyUnits;
  timeZone?: string;
  locale: SupportedLocale;
}

/**
 * Day-by-day list in a height-capped, internally scrolling panel — so a
 * 16-day forecast doesn't push the rest of the screen off-view. Each row's
 * min–max bar is positioned relative to the coldest/warmest points across
 * the whole forecast window, so a glance at the bar shows where a day sits
 * in the week, not just its two numbers.
 */
export function DailyForecast({ daily, dailyUnits, timeZone, locale }: DailyForecastProps) {
  const t = getDictionary(locale);

  if (daily.time.length === 0) return null;

  const weekMin = Math.min(...daily.temperature_2m_min);
  const weekMax = Math.max(...daily.temperature_2m_max);
  const span = weekMax - weekMin || 1;

  return (
    <section className={styles.section} aria-label={t.nextDays}>
      {/* <h2 className={styles.heading}>{t.nextDays}</h2> */}
      <ul className={styles.list}>
        {daily.time.map((iso, i) => {
          const date = new Date(iso);
          const dayMin = daily.temperature_2m_min[i];
          const dayMax = daily.temperature_2m_max[i];
          const left = ((dayMin - weekMin) / span) * 100;
          const width = ((dayMax - dayMin) / span) * 100;

          return (
            <li key={iso} className={styles.row}>
              <span className={styles.weekday}>{i === 0 ? t.today : formatWeekdayShort(date, locale, timeZone)}</span>
              <span className={styles.icon}>{getWeatherAnimatedIcon(daily.weather_code[i], true, 28)}</span>
              <span className={styles.minLabel}>
                {Math.round(dayMin)}
                {dailyUnits.temperature_2m_min}
              </span>
              <span className={styles.range}>
                <span
                  className={styles.rangeFill}
                  style={{ left: `${left}%`, width: `${Math.max(width, 6)}%` }}
                />
              </span>
              <span className={styles.maxLabel}>
                {Math.round(dayMax)}
                {dailyUnits.temperature_2m_max}
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
