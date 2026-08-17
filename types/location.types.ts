export type TLocation =
  | 'America/Toronto'
  | 'America/Sao_Paulo'
  | 'Asia/Seoul'
  | 'America/New_York'
  | 'America/Chicago'
  | 'America/Bogota'
  | 'America/Panama'
  | 'America/Vancouver'
  | 'Pacific/Guadalcanal';

export type IWeatherCountry = "CA" | "BR" | "US"

export interface IWeatherLocationItem {
  id: string;
  name: string;
  lat: number;
  lon: number;
  country?: IWeatherCountry;
  province?: string
}