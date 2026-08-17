import { CACHE_KEY } from "@/constants/keys";
import { fetchWeather } from "@/services/fetchWeather";
import { IWeather } from "@/types/weather.types";
import useSWR, { KeyedMutator } from "swr";
import { useAppSettings } from "@/contexts/AppSettingsContext";

export interface IUseWeather {
  weather: IWeather | undefined;
  error?: { error?: string; message?: string };
  isLoading: boolean;
  isRefreshing: boolean;
  refresh: KeyedMutator<IWeather>;
}

export function useWeather(): IUseWeather {
  const { weatherLocation: location } = useAppSettings();

  const { data: weather, error, isLoading, isValidating, mutate } = useSWR<IWeather>(
    [CACHE_KEY.WEATHER, location.lat, location.lon],
    () => fetchWeather(location.lat, location.lon),
    {
      refreshInterval: 5 * 60 * 1000,
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      dedupingInterval: 60 * 1000,
    }
  );

  return {
    weather,
    error,
    isLoading,
    isRefreshing: isValidating,
    refresh: mutate,
  };
}