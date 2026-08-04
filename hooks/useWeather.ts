import { CACHE_KEY } from "@/constants/keys";
import { fetchWeather } from "@/services/fetchWeather";
import { IWeatherLocationItem } from "@/types/location.types";
import { IWeather, WeatherCategory, WeatherIconInfo } from "@/types/weather.types";
import { IMoonPhase, IUVIcon, IVisibilityInfo, IWindInfo } from "@/types/weatherInfo.types";
import { getAccent } from "@/utils/weather/getAccentColor";
import getMoonPhase from "@/utils/weather/getMoonPhase";
import getUVIcon from "@/utils/weather/getUVIcon";
import getVisibilityInfo from "@/utils/weather/getVisibilityInfo";
import getWeatherCategory from "@/utils/weather/getWeatherCategory";
import getWeatherIcon from "@/utils/weather/getWeatherIcon";
import getWindInfo from "@/utils/weather/getWindInfo";
import { DateTime } from "luxon";
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
  error: any;
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

  const { lat, lon, weatherCode, isDay, date } = {
    lat: weather?.latitude,
    lon: weather?.longitude,
    weatherCode: weather?.current.weather_code,
    isDay: weather?.current.is_day === 1,
    date: !weather ? undefined : DateTime.fromISO(weather?.current.time)
  }

  const category = getWeatherCategory(weatherCode)
  const accent = getAccent({ category, isDay });
  const moonPhase = getMoonPhase({ lat, lon })
  const weatherIcon = !weatherCode ? undefined : getWeatherIcon({ weatherCode, isDay, lat, lon });
  const visibility = getVisibilityInfo(weather, locale)
  const uvIcon = getUVIcon(weather);
  const windInfo = getWindInfo(weather);
  
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