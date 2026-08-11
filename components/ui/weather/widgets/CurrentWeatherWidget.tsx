import MiniCard from '@/components/ui/MiniCard'
import WeatherIcon from '../WeatherIcon';
import getWeatherCategory from '@/utils/weather/getWeatherCategory';

interface Props {
  weatherCode: number
  tempMin: number;
  tempMax: number;
  size?: number; // Tamanho do ícone
}

export default function CurrentWeatherWidget({ weatherCode, tempMax, tempMin, size }: Props) {

  const category = getWeatherCategory(weatherCode);

  return (
    <MiniCard
      title={`${category.title}`}
      desc={`Max: ${tempMax}ºC | Min: ${tempMin}ºC`}
      icon={<WeatherIcon category={category.name} size={size} />
      }
    />
  )
}
