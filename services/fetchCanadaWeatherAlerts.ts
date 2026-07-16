import { IWeatherAlert } from "@/types/weather.types";
import axios from "axios";
import { DateTime } from "luxon";

interface WeatherAlert {
  properties: {
    expiration_datetime?: string;
    [key: string]: unknown;
  };
}

export default async function fetchCanadaWeatherAlerts(lat: number, lon: number): Promise<IWeatherAlert[]> {
  const delta = 0.05;
  // const delta = 10;

  const url = "https://api.weather.gc.ca/collections/weather-alerts/items";

  const { data } = await axios.get(url, {
    params: {
      f: "json",
      bbox: `${lon - delta},${lat - delta},${lon + delta},${lat + delta}`,
    },
  });

  return data.features.filter((item: WeatherAlert) => {
    const expires = item.properties.expiration_datetime;

    if (!expires) return true;

    const expiration = DateTime.fromISO(expires);

    return expiration.isValid && expiration > DateTime.now();
  });
}