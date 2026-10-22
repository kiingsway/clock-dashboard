import { NextRequest, NextResponse } from "next/server";
import fetchUpstream, { getUpstreamError, LOCATIONS_REVALIDATE_SECONDS } from "../../fetchUpstream";

export async function GET(request: NextRequest) {

  const { searchParams } = new URL(request.url);

  const countryCode = searchParams.get("countryCode");

  if (!countryCode) {
    return NextResponse.json(
      { error: "Missing or invalid query." },
      { status: 400 }
    );
  }

  const params = new URLSearchParams({ fields: 'translations,name,flags' });

  const url = `https://countries.dev/alpha/${countryCode}?${params}`;

  try {
    const data = await fetchUpstream(url, { revalidate: LOCATIONS_REVALIDATE_SECONDS });

    return NextResponse.json(data, {
      status: 200,
      headers: {
        "Cache-Control": "s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch (e) {
    const { status, message } = getUpstreamError(e);

    return NextResponse.json(
      { error: "Failed to fetch countries.", message },
      { status }
    );
  }
}