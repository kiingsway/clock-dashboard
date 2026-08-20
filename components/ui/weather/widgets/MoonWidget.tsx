import { DetailCard } from '@/components/ui/DetailCard/DetailCard';
import MiniCard from '@/components/ui/MiniCard';
import { useNow } from '@/contexts/NowContext';
import { useTranslation } from 'react-i18next';
import { IWeather } from '@/types/weather.types';
import { DateTime } from 'luxon';
import { getMoonIllumination } from 'suncalc';
import WeatherIcon from '../WeatherIcon';
import { getMoonPhaseInfo } from '@/utils/weather/getMoonInfo';

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

  const moonNow = weather?.daily_moon?.find(m => m.date === (kind === 'now' ? now : date).toISODate());

  const [moonrise, moonset] = [moonNow?.moonrise, moonNow?.moonset].map(moonTime => {
    const datetime = moonTime ? DateTime.fromISO(moonTime) : undefined;
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

  return (
    <DetailCard
      title={t('moon')}
      description={title}
      icon={icon}
      onDoubleClick={onDebugClick}
    />
  )
}
