import styles from "./DateHeader.module.scss";
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
  return (
    <header className={styles.header} aria-label="Relógio">
      <Clock timezone={timezone} onClick={onClockClick} />
      <WeekDate timezone={timezone} />
    </header>
  );
}