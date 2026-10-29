import MapKitSearch, {
  MAPKIT_RESULT_LIMIT,
  MAPKIT_THROTTLED,
  type PointOfInterest,
} from '~/modules/mapkit-search';
import { NICARAGUA_BOUNDS } from '~/domain/geo/nicaragua';

interface Region {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

/**
 * En regiones más grandes que esto (~28 km), MapKit recorta los resultados por
 * relevancia aunque devuelva menos de 25, así que siempre se subdividen.
 * Medido: Matagalpa en 0.5° daba 24 y sus cuadrantes 42; en 0.25° ya cuadra.
 */
const COMPLETE_REGION_DELTA = 0.25;
/** Por debajo de este tamaño (~2 km) ya no se subdivide aunque esté saturada. */
const MIN_REGION_DELTA = 0.02;
/** Búsquedas simultáneas: MapKit permite ~50 por minuto. */
const CONCURRENCY = 4;
/** Espera tras un "throttled" de MapKit antes de reintentar la misma región. */
const THROTTLE_BACKOFF_MS = 20_000;
const MAX_THROTTLE_RETRIES = 6;

const NICARAGUA_REGION: Region = {
  latitude: (NICARAGUA_BOUNDS.minLat + NICARAGUA_BOUNDS.maxLat) / 2,
  longitude: (NICARAGUA_BOUNDS.minLng + NICARAGUA_BOUNDS.maxLng) / 2,
  latitudeDelta: NICARAGUA_BOUNDS.maxLat - NICARAGUA_BOUNDS.minLat,
  longitudeDelta: NICARAGUA_BOUNDS.maxLng - NICARAGUA_BOUNDS.minLng,
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const isThrottled = (error: unknown) =>
  (error as { code?: string } | null)?.code === MAPKIT_THROTTLED;

export function searchRegion(region: Region): Promise<PointOfInterest[]> {
  return MapKitSearch.searchGasStationsInRegion(
    region.latitude,
    region.longitude,
    region.latitudeDelta,
    region.longitudeDelta,
  );
}

async function searchWithRetry(region: Region): Promise<PointOfInterest[]> {
  for (let attempt = 0; ; attempt++) {
    try {
      return await searchRegion(region);
    } catch (error) {
      if (!isThrottled(error) || attempt >= MAX_THROTTLE_RETRIES) throw error;
      await sleep(THROTTLE_BACKOFF_MS);
    }
  }
}

function quadrants(region: Region): Region[] {
  const latitudeDelta = region.latitudeDelta / 2;
  const longitudeDelta = region.longitudeDelta / 2;

  return [-1, 1].flatMap((dLat) =>
    [-1, 1].map((dLng) => ({
      latitude: region.latitude + (dLat * latitudeDelta) / 2,
      longitude: region.longitude + (dLng * longitudeDelta) / 2,
      latitudeDelta,
      longitudeDelta,
    })),
  );
}

/**
 * Recorre todo Nicaragua con MapKit. Cada búsqueda devuelve máximo 25
 * resultados y en regiones grandes los recorta, así que el país se divide en
 * cuadrantes hasta que cada región es pequeña y no está saturada.
 *
 * `onProgress` recibe los resultados acumulados mientras avanza el barrido.
 */
export async function sweepNicaragua(
  onProgress?: (stations: PointOfInterest[]) => void,
): Promise<PointOfInterest[]> {
  const found = new Map<string, PointOfInterest>();
  const queue: Region[] = [NICARAGUA_REGION];

  const worker = async () => {
    while (queue.length > 0) {
      const region = queue.shift()!;
      const results = await searchWithRetry(region);
      for (const poi of results) found.set(poi.id, poi);

      const isLarge =
        Math.max(region.latitudeDelta, region.longitudeDelta) >
        COMPLETE_REGION_DELTA;
      const shouldSplit = isLarge
        ? results.length > 0 // vacía de verdad (lago, mar): no se explora más
        : results.length >= MAPKIT_RESULT_LIMIT &&
          region.latitudeDelta / 2 >= MIN_REGION_DELTA;
      if (shouldSplit) queue.push(...quadrants(region));
      onProgress?.([...found.values()]);
    }
  };

  // Los workers terminan cuando la cola se vacía; uno que termina antes
  // puede dejar trabajo nuevo, así que se repite hasta agotarla.
  while (queue.length > 0) {
    await Promise.all(Array.from({ length: CONCURRENCY }, worker));
  }

  return [...found.values()];
}
