import { DetailCard } from '@/components/ui/DetailCard/DetailCard'
import MiniCard from '@/components/ui/MiniCard';
import { IWeather } from '@/types/weather.types';
import { DateTime } from 'luxon';
import WeatherIcon from '../WeatherIcon';
import { useTranslation } from 'react-i18next';
import getWindInfo, { WindData } from '@/utils/weather/getWindInfo';
import { capitalizeWords } from '@/utils/formatters/textFormatters';

type WindProps = {
  windInfo: WindData;

  weather?: never;
  date?: never;
};

type WeatherProps = {
  windInfo?: never;

  weather: IWeather;
  date: DateTime
};

export type Props = (WindProps | WeatherProps) & {
  size?: number; // Tamanho do ícone
  miniCard?: boolean; // Se deve renderizar um MiniCard em vez de DetailCard
};

export default function WindWidget({ windInfo: windInfoProps, date, weather, miniCard, size = 120 }: Props) {
  const { t } = useTranslation();

  // Mudar para windInfo depois
  const windInfo = windInfoProps || getWindInfo(weather, date, t);
  if (!windInfo) return null;

  const onDebugClick = (): void => console.info('Wind Info:', { windInfo });

  const { day, now } = windInfo;

  if (miniCard) {
    return (
      <MiniCard
        title={`${t('windSpeed')}: ${now.speed} - ${t('windGusts')}: ${now.gusts}`}
        desc={now.speedDesc}
        onDoubleClick={onDebugClick}
        size={size}
        icons={[
          <WeatherIcon
            key="beaufort"
            src={now.beaufort?.src || ''}
            title={`Beaufort Scale: ${now.beaufort?.value} (${now.speed})`}
            alt={`Beaufort Scale: ${now.beaufort?.value} (${now.speed})`}
            duration={now.beaufort?.duration}
          />,
          <WeatherIcon
            key="direction"
            src={now.direction?.src || ''}
            title={`${capitalizeWords(t('wind'))} ${now.direction?.name}`}
            alt={`${capitalizeWords(t('wind'))} ${now.direction?.name}`}
            duration={now.beaufort?.duration}
          />,
        ]}
      />
    )
  }

  return (
    <>
      <DetailCard
        onDoubleClick={onDebugClick}
        title={t('windSpeed')}
        description={now.speedDesc}
        icon={now.beaufort?.src && now.direction?.src && (
          <>
            <WeatherIcon
              src={now.beaufort.src}
              title={`Beaufort Scale: ${now.beaufort?.value} (${now.speed})`}
              alt={`Beaufort Scale: ${now.beaufort?.value} (${now.speed})`}
              duration={now.beaufort?.duration}
              size={80}
            />
            <WeatherIcon
              src={now.direction.src}
              title={`${capitalizeWords(t('wind'))} ${now.direction?.name}`}
              alt={`${capitalizeWords(t('wind'))} ${now.direction?.name}`}
              duration={now.beaufort?.duration}
              size={80}
            />
          </>
        )}
      />

      {now.gusts && <DetailCard
        title={t('windGusts')}
        textColor={now.gustsColor}
        bigText={now.gusts}
        description={t('averageSpeedForDay', { speed: day.gusts })}
      />}
    </>
  )
}
