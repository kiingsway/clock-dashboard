import { CACHE_KEY } from "@/constants/keys";
import { DEFAULT_SETTINGS } from "@/constants/settings";
import { IWeatherLocationItem } from "@/types/location.types";
import { IWeatherAlertCanada } from "@/types/weatherAlerts.types";
import useSWR from "swr";
import { useAppSettings } from "@/contexts/AppSettingsContext";

function getWeatherAlertKey(location: IWeatherLocationItem) {
  if (location.country !== "CA") return null;

  return [CACHE_KEY.WEATHER_ALERTS, location.lat, location.lon];
}

export default function useWeatherAlerts() {
  const { weatherLocation: location, get: { alertRadiusKm } } = useAppSettings();

  const { data, error, isLoading } = useSWR(
    [getWeatherAlertKey(location), location.lat, location.lon, alertRadiusKm],
    async ([, lat, lon, radius]) => {
      const res = await fetch(
        `/api/weather-alerts?lat=${lat}&lon=${lon}&radiusKm=${radius || DEFAULT_SETTINGS.alertRadiusKm}`,
      );

      if (!res.ok) {
        const error = await res.json().catch(() => null);

        throw new Error((error?.message || error?.error || `Request failed with status ${res.status}`));
      }

      return res.json() as Promise<IWeatherAlertCanada[]>;
    },
    {
      refreshInterval: 5 * 60 * 1000,
      revalidateOnFocus: false,
    },
  );

  return {
    alerts: data ?? [],
    error,
    isLoading,
  };
}