import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { findNearbyGasStations } from '~/application/gasStation/findNearbyGasStations';
import { gasStationRepository } from '~/composition/gasStation';
import { MAP_CONFIG, QUERY_CONFIG } from '~/shared/constants';
import type { Coordinates, GasStation } from '~/domain/gasStation/models';
import { useCurrentLocation } from '~/presentation/stores/locationStore';

export const gasStationKeys = {
  all: ['gasStations'] as const,
  lists: () => [...gasStationKeys.all, 'list'] as const,
  list: (location: Coordinates | null) =>
    location
      ? ([
          ...gasStationKeys.lists(),
          location.latitude,
          location.longitude,
        ] as const)
      : ([...gasStationKeys.lists(), 'no-location'] as const),
} as const;

interface UseGasStationsReturn {
  gasStations: GasStation[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<unknown>;
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
