import { IWeatherCurrent, WeatherCategory } from "@/types/weather.types";
import getWeatherCategory from "./getWeatherCategory";

type GetAccentProps =
  | {
    weatherCode: number;
    category?: never;
    categoryName?: never;
    isDay?: IWeatherCurrent["is_day"] | boolean;
  }
  | {
    weatherCode?: never;
    category: WeatherCategory;
    categoryName?: never;
    isDay?: IWeatherCurrent["is_day"] | boolean;
  }
  | {
    weatherCode?: never;
    category?: never;
    categoryName: WeatherCategory["name"];
    isDay?: IWeatherCurrent["is_day"] | boolean;
  };

export function getAccent({ isDay = true, categoryName: cName, category, weatherCode }: GetAccentProps): string {
  const categoryName = cName || category?.name || getWeatherCategory(weatherCode).name;
  if (!categoryName) return "#6b7280";
  return getAccentColor(categoryName, typeof isDay === 'boolean' ? isDay : isDay !== 0);
}

/**
 * A dim, dark-room-safe accent color per weather category, used for the
 * ambient glow behind the current-weather icon. Day/night shifts a few of
 * these (clear, fog) since the mood genuinely changes; the rest stay stable.
 */
export default function getAccentColor(categoryName: WeatherCategory['name'], isDay: boolean): string {
  switch (categoryName) {
    case "clear":
      return isDay ? "#f4b860" : "#8695f0"; // Sol quente / Céu estrelado azulado

    case "partlyCloudy":
      return isDay ? "#e5be85" : "#7f8cb8"; // Tons mistos entre o céu e nuvens

    case "cloudy":
    case "smoke":
    case "haze":
      return "#8b93a6"; // Cinza neutro suave para visibilidade reduzida e nuvens

    case "lightFog":
    case "fog":
      return isDay ? "#a7b8bd" : "#7c8b95"; // Azul acinzentado/névoa fria

    case "drizzle":
    case "showers":
      return "#6fc1e0"; // Ciano elétrico suave para chuva leve/pancadas rápidas

    case "rain":
    case "heavyRain":
      return "#4fa0e0"; // Azul clássico e profundo para precipitação contínua

    case "freezingDrizzle":
    case "freezingRain":
      return "#4dd0e1"; // Azul-gelo/ciano neon para destacar o perigo de congelamento

    case "snow":
    case "snowShowers":
    case "sleet":
      return "#cfe3f0"; // Branco azulado (neve padrão)

    case "heavySnow":
    case "heavySleet":
    case "hail":
      return "#9fa8da"; // Tom de gelo mais escuro/índigo para acúmulo e granizo leve

    case "thunderstorm":
    case "moderateHail":
    case "heavyHail":
      return "#a98cf0"; // Roxo/violeta elétrico para tempestades severas e descargas

    case "loading":
      return "#4b5563"; // Cinza médio discreto

    case "error":
      return "#ef4444"; // Vermelho de alerta (opaco para o dark-room)

    case "unknown":
    default:
      return "#6b7280"; // Cinza padrão de fallback
  }
}