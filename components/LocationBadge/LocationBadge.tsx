import { FiMapPin } from "react-icons/fi";
import styles from "./LocationBadge.module.css";
import { useState } from "react";
import { SettingsModal } from "../SettingsModal/SettingsModal";
import { UseAppSettings } from "@/hooks/useAppSettings";
import { IWeather } from "@/types/weather.types";
import useBoolean from "@/hooks/useBoolean";

export interface LocationBadgeProps {
  /**
   * Wires up the settings sheet (language + location pickers). Omit this
   * and the badge stays a plain, non-interactive label — pass it once you
   * have your `useAppSettings`-equivalent hook ready to plug in.
   */
  settings: UseAppSettings;
  updatedAt?: string
}

/** Small pin + city label shown between the date and the weather icon. */
export function LocationBadge({ settings, updatedAt }: LocationBadgeProps) {
  const [isSettingsOpen, { setTrue: openSettings, setFalse: closeSettings }] = useBoolean()

  return (
    <section className={styles.container}>
      <button type="button" className={styles.location} onClick={openSettings} aria-haspopup="dialog">
        <FiMapPin className={styles.pin} aria-hidden="true" />
        <span>{settings.weatherLocation.name}</span>
      </button>

      <SettingsModal
        open={isSettingsOpen}
        onClose={closeSettings}
        settings={settings}
        updatedAt={updatedAt}
      />
    </section>
  );
}
