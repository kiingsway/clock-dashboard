interface RainData {
  hoursOfRain?: number;
  precipitationMm?: number;
  chanceMax?: number;
}

export function getRainSummary({
  hoursOfRain = 0,
  precipitationMm = 0,
  chanceMax = 0,
}: RainData): string {
  const hoursPrefix =
    hoursOfRain > 0
      ? `${hoursOfRain}h de chuva no dia. `
      : '';

  // Sem precipitação prevista
  if (precipitationMm <= 0 && hoursOfRain <= 0) {
    return 'Sem previsão de chuva. Pode sair tranquilo sem guarda-chuva.';
  }

  // Volume muito baixo
  if (precipitationMm < 1) {
    if (chanceMax < 30) {
      return `${hoursPrefix}Possibilidade de chuva muito baixa.`;
    }

    return `${hoursPrefix}Possibilidade de garoa ou chuva fraca.`;
  }

  // Chuva leve
  if (precipitationMm < 5) {
    if (chanceMax < 30) {
      return `${hoursPrefix}Possibilidade de chuva leve e passageira.`;
    }

    if (chanceMax < 60) {
      return `${hoursPrefix}Chuva leve possível ao longo do dia.`;
    }

    return `${hoursPrefix}Chuva leve prevista. É recomendável levar um guarda-chuva.`;
  }

  // Chuva moderada
  if (precipitationMm < 15) {
    if (chanceMax < 30) {
      return `${hoursPrefix}Possibilidade de chuva moderada, embora a chance seja baixa.`;
    }

    if (chanceMax < 60) {
      return `${hoursPrefix}Chuva moderada pode ocorrer ao longo do dia.`;
    }

    return `${hoursPrefix}Chuva moderada prevista. Leve um guarda-chuva.`;
  }

  // Chuva forte
  if (precipitationMm < 30) {
    if (chanceMax < 30) {
      return `${hoursPrefix}Possibilidade de chuva forte, embora a chance seja baixa.`;
    }

    if (chanceMax < 60) {
      return `${hoursPrefix}Chuva forte pode ocorrer ao longo do dia.`;
    }

    return `${hoursPrefix}Chuva forte prevista. Evite ficar exposto à chuva.`;
  }

  // Volume muito alto
  if (chanceMax < 30) {
    return `${hoursPrefix}Possibilidade de chuva muito intensa, embora a chance seja baixa.`;
  }

  if (chanceMax < 60) {
    return `${hoursPrefix}Chuva muito intensa pode ocorrer ao longo do dia.`;
  }

  return `${hoursPrefix}Chuva muito intensa prevista. Se possível, evite sair.`;
}