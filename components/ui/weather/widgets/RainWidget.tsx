import MiniCard from '@/components/ui/MiniCard'
import WeatherIcon from '../WeatherIcon';
import { getRainSummary } from '@/utils/weather/getRainSummary';

interface Props {
  precipMM: number;
  chance: number;
  hoursOfRain: number;
  size?: number; // Tamanho do ícone
}

export default function RainWidget({ precipMM, chance, hoursOfRain, size = 120 }: Props) {

  const { description, iconName } = getRainSummary({ chanceMax: chance, precipitationMm: precipMM, hoursOfRain });

  return (
    <MiniCard
      title={`${precipMM}mm - ${chance}% chance`}
      desc={description}
      icon={<WeatherIcon iconName={iconName} size={size} />}
    />
  )
}
