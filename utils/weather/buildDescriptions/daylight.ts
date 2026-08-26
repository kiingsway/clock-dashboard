import { DailySheetItemDesc } from '@/types/weatherInfo.types';
import { TFunction } from 'i18next';
import { formatDuration } from '@/utils/formatters/dateFormatters';
import { getDaylightDurationDescription } from '@/constants/descriptions';

export default function buildDaylightDescription(daylight: number, t: TFunction): DailySheetItemDesc {

  const text = formatDuration(daylight);
  const desc = getDaylightDurationDescription(daylight, t);

  return {
    title: `${t('daylight')}: ${text}`,
    desc,
    icons: [{ category: "sunrise" }],
  };
}
