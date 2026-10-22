import { preload } from "swr";
import loadSettings from "@/contexts/AppSettingsContext/loadSettings";
import { getWeatherKey, weatherFetcher } from "@/hooks/useWeather";
import { getAQIKey, aqiFetcher } from "@/hooks/useAQI";
import { getWeatherAlertsKey, weatherAlertsFetcher } from "@/hooks/useWeatherAlerts";

/**
 * Dispara as requisições da tela inicial assim que o JS carrega, em paralelo
 * com o carregamento das configurações e das traduções, em vez de esperar o
 * React renderizar os componentes que as usam. Os hooks (useWeather, useAQI,
 * useWeatherAlerts) reaproveitam essas requisições pelo cache do SWR.
 */
export default function preloadInitialData(): void {
  if (typeof window === "undefined") return;

  const { location: { latitude, longitude, countryCode }, alertRadiusKm } = loadSettings();

  const alertsKey = getWeatherAlertsKey(countryCode, latitude, longitude, alertRadiusKm);

  const requests = [
    preload(getWeatherKey(latitude, longitude), weatherFetcher),
    preload(getAQIKey(latitude, longitude), aqiFetcher),
    alertsKey ? preload(alertsKey, weatherAlertsFetcher) : undefined,
  ];

  // Os erros chegam aos hooks quando eles consomem o preload; aqui só evitamos
  // um "unhandled rejection" caso a requisição falhe antes disso.
  requests.forEach(request => request?.catch(() => { }));
}
