export interface IHSLColor {
  h: number; // Hue: 0 - 360
  s: number; // Saturation: 0 - 100%
  l: number; // Lightness: 0 - 100%
}

type SeasonKey = 'spring' | 'summer' | 'autumn' | 'winter';

// Palette de 2 cores por estação:
// Start: Cor inicial limpa | Peak: Cor intensa/característica do ápice
const SEASON_PALETTES: Record<SeasonKey, { start: IHSLColor; peak: IHSLColor }> = {
  spring: {
    start: { h: 100, s: 60, l: 65 }, // Verde broto / suave
    peak: { h: 140, s: 70, l: 45 }, // Verde pleno / vibrante
  },
  summer: {
    start: { h: 50, s: 90, l: 55 }, // Amarelo ensolarado
    peak: { h: 25, s: 95, l: 50 }, // Laranja quente de verão
  },
  autumn: {
    start: { h: 15, s: 80, l: 48 }, // Terracota / Castanho
    peak: { h: 350, s: 65, l: 42 }, // Vinho / Vermelho folha seca
  },
  winter: {
    start: { h: 200, s: 60, l: 60 }, // Azul gélido / Claro
    peak: { h: 220, s: 80, l: 40 }, // Azul profundo / Frio
  },
};

/**
 * Interpola suavemente duas cores HSL com base no progresso (0 a 1).
 */
function interpolateHSL(color1: IHSLColor, color2: IHSLColor, factor: number): string {
  // Trata a rotação do Hue pelo caminho mais curto no círculo cromático
  let deltaH = color2.h - color1.h;
  if (deltaH > 180) deltaH -= 360;
  if (deltaH < -180) deltaH += 360;

  const h = (color1.h + deltaH * factor + 360) % 360;
  const s = color1.s + (color2.s - color1.s) * factor;
  const l = color1.l + (color2.l - color1.l) * factor;

  return `hsl(${Math.round(h)}, ${Math.round(s)}%, ${Math.round(l)}%)`;
}

const NEXT_SEASON: Record<SeasonKey, SeasonKey> = {
  spring: 'summer',
  summer: 'autumn',
  autumn: 'winter',
  winter: 'spring',
};

/**
 * Retorna a cor exata da estação no momento atual.
 * 
 * @param currentSeason Estação atual ('spring' | 'summer' | 'autumn' | 'winter')
 * @param daysSinceStart Dias decorridos na estação
 * @param totalSeasonDays Total de dias da estação
 */
export default function getSeasonDynamicColor(
  currentSeason: SeasonKey,
  daysSinceStart: number,
  totalSeasonDays: number
): string {
  const progress = Math.min(Math.max(daysSinceStart / totalSeasonDays, 0), 1);

  const currentPalette = SEASON_PALETTES[currentSeason];
  const nextSeasonKey = NEXT_SEASON[currentSeason];
  const nextStartColor = SEASON_PALETTES[nextSeasonKey].start;

  // Fase 1: Do início da estação até o ápice (0% a 50%)
  if (progress <= 0.5) {
    const factor = progress / 0.5; // Normaliza de 0.0 a 1.0
    return interpolateHSL(currentPalette.start, currentPalette.peak, factor);
  }

  // Fase 2: Do ápice em direção à próxima estação (50% a 100%)
  const factor = (progress - 0.5) / 0.5; // Normaliza de 0.0 a 1.0
  return interpolateHSL(currentPalette.peak, nextStartColor, factor);
}