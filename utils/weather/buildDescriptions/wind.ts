import { DailySheetItemDesc } from '@/types/weatherInfo.types';
import { TFunction } from 'i18next';
import { getCompassDirection } from '@/utils/geo/getCompassDirection';
import { capitalizeWords } from '@/utils/formatters/textFormatters';
import getBeaufortScale from '@/utils/geo/getBeaufortScale';
import { getWindGustAnimationDuration, getWindSummary2 } from '../getWindInfo';
import { createIconUrl } from '@/constants/iconFiles';

export default function buildWindDescription(windSpeed: number, windGusts: number, windDirection: number, unit: string, t: TFunction): DailySheetItemDesc {

  const compass = getCompassDirection(windDirection, t);

  const desc = getWindSummary2(windSpeed, windGusts, unit, compass.name, t);

  const level = getBeaufortScale(windSpeed);
  const beaufortSrc = createIconUrl(`wind-beaufort-${level}`);
  const beaufortDuration = getWindGustAnimationDuration(windSpeed);

  const beaufortTitle = `Beaufort Scale: ${level} (${windSpeed})`;
  const directionText = `${capitalizeWords(t('wind'))} ${compass.name}`;

  return {
    title: `${t('windSpeed')}: ${windSpeed} ${unit}`,
    desc,
    icons: [
      {
        src: beaufortSrc,
        title: beaufortTitle,
        alt: beaufortTitle,
        duration: beaufortDuration,
      },
      {
        src: createIconUrl(`wind-direction-${compass.abbreviation.toLowerCase()}`),
        title: directionText,
        alt: directionText,
        duration: beaufortDuration,
      },
    ]
  };
}
