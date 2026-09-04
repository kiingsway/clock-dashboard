import { getTimes } from 'suncalc';
import { DateTime } from 'luxon';
import { WeatherCategoryName } from '@/types/weather.types';

const MIN_GLOW = 0.3;
const MAX_GLOW = 1;
const NOON_WINDOW_MINUTES = 90;
const MAX_RAIN_MM = 10;

const CLEAR_CATEGORIES = new Set([
  'clear',
  'partlyCloudy',
  'lightFog',
]) as Set<WeatherCategoryName>;

const RAIN_CATEGORIES = new Set([
  'drizzle',
  'freezingDrizzle',
  'rain',
  'heavyRain',
  'freezingRain',
  'showers',
  'thunderstorm',
  'moderateHail',
  'heavyHail',
]) as Set<WeatherCategoryName>;

export function getGlowStrength({
  date,
  precipitation,
  weatherCategory,
  lat,
  lon,
}: {
  date: DateTime;
  precipitation: number;
  weatherCategory: WeatherCategoryName;
  lat: number | undefined;
  lon: number | undefined;
}): number {
  if (CLEAR_CATEGORIES.has(weatherCategory) && typeof lat === 'number' && typeof lon === 'number') return getNoonGlowStrength(date, lat, lon);
  if (RAIN_CATEGORIES.has(weatherCategory)) return getRainGlowStrength(precipitation);
  return MIN_GLOW;
}

function getNoonGlowStrength(
  date: DateTime,
  lat: number,
  lon: number,
): number {
  const { solarNoon } = getTimes(date.toJSDate(), lat, lon);

  if (!solarNoon || Number.isNaN(solarNoon.getTime())) {
    return MIN_GLOW;
  }

  const diffMinutes =
    Math.abs(date.toMillis() - solarNoon.getTime()) / 60_000;

  if (diffMinutes >= NOON_WINDOW_MINUTES) {
    return MIN_GLOW;
  }

  const progress = diffMinutes / NOON_WINDOW_MINUTES;

  return MAX_GLOW - progress * (MAX_GLOW - MIN_GLOW);
}

function getRainGlowStrength(precipitation: number): number {
  const rain = Math.min(Math.max(precipitation, 0), MAX_RAIN_MM);

  return MIN_GLOW + (rain / MAX_RAIN_MM) * (MAX_GLOW - MIN_GLOW);
}