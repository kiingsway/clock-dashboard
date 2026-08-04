import { TFunction } from 'i18next';

export function getRainIntensityLabel(rainMm: number, t: TFunction): string {
  if (rainMm <= 0) return t("weatherTexts.rain.dry");
  if (rainMm < 0.2) return t("weatherTexts.rain.trace");
  if (rainMm < 1.0) return t("weatherTexts.rain.drizzle");
  if (rainMm < 2.5) return t("weatherTexts.rain.light");
  if (rainMm < 7.5) return t("weatherTexts.rain.moderate");
  if (rainMm < 15) return t("weatherTexts.rain.heavy");
  return t("weatherTexts.rain.torrential");
}

export function getRainColor(rainMm: number): string {
  const maxRain = 20;
  const t = Math.pow(Math.min(Math.max(rainMm / maxRain, 0), 1), 0.6);

  const hue = 205 + (270 - 205) * t;
  const saturation = 90;
  const lightness = 72 - 22 * t;

  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}