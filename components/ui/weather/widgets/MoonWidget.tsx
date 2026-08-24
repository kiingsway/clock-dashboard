import { DetailCard } from '@/components/ui/DetailCard/DetailCard';
import MiniCard from '@/components/ui/MiniCard';
import { useNow } from '@/contexts/NowContext';
import { useTranslation } from 'react-i18next';
import { IWeather } from '@/types/weather.types';
import { DateTime } from 'luxon';
import { getMoonIllumination } from 'suncalc';
import WeatherIcon from '../WeatherIcon';
import { getMoonPhaseInfo } from '@/utils/weather/getMoonInfo';
import useBoolean from '@/hooks/useBoolean';
import ZoneGaugeBar from '../../ZoneGaugeBar';

interface Props {
  weather: IWeather;
  size?: number; // Tamanho do ícone
  date: DateTime
  kind: 'now' | 'day';
  miniCard?: boolean; // Se deve renderizar um MiniCard em vez de DetailCard
};

export default function MoonWidget({ date, weather, kind = 'now', miniCard = false, size = 120 }: Props) {
  const { t } = useTranslation();
  const { now } = useNow();
  const [gaugeShowing, { toggle: toggleGauge }] = useBoolean();

  const moonNow = weather?.daily_moon?.find(m => m.date === (kind === 'now' ? now : date).toISODate());

  const [moonrise, moonset] = [moonNow?.moonrise, moonNow?.moonset].map(moonTime => {
    const datetime = moonTime ? DateTime.fromISO(moonTime).setZone(weather.timezone) : undefined;
    if (!datetime?.isValid) return { date: undefined, text: '--/-- --:--' };
    const isToday = datetime.hasSame(now, 'day');
    return { date: datetime, text: datetime.toFormat(`${isToday ? '' : 'dd/LL '}HH:mm`) }
  });

  const phaseDate = (() => {
    if (kind === 'now') return now;
    if (moonrise.date?.isValid) return moonrise.date;
    if (moonset.date?.isValid) return moonset.date;
    return date;
  })();

  const { phase } = getMoonIllumination(phaseDate.toJSDate());
  const { name, icon: iconName } = getMoonPhaseInfo(phase);

  const title = `${t(name)} ${phase ? `(${(phase * 100).toFixed(2)}%)` : ''}`;

  const icon = <WeatherIcon iconName={iconName} size={size} />;

  const onDebugClick = (): void => console.info('Moon Phase:', { moonNow, moonrise, moonset, phaseDate, phase, name, iconName, title });

  if (miniCard) {
    return (
      <MiniCard
        desc={`${t('moonrise')}: ${moonrise.text} | ${t('moonset')}: ${moonset.text}`}
        title={title}
        icon={icon}
        onDoubleClick={onDebugClick}
      />
    )
  }

  const moonPhaseZones: { value: number; color: string }[] = [
    { value: Math.round((0 / 16) * 100), color: "#24304A" },
    { value: Math.round((1 / 16) * 100), color: "#405B86" },
    { value: Math.round((3 / 16) * 100), color: "#5F78A3" },
    { value: Math.round((5 / 16) * 100), color: "#8295B5" },
    { value: Math.round((7 / 16) * 100), color: "#D8DDE5" },
    { value: Math.round((9 / 16) * 100), color: "#8295B5" },
    { value: Math.round((11 / 16) * 100), color: "#5F78A3" },
    { value: Math.round((13 / 16) * 100), color: "#405B86" },
    { value: Math.round((15 / 16) * 100), color: "#24304A" },
  ];

  return (
    <DetailCard
      title={t('moon')}
      description={title}
      icon={icon}
      onClick={toggleGauge}
      onDoubleClick={onDebugClick}
    >
      {gaugeShowing && (
        <ZoneGaugeBar
          value={+(phase * 100).toFixed(1)}
          unit='%'
          zones={moonPhaseZones}
          min={moonPhaseZones[0].value}
          max={100}
          hideZoneLabel
        />
      )}
    </DetailCard>
  )
}
