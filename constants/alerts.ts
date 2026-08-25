import { WeatherAlertProvider } from "@/types/weatherAlerts.types";
import { IWeatherAlertCanada } from "@/types/WeatherAlerts/canada.types";
import { IWeatherAlertUSA } from "@/types/WeatherAlerts/usa.types";
import { canadaAlertMapper, usaAlertMapper } from "@/utils/weatherAlerts/alertMapper";
import { DEFAULT_SETTINGS } from "./settings";

export const ALERT_RADIUS_KM = {
  MIN: 10,
  MAX: 4000,
  STEP: 50,
};

/**
 * Um país novo = uma entrada nova aqui. O hook (useWeatherAlerts) não muda.
 * A chave é o country code (location.country), então precisa bater com o
 * que vem do AppSettingsContext.
 */
export const WEATHER_ALERT_PROVIDERS = {
  CA: {
    buildUrl: ({ lat, lon, radiusKm }) =>
      `/api/weather-alerts/canada?lat=${lat}&lon=${lon}` +
      `&radiusKm=${radiusKm || DEFAULT_SETTINGS.alertRadiusKm}`,
    mapper: (raw?: IWeatherAlertCanada[]) => (raw ? canadaAlertMapper(raw) : []),
  },
  US: {
    buildUrl: ({ lat, lon }) => `/api/weather-alerts/usa?lat=${lat}&lon=${lon}`,
    mapper: (raw?: IWeatherAlertUSA) => usaAlertMapper(raw?.features),
  },

  // Exemplo de como fica adicionar um país novo:
  // FR: {
  //   buildUrl: ({ lat, lon }) => `/api/weather-alerts/france?lat=${lat}&lon=${lon}`,
  //   mapper: (raw?: IWeatherAlertFrance) => (raw ? franceAlertMapper(raw) : []),
  // },
} satisfies {
  CA: WeatherAlertProvider<IWeatherAlertCanada[]>;
  US: WeatherAlertProvider<IWeatherAlertUSA>;
};