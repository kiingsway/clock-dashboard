import { IWeatherAlertCanada } from "@/types/weather.types";

export default async function fetchCanadaWeatherAlerts(
  lat: number,
  lon: number,
  radiusKm: number,
): Promise<IWeatherAlertCanada[]> {
  const res = await fetch(
    `/api/weather-alerts?lat=${lat}&lon=${lon}&radiusKm=${radiusKm}`,
  );

  if (!res.ok) {
    throw new Error("Failed to fetch weather alerts.");
  }

  return res.json();
}