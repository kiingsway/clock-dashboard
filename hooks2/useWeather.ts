import { fetchWeather } from "@/helpers/fetchWeather";
import { IWeather } from "@/types2/weather.types";
import useSWR from "swr";

export function useWeather(latitude?: number, longitude?: number) {
  const { data, error, isLoading, isValidating, mutate } = useSWR<IWeather>(
    ["weather", latitude, longitude],
    () => fetchWeather(latitude, longitude),
    {
      refreshInterval: 5 * 60 * 1000, // 5 minutos
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