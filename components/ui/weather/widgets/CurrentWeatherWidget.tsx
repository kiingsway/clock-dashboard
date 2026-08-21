import MiniCard from '@/components/ui/MiniCard'
import WeatherIcon from '../WeatherIcon';
import getWeatherCategory from '@/utils/weather/getWeatherCategory';
import { useTranslation } from 'react-i18next';

interface Props {
  weatherCode: number
  tempMin: number;
  tempMax: number;
  size?: number; // Tamanho do ícone
}

export default function CurrentWeatherWidget({ weatherCode, tempMax, tempMin, size }: Props) {
  const { t } = useTranslation();

  const category = getWeatherCategory(weatherCode, t);

  return (
    <MiniCard
      title={`${category.title}`}
      desc={`${t('maxMin')}: ${Math.round(tempMax)}ºC / ${Math.round(tempMin)}ºC`}
      icon={<WeatherIcon category={category.name} size={size} />}
    />
  )
}
