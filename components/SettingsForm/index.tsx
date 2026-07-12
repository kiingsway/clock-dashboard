import styles from './SettingsForm.module.scss';
import { useTranslation } from 'react-i18next';
import { UseAppSettingsReturn, Location, LOCATION_OPTIONS } from '@/hooks2/useAppSettings';
import { formatIsoTime } from '@/utils/formatters';

interface Props {
  settings: UseAppSettingsReturn
  updadetAt: string | undefined
}

export default function SettingsForm({ settings, updadetAt }: Props) {
  const { location, setLocation } = settings;

  const { t, i18n } = useTranslation();

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    i18n.changeLanguage(e.target.value);
  };

  return (
    <div className={styles.container}>
      <form onSubmit={(e) => e.preventDefault()}>

        <div className={styles.row}>
          <label htmlFor="language">{t('language')}</label>
          <select
            id="language"
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

        <hr />

        <div className={styles.row}>
          <label htmlFor="weather">{t('weather')}</label>
          <select
            id="weather"
            value={location}
            onChange={(e) => setLocation(e.target.value as Location)}>
            {LOCATION_OPTIONS.map((loc) => (
              <option key={loc} value={loc}>
                {t(`cities.${loc.split('/')[1]}`)}
              </option>
            ))}
          </select>
        </div>

        <hr />

        <div className={styles.row}>
          <label htmlFor="txtUpdadetAt">Updated at</label>
          <span>{updadetAt ? formatIsoTime(updadetAt) : '-'}</span>
        </div>

      </form>
    </div>
  );
}