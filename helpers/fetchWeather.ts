import axios from "axios";
import type { WeatherData } from "../types/weather.types";

const url = "https://api.open-meteo.com/v1/forecast?latitude=43.7064&longitude=-79.3986&daily=temperature_2m_max,temperature_2m_min,weather_code&hourly=temperature_2m,precipitation,apparent_temperature,weather_code&current=temperature_2m,apparent_temperature,precipitation,weather_code,is_day&timezone=auto"

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
): Promise<WeatherData> {
  // eslint-disable-next-line no-console
  // console.debug("fetchWeather called with", { latitude, longitude });
  // throw new Error("Not implemented.");

  const axiosData = await axios.get<WeatherData>(url);

  console.log("axiosData", axiosData);

  return axiosData.data
}
