import styles from './WeekDate.module.scss';
import useNow from '@/hooks/useNow';
import { useTranslation } from 'react-i18next';

interface Props {
  timezone: string;
}

export default function WeekDate({ timezone }: Props) {
  const { i18n: { language: locale } } = useTranslation();
  const { now } = useNow({ locale, timezone });

  const dateText = ((): string => {
    if (!now) return '-'
    return now.toLocaleString({ day: "numeric", month: "long" });
  })()

  return (
    <p className={styles.dateLine}>
      <span className={styles.weekday}>
        {now
          ? now.toFormat("cccc").replace(/^./, (c) => c.toUpperCase())
          : "-"}
      </span>

      <span className={styles.dot} aria-hidden="true">·</span>

      <span className={styles.date}>
        {dateText}
      </span>
    </p>
  )
}
