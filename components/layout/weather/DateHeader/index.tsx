import { useEffect, useState } from "react";
import styles from "./DateHeader.module.scss";
import { useTranslation } from "react-i18next";
import { DateTime } from "luxon";
import getAppLocale from "@/utils/formatters/getAppLocale";
import Clock from "../Clock";
import WeekDate from "../WeekDate";

export interface ClockProps {
  /**
   * IANA timezone of the forecast location (e.g. `weather.timezone` from the
   * API payload). When omitted, falls back to the device's local time.
   */
  timezone: string;
  onClockClick?: () => void
}

/**
 * Live HH:mm clock with full weekday name and localized long date
 * ("10 de julho" / "July 10"). Ticks every second internally so the minute
 * rolls over on its own — the host app never needs to re-render this.
 */
export function DateHeader({ timezone, onClockClick }: ClockProps) {
  const [now, setNow] = useState<DateTime>();
  const { i18n } = useTranslation();
  const locale = getAppLocale(i18n.language);

  useEffect(() => {
    setNow(DateTime.now().setZone(timezone));

    const id = window.setInterval(() => setNow(DateTime.now().setZone(timezone)), 1000);
    return () => window.clearInterval(id);
  }, [timezone]);

  const onDebugClick = () => console.info("Clock:", now?.toISO(), "Timezone:", timezone);

  return (
    <header className={styles.header} aria-label="Relógio" onDoubleClick={onDebugClick}>
      <Clock timezone={timezone} onClick={onClockClick} />
      <WeekDate now={now} locale={locale} />
    </header>
  );
}