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

export default function useWeatherAlerts(): UseWeatherAlerts {
  const { weatherLocation: location, get: { alertRadiusKm } } = useAppSettings();

  const country = location.country;
  const isSupported = !country ? false : isSupportedWeatherAlertCountry(country);

  const { data, error, isLoading } = useSWR(
    isSupported
      ? [CACHE_KEY.WEATHER_ALERTS, country, location.lat, location.lon, alertRadiusKm]
      : null,
    async ([, countryCode, lat, lon, radius]) => {
      const provider = WEATHER_ALERT_PROVIDERS[countryCode as WeatherAlertCountryCode];

      const url = provider.buildUrl({
        lat,
        lon,
        radiusKm: radius || DEFAULT_SETTINGS.alertRadiusKm,
      });

      const raw = await fetchAlertJson(url, countryCode);

      return provider.mapper(raw);
    },
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