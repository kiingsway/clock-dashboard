import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { DateTime } from "luxon";
import { IWeatherAlertCanada } from "@/types/WeatherAlerts/canada.types";
import parseCoordinates from "@/utils/locations/parseCoordinates";

interface WeatherAlert {
  properties: {
    expiration_datetime?: string;
    [key: string]: unknown;
  };
}

function kmToBoundingBox(lat: number, lon: number, radiusKm: number) {
  const latDelta = radiusKm / 111.32;
  const lonDelta = radiusKm / (111.32 * Math.cos((lat * Math.PI) / 180));

  return {
    minLat: lat - latDelta,
    maxLat: lat + latDelta,
    minLon: lon - lonDelta,
    maxLon: lon + lonDelta,
  };
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const coordinates = parseCoordinates(searchParams.get("lat"), searchParams.get("lon"));
  const radiusKm = Number(searchParams.get("radiusKm") ?? 5);

  if (!coordinates || !Number.isFinite(radiusKm) || radiusKm <= 0) {
    return NextResponse.json(
      { error: "Invalid lat, lon or radiusKm." },
      { status: 400 }
    );
  }

  const bbox = kmToBoundingBox(coordinates.latitude, coordinates.longitude, radiusKm);

  try {
    const { data } = await axios.get("https://api.weather.gc.ca/collections/weather-alerts/items", {
      params: {
        f: "json",
        bbox: `${bbox.minLon},${bbox.minLat},${bbox.maxLon},${bbox.maxLat}`,
      },
      timeout: 15_000,
    });

    const alerts: IWeatherAlertCanada[] = data.features.filter((item: WeatherAlert) => {
      const expires = item.properties.expiration_datetime;

      if (!expires) return true;

      const expiration = DateTime.fromISO(expires);

      return expiration.isValid && expiration > DateTime.now();
    });

    return NextResponse.json(alerts, {
      headers: {
        "Cache-Control": "s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch (e) {
    return NextResponse.json(
      { error: `Failed to fetch weather alerts. ${String(e)}` },
      { status: 500 }
    );
  }
}