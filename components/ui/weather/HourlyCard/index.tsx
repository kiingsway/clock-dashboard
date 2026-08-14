import { CSSProperties, ReactNode } from 'react';
import styles from './HourlyCard.module.scss';
import { Tooltip } from '../../Tooltip';

interface Props {
  as?: 'li' | 'div';
  hour: string;
  subhour?: string | number;
  hideSubhour?: boolean;
  hourTooltip: string;
  icon: ReactNode;
  temp: number;
  tempUnit?: string;
  feelsLike: number;
  feelsLikeUnit?: string;
  desc: ReactNode;
  accent: string;
  accentPeak: string;
}

export default function HourlyCard({
  as: Component = 'div',
  desc, icon, feelsLike, hour, temp, subhour, hideSubhour,
  tempUnit = 'ºC',
  feelsLikeUnit = 'ºC',
  hourTooltip,
  accent, accentPeak
}: Props) {
  return (
    <Component className={styles.card} style={{
      "--wc-accent": accent,
      "--wc-accent-peak": accentPeak,
    } as CSSProperties}>
      <Tooltip content={hourTooltip}>
        <div className={styles.hour} title={hourTooltip}>

          <span>{hour}</span>
          {subhour && <small style={{ visibility: hideSubhour ? 'hidden' : undefined }}>{subhour}</small>}
        </div>
      </Tooltip>

      <div className={styles.icon}>
        {icon}
      </div>

      <span className={styles.temp}>
        {temp + tempUnit}
      </span>

      <span className={styles.feels}>
        {feelsLike + feelsLikeUnit}
      </span>

      {desc}
    </Component>
  )
}
