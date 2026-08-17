import MiniCard from '@/components/ui/MiniCard'
import WeatherIcon from '../WeatherIcon';
import getRainSummary from '@/utils/weather/getRainSummary';
import { useTranslation } from 'react-i18next';

interface Props {
  precipMM: number;
  chance: number;
  hoursOfRain: number;
  size?: number; // Tamanho do ícone
}

export default function RainWidget({ precipMM, chance, hoursOfRain, size = 120 }: Props) {
  const { t } = useTranslation();
  const { description, iconName } = getRainSummary(t, { chanceMax: chance, precipitationMm: precipMM, hoursOfRain });

  return (
    <MiniCard
      title={t('precipitationTexts.precipInHours', { precip: precipMM, chance })}
      desc={description}
      icon={<WeatherIcon iconName={iconName} size={size} />}
    />
  )
}
