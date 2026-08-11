interface RainData {
  hoursOfRain?: number;
  precipitationMm?: number;
  chanceMax?: number;
}

interface RainSummary {
  description: string;
  iconName:
    | 'umbrella-closed'
    | 'umbrella'
    | 'umbrella-wind'
    | 'umbrella-wind-alt';
}

export function getRainSummary({
  hoursOfRain = 0,
  precipitationMm = 0,
  chanceMax = 0,
}: RainData): RainSummary {
  const hoursPrefix =
    hoursOfRain > 0
      ? `${hoursOfRain}h de chuva no dia. `
      : '';

  // Sem chuva
  if (precipitationMm <= 0 && hoursOfRain <= 0) {
    return {
      description: 'Sem previsão de chuva. Pode sair tranquilo sem guarda-chuva.',
      iconName: 'umbrella-closed',
    };
  }

  // Garoa / chuva muito fraca
  if (precipitationMm < 1) {
    if (chanceMax < 30) {
      return {
        description: `${hoursPrefix}Possibilidade de chuva muito baixa.`,
        iconName: 'umbrella-closed',
      };
    }

    return {
      description: `${hoursPrefix}Possibilidade de garoa ou chuva fraca.`,
      iconName: 'umbrella',
    };
  }

  // Chuva leve
  if (precipitationMm < 5) {
    if (chanceMax < 30) {
      return {
        description: `${hoursPrefix}Possibilidade de chuva leve e passageira.`,
        iconName: 'umbrella',
      };
    }

    if (chanceMax < 60) {
      return {
        description: `${hoursPrefix}Chuva leve possível ao longo do dia.`,
        iconName: 'umbrella',
      };
    }

    return {
      description: `${hoursPrefix}Chuva leve prevista. É recomendável levar um guarda-chuva.`,
      iconName: 'umbrella',
    };
  }

  // Chuva moderada
  if (precipitationMm < 15) {
    if (chanceMax < 30) {
      return {
        description: `${hoursPrefix}Possibilidade de chuva moderada, embora a chance seja baixa.`,
        iconName: 'umbrella',
      };
    }

    if (chanceMax < 60) {
      return {
        description: `${hoursPrefix}Chuva moderada pode ocorrer ao longo do dia.`,
        iconName: 'umbrella',
      };
    }

    return {
      description: `${hoursPrefix}Chuva moderada prevista. Leve um guarda-chuva.`,
      iconName: 'umbrella',
    };
  }

  // Chuva forte
  if (precipitationMm < 30) {
    if (chanceMax < 30) {
      return {
        description: `${hoursPrefix}Possibilidade de chuva forte, embora a chance seja baixa.`,
        iconName: 'umbrella-wind',
      };
    }

    if (chanceMax < 60) {
      return {
        description: `${hoursPrefix}Chuva forte pode ocorrer ao longo do dia.`,
        iconName: 'umbrella-wind',
      };
    }

    return {
      description: `${hoursPrefix}Chuva forte prevista. Evite ficar exposto à chuva.`,
      iconName: 'umbrella-wind',
    };
  }

  // Chuva muito forte
  if (chanceMax < 30) {
    return {
      description: `${hoursPrefix}Possibilidade de chuva muito intensa, embora a chance seja baixa.`,
      iconName: 'umbrella-wind-alt',
    };
  }

  if (chanceMax < 60) {
    return {
      description: `${hoursPrefix}Chuva muito intensa pode ocorrer ao longo do dia.`,
      iconName: 'umbrella-wind-alt',
    };
  }

  return {
    description: `${hoursPrefix}Chuva muito intensa prevista. Se possível, evite sair.`,
    iconName: 'umbrella-wind-alt',
  };
}