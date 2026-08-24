import { WeatherIconProps } from '@/components/ui/weather/WeatherIcon';
import ICON_FILES, { createIconUrl } from '@/constants/iconFiles';
import { DailySheetItemDesc } from '@/types/weatherInfo.types';
import { TFunction } from 'i18next';

export function getUvSrc(uv: number | undefined, isDay: boolean = true): string {
  if ((!uv || uv < 1) && !isDay) return createIconUrl(ICON_FILES.clearNight);
  let name: string = 'uv-index';
  if (typeof uv === 'number') {
    const uvInRange = Math.min(Math.max(Math.round(uv), 0), 12);
    if (uvInRange === 0) name = 'partly-cloudy-day';
    else if (uvInRange > 11) name = `uv-index-11-plus`;
    else name = `uv-index-${uvInRange}`;
  }
  return createIconUrl(name);
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

export default function buildUVDescription(uvIndex: number, isDay: boolean, t: TFunction): DailySheetItemDesc {
  const desc = (() => {
    if (!isDay) return t('uvIndexes.noUvIndex');
    if (uvIndex <= 2) return t('uvIndexes.low');
    if (uvIndex <= 5) return t('uvIndexes.moderate');
    if (uvIndex <= 7) return t('uvIndexes.high');
    if (uvIndex <= 10) return t('uvIndexes.veryHigh');
    return t('uvIndexes.extreme');
  })();

  const alt = `${t('uvIndex')}: ${uvIndex}${!isDay ? ` (${t('night')})` : ''}`;

  const iconProps: WeatherIconProps = {
    src: getUvSrc(uvIndex, isDay),
    alt, title: alt,
    duration: getUvAnimationDuration(uvIndex)
  }

  const title = `${t('uvIndex')}: ${uvIndex || '-'}`;

  return {
    title,
    desc,
    icons: [iconProps]
  }
}
