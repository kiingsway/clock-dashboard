import { IWeather } from '@/types/weather.types';
import getVisibilityInfo from '@/utils/weather/getVisibilityInfo'
import { DateTime } from 'luxon';
import { useTranslation } from 'react-i18next';
import { DetailCard } from '../../DetailCard/DetailCard';
import MiniCard from '../../MiniCard';
import WeatherIcon from '../WeatherIcon';

interface Props {
  weather: IWeather;
  date: DateTime<boolean>;
  size?: number;
  miniCard?: boolean;
}

export default function VisibilityWidget({ date, weather, size = 60, miniCard }: Props) {
  const { t, i18n: { language: locale } } = useTranslation();

  const visibility = getVisibilityInfo(weather, date, locale, t);

  if (!visibility) return null;

  if (miniCard) {
    return (
      <MiniCard
        title={`${t('visibility')}: ${visibility.title}`}
        desc={visibility.desc}
        onDoubleClick={() => console.info('Visibility:', visibility)}
        icon={(
          <WeatherIcon iconName="rainbow-clear" size={size} />
        )}
      />
    )
  }

  return (
    <DetailCard
      title={t('visibility')}
      bigText={visibility.title}
      textColor={visibility.color}
      description={visibility.desc}
    />
  )
}
