import { FiMapPin } from "react-icons/fi";
import styles from "./Location.module.css";
import { UseAppSettings } from "@/types/app.types";
import useBoolean from "@/hooks/useBoolean";
import { SettingsSheet } from "@/components/overlays/SettingsSheet";

interface Props {
  /**
   * Wires up the settings sheet (language + location pickers). Omit this
   * and the badge stays a plain, non-interactive label — pass it once you
   * have your `useAppSettings`-equivalent hook ready to plug in.
   */
  settings: UseAppSettings;
  // weather: IWeather | undefined
  updatedAt?: string;
}

/** Small pin + city label shown between the date and the weather icon. */
export default function Location({ settings, updatedAt }: Props) {
  const [isSettingsOpen, { setTrue: openSettings, setFalse: closeSettings }] = useBoolean();

  const { weatherLocation: { name, country, province } } = settings;

  const locationText = `${name}${(province || country) ? `, ${(province || country)}` : ''}`

  return (
    <section className={styles.container}>
      <button type="button" className={styles.location} onClick={openSettings} aria-haspopup="dialog">
        <FiMapPin className={styles.pin} aria-hidden="true" />
        <span>{locationText}</span>
      </button>

      <SettingsSheet
        open={isSettingsOpen}
        onClose={closeSettings}
        settings={settings}
        updatedAt={updatedAt}
        onUpdatedAtClick={() => console.log("updated at clicked")}
      />
    </section>
  );
}