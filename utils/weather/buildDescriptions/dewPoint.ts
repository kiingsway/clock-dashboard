import { DailySheetItemDesc } from '@/types/weatherInfo.types'
import { TFunction } from 'i18next';
import { getDewPointDescription } from '../getDewPointDescription';

export default function buildDewPointDescription(dewPoint: number, unit: string, t: TFunction): DailySheetItemDesc {

  const desc = getDewPointDescription(dewPoint, t);

  return {
    title: `${t('dewPoint')}: ${dewPoint}${unit}`,
    desc,
    icons: [{ iconName: "thermometer-raindrop" }],
  }
}
