import { IWeather } from '@/types/weather.types';
import getVisibilityInfo from '@/utils/weather/getVisibilityInfo'
import { DateTime } from 'luxon';
import { useTranslation } from 'react-i18next';
import { DetailCard } from '../../DetailCard/DetailCard';
import MiniCard from '../../MiniCard';
import WeatherIcon from '../WeatherIcon';
import { formatLocaleNumber } from '@/utils/formatters/textFormatters';
import useBoolean from '@/hooks/useBoolean';
import WindGustsGauge from '../Gauges/WindGustsGauge';
import { MAX_VISIBILITY_METERS, VISIBILITY_COLORS } from '@/constants/visibility';

interface Props {
  weather: IWeather;
  date: DateTime<boolean>;
  size?: number;
  miniCard?: boolean;
}

export default function VisibilityWidget({ date, weather, size = 60, miniCard }: Props) {
  const { t, i18n: { language: locale } } = useTranslation();
  const [gaugeShowing, { toggle: toggleGauge }] = useBoolean();

  const visibility = getVisibilityInfo(weather, date, locale, t);

  if (!visibility) return null;

  const formattedVisibility = (() => {
    const { value, unit } = visibility;
    if (value < 1000) return `${formatLocaleNumber(value, locale)} ${unit}`;
    return `${formatLocaleNumber(value / 1000, locale)} k${unit}`
  })();

  const onDebugClick = () => console.info('Visibility:', visibility);

  if (miniCard) return (
    <MiniCard
      title={`${t('visibility')}: ${formattedVisibility}`}
      desc={visibility.desc}
      onDoubleClick={onDebugClick}
      icon={<WeatherIcon iconName="rainbow-clear" size={size} />}
    />
  );

  const subArcs = VISIBILITY_COLORS.map(({ hex: color, value: limit }) => ({ limit, color }));

  return (
    <DetailCard
      title={t('visibility')}
      bigText={formattedVisibility}
      textColor={visibility.color}
      description={visibility.desc}
      onClick={toggleGauge}
      onDoubleClick={onDebugClick}
    >
      {gaugeShowing && (
        <WindGustsGauge
          value={visibility.value}
          valueColor={visibility.color}
          unit={visibility.unit}
          subArcs={subArcs}
          max={MAX_VISIBILITY_METERS}
        />
      )}
    </DetailCard>
  )
}
