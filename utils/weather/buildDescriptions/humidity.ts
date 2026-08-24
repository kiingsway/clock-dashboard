import { DailySheetItemDesc } from '@/types/weatherInfo.types'
import { TFunction } from 'i18next';
import getHumidityDescription from '../getHumidityDescription';

export default function buildHumidityDescription(humidity: number, unit: string, t: TFunction): DailySheetItemDesc {

  const desc = getHumidityDescription(humidity, t);

  return {
    title: `${t('humidity')}: ${humidity}${unit}`,
    desc,
    icons: [{ iconName: "humidity" }],
  }
}
