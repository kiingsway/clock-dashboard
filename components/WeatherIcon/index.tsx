import type { JSX } from 'react'
import Image from 'next/image'
import styles from './WeatherIcon.module.scss'
import getWeatherIcon from '@/utils/weatherIcons/getWeatherIcon'
import { DateTime } from 'luxon'

interface Props {
  weatherCode: number
  size?: number
  isDay?: boolean
  date?: DateTime
  lat?: number
  lon?: number
}

export default function WeatherIcon({ weatherCode, date, isDay = true, lat, lon, size = 34 }: Props): JSX.Element {
  const weatherIcon = getWeatherIcon({ weatherCode, date, isDay, lat, lon })

  return (
    <div className={styles.icon}>
      <Image
        src={weatherIcon.current.src}
        alt={weatherIcon.current.alt}
        title={weatherIcon.current.alt}
        width={size}
        height={size}
      />
    </div>
  )
}

interface WeatherIconImageProps {
  src: string
  alt: string
  title: string
  size: number
}

export function WeatherIconImage({ src, alt, title, size = 34 }: WeatherIconImageProps): JSX.Element {

  return (
    <div className={styles.icon}>
      <Image
        src={src}
        alt={alt}
        title={title}
        width={size}
        height={size}
      />
    </div>
  )
}