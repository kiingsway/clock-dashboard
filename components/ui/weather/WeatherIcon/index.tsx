import { JSX } from "react";
import Image from 'next/image';
import styles from './WeatherIcon.module.scss';
import getWeatherIcon from "@/utils/weather/getWeatherIcon";
import { WeatherCategoryName } from "@/types/weather.types";
import { getWeatherIconUrl } from "@/utils/weather/getWeatherIconName";
import AnimatedWeatherIcon from "./WeatherIconAnimated";
import { capitalizeWords, splitCamelCase } from "@/utils/formatters/textFormatters";
import { useAppSettings } from "@/contexts/AppSettingsContext";
import { useNow } from "@/contexts/NowContext";

interface WeatherSrcAltProps {
  src: string;
  alt: string;
  title?: string;
  duration?: number

  weatherCode?: never
  isDay?: never
  lat?: never
  lon?: never
  category?: never
  iconName?: never
}

interface WeatherIconNameProps {
  iconName: string

  weatherCode?: never
  isDay?: never
  lat?: never
  lon?: never
  category?: never
  src?: never;
  alt?: never;
  title?: never;
  duration?: never;
}

interface WeatherCategoryProps {
  category: WeatherCategoryName | { name: WeatherCategoryName, title?: string }

  weatherCode?: never
  isDay?: never
  lat?: never
  lon?: never
  iconName?: never
  src?: never;
  alt?: never;
  title?: never;
  duration?: never;
}

interface WeatherCodeProps {
  weatherCode: number
  isDay?: boolean
  lat?: number
  lon?: number

  category?: never
  iconName?: never
  src?: never;
  alt?: never;
  title?: never;
  duration?: never;
}

interface Props {
  size?: number;
}

export type WeatherIconProps = Props & (WeatherCodeProps | WeatherCategoryProps | WeatherIconNameProps | WeatherSrcAltProps)

export default function WeatherIcon({
  category,
  weatherCode,
  lat,
  lon,
  iconName,
  alt,
  src,
  title,
  duration,
  isDay = true,
  size = 34
}: WeatherIconProps): JSX.Element {
  const { now } = useNow()
  const { get: { location: timezone } } = useAppSettings();

  if (duration) return <AnimatedWeatherIcon src={src} alt={alt} title={title} size={size} duration={duration} />

  const weatherIcon = (() => {
    if (src) return { src, alt, title }

    if (iconName) {
      const src = getWeatherIconUrl({ iconName });
      const alt = capitalizeWords(iconName.split('-').join(' '))
      return { src, alt }
    }

    if (typeof weatherCode === 'number') {
      const { current: { src, alt } } = getWeatherIcon({ weatherCode, isDay, lat, lon, timezone, now })
      return { src, alt, title: alt }
    }

    if (category) {
      const { name, title } = (() => {
        if (typeof category === 'string') return {
          name: category,
          title: splitCamelCase(category)
        }
        else return {
          name: category.name,
          title: category.title || splitCamelCase(category.name)
        }
      })();

      const src = getWeatherIconUrl({ category: { name, title }, isDay })
      return { src, alt: title, title }
    }
  })()

  if (!weatherIcon) return <></>

  return (
    <div
      className={styles.icon}
      title={weatherIcon?.title}
      style={{ '--size': `${size / 2}px` } as React.CSSProperties}>
      <Image
        src={weatherIcon.src}
        alt={weatherIcon.alt}
        width={size}
        height={size}
      />
    </div>
  )
}