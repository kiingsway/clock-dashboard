import { DateTime } from 'luxon';
import styles from './WeekDate.module.scss';

interface Props {
  now: DateTime<boolean> | undefined
  locale: string;
}

export default function WeekDate({ now, locale }: Props) {

  const dateText = ((): string => {
    if (!now) return '-'
    return now.setLocale(locale).toLocaleString({
      day: "numeric",
      month: "long",
    });
  })()

  return (
    <p className={styles.dateLine}>
      <span className={styles.weekday}>
        {now
          ? now.setLocale(locale).toFormat("cccc").replace(/^./, (c) => c.toUpperCase())
          : "-"}
      </span>

      <span className={styles.dot} aria-hidden="true">·</span>

      <span className={styles.date}>
        {dateText}
      </span>
    </p>
  )
}
