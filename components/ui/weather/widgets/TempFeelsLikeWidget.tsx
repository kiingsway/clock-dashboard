import MiniCard from '@/components/ui/MiniCard'
import WeatherIcon from '../WeatherIcon';
import { getFeelsLikeRecommendation } from '@/utils/weather/getFeelsLikeDifference';

interface Props {
  tempMean?: number;
  tempMin: number;
  tempMax: number;
  feelsLike: number;
  size?: number; // Tamanho do ícone
}

export default function TempFeelsLikeWidget({ tempMin, tempMax, tempMean = (tempMin + tempMax) / 2, feelsLike, size = 120 }: Props) {

  const isFeelsWarmer = feelsLike > tempMean;
  const iconName = isFeelsWarmer ? "thermometer-mercury" : "thermometer-mercury-cold";
  const desc = getFeelsLikeRecommendation(tempMean, feelsLike);

  return (
    <MiniCard
      title={`${tempMax.toFixed(1)}°C - ${tempMin.toFixed(1)}°C`}
      desc={`Feels like: ${feelsLike.toFixed(1)}°C | ${desc}`}
      icon={<WeatherIcon iconName={iconName} size={size} />}
    />
  )
}
