import { getAccent } from "@/utils/weatherIcons/getAccentColor";
import styles from "./DailyForecast.module.css";
import { SupportedLocale, IDaily, IDailyUnits, IWeather } from "@/types/weather.types";
import getWeatherAnimatedIcon from "@/utils/weatherIcons/getWeatherAnimatedIcon";
import { DateTime } from "luxon";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import getSunIcon from "@/utils/weatherIcons/getSunIcon";
import { FiChevronDown } from "react-icons/fi";
import getWeatherIcon from "@/utils/weatherIcons/getWeatherIcon";
import WeatherIcon from "../WeatherIcon";
import getIcon from "@/utils/weatherIcons/getIcon";

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
  const [expandedIndex, setExpandedIndex] = useState<number>();

  const { current, daily, daily_units, hourly, timezone } = weather

  if (daily.time.length === 0) return null;

  const weekMin = Math.min(...daily.temperature_2m_min);
  const weekMax = Math.max(...daily.temperature_2m_max);
  const span = weekMax - weekMin || 1;
  const windUnit = daily_units.wind_speed_10m_mean ?? daily_units.wind_gusts_10m_mean ?? "km/h";

  const onDebugClick = () =>
    console.info("Daily forecast data:", { weather, locale });

  return (
    <section className={styles.section} aria-label={t("nextDays")} onDoubleClick={onDebugClick}>
      <ul className={styles.list}>
        {daily.time.map((iso, i) => {
          const isExpanded = expandedIndex === i;
          const date = DateTime.fromISO(iso, { zone: timezone });

          const weatherCode = daily.weather_code[i]
          const dayMin = daily.temperature_2m_min[i];
          const dayMax = daily.temperature_2m_max[i];
          const feelsLike = daily.apparent_temperature_mean[i];
          const temp = daily.temperature_2m_mean[i];

          const left = ((dayMin - weekMin) / span) * 100;
          const width = ((dayMax - dayMin) / span) * 100;

          const accent = getAccent(weatherCode);

          const isFeelsBiggerThanTemp = feelsLike > temp

          return (
            <li key={iso} className={styles.dayItem} style={{ ["--wc-accent" as string]: accent }}>

              <button
                type="button"
                className={styles.row}
                onClick={() => setExpandedIndex(isExpanded ? undefined : i)}
                aria-expanded={isExpanded}
              >
                <span className={styles.weekday}>
                  {i === 0 ? t("today") : date.setLocale(locale).toFormat("ccc")}
                </span>
                <span className={styles.icon}>
                  <WeatherIcon weatherCode={weatherCode} size={28} />
                </span>
                <span className={styles.minLabel}>
                  {Math.round(dayMin)}
                  {daily_units.temperature_2m_min}
                </span>
                <span className={styles.range}>
                  <span
                    className={styles.rangeFill}
                    style={{ left: `${left}%`, width: `${Math.max(width, 6)}%` }}
                  />
                </span>
                <span className={styles.maxLabel}>
                  {Math.round(dayMax)}
                  {daily_units.temperature_2m_max}
                </span>
                <FiChevronDown className={styles.chevron} data-expanded={isExpanded} aria-hidden="true" />
              </button>

              {isExpanded && (
                <div className={styles.details}>
                  <div className={styles.detailItem} title={`Mean Temp: ${temp}ºC | Mean App Temp: ${feelsLike}ºC`}>
                    <span className={styles.detailIcon}>{getIcon(isFeelsBiggerThanTemp ? 'thermometer-mercury' : 'thermometer-mercury-cold', 16)}</span>
                    <span className={styles.detailLabel}>{t('feelsLike')}</span>
                    <span className={styles.detailValue}>{Math.round(feelsLike)}{daily_units.apparent_temperature_mean}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailIcon}>{getIcon(`uv-index-${Math.round(daily.uv_index_max[i])}`, 16)}</span>
                    <span className={styles.detailLabel}>{t('uvIndex')}</span>
                    <span className={styles.detailValue}>{Math.round(daily.uv_index_max[i])}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailIcon}>{getSunIcon("sunrise", 16)}</span>
                    <span className={styles.detailLabel}>{t('sunrise')}</span>
                    <span className={styles.detailValue}>{DateTime.fromISO(daily.sunrise[i]).toFormat('HH:mm')}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailIcon}>{getSunIcon("sunset", 16)}</span>
                    <span className={styles.detailLabel}>{t('sunset')}</span>
                    <span className={styles.detailValue}>{DateTime.fromISO(daily.sunset[i]).toFormat('HH:mm')}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailIcon}>{getIcon("wind", 16)}</span>
                    <span className={styles.detailLabel}>{t('windGusts')}</span>
                    <span className={styles.detailValue}>
                      {Math.round(daily.wind_gusts_10m_mean[i])} {windUnit}
                    </span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailIcon}>{getIcon("wind", 16)}</span>
                    <span className={styles.detailLabel}>{t('windSpeed')}</span>
                    <span className={styles.detailValue}>
                      {Math.round(daily.wind_speed_10m_mean[i])} {windUnit}
                    </span>
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
