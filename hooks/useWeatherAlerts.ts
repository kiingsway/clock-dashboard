import fetchCanadaWeatherAlerts from "@/services/fetchCanadaWeatherAlerts";
import useSWR from "swr";
import { WeatherLocationItem } from "./useAppSettings";

function getWeatherAlertKey(location: WeatherLocationItem) {
  if (location.country !== "CA") return null;

  return ["weather-alerts", location.lat, location.lon];
}

export default function useWeatherAlerts(location: WeatherLocationItem) {
  const key = getWeatherAlertKey(location);

  const { data, error, isLoading } = useSWR(
    key,
    () => fetchCanadaWeatherAlerts(location.lat, location.lon),
    {
      refreshInterval: 5 * 60 * 1000,
      revalidateOnFocus: false,
    }
  );

  return {
    alerts: data ?? [],
    error,
    isLoading,
  };
}