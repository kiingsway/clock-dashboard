import styles from "./DailyForecast.module.css";
import { IWeather } from "@/types/weather.types";
import { DateTime } from "luxon";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { FiChevronDown } from "react-icons/fi";
import WeatherIcon from "../WeatherIcon";
import getWeatherCategory from "@/utils/weatherIcons/getWeatherCategory";
import { getAccent } from "@/utils/getAccentColor";
import { roundValues } from "@/utils/formatters";

export interface DailyForecastProps {
  weather: IWeather
  locale: string;
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

  const { daily, daily_units, timezone } = weather;

  if (daily.time.length === 0) return null;

  const today = DateTime.now().setZone(timezone).startOf("day");

  const forecastIndexes = daily.time.reduce<number[]>((acc, iso, index) => {
    const date = DateTime.fromISO(iso, { zone: timezone });

    if (date >= today) {
      acc.push(index);
    }

    return acc;
  }, []);

  if (forecastIndexes.length === 0) return null;

  const [weekMin, weekMax] = roundValues(
    Math.min(...forecastIndexes.map(i => daily.temperature_2m_min[i])),
    Math.max(...forecastIndexes.map(i => daily.temperature_2m_max[i]))
  );
  const span = weekMax - weekMin || 1;
  const windUnit = daily_units.wind_speed_10m_mean ?? daily_units.wind_gusts_10m_mean ?? "km/h";

  const onDebugClick = () =>
    console.info("Daily forecast data:", { weather, locale });

  return (
    <section className={styles.section} aria-label={t("nextDays")} onDoubleClick={onDebugClick}>
      <ul className={styles.list}>
        {forecastIndexes.map((i) => {
          const iso = daily.time[i];
          const isExpanded = expandedIndex === i;
          const date = DateTime.fromISO(iso, { zone: timezone });
          const isToday = date.hasSame(today, "day");

          const weatherCode = daily.weather_code[i]
          const categoryName = getWeatherCategory(weatherCode)
          const accent = getAccent({ categoryName });

          const [dayMin, dayMax, feelsLike, temp, uvIndex, windGusts, windSpeed] = roundValues(
            daily.temperature_2m_min[i],
            daily.temperature_2m_max[i],
            daily.apparent_temperature_mean[i],
            daily.temperature_2m_mean[i],
            daily.uv_index_max[i],
            daily.wind_gusts_10m_mean[i],
            daily.wind_speed_10m_mean[i]
          );

          const left = ((dayMin - weekMin) / span) * 100;
          const width = ((dayMax - dayMin) / span) * 100;

          const isFeelsBiggerThanTemp = feelsLike > temp;

          const dateText = ((): string => {
            if (isToday) return t("today");

            const now = DateTime.now().startOf("day");
            const targetDate = date.startOf("day");
            const diffInDays = Math.abs(targetDate.diff(now, "days").days);

            const localDate = date.setLocale(locale);

            // Até 7 dias: exibe apenas o dia da semana curto (ex: "ter.")
            if (diffInDays <= 7) return localDate.toFormat("cccc");

            // Mais de 7 dias: exibe o dia da semana curto + dia e mês formatados para a locale atual
            // Ex (pt-BR): "ter., 15 de ago." ou "ter., 15/08"
            return `${localDate.toLocaleString({ day: "numeric", month: "short" })}`;
          })()

          return (
            <li key={iso} className={styles.dayItem} style={{ ["--wc-accent" as string]: accent }}>

              <button
                type="button"
                className={styles.row}
                onClick={() => setExpandedIndex(isExpanded ? undefined : i)}
                aria-expanded={isExpanded}
              >
                <span className={styles.weekday}>
                  {dateText}
                </span>
                <span className={styles.icon}>
                  <WeatherIcon weatherCode={weatherCode} size={28} />
                </span>
                <span className={styles.minLabel}>
                  {dayMin}
                  {daily_units.temperature_2m_min}
                </span>
                <span className={styles.range}>
                  <span
                    className={styles.rangeFill}
                    style={{ left: `${left}%`, width: `${Math.max(width, 6)}%` }}
                  />
                </span>
                <span className={styles.maxLabel}>
                  {dayMax}
                  {daily_units.temperature_2m_max}
                </span>
                <FiChevronDown className={styles.chevron} data-expanded={isExpanded} aria-hidden="true" />
              </button>

              {isExpanded && (
                <div className={styles.details}>
                  <div className={styles.detailItem} title={`Mean Temp: ${temp}ºC | Mean Feels Like: ${feelsLike}ºC`}>
                    <span className={styles.detailIcon}>
                      <WeatherIcon iconName={isFeelsBiggerThanTemp ? 'thermometer-mercury' : 'thermometer-mercury-cold'} size={18} />
                    </span>
                    <span className={styles.detailLabel}>{t('feelsLike')}</span>
                    <span className={styles.detailValue}>{feelsLike}{daily_units.apparent_temperature_mean}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <WeatherIcon iconName={`uv-index-${uvIndex}`} size={18} />
                    <span className={styles.detailLabel}>{t('uvIndex')}</span>
                    <span className={styles.detailValue}>{uvIndex}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailIcon}><WeatherIcon size={18} category="sunrise" /></span>
                    <span className={styles.detailLabel}>{t('sunrise')}</span>
                    <span className={styles.detailValue}>{DateTime.fromISO(daily.sunrise[i]).toFormat('HH:mm')}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailIcon}><WeatherIcon size={18} category="sunset" /></span>
                    <span className={styles.detailLabel}>{t('sunset')}</span>
                    <span className={styles.detailValue}>{DateTime.fromISO(daily.sunset[i]).toFormat('HH:mm')}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailIcon}><WeatherIcon size={18} iconName="wind" /></span>
                    <span className={styles.detailLabel}>{t('windGusts')}</span>
                    <span className={styles.detailValue}>
                      {windGusts} {windUnit}
                    </span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailIcon}><WeatherIcon size={18} iconName="wind" /></span>
                    <span className={styles.detailLabel}>{t('windSpeed')}</span>
                    <span className={styles.detailValue}>
                      {windSpeed} {windUnit}
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
