import { useEffect, useState } from "react";
import styles from "./Clock.module.css";
import { formatClockTime, formatWeekdayLong, formatLongDate } from "@/utils/formatters";
import { useTranslation } from "react-i18next";

export interface ClockProps {
  /**
   * IANA timezone of the forecast location (e.g. `weather.timezone` from the
   * API payload). When omitted, falls back to the device's local time.
   */
  timezone: string;
}

/**
 * Live HH:mm clock with full weekday name and localized long date
 * ("10 de julho" / "July 10"). Ticks every second internally so the minute
 * rolls over on its own — the host app never needs to re-render this.
 */
export function Clock({ timezone }: ClockProps) {
  const { i18n } = useTranslation();
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const onDebugClick = () => console.info(`Clock tick: ${now.toISOString()} (${now.getTime()}). Timezone?`, timezone);

  return (
    <header className={styles.clock} aria-label="Relógio" onDoubleClick={onDebugClick}>
      <p className={styles.time} aria-live="polite">
        {formatClockTime(now, timezone)}
      </p>
      <p className={styles.dateLine}>
        <span className={styles.weekday}>{formatWeekdayLong(now, i18n.language, timezone)}</span>
        <span className={styles.dot} aria-hidden="true">
          ·
        </span>
        <span className={styles.date}>{formatLongDate(now, i18n.language, timezone)}</span>
      </p>
    </header>
  );
}
