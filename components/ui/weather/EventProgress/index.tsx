import WeatherIcon, { WeatherIconProps } from '../WeatherIcon';
import styles from './EventProgress.module.scss';
import { DateTime } from 'luxon';
import { JSX } from 'react/jsx-runtime';
import { useNow } from '@/contexts/NowContext';
import { useTranslation } from 'react-i18next';
import { getProgressBetweenDates } from '@/utils/formatters/dateFormatters';
import { CSSProperties } from 'react';
import { formatClock } from '@/utils/formatters/formatClock';
import useAppSettings from '@/contexts/AppSettingsContext';
import classNames from 'classnames';

interface Props {
  start?: DateTime | string;
  startIcon?: WeatherIconProps
  end?: DateTime | string;
  endIcon?: WeatherIconProps
  onDoubleClick?: () => void;
  hideDate?: boolean;
  markerStrength?: number;
  style?: CSSProperties;
  progress?: number;
  type?: 'default' | 'ghost' | 'error'
}

export default function EventProgress({ type = 'default', start: startProp, end: endProp, startIcon, endIcon, hideDate, markerStrength = 0.3, style: styleProp, progress: progressProp }: Props) {

  const start = typeof startProp === 'string' ? DateTime.fromISO(startProp) : startProp;
  const end = typeof endProp === 'string' ? DateTime.fromISO(endProp) : endProp;

  const { now } = useNow();
  const progress = (() => {
    if (typeof progressProp === 'number') return progressProp;
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

      <div className={classNames(styles.track, { [styles.track_error]: type === 'error' })} style={{ background: type === 'ghost' ? 'transparent' : undefined }} aria-hidden={typeof progress !== 'number'}>
        {typeof progress === 'number' ? (
          <>
            <div className={styles.trackFill} style={{ width: `${progress * 100}%` }} />
            <div className={styles.marker} style={{ display: type === 'ghost' ? 'none' : undefined, left: `${progress * 100}%` }} />
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
  const { i18n: { language } } = useTranslation();
  const { now } = useNow();
  const { get: { is12hour } } = useAppSettings();

  const isToday = date?.isValid && date.hasSame(now, 'day');

  const dateLabel = date?.isValid && !isToday
    ? new Intl.DateTimeFormat(language, {
      day: '2-digit',
      month: '2-digit',
    }).format(date.toJSDate())
    : undefined;

  const timeLabel = date?.isValid
    ? formatClock({ date, language, hour12: is12hour, localizedPeriod: true, short: false })
    : '--:--';

  return (
    <div className={styles.progressLabel}>
      {dateLabel && !hideDate && <span>{dateLabel}</span>}
      <span>{timeLabel}</span>
    </div>
  );
};