import { IDaily, IWeatherCurrent } from "@/types/weather.types";
import getSunIcon from "@/utils/weatherIcons/getSunIcon";
import type { JSX } from "react";
import styles from './CurrentWeather.module.css'
import { getSunWindow } from "@/utils/formatters";
import { useTranslation } from "react-i18next";

interface Props {
  currentWeather: IWeatherCurrent
  dailyWeather: IDaily
  timezone: string
}

export default function SunProgress({ currentWeather, dailyWeather, timezone }: Props): JSX.Element {
  const { t } = useTranslation();

  if (!currentWeather) return <></>;

  const sunWindow = getSunWindow(currentWeather.time, dailyWeather.sunrise, dailyWeather.sunset, timezone);
  const startLabel = sunWindow.start.toFormat("HH:mm");
  const endLabel = sunWindow.end.toFormat("HH:mm");

  const onDebugClick = (): void => console.info('Sun Progress:', sunWindow)

  return (
    <div className={styles.sunArc} aria-label={`${t(sunWindow.startKind)} ${startLabel}, ${t(sunWindow.endKind)} ${endLabel}`} onDoubleClick={onDebugClick}>
      <div className={styles.sunPoint}>
        {getSunIcon(sunWindow.startKind, 18)}
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
        {getSunIcon(sunWindow.endKind, 20)}
        <span>{endLabel}</span>
      </div>
    </div>
  )
}