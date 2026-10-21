interface ICoordinates {
  latitude: number;
  longitude: number;
}

/**
 * Converte os parâmetros de latitude/longitude da query em números.
 * Retorna null se estiverem ausentes, não forem números finitos
 * ou estiverem fora dos limites (±90 / ±180).
 */
export default function parseCoordinates(lat: string | null, lon: string | null): ICoordinates | null {
  // Number(null) e Number('') resultam em 0, então ausentes precisam ser checados antes.
  if (!lat?.trim() || !lon?.trim()) return null;

  const latitude = Number(lat);
  const longitude = Number(lon);

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return null;

  if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) return null;

  return { latitude, longitude };
}
