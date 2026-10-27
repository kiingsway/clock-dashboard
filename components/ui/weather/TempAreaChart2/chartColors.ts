import { TEMPERATURE_COLORS } from "@/constants/colors";
import { IGradientColor } from "@/types/colors.types";
import { WeatherCategoryName } from "@/types/weather.types";
import { getGradientColor } from "@/utils/weather/getColors";

const RAIN_CATEGORIES: WeatherCategoryName[] = [
  'drizzle',
  'freezingDrizzle',
  'rain',
  'freezingRain',
  'heavyRain',
  'showers',
  'thunderstorm',
  'hail',
  'moderateHail',
  'heavyHail',
];

/** Chuva de 0 a 10 mm/h: de azul a roxo */
const RAIN_COLORS: IGradientColor[] = [
  { value: 0, hex: '#5DADE2' },
  { value: 10, hex: '#8E5CC7' },
];

/** Escurece uma cor `rgb(r,g,b)` (formato do getGradientColor) */
function darkenColor(rgb: string, amount = 0.35): string {
  const [r, g, b] = (rgb.match(/\d+/g) ?? ['0', '0', '0']).map(Number);
  const dark = [r, g, b].map(value => Math.round(value * (1 - amount)));

  return `rgb(${dark.join(',')})`;
}

const nightAware = (color: string, isDay: boolean) => isDay ? color : darkenColor(color);

export function getTemperatureColor(temp: number, isDay: boolean): string {
  return nightAware(getGradientColor(temp, TEMPERATURE_COLORS), isDay);
}

/** Cor da temperatura ou, em horas de chuva, da intensidade da chuva; escurecida à noite */
export function getWeatherAreaColor(temp: number, category: WeatherCategoryName, rain: number, isDay: boolean): string {
  const color = RAIN_CATEGORIES.includes(category)
    ? getGradientColor(rain, RAIN_COLORS)
    : getGradientColor(temp, TEMPERATURE_COLORS);

  return nightAware(color, isDay);
}
