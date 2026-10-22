import { CACHE_KEY } from "@/constants/keys";
import { DEFAULT_SETTINGS } from "@/constants/settings";
import { isSupportedWeatherAlertCountry, IWeatherAlert, WeatherAlertCountryCode } from "@/types/weatherAlerts.types";
import useAppSettings from "@/contexts/AppSettingsContext";
import useSWR from "swr";
import { WEATHER_ALERT_PROVIDERS } from "@/constants/alerts";

export interface UseWeatherAlerts {
  error: unknown;
  isLoading: boolean;
  data: IWeatherAlert[] | undefined;
}

type TWeatherAlertsKey = readonly [string, WeatherAlertCountryCode, number, number, number];

async function fetchAlertJson(url: string, countryCode: string | undefined) {
  const res = await fetch(url);

  if (!res.ok) {
    const error = await res.json().catch(() => null);

    throw new Error(
      error?.message ||
      error?.error ||
      `${countryCode || '[No Country Code]'} request failed with status ${res.status}`
    );
  }

  return res.json();
}

/**
 * Chave e fetcher compartilhados com o preload (services/preloadInitialData.ts).
 * A chave é null quando o país não tem provedor de alertas.
 */
export const getWeatherAlertsKey = (
  countryCode: string,
  latitude: number,
  longitude: number,
  alertRadiusKm: number,
): TWeatherAlertsKey | null =>
  isSupportedWeatherAlertCountry(countryCode)
    ? [CACHE_KEY.WEATHER_ALERTS, countryCode, latitude, longitude, alertRadiusKm]
    : null;

export async function weatherAlertsFetcher([, countryCode, lat, lon, radius]: TWeatherAlertsKey): Promise<IWeatherAlert[]> {
  const provider = WEATHER_ALERT_PROVIDERS[countryCode];

  const url = provider.buildUrl({
    lat,
    lon,
    radiusKm: radius || DEFAULT_SETTINGS.alertRadiusKm,
  });

  const raw = await fetchAlertJson(url, countryCode);

  return provider.mapper(raw);
}

export default function useWeatherAlerts(): UseWeatherAlerts {
  const { get: { location: { latitude, countryCode, longitude }, alertRadiusKm } } = useAppSettings();

  const { data, error, isLoading } = useSWR(
    getWeatherAlertsKey(countryCode, latitude, longitude, alertRadiusKm),
    weatherAlertsFetcher,
    {
      refreshInterval: 5 * 60 * 1000,
      revalidateOnFocus: false,
    },
  );

  return {
    data,
    error,
    isLoading,
  };
}
