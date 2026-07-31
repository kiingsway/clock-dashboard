import { useTranslation } from 'react-i18next';
import styles from './AlertCardHeader.module.scss';
import { WeatherAlertData } from '@/types/weather.types';
import { Tooltip } from '@/components/Tooltip';

interface Props {
  title: string;
  until: string;
  alertType: WeatherAlertData['alert_type'];
}

export default function AlertCardHeader({ title, alertType, until }: Props) {
  const { t } = useTranslation();

  return (
    <div className={styles.headerRow}>
      <div className={styles.headerInfo}>
        <div className={styles.titleWrapper} title={title}>
          <h3 className={styles.title}>{title}</h3>
        </div>

        <span className={styles.dot}>•</span>

        <span className={styles.until}>
          {t('until')} {until}
        </span>
      </div>

      <span className={styles.typeTag}>
        <span className={styles.typeDot} />
        {alertType}
      </span>
    </div>
  )
}
