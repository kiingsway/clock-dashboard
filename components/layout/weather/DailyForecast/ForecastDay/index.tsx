import { FiChevronDown } from 'react-icons/fi';
import styles from './ForecastDay.module.scss';
import WeatherIcon from '@/components/ui/weather/WeatherIcon';
import { IDailyData } from '@/types/weatherInfo.types';

interface Props {
  item: IDailyData;
  onClick: () => void;
}

export default function ForecastDay({ item, onClick }: Props) {

  const { dayName, weatherCode, tempMin, tempMax, tempUnit, accent, range: { left, width } } = item;

  return (
    <li className={styles.dayItem} style={{ ["--wc-accent" as string]: accent }}>

      <button
        type="button"
        className={styles.row}
        onClick={onClick}
      >
        <span className={styles.weekday}>{dayName}</span>

        <span className={styles.icon}>
          <WeatherIcon weatherCode={weatherCode} size={28} />
        </span>

        <span className={styles.minLabel}>
          {tempMin}
          {tempUnit}
        </span>

        <span className={styles.range}>
          <span
            className={styles.rangeFill}
            style={{ left, width }}
          />
        </span>

        <span className={styles.maxLabel}>
          {tempMax}
          {tempUnit}
        </span>

        <FiChevronDown className={styles.chevron} aria-hidden="true" />
      </button>
    </li>
  );
}
