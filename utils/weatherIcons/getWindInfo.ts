import { IDaily, IHourly } from "@/types/weather.types"
import { ICON_BASE_URI } from "./iconFiles"
import { DateTime } from "luxon"
import { getCurrentHourlyValue, getTodayDailyValue } from "../getValueFromDate"
import getBeaufortScale from "../getBeaufortScale"
import { getCompassDirection } from "../getCompassDirection"

export default function getWindInfo(daily: IDaily, hourly: IHourly, timezone: string) {

  const windSpeedMean = getTodayDailyValue(daily.time, daily.wind_speed_10m_mean, timezone)
  const windGustsMean = getTodayDailyValue(daily.time, daily.wind_gusts_10m_mean, timezone)

  const windDirection = getCurrentHourlyValue(hourly.time, hourly.wind_direction_10m, timezone)
  const windGusts = getCurrentHourlyValue(hourly.time, hourly.wind_gusts_10m, timezone)
  const windSpeed = getCurrentHourlyValue(hourly.time, hourly.wind_speed_10m, timezone)

  const windGustsDesc = getWindGustDescription(windGusts)
  const windGustsMeanDesc = getWindGustDescription(windGustsMean)

  const hasDaily = !windSpeedMean || !windGustsMean || !windGustsMeanDesc

  const windDirectionCompass = windDirection ? getCompassDirection(windDirection) : undefined
  const beaufort = typeof windSpeed === 'number' ? getBeaufortScale(windSpeed).level : undefined

  return {
    daily: hasDaily ? undefined : {
      speed: windSpeedMean,
      gusts: windGustsMean,
      desc: windGustsMeanDesc
    },
    hourly: {
      direction: {
        name: windDirectionCompass?.name,
        src: `${ICON_BASE_URI}wind-direction-${windDirectionCompass?.abbreviation.toLowerCase()}.svg`
      },
      beaufortSrc: beaufort ? `${ICON_BASE_URI}wind-beaufort-${beaufort}.svg` : undefined,
      gusts: windGusts,
      speed: windSpeed,
      desc: windGustsDesc
    }
  }
}

const getWindGustDescription = (gust?: number) => {
  if (typeof gust !== 'number') return undefined
  if (gust < 20) return "Vento calmo. Sem impacto significativo.";
  if (gust < 40) return "Vento moderado. Cuidado ao ar livre.";
  if (gust < 60) return "Vento forte. Possíveis impactos.";
  if (gust < 80) return "Vento muito forte. Evite áreas expostas.";
  return "Vento extremo. Risco de danos e quedas.";
}