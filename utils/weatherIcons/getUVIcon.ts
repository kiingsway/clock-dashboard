import { IDaily, IWeather } from "@/types/weather.types"
import ICON_FILES, { ICON_BASE_URI } from "./iconFiles"
import { DateTime } from "luxon"
import { getTodayDailyValue } from "../getValueFromDate"

const getUvSrc = (uv?: number): string => `${ICON_BASE_URI}uv-index${uv ? `-${uv}` : ''}.svg`

export default function getUVIcon(weather?: IWeather) {

  if (!weather) return undefined

  const { current, daily, timezone } = weather;

  if(current.is_day === 1) return {
    alt: `UV Index: 0 (night)`,
    src: `${ICON_BASE_URI}${ICON_FILES.clearNight}.svg`,
    desc: 'Tá de noite'
  }

  const uvNumber = getTodayDailyValue(daily.time, daily.uv_index_max, timezone)

  if (!uvNumber) return undefined

  const uvIndex = Math.round(uvNumber)
  const uvIcon = getUvSrc(uvIndex)

  const desc = (() => {
    if (uvIndex <= 2) return "Baixo risco. Sem proteção especial.";
    if (uvIndex <= 5) return "Risco moderado. Use protetor e procure sombra.";
    if (uvIndex <= 7) return "Risco alto. Protetor FPS 30+, chapéu e sombra.";
    if (uvIndex <= 10) return "Risco muito alto. Evite o sol prolongado.";
    return "Risco extremo. Evite exposição ao sol.";
  })();

  return {
    alt: `UV Index: ${uvNumber}`,
    src: uvIcon,
    desc
  }
}