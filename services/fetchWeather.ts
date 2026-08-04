import { IWeather } from "@/types/weather.types";

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
export async function fetchWeather(latitude: number, longitude: number): Promise<IWeather> {
  const res = await fetch(`/api/weather?latitude=${latitude}&longitude=${longitude}`);

  if (!res.ok) throw new Error("Failed to fetch weather.");

  return res.json();
}
