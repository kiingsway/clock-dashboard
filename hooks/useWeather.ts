import { CACHE_KEY } from "@/constants/keys";
import { fetchWeather } from "@/services/fetchWeather";
import { IWeather } from "@/types/weather.types";
import useAppSettings from "@/contexts/AppSettingsContext";
import useSWR from 'swr';
import type { KeyedMutator } from 'swr';

export interface IUseWeather {
  weather: IWeather | undefined;
  error?: { error?: string; message?: string };
  isLoading: boolean;
  isRefreshing: boolean;
  refresh: KeyedMutator<IWeather>;
}

type TWeatherKey = readonly [string, number, number];

/** Chave e fetcher compartilhados com o preload (services/preloadInitialData.ts). */
export const getWeatherKey = (latitude: number, longitude: number): TWeatherKey =>
  [CACHE_KEY.WEATHER, latitude, longitude];

export const weatherFetcher = ([, latitude, longitude]: TWeatherKey): Promise<IWeather> =>
  fetchWeather(latitude, longitude);

export default function useWeather(): IUseWeather {
  const { get: { location: { latitude, longitude } } } = useAppSettings();

  const { data: weather, error, isLoading, isValidating, mutate } = useSWR(
    getWeatherKey(latitude, longitude),
    weatherFetcher,
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
