import { CACHE_KEY } from "@/constants/keys";
import useAppSettings from "@/contexts/AppSettingsContext";
import { fetchAQIData } from "@/services/fetchAQIData";
import { IAQI } from "@/types/aqi.types";
import useSWR, { KeyedMutator } from "swr";
import useRetryOnError from "./useRetryOnError";

export interface IUseWeather {
  aqiData: IAQI | undefined;
  error?: { error?: string; message?: string };
  isLoading: boolean;
  isRefreshing: boolean;
  refresh: KeyedMutator<IAQI>;
}

type TAQIKey = readonly [string, number, number];

/** Chave e fetcher compartilhados com o preload (services/preloadInitialData.ts). */
export const getAQIKey = (latitude: number, longitude: number): TAQIKey =>
  [CACHE_KEY.AQI, latitude, longitude];

export const aqiFetcher = ([, latitude, longitude]: TAQIKey): Promise<IAQI> =>
  fetchAQIData(latitude, longitude);

const REFRESH_INTERVAL = 5 * 60 * 1000;

export function useAQI(): IUseWeather {
  const { get: { location: { latitude: lat, longitude: lon } } } = useAppSettings();

  const { data: aqiData, error, isLoading, isValidating, mutate } =
    useSWR(
      lat != null && lon != null
        ? getAQIKey(lat, lon)
        : null,
      aqiFetcher,
      {
        refreshInterval: REFRESH_INTERVAL,
        revalidateOnFocus: true,
        revalidateOnReconnect: true,
        dedupingInterval: 60 * 1000,
      }
    );

  useRetryOnError(error, mutate, REFRESH_INTERVAL);

  return {
    aqiData,
    error,
    isLoading,
    isRefreshing: isValidating,
    refresh: mutate,
  };
}
