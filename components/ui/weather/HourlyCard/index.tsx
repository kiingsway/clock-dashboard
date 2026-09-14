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
  temp: number | null;
  tempUnit?: string;
  feelsLike: number | null;
  feelsLikeUnit?: string;
  precipitation: number;
  accent: string;
  accentPeak: string;
}

const isNumber = (n: unknown): n is number => typeof n === 'number';

export default function HourlyCard({
  as: Component = 'li',
  precipitation, icon, feelsLike, hour, temp, subhour, hideSubhour,
  tempUnit = 'ºC',
  feelsLikeUnit = 'ºC',
  hourTooltip,
  accent, accentPeak
}: HourlyCardProps) {

  const onDoubleClick = (): void => console.info({ temp, feelsLike, icon });

  const style = {
    "--wc-accent": accent,
    "--wc-accent-peak": accentPeak,
  } as CSSProperties;

  const hasTemp = isNumber(feelsLike);
  const hasFeelsLike = isNumber(feelsLike);

  return (
    <Component className={styles.card} style={style} onDoubleClick={onDoubleClick}>
      <Tooltip content={hourTooltip}>
        <div className={styles.hour} title={hourTooltip}>

          <span>{hour}</span>
          {subhour && <small style={{ visibility: hideSubhour ? 'hidden' : undefined }}>{subhour}</small>}
        </div>
      </Tooltip>

      <div className={styles.icon}>
        <WeatherIcon {...icon} size={40} />
      </div>

      {<span className={styles.temp}>
        {hasTemp ? temp + tempUnit : '—'}
      </span>}

      <span className={styles.feels}>
        {hasFeelsLike ? feelsLike + feelsLikeUnit : '—'}
      </span>

      <RainGauge mm={precipitation ?? 0} />
    </Component>
  );
}
