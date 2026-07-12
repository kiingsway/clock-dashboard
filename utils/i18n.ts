import { SupportedLocale } from "@/types/weather.types";

interface Dictionary {
  feelsLike: string;
  maxMin: string;
  precipitation: string;
  sunrise: string;
  sunset: string;
  now: string;
  today: string;
  nextHours: string;
  nextDays: string;
  noPrecipitation: string;
}

const DICTIONARIES: Record<SupportedLocale, Dictionary> = {
  "pt-BR": {
    feelsLike: "Sensação",
    maxMin: "Máx/Mín",
    precipitation: "Precipitação",
    sunrise: "Nascer do sol",
    sunset: "Pôr do sol",
    now: "Agora",
    today: "Hoje",
    nextHours: "Próximas horas",
    nextDays: "Próximos dias",
    noPrecipitation: "Sem chuva",
  },
  "en-US": {
    feelsLike: "Feels like",
    maxMin: "Max/Min",
    precipitation: "Precipitation",
    sunrise: "Sunrise",
    sunset: "Sunset",
    now: "Now",
    today: "Today",
    nextHours: "Hourly forecast",
    nextDays: "Daily forecast",
    noPrecipitation: "No rain",
  },
};

export function getDictionary(locale: SupportedLocale): Dictionary {
  return DICTIONARIES[locale] ?? DICTIONARIES["en-US"];
}

/** Falls back to the browser's language when the host app doesn't pass a locale. */
export function detectLocale(): SupportedLocale {
  if (typeof navigator === "undefined") return "en-US";
  return navigator.language.toLowerCase().startsWith("pt") ? "pt-BR" : "en-US";
}