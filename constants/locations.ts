import { IWeatherLocationItem, TLocation } from "@/types/location.types";

export const LOCATION_TO_WEATHER: Record<TLocation, Omit<IWeatherLocationItem, "name">> = {
  "America/Toronto": {
    id: "Toronto",
    lat: 43.6532,
    lon: -79.3832,
    country: "CA",
    province: "ON",
  },
  "America/Sao_Paulo": {
    id: "Sao_Paulo",
    lat: -23.5505,
    lon: -46.6333,
    country: "BR",
  },
  "Asia/Seoul": {
    id: "Seoul",
    lat: 37.5665,
    lon: 126.978,
  },
  "America/New_York": {
    id: "New_York",
    lat: 40.0583,
    lon: -74.4057,
  },
  "America/Bogota": {
    id: "Bogota",
    lat: 4.711,
    lon: -74.0721,
  },
  "America/Panama": {
    id: "Panama_City",
    lat: 8.9824,
    lon: -79.5199,
  },
  "America/Vancouver": {
    id: "Vancouver",
    lat: 49.2827,
    lon: -123.1207,
    country: "CA",
    province: "BC",
  },
  "Pacific/Guadalcanal": {
    id: "Guadalcanal",
    lat: -9.5427,
    lon: 160.2167,
  },
};

export const LOCATION_OPTIONS = Object.keys(LOCATION_TO_WEATHER) as TLocation[]