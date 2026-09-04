import { useTranslation } from 'react-i18next';
import styles from './Clock.module.scss';
import { useNow } from '@/contexts/NowContext';
import { formatClock } from '@/utils/formatters/formatClock';
import { CSSProperties, useMemo } from 'react';
import useAppSettings from '@/contexts/AppSettingsContext';

interface Props {
  onClick?: () => void;
  onDoubleClick?: () => void;
}

export default function Clock({ onClick, onDoubleClick }: Props) {
  const { now } = useNow();
  const { i18n: { language } } = useTranslation();
  const { get: { is12hour } } = useAppSettings();

  const time = useMemo(() => formatClock({ date: now, language, hour12: is12hour, localizedPeriod: false }), [is12hour, language, now]);

  const style = {
    fontSize: `var(--wc-text-${is12hour ? '4' : '5'}xl)`,
  } as CSSProperties;

  return (
    <p className={styles.time} style={style} aria-live="polite" onClick={onClick} onDoubleClick={onDoubleClick}>
      {time}
    </p>
  );
}
