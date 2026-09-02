import { FiMapPin } from "react-icons/fi";
import styles from "./Location.module.css";
import useAppSettings from "@/contexts/AppSettingsContext";
import classNames from "classnames";
import ErrorBoundary from "@/components/ui/ErrorBoundary";

interface Props {
  showAlert?: boolean;
  onClick: () => void;
}

/** Small pin + city label shown between the date and the weather icon. */
export default function Location({ showAlert = false, onClick }: Props) {
  const { weatherLocation: { name, country, province } } = useAppSettings();

  const locationText = `${name}${(province || country) ? `, ${(province || country)}` : ''}`;

  return (
    <ErrorBoundary>
      <section className={styles.container}>
        <button
          type="button"
          className={styles.location}
          onClick={onClick}
          aria-haspopup="dialog"
        >
          <FiMapPin className={styles.pin} aria-hidden="true" />
          <span className={classNames(styles.locationText, {
            [styles.hasAlert]: Boolean(showAlert),
          })}>
            {locationText}
          </span>
        </button>
      </section>
    </ErrorBoundary>
  );
}