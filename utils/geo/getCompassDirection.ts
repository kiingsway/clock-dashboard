export type CompassDirection = 'N' | 'NE' | 'E' | 'SE' | 'S' | 'SW' | 'W' | 'NW';

export interface CompassInfo {
  abbreviation: CompassDirection;
  name: string;
}

export const compassMap: Record<CompassDirection, CompassInfo> = {
  N:  { abbreviation: 'N',  name: 'North' },
  NE: { abbreviation: 'NE', name: 'Northeast' },
  E:  { abbreviation: 'E',  name: 'East' },
  SE: { abbreviation: 'SE', name: 'Southeast' },
  S:  { abbreviation: 'S',  name: 'South' },
  SW: { abbreviation: 'SW', name: 'Southwest' },
  W:  { abbreviation: 'W',  name: 'West' },
  NW: { abbreviation: 'NW', name: 'Northwest' }
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