import { IDaily, IWeatherCurrent } from "@/types/weather.types";
import type { JSX } from "react";
import styles from './CurrentWeather.module.css'
import { useTranslation } from "react-i18next";
import { getSunWindow } from "@/utils/weather/getSunWindow";
import { SunWindow } from "@/types/sun.types";
import WeatherIcon from "@/components/ui/weather/WeatherIcon";
import { capitalizeWords } from "@/utils/formatters/textFormatters";

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

export default function SunProgress({ currentWeather, dailyWeather, timezone, sunWindow: sunWindowData }: Props): JSX.Element {
  const { t } = useTranslation();

  if (!currentWeather && !sunWindowData) return <></>;

  const sunWindow = sunWindowData || getSunWindow(currentWeather.time, dailyWeather.sunrise, dailyWeather.sunset, timezone);
  const startLabel = sunWindow.start.toFormat("HH:mm");
  const endLabel = sunWindow.end.toFormat("HH:mm");

  const onDebugClick = (): void => console.info('Sun Progress:', sunWindow)

  return (
    <div className={styles.sunArc} aria-label={`${t(sunWindow.startKind)} ${startLabel}, ${t(sunWindow.endKind)} ${endLabel}`} onDoubleClick={onDebugClick}>
      <div className={styles.sunPoint}>
        <WeatherIcon
          size={18}
          category={{
            name: sunWindow.startKind,
            title: capitalizeWords(sunWindow.startKind)
          }}
        />
        <span>{startLabel}</span>
      </div>

      <div
        className={styles.sunTrack}
        aria-hidden="true"
      >
        <div className={styles.sunTrackFill} style={{ width: `${sunWindow.progress * 100}%` }} />
        <div className={styles.sunMarker} style={{ left: `${sunWindow.progress * 100}%` }} />
      </div>

      <div className={styles.sunPoint}>
        <WeatherIcon
          category={{ name: sunWindow.endKind, title: capitalizeWords(sunWindow.endKind) }}
          size={18}
        />
        <span>{endLabel}</span>
      </div>
    </div>
  )
}