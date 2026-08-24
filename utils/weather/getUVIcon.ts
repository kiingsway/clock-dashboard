import ICON_FILES, { createIconUrl } from "@/constants/iconFiles";
import { IWeather } from "@/types/weather.types"
import { IUVIcon } from "@/types/weatherInfo.types";
import { DateTime } from "luxon";
import { getCurrentValue } from "../formatters/getValueByArray";
import { TFunction } from "i18next";

const getUvSrc = (uv: number | undefined): string => {
  let name: string = 'uv-index';
  if (typeof uv === 'number') {
    const uvInRange = Math.min(Math.max(Math.round(uv), 0), 12);
    if (uvInRange === 0) name = 'partly-cloudy-day';
    else if (uvInRange > 11) name = `uv-index-11-plus`;
    else name = `uv-index-${uvInRange}`;
  }
  return createIconUrl(name);
}

interface GetUVIconProps {
  weather: IWeather;
  date: DateTime;
  kind: 'now' | 'day';
  t: TFunction;
}

export default function getUVIcon({ weather, date, kind, t }: GetUVIconProps): IUVIcon | undefined {
  const { hourly, daily } = weather;

  const time = kind === 'day' ? daily.time : hourly.time;
  const values = kind === 'day' ? daily.uv_index_max : hourly.uv_index;

  if (kind === 'now') {
    const isHourlyDay = getCurrentValue({
      date,
      time: hourly.time,
      values: hourly.is_day,
    });

    if (!isHourlyDay) return {
      alt: `${t('uvIndex')}: 0 (${t('night')})`,
      src: createIconUrl(ICON_FILES.clearNight),
      desc: t('uvIndexes.noUvIndex')
    }
  }

  const uvNumber = getCurrentValue({ date, time, values });

  if (typeof uvNumber !== 'number') return undefined;

  const uvIcon = getUvSrc(uvNumber)
  const uvIndex = Math.round(uvNumber)

  const desc = (() => {
    if (uvIndex <= 2) return t('uvIndexes.low');
    if (uvIndex <= 5) return t('uvIndexes.moderate');
    if (uvIndex <= 7) return t('uvIndexes.high');
    if (uvIndex <= 10) return t('uvIndexes.veryHigh');
    return t('uvIndexes.extreme');
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