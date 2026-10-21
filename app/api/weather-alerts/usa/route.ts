import { NextRequest, NextResponse } from "next/server";
import parseCoordinates from "@/utils/locations/parseCoordinates";

const NWS_API = "https://api.weather.gov";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const coordinates = parseCoordinates(searchParams.get("lat"), searchParams.get("lon"));

  if (!coordinates) {
    return NextResponse.json(
      {
        error: "Invalid coordinates.",
        message: "Parameters 'lat' and 'lon' must be valid numbers, with latitude between -90 and 90 and longitude between -180 and 180.",
      },
      { status: 400 }
    );
  }

  const { latitude: lat, longitude: lon } = coordinates;

  try {
    const res = await fetch(
      `${NWS_API}/alerts/active?point=${lat},${lon}`,
      {
        headers: {
          Accept: "application/geo+json",
          "User-Agent": "clock-dashboard/1.0",
        },
        next: {
          revalidate: 300,
        },
      }
    );

    if (!res.ok) {
      let message = `NWS API returned status ${res.status}.`;

      try {
        const errorData = await res.json();

        if (errorData?.detail) message = errorData.detail;
      } catch {
        // Ignore invalid error response.
      }

      return NextResponse.json(
        {
          error: "Failed to fetch weather alerts.",
          message,
        },
        { status: res.status >= 400 && res.status < 600 ? res.status : 502 }
      );
    }

    const data = await res.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error("NWS weather alerts error:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch weather alerts.",
        message: error instanceof Error
          ? error.message
          : "Unknown error.",
      },
      { status: 500 }
    );
  }
}