import { IDaily } from "@/types/weather.types"
import { ICON_BASE_URI } from "./iconFiles"
import { DateTime } from "luxon"
import { getTodayDailyValue } from "../getValueFromDate"

export default function getUVIcon(daily: IDaily, timezone: string) {

  const uvNumber = getTodayDailyValue(daily.time, daily.uv_index_max, timezone)

  if (!uvNumber) return undefined

  const uvIndex = Math.round(uvNumber)
  const uvIcon = `${ICON_BASE_URI}uv-index-${uvIndex}.svg`

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