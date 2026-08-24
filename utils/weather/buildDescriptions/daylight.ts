import { DailySheetItemDesc } from '@/types/weatherInfo.types'
import { TFunction } from 'i18next';
import getDaylightDurationDescription from '../getDaylightDurationDescription';
import { formatDuration } from '@/utils/formatters/dateFormatters';

export default function buildDaylightDescription(daylight: number, t: TFunction): DailySheetItemDesc {

  const text = formatDuration(daylight);
  const desc = getDaylightDurationDescription(daylight, t);

  return {
    title: `${t('daylight')}: ${text}`,
    desc,
    icons: [{ category: "sunrise" }],
  }
}
