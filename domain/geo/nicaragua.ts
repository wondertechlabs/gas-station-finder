type LatLng = { lat: number; lng: number };

/**
 * Bounding box aproximado de Nicaragua (suficiente para filtrar resultados).
 * Esto evita llamadas extra a Place Details (menos costo / menos latencia).
 */
export const NICARAGUA_BOUNDS = {
  minLat: 10.7,
  maxLat: 15.1,
  minLng: -87.8,
  maxLng: -82.6,
} as const;

export function isWithinNicaraguaBounds(location: LatLng): boolean {
  return (
    location.lat >= NICARAGUA_BOUNDS.minLat &&
    location.lat <= NICARAGUA_BOUNDS.maxLat &&
    location.lng >= NICARAGUA_BOUNDS.minLng &&
    location.lng <= NICARAGUA_BOUNDS.maxLng
  );
}
