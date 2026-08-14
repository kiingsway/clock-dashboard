import styles from './CurrentTemperature.module.scss';
import { CSSProperties } from 'react';

interface Props {
  temp: number | undefined;
  unit: string;
  style?: CSSProperties;
}

export default function CurrentTemperature({ temp, unit, style }: Props) {
  return (
    <p className={styles.temp} style={style}>
      {temp ? Math.round(temp) : '-'}
      <span className={styles.tempUnit}>{unit}</span>
    </p>
  )
}
