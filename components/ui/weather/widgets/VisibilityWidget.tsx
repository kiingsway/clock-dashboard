import { IWeather } from '@/types/weather.types';
import { DateTime } from 'luxon';
import { useTranslation } from 'react-i18next';
import { DetailCard } from '../../DetailCard/DetailCard';
import MiniCard from '../../MiniCard';
import WeatherIcon from '../WeatherIcon';
import { formatLocaleNumber } from '@/utils/formatters/textFormatters';
import useBoolean from '@/hooks/useBoolean';
import WindGustsGauge from '../Gauges/WindGustsGauge';
import { MAX_VISIBILITY_METERS } from '@/constants/visibility';
import { getCurrentIndex } from '@/utils/formatters/getValueByArray';
import getVisibilityDescription from '@/utils/weather/getVisibilityDescription';
import { VISIBILITY_COLORS } from '@/constants/colors';
import { getVisibilityColor } from '@/utils/weather/getColors';

interface Props {
  weather: IWeather;
  date: DateTime<boolean>;
  size?: number;
  miniCard?: boolean;
}

export default function VisibilityWidget({ date, weather, size = 60, miniCard }: Props) {
  const { t, i18n: { language: locale } } = useTranslation();
  const [gaugeShowing, { toggle: toggleGauge }] = useBoolean();

  const { hourly, hourly_units: { visibility: unit } } = weather

  const nowIndex = getCurrentIndex({ date, time: hourly.time });

  const visibility = hourly.visibility[nowIndex];

  if (typeof visibility !== 'number') return null;

  const v = {
    text: formatVisibility(visibility, locale, unit),
    desc: getVisibilityDescription(visibility, t),
    color: getVisibilityColor(visibility),
  }

  const onDebugClick = () => console.info('Visibility:', visibility);

  if (miniCard) return (
    <MiniCard
      title={`${t('visibility')}: ${v.text}`}
      desc={v.desc}
      onDoubleClick={onDebugClick}
      icon={<WeatherIcon iconName="rainbow-clear" size={size} />}
    />
  );

  const subArcs = VISIBILITY_COLORS.map(({ hex: color, value: limit }) => ({ limit, color }));
  return (
    <DetailCard
      title={t('visibility')}
      bigText={v.text}
      textColor={v.color}
      description={v.desc}
      onClick={toggleGauge}
      onDoubleClick={onDebugClick}
    >
      {gaugeShowing && (
        <WindGustsGauge
          value={visibility}
          valueColor={v.color}
          unit={unit}
          subArcs={subArcs}
          max={MAX_VISIBILITY_METERS}
        />
      )}
    </DetailCard>
  )
}

const formatVisibility = (visibility: number, locale: string, unit: string): string => {
  if (visibility < 1000) return `${formatLocaleNumber(visibility, locale)} ${unit}`;
  return `${formatLocaleNumber(visibility / 1000, locale)} k${unit}`
}