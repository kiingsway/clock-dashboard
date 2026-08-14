export type CompassDirection = 'N' | 'NE' | 'E' | 'SE' | 'S' | 'SW' | 'W' | 'NW';

export interface CompassInfo {
  abbreviation: CompassDirection;
  name: string;
}

export const compassMap: Record<CompassDirection, CompassInfo> = {
  N:  { abbreviation: 'N',  name: 'north' },
  NE: { abbreviation: 'NE', name: 'northeast' },
  E:  { abbreviation: 'E',  name: 'east' },
  SE: { abbreviation: 'SE', name: 'southeast' },
  S:  { abbreviation: 'S',  name: 'south' },
  SW: { abbreviation: 'SW', name: 'southwest' },
  W:  { abbreviation: 'W',  name: 'west' },
  NW: { abbreviation: 'NW', name: 'northwest' }
};

/**
 * Converte graus (0-360) para as informações completas da bússola.
 * @param degrees Ângulo em graus
 */
export function getCompassDirection(degrees: number): CompassInfo {
  const normalizedDegrees = ((degrees % 360) + 360) % 360;
  
  const keys: CompassDirection[] = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.floor(((normalizedDegrees + 22.5) % 360) / 45);
  
  return compassMap[keys[index]];
}