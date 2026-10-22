import { useTranslation } from 'react-i18next';
import { capitalizeWords } from '@/utils/formatters/textFormatters';
import { formatClock } from '@/utils/formatters/formatClock';
import useAppSettings from '@/contexts/AppSettingsContext';
import WeatherIcon from '@/components/ui/weather/WeatherIcon';
import { ChartEvent } from '../types';
import styles from '../EventChartProgress.module.scss';

interface Props {
  event: ChartEvent;
  isAppFocused: boolean
}

export default function SunEventLabel({ event: { kind, time, iconName, showDate }, isAppFocused }: Props) {
  const { i18n: { language } } = useTranslation();
  const { get: { is12hour } } = useAppSettings();

  const size = isAppFocused ? 50 : 40;

  const timeLabel = time
    ? formatClock({ date: time, language, hour12: is12hour, localizedPeriod: true })
    : '--:--';

  return (
    <div className={styles.label}>
      {iconName
        ? <WeatherIcon size={size} iconName={iconName} />
        : <WeatherIcon size={size} category={{ name: kind as 'sunrise' | 'sunset', title: capitalizeWords(kind) }} />}
      <span style={{ marginTop: isAppFocused ? -10 : -5 }}>{timeLabel}</span>
      {time && showDate && <span className={styles.labelDate}>{time.toFormat('dd/LL')}</span>}
    </div>
  );
}
