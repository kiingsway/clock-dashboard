import { DailySheetItemDesc } from '@/types/weatherInfo.types';
import { TFunction } from 'i18next';
import { getDaylightSunshineInfo } from '../getDaylightSunshineInfo';

export default function buildDaylightDescription(daylight: number, t: TFunction): DailySheetItemDesc {

  const { title, desc, icon, time } = getDaylightSunshineInfo(daylight, 'daylight', true, t);

  return {
    title: `${title}: ${time}`,
    desc,
    icons: [{ iconName: icon }],
  };
}
