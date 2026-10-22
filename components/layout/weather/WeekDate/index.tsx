import { useToday } from '@/contexts/NowContext';
import styles from './WeekDate.module.scss';

export default function WeekDate() {
  const today = useToday();

  const dateText = ((): string => {
    if (!today) return '-';
    return today.toLocaleString({ day: "numeric", month: "long" });
  })();

  return (
    <p className={styles.dateLine}>
      <span className={styles.weekday}>
        {today
          ? today.toFormat("cccc").replace(/^./, (c) => c.toUpperCase())
          : "-"}
      </span>

      <span className={styles.dot} aria-hidden="true">·</span>

      <span className={styles.date}>
        {dateText}
      </span>
    </p>
  );
}
