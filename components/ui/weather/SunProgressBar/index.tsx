import { WeatherCategoryName } from "@/types/weather.types";
import { useMemo, type CSSProperties, type JSX } from "react";
import { SunWindow } from "@/types/sun.types";
import EventProgress from "../EventProgress";
import useAppSettings from "@/contexts/AppSettingsContext";
import { useNow } from "@/contexts/NowContext";
import { getGoldenHourAccent } from "@/utils/weather/getAccentColor";
import buildMarkerStrength from "@/components/layout/weather/CurrentWeather/buildMarkerStrength";

interface Props {
  sunWindow: SunWindow | undefined;
  loading?: boolean;
  isError?: boolean;
  includeNight?: boolean;
  isFocused?: boolean;
  disableEffects?: boolean;
  precipitation?: number,
}

export default function SunProgressBar({ sunWindow, precipitation = 0, isError = false, loading = false, includeNight = false, isFocused = false, disableEffects = false }: Props): JSX.Element {
  const { now } = useNow();
  const { weatherLocation } = useAppSettings();

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

  const { progress, accent } = useMemo(() => buildMarkerStrength(now, weatherLocation, sunWindow, precipitation, disableEffects), [disableEffects, now, precipitation, sunWindow, weatherLocation]);
  // const { progress, sunAccent } = useMemo(() => {
  //   let sunAccent = 'var(--wc-accent)';
  //   if (disableEffects) return { progress: 0.3, sunAccent };

  //   const data = getGoldenHourAccent(now, sunWindow, weatherLocation);
  //   const p = [data?.goldenHour.progress, data?.noon.progress].filter(n => typeof n === 'number');
  //   const progress = Math.min(1, Math.max(...p, 0.3));

  //   if (data) {
  //     const { goldenHour, noon } = data;
  //     if (goldenHour.progress > 0.3) sunAccent = goldenHour.color;
  //     else if (noon.progress > 0.3) sunAccent = noon.color;
  //   }

  //   return { sunAccent, progress };
  // }, [disableEffects, now, sunWindow, weatherLocation]);

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
      markerStrength={includeNight ? progress : undefined}
    />
  );
}