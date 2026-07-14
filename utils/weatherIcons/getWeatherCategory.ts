import { WeatherCategory } from "@/types/weather.types";

/**
 * Buckets a WMO weather code into a coarse category.
 * Shared by the icon picker and by `getAccentColor`, so the two always agree
 * on what a given code "means".
 */
export default function getWeatherCategory(weatherCode: number): WeatherCategory {
  switch (weatherCode) {
    case 0:
    case 1:
      return "clear";

    case 2:
      return "partlyCloudy";

    case 3:
      return "cloudy";

    case 4:
      return "smoke";

    case 5:
      return "haze";

    case 27:
      return "hail";

    // Nevoeiro leve / em bancos
    case 40:
    case 41:
    case 42:
    case 44:
    case 46:
    case 48:
      return "lightFog";

    // Nevoeiro denso / congelante
    case 43:
    case 45:
    case 47:
    case 49:
      return "fog";

    case 51:
    case 53:
    case 55:
      return "drizzle";

    case 56:
    case 57:
      return "freezingDrizzle"; // Crítico para estradas (Ice Pellets/Glaze)

    case 61:
    case 63:
      return "rain";

    case 65:
      return "heavyRain"; // Separar intensidade ajuda no accentColor do app

    case 66:
    case 67:
      return "freezingRain"; // Alerta máximo de trânsito no Canadá

    case 71:
    case 73:
    case 77:
      return "snow"; // Neve leve a moderada / grãos de neve

    case 75:
      return "heavySnow"; // Mudança crucial: Neve pesada (Alerta de acúmulo)

    case 80:
    case 81:
    case 82:
      return "showers";

    // Códigos que faltavam: Pancadas mistas de chuva e neve (Sleet)
    case 83:
      return "sleet";
    case 84:
      return "heavySleet";

    case 85:
    case 86:
      return "snowShowers";

    // Códigos que faltavam: Pancadas de granizo miúdo / neve em grãos
    case 87:
    case 88:
      return "snowShowers";

    case 95:
      return "thunderstorm";

    case 96:
      return "moderateHail"
      
    case 99:
      return "heavyHail"; // Tempestades severas com granizo

    case -1:
      return "error";

    case -2:
      return "loading";

    default:
      return "unknown";
  }
}