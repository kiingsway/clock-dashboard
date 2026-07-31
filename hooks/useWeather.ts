import { fetchWeather } from "@/services/fetchWeather";
import { IWeather } from "@/types/weather.types";
import useSWR, { KeyedMutator } from "swr";
import { WeatherLocationItem } from "./useAppSettings";
import getMoonPhase, { IMoonPhase } from "@/utils/weatherIcons/getMoonPhase";
import getUVIcon, { IUVIcon } from "@/utils/weatherIcons/getUVIcon";
import getWeatherIcon, { WeatherIconInfo } from "@/utils/weatherIcons/getWeatherIcon";
import getWindInfo, { IWindInfo } from "@/utils/weatherIcons/getWindInfo";
import { DateTime } from "luxon";
import getVisibilityInfo, { IVisibilityInfo } from "@/utils/getVisibilityInfo";
import { getAccent } from "@/utils/weatherIcons/getAccentColor";

export interface IUseWeather {
  data: {
    weather: IWeather | undefined;
    accent: string
    moonPhase: IMoonPhase;
    uvIcon: IUVIcon | undefined;
    windInfo: IWindInfo | undefined;
    weatherIcon: WeatherIconInfo | undefined;
    visibility: IVisibilityInfo | undefined
  }
  error: any;
  isLoading: boolean;
  isRefreshing: boolean;
  refresh: KeyedMutator<IWeather>;
}

export function useWeather(location: WeatherLocationItem): IUseWeather {
  const { data: weather, error, isLoading, isValidating, mutate } = useSWR<IWeather>(
    ["weather", location.lat, location.lon],
    () => fetchWeather(location.lat, location.lon),
    {
      refreshInterval: 5 * 60 * 1000,
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      dedupingInterval: 60 * 1000,
    }
  );

  const accent = getAccent(weather?.current.weather_code, weather?.current.is_day);
  const moonPhase = getMoonPhase({ lat: weather?.latitude, lon: weather?.longitude })
  const uvIcon = getUVIcon(weather);
  const windInfo = getWindInfo(weather);
  const visibility = getVisibilityInfo(weather)
  const weatherIcon = weather && getWeatherIcon({
    weatherCode: weather?.current.weather_code,
    date: DateTime.fromISO(weather.current.time),
    isDay: weather.current.is_day === 1,
    lat: weather.latitude,
    lon: weather.longitude,
  })

  return {
    data: {
      weather,
      accent,
      moonPhase,
      uvIcon,
      windInfo,
      weatherIcon,
      visibility,
    },
    error,
    isLoading,
    isRefreshing: isValidating,
    refresh: mutate,
  };
}