import { useMemo, useState } from 'react';
import { XAxis, Tooltip, Area, AreaChart, ResponsiveContainer, ReferenceDot, YAxis } from 'recharts';
import { useTranslation } from 'react-i18next';
import { precipitationAreas, TPrecipAreas } from '..';
import { getCategoryAccent } from '@/utils/weather/getWeatherCodeInfo';
import { MAX_RAIN_MM_LIMIT, MAX_SHOWERS_MM_LIMIT, MAX_SNOWFALL_CM_LIMIT } from '@/constants/rainDescriptions';
import { rainIntensityColor, showersIntensityColor, snowIntensityColor } from '@/utils/weather/getColors';
import PrecipitationTooltip from '../PrecipitationTooltip';
import { IPrecipChartData } from '@/types/chart.types';
import { DEFAULT_COLOR } from '@/constants/colors';
import getWeatherCodeInfo from '@/utils/weather/getWeatherCodeInfo';
import useAppSettings from '@/contexts/AppSettingsContext';
import { DateTime } from 'luxon';
import { formatClock } from '@/utils/formatters/formatClock';
import { Arrow, CustomAreaDot } from './Components';
import CustomTick, { getTickFont } from '../../TempAreaChart2/CustomTick';
import { EDGE_INSET, getNowLabelEnd, tickFits } from '@/utils/charts/edgeLabels';

// Sem margem lateral: a área encosta nas bordas da tela.
const CHART_MARGIN = { top: 5, right: 0, left: 0, bottom: 5 };
// Os textos herdam a fonte do .main (PrecipitationChart.module.scss); usada para medir os rótulos.
const TICK_FONT_FAMILY = 'var(--wc-font-display)';

const tickFont = (isFirstItem: boolean, hasPrecip: boolean) =>
  ({ ...getTickFont(isFirstItem, hasPrecip), fontFamily: TICK_FONT_FAMILY });

interface Props {
  data: IPrecipChartData[];
  hoursAhead: number;
  height: number;
}

export default function PrecipStackedAreaChart({ data, hoursAhead, height }: Props) {
  const { t, i18n: { language } } = useTranslation();
  const { get: { is12hour } } = useAppSettings();
  // Largura do gráfico, para manter rótulos e ícones das pontas dentro da tela.
  const [chartWidth, setChartWidth] = useState(0);

  const rainColor = getCategoryAccent('rain');
  const showersColor = getCategoryAccent('showers');
  const snowColor = getCategoryAccent('snow');

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
      .map((item) => item.key);
  }, [data, hoursAhead]);

  const firstData = data?.[0] as IPrecipChartData | undefined;
  const firstTop = precipitationAreas.reduce((sum, area) => sum + (firstData?.[area] || 0), 0);
  const hasPrecip = Boolean(firstData && firstData.rain > 0);

  // "Agora" fica alinhado à esquerda a partir da borda; horários que caem em cima dele são escondidos.
  const nowLabel = t('now');
  const nowLabelEnd = getNowLabelEnd(nowLabel, tickFont(true, hasPrecip), CHART_MARGIN.left);

  const firstAccent = firstData ? getWeatherCodeInfo(firstData.weatherCode, firstData.isDay, t).accent : DEFAULT_COLOR.WEATHER;

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
    <ResponsiveContainer width="100%" height={height} onResize={width => setChartWidth(width)}>
      <AreaChart data={data} dataKey="key" margin={CHART_MARGIN}>
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
            shape={<Arrow accent={firstAccent} chartWidth={chartWidth} />}
          />
        )}

        <YAxis
          hide
          domain={[0, maxPrecipitation]}
        />

        <XAxis
          dataKey="key"
          type='number'
          domain={['dataMin', 'dataMax']}
          interval={0}
          axisLine={false}
          tickLine={false}
          ticks={customTicks}
          tick={({ x, y, payload }) => {
            const item = data.find(item => item.key === payload.value);

            if (!item) return null;

            const { weatherCode, isDay } = item;
            const { accent } = getWeatherCodeInfo(weatherCode, isDay, t);

            const isFirstItem = data[0].key === item.key;

            if (isFirstItem) {
              return (
                <CustomTick
                  x={Number(x) + EDGE_INSET}
                  y={y}
                  label={nowLabel}
                  accent={accent}
                  isFirstItem
                  hasPrecip={hasPrecip}
                  textAnchor="start"
                />
              );
            }

            const date = DateTime.fromMillis(Number(item.key));
            const label = formatClock({ date, language, hour12: is12hour, short: true, localizedPeriod: true });

            // Esconde o horário se ficar em cima do "Agora" ou passar da borda direita.
            if (!tickFits(Number(x), label, tickFont(false, hasPrecip), nowLabelEnd, chartWidth)) return null;

            return (
              <CustomTick
                x={x}
                y={y}
                label={label}
                accent={accent}
                isFirstItem={false}
                hasPrecip={hasPrecip}
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
            dot={area === 'showers' ? <CustomAreaDot chartWidth={chartWidth} /> : undefined}
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  );
}