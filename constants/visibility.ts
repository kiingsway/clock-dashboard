export const MIN_VISIBILITY_METERS = 1;
export const MAX_VISIBILITY_METERS = 24140; // Teto padrão do modelo de visibilidade do Open-Meteo

export const VISIBILITY_COLORS = [
  { value: 0, hex: "#6E5033" }, // Crítico
  { value: 500, hex: "#9E7B56" }, // Névoa intensa
  { value: 1000, hex: "#C4A482" }, // Baixa
  { value: 2000, hex: "#D9C3A5" }, // Moderada
  { value: 5000, hex: "#EADCC9" }, // Boa
  { value: 10000, hex: "#F5F0E6" }  // Excelente
];