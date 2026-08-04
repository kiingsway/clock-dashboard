import { UseAppSettings } from '@/types/app.types';
import { DateTime } from 'luxon';
import { useTranslation } from 'react-i18next';
import styles from './SettingsModal.module.css';
import { LOCATION_OPTIONS } from '@/constants/locations';
import { TLocation } from '@/types/location.types';
import { APP_INFO } from '@/constants/appInfo';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';

interface Props {
  open: boolean;
  onClose: () => void;
  settings: UseAppSettings
  updatedAt?: string;
  onUpdatedAtClick?: () => void
}

/**
 * Settings sheet opened from the location badge: language, forecast
 * location, and when the data was last refreshed. Purely presentational —
 * `language`/`location` and their change handlers are controlled by
 * whatever the host app already uses for that (e.g. the `useAppSettings`
 * hook and `i18n.changeLanguage` in the reference `SettingsForm`).
 */
export function SettingsModal({ open, onClose, onUpdatedAtClick, settings, updatedAt }: Props) {
  const { t, i18n } = useTranslation();
  const { location, setLocation } = settings;

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    i18n.changeLanguage(e.target.value);
  };

  const updatedAtHour = updatedAt ? DateTime.fromISO(updatedAt, { zone: settings.location }).toFormat('HH:mm') : '--:--'

  return (
    <Modal open={open} onClose={onClose} title={t('settings')} closeLabel={t('close')}>
      <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
        <div className={styles.row}>
          <label htmlFor="language">{t('language')}</label>
          <select
            id="language"
            className={styles.select}
            value={i18n.language}
            onChange={handleLanguageChange}
          >
            <option value="pt">Português</option>
            <option value="en">English</option>
            <option value="fr">Français</option>
            <option value="es">Español</option>
            <option value="ko">한국어</option>
          </select>
        </div>

        <div className={styles.divider} />

        <div className={styles.row}>
          <label htmlFor="location">{t('location')}</label>
          <select
            id="location"
            className={styles.select}
            value={location}
            onChange={(e) => setLocation(e.target.value as TLocation)}>
            {LOCATION_OPTIONS.map((loc) => (
              <option key={loc} value={loc}>
                {t(`cities.${loc.split('/')[1]}`)}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.divider} />
        <div className={styles.row}>
          <span className={styles.staticLabel}>DELTA/KM</span>
          <span className={styles.staticValue}>TESTE</span>
        </div>

        <div className={styles.divider} />
        <div className={styles.row} onDoubleClick={onUpdatedAtClick}>
          <span className={styles.staticLabel}>{t('updatedAt')}</span>
          <span className={styles.staticValue}>{updatedAtHour}</span>
        </div>

        <div className={styles.divider} />
        <div className={styles.row}>
          <span className={styles.staticLabel}>{t('version')}</span>
          <span className={styles.staticValue}>{APP_INFO.isDev && <Badge variant="accent">DEV</Badge>} {APP_INFO.version}</span>
        </div>

      </form>
    </Modal>
  )
}
