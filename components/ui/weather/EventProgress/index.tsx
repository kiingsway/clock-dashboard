import { capitalizeWords } from '@/utils/formatters/textFormatters';
import WeatherIcon, { WeatherIconProps } from '../WeatherIcon';
import styles from './EventProgress.module.scss';
import { DateTime } from 'luxon';
import { JSX } from 'react/jsx-runtime';
import { WeatherCategoryName } from '@/types/weather.types';
import { useNow } from '@/contexts/NowContext';
import { useTranslation } from 'react-i18next';

interface Props {
  start?: DateTime;
  end?: DateTime;
  startKind?: 'sunrise' | 'sunset';
  startIconName?: string;
  endIconName?: string;
  endKind?: 'sunrise' | 'sunset'
  progress?: number;
  onDoubleClick?: () => void;
}

export default function EventProgress({ start, end, startKind = 'sunrise', endKind = 'sunset', progress, onDoubleClick, endIconName, startIconName }: Props) {
  return (
    <div className={styles.arc} aria-label={`${startKind} ${start?.toFormat('HH:mm')}, ${endKind} ${end?.toFormat('HH:mm')}`} onDoubleClick={onDoubleClick}>
      <div className={styles.point}>
        <ProgressIcon icon={startIconName} categoryIcon={startKind} />
        <ProgressLabel date={start} />
      </div>

      <div className={styles.track} aria-hidden={typeof progress !== 'number'}>
        {typeof progress === 'number' ? (
          <>
            <div className={styles.trackFill} style={{ width: `${progress * 100}%` }} />
            <div className={styles.marker} style={{ left: `${progress * 100}%` }} />
          </>
        ) : <></>}
      </div>

      <div className={styles.point}>
        <ProgressIcon icon={endIconName} categoryIcon={endKind} />
        <ProgressLabel date={end} />
      </div>
    </div>
  )
}

interface IconProps {
  icon?: string;
  categoryIcon: WeatherCategoryName;
}

const ProgressIcon = ({ icon, categoryIcon }: IconProps): JSX.Element => {

  const weatherIconProps: WeatherIconProps = {
    size: 18,
    ...(icon ? {
      iconName: icon
    } : {
      category: {
        name: categoryIcon,
        title: capitalizeWords(categoryIcon)
      }
    })
  }

  return <WeatherIcon {...weatherIconProps} />;
}

const ProgressLabel = ({ date }: { date?: DateTime }): JSX.Element => {
  const { i18n: { language: locale } } = useTranslation();
  const { now } = useNow();

  const isToday = date?.isValid && date.hasSame(now, 'day');

  const dateLabel = date?.isValid && !isToday
    ? new Intl.DateTimeFormat(locale, {
      day: '2-digit',
      month: '2-digit',
    }).format(date.toJSDate())
    : undefined;

  const timeLabel = date?.isValid
    ? date.toFormat('HH:mm')
    : '--:--';

  return (
    <>
      {dateLabel && <span>{dateLabel}</span>}
      <span>{timeLabel}</span>
    </>
  );
};