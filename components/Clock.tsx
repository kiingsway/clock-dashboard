import type { FC } from "react";
import { formatClock, formatDateNoYear } from "../helpers/dateTime";
import styles from "./Clock.module.css";
import classNames from "classnames";
import { ibmPlexMono } from "@/styles/fonts";


export interface ClockProps {
  /** Current time, lifted up so the dashboard can drive both the clock
   * and the ambient sky background from a single ticking source. */
  now: Date;
}

export const Clock: FC<ClockProps> = ({ now }) => {
  const time = formatClock(now);
  const date = formatDateNoYear(now)

  return (
    <div className={styles.clock}>
      <time className={classNames(styles.time, ibmPlexMono.className)} dateTime={now.toISOString()}>
        {time}
      </time>
      <div className={styles.datetime}>
        <p className={classNames(styles.date, ibmPlexMono.className)}>{date.date}</p>
        <p className={classNames(styles.date, ibmPlexMono.className)}>{date.weekday}</p>
      </div>
    </div>
  );
};
