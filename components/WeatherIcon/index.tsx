import { DateTime } from "luxon";
import { JSX } from "react";
import Image from 'next/image';
import styles from './WeatherIcon.module.scss';
import { WeatherCategoryName } from "@/types/weather.types";
import { capitalizeWords, splitCamelCase } from "@/utils/formatters";
import getWeatherIcon from "@/utils/weatherIcons/getWeatherIcon";
import AnimatedWeatherIcon from "../AnimatedWeatherIcon";
import { getWeatherIconUrl } from "@/utils/weatherIcons/getWeatherIconName";

interface Props {
  size?: number;
}

interface WeatherSrcAltProps extends Props {
  src: string;
  alt: string;
  title?: string;
  duration?: number

  weatherCode?: never
  isDay?: never
  date?: never
  lat?: never
  lon?: never
  category?: never
  iconName?: never
}

interface WeatherIconNameProps extends Props {
  iconName: string

  weatherCode?: never
  isDay?: never
  date?: never
  lat?: never
  lon?: never
  category?: never
  src?: never;
  alt?: never;
  title?: never;
  duration?: never;
}

interface WeatherCategoryProps extends Props {
  category: WeatherCategoryName | { name: WeatherCategoryName, title?: string }

  weatherCode?: never
  isDay?: never
  date?: never
  lat?: never
  lon?: never
  iconName?: never
  src?: never;
  alt?: never;
  title?: never;
  duration?: never;
}

interface WeatherCodeProps extends Props {
  weatherCode: number
  isDay?: boolean
  date?: DateTime
  lat?: number
  lon?: number

  category?: never
  iconName?: never
  src?: never;
  alt?: never;
  title?: never;
  duration?: never;
}

type WeatherIconProps = WeatherCodeProps | WeatherCategoryProps | WeatherIconNameProps | WeatherSrcAltProps

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
  date = DateTime.now(),
  isDay = true,
  size = 34
}: WeatherIconProps): JSX.Element {

  if (duration) return <AnimatedWeatherIcon src={src} alt={alt} title={title} size={size} duration={duration} />

  const weatherIcon = (() => {
    if (src) return { src, alt, title }

    if (iconName) {
      const src = getWeatherIconUrl({ iconName });
      const alt = capitalizeWords(iconName.split('-').join(' '))
      return { src, alt }
    }

    if (typeof weatherCode === 'number') {
      const { current: { src, alt } } = getWeatherIcon({ weatherCode, date, isDay, lat, lon })
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
    <div className={styles.icon} title={weatherIcon?.title}>
      <Image
        src={weatherIcon.src}
        alt={weatherIcon.alt}
        width={size}
        height={size}
      />
    </div>
  )
}