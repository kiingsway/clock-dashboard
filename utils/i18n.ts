import type { SupportedLocale } from "../types/weather.types";

interface Dictionary {
  feelsLike: string;
  max: string;
  min: string;
  precipitation: string;
  now: string;
  today: string;
  nextHours: string;
  nextDays: string;
  noPrecipitation: string;
}

const DICTIONARIES: Record<SupportedLocale, Dictionary> = {
  "pt-BR": {
    feelsLike: "Sensação",
    max: "Máx",
    min: "Mín",
    precipitation: "Precipitação",
    now: "Agora",
    today: "Hoje",
    nextHours: "Próximas horas",
    nextDays: "Próximos dias",
    noPrecipitation: "Sem chuva",
  },
  "en-US": {
    feelsLike: "Feels like",
    max: "Max",
    min: "Min",
    precipitation: "Precipitation",
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

