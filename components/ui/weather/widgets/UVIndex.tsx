import { DetailCard } from '@/components/ui/DetailCard/DetailCard';
import MiniCard from '@/components/ui/MiniCard';
import { IWeather } from '@/types/weather.types';
import { IUVIcon } from '@/types/weatherInfo.types';
import getUVIcon from '@/utils/weather/getUVIcon';
import { DateTime } from 'luxon';
import WeatherIcon from '../WeatherIcon';
import { useTranslation } from 'react-i18next';

type UVIndexProps = {
  uvIcon: IUVIcon;

  weather?: never;
  date?: never;
};

type WeatherProps = {
  uvIcon?: never;

  weather: IWeather;
  date: DateTime
};

export type Props = (UVIndexProps | WeatherProps) & {
  kind: 'now' | 'day';
  size?: number; // Tamanho do ícone
  miniCard?: boolean; // Se deve renderizar um MiniCard em vez de DetailCard
};

export default function UVIndexWidget({ uvIcon: uvIconProp, weather, date, miniCard, kind = 'day', size = 120 }: Props) {
  const { t } = useTranslation();

  const uvIcon = uvIconProp || getUVIcon({ date, weather, kind, t });
  if (!uvIcon) return null;

  const onDebugClick = (): void => console.info('UV Index:', uvIcon);

  if (miniCard) {
    return (
      <MiniCard
        title={`${t('uvIndex')}: ${uvIcon.uv || 0}`}
        desc={t(uvIcon.desc)}
        onDoubleClick={onDebugClick}
        icon={(
          <WeatherIcon
            src={uvIcon.src}
            title={uvIcon.alt}
            alt={uvIcon.alt}
            size={size}
            duration={uvIcon.iconDuration}
          />)}
      />
    )
  }

  return (
    <DetailCard
      onDoubleClick={onDebugClick}
      title={t('uvIndex')}
      description={t(uvIcon.desc)}
      icon={(
        <WeatherIcon
          src={uvIcon.src}
          title={uvIcon.alt}
          alt={uvIcon.alt}
          size={size}
          duration={uvIcon.iconDuration}
        />
      )} />
  )
}
