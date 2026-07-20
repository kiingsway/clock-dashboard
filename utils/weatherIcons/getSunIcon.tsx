import type { ReactNode } from "react";
import Image from 'next/image'
import ICON_FILES, { ICON_BASE_URI } from "./iconFiles";

/**
 * Renders the fixed sunrise/sunset icon (not weather-code dependent, unlike
 * `getWeatherAnimatedIcon`).
 */
export default function getSunIcon(kind: "sunrise" | "sunset", size: number): ReactNode {

  return (
    <img
      src={`${ICON_BASE_URI}${ICON_FILES[kind]}.svg`}
      alt={kind}
      loading="lazy"
      style={{
        width: `${size / 16}em`,
        height: `${size / 16}em`,
        display: "block"
      }}
    />
  );
}