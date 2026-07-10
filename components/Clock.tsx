import type { FC } from "react";
import { formatClock, formatDateNoYear } from "../helpers/dateTime";
import styles from "./Clock.module.css";
import { IBM_Plex_Mono } from "next/font/google";
import classNames from "classnames";

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export interface ClockProps {
  /** Current time, lifted up so the dashboard can drive both the clock
   * and the ambient sky background from a single ticking source. */
  now: Date;
}

export const Clock: FC<ClockProps> = ({ now }) => {
  const time = formatClock(now);
  const date = formatDateNoYear(now).toLowerCase();

  return (
    <div className={styles.clock}>
      <time className={classNames(styles.time, ibmPlexMono.className)} dateTime={now.toISOString()}>
        {time}
      </time>
      <p className={classNames(styles.date, ibmPlexMono.className)}>{date}</p>
    </div>
  );
};
