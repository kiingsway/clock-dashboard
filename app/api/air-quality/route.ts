import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import isValidAirQualityData from "./isValidAirQualityData";
import { IAQI } from "@/types/aqi.types";

// https://air-quality-api.open-meteo.com/v1/air-quality?latitude=52.52&longitude=13.41&hourly=european_aqi,us_aqi&current=european_aqi,us_aqi,pm10,pm2_5,ozone,nitrogen_dioxide,sulphur_dioxide,carbon_monoxide,dust&past_days=1

const api = {
  past_days: 1,
  timezone: "auto",
  forecast_days: 3,
  hourly: [
    "european_aqi",
    "us_aqi",
  ],
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
    past_days: String(api.past_days),
    forecast_days: String(api.forecast_days),
    hourly: api.hourly.join(","),
    current: api.current.join(","),
  });

type TApiAQI = Promise<
  NextResponse<IAQI | {
    error: string;
    message?: string;
  }>>

export async function GET(request: NextRequest): TApiAQI {
  const { searchParams } = new URL(request.url);

  const latitude = Number(searchParams.get("latitude"));
  const longitude = Number(searchParams.get("longitude"));

  if (Number.isNaN(latitude) || Number.isNaN(longitude)) {
    return NextResponse.json(
      { error: "Missing or invalid latitude/longitude." },
      { status: 400 }
    );
  }

  const params = getParams(latitude, longitude);

  const url = `https://air-quality-api.open-meteo.com/v1/air-quality?${params}`;

  try {
    const { data: airQualityData } = await axios.get<IAQI>(url, {
      timeout: 15_000,
    });

    if (!isValidAirQualityData(airQualityData)) {
      throw new Error(`Invalid weather API response. ${JSON.stringify(airQualityData)}`);
    }

    return NextResponse.json(airQualityData, {
      status: 200,
      headers: {
        "Cache-Control": "s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch (e) {
    const message = axios.isAxiosError(e)
      ? e.message
      : e instanceof Error
        ? e.message
        : String(e);

    return NextResponse.json(
      {
        error: "Failed to fetch weather.",
        message,
      },
      { status: 500 }
    );
  }
}