import { useNow } from "@/contexts/NowContext";
import useAppSettings from "@/contexts/AppSettingsContext";
import { IWeather } from "@/types/weather.types";
import { MouseEvent, useEffect, useId, useMemo, useRef, useState } from "react";
import { DateTime } from "luxon";
import { t } from "i18next";
import { useTranslation } from "react-i18next";
import buildChartData from "./buildChartData";
import WeatherIconObject from "./WeatherIconObject";
import TempLinearGradient from "./TempLinearGradient";
import CustomTick, { getTickFont } from "./CustomTick";
import smoothPath, { Point } from "./smoothPath";
import { EDGE_INSET, clampIconX, clampLabelX, getNowLabelEnd, measureText, tickFits } from "@/utils/charts/edgeLabels";
import { IWeatherDataChart } from "./types";
import ChartTooltip from "./ChartTooltip";
import { getPrecipitationIcon } from "../PrecipitationChart/PrecipitationTooltip";
import getWeatherCodeInfo, { getCategoryAccent } from "@/utils/weather/getWeatherCodeInfo";
import { getWindColor } from "@/utils/weather/getColors";
import { formatClock } from "@/utils/formatters/formatClock";
import { WeatherIconProps } from "@/components/ui/weather/WeatherIcon";
import styles from "./HourlyTemperatureChart.module.css";

interface Props {
  weather: IWeather;
}

/*
 * Medidas em pixels, de cima para baixo: rótulos de temperatura, curva, ícones do tempo
 * logo abaixo dela, nascer/pôr do sol na base e os horários. Em pixels (e não em graus),
 * os ícones ficam à mesma distância da curva num dia estável ou num de muita variação.
 */
const CHART_HEIGHT = 176; // mesma altura do .chart no CSS
const MARGIN_TOP = 10;
const X_AXIS_HEIGHT = 30;
const PLOT_BOTTOM = CHART_HEIGHT - X_AXIS_HEIGHT;
const SPACE_PX = {
  BELOW: 70, // abaixo da menor temperatura: ícones do tempo + faixa do sol na base
  ABOVE: 32, // acima da maior: rótulos de temperatura
  WEATHER_ICON: 34, // centro do ícone do tempo abaixo da curva (temperatura ou sensação, a mais baixa)
};
/** Com pouca variação a curva não ocupa a altura toda, para não parecer uma montanha-russa */
const MIN_TEMP_RANGE = 6;

const SUN_ICON_SIZE = 20;
const WEATHER_ICON_SIZE = 28; // padrão do WeatherIconObject

// Mesmos valores do CSS; usados para medir os rótulos e mantê-los dentro da tela.
const TEMP_LABEL_FONT = { fontSize: 15, fontFamily: 'var(--wc-font-display)' }; // .label
const FEELS_LIKE_LABEL_FONT = { fontSize: 12 }; // .feelsLikeLabel

/** Folga mínima (px) entre dois rótulos vizinhos */
const LABEL_GAP = 2;

interface LabelFont {
  fontSize: number;
  fontFamily?: string;
}

interface LabelBox {
  left: number;
  right: number;
  top: number;
  bottom: number;
}

const DEGREE = '°';
const TOOLTIP_WIDTH = 220; // max-width do ChartTooltip
const TOOLTIP_GAP = 16;

const PRECIPITATION_UNITS = [
  { area: "snowfall", unit: 'cm' },
  { area: "rain", unit: 'mm' },
  { area: "showers", unit: 'mm' }
] as const;

/** Largura do elemento, atualizada quando ele muda de tamanho */
function useWidth<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return [ref, width] as const;
}

/**
 * Gráfico de temperatura das próximas horas (alcance = precipHoursRange das configurações):
 * área da temperatura, linha da sensação térmica, ícones do tempo e nascer/pôr do sol.
 */
