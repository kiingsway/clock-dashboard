import { IWeather } from "@/types/weather.types"
import ICON_FILES, { ICON_BASE_URI } from "./iconFiles"
import { getTodayDailyValue } from "../getValueFromDate"

const getUvSrc = (uv?: number): string => {
  let name: string = 'uv-index';
  if (uv) {
    const uvInRange = Math.min(Math.max(uv, 1), 12);
    if (uvInRange >= 12) name = `uv-index-11-plus`
    else name = `uv-index-${uv}`
  }
  return `${ICON_BASE_URI}${name}.svg`
}

export default function getUVIcon(weather?: IWeather) {

  if (!weather) return undefined

  const { current, daily, timezone } = weather;

  if (current.is_day !== 1) return {
    alt: `UV Index: 0 (night)`,
    src: `${ICON_BASE_URI}${ICON_FILES.clearNight}.svg`,
    desc: 'Tá de noite'
  }

  const uvNumber = getTodayDailyValue(daily.time, daily.uv_index_max, timezone)
  // const uvNumber = 1

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
    uv: uvNumber,
    desc,
    iconDuration: getUvAnimationDuration(uvNumber)
  }
}

function getUvAnimationDuration(uvIndex: number): number {
  const MIN_UV = 1;
  const MAX_UV = 11;

  const MIN_DURATION = 1.5;  // UV 11
  const MAX_DURATION = 15; // UV 1

  // Limita entre 1 e 11
  const uv = Math.min(Math.max(uvIndex, MIN_UV), MAX_UV);

  // Normaliza para 0..1
  const t = (uv - MIN_UV) / (MAX_UV - MIN_UV);

  // Inverte para que UV maior = duração menor
  return MAX_DURATION - t * (MAX_DURATION - MIN_DURATION);
}