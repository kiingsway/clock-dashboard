import { DateTime } from "luxon";
import { IWeatherCountry } from "./location.types";
import { CanadaAlertType } from "./WeatherAlerts/canada.types";
import { NWSSeverity } from "./WeatherAlerts/usa.types";
import { WEATHER_ALERT_PROVIDERS } from "@/constants/alerts";

export interface IWeatherAlert {
  country: IWeatherCountry;
  id: string;
  title: string;
  status: CanadaAlertType | NWSSeverity;
  shortTitle: string;
  description: string;
  expires: DateTime;
  location: string;
  color: string;
  descriptions: { label: string, value: string }[];
  properties: { label: string, value: string }[];
}

interface WeatherAlertRequestParams {
  lat: number;
  lon: number;
  radiusKm: number;
}

export interface WeatherAlertProvider<TRaw = unknown> {
  /** Monta a URL da rota interna (/api/weather-alerts/...) para esse país */
  buildUrl: (params: WeatherAlertRequestParams) => string;
  /** Converte a resposta bruta da API do país pro formato comum IWeatherAlert */
  mapper: (raw: TRaw | undefined) => IWeatherAlert[];
}

export type WeatherAlertCountryCode = keyof typeof WEATHER_ALERT_PROVIDERS;

export function isSupportedWeatherAlertCountry(
  country: string
): country is WeatherAlertCountryCode {
  return country in WEATHER_ALERT_PROVIDERS;
}