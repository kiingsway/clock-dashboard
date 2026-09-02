import { DailySheetItemDesc } from '@/types/weatherInfo.types';
import { TFunction } from 'i18next';
import { IMoonDailyItem } from '@/types/weather.types';
import { DateTime } from 'luxon';
import getMoonEvent from '../getMoonEvent';

export default function buildMoonDescription(dailyMoon: IMoonDailyItem[], date: DateTime, timezone: string, t: TFunction): DailySheetItemDesc {

  const moonDateIndex = dailyMoon.findIndex(m => m.date.date === date.toISODate());

  const moonDate = dailyMoon[moonDateIndex];

  if (!moonDate) return { desc: '', title: '', icons: [{ category: 'error' }] };

  const { rise, set } = moonDate;

  const eventRise = getMoonEvent(dailyMoon, moonDateIndex, 'rise', t);
  const eventSet = getMoonEvent(dailyMoon, moonDateIndex, 'set', t);

  const isSetBeforeRise = rise?.date && set?.date ? set.date < rise.date : false;
  const [start, end] = isSetBeforeRise ? [eventSet, eventRise] : [eventRise, eventSet];

  const name = rise?.name ?? set?.name ?? moonDate.date.name;
  const phase = rise?.phase ?? set?.phase ?? moonDate.date.phase;
  const moonrisePhaseText = typeof phase === 'number' ? `${(phase * 100).toFixed(2)}%` : `-%`;

  const icons = (() => {
    if (rise || set) {
      if (rise && set && rise.iconName !== set.iconName) return [rise.iconName, set.iconName];
      else return [rise?.iconName ?? set?.iconName] as string[];
    }

    return [moonDate.date.iconName ?? 'night'];
  })().map(iconName => ({ iconName }));

  return {
    title: `${t(name)} (${moonrisePhaseText})`,
    desc: `${start} | ${end}`,
    icons,
  };
}