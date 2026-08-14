import { CACHE_KEY } from "@/constants/keys";
import { useNow } from "@/contexts/NowContext";
import { fetchWeather } from "@/services/fetchWeather";
import { IWeather, WeatherCategory, WeatherIconInfo } from "@/types/weather.types";
import { IUVIcon } from "@/types/weatherInfo.types";
import { getAccent } from "@/utils/weather/getAccentColor";
import getUVIcon from "@/utils/weather/getUVIcon";
import getVisibilityInfo, { IVisibilityInfo } from "@/utils/weather/getVisibilityInfo";
import getWeatherCategory from "@/utils/weather/getWeatherCategory";
import getWeatherIcon from "@/utils/weather/getWeatherIcon";
import { useTranslation } from "react-i18next";
import useSWR, { KeyedMutator } from "swr";
import { useAppSettings } from "@/contexts/AppSettingsContext";
import getWindInfo, { WindData } from "@/utils/weather/getWindInfo";

export interface IUseWeather {
  data: {
    weather: IWeather | undefined;
    uvIcon: IUVIcon | undefined;
    windInfo: WindData | undefined;
    weatherIcon: WeatherIconInfo | undefined;
    visibility: IVisibilityInfo | undefined;
    category: WeatherCategory;
    accent: string
  }
  error?: { error?: string; message?: string };
  isLoading: boolean;
  isRefreshing: boolean;
  refresh: KeyedMutator<IWeather>;
}

export function useWeather(): IUseWeather {
  const { now } = useNow();
  const { weatherLocation: location } = useAppSettings();
  const { t, i18n: { language: locale } } = useTranslation();

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

  const category = getWeatherCategory(weather?.current.weather_code)
  const accent = getAccent({ category, isDay: weather?.current.is_day === 1 });

  let weatherIcon: WeatherIconInfo | undefined;
  let uvIcon: IUVIcon | undefined;
  let windInfo: WindData | undefined;
  let visibility: IVisibilityInfo | undefined;

  if (weather) {
    const {
      timezone,
      latitude: lat,
      longitude: lon,
      current: {
        is_day,
        weather_code: weatherCode
      }
    } = weather;

    const isDay = is_day === 1;

    weatherIcon = getWeatherIcon({ weatherCode, isDay, lat, lon, now, timezone });
    uvIcon = getUVIcon({ weather, date: now, kind: 'day', t });
    windInfo = getWindInfo(weather, now, t);
    visibility = getVisibilityInfo(weather, now, locale, t)
  }

  return {
    data: {
      weather,
      accent,
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