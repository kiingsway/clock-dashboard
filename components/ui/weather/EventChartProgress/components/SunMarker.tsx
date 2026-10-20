import { CSSProperties } from 'react';
import styles from '../EventChartProgress.module.scss';

interface Props {
  /** Injetados pelo ReferenceDot do Recharts. */
  cx?: number;
  cy?: number;
  color: string;
  size?: number;
  blur?: string;
  spread?: string;
}

export default function SunMarker({ cx, cy, color, size = 5, blur = '15px', spread = '3px' }: Props) {
  if (cx === undefined || cy === undefined) return null;

  const style = {
    '--blur': blur,
    '--spread': spread,
    '--marker-color': color,
  } as CSSProperties;

  // box-shadow não funciona em elementos SVG, por isso a bolinha é uma div.
  return (
    <foreignObject
      x={cx - size}
      y={cy - size}
      width={size * 2}
      height={size * 2}
      overflow="visible"
      pointerEvents="none"
    >
      <div className={styles.marker} style={style} />
    </foreignObject>
  );
}
