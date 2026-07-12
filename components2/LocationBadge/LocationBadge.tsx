import { FiMapPin } from "react-icons/fi";
import styles from "./LocationBadge.module.css";
import { useState } from "react";
import { SettingsModal } from "../SettingsModal/SettingsModal";
import { UseAppSettingsReturn } from "@/hooks2/useAppSettings";

export interface LocationBadgeProps {
  /**
   * Wires up the settings sheet (language + location pickers). Omit this
   * and the badge stays a plain, non-interactive label — pass it once you
   * have your `useAppSettings`-equivalent hook ready to plug in.
   */
  settings: UseAppSettingsReturn;
  timezone: string
  updatedAt?: string
}

/** Small pin + city label shown between the date and the weather icon. */
export function LocationBadge({ settings, timezone, updatedAt }: LocationBadgeProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section className={styles.container}>
      <button type="button" className={styles.location} onClick={() => setIsOpen(true)} aria-haspopup="dialog">
        <FiMapPin className={styles.pin} aria-hidden="true" />
        <span>{settings.weatherLocation.name}</span>
      </button>

      <SettingsModal
        open={isOpen}
        onClose={() => setIsOpen(false)}
        timeZone={timezone}
        settings={settings}
        updatedAt={updatedAt}
      />
    </section>
  );
}
