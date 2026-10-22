import { NextRequest, NextResponse } from "next/server";
import { IWeather } from "@/types/weather.types";
import { DateTime } from "luxon";
import getMoonDays from "./getMoonDays";
import isValidWeather from "./isValidWeather";
import parseCoordinates, { roundCoordinates } from "@/utils/locations/parseCoordinates";
import fetchUpstream, { getUpstreamError } from "../fetchUpstream";

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
    "relative_humidity_2m_mean",
    "dew_point_2m_mean",
    "daylight_duration",
    "sunshine_duration",
    "visibility_mean",
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
    "rain",
    "showers",
    "snowfall",
    "relative_humidity_2m",
    "dew_point_2m",
  ],
  current: [
    "temperature_2m",
    "apparent_temperature",
    "precipitation",
    "weather_code",
    "is_day",
    "rain",
    "showers",
    "snowfall",
    "surface_pressure",
  ],
} as const;

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

  const coordinates = parseCoordinates(searchParams.get("latitude"), searchParams.get("longitude"));

  if (!coordinates) {
    return NextResponse.json(
      { error: "Missing or invalid latitude/longitude." },
      { status: 400 }
    );
  }

  const { latitude, longitude } = roundCoordinates(coordinates);

  const params = getParams(latitude, longitude);

  const url = `https://api.open-meteo.com/v1/forecast?${params}`;

  try {
    const weather = await fetchUpstream(url, { revalidate: 300 });

    if (!isValidWeather(weather)) {
      throw new Error(`Invalid weather API response. ${JSON.stringify(weather)}`);
    }

    // Mesmo intervalo de `daily` (inclui os dias passados), para a DailySheet de ontem ter dados da lua.
    const daily_moon = getMoonDays({
      lat: latitude,
      lon: longitude,
      timezone: weather.timezone,
      startDate: DateTime.now().setZone(weather.timezone).minus({ days: api.past_days }),
      days: api.past_days + api.forecast_days,
    });

    return NextResponse.json({ ...weather, daily_moon }, {
      status: 200,
      headers: {
        "Cache-Control": "s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch (e) {
    const { status, message } = getUpstreamError(e);

    return NextResponse.json(
      {
        error: "Failed to fetch weather.",
        message,
      },
      { status }
    );
  }
}