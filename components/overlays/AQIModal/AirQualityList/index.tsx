import { AirQualityMetric } from '@/types/aqi.types';
import styles from './AirQualityList.module.css';

interface AirQualityListProps {
  items: AirQualityMetric[];
}

export default function AirQualityList({ items }: AirQualityListProps) {
  return (
    <div className={styles.list}>
      {items.map((item) => (
        <AirQualityCard key={item.label} item={item} />
      ))}
    </div>
  );
}

interface AirQualityCardProps {
  item: AirQualityMetric;
}

function AirQualityCard({ item }: AirQualityCardProps) {
  const { label, value, value2, unit, unit2, level, desc, color } = item;

  return (
    <article
      className={styles.card}
      style={{ '--metric-accent': color } as React.CSSProperties}
    >
      <div className={styles.info}>

        <div className={styles.infoColumn}>
          <h2 className={styles.label}>{label}</h2>
          <span className={styles.level} style={{ visibility: level ? 'visible' : 'hidden' }}>{level ?? '-'}</span>
        </div>

        <div className={styles.values}>

          {(value2 || typeof value2 === 'number') && (
            <div className={styles.valueColumn2}>
              <h3 className={styles.value}>{value2}</h3>
              <span className={styles.unit}>{unit2}</span>
            </div>)}

          <div className={styles.valueColumn}>
            <h3 className={styles.value}>{value}</h3>
            <span className={styles.unit}>{unit}</span>
          </div>

        </div>

      </div>

      {desc && <p className={styles.desc}>{desc}</p>}

    </article>
  );
}