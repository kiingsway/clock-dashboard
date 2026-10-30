import { CACHE_KEY } from "@/constants/keys";
import { isBetaLocation } from "@/constants/locations";
import { fetchWeather } from "@/services/fetchWeather";
import { IWeather } from "@/types/weather.types";
import useAppSettings from "@/contexts/AppSettingsContext";
import { mockTemperatureRamp } from "@/utils/mock";
import { useMemo } from "react";
import useRetryOnError from "./useRetryOnError";
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

const REFRESH_INTERVAL = 5 * 60 * 1000;

export default function useWeather(): IUseWeather {
  const { get: { location } } = useAppSettings();
  const { latitude, longitude } = location;
  const isBeta = isBetaLocation(location);

  const { data, error, isLoading, isValidating, mutate } = useSWR(
    getWeatherKey(latitude, longitude),
    weatherFetcher,
    {
      refreshInterval: REFRESH_INTERVAL,
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      dedupingInterval: 60 * 1000,
    }
  );

  useRetryOnError(error, mutate, REFRESH_INTERVAL);

  // Cidade Beta: clima real com temperaturas simuladas (ver BETA_LOCATION)
  const weather = useMemo(
    () => data && isBeta ? mockTemperatureRamp(data) : data,
    [data, isBeta],
  );

  return {
    weather,
    error,
    isLoading,
    isRefreshing: isValidating,
    refresh: mutate,
  };
}
