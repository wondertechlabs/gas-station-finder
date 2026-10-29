import type { PointOfInterest } from '~/modules/mapkit-search';
import type {
  FindNearbyGasStationsParams,
  GasStationRepository,
} from '~/domain/gasStation/repository';
import type { Coordinates, GasStation } from '~/domain/gasStation/models';
import {
  determineBrand,
  estimateFuelPrices,
} from '~/domain/gasStation/pricing';
import { distanceInMeters } from '~/domain/geo/distance';
import {
  departmentFromName,
  nearestDepartment,
} from '~/domain/location/departments';
import { isWithinNicaraguaBounds } from '~/domain/geo/nicaragua';
import { storage } from '~/infrastructure/storage/mmkv';
import { searchRegion, sweepNicaragua } from './nicaraguaSweep';

const CACHE_KEY = 'mapkit-nicaragua-gas-stations-v4';
/** Las gasolineras casi no cambian: el barrido nacional se repite cada semana. */
const CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000;
/** Región de la búsqueda rápida alrededor del usuario (~20 km). */
const NEARBY_DELTA = 0.2;
/** Cada cuántas búsquedas del barrido se avisa a la UI con resultados parciales. */
const PROGRESS_EVERY = 8;

interface CachedSweep {
  savedAt: number;
  stations: PointOfInterest[];
}

function readCache(): PointOfInterest[] | null {
  const raw = storage.getString(CACHE_KEY);
  if (!raw) return null;
  try {
    const cached = JSON.parse(raw) as CachedSweep;
    return Date.now() - cached.savedAt < CACHE_TTL_MS ? cached.stations : null;
  } catch {
    return null;
  }
}

function toGasStation(place: PointOfInterest, origin: Coordinates): GasStation {
  const brand = determineBrand(place.name);
  const coordinates = { latitude: place.latitude, longitude: place.longitude };

  return {
    id: place.id,
    name: place.name,
    brand,
    address: place.address ?? 'Dirección no disponible',
    coordinates,
    department:
      departmentFromName(place.administrativeArea) ??
      nearestDepartment(coordinates),
    fuelTypes: estimateFuelPrices(brand),
    amenities: [],
    distance: distanceInMeters(origin, coordinates),
  };
}

/**
 * Gasolineras de todo Nicaragua vía MapKit (sin API key).
 *
 * La primera vez muestra al instante las cercanas y recorre el país en segundo
 * plano (MapKit limita ~50 búsquedas por minuto, así que tarda). El resultado se
 * guarda en MMKV una semana. MapKit no expone rating, horario ni servicios.
 */
export class MapKitGasStationRepository implements GasStationRepository {
  private sweep: Promise<void> | null = null;
  private partial: PointOfInterest[] = [];
  private listeners = new Set<() => void>();

  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  // El radio se ignora: siempre se devuelve todo el país, ordenado por distancia.
  async findNearby(params: FindNearbyGasStationsParams): Promise<GasStation[]> {
    const origin = { latitude: params.latitude, longitude: params.longitude };

    const cached = readCache();
    if (cached) return this.toSortedStations(cached, origin);

    this.startSweep();
    const nearby = await searchRegion({
      ...origin,
      latitudeDelta: NEARBY_DELTA,
      longitudeDelta: NEARBY_DELTA,
    }).catch(() => [] as PointOfInterest[]);

    return this.toSortedStations([...this.partial, ...nearby], origin);
  }

  private startSweep() {
    if (this.sweep) return;

    let progressCount = 0;
    this.sweep = sweepNicaragua((stations) => {
      this.partial = stations;
      if (++progressCount % PROGRESS_EVERY === 0) this.notify();
    })
      .then((stations) => {
        const cache: CachedSweep = { savedAt: Date.now(), stations };
        storage.set(CACHE_KEY, JSON.stringify(cache));
        this.partial = [];
        this.notify();
      })
      // Si falla, el próximo findNearby vuelve a intentarlo.
      .catch((error) => {
        if (__DEV__) console.warn('Barrido de MapKit falló', error);
      })
      .finally(() => {
        this.sweep = null;
      });
  }

  private notify() {
    for (const listener of this.listeners) listener();
  }

  private toSortedStations(
    places: PointOfInterest[],
    origin: Coordinates,
  ): GasStation[] {
    const unique = new Map(places.map((place) => [place.id, place]));
    return (
      [...unique.values()]
        // El rectángulo de Nicaragua toca Honduras y Costa Rica: se usa el país de MapKit.
        .filter((place) =>
          place.countryCode
            ? place.countryCode === 'NI'
            : isWithinNicaraguaBounds({
                lat: place.latitude,
                lng: place.longitude,
              }),
        )
        .map((place) => toGasStation(place, origin))
        .sort((a, b) => (a.distance ?? 0) - (b.distance ?? 0))
    );
  }
}
