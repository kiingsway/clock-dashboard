import { DailySheetItemDesc } from '@/types/weatherInfo.types';
import { TFunction } from 'i18next';
import { getCompassDirection } from '@/utils/geo/getCompassDirection';
import { getDailyWindSummary, getWindIcons } from '../getWindInfo';

export default function buildWindDescription(windSpeed: number, windGusts: number, windDirection: number, unit: string, t: TFunction): DailySheetItemDesc {

  const compass = getCompassDirection(windDirection, t);

  return {
    title: `${t('windSpeed')}: ${windSpeed} ${unit}`,
    desc: getDailyWindSummary(windSpeed, windGusts, unit, compass.name, t),
    icons: getWindIcons(windSpeed, compass, t),
  };
}
