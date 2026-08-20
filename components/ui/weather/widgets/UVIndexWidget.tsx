import { DetailCard } from '@/components/ui/DetailCard/DetailCard';
import MiniCard from '@/components/ui/MiniCard';
import { IWeather } from '@/types/weather.types';
import getUVIcon from '@/utils/weather/getUVIcon';
import { DateTime } from 'luxon';
import WeatherIcon from '../WeatherIcon';
import { useTranslation } from 'react-i18next';

interface Props {
  weather: IWeather;
  date: DateTime
  kind: 'now' | 'day';
  size?: number; // Tamanho do ícone
  miniCard?: boolean; // Se deve renderizar um MiniCard em vez de DetailCard
};

export default function UVIndexWidget({ weather, date, miniCard, kind = 'day', size = 120 }: Props) {
  const { t } = useTranslation();

  const uvIcon = getUVIcon({ date, weather, kind, t });
  if (!uvIcon) return null;
  const { alt, desc, src, iconDuration, uv } = uvIcon;

  const onDebugClick = (): void => console.info('UV Index:', uvIcon);

  if (miniCard) {
    return (
      <MiniCard
        title={`${t('uvIndex')}: ${uv || 0}`}
        desc={t(desc)}
        onDoubleClick={onDebugClick}
        icon={(
          <WeatherIcon
            src={src}
            title={alt}
            alt={alt}
            size={size}
            duration={iconDuration}
          />)}
      />
    )
  }

  return (
    <DetailCard
      onDoubleClick={onDebugClick}
      title={t('uvIndex')}
      description={t(desc)}
      icon={(
        <WeatherIcon
          src={src}
          title={alt}
          alt={alt}
          size={size}
          duration={iconDuration}
        />
      )} />
  )
}
