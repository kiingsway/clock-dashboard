import { DailySheetItemDesc } from '@/types/weatherInfo.types';
import { TFunction } from 'i18next';
import { AQIScale } from '@/types/aqi.types';
import getAQIInfo from '@/utils/aqi/getAQIInfo';

export default function buildAQIDescription(aqi: number, type: AQIScale, t: TFunction): DailySheetItemDesc {

  const { level, color: textColor, desc } = getAQIInfo(aqi, type, 'aqi', t);

  return {
    title: t(level as string),
    desc: desc ?? '',
    textColor,
    icons: [],
  };
}
