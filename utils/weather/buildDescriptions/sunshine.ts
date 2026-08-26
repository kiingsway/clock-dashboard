import { DailySheetItemDesc } from '@/types/weatherInfo.types';
import { TFunction } from 'i18next';
import { formatDuration } from '@/utils/formatters/dateFormatters';
import { getSunshineDurationDescription } from '@/constants/descriptions';

export default function buildSunshineDescription(sunshine: number, t: TFunction): DailySheetItemDesc {

  const text = formatDuration(sunshine);
  const desc = getSunshineDurationDescription(sunshine, t);

  return {
    title: `${t('sunshine')}: ${text}`,
    desc,
    icons: [{ category: "sunrise" }]
  };
}
