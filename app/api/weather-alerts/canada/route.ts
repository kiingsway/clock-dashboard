import { NextRequest, NextResponse } from "next/server";
import { DateTime } from "luxon";
import { IWeatherAlertCanada } from "@/types/WeatherAlerts/canada.types";
import parseCoordinates, { roundCoordinates } from "@/utils/locations/parseCoordinates";
import fetchUpstream, { getUpstreamError } from "../../fetchUpstream";

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

  const { latitude, longitude } = roundCoordinates(coordinates);
  const bbox = kmToBoundingBox(latitude, longitude, radiusKm);

  const params = new URLSearchParams({
    f: "json",
    bbox: `${bbox.minLon},${bbox.minLat},${bbox.maxLon},${bbox.maxLat}`,
  });

  try {
    const data = await fetchUpstream(
      `https://api.weather.gc.ca/collections/weather-alerts/items?${params}`,
      { revalidate: 300 },
    ) as { features?: WeatherAlert[] };

    if (!Array.isArray(data?.features)) {
      throw new Error("Invalid weather alerts API response.");
    }

    // A expiração é filtrada a cada requisição, já que a resposta fica até 5 min em cache.
    const alerts = data.features.filter((item: WeatherAlert) => {
      const expires = item.properties.expiration_datetime;

      if (!expires) return true;

      const expiration = DateTime.fromISO(expires);

      return expiration.isValid && expiration > DateTime.now();
    }) as unknown as IWeatherAlertCanada[];

    return NextResponse.json(alerts, {
      headers: {
        "Cache-Control": "s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch (e) {
    const { status, message } = getUpstreamError(e);

    return NextResponse.json(
      { error: "Failed to fetch weather alerts.", message },
      { status }
    );
  }
}