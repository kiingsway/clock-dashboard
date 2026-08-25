import { useNow } from '@/contexts/NowContext';
import styles from './WeekDate.module.scss';

export default function WeekDate() {
  const { now } = useNow();

  const dateText = ((): string => {
    if (!now) return '-';
    return now.toLocaleString({ day: "numeric", month: "long" });
  })();

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
  );
}
