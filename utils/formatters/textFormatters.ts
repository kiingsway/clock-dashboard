export function splitCamelCase(text: string): string {
  if (!text) return '';

  const result = text.replace(/([A-Z])/g, ' $1').trim();

  return result.charAt(0).toUpperCase() + result.slice(1);
}

// Função auxiliar para converter HEX para RGB
export function hexToRgb(hex: string) {
  const bigint = parseInt(hex.replace('#', ''), 16);
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255
  };
}

// Função auxiliar para interpolar dois valores com base em uma porcentagem (0 a 1)
export const lerp = (start: number, end: number, t: number) => Math.round(start + (end - start) * t);

export function capitalizeWords(text: string): string {
  return text
    .toLowerCase()
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function formatLocaleNumber(n: number, locale: string) {
  return new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(n);
}

export const formatMetricValue = (value: number, locale: string, unit: string): string => {
  const isKilo = value >= 1000;
  const scaledValue = value / (isKilo ? 1000 : 1);
  const unitPrefix = isKilo ? 'k' : '';

  return `${formatLocaleNumber(scaledValue, locale)} ${unitPrefix}${unit}`;
};