import { createIconUrl } from "@/constants/iconFiles";
import { TFunction } from "i18next";

type CompassDirection = 'N' | 'NE' | 'E' | 'SE' | 'S' | 'SW' | 'W' | 'NW';

interface CompassInfo {
  abbreviation: CompassDirection;
  name: string;
  title: string;
}

interface CompassFullInfo extends CompassInfo {
  title: string;
  iconSrc: string;
}

const compassMap: Record<CompassDirection, Omit<CompassInfo, 'title'>> = {
  N: { abbreviation: 'N', name: 'north' },
  NE: { abbreviation: 'NE', name: 'northeast' },
  E: { abbreviation: 'E', name: 'east' },
  SE: { abbreviation: 'SE', name: 'southeast' },
  S: { abbreviation: 'S', name: 'south' },
  SW: { abbreviation: 'SW', name: 'southwest' },
  W: { abbreviation: 'W', name: 'west' },
  NW: { abbreviation: 'NW', name: 'northwest' }
};

/**
 * Converte graus (0-360) para as informações completas da bússola.
 * @param degrees Ângulo em graus
 */
export function getCompassDirection(degrees: number, t: TFunction): CompassFullInfo {
  const normalizedDegrees = ((degrees % 360) + 360) % 360;

  const keys: CompassDirection[] = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.floor(((normalizedDegrees + 22.5) % 360) / 45);

  const compassItem = compassMap[keys[index]];
  const title = t(`compass.${compassItem.name.toLowerCase()}`);

  const iconSrc = createIconUrl(`wind-direction-${compassItem.abbreviation.toLowerCase()}`);

  return { ...compassItem, title, iconSrc };
}