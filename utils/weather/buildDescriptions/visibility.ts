import { DailySheetItemDesc } from '@/types/weatherInfo.types'
import { TFunction } from 'i18next';
import getVisibilityDescription from '../getVisibilityDescription';
import { getVisibilityColor } from '../getColors';
import { formatMetricValue } from '@/utils/formatters/textFormatters';

export default function buildVisibilityDescription(visibility: number, unit: string, locale: string, isDay: boolean, t: TFunction): DailySheetItemDesc {

  const iconName = (() => {
    if (visibility <= 2000) return `cloud-down`;
    if (visibility <= 5000) return `fog-${isDay ? 'day' : 'night'}`;
    return 'rainbow-clear';
  })();

  return {
    title: formatMetricValue(visibility, locale, unit),
    desc: getVisibilityDescription(visibility, t),
    icons: [{ iconName }],
    textColor: getVisibilityColor(visibility)
  }
}
