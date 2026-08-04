export type TLocation =
  | 'America/Toronto'
  | 'America/Sao_Paulo'
  | 'Asia/Seoul'
  | 'America/New_York'
  | 'America/Bogota'
  | 'America/Panama'
  | 'America/Vancouver'
  | 'Pacific/Guadalcanal';

export interface IWeatherLocationItem {
  id: string;
  name: string;
  lat: number;
  lon: number;
  country?: "CA" | "BR";
  province?: "ON" | "BC"
}