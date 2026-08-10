import { DetailCard } from '@/components/ui/DetailCard/DetailCard'
import MiniCard from '@/components/ui/MiniCard';
import { IWeather } from '@/types/weather.types';
import { IWindInfo } from '@/types/weatherInfo.types'
import getWindInfo from '@/utils/weather/getWindInfo';
import { DateTime } from 'luxon';
import WeatherIcon from '../WeatherIcon';

type WindProps = {
  windInfo: IWindInfo;

  weather?: never;
  date?: never;
};

type WeatherProps = {
  windInfo?: never;

  weather: IWeather;
  date?: DateTime
};

export type Props = (WindProps | WeatherProps) & {
  size?: number; // Tamanho do ícone
  miniCard?: boolean; // Se deve renderizar um MiniCard em vez de DetailCard
};

export default function WindWidget({ windInfo: windInfoProps, date, weather, miniCard, size = 120 }: Props) {

  const windInfo = windInfoProps || getWindInfo(weather, date);
  if (!windInfo) return null;

  const onDebugClick = (): void => console.info('Wind Info:', windInfo);

  if (miniCard) {
    return (
      <MiniCard
        desc={windInfo.daily?.desc}
        title={`Speed: ${windInfo.daily?.speed}km/h - Gusts ${windInfo.daily?.gusts}km/h`}
        onDoubleClick={onDebugClick}
        size={size}
        icons={[
          <WeatherIcon
            key="beaufort"
            src={windInfo.hourly.beaufort?.src || ""}
            title={`Vento ${windInfo.hourly.direction.name}`}
            alt={`Vento ${windInfo.hourly.direction.name}`}
            duration={windInfo.hourly.beaufort?.duration}
          />,
          <WeatherIcon
            key="direction"
            src={windInfo.hourly.direction.src}
            title={`Vento ${windInfo.hourly.direction.name}`}
            alt={`Vento ${windInfo.hourly.direction.name}`}
            duration={windInfo.hourly.beaufort?.duration}
          />,
        ]}
      />
    )
  }

  return (
    <>
      <DetailCard
        title="Wind Gusts Now"
        textColor={windInfo.hourly.gustsColor}
        bigText={`${windInfo.hourly.gusts}km/h`}
        description={`Média de ${windInfo.daily?.gusts}km/h no dia`}
      />

      <DetailCard
        onDoubleClick={onDebugClick}
        title="Wind"
        description={`${windInfo.hourly.desc} Sentido ${windInfo.hourly.direction.name?.toLowerCase()}.`}
        icon={windInfo.hourly.beaufort?.src && windInfo.hourly.direction.src && (
          <>
            <WeatherIcon
              src={windInfo.hourly.beaufort?.src}
              title={`Vento ${windInfo.hourly.direction.name}`}
              alt={`Vento ${windInfo.hourly.direction.name}`}
              duration={windInfo.hourly.beaufort.duration}
              size={80}
            />
            <WeatherIcon
              src={windInfo.hourly.direction.src}
              title={`Vento ${windInfo.hourly.direction.name}`}
              alt={`Vento ${windInfo.hourly.direction.name}`}
              duration={windInfo.hourly.beaufort.duration}
              size={80}
            />
          </>
        )}
      />
    </>
  )
}
