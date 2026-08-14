import type { JSX } from 'react'
import styles from './WeatherWidgets.module.scss'
import MoonWidget from '@/components/ui/weather/widgets/MoonWidget'
import UVIndexWidget from '@/components/ui/weather/widgets/UVIndex'
import WindWidget from '@/components/ui/weather/widgets/WindWidget'
import { useNow } from '@/contexts/NowContext'
import VisibilityWidget from '@/components/ui/weather/widgets/VisibilityWidget'
import { IWeather } from '@/types/weather.types'

interface Props {
  weather: IWeather | undefined
}

export default function WeatherWidgets({ weather }: Props): JSX.Element {
  const { now } = useNow();

  if (!weather) return <></>;

  return (
    <div className={styles.main}>
      <MoonWidget date={now} weather={weather} />
      <UVIndexWidget date={now} weather={weather} kind='now' />
      <WindWidget date={now} weather={weather} />
      <VisibilityWidget date={now} weather={weather} />
    </div>
  );
}
