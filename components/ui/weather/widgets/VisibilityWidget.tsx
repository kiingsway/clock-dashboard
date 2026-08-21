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
  kind: 'now' | 'day';
  miniCard?: boolean;
}

export default function VisibilityWidget({ date, weather, size = 60, kind, miniCard }: Props) {
  const { t, i18n: { language: locale } } = useTranslation();
  const [gaugeShowing, { toggle: toggleGauge }] = useBoolean();

  const { daily, daily_units, hourly, hourly_units } = weather

  const time = kind === 'now' ? hourly.time : daily.time;
  const nowIndex = getCurrentIndex({ date, time });
  const visibArr = kind === 'now' ? hourly.visibility : daily.visibility_mean;
  const visibility = visibArr[nowIndex];

  const isDay = kind === 'day' || hourly.is_day;
  const unit = kind === 'now' ? hourly_units.visibility : daily_units.visibility_mean;

  if (typeof visibility !== 'number') return null;

  const v = {
    text: formatVisibility(visibility, unit, locale),
    desc: getVisibilityDescription(visibility, t),
    color: getVisibilityColor(visibility),
  }

  const icon = (() => {
    if (visibility <= 2000) return `cloud-down`;
    if (visibility <= 5000) return `fog-${isDay ? 'day' : 'night'}`;
    return 'rainbow-clear';
  })();

  const onDebugClick = () => console.info('Visibility:', visibility);

  if (miniCard) return (
    <MiniCard
      title={`${t('visibility')}: ${v.text}`}
      desc={v.desc}
      onDoubleClick={onDebugClick}
      iconSize={size}
      icon={<WeatherIcon iconName={icon} size={size} />}
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

const formatVisibility = (visibility: number, unit: string, locale: string,): string => {
  if (visibility < 1000) return `${formatLocaleNumber(visibility, locale)} ${unit}`;
  return `${formatLocaleNumber(visibility / 1000, locale)} k${unit}`
}