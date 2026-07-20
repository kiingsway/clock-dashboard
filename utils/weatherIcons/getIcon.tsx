import type { ReactNode } from "react";
import Image from 'next/image'
import ICON_FILES, { ICON_BASE_URI } from "./iconFiles";

/**
 * Renders the fixed sunrise/sunset icon (not weather-code dependent, unlike
 * `getWeatherAnimatedIcon`).
 */
export default function getIcon(name: string, size: number): ReactNode {


  return (
    <Image
      src={`${ICON_BASE_URI}${name}.svg`}
      alt={`Icon Name: ${name}`}
      width={size}
      height={size}
    />
  );
}