import { DailySheetItemDesc } from '@/types/weatherInfo.types';
import { TFunction } from 'i18next';
import { getDaylightSunshineInfo } from '../getDaylightSunshineInfo';

export default function buildSunshineDescription(sunshine: number, t: TFunction): DailySheetItemDesc {

  const { title, desc, icon, time } = getDaylightSunshineInfo(sunshine, 'sunshine', true, t);

  return {
    title: `${title}: ${time}`,
    desc,
    icons: [{ iconName: icon }],
  };
}

