import { useNow } from "@/contexts/NowContext";
import useAppSettings from "@/contexts/AppSettingsContext";
import { IWeather } from "@/types/weather.types";
import { JSX, useMemo, useState } from "react";
import { ResponsiveContainer, AreaChart, XAxis, YAxis, Area, Line, LabelList, ReferenceDot, ReferenceLine, TooltipPayload, Tooltip } from "recharts";
import { DateTime } from "luxon";
import { t } from "i18next";
import { useTranslation } from "react-i18next";
import buildChartData from "./buildChartData";
import WeatherIconObject from "./WeatherIconObject";
import TempLinearGradient from "./TempLinearGradient";
import CustomTick, { getTickFont } from "./CustomTick";
import { EDGE_INSET, clampIconX, clampLabelX, getNowLabelEnd, tickFits } from "@/utils/charts/edgeLabels";
import { ISunEventChart, IWeatherDataChart } from "./types";
import ChartTooltip from "./ChartTooltip";
import { getPrecipitationIcon } from "../PrecipitationChart/PrecipitationTooltip";
import getWeatherCodeInfo, { getCategoryAccent } from "@/utils/weather/getWeatherCodeInfo";
import { getWindColor } from "@/utils/weather/getColors";
import { formatClock } from "@/utils/formatters/formatClock";
import { WeatherIconProps } from "@/components/ui/weather/WeatherIcon";
import styles from "./TempAreaChart2.module.css";

interface Props {
  weather: IWeather;
}

/*
 * Espaços em volta da curva medidos em pixels (e não em graus): assim os ícones ficam
 * à mesma distância da curva tanto num dia tropical estável (2°C de variação) quanto
 * num deserto (25°C de variação). Os valores reproduzem o visual antigo num dia com 5°C de variação.
 */
const CHART_HEIGHT = 176; // mesma altura do .chart no CSS
// Sem margem lateral: a curva encosta nas bordas da tela.
const CHART_MARGIN = { top: 10, right: 0, left: 0, bottom: 0 };
const X_AXIS_HEIGHT = 30; // altura padrão do XAxis do recharts
const PLOT_HEIGHT = CHART_HEIGHT - CHART_MARGIN.top - CHART_MARGIN.bottom - X_AXIS_HEIGHT;
const SPACE_PX = {
  BELOW: 70, // abaixo da menor temperatura: ícones do tempo + faixa do sol na base
  ABOVE: 32, // acima da maior: rótulos de temperatura
  WEATHER_ICON: 34, // centro do ícone do tempo abaixo da curva (temperatura ou sensação, a mais baixa)
};

/*
 * Onde fica cada coisa, de cima para baixo, para nada se sobrepor faça frio ou calor:
 * - rótulos de temperatura e de sensação: logo acima das suas linhas
 * - ícones do tempo: acompanham a curva, 34px abaixo da linha mais baixa (temperatura ou sensação)
 * - nascer/pôr do sol: numa faixa na base do gráfico, como uma linha do tempo
 */
const SUN_ICON_SIZE = 20;
const WEATHER_ICON_SIZE = 28; // padrão do WeatherIconObject

// Mesmos valores do CSS; usados para medir os rótulos e mantê-los dentro da tela.
const TEMP_LABEL_FONT = { fontSize: 15, fontFamily: 'var(--wc-font-display)' }; // .label
const FEELS_LIKE_LABEL_FONT = { fontSize: 12 }; // .feelsLikeLabel

const DEGREE = '°';

const PRECIPITATION_UNITS = [
  { area: "snowfall", unit: 'cm' },
  { area: "rain", unit: 'mm' },
  { area: "showers", unit: 'mm' }
] as const;

/**
 * Gráfico de temperatura das próximas horas (alcance = precipHoursRange das configurações):
 * área da temperatura, linha da sensação térmica, ícones do tempo e nascer/pôr do sol.
 */
