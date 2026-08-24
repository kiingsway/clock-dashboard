import React, { useId, useMemo } from 'react';
import {
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  ReferenceDot,
  ReferenceLine,
  ResponsiveContainer,
} from 'recharts';

export interface ZoneGaugeBarProps {
  value: number;
  valueLabel?: (value: number) => string
  min?: number;
  max?: number;
  unit?: string;
  height?: number;
  hideZoneLabel?: boolean;
  zones: {
    value: number;
    color: string;
  }[];
  referenceZones?: {
    value: number;
    label: string;
  }[]
}

const clamp = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v));

export default function ZoneGaugeBar({
  value,
  valueLabel,
  zones,
  min = zones?.[0]?.value ?? 0,
  max = zones?.[(zones?.length || 0) - 1]?.value ?? 0,
  unit,
  height = 87,
  hideZoneLabel,
  referenceZones
}: ZoneGaugeBarProps) {
  const rawId = useId();

  const gradientId = `zone-gauge-gradient-${rawId.replace(
    /[^a-zA-Z0-9]/g,
    ""
  )}`;

  const clampedValue = clamp(value, min, max);

  const normalizedZones = useMemo(() => {
    return zones
      .map((zone) => ({
        ...zone,
        value: clamp(zone.value, min, max),
      }))
      .sort((a, b) => a.value - b.value);
  }, [zones, min, max]);

  const phaseColor = useMemo(() => {
    let color = normalizedZones[0]?.color ?? "#38bdf8";

    for (const zone of normalizedZones) {
      if (clampedValue >= zone.value) {
        color = zone.color;
      } else {
        break;
      }
    }

    return color;
  }, [clampedValue, normalizedZones]);

  // const data = [{ row: "gauge", full: max }];
  const data = [
    {
      row: "gauge",
      offset: min,
      full: max - min,
    },
  ];

  const toPct = (v: number) =>
    ((clamp(v, min, max) - min) / (max - min)) * 100;

  return (
    <div>
      <div style={{ width: "100%", height }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={data}
            layout="vertical"
            margin={{ top: 36, right: 24, bottom: 28, left: 24 }}
          >
            <defs>
              <linearGradient
                id={gradientId}
                x1="0"
                y1="0"
                x2="1"
                y2="0"
              >
                {normalizedZones.flatMap((zone, index) => {
                  const previousZone =
                    normalizedZones[index - 1];

                  const previousColor =
                    previousZone?.color ?? zone.color;

                  const offset = toPct(zone.value);

                  return [
                    <stop
                      key={`${zone.value}-before`}
                      offset={`${offset}%`}
                      stopColor={previousColor}
                    />,
                    <stop
                      key={`${zone.value}-after`}
                      offset={`${offset}%`}
                      stopColor={zone.color}
                    />,
                  ];
                })}

                <stop
                  offset="100%"
                  stopColor={
                    normalizedZones.at(-1)?.color ??
                    "#38bdf8"
                  }
                />
              </linearGradient>
            </defs>

            <XAxis
              type="number"
              domain={[min, max]}
              hide
            />

            <YAxis
              type="category"
              dataKey="row"
              hide
            />

            <Bar
              dataKey="offset"
              stackId="gauge"
              fill="transparent"
              stroke="none"
              barSize={10}
            />

            <Bar
              dataKey="full"
              stackId="gauge"
              fill={`url(#${gradientId})`}
              stroke="rgba(255,255,255,0.14)"
              strokeWidth={1}
              radius={5}
              barSize={10}
            />

            {referenceZones?.map(({ label, value }) => (
              <ReferenceLine
                key={value}
                x={value}
                stroke="rgba(255,255,255,0.8)"
                strokeWidth={3}
                ifOverflow="visible"
                label={{
                  value: label,
                  position: "bottom",
                  fill: "rgba(255,255,255,0.55)",
                  fontSize: 11,
                  fontWeight: 600,
                  offset: 10,
                }}
              />
            ))}

            {normalizedZones.map(({ value }, index) => (value === min || value === max) ? null : (
              <ReferenceLine
                key={`${value}-${index}`}
                x={value}
                stroke="rgba(255,255,255,0.45)"
                strokeWidth={1}
                ifOverflow="visible"
                label={{
                  value: hideZoneLabel ? undefined : `${value}${unit ?? ""}`,
                  position: "bottom",
                  fill: "rgba(255,255,255,0.55)",
                  fontSize: 11,
                  fontWeight: 600,
                  offset: 10,
                }}
              />
            ))}

            <ReferenceDot
              x={clampedValue}
              y="gauge"
              r={13}
              fill={phaseColor}
              fillOpacity={0.25}
              stroke="none"
              ifOverflow="visible"
            />

            <ReferenceDot
              x={clampedValue}
              y="gauge"
              r={7}
              fill="#ffffff"
              stroke={phaseColor}
              strokeWidth={3}
              ifOverflow="visible"
              label={{
                value: valueLabel ? valueLabel(value) : `${value}${unit ?? ""}`,
                position: "top",
                fill: phaseColor,
                fontSize: 16,
                fontWeight: 700,
                offset: 14,
              }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}