import { useId } from "react";
import { Line, LineChart, ReferenceDot, ReferenceLine, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { GradientStop, SunPathPoint } from "../types";
import WeatherGradient from "./WeatherGradient";
import SunMarker from "./SunMarker";
import splitElapsedStops from "../splitElapsedStops";
import styles from '../EventChartProgress.module.scss';

interface Props {
  data: SunPathPoint[];
  stops: GradientStop[];
  start: number; // epoch ms
  end: number; // epoch ms
  marker?: SunPathPoint & { color: string };
  strokeWidth?: number;
  /** 0..1 – quanto de preto é misturado na linha antes do "agora". */
  elapsedDarkening?: number;
}

const FALLBACK_STROKE = 'var(--wc-accent)';
const MARGIN = 12;

export default function SunPathChart({ data, stops, start, end, marker, strokeWidth = 3, elapsedDarkening = 0.5 }: Props) {
  const gradientId = `sun-path-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;

  // Sem bolinha (fora do período ou fullDay que não é hoje), a linha fica toda na cor original.
  const paintStops = marker
    ? splitElapsedStops(stops, (marker.time - start) / (end - start), elapsedDarkening)
    : stops;

  const elevations = data.map(p => p.elevation);
  // O horizonte (0) sempre faz parte do domínio: fica embaixo de dia e em cima à noite.
  const domain = [Math.min(0, ...elevations), Math.max(0, ...elevations)];

  const stroke = stops.length ? `url(#${gradientId})` : FALLBACK_STROKE;

  return (
    <div className={styles.chart}>
      <ResponsiveContainer width="100%" height={40}>
        <LineChart
          data={data}
          margin={{ top: MARGIN, right: MARGIN, bottom: MARGIN, left: MARGIN }}
        >
          <defs>
            <WeatherGradient id={gradientId} stops={paintStops} />
          </defs>

          <XAxis dataKey="time" type="number" domain={[start, end]} hide />
          <YAxis domain={domain} hide />

          <ReferenceLine y={0} className={styles.horizon} ifOverflow="visible" />

          <Line
            dataKey="elevation"
            type="monotone"
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            dot={false}
            activeDot={false}
            isAnimationActive={false}
          />

          {marker && (
            <ReferenceDot
              x={marker.time}
              y={marker.elevation}
              ifOverflow="visible"
              shape={<SunMarker color={marker.color} />}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
