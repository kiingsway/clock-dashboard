import { LOCATION_TO_WEATHER } from "@/constants/locations";
import { TLocation, IWeatherLocationItem } from "@/types/location.types";
import { TFunction } from "i18next";

/**
 * Returns the weather locations with translated display names.
 *
 * The base location data is stored in `LOCATION_TO_WEATHER` without the `name`
 * property to keep it static and avoid recreating the object. This function
 * adds the localized `name` using the provided i18next translation function.
 *
 * Translation keys follow the pattern:
 * `cities.<id>` (e.g. `cities.Toronto`, `cities.Sao_Paulo`).
 *
 * If no translation function is provided, the city `id` is used as a fallback,
 * replacing underscores with spaces.
 */
export function getLocationToWeather(t?: TFunction): Record<TLocation, IWeatherLocationItem> {
  return Object.fromEntries(
    Object.entries(LOCATION_TO_WEATHER).map(([timezone, location]) => [
      timezone,
      {
        ...location,
        name: t?.(`cities.${location.id}`) ?? location.id.replace(/_/g, " "),
      },
    ]),
  ) as Record<TLocation, IWeatherLocationItem>;
}