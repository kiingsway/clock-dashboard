import { IReferenceZone } from "@/types/chart.types";
import { RGB } from "@/types/colors.types";
import { Hemisphere, SeasonDef, SeasonName } from "@/types/seasons.types";
import { DateTime } from "luxon";

// Cor de cada estação. Ajuste como quiser.
const SEASON_COLORS: Record<SeasonName, RGB> = {
  winter: [79, 143, 196], // azul pálido
  spring: [172, 220, 145], // verde
  summer: [243, 205, 98], // dourado
  autumn: [232, 111, 114], // laranja
};

// Datas de virada astronômicas aproximadas (equinócios/solstícios), em
// ordem cronológica dentro do ano civil.
const TURNING_POINTS: { month: number; day: number }[] = [
  { month: 3, day: 20 }, // equinócio de março
  { month: 6, day: 21 }, // solstício de junho
  { month: 9, day: 22 }, // equinócio de setembro
  { month: 12, day: 21 }, // solstício de dezembro
];

// No hemisfério norte, essas viradas marcam o início de: primavera, verão,
// outono, inverno, nessa ordem. No hemisfério sul é o oposto (6 meses
// deslocado): outono, inverno, primavera, verão.
const SEASON_ORDER: Record<Hemisphere, SeasonName[]> = {
  north: ['spring', 'summer', 'autumn', 'winter'],
  south: ['autumn', 'winter', 'spring', 'summer'],
};

/**
 * Retorna uma cor (hex) baseada na data informada, de acordo com a estação
 * do ano. Funciona para hemisfério norte ou sul (parâmetro `isNorth`).
 *
 * A maior parte dos dias de uma estação ficam com a cor "sólida" daquela
 * estação. Perto da troca de estação (transitionDays antes e depois da
 * data de virada), a cor faz uma transição (interpolação linear em RGB)
 * entre a cor da estação atual e a da próxima.
 */
export function getSeasonZones(date: DateTime, isNorth: boolean, locale: string): IReferenceZone[] {

  const { north, south } = SEASON_ORDER;
  const seasons = isNorth ? north : south;

  const firstColor = rgbToHex(SEASON_COLORS[seasons[seasons.length - 1]]);

  return [
    { value: 0, color: firstColor },
    ...seasons.map((season, index) => {
      const color = rgbToHex(SEASON_COLORS[season]);
      const dateObj = { year: date.year, ...TURNING_POINTS[index] };
      const d = DateTime.fromObject(dateObj, { locale });
      const value = d.ordinal;

      // const label = new Intl.DateTimeFormat(locale, {
      //   day: 'numeric',
      //   month: 'short', // ou 'long' para mês por extenso
      // }).format(d.toJSDate());

      const label = d.toFormat('dd/LLL');

      return { value, color, label };
    })
  ];
}

function buildSeasonDefs(hemisphere: Hemisphere): SeasonDef[] {
  const order = SEASON_ORDER[hemisphere];
  return TURNING_POINTS.map((tp, i) => ({
    ...tp,
    name: order[i],
    color: SEASON_COLORS[order[i]],
  }));
}

const MS_PER_DAY = 24 * 60 * 60 * 1000;

interface Boundary {
  date: Date;
  season: SeasonDef;
}

function buildBoundaries(year: number, hemisphere: Hemisphere): Boundary[] {
  const seasons = buildSeasonDefs(hemisphere);
  const years = [year - 1, year, year + 1];
  return years
    .flatMap((y) =>
      seasons.map((s) => ({
        date: new Date(y, s.month - 1, s.day),
        season: s,
      }))
    )
    .sort((a, b) => a.date.getTime() - b.date.getTime());
}

function rgbToHex([r, g, b]: RGB): string {
  const clamp = (v: number) => Math.min(255, Math.max(0, Math.round(v)));
  return (
    '#' +
    [clamp(r), clamp(g), clamp(b)]
      .map((v) => v.toString(16).padStart(2, '0'))
      .join('')
  );
}

function lerpColor(a: RGB, b: RGB, t: number): string {
  return rgbToHex([
    a[0] + (b[0] - a[0]) * t,
    a[1] + (b[1] - a[1]) * t,
    a[2] + (b[2] - a[2]) * t,
  ]);
}

/**
 * @param date data para a qual calcular a cor
 * @param options.hemisphere 'north' (padrão) ou 'south' — inverte quais
 *   estações correspondem a cada data de virada
 * @param options.transitionDays quantos dias antes/depois de cada virada a
 *   transição dura (padrão 10)
 */
export function getSeasonColor(date: Date, lat: number): string {
  const hemisphere: Hemisphere = lat > 0 ? 'north' : 'south';

  const boundaries = buildBoundaries(date.getFullYear(), hemisphere);
  const target = date.getTime();
  const transitionMs = 10 * MS_PER_DAY;

  // Acha a virada de estação mais próxima da data
  let nearestIdx = -1;
  let nearestDiff = Infinity;
  boundaries.forEach((b, i) => {
    const diff = Math.abs(b.date.getTime() - target);
    if (diff < nearestDiff) {
      nearestDiff = diff;
      nearestIdx = i;
    }
  });

  // Se a data está dentro da janela de transição de uma virada, interpola
  if (nearestIdx > 0 && nearestDiff <= transitionMs) {
    const boundary = boundaries[nearestIdx];
    const prevSeason = boundaries[nearestIdx - 1].season;
    const nextSeason = boundary.season;

    const windowStart = boundary.date.getTime() - transitionMs;
    const t = (target - windowStart) / (2 * transitionMs);
    const clampedT = Math.min(1, Math.max(0, t));

    return lerpColor(prevSeason.color, nextSeason.color, clampedT);
  }

  // Caso contrário, está "dentro" de uma estação: acha a última virada <= data
  let currentSeason = boundaries[0].season;
  for (const b of boundaries) {
    if (b.date.getTime() <= target) {
      currentSeason = b.season;
    } else {
      break;
    }
  }

  return rgbToHex(currentSeason.color);
}