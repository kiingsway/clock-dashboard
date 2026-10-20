import { SunEvent } from '../types';
import styles from '../EventChartProgress.module.scss';
import { capitalizeWords } from '@/utils/formatters/textFormatters';
import WeatherIcon from '../../WeatherIcon';

interface Props {
  event: SunEvent;
  isAppFocused: boolean
}

export default function SunEventLabel({ event: { kind, time }, isAppFocused }: Props) {
  return (
    <div className={styles.label}>
      <WeatherIcon
        size={isAppFocused ? 50 : 40}
        category={{ name: kind, title: capitalizeWords(kind) }}
      />
      <span style={{ marginTop: isAppFocused ? -10 : -5 }}>{time.toFormat('HH:mm')}</span>
    </div>
  );
}
