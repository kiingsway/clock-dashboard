const UPSTREAM_TIMEOUT_MS = 15_000;

/** Cities and countries barely change, so location lookups can be cached for a day. */
export const LOCATIONS_REVALIDATE_SECONDS = 86_400;

export class UpstreamError extends Error {
  constructor(message: string, public readonly status: number) {
    super(message);
  }
}

interface Options {
  /** Seconds the response stays in Next.js' server cache, shared by every user. */
  revalidate: number;
  headers?: HeadersInit;
}

/**
 * GET to an external API, cached on the server (`next.revalidate`) and with a timeout.
 * Throws `UpstreamError` with the upstream status when the response is not ok.
 */
export default async function fetchUpstream(url: string, { revalidate, headers }: Options): Promise<unknown> {
  const response = await fetch(url, {
    headers,
    signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
    next: { revalidate },
  });

  if (!response.ok) {
    throw new UpstreamError(`Upstream returned status ${response.status}.`, response.status);
  }

  return response.json();
}

/** Status and message to send back to the client for an error thrown while calling upstream. */
export function getUpstreamError(e: unknown): { status: number; message: string } {
  if (e instanceof UpstreamError) return { status: e.status, message: e.message };
  if (e instanceof Error) return { status: e.name === 'TimeoutError' ? 504 : 500, message: e.message };
  return { status: 500, message: String(e) };
}
