import { CSSProperties } from 'react';
import styles from './HourlyCard.module.scss';
import { Tooltip } from '../../Tooltip';
import WeatherIcon, { WeatherIconProps } from '../WeatherIcon';
import { RainGauge } from '../RainGauge';

export interface HourlyCardProps {
  as?: 'li' | 'div';
  hour: string;
  subhour?: string | number;
  hideSubhour?: boolean;
  hourTooltip: string;
  icon: WeatherIconProps;
  temp: number;
  tempUnit?: string;
  feelsLike: number;
  feelsLikeUnit?: string;
  precipitation: number;
  accent: string;
  accentPeak: string;
}

export default function HourlyCard({
  as: Component = 'div',
  precipitation, icon, feelsLike, hour, temp, subhour, hideSubhour,
  tempUnit = 'ºC',
  feelsLikeUnit = 'ºC',
  hourTooltip,
  accent, accentPeak
}: HourlyCardProps) {
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
        <WeatherIcon {...icon} size={40} />
      </div>

      <span className={styles.temp}>
        {temp + tempUnit}
      </span>

      <span className={styles.feels}>
        {feelsLike + feelsLikeUnit}
      </span>

      <RainGauge mm={precipitation} />
    </Component>
  )
}
