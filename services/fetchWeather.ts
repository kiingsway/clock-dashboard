import { IWeather } from "@/types/weather.types";
import axios from "axios";

const api = {
  past_days: 1,
  timezone: "auto",
  daily: [
    "temperature_2m_max",
    "temperature_2m_min",
    "weather_code",
    "sunrise",
    "sunset",
  ],
  hourly: [
    "temperature_2m",
    "precipitation",
    "apparent_temperature",
    "weather_code",
    "is_day",
  ],
  current: [
    "temperature_2m",
    "apparent_temperature",
    "precipitation",
    "weather_code",
    "is_day",
  ],
};

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
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    past_days: String(api.past_days),
    daily: api.daily.join(","),
    hourly: api.hourly.join(","),
    current: api.current.join(","),
    timezone: api.timezone,
  });

  const url = `https://api.open-meteo.com/v1/forecast?${params}`;

  return (await axios.get<IWeather>(url)).data
}
