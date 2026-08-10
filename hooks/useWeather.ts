import { CACHE_KEY } from "@/constants/keys";
import { fetchWeather } from "@/services/fetchWeather";
import { IWeatherLocationItem } from "@/types/location.types";
import { IWeather, WeatherCategory } from "@/types/weather.types";
import { IMoonPhase, IUVIcon, IWindInfo } from "@/types/weatherInfo.types";
import { getAccent } from "@/utils/weather/getAccentColor";
import getMoonPhase from "@/utils/weather/getMoonPhase";
import getUVIcon from "@/utils/weather/getUVIcon";
import getVisibilityInfo, { IVisibilityInfo } from "@/utils/weather/getVisibilityInfo";
import getWeatherCategory from "@/utils/weather/getWeatherCategory";
import getWeatherIcon, { WeatherIconInfo } from "@/utils/weather/getWeatherIcon";
import getWindInfo from "@/utils/weather/getWindInfo";
import useSWR, { KeyedMutator } from "swr";

export interface IUseWeather {
  data: {
    weather: IWeather | undefined;
    accent: string
    moonPhase: IMoonPhase | undefined;
    uvIcon: IUVIcon | undefined;
    windInfo: IWindInfo | undefined;
    weatherIcon: WeatherIconInfo | undefined;
    visibility: IVisibilityInfo | undefined;
    category: WeatherCategory;
  }
  error: unknown;
  isLoading: boolean;
  isRefreshing: boolean;
  refresh: KeyedMutator<IWeather>;
}

export function useWeather(location: IWeatherLocationItem, locale: string): IUseWeather {
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

  const { lat, lon, weatherCode, isDay } = {
    lat: weather?.latitude,
    lon: weather?.longitude,
    weatherCode: weather?.current.weather_code,
    isDay: weather?.current.is_day === 1,
  }

  const category = getWeatherCategory(weatherCode)
  const accent = getAccent({ category, isDay });
  const moonPhase = getMoonPhase({ lat, lon })
  const weatherIcon = !weatherCode ? undefined : getWeatherIcon({ weatherCode, isDay, lat, lon });
  const visibility = getVisibilityInfo(weather, locale)
  const uvIcon = weather ? getUVIcon(weather) : undefined;
  const windInfo = weather ? getWindInfo(weather) : undefined;

  return {
    data: {
      weather,
      accent,
      moonPhase,
      uvIcon,
      windInfo,
      weatherIcon,
      visibility,
      category,
    },
    error,
    isLoading,
    isRefreshing: isValidating,
    refresh: mutate,
  };
}