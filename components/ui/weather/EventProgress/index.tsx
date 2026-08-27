import WeatherIcon, { WeatherIconProps } from '../WeatherIcon';
import styles from './EventProgress.module.scss';
import { DateTime } from 'luxon';
import { JSX } from 'react/jsx-runtime';
import { useNow } from '@/contexts/NowContext';
import { useTranslation } from 'react-i18next';
import { getProgressBetweenDates } from '@/utils/formatters/dateFormatters';
import { CSSProperties } from 'react';

interface Props {
  start?: DateTime;
  startIcon?: WeatherIconProps
  end?: DateTime;
  endIcon?: WeatherIconProps
  onDoubleClick?: () => void;
  hideDate?: boolean;
  markerStrength?: number;
  style?: CSSProperties;
}

export default function EventProgress({ start, end, startIcon, endIcon, hideDate, markerStrength = 0.3, style: styleProp }: Props) {

  const { now } = useNow();
  const progress = (() => {
    if (start?.isValid && end?.isValid)
      return getProgressBetweenDates(start, end, now);
    return 0;
  })();

  const ariaLabel = `start ${start?.toFormat('HH:mm')}, end ${end?.toFormat('HH:mm')}`;
  const onDebugClick = (): void => {
    const f = (d: DateTime | undefined) => !d ? '--:--' : d.toFormat('LLL dd HH:mm');
    const t = `${f(start)} -> ${f(now)} (${(progress * 100).toFixed(1)}%) -> ${f(end)}.${hideDate ? ' Hiding Date.' : ''}`;
    console.info(`Event Progress: ${t}`, { startIcon, endIcon });
  };

  const blur = calculateProgress(10, 27, markerStrength) + 'px';
  const spread = calculateProgress(1, 9, markerStrength) + 'px';

  const style = {
    ...styleProp,
    '--blur': blur,
    '--spread': spread
  } as CSSProperties;

  return (
    <div
      style={style}
      className={styles.arc}
      aria-label={ariaLabel}
      onDoubleClick={onDebugClick}>
      <div className={styles.point}>
        {startIcon && <WeatherIcon size={18} {...startIcon} />}
        <ProgressLabel date={start} hideDate={hideDate} />
      </div>

      <div className={styles.track} aria-hidden={typeof progress !== 'number'}>
        {typeof progress === 'number' ? (
          <>
            <div className={styles.trackFill} style={{ width: `${progress * 100}%` }} />
            <div className={styles.marker} style={{ left: `${progress * 100}%` }} />
          </>
        ) : null}
      </div>

      <div className={styles.point}>
        {endIcon && <WeatherIcon size={18} {...endIcon} />}
        <ProgressLabel date={end} hideDate={hideDate} />
      </div>
    </div>
  );
}

const calculateProgress = (min: number, max: number, progress: number) => {
  if (progress <= 0) return min;
  if (progress >= 1) return max;
  return ((max - min) * progress) + min;
};

const ProgressLabel = ({ date, hideDate }: { date?: DateTime, hideDate?: boolean }): JSX.Element => {
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
    <div className={styles.progressLabel}>
      {dateLabel && !hideDate && <span>{dateLabel}</span>}
      <span>{timeLabel}</span>
    </div>
  );
};