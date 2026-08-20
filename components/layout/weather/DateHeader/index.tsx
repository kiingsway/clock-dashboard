import styles from "./DateHeader.module.scss";
import Clock from "../Clock";
import WeekDate from "../WeekDate";

interface Props {
  onClick?: () => void
}

/**
 * Live HH:mm clock with full weekday name and localized long date
 * ("10 de julho" / "July 10"). Ticks every second internally so the minute
 * rolls over on its own — the host app never needs to re-render this.
 */
export function DateHeader({ onClick }: Props) {
  return (
    <header className={styles.header} aria-label="Relógio" onClick={onClick}>
      <Clock />
      <WeekDate />
    </header>
  );
}