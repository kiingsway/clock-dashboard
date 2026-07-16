import { useEffect, useState } from "react";
import styles from "./Clock.module.css";
import { useTranslation } from "react-i18next";
import { DateTime } from "luxon";

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

  const [now, setNow] = useState<DateTime>();

  const locale =
    {
      pt: "pt-BR",
      en: "en-US",
      fr: "fr-FR",
      es: "es-ES",
      ko: "ko-KR",
    }[i18n.language.split("-")[0]] ?? "en-US";

  useEffect(() => {
    setNow(DateTime.now().setZone(timezone));

    const id = window.setInterval(() => setNow(DateTime.now().setZone(timezone)), 1000);

    return () => window.clearInterval(id);
  }, [timezone]);

  const onDebugClick = () =>
    console.info("Clock:", now?.toISO(), "Timezone:", timezone);

  const dateText = ((): string => {
    if (!now) return '-'
    return now.setLocale(locale).toLocaleString({
      day: "numeric",
      month: "long",
    });
  })()

  return (
    <header className={styles.clock} aria-label="Relógio" onDoubleClick={onDebugClick}>
      <p className={styles.time} aria-live="polite">
        {now?.toFormat("HH:mm") ?? "--:--"}
      </p>

      <p className={styles.dateLine}>
        <span className={styles.weekday}>
          {now
            ? now.setLocale(locale).toFormat("cccc").replace(/^./, (c) => c.toUpperCase())
            : "-"}
        </span>

        <span className={styles.dot} aria-hidden="true">
          ·
        </span>

        <span className={styles.date}>
          {dateText}
        </span>
      </p>
    </header>
  );
}