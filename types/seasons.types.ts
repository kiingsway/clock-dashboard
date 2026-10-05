import { RGB } from "./colors.types";

export type SeasonName = 'winter' | 'spring' | 'summer' | 'autumn';
export type Hemisphere = 'north' | 'south';

export interface SeasonDef {
  name: SeasonName;
  color: RGB;
  month: number; // 1-12, data (aproximada) em que essa estação começa
  day: number;
}