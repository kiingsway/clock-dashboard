import { DetailCard } from '@/components/ui/DetailCard/DetailCard';
import MiniCard from '@/components/ui/MiniCard';
import { IMoonPhase } from '@/types/weatherInfo.types';
import getMoonPhase from '@/utils/weather/getMoonPhase';
import { DateTime } from 'luxon';
import WeatherIcon from '../WeatherIcon';

type MoonPhaseProps = {
  moonPhase: IMoonPhase;

  lat?: never;
  lon?: never;
  date?: never;
};

type CoordinatesProps = {
  moonPhase?: never;

  lat: number;
  lon: number;
  date: DateTime;
};

export type Props = (MoonPhaseProps | CoordinatesProps) & {
  size?: number; // Tamanho do ícone
  miniCard?: boolean; // Se deve renderizar um MiniCard em vez de DetailCard
};

export default function MoonWidget({ moonPhase: moonPhaseProp, date, lat, lon, size = 120, miniCard }: Props) {

  const moonPhase = moonPhaseProp || getMoonPhase({ date, lat, lon });
  const { title, phase, moonrise, moonset, iconSrc } = moonPhase || {};

  const moonPhaseTitle = `${title} (${(phase * 100).toFixed(2)}%)`;
  const onDebugClick = (): void => console.info('Moon Phase:', moonPhase);

  const moonriseTime = moonrise ? moonrise.toFormat('HH:mm') : '-';
  const moonsetTime = moonset ? moonset.toFormat('HH:mm') : '-';

  if (miniCard) {
    return (
      <MiniCard
        desc={`Moonrise: ${moonriseTime} | Moonset: ${moonsetTime}`}
        title={moonPhaseTitle}
        onDoubleClick={onDebugClick}
        icon={<WeatherIcon
          src={iconSrc}
          title={title}
          alt={title}
          size={size}
        />}
      />
    )
  }

  return (
    <>
      <DetailCard
        title="Moon"
        description={moonPhaseTitle}
        onDoubleClick={onDebugClick}
        icon={moonPhase && (
          <WeatherIcon
            src={iconSrc}
            title={title}
            alt={title}
            size={size}
          />
        )}
      />

      {moonrise && moonset && (
        <DetailCard
          title="Moonrise/Moonset"
          bigText={`${moonrise.toFormat('HH:mm')} - ${moonset.toFormat('HH:mm')}`}
          onDoubleClick={onDebugClick}
        />
      )}
    </>
  )
}
