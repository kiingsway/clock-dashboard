import { JSX } from "react";
import Image from 'next/image';
import styles from './WeatherIcon.module.scss';
import getWeatherIcon from "@/utils/weather/getWeatherIcon";
import { WeatherCategoryName } from "@/types/weather.types";
import getWeatherIconName from "@/utils/weather/getWeatherIconName";
import { capitalizeWords, splitCamelCase } from "@/utils/formatters/textFormatters";
import AnimatedWeatherIcon from "./WeatherIconAnimated";
import classNames from "classnames";
import { useAppSettings } from "@/contexts/AppSettingsContext";
import { useNow } from "@/contexts/NowContext";
import { useTranslation } from "react-i18next";
import { Tooltip } from "../../Tooltip";
import { createIconUrl } from "@/constants/iconFiles";

interface Props {
  size?: number;
  className?: string;
  hideGlow?: boolean;
}

interface WeatherSrcAltProps extends Props {
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

interface WeatherIconNameProps extends Props {
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

interface WeatherCategoryProps extends Props {
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

interface WeatherCodeProps extends Props {
  weatherCode: number
  isDay?: boolean
  lat?: number
  lon?: number
  title?: string;

  category?: never
  iconName?: never
  src?: never;
  alt?: never;
  duration?: never;
}

export type WeatherIconProps = WeatherCodeProps | WeatherCategoryProps | WeatherIconNameProps | WeatherSrcAltProps

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
  className,
  isDay = true,
  size = 34,
  hideGlow = false,
}: WeatherIconProps): JSX.Element {
  const { now } = useNow();
  const { get: { location: timezone } } = useAppSettings();
  const { t } = useTranslation();

  if (duration) return <AnimatedWeatherIcon src={src} alt={alt} title={title} size={size} duration={duration} />;

  const weatherIcon = (() => {
    if (src) return { src, alt, title };

    if (iconName) {
      const src = createIconUrl(iconName);
      const alt = capitalizeWords(iconName.split('-').join(' '));
      return { src, alt, title };
    }

    if (typeof weatherCode === 'number') {
      const { current: { src, alt } } = getWeatherIcon({ weatherCode, isDay, lat, lon, timezone, now, t });
      return { src, alt, title };
    }

    if (category) {
      const { name, title } = (() => {
        if (typeof category === 'string') return {
          name: category,
          title: splitCamelCase(category)
        };
        else return {
          name: category.name,
          title: category.title || splitCamelCase(category.name)
        };
      })();

      const src = createIconUrl(getWeatherIconName({ name, title }, isDay));
      return { src, alt: title, title };
    }
  })();

  if (!weatherIcon) return <></>;

  const content = (
    <div
      className={classNames(styles.icon, { [styles.noBefore]: hideGlow }, className)}
      title={weatherIcon?.title}
      style={{ '--half-size': `${size / 2}px` } as React.CSSProperties}
    >
      <Image
        src={weatherIcon.src}
        alt={weatherIcon.alt}
        width={size}
        height={size}
      />
    </div>
  );

  if (!title && !weatherIcon.title) return content;

  return (
    <Tooltip content={title || weatherIcon.title}>
      {content}
    </Tooltip>
  );
}