export default function HourlyTemperatureChart({ weather }: Props) {
  const { i18n: { language } } = useTranslation();
  const { get: { is12hour, precipHoursRange: hoursAhead } } = useAppSettings();
  const { now } = useNow();
  const [ref, chartWidth] = useWidth<HTMLDivElement>();
  // url(#id) não aceita os caracteres especiais do useId
  const id = `temp-${useId().replace(/[^\w-]/g, '')}`;
  const [hoverIndex, setHoverIndex] = useState<number>();

  const data = useMemo(() =>
    buildChartData(weather, now, hoursAhead),
    [hoursAhead, now, weather]);

  // Horas realmente desenhadas (o alcance das configurações pode ser menor que o mínimo do gráfico)
  const chartHours = data?.weather.length ?? 0;

  const customTicks = useMemo(() => {
    if (!data?.weather?.length) return [];

    const mod = Math.min(3, Math.max(1, Math.floor((chartHours - 6) / 7) + 1));

    return data.weather.filter((_, index) => index === 0 || index % mod === 0);
  }, [data, chartHours]);

  // O div fica sempre na tela: é ele que mede a largura
  if (!data || !chartWidth) return <div ref={ref} className={styles.chart} />;

  const showLabelMod = Math.floor(chartHours / 19) + 1;
  const lastX = data.weather[data.weather.length - 1].x;

  const firstData = data.weather[0];
  const hasPrecip = Boolean(firstData && firstData.rain > 0);

  // "Agora" fica alinhado à esquerda a partir da borda; horários que caem em cima dele são escondidos.
  const nowLabel = t('now');
  const nowLabelEnd = getNowLabelEnd(nowLabel, getTickFont(true, hasPrecip));

  // Escala vertical: graus por pixel na área do gráfico, deixando os espaços em px acima e abaixo
  const middle = (data.highestTemp + data.lowestTemp) / 2;
  const tempRange = Math.max(data.highestTemp - data.lowestTemp, MIN_TEMP_RANGE);
  const degPerPx = tempRange / (PLOT_BOTTOM - MARGIN_TOP - SPACE_PX.BELOW - SPACE_PX.ABOVE);
  const top = middle + tempRange / 2 + SPACE_PX.ABOVE * degPerPx;

  const xOf = (hour: number) => (hour / lastX) * chartWidth;
  const yOf = (temp: number) => MARGIN_TOP + (top - temp) / degPerPx;

  const tempPoints: Point[] = data.weather.map(item => ({ x: xOf(item.x), y: yOf(item.temp) }));
  const feelsPoints: Point[] = data.weather.map(item => ({ x: xOf(item.x), y: yOf(item.feelsLike) }));
  const curve = smoothPath(tempPoints);
  const area = `${curve}L${chartWidth},${PLOT_BOTTOM}L0,${PLOT_BOTTOM}Z`;
  const nowX = xOf(data.nowX);

  const gradientPoints = [...data.weather, ...data.weatherExtra].map(item => ({ x: xOf(item.x), item }));

  // Rótulo que encostaria num já colocado fica de fora; os de temperatura vêm primeiro
  const placed: LabelBox[] = [];
  const place = (x: number, y: number, text: string, font: LabelFont) => {
    const clampedX = clampLabelX(x, text, font, chartWidth);
    const half = measureText(text, font.fontSize, 400, font.fontFamily) / 2 + LABEL_GAP;
    const box = { left: clampedX - half, right: clampedX + half, top: y - font.fontSize, bottom: y };
    if (placed.some(other => box.left < other.right && other.left < box.right && box.top < other.bottom && other.top < box.bottom)) return [];

    placed.push(box);
    return [{ x: clampedX, y, text }];
  };

  const tempLabels = data.weather.flatMap((item, index) => {
    if (index % showLabelMod !== 0 || item.temp === data.weather[index - showLabelMod]?.temp) return [];
    return place(tempPoints[index].x, tempPoints[index].y - 8, `${item.temp}${DEGREE}`, TEMP_LABEL_FONT);
  });

  // A sensação só ganha rótulo quando difere bastante da temperatura
  const feelsLikeLabels = data.weather.flatMap((item, index) => {
    if (index % showLabelMod !== 0 || item.feelsLike === data.weather[index - showLabelMod]?.feelsLike) return [];

    const diff = item.temp - item.feelsLike;
    if (diff >= -1 && diff <= 2) return [];

    return place(feelsPoints[index].x, feelsPoints[index].y - 8, `${item.feelsLike}${DEGREE}`, FEELS_LIKE_LABEL_FONT);
  });

  // Um horário só entra se couber depois do anterior (ou do "Agora") e antes da borda direita
  const tickFont = getTickFont(false, hasPrecip);
  const hourTicks = customTicks.slice(1).reduce<{ item: IWeatherDataChart; x: number; label: string; end: number }[]>((list, item) => {
    const x = xOf(item.x);
    const label = formatClock({ date: DateTime.fromISO(item.time), language, hour12: is12hour, short: true, localizedPeriod: true });
    const previousEnd = list[list.length - 1]?.end ?? nowLabelEnd;

    if (!tickFits(x, label, tickFont, previousEnd, chartWidth)) return list;
    return [...list, { item, x, label, end: x + measureText(label, tickFont.fontSize, tickFont.fontWeight) / 2 }];
  }, []);

  const accentOf = (item: IWeatherDataChart) => getWeatherCodeInfo(item.weatherCode, item.isDay, t).accent;

  const hovered = hoverIndex === undefined ? undefined : data.weather[hoverIndex];

  const handleMouseMove = (event: MouseEvent<SVGSVGElement>) => {
    const left = event.currentTarget.getBoundingClientRect().left;
    const hour = Math.round(((event.clientX - left) / chartWidth) * lastX);
    setHoverIndex(Math.min(data.weather.length - 1, Math.max(0, hour)));
  };

  return (
    <div ref={ref} className={styles.chart}>
      <svg
        width={chartWidth}
        height={CHART_HEIGHT}
        className={styles.svg}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHoverIndex(undefined)}
      >
        <defs>
          <TempLinearGradient id={id} points={gradientPoints} />
          <mask id={`${id}-mask`}>
            <rect width={chartWidth} height={CHART_HEIGHT} fill={`url(#${id}-fade)`} />
          </mask>
        </defs>

        <path d={area} fill={`url(#${id}-area)`} mask={`url(#${id}-mask)`} />
        <path className={styles.curve} d={curve} stroke={`url(#${id}-area)`} />
        <path className={styles.feelsLike} d={smoothPath(feelsPoints)} stroke={`url(#${id}-feels)`} />
        <line className={styles.now} x1={nowX} x2={nowX} y1={MARGIN_TOP} y2={PLOT_BOTTOM} />

        {tempLabels.map(label => (
          <text key={`t${label.x}`} x={label.x} y={label.y} textAnchor="middle" className={styles.label}>
            {label.text}
          </text>
        ))}

        {feelsLikeLabels.map(label => (
          <text key={`f${label.x}`} x={label.x} y={label.y} textAnchor="middle" className={styles.feelsLikeLabel}>
            {label.text}
          </text>
        ))}

        <WeatherIcons weather={data.weather} tempPoints={tempPoints} feelsPoints={feelsPoints} chartWidth={chartWidth} />

        {data.sunEvent.map(item => {
          if (item.x < 0 || item.x > lastX) return null; // fora do período do gráfico

          return (
            <WeatherIconObject
              key={item.time}
              cx={clampIconX(xOf(item.x), SUN_ICON_SIZE, chartWidth)}
              cy={PLOT_BOTTOM - SUN_ICON_SIZE / 2}
              size={SUN_ICON_SIZE}
              icon={{ category: item.event }}
            />
          );
        })}

        <line className={styles.axis} x1={0} x2={chartWidth} y1={PLOT_BOTTOM} y2={PLOT_BOTTOM} />
        <CustomTick x={EDGE_INSET} y={PLOT_BOTTOM + 6} label={nowLabel} accent={accentOf(firstData)} isFirstItem hasPrecip={hasPrecip} textAnchor="start" />
        {hourTicks.map(({ item, x, label }) => (
          <CustomTick key={item.time} x={x} y={PLOT_BOTTOM + 6} label={label} accent={accentOf(item)} isFirstItem={false} hasPrecip={hasPrecip} />
        ))}

        {hovered && hoverIndex !== undefined && (
          <g className={styles.hover}>
            <line x1={tempPoints[hoverIndex].x} x2={tempPoints[hoverIndex].x} y1={MARGIN_TOP} y2={PLOT_BOTTOM} />
            <circle cx={tempPoints[hoverIndex].x} cy={tempPoints[hoverIndex].y} r={4} />
          </g>
        )}
      </svg>

      {hovered && hoverIndex !== undefined && (() => {
        const x = tempPoints[hoverIndex].x;
        // À direita do ponto; perto da borda direita, passa para a esquerda
        const left = x + TOOLTIP_GAP + TOOLTIP_WIDTH <= chartWidth ? x + TOOLTIP_GAP : Math.max(0, x - TOOLTIP_GAP - TOOLTIP_WIDTH);

        return (
          <div className={styles.tooltip} style={{ left }}>
            <HourlyTemperatureTooltip item={hovered} language={language} is12hour={is12hour} />
          </div>
        );
      })()}
    </div>
  );
}

