import { DetailCard } from '@/components/ui/DetailCard/DetailCard'
import MiniCard from '@/components/ui/MiniCard';
import { IWeather } from '@/types/weather.types';
import { DateTime } from 'luxon';
import WeatherIcon from '../WeatherIcon';
import { useTranslation } from 'react-i18next';
import getWindInfo from '@/utils/weather/getWindInfo';
import { capitalizeWords } from '@/utils/formatters/textFormatters';
import { IWindInfo } from '@/types/weatherInfo.types';
import WindGustsGauge from '../Gauges/WindGustsGauge';
import { WIND_GUSTS_COLORS } from '@/constants/wind';
import useBoolean from '@/hooks/useBoolean';

type WindProps = {
  windInfo: IWindInfo;

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
  const [gaugeShowing, { toggle: toggleGauge }] = useBoolean();

  const windInfo = windInfoProps || getWindInfo(weather, date, t);
  if (!windInfo) return null;

  const onDebugClick = (): void => console.info('Wind Info:', windInfo);

  const { day, now } = windInfo;

  const nowBeaufortTitle = `Beaufort Scale: ${now.beaufort?.value} (${now.speed.value}${now.speed.unit})`;

  if (miniCard) {
    return (
      <MiniCard
        title={`${t('windSpeed')}: ${now.speed.value} ${now.speed.unit} - ${t('windGusts')}: ${now.gusts.value} ${now.gusts.unit}`}
        desc={now.speed.desc}
        onDoubleClick={onDebugClick}
        size={size}
        icons={[
          <WeatherIcon
            key="beaufort"
            src={now.beaufort?.src || ''}
            title={nowBeaufortTitle}
            alt={nowBeaufortTitle}
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

  const subArcs = WIND_GUSTS_COLORS.map(({ hex: color, value: limit }) => ({ limit, color }));

  return (
    <>
      <DetailCard
        onDoubleClick={onDebugClick}
        title={t('windSpeed')}
        description={now.speed.desc}
        icon={now.beaufort?.src && now.direction?.src && (
          <>
            <WeatherIcon
              src={now.beaufort.src}
              title={nowBeaufortTitle}
              alt={nowBeaufortTitle}
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

      {now.gusts && (
        <DetailCard
          title={t('windGusts')}
          textColor={now.gusts.color}
          bigText={`${now.gusts.value} ${now.gusts.unit}`}
          description={t('averageSpeedForDay', { speed: day.gusts.value + day.gusts.unit })}
          onClick={toggleGauge}
        >
          {gaugeShowing && (
            <WindGustsGauge
              value={now.gusts.value}
              valueColor={now.gusts.color}
              unit={now.gusts.unit}
              mean={day.gusts.value}
              subArcs={subArcs}
              max={WIND_GUSTS_COLORS.at(-1)!.value}
            />
          )}
        </DetailCard>
      )}
    </>
  )
}
