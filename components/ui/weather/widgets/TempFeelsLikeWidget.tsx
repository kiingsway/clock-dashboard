import MiniCard from '@/components/ui/MiniCard'
import WeatherIcon from '../WeatherIcon';
import { getFeelsLikeRecommendation } from '@/utils/weather/getFeelsLikeDifference';

interface Props {
  tempMean: number;
  feelsLike: number;
  size?: number; // Tamanho do ícone
}

export default function TempFeelsLikeWidget({ tempMean, feelsLike, size = 120 }: Props) {

  const isFeelsWarmer = feelsLike > tempMean;
  const iconName = isFeelsWarmer ? "thermometer-mercury" : "thermometer-mercury-cold";
  const desc = getFeelsLikeRecommendation(tempMean, feelsLike);

  return (
    <MiniCard
      title={`Feels like: ${feelsLike.toFixed(1)}°C`}
      desc={desc}
      icon={<WeatherIcon iconName={iconName} size={size} />}
    />
  )
}
