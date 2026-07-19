export type BeaufortLevel = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export interface BeaufortResult {
  level: BeaufortLevel;
  description: string;
}

/**
 * Converte a velocidade do vento em km/h para a Escala Beaufort (0-12)
 * @param speedKmH Velocidade média contínua do vento em km/h
 */
export default function getBeaufortScale(speedKmH: number): BeaufortResult {
  if (speedKmH < 1)   return { level: 0, description: "Calmo" };
  if (speedKmH < 6)   return { level: 1, description: "Aragem" };
  if (speedKmH < 12)  return { level: 2, description: "Brisa leve" };
  if (speedKmH < 20)  return { level: 3, description: "Brisa fraca" };
  if (speedKmH < 29)  return { level: 4, description: "Brisa moderada" };
  if (speedKmH < 39)  return { level: 5, description: "Brisa forte" };
  if (speedKmH < 50)  return { level: 6, description: "Vento fresco" };
  if (speedKmH < 62)  return { level: 7, description: "Vento forte" };
  if (speedKmH < 75)  return { level: 8, description: "Ventania" };
  if (speedKmH < 89)  return { level: 9, description: "Ventania forte" };
  if (speedKmH < 103) return { level: 10, description: "Tempestade" };
  if (speedKmH < 118) return { level: 11, description: "Tempestade violenta" };
  
  return { level: 12, description: "Furacão" };
}