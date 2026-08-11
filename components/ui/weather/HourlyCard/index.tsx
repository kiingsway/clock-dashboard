import { CSSProperties, ReactNode } from 'react';
import styles from './HourlyCard.module.scss';

interface Props {
  as?: 'li' | 'div';
  hour: string;
  hourTooltip: string;
  icon: ReactNode;
  temp: string;
  feels: string;
  desc: ReactNode;
  accent: string;
  accentPeak: string;
}

export default function HourlyCard({
  as: Component = 'div',
  desc, icon, feels, hour, temp,
  hourTooltip,
  accent, accentPeak
}: Props) {
  return (
    <Component className={styles.card} style={{
      "--wc-accent": accent,
      "--wc-accent-peak": accentPeak,
    } as CSSProperties}>
      <span className={styles.hour} title={hourTooltip}>
        {hour}
      </span>

      {icon}

      <span className={styles.temp}>
        {temp}
      </span>

      <span className={styles.feels}>
        {feels}
      </span>

      {desc}
    </Component>
  )
}