interface WeatherIconsProps {
  weather: IWeatherDataChart[];
  tempPoints: Point[];
  feelsPoints: Point[];
  /** Largura do gráfico, para os ícones das pontas não saírem da tela */
  chartWidth: number;
}

/** Um ícone quando a categoria do tempo muda (o `code` só existe nessas horas), sem encostar no anterior */
function WeatherIcons({ weather, tempPoints, feelsPoints, chartWidth }: WeatherIconsProps) {
  const icons = weather.reduce<{ key: string; cx: number; cy: number; code: number; isDay: boolean }[]>((list, item, index) => {
    const { code, isDay } = item;
    if (typeof code !== 'number') return list;

    const cx = clampIconX(tempPoints[index].x, WEATHER_ICON_SIZE, chartWidth) ?? 0;
    const previous = list[list.length - 1];
    if (previous && cx - previous.cx < WEATHER_ICON_SIZE * 1.2) return list;

    const lowest = Math.max(tempPoints[index].y, feelsPoints[index].y);
    return [...list, { key: item.time, cx, cy: lowest + SPACE_PX.WEATHER_ICON, code, isDay }];
  }, []);

  return (
    <>
      {icons.map(({ key, cx, cy, code, isDay }) => (
        <WeatherIconObject
          key={key}
          hideGlow
          cx={cx}
          cy={cy}
          size={WEATHER_ICON_SIZE}
          icon={{ weatherCode: code, isDay }}
        />
      ))}
    </>
  );
}

interface HourlyTemperatureTooltipProps {
  item: IWeatherDataChart;
  language: string;
  is12hour: boolean;
}

function HourlyTemperatureTooltip({ item, language, is12hour }: HourlyTemperatureTooltipProps) {
  const date = DateTime.fromISO(item.time);

  const accent = getCategoryAccent(item.category, item.isDay);
  // Mês no idioma do app e hora no formato escolhido (12h ou 24h)
  const tooltipTitle = `${date.setLocale(language).toFormat('LLL dd')}, ${formatClock({ date, language, hour12: is12hour })}`;

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
