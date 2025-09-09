import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { GasStationService } from '~/services/gasStationService';
import { useGasStationStore } from '~/stores/gasStationStore';
import { useLocationStore } from '~/stores/locationStore';
import { MAP_CONFIG, QUERY_CONFIG } from '~/config/constants';

const GAS_STATION_QUERY_KEYS = {
  all: ['gasStations'] as const,
  nearby: (lat: number, lng: number) =>
    [...GAS_STATION_QUERY_KEYS.all, 'nearby', lat, lng] as const,
} as const;

export const useGasStations = () => {
  const { userLocation, selectedLocation } = useLocationStore();
  const { searchQuery } = useGasStationStore();

  // Usar ubicación seleccionada si existe, sino usar ubicación GPS
  const currentLocation = selectedLocation || userLocation;

  const {
    data: gasStations = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: currentLocation
      ? GAS_STATION_QUERY_KEYS.nearby(
          currentLocation.latitude,
          currentLocation.longitude,
        )
      : GAS_STATION_QUERY_KEYS.all,
    queryFn: async () => {
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
  });

  const filteredStations = useMemo(() => {
    if (!searchQuery.trim()) {
      return gasStations;
    }

    const query = searchQuery.toLowerCase();
    return gasStations.filter(
      (station) =>
        station.name.toLowerCase().includes(query) ||
        station.brand?.toLowerCase().includes(query) ||
        station.address.toLowerCase().includes(query),
    );
  }, [gasStations, searchQuery]);

  return {
    gasStations,
    filteredStations,
    isLoading,
    error,
    refetch,
  };
};
