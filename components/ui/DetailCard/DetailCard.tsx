import type { PropsWithChildren, ReactNode } from "react";
import styles from "./DetailCard.module.css";
import WeatherIcon, { WeatherIconProps } from "../weather/WeatherIcon";

export interface DetailCardProps {
  /** Small caption, top-left (e.g. "UV INDEX", "HUMIDITY"). */
  title?: ReactNode;
  /** Centered icon. Takes priority over `bigText` if both are given. */
  icon?: ReactNode;
  /** Centered large text/number, used when there's no `icon` (e.g. "72%", "12 km/h"). */
  bigText?: ReactNode;
  /** Small text at the bottom (e.g. "Low for the rest of the day"). */
  description?: ReactNode;
  className?: string;
  textColor?: string;
  onClick?: () => void;
  onDoubleClick?: () => void;
  iconProps?: WeatherIconProps;
  iconsProps?: WeatherIconProps[];
}

/**
 * Generic square tile for secondary metrics — UV index, humidity, wind,
 * pressure, whatever. Not tied to weather data itself; it just lays out
 * title / center content / description and leaves the numbers to whoever
 * uses it. Meant to sit in a 2-column grid (see README), each cell keeping
 * a 1:1 aspect ratio like the iOS Weather app's detail cards.
 *
 * Every slot is optional — an empty `<DetailCard />` still renders a valid,
 * un-broken square (just visually blank), so a card with missing data
 * never collapses the grid or throws.
 */
export function DetailCard({ title, icon, iconProps, iconsProps, bigText, textColor, description, className, children, onClick, onDoubleClick }: PropsWithChildren<DetailCardProps>) {

  const iconElement = (() => {
    if (iconsProps?.length) {
      const size = 120 / Math.sqrt(iconsProps.length);
      return <>{iconsProps.map((p, i) => <WeatherIcon key={i} size={size} {...p} />)}</>;
    }
    
    if (iconProps) return <WeatherIcon size={120} {...iconProps} />
    return null;
  })();

  const center = iconElement ?? icon ?? bigText;

  return (
    <div className={[styles.card, className].filter(Boolean).join(" ")} onClick={onClick} onDoubleClick={onDoubleClick}>
      {title && <span className={styles.title}>{title}</span>}
      {children || (
        <div className={styles.center} style={{ color: textColor }}>{center}</div>
      )}
      {description && <div className={styles.description}>{description}</div>}
    </div>
  );
}