/* eslint-disable @typescript-eslint/no-explicit-any */
import { CSSProperties, useMemo } from 'react';
import { XAxis, Tooltip, Area, AreaChart, ResponsiveContainer, ReferenceDot, YAxis } from 'recharts';
import { useTranslation } from 'react-i18next';
import { precipitationAreas, TPrecipAreas } from '..';
import getAccentColor, { getAccent } from '@/utils/weather/getAccentColor';
import { RiArrowDropRightFill } from 'react-icons/ri';
import { MAX_RAIN_MM_LIMIT, MAX_SHOWERS_MM_LIMIT, MAX_SNOWFALL_CM_LIMIT } from '@/constants/rainDescriptions';
import WeatherIcon from '../../WeatherIcon';
import { rainIntensityColor, showersIntensityColor, snowIntensityColor } from '@/utils/weather/getColors';
import PrecipitationTooltip from '../PrecipitationTooltip';
import { IPrecipChartData } from '@/types/chart.types';
import { DEFAULT_COLOR } from '@/constants/colors';

interface Props {
  data: IPrecipChartData[];
  hoursAhead: number;
}

export default function PrecipStackedAreaChart({ data, hoursAhead }: Props) {
  const { t } = useTranslation();

  const rainColor = getAccentColor('rain', true);
  const showersColor = getAccentColor('showers', true);
  const snowColor = getAccentColor('snow', true);

  // Calcula a opacidade final (de 0.1 até 0.9) baseada no maior valor do dataset
  const dynamicOpacity = useMemo(() => {
    if (!data || data.length === 0) return {
      rain: 0.1,
      showers: 0.1,
      snowfall: 0.1,
    };

    // Encontra o maior valor presente no array
    const maxRainValue = Math.max(...data.map((d) => d.rain || 0));
    const maxShowersValue = Math.max(...data.map((d) => d.showers || 0));
    const maxSnowfallValue = Math.max(...data.map((d) => d.snowfall || 0));

    // Calcula a proporção (limitando no teto de 0.9)
    const rainRatio = Math.min(maxRainValue / MAX_RAIN_MM_LIMIT, 1);
    const showersRatio = Math.min(maxShowersValue / MAX_SHOWERS_MM_LIMIT, 1);
    const snowfallRatio = Math.min(maxSnowfallValue / MAX_SNOWFALL_CM_LIMIT, 1);

    // Mapeia entre opacidade mínima (0.1) e máxima (0.9)
    return {
      rain: 0.1 + rainRatio * 0.8,
      showers: 0.1 + showersRatio * 0.8,
      snowfall: 0.1 + snowfallRatio * 0.8,
    };
  }, [data]);

  const max = useMemo(() => {
    if (!data?.length) return { rain: 0, showers: 0, snowfall: 0 };
    const rain = Math.max(...data.map(d => d.rain || 0));
    const showers = Math.max(...data.map(d => d.showers || 0));
    const snowfall = Math.max(...data.map(d => d.snowfall || 0));

    return { rain, showers, snowfall };
  }, [data]);

  const colors: Record<TPrecipAreas, { color: string, getTopColor: (value: number) => string }> = {
    rain: { color: rainColor, getTopColor: v => rainIntensityColor(v) },
    showers: { color: showersColor, getTopColor: v => showersIntensityColor(v) },
    snowfall: { color: snowColor, getTopColor: v => snowIntensityColor(v) },
  };

  const gradients = precipitationAreas.map(area => {
    const { color, getTopColor } = colors[area];

    return {
      id: area, color,
      topColor: getTopColor(max[area]),
      stopOpacity: dynamicOpacity[area]
    };
  });

  const customTicks = useMemo(() => {
    if (!data || data.length === 0) return [];

    const mod = Math.min(3, Math.max(1, Math.floor((hoursAhead - 6) / 7) + 1));

    return data
      .filter((_, index) => index === 0 || index % mod === 0)
      .map((item) => item.hour);
  }, [data, hoursAhead]);

  const paddingLeft = (() => {
    const len = Math.max(t('now').length, 3); // Força palavras com menos de 3 caracteres a contarem como 3
    return Math.round((len * 20 + 10) / 7);
  })();

  const firstData = data?.[0] as IPrecipChartData | undefined;
  const firstTop = precipitationAreas.reduce((sum, area) => sum + (firstData?.[area] || 0), 0);

  const tickFormatter = (label: string) => label === firstData?.hour ? t('now') : label;

  const firstAccent = firstData ? getAccent({ ...firstData, t }) : DEFAULT_COLOR.WEATHER;

  const maxPrecipitation = Math.max(
    10,
    ...data.map(item =>
      precipitationAreas.reduce(
        (sum, area) => sum + item[area],
        0
      )
    )
  );

  return (
    <ResponsiveContainer width="100%" height={100}>
      <AreaChart data={data}>
        <defs>
          {gradients.map(g => (
            <linearGradient key={g.id} id={g.id} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={g.topColor} stopOpacity={0.9} />
              <stop offset="95%" stopColor={g.color} stopOpacity={g.stopOpacity} />
            </linearGradient>
          ))}
        </defs>

        {firstData && firstData.rain > 0 && (
          <ReferenceDot
            x={firstData.hour}
            y={firstTop}
            shape={<Arrow accent={firstAccent} />}
          />
        )}

        <YAxis
          hide
          domain={[0, maxPrecipitation]}
        />

        <XAxis
          dataKey="hour"
          padding={{ left: paddingLeft, right: 0 }}
          interval={0}
          axisLine={false}
          tickLine={false}
          tickFormatter={tickFormatter}
          ticks={customTicks}
          tick={({ x, y, payload }) => {
            const accent = getAccent({ ...data[payload.index], t });
            return (
              <CustomTick
                x={x}
                y={y}
                value={payload.value}
                firstHour={customTicks[0]}
                accent={accent}
                hasPrecip={Boolean(firstData && firstData.rain > 0)}
              />
            );
          }}
        />
        <Tooltip wrapperStyle={{ zIndex: 99 }} content={<PrecipitationTooltip />} />
        {precipitationAreas.map(area => (
          <Area
            key={area}
            type="step"
            stackId="a"
            isAnimationActive
            dataKey={area}
            fill={`url(#${area})`}
            stroke="none"
            strokeWidth={3}
            dot={area === 'showers' ? <CustomAreaDot /> : undefined}
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  );
}

interface CustomTickProps {
  x: string | number;
  y: string | number;
  value: string | number;
  firstHour: string;
  accent: string
  hasPrecip: boolean;
}

const CustomTick = ({ x, y, value, firstHour, accent, hasPrecip }: CustomTickProps) => {
  const { t } = useTranslation();

  const isFirstHour = value === firstHour; // Verifica se é o primeiro item

  const { fill, fontWeight, fontSize, opacity, label } = {
    fill: isFirstHour ? 'var(--wc-accent)' : '#94a3b8',
    fontWeight: isFirstHour && hasPrecip ? 700 : hasPrecip || isFirstHour ? 500 : 400,
    fontSize: isFirstHour ? 13 : hasPrecip ? 12 : 11,
    opacity: isFirstHour && hasPrecip ? 1 : hasPrecip ? 0.6 : isFirstHour ? 0.7 : 0.4,
    label: isFirstHour ? t('now') : value,
  };

  return (
    <g
      style={{ '--wc-accent': accent } as CSSProperties}
      transform={`translate(${x},${y})`}>
      <text
        x={0}
        y={0}
        dy={12}
        textAnchor="middle"
        fill={fill}
        fontWeight={fontWeight}
        fontSize={fontSize}
        opacity={opacity}
      >
        {label}
      </text>
    </g>
  );
};

const Arrow = ({ cx, cy, accent }: any & { accent: string }) => (
  <RiArrowDropRightFill
    x={cx - 12}
    y={cy - 12}
    size={24}
    color={accent}
  />
);

const CustomAreaDot = (props: any) => {
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