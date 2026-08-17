import { IWeather } from "@/types/weather.types";
import type { JSX } from "react";
import { getSunWindow } from "@/utils/weather/getSunWindow";
import { SunWindow } from "@/types/sun.types";
import { DateTime } from "luxon";
import EventProgress from "../EventProgress";

interface SunWindowProps {
  sunWindow: SunWindow

  weather?: never;
  date?: never;
}

interface NoSunWindowProps {
  weather: IWeather;
  date: DateTime;

  sunWindow?: never
}

type Props = (SunWindowProps | NoSunWindowProps) & {
  includeNight?: boolean;
}

export default function SunProgressBar({ sunWindow: sunWindowData, weather, includeNight, date }: Props): JSX.Element {

  if (!weather && !sunWindowData) return <></>;

  const sunWindow = sunWindowData || getSunWindow({
    includeNight: includeNight || true,
    sunriseTimes: weather.daily.sunrise,
    sunsetTimes: weather.daily.sunset,
    timezone: weather.timezone,
    date
  });

  const onDebugClick = (): void => console.info('Sun Progress:', sunWindow);

  if (!sunWindow) return <></>;

  return (
    <EventProgress
      start={sunWindow.start}
      end={sunWindow.end}
      startKind={sunWindow.startKind}
      endKind={sunWindow.endKind}
      progress={sunWindow.progress}
      onDoubleClick={onDebugClick}
      hideDate={includeNight}
    />
  );
}