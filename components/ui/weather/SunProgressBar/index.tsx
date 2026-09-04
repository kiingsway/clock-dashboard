import { IWeather, WeatherCategoryName } from "@/types/weather.types";
import { type CSSProperties, type JSX } from "react";
import { SunWindow } from "@/types/sun.types";
import EventProgress from "../EventProgress";
import { useNow } from "@/contexts/NowContext";
import getAccentColor from "@/utils/weather/getAccentColor";
import { getGlowStrength } from "@/utils/weather/getGlowStrength";
import getWeatherCodeInfo from "@/utils/weather/getWeatherCodeInfo";
import { useTranslation } from "react-i18next";

interface Props {
  sunWindow: SunWindow | undefined;
  loading?: boolean;
  isError?: boolean;
  includeNight?: boolean;
  isFocused?: boolean;
  weather?: IWeather;
}

export default function SunProgressBar({ weather, sunWindow, isError = false, loading = false, includeNight = false, isFocused = false }: Props): JSX.Element {
  const { now } = useNow();
  const { t } = useTranslation();

  const { latitude, longitude, current } = weather ?? {};
  const { weather_code, is_day, precipitation } = current ?? {};

  const icons = (() => {
    let rise: WeatherCategoryName = 'error';
    let set: WeatherCategoryName = 'error';

    if (sunWindow) {
      rise = sunWindow.startKind;
      set = sunWindow.endKind;

    } else if (loading && !isError) {
      rise = 'loading';
      set = 'loading';
    }

    return { rise, set };
  })();

  const weatherCodeInfo = getWeatherCodeInfo(weather_code, is_day === 1, t);

  const accent = getAccentColor(weatherCodeInfo.name, is_day);

  const progress1 = getGlowStrength({
    date: now,
    precipitation: precipitation ?? 0,
    lat: latitude,
    lon: longitude,
    weatherCategory: weatherCodeInfo.name
  });

  const style = {
    '--is-focused': +isFocused,
    '--wc-sun-accent': accent,
  } as CSSProperties;

  return (
    <EventProgress
      style={style}
      start={sunWindow?.start}
      end={sunWindow?.end}
      startIcon={{ category: icons.rise, size: isFocused ? 50 : 20 }}
      endIcon={{ category: icons.set, size: isFocused ? 50 : 20 }}
      hideDate={includeNight}
      markerStrength={includeNight ? progress1 : undefined}
      type={isError ? 'error' : 'default'}
    />
  );
}