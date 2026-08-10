import WeatherIcon from '@/components/ui/weather/WeatherIcon';
import styles from '../DailyForecast.module.css';
import { DetailItem } from '@/types/app.types';

const DailyDetailItem: React.FC<DetailItem> = ({ icon, label, value, title }) => {
  return (
    <div className={styles.detailItem} title={title}>
      <span className={styles.detailIcon}>
        <WeatherIcon {...icon} size={18} />
      </span>
      <span className={styles.detailLabel}>{label}</span>
      <span className={styles.detailValue}>{value}</span>
    </div>
  );
};

export default DailyDetailItem;