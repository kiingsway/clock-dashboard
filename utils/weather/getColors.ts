import { WIND_SPEED_COLORS, WIND_GUSTS_COLORS } from "@/constants/colors";
import { hexToRgb, lerp } from "../formatters/textFormatters";
import { WindType } from "@/types/weather.types";
import { DAYLIGHT_HOURS, DEW_POINT_VALUES } from "@/constants/anchors";
import { DAYLIGHT_COLORS, DEW_COLORS, HUMIDITY_COLORS, VISIBILITY_COLORS } from "@/constants/colors";
import { IColorRange, IGradientColor, IInterpolateColor } from "@/types/colors.types";

function interpolateThreePointColor(value: number, { min, med, max }: IColorRange, { low, mid, high }: IInterpolateColor): string {
  return getGradientColor(value, [
    { value: min, hex: low },
    { value: med, hex: mid },
    { value: max, hex: high },
  ]);
}

/**
 * Interpola linearmente a cor de `value` entre os pontos (`stops`, em ordem crescente).
 * Valores fora da faixa ficam com a cor do primeiro/último ponto.
 */
export function getGradientColor(value: number, stops: IGradientColor[], max?: number): string {

  const minValue = stops[0].value;
  const maxValue = max ?? stops[stops.length - 1].value;
  const v = Math.max(minValue, Math.min(maxValue, value));

  let lower = stops[0];
  let upper = stops[stops.length - 1];

  for (let i = 0; i < stops.length - 1; i++) {
    if (v >= stops[i].value && v <= stops[i + 1].value) {
      lower = stops[i];
      upper = stops[i + 1];
      break;
    }
  }

  const range = upper.value - lower.value;
  const factor = range === 0 ? 0 : (v - lower.value) / range;

  const c1 = hexToRgb(lower.hex);
  const c2 = hexToRgb(upper.hex);

  const [r, g, b] = (['r', 'g', 'b'] as const).map(c => Math.round(lerp(c1[c], c2[c], factor)));

  return `rgb(${r},${g},${b})`;
}

// Faixas aproximadas de intensidade de chuva (mm/h), uso meteorológico comum
export function rainIntensityColor(value: number): string {
  if (value <= 0) return "#475569"; // sem chuva
  if (value < 0.5) return "#7dd3fc"; // chuvisco
  if (value < 2.5) return "#38bdf8"; // fraca
  if (value < 7.6) return "#2563eb"; // moderada
  return "#5b21b6"; // forte
}

// Faixas de intensidade de neve acumulada (cm/h)
export function snowIntensityColor(value: number): string {
  if (value <= 0) return "#475569";   // sem neve (slate-600)
  if (value < 0.5) return "#ffffff";  // neve muito fraca / traços (branco puro)
  if (value < 1.5) return "#e2e8f0";  // fraca (cinza claro / slate-200)
  if (value < 3.0) return "#94a3b8";  // moderada (cinza médio / slate-400)
  return "#334155";                   // forte / interdição (cinza escuro / slate-700)
}

export function showersIntensityColor(value: number): string {
  if (value <= 0) return "#475569"; // sem showers
  if (value < 0.5) return "#5eead4"; // showers muito fracas
  if (value < 2.5) return "#2dd4bf"; // fracas
  if (value < 7.6) return "#0d9488"; // moderadas
  return "#115e59"; // fortes
}

/**
 * Retorna uma cor em tom pastel com base no ponto de orvalho (dew point) em °C.
 *
 * Âncoras:
 * - <= 0°C: Azul Pastel (#a5f3fc) [Muito Frio / Seco]
 * - 12°C: Branco (#ffffff) [Confortável / Normal]
 * - >= 24°C: Vermelho Pastel (#fca5a5) [Muito Quente / Abafado]
 *
 * @param dewPoint - Temperatura do ponto de orvalho em °C
 * @returns Cor no formato `rgb()`
 */
export function getDewPointColor(dewPoint: number): string {
  return interpolateThreePointColor(dewPoint, DEW_POINT_VALUES, DEW_COLORS);
}

/**
 * Retorna uma cor interpolada (gradiente) com base na umidade.
 *
 * Âncoras:
 * - 0% a 30%: Bege (#f59e0b) -> Branco (#ffffff)
 * - 30% a 100%: Branco (#ffffff) -> Azul (#3b82f6)
 *
 * @param humidity - Porcentagem de umidade (0 a 100)
 * @returns Cor no formato `rgb()`
 */
export function getHumidityColor(humidity: number): string {
  return getGradientColor(humidity, HUMIDITY_COLORS);
}

/**
 * Retorna uma cor baseada no impacto/percepção do vento para o ser humano.
 *
 * "speed"  → velocidade sustentada do vento.
 * "gusts"  → rajadas de vento, com limites mais altos.
 *
 * As faixas de rajadas são mais tolerantes porque uma rajada é
 * momentânea, enquanto a velocidade sustentada afeta continuamente
 * o conforto e as atividades ao ar livre.
 */
export function getWindColor(windKmH: number, type: WindType = "speed"): string | undefined {
  const stops = type === "speed" ? WIND_SPEED_COLORS : WIND_GUSTS_COLORS;
  return getGradientColor(windKmH, stops);
}

/**
 * Cor para Daylight Duration (baseado em horas no dia).
 * Âncoras: <= 8h (Violeta) | 12h (Branco) | >= 16h (Amarelo Céu)
 */
export function getDaylightColor(seconds: number): string {
  return interpolateThreePointColor(seconds / 3600, DAYLIGHT_HOURS, DAYLIGHT_COLORS);
}

/**
 * Calcula a cor exata da visibilidade de forma linear e contínua.
 * @param visibility Valor da visibilidade em metros (0 a 10000+)
 */
export function getVisibilityColor(visibility: number): string {
  return getGradientColor(visibility, VISIBILITY_COLORS, 10000);
}

export function getRainColor(rainMm: number): string {
  const maxRain = 20;
  const t = Math.pow(Math.min(Math.max(rainMm / maxRain, 0), 1), 0.6);

  const hue = 205 + (270 - 205) * t;
  const saturation = 90;
  const lightness = 72 - 22 * t;

  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

export function getTemperatureMinMaxColors(tempMin: number = -10, tempMax: number = 30) {

  const range = Math.abs(tempMax - tempMin);

  // 0 = quase sem variação
  // 1 = variação de 10°C ou mais
  const intensity = Math.min(range / 10, 1);

  const minColor = `color-mix(
  in srgb,
  var(--wc-info) ${60 + intensity * 40}%,
  white
)`;

  const maxColor = `color-mix(
  in srgb,
  var(--wc-danger) ${60 + intensity * 40}%,
  white
)`;

  return { minColor, maxColor };
}