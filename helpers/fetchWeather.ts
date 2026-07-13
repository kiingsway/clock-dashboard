import { IWeather } from "@/types/weather.types";
import axios from "axios";

const api = {
  daily: "temperature_2m_max,temperature_2m_min,weather_code,sunrise,sunset",
  hourly: "temperature_2m,precipitation,apparent_temperature,weather_code",
  current: "temperature_2m,apparent_temperature,precipitation,weather_code,is_day",
  timezone: "auto"
}


/**
 * Placeholder for the real weather request.
 *
 * Intentionally not wired to any provider, URL or API key yet — this is
 * only the seam the rest of the dashboard is built against. Swap the body
 * for a real `fetch`/`axios` call (e.g. to Open-Meteo) once an API is
 * chosen; the return type is already the shape every component expects.
*
* @param latitude  - Latitude of the location to fetch weather for.
* @param longitude - Longitude of the location to fetch weather for.
 */
export async function fetchWeather(
  latitude?: number,
  longitude?: number
): Promise<IWeather> {
  const url = 'https://api.open-meteo.com/v1/forecast?' +
    `latitude=${latitude}&` +
    `longitude=${longitude}&` +
    `daily=${api.daily}&` +
    `hourly=${api.hourly}&` +
    `current=${api.current}&` +
    `timezone=${api.timezone}`;

  return (await axios.get<IWeather>(url)).data
}
