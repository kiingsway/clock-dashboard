import MiniCard from '@/components/ui/MiniCard'
import WeatherIcon from '../WeatherIcon';
import { getFeelsLikeRecommendation } from '@/utils/weather/getFeelsLikeDifference';
import { useTranslation } from 'react-i18next';

interface Props {
  tempMean: number;
  feelsLike: number;
  size?: number; // Tamanho do ícone
}

export default function TempFeelsLikeWidget({ tempMean, feelsLike, size = 120 }: Props) {
  const { t } = useTranslation();
  const isFeelsWarmer = feelsLike > tempMean;
  const iconName = isFeelsWarmer ? "thermometer-mercury" : "thermometer-mercury-cold";
  const desc = getFeelsLikeRecommendation(tempMean, feelsLike, t);

  return (
    <MiniCard
      title={`${t('feelsLike')}: ${feelsLike.toFixed(1)}°C`}
      desc={desc + ` (${tempMean}ºC)`}
      icon={<WeatherIcon iconName={iconName} size={size} />}
    />
  )
}