export default function TempAreaChart2({ weather }: Props) {
  const { i18n: { language } } = useTranslation();
  const { get: { is12hour, precipHoursRange: hoursAhead } } = useAppSettings();
  const { now } = useNow();
  // Largura do gráfico, para manter rótulos e ícones das pontas dentro da tela.
  const [chartWidth, setChartWidth] = useState(0);

  const data = useMemo(() =>
    buildChartData(weather, now, hoursAhead),
    [hoursAhead, now, weather]);

  // Horas realmente desenhadas (o alcance das configurações pode ser menor que o mínimo do gráfico)
  const chartHours = data?.weather.length ?? 0;

  const customTicks = useMemo(() => {
    if (!data?.weather?.length) return [];

    const mod = Math.min(3, Math.max(1, Math.floor((chartHours - 6) / 7) + 1));

    return data.weather
      .filter((_, index) => index === 0 || index % mod === 0)
      .map((item) => item.x);
  }, [data, chartHours]);

  if (!data) return null;

  const showLabelMod = Math.floor(chartHours / 19) + 1;

  const firstData = data.weather[0];
  const hasPrecip = Boolean(firstData && firstData.rain > 0);

  // "Agora" fica alinhado à esquerda a partir da borda; horários que caem em cima dele são escondidos.
  const nowLabel = t('now');
  const nowLabelEnd = getNowLabelEnd(nowLabel, getTickFont(true, hasPrecip), CHART_MARGIN.left);

  // Graus por pixel na área do gráfico, para converter os espaços em px para a escala do eixo
  const tempRange = Math.max(data.highestTemp - data.lowestTemp, 1);
  const degPerPx = tempRange / (PLOT_HEIGHT - SPACE_PX.BELOW - SPACE_PX.ABOVE);
  const yDomain = [
    data.lowestTemp - SPACE_PX.BELOW * degPerPx,
    data.highestTemp + SPACE_PX.ABOVE * degPerPx,
  ];

  return (
    <div className={styles.chart}>
      <ResponsiveContainer width="100%" height="100%" onResize={width => setChartWidth(width)}>

        <AreaChart data={data.weather} margin={CHART_MARGIN}>

          <defs>
            <TempLinearGradient
              data={[...data.weather, ...data.weatherExtra]}
              mainLength={data.weather.length}
            />
          </defs>

          <XAxis
            dataKey="x"
            type='number'
            domain={['dataMin', 'dataMax']}
            interval={0}
            axisLine={false}
            tickLine={false}
            ticks={customTicks}
            tick={({ x, y, payload }) => {
              const item = data.weather.find(item => item.x === payload.value);

              if (!item) return null;

              const { weatherCode, isDay } = item;
              const { accent } = getWeatherCodeInfo(weatherCode, isDay, t);

              const isFirstItem = data.weather[0].time === item.time;

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

              const date = DateTime.fromISO(item.time);
              const label = formatClock({ date, language, hour12: is12hour, short: true, localizedPeriod: true });

              // Esconde o horário se ficar em cima do "Agora" ou passar da borda direita.
              if (!tickFits(Number(x), label, getTickFont(false, hasPrecip), nowLabelEnd, chartWidth)) return null;

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

          <YAxis
            hide
            yAxisId="temperature"
            domain={yDomain}
            allowDataOverflow
          />

          <Tooltip wrapperStyle={{ zIndex: 99 }} content={<TempAreaChartTooltip />} />

          <Area
            yAxisId="temperature"
            type="basis"
            dataKey="temp"
            stroke="none"
            fill="url(#temperatureGradient)"
            fillOpacity={0.3}
            // Sem isso o recharts preenche até o 0 (ou até o topo, se tudo for negativo) e a área fica "de ponta cabeça" no frio
            baseValue="dataMin"
            isAnimationActive={false}
          >
            <LabelList
              dataKey="temp"
              position="top"
              content={({ x, y, value, index }) => {
                if (
                  typeof index !== 'number'
                  || index % showLabelMod !== 0
                  || Number(value) === data.weather[index - showLabelMod]?.temp
                ) return null;

                return (
                  <text
                    x={clampLabelX(Number(x), `${value}${DEGREE}`, TEMP_LABEL_FONT, chartWidth)}
                    y={Number(y) - 5}
                    textAnchor="middle"
                    className={styles.label}
                  >
                    {value}{DEGREE}
                  </text>
                );
              }}
            />
          </Area>

          <ReferenceLine
            yAxisId="temperature"
            x={data.nowX}
            stroke="#6A6A6A"
            strokeDasharray="1 10"
          />

          <Line
            yAxisId="temperature"
            type="basis"
            dataKey="feelsLike"
            stroke="url(#feelsLikeGradient)"
            opacity={0.4}
            strokeWidth={1}
            dot={false}
            isAnimationActive={false}
          >
            <LabelList
              dataKey="feelsLike"
              position="top"
              content={({ x, y, value, index }) => {
                if (
                  typeof index !== 'number'
                  || index % showLabelMod !== 0
                  || Number(value) === data.weather[index - showLabelMod]?.feelsLike
                ) return null;

                const feelsLike = Number(value);

                const temp = data.weather[index]?.temp;
                const diff = temp - feelsLike;

                if (temp == null || feelsLike == null || (diff >= -1 && diff <= 2))
                  return null;

                return (
                  <text
                    x={clampLabelX(Number(x), `${feelsLike}${DEGREE}`, FEELS_LIKE_LABEL_FONT, chartWidth)}
                    y={Number(y) - 8}
                    textAnchor="middle"
                    className={styles.feelsLikeLabel}
                  >
                    {feelsLike}{DEGREE}
                  </text>
                );
              }}
            />
          </Line>

          <WeatherReferenceIcon
            weather={data.weather}
            sunEvent={data.sunEvent}
            weatherIconOffset={SPACE_PX.WEATHER_ICON * degPerPx}
            sunIconY={yDomain[0] + (SUN_ICON_SIZE / 2) * degPerPx}
            chartWidth={chartWidth}
          />

        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

interface WeatherReferenceIconProps {
  weather: IWeatherDataChart[];
  sunEvent: ISunEventChart[];
  /** Distância (em graus) do ícone do tempo abaixo da curva */
  weatherIconOffset: number;
  /** Posição (na escala de temperatura) da faixa de nascer/pôr do sol, na base do gráfico */
  sunIconY: number;
  /** Largura do gráfico (0 = ainda não medida), para os ícones das pontas não saírem da tela */
  chartWidth: number;
}

const WeatherReferenceIcon = ({ weather, sunEvent, weatherIconOffset, sunIconY, chartWidth }: WeatherReferenceIconProps): JSX.Element => {
  const lastX = weather[weather.length - 1]?.x ?? 0;

  return (
    <>
      {weather.map((item, index) => {
        const { code, isDay, x } = item;
        if (typeof code !== 'number') return null;

        return (
          <ReferenceDot
            yAxisId="temperature"
            key={index}
            zIndex={100}
            x={x}
            y={Math.min(item.temp, item.feelsLike) - weatherIconOffset}
            shape={({ key, cx, cy }) => (
              <WeatherIconObject
                hideGlow
                key={key}
                cx={clampIconX(cx, WEATHER_ICON_SIZE, chartWidth)}
                cy={cy}
                size={WEATHER_ICON_SIZE}
                icon={{ weatherCode: code, isDay }}
              />
            )}
          />
        );
      })}

      {sunEvent.map(item => {
        if (item.x < 0 || item.x > lastX) return null; // fora do período do gráfico

        return (
          <ReferenceDot
            yAxisId="temperature"
            key={item.x}
            x={item.x}
            y={sunIconY}
            zIndex={101}
            shape={({ key, cx, cy }) => (
              <WeatherIconObject
                key={key}
                cx={clampIconX(cx, SUN_ICON_SIZE, chartWidth)}
                cy={cy}
                size={SUN_ICON_SIZE}
                icon={{ category: item.event }} />
            )}
          />
        );
      })}
    </>
  );
};

interface TempAreaChartTooltipProps {
  payload?: TooltipPayload;
}

function TempAreaChartTooltip({ payload }: TempAreaChartTooltipProps) {

  const item = payload?.[0]?.payload as IWeatherDataChart | undefined;
  if (!item) return null;

  const date = DateTime.fromISO(item.time);

  const accent = getCategoryAccent(item.category, item.isDay);
  const tooltipTitle = `${date.toFormat('LLL dd, HH:mm')}`;

  const { iconSrc, title: alt } = getWeatherCodeInfo(item.weatherCode, item.isDay, t);

  const feelsLikeIcons = {
    cold: "thermometer-mercury-cold",
    hot: "thermometer-mercury"
  };

  const feelsLikeIcon = item.temp > item.feelsLike ? feelsLikeIcons.cold : feelsLikeIcons.hot;

  const precipItems = PRECIPITATION_UNITS.map(({ area, unit }) => ({
    label: t(`weatherCategoryNames.${area === 'snowfall' ? 'snow' : area}`),
    value: item[area],
    unit,
    icon: { iconName: getPrecipitationIcon(area, item.isDay) } as WeatherIconProps,
  })).filter(({ value }) => Boolean(value));

  const windColor = getWindColor(item.gusts, 'speed');

  return (
    <ChartTooltip
      accent={accent}
      title={tooltipTitle}
      desc={t(`weatherCategoryNames.${item.category}`)}
      items={[
        { label: t('temperature'), value: item.temp, unit: DEGREE, icon: { src: iconSrc, alt } },
        { label: t('feelsLike'), value: item.feelsLike, unit: DEGREE, icon: { iconName: feelsLikeIcon } },
        ...precipItems,
        { label: t('windGusts'), value: item.gusts, unit: 'km/h', icon: { iconName: 'wind' }, color: windColor },
      ]}
    />
  );
}
