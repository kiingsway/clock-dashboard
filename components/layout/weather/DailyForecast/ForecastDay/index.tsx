import { FiChevronDown } from 'react-icons/fi';
import { DateTime } from 'luxon';
import { useTranslation } from 'react-i18next';
import { getAccent } from '@/utils/weather/getAccentColor';
import { IWeather } from '@/types/weather.types';
import styles from './ForecastDay.module.scss';
import WeatherIcon from '@/components/ui/weather/WeatherIcon';
import { roundValues } from '@/utils/formatters/mathDateFormatters';
import getForecastDateLabel from '@/utils/weather/getForecastDateLabel';
import { useNow } from '@/contexts/NowContext';

interface Props {
  weather: IWeather;
  weekMin: number
  weekMax: number
  today: DateTime
  index: number
  setExpandedIndex: (i?: number) => void;
}

export default function ForecastDay({ weather, weekMin, weekMax, today, index, setExpandedIndex }: Props) {
  const { t, i18n: { language: locale } } = useTranslation();
  const { now } = useNow();

  const { daily, daily_units: dailyUnits, timezone } = weather;

  const unit = {
    wind: dailyUnits.wind_speed_10m_mean ?? dailyUnits.wind_gusts_10m_mean ?? "km/h",
    precipMax: dailyUnits.precipitation_probability_max,
    precipSum: dailyUnits.precipitation_sum,
    precipHrs: dailyUnits.precipitation_hours,
    dayMin: dailyUnits.temperature_2m_min,
    dayMax: dailyUnits.temperature_2m_max,
    feelsLike: dailyUnits.apparent_temperature_mean,
  }

  const [iso, weatherCode] = [
    daily.time[index],
    daily.weather_code[index],
  ];

  const [dayMin, dayMax] = roundValues(
    daily.temperature_2m_min[index],
    daily.temperature_2m_max[index],
  );

  const indexDate = DateTime.fromISO(iso, { zone: timezone });
  const isToday = indexDate.hasSame(today, "day");

  const accent = getAccent({ weatherCode });

  const temperatureRange = weekMax - weekMin || 1;
  const rangeStart = ((dayMin - weekMin) / temperatureRange) * 100;
  const rangeWidth = ((dayMax - dayMin) / temperatureRange) * 100;

  const dateText = isToday ? t('today') : getForecastDateLabel(now, indexDate, locale);

  return (
    <li className={styles.dayItem} style={{ ["--wc-accent" as string]: accent }}>

      <button
        type="button"
        className={styles.row}
        onClick={() => setExpandedIndex(index)}
      >
        <span className={styles.weekday}>
          {dateText}
        </span>
        <span className={styles.icon}>
          <WeatherIcon weatherCode={weatherCode} size={28} />
        </span>
        <span className={styles.minLabel}>
          {dayMin}
          {unit.dayMin}
        </span>
        <span className={styles.range}>
          <span
            className={styles.rangeFill}
            style={{ left: `${rangeStart}%`, width: `${Math.max(rangeWidth, 6)}%` }}
          />
        </span>
        <span className={styles.maxLabel}>
          {dayMax}
          {unit.dayMax}
        </span>
        <FiChevronDown className={styles.chevron} aria-hidden="true" />
      </button>
    </li>
  );
}
