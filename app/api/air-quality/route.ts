import { NextRequest, NextResponse } from "next/server";
import isValidAirQualityData from "./isValidAirQualityData";
import { IAQI } from "@/types/aqi.types";
import parseCoordinates, { roundCoordinates } from "@/utils/locations/parseCoordinates";
import fetchUpstream, { getUpstreamError } from "../fetchUpstream";

// https://air-quality-api.open-meteo.com/v1/air-quality?latitude=52.52&longitude=13.41&current=european_aqi,us_aqi,pm10,pm2_5,ozone,nitrogen_dioxide,sulphur_dioxide,carbon_monoxide,dust

const api = {
  current: [
    'european_aqi',
    'us_aqi',
    'pm10',
    'pm2_5',
    'ozone',
    'nitrogen_dioxide',
    'sulphur_dioxide',
    'carbon_monoxide',
    'dust',
  ],
} as const;

const getParams = (latitude: number, longitude: number) =>
  new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    current: api.current.join(","),
  });

type TApiAQI = Promise<
  NextResponse<IAQI | {
    error: string;
    message?: string;
  }>>

export async function GET(request: NextRequest): TApiAQI {
  const { searchParams } = new URL(request.url);

  const coordinates = parseCoordinates(searchParams.get("latitude"), searchParams.get("longitude"));

  if (!coordinates) {
    return NextResponse.json(
      { error: "Missing or invalid latitude/longitude." },
      { status: 400 }
    );
  }

  const { latitude, longitude } = roundCoordinates(coordinates);

  const params = getParams(latitude, longitude);

  const url = `https://air-quality-api.open-meteo.com/v1/air-quality?${params}`;

  try {
    const airQualityData = await fetchUpstream(url, { revalidate: 300 });

    if (!isValidAirQualityData(airQualityData)) {
      throw new Error(`Invalid air quality API response. ${JSON.stringify(airQualityData)}`);
    }

    return NextResponse.json(airQualityData, {
      status: 200,
      headers: {
        "Cache-Control": "s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch (e) {
    const { status, message } = getUpstreamError(e);

    return NextResponse.json(
      {
        error: "Failed to fetch air quality.",
        message,
      },
      { status }
    );
  }
}
