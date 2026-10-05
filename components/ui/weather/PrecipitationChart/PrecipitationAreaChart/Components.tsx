import { IPrecipChartData } from "@/types/chart.types";
import { CSSProperties } from "react";
import { RiArrowDropRightFill } from "react-icons/ri";
import WeatherIcon from "../../WeatherIcon";

interface CustomTickProps {
  x: string | number;
  y: string | number;
  accent: string
  label: string
  hasPrecip: boolean;
  isFirstItem: boolean;
}

export const CustomTick = ({ x, y, accent, hasPrecip, isFirstItem, label }: CustomTickProps) => {

  const style = {
    textAnchor: 'middle',
    fill: isFirstItem ? 'var(--wc-accent)' : '#94a3b8',
    fontWeight: isFirstItem && hasPrecip ? 700 : hasPrecip || isFirstItem ? 500 : 400,
    fontSize: isFirstItem ? 13 : hasPrecip ? 12 : 11,
    opacity: isFirstItem && hasPrecip ? 1 : hasPrecip ? 0.6 : isFirstItem ? 0.7 : 0.4,
  } as const;

  return (
    <g
      style={{ '--wc-accent': accent } as CSSProperties}
      transform={`translate(${x},${y})`}>
      <text x={0} y={0} dy={12} {...style}>
        {label}
      </text>
    </g>
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const Arrow = ({ cx, cy, accent }: { accent: string } & any) => (
  <RiArrowDropRightFill
    x={cx - 12}
    y={cy - 12}
    size={24}
    color={accent}
  />
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const CustomAreaDot = (props: any) => {
  const { cx, cy, payload: p } = props;
  const payload = p as IPrecipChartData;

  const no = {
    rain: !payload.rain || payload.rain <= 0,
    showers: !payload.showers || payload.showers <= 0,
    snowfall: !payload.snowfall || payload.snowfall <= 0,
  };

  if (no.rain && no.showers && no.snowfall) return null;

  const size = 30;

  return (
    <foreignObject
      x={cx - (size / 2)}
      y={(cy - (size + 2)) + 2}
      width={size}
      height={size}
    >
      <WeatherIcon
        size={size}
        weatherCode={payload.weatherCode}
        hideGlow
      />
    </foreignObject>
  );
};