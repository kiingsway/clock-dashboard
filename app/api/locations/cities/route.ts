import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import { isValidLocationArray } from "@/utils/locations/isValidLocationObject";

export async function GET(request: NextRequest) {

  const { searchParams } = new URL(request.url);

  const query = searchParams.get("q");

  if (!query) {
    return NextResponse.json(
      { error: "Missing or invalid query." },
      { status: 400 }
    );
  }

  const params = new URLSearchParams({
    q: query,
    fields: "name,countryCode,latitude,longitude,population,timezone"
  });

  const url = `https://countries.dev/cities?${params}`;

  try {
    const { data } = await axios.get(url, { timeout: 15_000 });

    if (!isValidLocationArray(data)) {
      throw new Error(`Invalid locations API response. ${JSON.stringify(data)}`);
    }

    return NextResponse.json(data, {
      status: 200,
      headers: {
        "Cache-Control": "s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch (e) {

    const [message, status] = (() => {
      if (axios.isAxiosError(e)) return [e.message, e.status ?? 500];
      if (e instanceof Error) return [e.message, 500];
      return [String(e), 500];
    })();

    return NextResponse.json(
      { error: "Failed to fetch locations.", message },
      { status }
    );
  }
}