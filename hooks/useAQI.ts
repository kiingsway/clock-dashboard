import { CACHE_KEY } from "@/constants/keys";
import useAppSettings from "@/contexts/AppSettingsContext";
import { fetchAQIData } from "@/services/fetchAQIData";
import { IAQI } from "@/types/aqi.types";
import useSWR, { KeyedMutator } from "swr";

export interface IUseWeather {
  aqiData: IAQI | undefined;
  error?: { error?: string; message?: string };
  isLoading: boolean;
  isRefreshing: boolean;
  refresh: KeyedMutator<IAQI>;
}

export function useAQI(): IUseWeather {
  const { get: { location: { latitude: lat, longitude: lon } } } = useAppSettings();

  const { data: aqiData, error, isLoading, isValidating, mutate } =
    useSWR<IAQI>(
      lat != null && lon != null
        ? [CACHE_KEY.AQI, lat, lon]
        : null,
      () => fetchAQIData(lat!, lon!),
      {
        refreshInterval: 5 * 60 * 1000,
        revalidateOnFocus: true,
        revalidateOnReconnect: true,
        dedupingInterval: 60 * 1000,
      }
    );

  return {
    aqiData,
    error,
    isLoading,
    isRefreshing: isValidating,
    refresh: mutate,
  };
}