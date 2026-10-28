/*
 * Gráficos que encostam nas bordas da tela: o rótulo "Agora" fica alinhado à
 * esquerda a partir da borda (qualquer tamanho, em qualquer idioma) e os horários
 * que caem em cima dele, ou passam da borda direita, são escondidos.
 */

/** Distância mínima dos textos até a borda. */
export const EDGE_INSET = 4;
/** Espaço mínimo entre o "Agora" e o próximo horário. */
export const TICK_GAP = 6;

export const clamp = (value: number, min: number, max: number): number =>
  max < min ? value : Math.min(max, Math.max(min, value));

let context: CanvasRenderingContext2D | null | undefined;

/** `var(--x)` -> valor da variável CSS; sem família, a fonte do body. */
const resolveFontFamily = (fontFamily: string | undefined): string => {
  const cssVar = fontFamily?.match(/^var\((--[\w-]+)\)$/)?.[1];
  if (cssVar) return getComputedStyle(document.documentElement).getPropertyValue(cssVar).trim() || 'sans-serif';
  return fontFamily || getComputedStyle(document.body).fontFamily || 'sans-serif';
};

/** Largura aproximada (px) de `text` renderizado com o tamanho/peso/família dados (padrão: fonte do body). */
export function measureText(text: string, fontSize: number, fontWeight: number = 400, fontFamily?: string): number {
  if (typeof document === 'undefined') return text.length * fontSize * 0.6;

  context ??= document.createElement('canvas').getContext('2d');
  if (!context) return text.length * fontSize * 0.6;

  context.font = `${fontWeight} ${fontSize}px ${resolveFontFamily(fontFamily)}`;

  return context.measureText(text).width;
}

interface Font {
  fontSize: number;
  fontWeight: number;
  /** Família ou `var(--x)`; sem ela, a fonte do body. */
  fontFamily?: string;
}

/** Onde termina (px) o rótulo "Agora" alinhado à esquerda, começando em `startX + EDGE_INSET`. */
export const getNowLabelEnd = (label: string, { fontSize, fontWeight, fontFamily }: Font, startX = 0): number =>
  startX + EDGE_INSET + measureText(label, fontSize, fontWeight, fontFamily);

/**
 * Se um horário centralizado em `x` cabe entre o fim do "Agora" e a borda direita.
 * `chartWidth` 0 (ainda não medido) não limita a direita.
 */
export function tickFits(x: number, label: string, { fontSize, fontWeight, fontFamily }: Font, nowLabelEnd: number, chartWidth: number): boolean {
  const half = measureText(label, fontSize, fontWeight, fontFamily) / 2;
  if (x - half < nowLabelEnd + TICK_GAP) return false;
  return !chartWidth || x + half <= chartWidth - EDGE_INSET;
}

/** Posição x de um texto centralizado, sem passar das bordas. */
export function clampLabelX(x: number, text: string, { fontSize, fontWeight, fontFamily }: Partial<Font> & Pick<Font, 'fontSize'>, chartWidth: number): number {
  if (!chartWidth) return x;
  const half = measureText(text, fontSize, fontWeight, fontFamily) / 2;
  return clamp(x, half + EDGE_INSET, chartWidth - half - EDGE_INSET);
}

/** Centro x de um ícone de `size` px, sem passar das bordas. */
export const clampIconX = (cx: number | undefined, size: number, chartWidth: number): number | undefined =>
  cx === undefined || !chartWidth ? cx : clamp(cx, size / 2, chartWidth - size / 2);
