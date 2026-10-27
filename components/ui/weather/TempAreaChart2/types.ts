import { WeatherCategoryName } from "@/types/weather.types";

export interface IWeatherDataChart {
  x: number;
  xLabel: string;
  time: string;
  category: WeatherCategoryName;
  weatherCode: number;
  /** Código para desenhar o ícone; só existe quando a categoria muda em relação à hora anterior */
  code: number | undefined;
  temp: number;
  feelsLike: number;
  isDay: boolean;
  rain: number;
  showers: number;
  snowfall: number;
  gusts: number;
}

export interface ISunEventChart {
  x: number;
  time: string;
  event: 'sunrise' | 'sunset';
}
