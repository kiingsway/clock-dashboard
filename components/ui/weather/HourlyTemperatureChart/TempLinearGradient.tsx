import { getTemperatureColor, getWeatherAreaColor } from "./chartColors";
import { IWeatherDataChart } from "./types";

interface Props {
  /** Prefixo único do gráfico: os ids ficam `${id}-area`, `${id}-feels` e `${id}-fade` */
  id: string;
  /**
   * Horas com a posição x (px) de cada uma. As extras depois do fim do gráfico também entram,
   * para o degradê não "esticar" na ponta direita.
   */
  points: { x: number; item: IWeatherDataChart }[];
}

/** Área: cor da temperatura (ou da chuva, em horas de chuva), escurecida à noite */
const getAreaColor = (item: IWeatherDataChart) =>
  getWeatherAreaColor(item.temp, item.category, item.rain, item.isDay);

/** Linha da sensação térmica: sempre pela temperatura, escurecida à noite */
const getFeelsLikeColor = (item: IWeatherDataChart) =>
  getTemperatureColor(item.feelsLike, item.isDay);

/**
 * Degradês horizontais em pixels (userSpaceOnUse): a cor de cada hora fica exatamente
 * sobre a hora, e a área, a curva e a linha da sensação usam a mesma escala.
 */
export default function TempLinearGradient({ id, points }: Props) {
  const end = points[points.length - 1]?.x || 1;

  const gradient = (suffix: string, color: (item: IWeatherDataChart) => string) => (
    <linearGradient id={`${id}-${suffix}`} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2={end} y2="0">
      {points.map(({ x, item }, index) => (
        <stop key={index} offset={x / end} stopColor={color(item)} />
      ))}
    </linearGradient>
  );

  return (
    <>
      {gradient('area', getAreaColor)}
      {gradient('feels', getFeelsLikeColor)}

      {/* A área some aos poucos em direção à base */}
      <linearGradient id={`${id}-fade`} x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" stopColor="#fff" stopOpacity="0.32" />
        <stop offset="1" stopColor="#fff" stopOpacity="0.04" />
      </linearGradient>
    </>
  );
}
