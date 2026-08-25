import { DailySheetItemDesc } from '@/types/weatherInfo.types';
import { TFunction } from 'i18next';
import { getMoonPhaseInfo } from '../getMoonInfo';
import { IMoonDaily } from '@/types/weather.types';
import getMoonriseSetPhase, { getMoonriseSetDate } from '../getMoonriseSetPhase';

export default function buildMoonDescription(moonDaily: IMoonDaily | undefined, timezone: string, t: TFunction): DailySheetItemDesc {

  if (!moonDaily) return { desc: '-', title: '-', icons: [{ category: 'unknown' }] };

  const { moonrise, moonset } = getMoonriseSetDate(moonDaily.moonrise, moonDaily.moonset, timezone);

  const { moonrisePhase } = getMoonriseSetPhase(moonrise, moonset);

  const phase = moonrisePhase.phase || moonDaily.phase;

  const { name, icon: iconName } = getMoonPhaseInfo(phase);

  const moonrisePhaseText = typeof phase === 'number' ? `${(phase * 100).toFixed(2)}%` : `-%`;

  const desc = (() => {
    const [moonriseText, moonsetText] = [moonrise, moonset]
      .map(d => d ? d.toFormat(`dd/LL HH:mm`) : '--:--');

    return `${t('moonrise')}: ${moonriseText} | ${t('moonset')}: ${moonsetText}`;
  })();

  return {
    title: `${t(name)} (${moonrisePhaseText})`,
    desc,
    icons: [{ iconName }],
  };
}