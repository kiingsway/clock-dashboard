import WeatherIcon, { WeatherIconProps } from '@/components/ui/weather/WeatherIcon';
import styles from './ChartTooltip.module.scss';
import { CSSProperties } from 'react';

interface Props {
  title: string;
  desc?: string;
  accent?: string;
  items?: {
    label: string;
    value: string | number;
    icon?: WeatherIconProps,
    unit?: string;
    color?: string;
  }[]
}

export default function ChartTooltip({ items, title, desc, accent }: Props) {

  const style = !accent ? undefined : {
    '--wc-accent': accent
  } as CSSProperties;

  return (
    <div className={styles.tooltip} style={style}>
      <div className={styles.header}>
        <span className={styles.time}>{title}</span>

        <span className={styles.dot} />
      </div>

      <div className={styles.items}>
        {items?.map(item => {
          const { label, value, unit, color, icon } = item;

          return (
            <div className={styles.item} key={label}>
              {icon && <WeatherIcon {...icon} size={30} />}

              <span className={styles.label}>
                {label}
              </span>

              <div className={styles.values}>
                <strong className={styles.value} style={{ color }}>
                  {value}
                </strong>
                {unit && <span className={styles.unit}>
                  {unit}
                </span>}
              </div>

            </div>
          );
        })}

      </div>

      <span className={styles.description}>{desc}</span>
    </div>
  );
}
