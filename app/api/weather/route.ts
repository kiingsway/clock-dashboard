import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { IWeather } from "@/types/weather.types";
import { getMoonDays } from "./getMoonDays";
import { DateTime } from "luxon";

const api = {
  past_days: 1,
  timezone: "auto",
  forecast_days: 14,
  daily: [
    "temperature_2m_max",
    "temperature_2m_min",
    "weather_code",
    "sunrise",
    "sunset",
    "uv_index_max",
    "wind_gusts_10m_mean",
    "wind_speed_10m_mean",
    "wind_direction_10m_dominant",
    "apparent_temperature_mean",
    "temperature_2m_mean",
    "precipitation_sum",
    "precipitation_hours",
    "precipitation_probability_max",
  ],
  hourly: [
    "temperature_2m",
    "precipitation",
    "apparent_temperature",
    "weather_code",
    "is_day",
    "wind_speed_10m",
    "wind_direction_10m",
    "wind_gusts_10m",
    "visibility",
    "uv_index",
  ],
  current: [
    "temperature_2m",
    "apparent_temperature",
    "precipitation",
    "weather_code",
    "is_day",
  ],
};

const getParams = (latitude: number, longitude: number) =>
  new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    past_days: String(api.past_days),
    forecast_days: String(api.forecast_days),
    daily: api.daily.join(","),
    hourly: api.hourly.join(","),
    current: api.current.join(","),
    timezone: api.timezone,
  });

type TApiWeather = Promise<
  NextResponse<IWeather | {
    error: string;
    message?: string;
  }>>

export async function GET(request: NextRequest): TApiWeather {
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

  const url = `https://api.open-meteo.com/v1/forecast?${params}`;

  try {
    const { data: weather } = await axios.get<IWeather>(url);

    const daily_moon = getMoonDays({
      latitude,
      longitude,
      timezone: weather.timezone,
      startDate: DateTime.now().setZone(weather.timezone),
    });

    return NextResponse.json({ ...weather, daily_moon }, {
      status: 200,
      headers: {
        "Cache-Control": "s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch (e) {
    return NextResponse.json(
      { error: "Failed to fetch weather.", message: String(e) },
      { status: 500 }
    );
  }
}