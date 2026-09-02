import { IWeatherLocationItem } from '@/types/location.types';
import { SunWindow } from '@/types/sun.types';
import { getGoldenHourAccent } from '@/utils/weather/getAccentColor';
import { DateTime } from 'luxon';

export default function buildMarkerStrength(
  now: DateTime,
  location: IWeatherLocationItem,
  sunWindow: SunWindow | undefined,
  precipitation: number,
  disable: boolean = false,
): { accent: string, progress: number } {

  let accent = 'var(--wc-accent)';
  if (disable) return { progress: 0.3, accent };

  const data = getGoldenHourAccent(now, sunWindow, location);

  const precipProgress = getRainScale(precipitation);

  const p = [data?.goldenHour.progress, data?.noon.progress, precipProgress].filter(n => typeof n === 'number');
  const progress = Math.min(1, Math.max(...p, 0.3));

  if (data) {
    const { goldenHour, noon } = data;
    if (goldenHour.progress > 0.3) accent = goldenHour.color;
    else if (noon.progress > 0.3) accent = noon.color;
  }

  return { accent, progress };
}

const getRainScale = (value: number): number => {
  const min = 0.3;
  const max = 1;
  const maxRain = 10;

  return min + (Math.min(Math.max(value, 0), maxRain) / maxRain) * (max - min);
};