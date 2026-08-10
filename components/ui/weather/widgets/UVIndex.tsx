import { DetailCard } from '@/components/ui/DetailCard/DetailCard';
import MiniCard from '@/components/ui/MiniCard';
import { IWeather } from '@/types/weather.types';
import { IUVIcon } from '@/types/weatherInfo.types';
import getUVIcon from '@/utils/weather/getUVIcon';
import { DateTime } from 'luxon';
import WeatherIcon from '../WeatherIcon';

type UVIndexProps = {
  uvIcon: IUVIcon;

  weather?: never;
  date?: never;
};

type WeatherProps = {
  uvIcon?: never;

  weather: IWeather;
  date?: DateTime
};

export type Props = (UVIndexProps | WeatherProps) & {
  size?: number; // Tamanho do ícone
  miniCard?: boolean; // Se deve renderizar um MiniCard em vez de DetailCard
};

export default function UVIndexWidget({ uvIcon: uvIconProp, weather, date, miniCard, size = 120 }: Props) {

  const uvIcon = uvIconProp || getUVIcon(weather, date, true);
  if (!uvIcon) return null;

  const onDebugClick = (): void => console.info('UV Index:', uvIcon);

  if (miniCard) {
    return (
      <MiniCard
        title={`UV Index ${uvIcon.uv}`}
        desc={uvIcon.desc}
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
      title="UV Index"
      description={uvIcon.desc}
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
