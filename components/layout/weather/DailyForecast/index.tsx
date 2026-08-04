import styles from "./DailyForecast.module.css";
import { IWeather } from "@/types/weather.types";
import { DateTime } from "luxon";
import { useTranslation } from "react-i18next";
import { JSX, ReactNode, useState } from "react";
import { FiChevronDown } from "react-icons/fi";
import { getAccent } from "@/utils/weather/getAccentColor";
import getWeatherCategory from "@/utils/weather/getWeatherCategory";
import WeatherIcon from "@/components/ui/weather/WeatherIcon";
import { roundValues } from "@/utils/formatters/mathDateFormatters";

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
    if (date >= today) acc.push(index);
    return acc;
  }, []);

  if (forecastIndexes.length === 0) return null;

  const [weekMin, weekMax] = roundValues(
    Math.min(...forecastIndexes.map(i => daily.temperature_2m_min[i])),
    Math.max(...forecastIndexes.map(i => daily.temperature_2m_max[i]))
  );

  const span = weekMax - weekMin || 1;

  const unit = {
    wind: daily_units.wind_speed_10m_mean ?? daily_units.wind_gusts_10m_mean ?? "km/h",
    precipMax: daily_units.precipitation_probability_max,
    precipSum: daily_units.precipitation_sum,
    precipHrs: daily_units.precipitation_hours,
  }

  const onDebugClick = () => console.info("Daily forecast data:", { weather, locale, weekMin, weekMax });

  return (
    <section className={styles.section} aria-label={t("nextDays")} onDoubleClick={onDebugClick}>
      <ul className={styles.list}>
        {forecastIndexes.map((i) => {
          const iso = daily.time[i];
          const isExpanded = expandedIndex === i;
          const date = DateTime.fromISO(iso, { zone: timezone });
          const isToday = date.hasSame(today, "day");

          const weatherCode = daily.weather_code[i]
          const category = getWeatherCategory(weatherCode)
          const accent = getAccent({ category });

          const [dayMin, dayMax, feelsLike, temp, uvIndex, windGusts, windSpeed, precipMax, precipSum, precipHours] = roundValues(
            daily.temperature_2m_min[i],
            daily.temperature_2m_max[i],
            daily.apparent_temperature_mean[i],
            daily.temperature_2m_mean[i],
            daily.uv_index_max[i],
            daily.wind_gusts_10m_mean[i],
            daily.wind_speed_10m_mean[i],
            daily.precipitation_probability_max[i],
            daily.precipitation_sum[i],
            daily.precipitation_hours[i],
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
            if (diffInDays <= 7) return localDate.toFormat("ccc");

            // Mais de 7 dias: exibe o dia da semana curto + dia e mês formatados para a locale atual
            // Ex (pt-BR): "ter., 15 de ago." ou "ter., 15/08"
            return `${localDate.toLocaleString({ day: "numeric", month: "short" })}`;
          })();

          const detailItems = [
            {
              key: 'feelsLike',
              title: `Mean Temp: ${temp}ºC | Mean Feels Like: ${feelsLike}ºC`,
              icon: <WeatherIcon iconName={isFeelsBiggerThanTemp ? 'thermometer-mercury' : 'thermometer-mercury-cold'} size={18} />,
              label: t('feelsLike'),
              value: `${feelsLike}${daily_units.apparent_temperature_mean}`,
            },
            {
              key: 'uvIndex',
              icon: <WeatherIcon iconName={`uv-index-${uvIndex}`} size={18} />,
              label: t('uvIndex'),
              value: uvIndex,
            },
            {
              key: 'sunrise',
              icon: <WeatherIcon size={18} category="sunrise" />,
              label: t('sunrise'),
              value: DateTime.fromISO(daily.sunrise[i]).toFormat('HH:mm'),
            },
            {
              key: 'sunset',
              icon: <WeatherIcon size={18} category="sunset" />,
              label: t('sunset'),
              value: DateTime.fromISO(daily.sunset[i]).toFormat('HH:mm'),
            },
            {
              key: 'precipChance',
              icon: <WeatherIcon size={18} iconName="raindrops" />,
              label: t('precipitationTexts.chance'),
              value: `${precipMax}${unit.precipMax}`,
            },
            {
              key: 'precipMax',
              icon: <WeatherIcon size={18} iconName="raindrop-measure" />,
              label: t('precipitationTexts.max'),
              value: t("precipitationTexts.precipInHours", {
                precip: precipSum,
                precipUnit: unit.precipSum,
                hours: precipHours,
                hoursUnit: unit.precipHrs,
              })
            },
            {
              key: 'windGusts',
              icon: <WeatherIcon size={18} iconName="wind" />,
              label: t('windGusts'),
              value: `${windGusts} ${unit.wind}`,
            },
            {
              key: 'windSpeed',
              icon: <WeatherIcon size={18} iconName="wind" />,
              label: t('windSpeed'),
              value: `${windSpeed} ${unit.wind}`,
            },
          ];

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
                  {detailItems.map(({ key, ...itemProps }) => (
                    <DetailItem key={key} {...itemProps} />
                  ))}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

interface DetailItemProps {
  icon?: ReactNode;
  label: string;
  value: ReactNode;
  title?: string;
}

export const DetailItem: React.FC<DetailItemProps> = ({ icon, label, value, title }) => {
  return (
    <div className={styles.detailItem} title={title}>
      {icon && <span className={styles.detailIcon}>{icon}</span>}
      <span className={styles.detailLabel}>{label}</span>
      <span className={styles.detailValue}>{value}</span>
    </div>
  );
};
