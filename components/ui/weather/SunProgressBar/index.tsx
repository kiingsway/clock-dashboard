import { IDaily, IWeatherCurrent } from "@/types/weather.types";
import type { JSX } from "react";
import { getSunWindow } from "@/utils/weather/getSunWindow";
import { SunWindow } from "@/types/sun.types";
import SunProgress from "./SunProgress";

interface SunWindowProps {
  sunWindow: SunWindow

  currentWeather?: never
  dailyWeather?: never
  timezone?: never
}

interface NoSunWindowProps {
  sunWindow?: never

  currentWeather: IWeatherCurrent
  dailyWeather: IDaily
  timezone: string
}

type Props = SunWindowProps | NoSunWindowProps

export default function SunProgressBar({ currentWeather, dailyWeather, timezone, sunWindow: sunWindowData }: Props): JSX.Element {

  if (!currentWeather && !sunWindowData) return <></>;

  const sunWindow = sunWindowData || getSunWindow(dailyWeather.sunrise, dailyWeather.sunset, timezone);
  const startLabel = sunWindow.start.toFormat("HH:mm");
  const endLabel = sunWindow.end.toFormat("HH:mm");

  const onDebugClick = (): void => console.info('Sun Progress:', sunWindow);

  return (
    <SunProgress
      startTime={startLabel}
      endTime={endLabel}
      startKind={sunWindow.startKind}
      endKind={sunWindow.endKind}
      progress={sunWindow.progress}
      onDoubleClick={onDebugClick}
    />
  );
}