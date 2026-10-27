import { ILocation } from "@/types/location.types";
import { APP_INFO } from "./appInfo";

/** A Cidade Beta só aparece no seletor em desenvolvimento ou no build beta */
export const SHOW_BETA_LOCATION =
  APP_INFO.isDev || (process.env.NEXT_PUBLIC_APP_NAME ?? "").toLowerCase().includes("beta");

/**
 * Cidade de teste: usa o clima real de Toronto (horários, chuva, nascer/pôr do sol),
 * mas troca as temperaturas por uma rampa extrema (ver BETA_TEMPERATURE_RAMP).
 * O geonameId negativo nunca colide com uma cidade real.
 */
export const BETA_LOCATION: ILocation = {
  geonameId: -1,
  name: "Beta City",
  latitude: 43.70643,
  longitude: -79.39864,
  timezone: "America/Toronto",
  countryCode: "CA",
};

/** 40°C agora até -30°C daqui a 24h: cobre calor de deserto, o 0°C e frio polar num gráfico só */
export const BETA_TEMPERATURE_RAMP = {
  FROM: 40,
  TO: -30,
  HOURS: 24,
  /** Sensação térmica fica esses graus abaixo da temperatura */
  FEELS_LIKE_OFFSET: -4,
} as const;

export const isBetaLocation = (location: ILocation | undefined): boolean =>
  location?.geonameId === BETA_LOCATION.geonameId;
