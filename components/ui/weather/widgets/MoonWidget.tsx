import { DetailCard } from '@/components/ui/DetailCard/DetailCard';
import MiniCard from '@/components/ui/MiniCard';
import WeatherIcon from '../WeatherIcon';
import getMoonInfo, { IMoonInfoWithTimes } from '@/utils/weather/getMoonInfo';
import { useNow } from '@/contexts/NowContext';
import { useTranslation } from 'react-i18next';
import { IWeather } from '@/types/weather.types';
import { DateTime } from 'luxon';

type MoonInfoProps = {
  moonInfo: IMoonInfoWithTimes

  weather?: never;
  date?: never;
};

type WeatherProps = {
  moonInfo?: never;

  weather: IWeather;
  date: DateTime
};

export type Props = (MoonInfoProps | WeatherProps) & {
  size?: number; // Tamanho do ícone
  miniCard?: boolean; // Se deve renderizar um MiniCard em vez de DetailCard
};

export default function MoonWidget({ moonInfo: moonInfoData, date, weather, miniCard = false, size = 120 }: Props) {
  const { t } = useTranslation();
  const { now } = useNow();

  const moonInfo = moonInfoData || getMoonInfo({
    now: date,
    lat: weather.latitude,
    lon: weather.longitude,
    dailyMoon: weather.daily_moon,
  });

  const moonName = t(moonInfo.name)
  const title = `${moonName} (${(moonInfo.phase * 100).toFixed(2)}%)`;
  const icon = <WeatherIcon iconName={moonInfo.iconName} size={size} />;

  const moonrise = moonInfo.moonrise
    ? moonInfo.moonrise.hasSame(now, 'day')
      ? moonInfo.moonrise.toFormat('HH:mm')
      : moonInfo.moonrise.toFormat('dd/LL HH:mm')
    : '--:--';

  const moonset = moonInfo.moonset
    ? moonInfo.moonset.hasSame(now, 'day')
      ? moonInfo.moonset.toFormat('HH:mm')
      : moonInfo.moonset.toFormat('dd/LL HH:mm')
    : '--:--';

  const onDebugClick = (): void => console.info('Moon Phase:', { moonInfo });

  if (miniCard) {
    return (
      <MiniCard
        desc={`${t('moonrise')}: ${moonrise} | ${t('moonset')}: ${moonset}`}
        title={title}
        onDoubleClick={onDebugClick}
        icon={icon}
      />
    )
  }

  return (
    <DetailCard
      title={t('moon')}
      description={title}
      onDoubleClick={onDebugClick}
      icon={icon}
    />
  )
}
