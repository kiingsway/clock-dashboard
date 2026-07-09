import type { FC } from "react";
import { formatClock, formatDateNoYear } from "../helpers/dateTime";
import styles from "./Clock.module.css";

export interface ClockProps {
  /** Current time, lifted up so the dashboard can drive both the clock
   * and the ambient sky background from a single ticking source. */
  now: Date;
}

export const Clock: FC<ClockProps> = ({ now }) => {
  const time = formatClock(now);
  const date = formatDateNoYear(now);

  return (
    <div className={styles.clock}>
      <time className={styles.time} dateTime={now.toISOString()}>
        {time}
      </time>
      <p className={styles.date}>{date}</p>
    </div>
  );
};
