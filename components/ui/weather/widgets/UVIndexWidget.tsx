import { DetailCard } from '@/components/ui/DetailCard/DetailCard';
import MiniCard from '@/components/ui/MiniCard';
import { IWeather } from '@/types/weather.types';
import getUVIcon from '@/utils/weather/getUVIcon';
import { DateTime } from 'luxon';
import WeatherIcon from '../WeatherIcon';
import { useTranslation } from 'react-i18next';
import useBoolean from '@/hooks/useBoolean';
import ZoneGaugeBar from '../../ZoneGaugeBar';

interface Props {
  weather: IWeather;
  date: DateTime
  kind: 'now' | 'day';
  size?: number; // Tamanho do ícone
  miniCard?: boolean; // Se deve renderizar um MiniCard em vez de DetailCard
};

export default function UVIndexWidget({ weather, date, miniCard, kind = 'day', size = 120 }: Props) {
  const { t } = useTranslation();
  const [gaugeShowing, { toggle: toggleGauge }] = useBoolean();

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

  const zones: { value: number; color: string }[] = [
    { value: 0, color: "#86CFA3" },  // Verde — baixo
    { value: 3, color: "#F2D37A" },  // Amarelo — moderado
    { value: 6, color: "#F2A56F" },  // Laranja — alto
    { value: 8, color: "#E97C7C" },  // Vermelho — muito alto
    { value: 11, color: "#A982C7" }, // Roxo — extremo
  ];

  return (
    <DetailCard
      onDoubleClick={onDebugClick}
      title={t('uvIndex')}
      description={t(desc)}
      onClick={toggleGauge}
      icon={(
        <WeatherIcon
          src={src}
          title={alt}
          alt={alt}
          size={size}
          duration={iconDuration}
        />
      )} >
      {gaugeShowing && (
        <ZoneGaugeBar
          value={uv ?? 0}
          zones={zones}
          min={0}
          max={12}
          hideZoneLabel
        />
      )}
    </DetailCard>
  )
}
