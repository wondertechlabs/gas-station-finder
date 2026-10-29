import { useEffect } from 'react';
import {
  keepPreviousData,
  useQuery,
  type QueryObserverResult,
} from '@tanstack/react-query';
import { findNearbyGasStations } from '~/application/gasStation/findNearbyGasStations';
import { gasStationRepository } from '~/composition/gasStation';
import { MAP_CONFIG, QUERY_CONFIG } from '~/shared/constants';
import type { Coordinates, GasStation } from '~/domain/gasStation/models';
import { useCurrentLocation } from '~/presentation/stores/locationStore';

// ~1 km: cada lectura del GPS varía en los últimos decimales; sin redondear,
// la clave cambia en cada arranque y el caché persistido nunca se reutiliza.
const roundForKey = (value: number) => Math.round(value * 100) / 100;

export const gasStationKeys = {
  all: ['gasStations'] as const,
  lists: () => [...gasStationKeys.all, 'list'] as const,
  list: (location: Coordinates | null) =>
    location
      ? ([
          ...gasStationKeys.lists(),
          roundForKey(location.latitude),
          roundForKey(location.longitude),
        ] as const)
      : ([...gasStationKeys.lists(), 'no-location'] as const),
} as const;

interface UseGasStationsReturn {
  gasStations: GasStation[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<QueryObserverResult<GasStation[]>>;
}

export const useGasStations = (): UseGasStationsReturn => {
  const currentLocation = useCurrentLocation();

  const {
    data: gasStations = [],
    isLoading,
    error,
    refetch,
  } = useQuery<GasStation[]>({
    queryKey: gasStationKeys.list(currentLocation),
    queryFn: async (): Promise<GasStation[]> => {
      if (!currentLocation) {
        throw new Error('Ubicación no disponible');
      }

      return findNearbyGasStations(gasStationRepository, {
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        radius: MAP_CONFIG.DEFAULT_RADIUS,
      });
    },
    enabled: !!currentLocation,
    // Al cambiar de ciudad se mantiene la lista anterior en vez de un spinner.
    placeholderData: keepPreviousData,
    staleTime: QUERY_CONFIG.STALE_TIME,
    gcTime: QUERY_CONFIG.GC_TIME,
    retry: QUERY_CONFIG.RETRY_ATTEMPTS,
    retryDelay: QUERY_CONFIG.RETRY_DELAY,
    networkMode: 'online',
  });

  // Recarga cuando el repositorio termina de traer datos en segundo plano
  // (en iOS, el barrido de todo el país con MapKit).
  useEffect(() => gasStationRepository.subscribe?.(() => refetch()), [refetch]);

  return {
    gasStations,
    isLoading,
    error: error as Error | null,
    refetch,
  };
};
