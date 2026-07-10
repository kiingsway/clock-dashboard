import { useEffect, useState } from "react";
import styles from "./Clock.module.css";
import { SupportedLocale } from "@/types2/weather.types";
import { formatClockTime, formatWeekdayLong, formatLongDate } from "@/utils/formatters";

export interface ClockProps {
  /** UI language for the weekday/date strings. */
  locale: SupportedLocale;
  /**
   * IANA timezone of the forecast location (e.g. `weather.timezone` from the
   * API payload). When omitted, falls back to the device's local time.
   */
  timeZone?: string;
}

/**
 * Live HH:mm clock with full weekday name and localized long date
 * ("10 de julho" / "July 10"). Ticks every second internally so the minute
 * rolls over on its own — the host app never needs to re-render this.
 */
export function Clock({ locale, timeZone }: ClockProps) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <header className={styles.clock} aria-label="Relógio">
      <p className={styles.time} aria-live="polite">
        {formatClockTime(now, timeZone)}
      </p>
      <p className={styles.dateLine}>
        <span className={styles.weekday}>{formatWeekdayLong(now, locale, timeZone)}</span>
        <span className={styles.dot} aria-hidden="true">
          ·
        </span>
        <span className={styles.date}>{formatLongDate(now, locale, timeZone)}</span>
      </p>
    </header>
  );
}
