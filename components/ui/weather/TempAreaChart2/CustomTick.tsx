import { CSSProperties } from "react";

interface CustomTickProps {
  x: string | number;
  y: string | number;
  accent: string
  label: string
  hasPrecip: boolean;
  isFirstItem: boolean;
  textAnchor?: 'start' | 'middle' | 'end';
}

/** Tamanho e peso da fonte do rótulo (também usados para medir a largura dele). */
export const getTickFont = (isFirstItem: boolean, hasPrecip: boolean) => ({
  fontWeight: isFirstItem && hasPrecip ? 700 : hasPrecip || isFirstItem ? 500 : 400,
  fontSize: isFirstItem ? 13 : hasPrecip ? 12 : 11,
});

/** Rótulo de hora do eixo X; o primeiro ("Agora") fica destacado com a cor do tempo atual */
export default function CustomTick({ x, y, accent, hasPrecip, isFirstItem, label, textAnchor = 'middle' }: CustomTickProps) {

  const style = {
    textAnchor,
    fill: isFirstItem ? 'var(--wc-accent)' : '#94a3b8',
    ...getTickFont(isFirstItem, hasPrecip),
    opacity: isFirstItem && hasPrecip ? 1 : hasPrecip ? 0.6 : isFirstItem ? 0.7 : 0.4,
  } as const;

  return (
    <g
      style={{ '--wc-accent': accent } as CSSProperties}
      transform={`translate(${x},${y})`}>
      <text x={0} y={0} dy={12} {...style}>
        {label}
      </text>
    </g>
  );
}
