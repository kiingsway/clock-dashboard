export interface IPrecipChartData {
  key: string | number;
  hour: string;
  weatherCode: number;
  temp: number
  isDay: boolean;
  rain: number;
  showers: number;
  snowfall: number;
  windGusts: number
}

export interface IReferenceZone {
  value: number;
  color: string;
  label?: string;
}