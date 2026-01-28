import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { GasStationService } from '~/services/gasStationService';
import { useSearchQuery } from '~/stores/gasStationStore';
import { useCurrentLocation } from '~/stores/locationStore';
import { MAP_CONFIG, QUERY_CONFIG } from '~/config/constants';
import { GasStation, Coordinates } from '~/types/gasStation';

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
  nearby: (lat: number, lng: number, radius: number) =>
    [...gasStationKeys.all, 'nearby', lat, lng, radius] as const,
} as const;

interface UseGasStationsReturn {
  gasStations: GasStation[];
  filteredStations: GasStation[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

export const useGasStations = (): UseGasStationsReturn => {
  const currentLocation = useCurrentLocation();
  const searchQuery = useSearchQuery();

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
      return GasStationService.findNearby(
        currentLocation.latitude,
        currentLocation.longitude,
        MAP_CONFIG.DEFAULT_RADIUS,
      );
    },
    enabled: !!currentLocation,
    staleTime: QUERY_CONFIG.STALE_TIME,
    gcTime: QUERY_CONFIG.GC_TIME,
    retry: QUERY_CONFIG.RETRY_ATTEMPTS,
    retryDelay: QUERY_CONFIG.RETRY_DELAY,
    networkMode: 'online',
  });

  const filteredStations = useMemo(() => {
    if (!searchQuery.trim()) {
      return gasStations;
    }

    const query = searchQuery.toLowerCase().trim();
    return gasStations.filter(
      (station): boolean =>
        station.name.toLowerCase().includes(query) ||
        station.brand?.toLowerCase().includes(query) ||
        station.address.toLowerCase().includes(query),
    );
  }, [gasStations, searchQuery]);

  return {
    gasStations,
    filteredStations,
    isLoading,
    error: error as Error | null,
    refetch,
  };
};
