import { CACHE_KEY } from "@/constants/keys";
import { DEFAULT_SETTINGS } from "@/constants/settings";
import fetchCanadaWeatherAlerts from "@/services/fetchCanadaWeatherAlerts";
import { UseAppSettings } from "@/types/app.types";
import { IWeatherLocationItem } from "@/types/location.types";
import { IWeatherAlertCanada } from "@/types/weather.types";
import useSWR from "swr";

function getWeatherAlertKey(location: IWeatherLocationItem) {
  if (location.country !== "CA") return null;

  return [CACHE_KEY.WEATHER_ALERTS, location.lat, location.lon];
}

export default function useWeatherAlerts(settings: UseAppSettings) {

  const { weatherLocation: location, get: { alertRadiusKm } } = settings;

  const { data, error, isLoading } = useSWR(
    [getWeatherAlertKey(location), location.lat, location.lon, alertRadiusKm],
    async ([, lat, lon, radius]) => {
      const res = await fetch(
        `/api/weather-alerts?lat=${lat}&lon=${lon}&radiusKm=${radius || DEFAULT_SETTINGS.alertRadiusKm}`,
      );

      if (!res.ok) {
        throw new Error("Failed to fetch weather alerts.");
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