import { fetchWeather } from "@/services/fetchWeather";
import { IWeather } from "@/types/weather.types";
import useSWR from "swr";
import { WeatherLocationItem } from "./useAppSettings";

export function useWeather(location: WeatherLocationItem) {
  const { data, error, isLoading, isValidating, mutate } = useSWR<IWeather>(
    ["weather", location.lat, location.lon],
    () => fetchWeather(location.lat, location.lon),
    {
      refreshInterval: 5 * 60 * 1000,
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      dedupingInterval: 60 * 1000,
    }
  );

  return {
    weather: data,
    error,
    isLoading,
    isRefreshing: isValidating,
    refresh: mutate,
  };
}