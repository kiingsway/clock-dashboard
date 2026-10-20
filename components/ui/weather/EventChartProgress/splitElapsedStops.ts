import { GradientStop } from "./types";

const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value));

/** Variante mais escura de qualquer cor CSS (inclusive `var(--x)`). */
export const darken = (color: string, amount: number): string =>
  `color-mix(in srgb, ${color} ${Math.round((1 - clamp(amount, 0, 1)) * 100)}%, black)`;

/** Cor interpolada do gradiente em `offset` (0..1). */
const colorAt = (stops: GradientStop[], offset: number): string => {
  const next = stops.findIndex(s => s.offset >= offset);
  if (next === -1) return stops[stops.length - 1].color;
  if (next === 0) return stops[0].color;

  const a = stops[next - 1];
  const b = stops[next];
  const ratio = b.offset === a.offset ? 1 : (offset - a.offset) / (b.offset - a.offset);
  return `color-mix(in srgb, ${b.color} ${Math.round(ratio * 100)}%, ${a.color})`;
};

/**
 * Escurece o trecho do gradiente antes de `splitOffset` (o tempo já decorrido),
 * com um corte seco no ponto do "agora".
 */
export default function splitElapsedStops(stops: GradientStop[], splitOffset: number, amount: number): GradientStop[] {
  if (!stops.length) return stops;

  const offset = clamp(splitOffset, 0, 1);
  const splitColor = colorAt(stops, offset);

  return [
    ...stops.filter(s => s.offset < offset).map(s => ({ ...s, color: darken(s.color, amount) })),
    { offset, color: darken(splitColor, amount) },
    { offset, color: splitColor },
    ...stops.filter(s => s.offset > offset),
  ];
}
