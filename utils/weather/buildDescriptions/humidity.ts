import { getHumidityDescription } from '@/constants/descriptions';
import { DailySheetItemDesc } from '@/types/weatherInfo.types';
import { TFunction } from 'i18next';

export default function buildHumidityDescription(humidity: number, unit: string, t: TFunction): DailySheetItemDesc {

  const desc = getHumidityDescription(humidity, t);

  return {
    title: `${t('humidity')}: ${humidity}${unit}`,
    desc,
    icons: [{ iconName: "humidity" }],
  };
}
