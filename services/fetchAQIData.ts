import { IAQI } from "@/types/aqi.types";

/**
 * Placeholder for the real air quality index request.
*
* @param latitude  - Latitude of the location to fetch air quality index for.
* @param longitude - Longitude of the location to fetch air quality index for.
 */
export async function fetchAQIData(latitude: number, longitude: number): Promise<IAQI> {
  const res = await fetch(`/api/air-quality?latitude=${latitude}&longitude=${longitude}`);

  if (!res.ok) {
    const error = await res.json().catch(() => null);
    throw new Error(error?.message ?? error?.error ?? 'Failed to fetch air quality.');
  }

  return res.json();
}
