import { IHourly, IWeather } from "@/types/weather.types";
import { getCurrentHourlyValue } from "./getValueFromDate";

export default function getVisibilityInfo(weather?: IWeather) {

  if (!weather) return undefined

  const { hourly, hourly_units, timezone } = weather

  const visibility = getCurrentHourlyValue(hourly.time, hourly.visibility, timezone);

  if (!visibility) return undefined

  const color = getVisibilityColor(visibility)

  const title = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 0 }).format(visibility) + hourly_units.visibility;

  const percentage = getVisibilityPercentage(visibility)

  const desc = (() => {
    if (visibility >= 10000) return `Visibilidade excelente. Sem impactos esperados. (${percentage}%)`;
    if (visibility >= 5000) return `Boa visibilidade. Pequenas reduções no horizonte. (${percentage}%)`;
    if (visibility >= 2000) return `Visibilidade moderada. Atenção em estradas e áreas abertas. (${percentage}%)`;
    if (visibility >= 1000) return `Visibilidade baixa. Dirija com cuidado e reduza a velocidade. (${percentage}%)`;
    if (visibility >= 500) return `Névoa intensa. Possíveis atrasos e baixa visibilidade nas pistas. (${percentage}%)`;
    return `Visibilidade crítica. Evite deslocamentos e tenha extremo cuidado. (${percentage}%)`;
  })();

  return { value: visibility, title, color, desc }

}

// Função auxiliar para converter HEX para RGB
function hexToRgb(hex: string) {
  const bigint = parseInt(hex.replace('#', ''), 16);
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255
  };
}

// Função auxiliar para interpolar dois valores com base em uma porcentagem (0 a 1)
const lerp = (start: number, end: number, t: number) => Math.round(start + (end - start) * t);

/**
 * Calcula a cor exata da visibilidade de forma linear e contínua.
 * @param visibility Valor da visibilidade em metros (0 a 10000+)
 */
export function getVisibilityColor(visibility: number): string {
  // Garantir limites entre 0 e 10000 metros para o cálculo
  const v = Math.max(0, Math.min(10000, visibility));

  // Definimos os pontos de parada e suas respectivas cores (as que você gostou)
  const stops = [
    { value: 0, hex: "#6E5033" }, // Crítico
    { value: 500, hex: "#9E7B56" }, // Névoa intensa
    { value: 1000, hex: "#C4A482" }, // Baixa
    { value: 2000, hex: "#D9C3A5" }, // Moderada
    { value: 5000, hex: "#EADCC9" }, // Boa
    { value: 10000, hex: "#F5F0E6" }  // Excelente
  ];

  // Encontra entre quais duas paradas o valor atual se encontra
  let lower = stops[0];
  let upper = stops[stops.length - 1];

  for (let i = 0; i < stops.length - 1; i++) {
    if (v >= stops[i].value && v <= stops[i + 1].value) {
      lower = stops[i];
      upper = stops[i + 1];
      break;
    }
  }

  // Calcula a porcentagem de onde o valor está dentro desse intervalo específico
  const range = upper.value - lower.value;
  const factor = range === 0 ? 0 : (v - lower.value) / range;

  // Converte ambas as cores para RGB para fazer a mistura matemática
  const c1 = hexToRgb(lower.hex);
  const c2 = hexToRgb(upper.hex);

  // Mistura os canais R, G e B
  const r = lerp(c1.r, c2.r, factor);
  const g = lerp(c1.g, c2.g, factor);
  const b = lerp(c1.b, c2.b, factor);

  // Retorna no formato RGB legível pelo CSS
  return `rgb(${r}, ${g}, ${b})`;
}

/**
 * Calcula a porcentagem de visibilidade com base nos dados do Open-Meteo.
 * @param visibilityMeters Visibilidade em metros retornada pela API
 * @returns Porcentagem truncada entre 0 e 100
 */
export function getVisibilityPercentage(visibilityMeters: number): number {
  const MIN_METERS = 1;
  const MAX_METERS = 24140; // Teto padrão do modelo de visibilidade do Open-Meteo

  // Se for menor ou igual a 1 metro, a visibilidade é 0%
  if (visibilityMeters <= MIN_METERS) return 0;

  // Se for maior ou igual ao máximo, a visibilidade é 100%
  if (visibilityMeters >= MAX_METERS) return 100;

  // Aplica a regra de três dentro do intervalo definido
  const percentage = ((visibilityMeters - MIN_METERS) / (MAX_METERS - MIN_METERS)) * 100;

  // Retorna o número redondo para exibir direto na UI
  return Math.round(percentage);
}