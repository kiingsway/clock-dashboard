import { NextRequest, NextResponse } from "next/server";
import { isValidLocationArray } from "@/utils/locations/isValidLocationObject";
import fetchUpstream, { getUpstreamError, LOCATIONS_REVALIDATE_SECONDS } from "../../fetchUpstream";
import parseCoordinates from "@/utils/locations/parseCoordinates";

export async function GET(request: NextRequest) {

  const { searchParams } = new URL(request.url);

  const coordinates = parseCoordinates(searchParams.get("lat"), searchParams.get("lon"));

  if (!coordinates) {
    return NextResponse.json(
      { error: "Missing or invalid query." },
      { status: 400 }
    );
  }

  const params = new URLSearchParams({
    lat: String(coordinates.latitude),
    lng: String(coordinates.longitude),
  });

  const url = `https://countries.dev/cities/near?${params}`;

  try {
    const data = await fetchUpstream(url, { revalidate: LOCATIONS_REVALIDATE_SECONDS });

    if (!isValidLocationArray(data)) {
      throw new Error(`Invalid near locations API response. ${JSON.stringify(data)}`);
    }

    return NextResponse.json(data, {
      status: 200,
      headers: {
        "Cache-Control": "s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch (e) {
    const { status, message } = getUpstreamError(e);

    return NextResponse.json(
      { error: "Failed to fetch near locations.", message },
      { status }
    );
  }
}