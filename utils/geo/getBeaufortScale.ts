/**
 * Converte a velocidade do vento em km/h para a Escala Beaufort (0-12)
 * @param speedKmH Velocidade média contínua do vento em km/h
 */
export default function getBeaufortScale(speedKmH: number): number {
  if (speedKmH < 1) return 0;
  if (speedKmH < 6) return 1;
  if (speedKmH < 12) return 2;
  if (speedKmH < 20) return 3;
  if (speedKmH < 29) return 4;
  if (speedKmH < 39) return 5;
  if (speedKmH < 50) return 6;
  if (speedKmH < 62) return 7;
  if (speedKmH < 75) return 8;
  if (speedKmH < 89) return 9;
  if (speedKmH < 103) return 10;
  if (speedKmH < 118) return 11;
  return 12;
}